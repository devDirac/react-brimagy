import React, { useCallback, useState, useRef } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { DinamicTableProps } from "./types";
import { columnsNames } from "./columnsNames";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  Link,
  Tooltip,
  Typography,
} from "@mui/material";
import _ from "lodash";
import moment from "moment";
import { useMaterialUIController } from "context";
import AccionesTable from "./AccionesTable";
import { AgGridReact } from "ag-grid-react";
import env from "react-dotenv";
import { green, red, amber, grey, orange } from "@mui/material/colors";
//muy satisfecho
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
//satisfecho
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
//neutral
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
//insatisfecho
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
//muy insatisfecho
import MoodBadIcon from "@mui/icons-material/MoodBad";

const useDinamicTable = (props: DinamicTableProps) => {
  const [imagenModal, setImagenModal] = useState<string | null>(null);
  const gridRef = useRef<AgGridReact>(null);

  const [data, setData] = useState<any[]>(
    (props?.data || []).map((e: any) => {
      if (e.hasOwnProperty("Permisos")) {
        return { ...e, ...{ Permisos: JSON.stringify(e?.Permisos) } };
      } else {
        return e;
      }
    })
  );

  const iconosRespuestaMultiple = [
    {
      id: 5,
      texto: "Muy satisfecho",
      icono: SentimentVerySatisfiedIcon,
      color: green[500],
    },
    {
      id: 4,
      texto: "Satisfecho",
      icono: SentimentSatisfiedIcon,
      color: green[300],
    },
    {
      id: 3,
      texto: "Neutral",
      icono: SentimentNeutralIcon,
      color: amber[500],
    },
    {
      id: 2,
      texto: "Insatisfecho",
      icono: SentimentDissatisfiedIcon,
      color: orange[500],
    },
    {
      id: 1,
      texto: "Muy insatisfecho",
      icono: MoodBadIcon,
      color: red[500],
    },
  ];

  const tipoUsuarios = [
    {
      id: 1,
      tipo: "Internauta",
      variant: "outlined" as const,
      colorChip: "#C22B1D" as const,
      colorTexto: "#fff" as const,
    },
    {
      id: 2,
      tipo: "Auditor",
      variant: "outlined" as const,
      colorChip: "#279FD6" as const,
      colorTexto: "#00" as const,
    },
    {
      id: 3,
      tipo: "Compras",
      variant: "filled" as const,
      colorChip: "#D67927" as const,
      colorTexto: "#000" as const,
    },
    {
      id: 4,
      tipo: "Inventario",
      variant: "filled" as const,
      colorChip: "#6CA11F" as const,
      colorTexto: "#fff" as const,
    },
    {
      id: 5,
      tipo: "Administración",
      variant: "filled" as const,
      colorChip: "#9245BA" as const,
      colorTexto: "#fff" as const,
    },
    {
      id: 6,
      tipo: "Super Admin",
      variant: "filled" as const,
      colorChip: "#BA256A" as const,
      colorTexto: "#fff" as const,
    },
  ];

  const estatusUsuarios = [
    {
      id: "ACTIVE",
      texto: "Activo",
      variant: "filled" as const,
      color: "success" as const,
    },
    {
      id: "DEACTIVATE",
      texto: "Inactivo",
      variant: "outlined" as const,
      color: "error" as const,
    },
  ];

  const EstadosValidacionArray = [
    {
      id: 1,
      tipo: "notificacion_enviada",
      variant: "outlined" as const,
      colorChip: "#E3EA19" as const,
      colorTexto: "#fff" as const,
    },
    {
      id: 2,
      tipo: "solicitud_enviada",
      variant: "outlined" as const,
      colorChip: "#279FD6" as const,
      colorTexto: "#00" as const,
    },
    {
      id: 3,
      tipo: "identidad_validada",
      variant: "filled" as const,
      colorChip: "#4CAF50" as const,
      colorTexto: "#000" as const,
    },
  ];

  const estadosValidacionMap: { [key: string]: string } = {
    NOTIFICACION_ENVIADA: "EN ESPERA DE VALIDACIÓN DE IDENTIDAD",
    SOLICITUD_ENVIADA: "SOLICITUD DE CÓDIGO ENVIADA",
    IDENTIDAD_VALIDADA: "IDENTIDAD VALIDADA",
  };

  const traducirEstadoValidacion = (estado: string | null | undefined): string => {
    if (!estado) return "SIN VALIDAR";
    const estadoUpper = estado.toUpperCase();
    return estadosValidacionMap[estadoUpper] || estadoUpper;
  };

  const [showExpandedComponent, setShowExpandedComponent] = useState(null);

  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  moment.locale("es", {
    months:
      "Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split(
        "_"
      ),
    monthsShort: "Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.".split("_"),
    weekdays: "Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado".split("_"),
    weekdaysShort: "Dom._Lun._Mar._Mier._Jue._Vier._Sab.".split("_"),
    weekdaysMin: "Do_Lu_Ma_Mi_Ju_Vi_Sa".split("_"),
  } as any);

  const filteredItems = (props?.data || []).map((e: any) => {
    if (e.hasOwnProperty("Permisos")) {
      return { ...e, ...{ Permisos: JSON.stringify(e?.Permisos) } };
    } else {
      return e;
    }
  });
  const keys = Object.keys(filteredItems?.[0]);

  const newKeys = props?.columnsOrder
    ? props.columnsOrder.filter((col: string) => keys.includes(col))
    : props?.columnsToShow
    ? _.remove(keys, (n) => props?.columnsToShow.includes(n))
    : keys;

  const columns: any = newKeys.map((dta) => {
    const esPinned = (props?.pinned || []).find((er) => er?.columna === dta);
    const nombreColumna =
      columnsNames.find((c: any) => c?.id === dta)?.value ||
      (dta[0].toUpperCase() + dta.substring(1)).replaceAll("_", " ");
    return {
      ...{
        filter: props?.sinFiltro ? false : true,
        autoHeight: dta === "link" ? true : true,
        field: dta,
        headerName: nombreColumna,
        cellRenderer: (row: any) => StatusCellRenderer(row, dta),
        cellStyle: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      },
      ...(esPinned ? { pinned: esPinned?.lado, width: 100 } : {}),
      ...(props?.flex ? { flex: 1 } : {}),
      ...(dta === "id" ? { width: 80 } : {}),
      ...(dta === "link"
        ? {
            width: 200,
            minHeight: 90,
          }
        : {}),
    };
  });

  const StatusCellRenderer = (row: any, dta: any) => {
    return dta === "tipo_usuario"
      ? tipoUsuario(row)
      : dta === "respuesta"
      ? tipoIconosRespuestaMultiple(row)
      : dta === "status"
      ? usuarioEstatus(row)
      : dta === "estado_validacion"
      ? estadoValidacionCanje(row)
      : tool(row);
  };

  const estadoValidacionCanje = (row_: any) => {
    const row = row_?.data;
    const x = row_?.colDef?.field;
    console.log(row?.[x]);
    const estatusValidacion = EstadosValidacionArray.find((e: any) => e?.tipo === row?.[x]);
    return (
      <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <Chip
          label={traducirEstadoValidacion(estatusValidacion?.tipo.toUpperCase()) || ""}
          variant={estatusValidacion?.variant}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "max-content",
            backgroundColor: estatusValidacion?.colorChip || "#e0e0e0",
            color: estatusValidacion?.colorTexto,
          }}
        />
      </Box>
    );
  };

  const usuarioEstatus = (row_: any) => {
    const row = row_?.data;
    const x = row_?.colDef?.field;
    const estatusUsuario = estatusUsuarios.find((e: any) => e?.id === row?.[x]);
    return (
      <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <Chip
          label={estatusUsuario?.texto || "Sin estatus"}
          variant={estatusUsuario?.variant || "outlined"}
          color={estatusUsuario?.color || "default"}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "max-content",
          }}
        />
      </Box>
    );
  };

  const tipoUsuario = (row_: any) => {
    const row = row_?.data;
    const x = row_?.colDef?.field;
    const tipoUsuarioText = tipoUsuarios.find((e: any) => e?.id === row?.[x]);
    return (
      <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <Chip
          label={tipoUsuarioText?.tipo || ""}
          variant={tipoUsuarioText?.variant}
          //color={tipoUsuarioText?.color}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "max-content",
            backgroundColor: tipoUsuarioText?.colorChip || "#e0e0e0",
            color: tipoUsuarioText?.colorTexto,
          }}
        />
      </Box>
    );
  };

  const tipoIconosRespuestaMultiple = (row_: any) => {
    const row = row_?.data;
    const x = row_?.colDef?.field;
    const iconosRespuestaText = iconosRespuestaMultiple.find(
      (e: any) => String(e?.id) === row?.[x]
    );
    const IconoComponente = iconosRespuestaText?.icono;
    const tipoMultiplePregunta = row?.tipo_pregunta === "opcion_multiple";

    return (
      <Box>
        {tipoMultiplePregunta ? (
          <Tooltip title={iconosRespuestaText?.texto}>
            <IconButton>
              {IconoComponente && (
                <IconoComponente
                  sx={{
                    color: iconosRespuestaText?.color,
                    transform: "scale(1.5)",
                    transition: "all 0.3s",
                  }}
                  fontSize="medium"
                />
              )}
            </IconButton>
          </Tooltip>
        ) : (
          row?.respuesta
        )}
      </Box>
    );
  };

  const esNumero = (valor: any) => {
    const valorLimpio = (valor + "").replace(/[%$,\s]/g, "");
    const numeroEntero = Number(valorLimpio);
    return !isNaN(numeroEntero);
  };

  const printNotas = (row_: any) => {
    const row = row_?.data;
    const x = row_?.colDef?.field;
    return (
      <Grid container>
        {(row?.[x] || []).map((r: any, key: number) => {
          return (
            <Grid key={key} item xs={12}>
              {" "}
              <p
                style={{
                  color: "black",
                  whiteSpace: "normal",
                  overflowWrap: "break-word",
                  wordBreak: "keep-all",
                  wordWrap: "break-word",
                }}
              >
                {r}
              </p>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  const tool = (row_: any) => {
    const row = row_?.data;
    const x = row_?.colDef?.field;
    const esEstado = x === "estado";
    const esStatus = x === "status";
    let text =
      row?.[x] === 0
        ? "0"
        : x === "descripcion"
        ? (row?.[x] || "").substring(0, 40) + "..."
        : x === "linea_base" || x === "fecha_inicio" || x === "fecha_fin" || x === "fecha_final"
        ? moment(row?.[x] || "").format("MMMM DD YYYY")
        : x === "fecha_registro"
        ? moment(row?.[x] || "").format("MMMM DD YYYY, H:mm:ss")
        : row?.[x] || "";
    // Convertir a mayúsculas si es el campo estado

    if (esStatus && typeof text === "string") {
      text = text.toUpperCase();
    }
    if (esStatus && typeof text === "string") {
      text = text.toUpperCase();
    }
    if (x === "estatus" || x === "status") {
      return (
        <Tooltip title={row?.[x] || ""}>
          <p
            style={{
              fontWeight: "bold",
              color: "rgb(52, 71, 103)",
              whiteSpace: "normal",
              wordWrap: "normal",
              overflowWrap: "anywhere",
              wordBreak: "break-word",
            }}
          >
            {text}
          </p>
        </Tooltip>
      );
    }
    return (
      <Tooltip
        title={
          row?.[x] === 0
            ? "0"
            : x === "linea_base" || x === "fecha_inicio" || x === "fecha_fin" || x === "fecha_final"
            ? moment(row?.[x] || "").format("MMMM DD YYYY")
            : x === "fecha_registro"
            ? moment(row?.[x] || "").format("MMMM DD YYYY, H:mm:ss")
            : row?.[x] || ""
        }
      >
        <p
          style={
            !esNumero(text) || x === "periodo"
              ? {
                  whiteSpace: "normal",
                  overflowWrap: "break-word",
                  wordBreak: "keep-all",
                  wordWrap: "break-word",
                  ...(esEstado && { fontWeight: "bold" }),
                }
              : {}
          }
        >
          {typeof text === "string" ? text.replace(/\./g, ". ") : text}
        </p>
      </Tooltip>
    );
  };

  const handleImageClick = (imageUrl: string) => {
    setImagenModal(imageUrl);
  };

  const printFechaFinalColor = (row_: any) => {
    const row = row_?.data;
    const x = row_?.colDef?.field;
    return (
      <div style={{ backgroundColor: "#ffe4e1", color: "#333" }}>
        <Tooltip title={moment(row?.[x] || "").format("MMMM DD YYYY")}>
          <p
            style={{
              whiteSpace: "normal",
              overflowWrap: "break-word",
              wordBreak: "keep-all",
              wordWrap: "break-word",
            }}
          >
            {" "}
            {moment(row?.[x] || "").format("MMMM DD YYYY")}
          </p>
        </Tooltip>
      </div>
    );
  };

  const handleRowClicked = (row: any) => {
    props?.enAccion && props?.enAccion("detalle", row);
  };
  const acciones = (row_: any) => {
    const row = row_?.data;
    if ((row?.id || "") === "Totales") {
      return <></>;
    }

    return (
      <AccionesTable
        esListaCanjes={props?.esListaCanjes}
        esListaUsuarios={props?.esListaUsuarios}
        esListaProductos={props?.esListaProductos}
        esListaProveedores={props?.esListaProveedores}
        esListaCategorias={props?.esListaCategorias}
        esListaRespuestas={props?.esListaRespuestas}
        esListaOrdenesCompra={props?.esListaOrdenesCompra}
        titulo={props?.titulo === "Herramientas"}
        tit={props?.titulo}
        row={row}
        enAccion={(accion) => props?.enAccion && props?.enAccion(accion, row)}
      />
    );
  };

  const searchInObject = (obj: any, word: any) => {
    for (const key in obj) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        if (searchInObject(obj[key], word)) return true;
      } else if (typeof obj[key] === "string" && obj[key].includes(word)) {
        return true;
      }
    }
    return false;
  };

  const searchWordInObjects = (array: any, word: any) => {
    const result: any = [];
    array.forEach((obj: any, index: any) => {
      if (searchInObject(obj, word)) {
        result.push({ index, obj });
      }
    });
    return result;
  };

  if (props?.actions) {
    columns.unshift({
      //width: 100,
      width: undefined,
      field: "Herramientas",
      headerName: "Herramientas",
      cellRenderer: (row: any, dta: any) => {
        if ((row?.data?.id || "") === "Totales") {
          return null;
        }
        return acciones(row);
      },
      cellStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      flex: 1,
      minWidth: 50,
      maxWidth: 150,
      pinned: "left",
    });
  }

  const handleFiltro = useCallback((textoFiltrar: string) => {
    if (!gridRef.current) return;

    const api = gridRef.current.api;

    if (_.isEmpty(textoFiltrar.trim())) {
      // Limpiar todos los filtros
      api.setGridOption("quickFilterText", "");
      return;
    }

    const text_ = textoFiltrar
      .toLowerCase()
      .replaceAll("á", "a")
      .replaceAll("é", "e")
      .replaceAll("í", "i")
      .replaceAll("ó", "o")
      .replaceAll("ú", "u");

    // Usar el filtro rápido de AG-Grid
    api.setGridOption("quickFilterText", text_);
  }, []);

  const handleExportarExcel = () => {
    if (!gridRef.current) return;

    const api = gridRef.current.api;

    const rowsFiltradas: any[] = [];
    api.forEachNodeAfterFilterAndSort((node: any) => {
      rowsFiltradas.push(node.data);
    });

    const resultado = rowsFiltradas.flatMap((obj: any) => {
      const propArray = Object.keys(obj).find((key) => Array.isArray(obj[key]));
      if (propArray) {
        return obj[propArray].map((subObj: any) => ({
          ...obj,
          ...subObj,
          [propArray]: "Detalle del conjunto",
        }));
      }
      return obj;
    });
    const columnasParaExportar = props?.columnsToExport?.length
      ? props.columnsToExport
      : columns.map((col: any) => col.field);

    const resultadoFiltrado = resultado.map((row: any) => {
      const nuevoRow: any = {};
      columnasParaExportar.forEach((campo: string) => {
        nuevoRow[campo] = row[campo];
      });
      return nuevoRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(resultadoFiltrado);

    const columnasNumericas = [
      "cantidad",
      "precio",
      "total",
      "precio_unitario",
      "importe",
      "pu",
      "importe_acumulado",
      "importeAcumuladoActual",
      "importeAcumuladoAnterior",
      "cantidad_proyecto",
      "precio_entrada",
      "importe_inventario",
      "cantidad_por_suministrar",
    ];
    const rango = XLSX.utils.decode_range(worksheet["!ref"] || "");

    for (let C = rango.s.c; C <= rango.e.c; ++C) {
      const encabezado = worksheet[XLSX.utils.encode_cell({ r: 0, c: C })]?.v;
      if (columnasNumericas.includes(encabezado)) {
        for (let R = 1; R <= rango.e.r; ++R) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
          const cell = worksheet[cellAddress];
          if (cell && cell.v !== undefined) {
            const limpio = String(cell.v).replace(/[^0-9.-]/g, "");
            cell.v = limpio ? Number(limpio) : 0;
            cell.t = "n";

            cell.z = "#,##0.00";
          }
        }
      }
    }

    // 3. Crear workbook y exportar
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hoja 1");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${props?.tituloExcel || "Documento de excel"}.xlsx`);
  };

  const localeText = {
    // General
    page: "Página",
    more: "Más",
    to: "a",
    of: "de",
    next: "Siguiente",
    last: "Último",
    first: "Primero",
    previous: "Anterior",
    loadingOoo: "Cargando...",

    // Filtros de columna
    selectAll: "Seleccionar todo",
    searchOoo: "Buscando...",
    blanks: "En blanco",
    filterOoo: "Filtrar...",

    // Filtro de texto
    equals: "Igual",
    notEqual: "Diferente",
    contains: "Contiene",
    notContains: "No contiene",
    startsWith: "Empieza con",
    endsWith: "Termina con",

    // Paginación
    pageSize: "Tamaño de página",

    // Botones
    applyFilter: "Aplicar filtro",
    resetFilter: "Restablecer filtro",
    clearFilter: "Borrar filtro",

    // Otros
    noRowsToShow: "No hay datos para mostrar",
    pinColumn: "Fijar columna",
    autosizeThiscolumn: "Ajustar esta columna",
    autosizeAllColumns: "Ajustar todas las columnas",
    resetColumns: "Restablecer columnas",

    blank: "Vacío",
    notBlank: "No vacío",
  };

  return {
    columns,
    handleExportarExcel,
    darkMode,
    handleFiltro,
    showExpandedComponent,
    setShowExpandedComponent,
    localeText,
    data,
    gridRef,
    imagenModal,
    setImagenModal,
    handleImageClick,
  };
};

export default useDinamicTable;
