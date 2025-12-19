import React, { useCallback, useMemo, useRef } from "react";
import { Grid, IconButton, Tooltip } from "@mui/material";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
//import "ag-grid-community/styles/ag-grid.css";
//import "ag-grid-community/styles/ag-theme-quartz.css";
import { DinamicTableProps } from "./types";
import useDinamicTableMejorada from "./useDinamicTable";
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
import "./style.scss";
import SearchFiltro from "../../components/SearchFiltro/SearchFiltro";
import { themeQuartz } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

const DinamicTableMejorada: React.FC<DinamicTableProps> = (props: DinamicTableProps) => {
  const pagination = true;
  const paginationPageSize = 10;
  const paginationPageSizeSelector = [10, 20, 1000];
  const {
    columns,
    handleExportarExcel,
    darkMode,
    localeText,
    handleFiltro,
    data,
    gridRef,
    imagenModal,
    setImagenModal,
    handleImageClick,
  } = useDinamicTableMejorada(props);

  // Agregar callback onGridReady
  const onGridReady = useCallback(
    (params: any) => {
      if (gridRef.current) {
        gridRef.current.api = params.api;
      }
    },
    [gridRef]
  );
  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 100,
    }),
    []
  );
  const myTheme = themeQuartz.withParams({
    accentColor: "#4CAF50",
    backgroundColor: darkMode ? "#1e1e1e" : "#ffffff",
    foregroundColor: darkMode ? "#ffffff" : "#000000",
  });

  const onSelectionChanged = (event: any) => {
    const selectedNodes = event.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node: any) => node.data);
    props?.enCheckBox && props?.enCheckBox(selectedData);
  };

  const onFirstDataRendered = useCallback((params: any) => {
    params.api.forEachNode((node: any) => {
      if (node?.data?.selected) {
        node.setSelected(true);
      }
    });
  }, []);

  const getRowStyle = (params: any) => {
    if (params.node?.data?.selected) {
      return { background: "#68aad4" };
    }
    if (
      (props?.esListaProductosExcel && !params.node?.data?.proveedor_valido) ||
      (props?.esListaProductosExcel && !params.node?.data?.categoria_valida)
    ) {
      return { background: "#FF2C00" };
    }
    if (params.node?.data?.sku_duplicado) {
      return { background: "#fff3cd" };
    }
    if (params.node?.data?.estado === "cancelada" || params.node?.data?.status === "desactivado") {
      return { background: "#f78c8c" };
    }
    if (params.node?.data?.estado === "pendiente") {
      return { background: "#ffd966" };
    }
    if (params.node?.data?.estado === "resuelta") {
      return { background: "#6aa84f" };
    }
  };

  const barraBusqueda = useMemo(() => {
    if (!props?.sinFiltro) {
      return (
        <SearchFiltro
          onFiltro={(w: string) => {
            handleFiltro(w);
          }}
        />
      );
    }
    return null;
  }, [props?.sinFiltro]);

  return (
    <Grid container spacing={2}>
      {props?.titulo ? (
        <Grid item xs={12} md={12}>
          <h4 style={{ padding: 5 }}>{props?.titulo}</h4>
        </Grid>
      ) : null}
      {!props?.sinExport ? (
        <Grid item xs={12} md={11} style={{ textAlign: "center", padding: "10px" }}>
          {" "}
        </Grid>
      ) : null}
      {!props?.sinExport ? (
        <Grid item xs={12} md={1} style={{ textAlign: "center", padding: "10px", paddingRight: 0 }}>
          <Tooltip title="Exportar a excel">
            <IconButton
              disabled={!props?.data?.length}
              onClick={() => handleExportarExcel()}
              aria-label={""}
              size="small"
              style={{
                color: darkMode ? "#4CAF50" : "#fff",
                backgroundColor: darkMode ? "#f0f2f5" : "#4CAF50",
                borderRadius: "5px",
                width: "100%",
              }}
            >
              <SimCardDownloadIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      ) : null}
      {!props?.sinBusqueda ? (
        <Grid container direction={"row-reverse"}>
          <Grid
            item
            xs={12}
            md={8}
            style={{
              textAlign: "center",
              padding: 0,
              marginTop: "10px",
            }}
          >
            {barraBusqueda}
          </Grid>
        </Grid>
      ) : null}
      <Grid item xs={12} md={12} style={{ minHeight: props?.minHeight ? props?.minHeight : 400 }}>
        {props?.showCheckBox ? (
          <AgGridReact
            defaultColDef={defaultColDef}
            ref={gridRef}
            onGridReady={onGridReady}
            rowData={data}
            theme={myTheme}
            columnDefs={columns}
            onFirstDataRendered={onFirstDataRendered}
            pagination={pagination}
            paginationPageSize={paginationPageSize}
            paginationPageSizeSelector={paginationPageSizeSelector}
            detailRowHeight={150}
            localeText={localeText}
            getRowStyle={getRowStyle}
            pinnedBottomRowData={props?.footerRowData || null}
            rowSelection={{
              mode: "multiRow",
              headerCheckbox: true,
            }}
            getRowId={(params) => params.data.id + ""}
            onSelectionChanged={onSelectionChanged}
          />
        ) : (
          <AgGridReact
            defaultColDef={defaultColDef}
            ref={gridRef}
            onGridReady={onGridReady}
            rowData={data}
            theme={myTheme}
            getRowStyle={getRowStyle}
            columnDefs={columns}
            pagination={pagination}
            paginationPageSize={paginationPageSize}
            paginationPageSizeSelector={paginationPageSizeSelector}
            detailRowHeight={150}
            localeText={localeText}
            pinnedBottomRowData={props?.footerRowData || null}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default DinamicTableMejorada;
