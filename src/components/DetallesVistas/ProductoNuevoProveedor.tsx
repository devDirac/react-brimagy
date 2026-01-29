import {
  Grid,
  Typography,
  Divider,
  Box,
  Chip,
  Paper,
  Button,
  TextField,
  TablePagination,
  Tooltip,
  IconButton,
  CardContent,
  Card,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useIntl } from "react-intl";
import ModalComponent from "components/Modal";
import { useMemo, useState } from "react";
import { Spinner } from "react-bootstrap";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { numericFormatter } from "react-number-format";
import { grey, pink } from "@mui/material/colors";

import { useSelector } from "react-redux";
import { StoreType } from "../../types/genericTypes";
import PDFViewerCanje from "components/PDFViews/PDFViewerCanje";
import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import MobileFriendlyIcon from "@mui/icons-material/MobileFriendly";
import ModalConfirm from "components/ModalConfirm/ModalConfirm";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SendIcon from "@mui/icons-material/Send";
import PDFViewerOrdenCompra from "components/PDFViews/PDFViewerOrdenCompra";
import MDTypography from "components/MDTypography";
import InventoryIcon from "@mui/icons-material/Inventory";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CategoryIcon from "@mui/icons-material/Category";

interface ProductoDatos {
  id: number;
  nombre_producto: string;
  categoria: string;
  marca: string;
  sku: string;
  id_proveedor: number;
  nombre_proveedor: string;
}

interface DetalleProductoProps {
  verProducto?: ProductoDatos[];
  proveedorSeleccionado: ProductoDatos[] | null;
  procesandoNuevoProveedor: boolean;
  setProveedorSeleccionado: React.Dispatch<React.SetStateAction<ProductoDatos[] | null>>;
  ordenCompraActiva: number;
  enviarANuevoProveedor: (data: any) => Promise<void>;
}

const ProductoNuevoProveedorModal = ({
  verProducto,
  procesandoNuevoProveedor,
  proveedorSeleccionado,
  setProveedorSeleccionado,
  ordenCompraActiva,
  enviarANuevoProveedor,
}: DetalleProductoProps) => {
  if (!verProducto) return null;
  const intl = useIntl();
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  // Estados para la paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);

  // Handlers para la paginación
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const proveedoresPaginados = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return verProducto?.slice(startIndex, endIndex) || [];
  }, [verProducto, page, rowsPerPage]);

  const tipoUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.tipo_usuario || 0);
  const idUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.id || 0);

  const isProductoSeleccionado = (productoId: number) => {
    if (!proveedorSeleccionado) return false;
    return proveedorSeleccionado.some((p) => p.id === productoId);
  };

  const hayProductoSeleccionado = proveedorSeleccionado && proveedorSeleccionado.length > 0;

  const handleSeleccionaProducto = (
    event: React.ChangeEvent<HTMLInputElement>,
    producto: ProductoDatos
  ) => {
    if (event.target.checked) {
      setProveedorSeleccionado([producto]);
    } else {
      setProveedorSeleccionado(null);
    }
  };

  return (
    <Box sx={{ px: 2, pb: 2, mt: 3 }}>
      <Grid container spacing={2}>
        {/* Header */}
        <Grid item xs={12}>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography variant="h5" gutterBottom>
              Proveedores que tienen el producto
            </Typography>
          </Box>
        </Grid>

        {/* Información de los productos */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2 }}>
            {proveedoresPaginados.length > 0 ? (
              <>
                <Grid container spacing={2}>
                  {proveedoresPaginados.map((p) => {
                    const isSeleccionado = isProductoSeleccionado(p.id);
                    const isDeshabilitado = hayProductoSeleccionado && !isSeleccionado;

                    return (
                      <Grid item xs={12} sm={6} md={4} key={p.id}>
                        <Card
                          sx={{
                            border: isSeleccionado ? "2px solid #33F299" : "none",
                            display: "flex",
                            flexDirection: "column",
                            height: "100%",
                            overflow: "hidden",
                            transition: "all 0.3s",
                            opacity: isDeshabilitado ? 0.4 : 1,
                            filter: isDeshabilitado ? "grayscale(80%)" : "none",
                            pointerEvents: isDeshabilitado ? "none" : "auto",
                            "&:hover": {
                              boxShadow: 6,
                              transform: "translateY(-4px)",
                            },
                          }}
                        >
                          {/* Fila superior - Nombre del producto */}
                          <Box
                            sx={{
                              overflow: "hidden",
                              display: "flex",
                              flexDirection: "row",
                              bgcolor: isSeleccionado ? "#8ded42" : "#97fe47",
                              p: 1,
                              borderBottom: `2px solid ${pink[100]}`,
                            }}
                          >
                            <Box
                              sx={{
                                flex: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                overflow: "hidden",
                              }}
                            >
                              <MDTypography
                                variant="caption"
                                color="text"
                                sx={{
                                  color: "#2f2f2f",
                                  fontSize: "12px",
                                  fontWeight: 700,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {p.nombre_producto}
                              </MDTypography>
                            </Box>
                          </Box>

                          {/* Información del producto */}
                          <CardContent
                            sx={{
                              flex: 1,
                              p: 2,
                              display: "flex",
                              flexDirection: "column",
                              overflow: "hidden",
                            }}
                          >
                            <Typography
                              variant="button"
                              gutterBottom
                              noWrap
                              sx={{ fontWeight: 600, mb: 2 }}
                            >
                              {p.nombre_proveedor}
                            </Typography>

                            <Box
                              sx={{
                                mt: "auto",
                                display: "flex",
                                flexDirection: "column",
                                gap: 0.5,
                              }}
                            >
                              <MDTypography variant="caption" display="block" color="text" noWrap>
                                {p.categoria ?? "N/A"}
                              </MDTypography>
                              <MDTypography variant="caption" display="block" color="text" noWrap>
                                {p.marca ?? "N/A"}
                              </MDTypography>
                              <MDTypography variant="caption" display="block" color="text" noWrap>
                                {p.sku ?? "N/A"}
                              </MDTypography>
                            </Box>
                          </CardContent>

                          {/* Checkbox de selección */}
                          <Box
                            sx={{
                              overflow: "hidden",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexDirection: "row",
                              bgcolor: isSeleccionado ? "#c8e6c9" : "#dee4f0",
                              p: 0,
                              borderTop: `1px solid ${grey[300]}`,
                            }}
                          >
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={isProductoSeleccionado(p.id)}
                                  onChange={(e) => handleSeleccionaProducto(e, p)}
                                />
                              }
                              label="Seleccionar"
                            />
                          </Box>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>

                {/* Componente de paginación */}
                <MDBox
                  mt={3}
                  sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <TablePagination
                    component="div"
                    count={verProducto.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[4, 8, 10, 12]}
                    labelRowsPerPage="Productos por página:"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                    sx={{
                      direction: "ltr",
                      ".MuiTablePagination-toolbar": {
                        justifyContent: "space-between",
                        padding: "16px 24px",
                      },
                      ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
                        margin: 0,
                      },
                      ".MuiTablePagination-actions svg": {
                        transform: "scaleX(-1)",
                      },
                    }}
                  />
                </MDBox>

                {/* Botón para enviar */}
                <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                  <Button
                    sx={{
                      color: "#fff",
                      background: "#3ec972",
                      fontSize: "0.75rem",
                      padding: "8px 16px",
                      "&:hover": {
                        background: "#35b563",
                      },
                    }}
                    variant="contained"
                    endIcon={<SendIcon />}
                    disabled={
                      procesandoNuevoProveedor ||
                      !proveedorSeleccionado ||
                      proveedorSeleccionado.length === 0
                    }
                    onClick={(e: any) => {
                      const datos = {
                        id_proveedor: proveedorSeleccionado?.[0].id_proveedor,
                        id_producto: proveedorSeleccionado?.[0].id,
                        id_validacion_producto: ordenCompraActiva,
                      };
                      //console.log(datos);
                      enviarANuevoProveedor(datos);
                    }}
                  >
                    {procesandoNuevoProveedor ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                        <span style={{ marginLeft: "8px" }}>Enviando...</span>
                      </>
                    ) : (
                      `Enviar a ${
                        proveedorSeleccionado?.length
                          ? ` ${proveedorSeleccionado?.[0].nombre_proveedor}`
                          : ""
                      }`
                    )}
                  </Button>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  textAlign: "center",
                  py: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  {intl.formatMessage({ id: "no_hay_proveedores_con_el_producto" })}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  El producto no se encuentra disponible con otro proveedor
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
export default ProductoNuevoProveedorModal;
