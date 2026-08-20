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
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import { totalesKeyMap } from "../../modules/reporteCanjesGlobal/config/reporteCanjesTotalsMap";
import SearchIcon from '@mui/icons-material/Search';

interface Props<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
  totales?: Record<string, any>;
  searchColumnId?: string;
  searchPlaceholder?: string;
}

const CELL_PADDING = "6px 8px";

function GenericGroupedTable<T extends object>({ data, columns, totales, searchColumnId, searchPlaceholder = "Buscar..." }: Props<T>) {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchValue, setSearchValue] = useState("");

  const groupRowRef = useRef<HTMLTableRowElement>(null);
  const [groupRowHeight, setGroupRowHeight] = useState(0);

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
  const columnWidths = Object.fromEntries(
    leafColumns.map((col) => [col.id, col.getSize()])
  );
  const totalWidth = table.getTotalSize();

  useLayoutEffect(() => {
    if (groupRowRef.current) {
      setGroupRowHeight(groupRowRef.current.getBoundingClientRect().height);
    }
  }, [data, columns, columnSizing]);

  const headerGroups = table.getHeaderGroups();

  // Maneja el input de búsqueda -> actualiza el filtro de la columna indicada
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
        borderRadius: 0,
        overflow: "hidden",
        mt: 0
      }}
    >
      {searchColumnId && (
        <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0" }}>
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
        </Box>
      )}
      <TableContainer sx={{ maxHeight: 650, overflow: "auto" }}>
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
                    rawValue === undefined
                      ? ""
                      : formatter
                        ? formatter(rawValue)
                        : rawValue;

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
        count={table.getFilteredRowModel().rows.length}//data.length
        page={pagination.pageIndex}
        onPageChange={(_, newPage) => setPagination((prev) => ({ ...prev, pageIndex: newPage }))}
        rowsPerPage={pagination.pageSize}
        rowsPerPageOptions={[10]}
        onRowsPerPageChange={() => { }}
        labelRowsPerPage="Filas por página"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
      />
    </Paper>
  );
}

export default GenericGroupedTable;
