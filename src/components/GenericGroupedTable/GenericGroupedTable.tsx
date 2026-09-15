// components/GenericGroupedTable/GenericGroupedTable.tsx
import { useLayoutEffect, useRef, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  HeaderGroup,
  Header,
  Row,
  Cell,
  SortingState,
  ColumnSizingState,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Box,
  TextField,
  InputAdornment,
  Button,
  CircularProgress,
  Grid,
  Typography,
  Divider,
  Tooltip,
  IconButton,
  Autocomplete,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import { totalesKeyMap } from "../../modules/reporteCanjesGlobal/config/reporteCanjesTotalsMap";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";

import dayjs from "dayjs";
import "dayjs/locale/es";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useIntl } from "react-intl";
import ModalComponent from "components/Modal";
import { IconFileSpreadsheet, IconFileTypeXls } from "@tabler/icons-react";
import { Periodos } from "modules/reporteCanjesGlobal/types/reporteCanjes";
import { FormikProps } from "formik";
import { IconCalendarPlus, IconCopyPlusFilled } from "@tabler/icons-react";
import { Spinner } from "react-bootstrap";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";

interface PeriodoFormValues {
  fecha_inicio_periodo: string;
  fecha_fin_periodo: string;
}

interface Props<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
  totales?: Record<string, any>;
  searchColumnId?: string;
  searchPlaceholder?: string;
  descargando?: boolean;
  rangoFechas?: boolean;
  handleExportarExcel: (inicio?: string, fin?: string, plataforma?: string) => Promise<void>;
  plataforma?: string;
  periodos?: Periodos[] | null;
  formik: FormikProps<PeriodoFormValues>;
  getFieldColor: (fieldName: keyof PeriodoFormValues) => string | undefined;
  createPeriodo: (data: any) => Promise<void>;
  procesandoPeriodo?: boolean;
  handleisAlertOpenPeriodo: () => void;
  handleisAlertClosePeriodo: () => void;
  isAlertOpenPeriodo: boolean;
  periodoEditar: Periodos | null;
  editarPeriodo: (datos: any) => void;
}

const CELL_PADDING = "6px 8px";

function TablePaginationActions(props: {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}) {
  const { count, page, rowsPerPage, onPageChange } = props;

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={(e) => onPageChange(e, 0)} disabled={page === 0}>
        <FirstPageIcon />
      </IconButton>
      <IconButton onClick={(e) => onPageChange(e, page - 1)} disabled={page === 0}>
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={(e) => onPageChange(e, page + 1)}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={(e) => onPageChange(e, Math.max(0, Math.ceil(count / rowsPerPage) - 1))}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        <LastPageIcon />
      </IconButton>
    </Box>
  );
}

function GenericGroupedTable<T extends object>({
  data,
  columns,
  totales,
  searchColumnId,
  searchPlaceholder = "Buscar...",
  descargando,
  handleExportarExcel,
  rangoFechas,
  plataforma,
  periodos,
  formik,
  getFieldColor,
  createPeriodo,
  procesandoPeriodo,
  handleisAlertOpenPeriodo,
  handleisAlertClosePeriodo,
  isAlertOpenPeriodo,
  periodoEditar,
  editarPeriodo,
}: Props<T>) {
  const intl = useIntl();
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchValue, setSearchValue] = useState("");

  const groupRowRef = useRef<HTMLTableRowElement>(null);
  const [groupRowHeight, setGroupRowHeight] = useState(0);

  const [periodoUnoInicioLocal, setPeriodoUnoInicioLocal] = useState<string>("");
  const [periodoUnoFinLocal, setPeriodoUnoFinLocal] = useState<string>("");
  const [errorFin, setErrorFin] = useState<string | null>(null);

  const [isAlertOpenExcel, setIsAlertOpenExcel] = useState(false);
  const handleisAlertOpenExcel = () => setIsAlertOpenExcel(true);
  const handleisAlertCloseExcel = () => setIsAlertOpenExcel(false);

  const table = useReactTable({
    data,
    columns,
    state: { pagination, sorting, columnSizing },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnSizingChange: setColumnSizing,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const leafColumns = table.getVisibleLeafColumns();

  const columnWidths = Object.fromEntries(leafColumns.map((col) => [col.id, col.getSize()]));
  const totalWidth = table.getTotalSize();

  useLayoutEffect(() => {
    if (groupRowRef.current) {
      const newHeight = groupRowRef.current.getBoundingClientRect().height;
      setGroupRowHeight((prev) => (prev !== newHeight ? newHeight : prev));
    }
  }, [data, columns, columnSizing]);

  const headerGroups = table.getHeaderGroups();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);

    if (searchColumnId) {
      const column = table.getColumn(searchColumnId);
      column?.setFilterValue(value);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }
  };

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        mt: 0,
      }}
    >
      <Grid
        container
        spacing={1}
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        {/* Derecha: agrupados */}
        <Grid
          item
          xs={12}
          sm={4}
          sx={{ display: "flex", gap: 1, alignItems: "center", justifyContent: "flex-start" }}
        >
          {/*{periodos && periodos.length > 0 && (
            <Autocomplete
              id="id_periodo"
              fullWidth
              options={periodos}
              getOptionLabel={(option) =>
                `${dayjs(option.fecha_inicio).format("DD/MM/YYYY")} - ${dayjs(
                  option.fecha_fin
                ).format("DD/MM/YYYY")}`
              }
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(_, newValue) => {
                // TODO: al seleccionar un período, definir qué hacer (filtrar reporte, cargar fechas, etc.)
              }}
              noOptionsText={intl.formatMessage({ id: "general_sin_registros" })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  size="small"
                  label={intl.formatMessage({ id: "select_periodo" })}
                />
              )}
            />
          )}*/}

          <Tooltip title={intl.formatMessage({ id: "general_descargar_excel" })}>
            <IconButton
              onClick={handleisAlertOpenExcel}
              sx={{
                borderRadius: 2,
                background: "#a5eb2f",
                color: "#2f2f2f",
                "&:hover": { background: "#2f2f2f", color: "#fff" },
                "&:focus:not(:hover)": { background: "#a5eb2f" },
              }}
            >
              <IconFileTypeXls stroke={2} />
            </IconButton>
          </Tooltip>

          {searchColumnId && (
            <TextField
              size="small"
              value={searchValue}
              onChange={handleSearchChange}
              placeholder={searchPlaceholder}
              sx={{ maxWidth: 320, width: "100%" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          )}
        </Grid>
      </Grid>

      <TableContainer sx={{ maxHeight: 650, overflow: "auto", borderRadius: "0 !important" }}>
        <Table
          stickyHeader
          size="small"
          sx={{
            tableLayout: "fixed",
            width: totalWidth,
            borderCollapse: "separate",
            borderSpacing: 0,
            "& th, & td": {
              boxSizing: "border-box",
              borderRadius: "0 !important",
            },
          }}
        >
          <colgroup>
            {leafColumns.map((col) => (
              <col key={col.id} style={{ width: col.getSize() }} />
            ))}
          </colgroup>

          <TableHead
            sx={{
              padding: 0,
            }}
          >
            {headerGroups.map((headerGroup: HeaderGroup<T>, rowIndex) => (
              <TableRow key={headerGroup.id} ref={rowIndex === 0 ? groupRowRef : undefined}>
                {headerGroup.headers.map((header: Header<T, unknown>) => {
                  const meta = header.column.columnDef.meta;
                  const isGroupHeader = !!header.subHeaders?.length;
                  const canSort = !isGroupHeader && header.column.getCanSort();
                  const sortDir = header.column.getIsSorted();
                  const cellWidth = isGroupHeader
                    ? header.getLeafHeaders().reduce((sum, h) => sum + columnWidths[h.column.id], 0)
                    : columnWidths[header.column.id];

                  return (
                    <TableCell
                      key={header.id}
                      component="td"
                      colSpan={header.colSpan}
                      align={isGroupHeader ? "center" : "left"}
                      style={{
                        width: cellWidth,
                        minWidth: cellWidth,
                        maxWidth: cellWidth,
                      }}
                      sx={{
                        position: "sticky",
                        top: rowIndex === 0 ? 0 : groupRowHeight,
                        zIndex: rowIndex === 0 ? 3 : 2,
                        backgroundColor: meta?.groupBg || meta?.cellBgColor || "#F5F5F5",
                        color: meta?.groupText || "#000",
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        borderRight: "1px solid rgba(255,255,255,0.6)",
                        borderBottom: "1px solid rgba(255,255,255,0.6)",
                        userSelect: "none",
                        padding: CELL_PADDING,
                        margin: 0,
                        lineHeight: 1.3,
                        transform: "translateZ(0)",
                        WebkitTransform: "translateZ(0)",
                        backfaceVisibility: "hidden",
                        willChange: "transform",
                      }}
                    >
                      <Box
                        onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: isGroupHeader ? "center" : "flex-start",
                          gap: 0.5,
                          cursor: canSort ? "pointer" : "default",
                          width: "100%",
                          minWidth: 0,
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            minWidth: 0,
                            flexShrink: 1,
                          }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </Box>

                        {canSort && (
                          <Box
                            sx={{
                              width: 14,
                              height: 14,
                              display: "flex",
                              alignItems: "center",
                              flexShrink: 0,
                            }}
                          >
                            {sortDir === "asc" && <ArrowUpwardIcon sx={{ fontSize: 14 }} />}
                            {sortDir === "desc" && <ArrowDownwardIcon sx={{ fontSize: 14 }} />}
                            {!sortDir && <UnfoldMoreIcon sx={{ fontSize: 14, opacity: 0.4 }} />}
                          </Box>
                        )}
                      </Box>

                      {!isGroupHeader && header.column.getCanResize() && (
                        <Box
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          sx={{
                            position: "absolute",
                            right: 0,
                            top: 0,
                            height: "100%",
                            width: "6px",
                            cursor: "col-resize",
                            userSelect: "none",
                            touchAction: "none",
                            backgroundColor: header.column.getIsResizing()
                              ? "rgba(0,0,0,0.4)"
                              : "transparent",
                            "&:hover": { backgroundColor: "rgba(0,0,0,0.2)" },
                          }}
                        />
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableHead>

          <TableBody>
            {table.getRowModel().rows.map((row: Row<T>) => (
              <TableRow key={row.id} hover>
                {row.getVisibleCells().map((cell: Cell<T, unknown>) => {
                  const meta = cell.column.columnDef.meta;
                  const cellWidth = columnWidths[cell.column.id];

                  return (
                    <TableCell
                      key={cell.id}
                      align="left"
                      style={{ width: cellWidth, minWidth: cellWidth, maxWidth: cellWidth }}
                      sx={{
                        backgroundColor: meta?.cellBgColor || "transparent",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontSize: 12,
                        borderRight: "1px solid #e0e0e0",
                        borderBottom: "1px solid #e0e0e0",
                        padding: CELL_PADDING,
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>

          {/* --- NUEVO: fila de totales, sticky al fondo del scroll --- */}
          {totales && (
            <TableFooter>
              <TableRow>
                {leafColumns.map((col, idx) => {
                  const meta = col.columnDef.meta as any;
                  const cellWidth = columnWidths[col.id];

                  // primer columna: label "Total" en vez de un número
                  if (idx === 0) {
                    return (
                      <TableCell
                        key={col.id}
                        align="left"
                        style={{ width: cellWidth, minWidth: cellWidth, maxWidth: cellWidth }}
                        sx={{
                          position: "sticky",
                          bottom: 0,
                          zIndex: 2,
                          backgroundColor: "#263238",
                          color: "#fff",
                          fontWeight: "bold",
                          fontSize: 12,
                          padding: CELL_PADDING,
                          whiteSpace: "nowrap",
                        }}
                      >
                        Total
                      </TableCell>
                    );
                  }

                  const totalesKey = totalesKeyMap[col.id];
                  const rawValue = totalesKey ? totales[totalesKey] : undefined;
                  const formatter = meta?.formatter;
                  const displayValue =
                    rawValue === undefined ? "" : formatter ? formatter(rawValue) : rawValue;

                  return (
                    <TableCell
                      key={col.id}
                      align="left"
                      style={{ width: cellWidth, minWidth: cellWidth, maxWidth: cellWidth }}
                      sx={{
                        position: "sticky",
                        bottom: 0,
                        zIndex: 2,
                        backgroundColor: "#263238",
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: 12,
                        padding: CELL_PADDING,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        borderLeft: "1px solid rgba(255,255,255,0.2)",
                      }}
                    >
                      {displayValue}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={table.getFilteredRowModel().rows.length}
        page={pagination.pageIndex}
        onPageChange={(_, newPage) => setPagination((prev) => ({ ...prev, pageIndex: newPage }))}
        rowsPerPage={pagination.pageSize}
        rowsPerPageOptions={[10]}
        onRowsPerPageChange={() => {}}
        labelRowsPerPage="Filas por página"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
        ActionsComponent={TablePaginationActions}
      />

      <ModalComponent
        handleClose={handleisAlertCloseExcel}
        isOpen={isAlertOpenExcel}
        key={"alerta"}
      >
        <Grid container spacing={2} style={{ textAlign: "center" }}>
          <Grid item xs={12}>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <Typography variant="h6" color="primary" gutterBottom sx={{ textAlign: "center" }}>
                  Exportar excel del reporte
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                  <DatePicker
                    label={intl.formatMessage({ id: "input_fecha_inicio" })}
                    openTo="year"
                    format="YYYY/MM/DD"
                    views={["year", "month", "day"]}
                    value={periodoUnoInicioLocal ? dayjs(periodoUnoInicioLocal) : null}
                    maxDate={periodoUnoFinLocal ? dayjs(periodoUnoFinLocal) : undefined}
                    onChange={(newValue) => {
                      const formatted = newValue ? dayjs(newValue).format("YYYY-MM-DD") : "";
                      setPeriodoUnoInicioLocal(formatted);
                    }}
                    slotProps={{
                      textField: {
                        variant: "standard",
                        helperText: "Formato YYYY/MM/DD",
                      },
                    }}
                    sx={{ width: "100%" }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                  <DatePicker
                    label={intl.formatMessage({ id: "input_fecha_fin" })}
                    openTo="year"
                    format="YYYY/MM/DD"
                    views={["year", "month", "day"]}
                    value={periodoUnoFinLocal ? dayjs(periodoUnoFinLocal) : null}
                    minDate={periodoUnoInicioLocal ? dayjs(periodoUnoInicioLocal) : undefined}
                    onChange={(newValue) => {
                      const formatted = newValue ? dayjs(newValue).format("YYYY-MM-DD") : "";
                      setPeriodoUnoFinLocal(formatted);
                    }}
                    onError={(reason) => {
                      if (reason === "minDate") {
                        setErrorFin("La fecha fin no puede ser anterior a la fecha inicio");
                      } else {
                        setErrorFin(null);
                      }
                    }}
                    slotProps={{
                      textField: {
                        variant: "standard",
                        error: !!errorFin,
                        helperText: errorFin ?? "Formato YYYY/MM/DD",
                      },
                    }}
                    sx={{ width: "100%" }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={12}>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={descargando ? <CircularProgress size={18} /> : <DownloadIcon />}
                  disabled={descargando}
                  sx={{
                    background: "#a5eb2f",
                    color: "#2f2f2f",
                    "&:hover": {
                      background: "#2f2f2f",
                      color: "#fff",
                    },
                    "&:focus:not(:hover)": {
                      background: "#a5eb2f",
                    },
                  }}
                  onClick={() => {
                    handleExportarExcel(periodoUnoInicioLocal, periodoUnoFinLocal, plataforma);
                    //handleisAlertOpenExcel();
                  }}
                >
                  {descargando ? "Generando..." : "Exportar Excel"}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </ModalComponent>
      {/* CREAR NUEVO PERIODO */}
      <ModalComponent
        handleClose={handleisAlertClosePeriodo}
        isOpen={isAlertOpenPeriodo}
        key={"alerta"}
      >
        <Grid container spacing={2} style={{ textAlign: "center" }}>
          <Grid item xs={12} md={12}>
            <Typography
              variant="h6"
              color="primary"
              gutterBottom
              sx={{ mt: 2, textAlign: "center" }}
            >
              {periodoEditar ? "Editar" : "Añadir"} nuevo periodo
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <DatePicker
                label={intl.formatMessage({ id: "input_fecha_inicio" })}
                openTo="year"
                format="YYYY/MM/DD"
                views={["year", "month", "day"]}
                disabled={procesandoPeriodo}
                value={
                  formik.values.fecha_inicio_periodo
                    ? dayjs(formik.values.fecha_inicio_periodo)
                    : null
                }
                maxDate={
                  formik.values.fecha_fin_periodo
                    ? dayjs(formik.values.fecha_fin_periodo)
                    : undefined
                }
                onChange={(newValue) => {
                  const formatted = newValue ? dayjs(newValue).format("YYYY-MM-DD") : "";
                  formik.setFieldValue("fecha_inicio_periodo", formatted);
                }}
                slots={{
                  openPickerIcon: (props) => <IconCalendarPlus {...props} stroke={2} />,
                }}
                slotProps={{
                  openPickerButton: {
                    sx: {
                      "&:hover": {
                        color: "#a5eb2f",
                      },
                    },
                  },
                  textField: {
                    variant: "outlined",
                    fullWidth: true,
                    onBlur: () => formik.setFieldTouched("fecha_inicio_periodo", true),
                    error:
                      formik.touched.fecha_inicio_periodo &&
                      Boolean(formik.errors.fecha_inicio_periodo),
                    helperText:
                      formik.touched.fecha_inicio_periodo && formik.errors.fecha_inicio_periodo,
                    sx: {
                      "& .MuiInputLabel-root": { color: getFieldColor("fecha_inicio_periodo") },
                      "& .MuiInput-underline:after": {
                        borderBottomColor: getFieldColor("fecha_inicio_periodo"),
                      },
                      "& .MuiInput-underline:before": {
                        borderBottomColor: getFieldColor("fecha_inicio_periodo"),
                      },
                      "& .MuiInputBase-input": { color: getFieldColor("fecha_inicio_periodo") },
                    },
                  },
                }}
                sx={{ width: "100%" }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <DatePicker
                label={intl.formatMessage({ id: "input_fecha_fin" })}
                openTo="year"
                format="YYYY/MM/DD"
                views={["year", "month", "day"]}
                disabled={procesandoPeriodo}
                value={
                  formik.values.fecha_fin_periodo ? dayjs(formik.values.fecha_fin_periodo) : null
                }
                minDate={
                  formik.values.fecha_inicio_periodo
                    ? dayjs(formik.values.fecha_inicio_periodo)
                    : undefined
                }
                onChange={(newValue) => {
                  const formatted = newValue ? dayjs(newValue).format("YYYY-MM-DD") : "";
                  formik.setFieldValue("fecha_fin_periodo", formatted);
                }}
                slots={{
                  openPickerIcon: (props) => <IconCalendarPlus {...props} stroke={2} />,
                }}
                slotProps={{
                  openPickerButton: {
                    sx: {
                      "&:hover": {
                        color: "#a5eb2f",
                      },
                    },
                  },
                  textField: {
                    variant: "outlined",
                    fullWidth: true,
                    onBlur: () => formik.setFieldTouched("fecha_fin_periodo", true),
                    error:
                      formik.touched.fecha_fin_periodo && Boolean(formik.errors.fecha_fin_periodo),
                    helperText: formik.touched.fecha_fin_periodo && formik.errors.fecha_fin_periodo,
                    sx: {
                      "& .MuiInputLabel-root": { color: getFieldColor("fecha_fin_periodo") },
                      "& .MuiInput-underline:after": {
                        borderBottomColor: getFieldColor("fecha_fin_periodo"),
                      },
                      "& .MuiInput-underline:before": {
                        borderBottomColor: getFieldColor("fecha_fin_periodo"),
                      },
                      "& .MuiInputBase-input": { color: getFieldColor("fecha_fin_periodo") },
                    },
                  },
                }}
                sx={{ width: "100%" }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              sx={{
                fontSize: "0.7rem",
                padding: "10px 20px",
                whiteSpace: "nowrap",
                alignSelf: "flex-end",
                background: "#a5eb2f",
                color: "#2f2f2f",
                "&:hover": { background: "#2f2f2f", color: "#fff" },
                "&:focus:not(:hover)": { background: "#a5eb2f" },
              }}
              variant="contained"
              startIcon={<IconCopyPlusFilled />}
              disabled={
                procesandoPeriodo ||
                !formik.values.fecha_inicio_periodo ||
                !formik.values.fecha_fin_periodo
              }
              onClick={() => {
                const datos = {
                  ...(periodoEditar ? { id_periodo: periodoEditar.id } : {}),
                  fecha_inicio_periodo: formik.values.fecha_inicio_periodo,
                  fecha_fin_periodo: formik.values.fecha_fin_periodo,
                  plataforma: plataforma,
                };
                periodoEditar ? editarPeriodo(datos) : createPeriodo(datos);
              }}
            >
              {procesandoPeriodo ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  {periodoEditar ? "Editando..." : "Registrando..."}
                </>
              ) : periodoEditar ? (
                intl.formatMessage({ id: "editar_periodo" })
              ) : (
                intl.formatMessage({ id: "registrar_periodo" })
              )}
            </Button>
          </Grid>
        </Grid>
      </ModalComponent>
    </Paper>
  );
}

export default GenericGroupedTable;
