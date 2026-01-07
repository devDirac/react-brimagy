/**
=========================================================
* Material Dashboard 2 PRO React TS - v1.0.2
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-2-pro-react-ts
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useMemo, useState } from "react";

// formik components
import { Formik, Form } from "formik";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";

// Material Dashboard 2 PRO React TS examples components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import logo from "assets/images/profile_icon.png";
import Footer from "examples/Footer";

import { useSelector } from "react-redux";
import { StoreType } from "../types/genericTypes";
import {
  Backdrop,
  Box,
  Button,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Radio,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ModalComponent from "components/Modal";
import Header from "components/Header";
import MDTypography from "components/MDTypography";
import TablePagination from "@mui/material/TablePagination";
import { green, pink } from "@mui/material/colors";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModalConfirm from "components/ModalConfirm/ModalConfirm";
import SearchIcon from "@mui/icons-material/Search";

import { styled } from "@mui/material/styles";
import Badge, { BadgeProps } from "@mui/material/Badge";
import { numericFormatter } from "react-number-format";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useListaCanjeos } from "./customHooksPages/useListaCanjeos";
import TagIcon from "@mui/icons-material/Tag";
import DetallesCanjeModal from "components/DetallesVistas/DetalleCanje";

function ListaCanjeos(): JSX.Element {
  const tipoUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.tipo_usuario || 0);
  const userName = useSelector((state: StoreType) => state?.app?.user?.data?.name || false);
  const fotoUser: any = useSelector((state: StoreType) => state?.app?.user?.data?.foto || logo);

  // Estados para la paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  const {
    validarIdentidad,
    verCanje,
    setVerCanje,
    isAlertOpenVerCanje,
    handleisAlertCloseVerCanje,
    handleisAlertOpenVerCanje,
    isSuperAdmin,
    handleBuscadorChange,
    buscador,
    setBuscador,
    navigate,
    procesando,
    isAlertOpen,
    handleisAlerClose,
    mensajeAlert,
    intl,
    errorLogin,
    setProcesando,
    setCanjeId,
    canjeId,
    procesandoEditar,
    tableKey,
    canjes,
    isPDFViewerOpen,
    handleClosePDFViewer,
    handleOpenPDFViewer,
    procesandoIdentidad,
  } = useListaCanjeos(tipoUsuario);

  const independiente = () => {
    return !canjes?.length && !procesando ? (
      <Grid container spacing={2}>
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <h3>Sin registros</h3>
        </Grid>
      </Grid>
    ) : null;
  };
  const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: 0,
      top: 5,
      padding: "0",
      fontSize: "10px",
    },
  }));
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

  const estadosValidacionMap: { [key: string]: string } = {
    NOTIFICACION_ENVIADA: "EN ESPERA DE VALIDACIÓN DE IDENTIDAD",
    SOLICITUD_ENVIADA: "SOLICITUD DE CÓDIGO ENVIADA",
    IDENTIDAD_VALIDADA: "IDENTIDAD VALIDADA",
  };

  const traducirEstadoValidacion = (estado: string | null): string => {
    if (!estado) return "SIN ESTADO";
    const estadoUpper = estado.toUpperCase();
    return estadosValidacionMap[estadoUpper] || estadoUpper;
  };

  // Calcular las pólizas a mostrar en la página actual
  const canjesPaginados = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return canjes?.slice(startIndex, endIndex) || [];
  }, [canjes, page, rowsPerPage]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Header tipoUsuario={tipoUsuario} nombreUsuario={userName} fotoPerfil={fotoUser} />
      <MDBox py={3} mb={20}>
        <Grid container spacing={2} mb={2}>
          <Grid item xs={8}></Grid>
          <Grid
            item
            xs={4}
            sm={4}
            sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <TextField
              id="buscador"
              fullWidth
              label={intl.formatMessage({ id: "input_buscador" })}
              variant="standard"
              name="buscador"
              value={buscador || ""}
              onChange={handleBuscadorChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="medium" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
        {canjes?.length > 0 ? (
          <>
            <Grid container spacing={2}>
              {canjesPaginados.map((p: any, key: number) => {
                return (
                  <Grid item xs={12} sm={6} md={4} lg={4} key={p.id || key}>
                    <Card
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        overflow: "hidden",
                        transition: "all 0.3s",
                        "&:hover": {
                          boxShadow: 6,
                          transform: "translateY(-4px)",
                        },
                      }}
                    >
                      <Chip
                        icon={<AutoAwesomeIcon />}
                        label={traducirEstadoValidacion(p.estado_validacion?.toUpperCase())}
                        sx={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          flexDirection: "row",
                          bgcolor: pink[50],
                          p: 1,
                          fontWeight: 500,
                          borderRadius: "0 0 0 20px",
                          background: "#eb2fa5",
                          maxWidth: "150px",
                          height: "auto",
                          whiteSpace: "normal",
                          "& .MuiChip-label": {
                            whiteSpace: "normal",
                            overflow: "visible",
                            textOverflow: "clip",
                            display: "block",
                            lineHeight: "12px",
                            color: "#FFF9C4 !important",
                          },
                          "& .MuiChip-icon": {
                            color: "#FFF9C4 !important",
                            fontSize: "20px !important",
                            width: "20px !important",
                            height: "20px !important",
                            marginTop: "2px",
                            alignSelf: "flex-start",
                          },
                        }}
                      />
                      {/* Fila superior*/}
                      <Box
                        sx={{
                          overflow: "hidden",
                          display: "flex",
                          flexDirection: "row",
                          bgcolor: "#a5eb2f",
                          p: 1,
                          borderBottom: `2px solid #02999e`,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            p: 1,
                          }}
                        >
                          <TagIcon
                            sx={{
                              color: "#eb2fa5",
                              fontSize: 48,
                            }}
                          />
                        </Box>
                        <Box
                          sx={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            overflow: "hidden",
                          }}
                        >
                          <MDTypography
                            variant="caption"
                            color="text"
                            sx={{
                              paddingLeft: "10px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              fontWeight: 600,
                              color: green[900],
                            }}
                          >
                            {p.folio}
                          </MDTypography>
                        </Box>
                      </Box>

                      {/* Fila inferior - Iconos a la izquierda, Info a la derecha */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          flex: 1,
                          overflow: "hidden",
                        }}
                      >
                        {/* Columna izquierda - Iconos de acción */}
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 1,
                            p: 1.5,
                            bgcolor: "grey.50",
                            borderRight: "1px solid",
                            borderColor: "grey.200",
                          }}
                        >
                          <Tooltip title="Vista Previa">
                            <IconButton
                              aria-label="ver"
                              size="small"
                              color="default"
                              onClick={() => {
                                setVerCanje(p);
                                handleisAlertOpenVerCanje();
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>

                        {/* Columna derecha - Información */}
                        <CardContent
                          sx={{
                            flex: 1,
                            p: 2,
                            display: "flex",
                            flexDirection: "column",
                            overflow: "hidden",
                          }}
                        >
                          <Tooltip title={p.nombre_premio}>
                            <Typography
                              variant="button"
                              gutterBottom
                              noWrap
                              sx={{ fontWeight: 600 }}
                            >
                              {p.nombre_premio}
                            </Typography>
                          </Tooltip>
                        </CardContent>
                      </Box>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

            {/* Componente de paginación */}
            <MDBox mt={3} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TablePagination
                component="div"
                count={canjes.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[3, 6, 9, 12]}
                labelRowsPerPage="Canjes por página:"
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
          </>
        ) : !procesando ? (
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <h3>{intl.formatMessage({ id: "sin_canjes_registrados" })}</h3>
            </Grid>
          </Grid>
        ) : null}
      </MDBox>
      <Footer />
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={procesando}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <ModalConfirm
        onAcept={() => {
          //setOpenModalConfirmEliminaProducto(false);
          //eliminarProducto(Number(productoId));
        }}
        onCancel={() => {
          //setOpenModalConfirmEliminaProducto(false);
        }}
        open={/*openModalConfirmEliminaProducto*/ false}
        text={intl.formatMessage({
          id: "eliminar_producto_confirmar",
        })}
        title={""}
        cancelText="No"
        acceptText={intl.formatMessage({
          id: "si",
        })}
      />
      {/* VISUALIZAR DATOS DEL PRODUCTO */}
      <ModalComponent
        handleClose={handleisAlertCloseVerCanje}
        isOpen={isAlertOpenVerCanje}
        key={"alertaVerDatos"}
      >
        <Grid container spacing={2} style={{ textAlign: "center" }}>
          {verCanje ? (
            <>
              <DetallesCanjeModal
                verCanje={verCanje}
                isPDFViewerOpen={isPDFViewerOpen}
                handleClosePDFViewer={handleClosePDFViewer}
                handleOpenPDFViewer={handleOpenPDFViewer}
                validarIdentidad={validarIdentidad}
                procesandoIdentidad={procesandoIdentidad}
              />
            </>
          ) : null}
        </Grid>
      </ModalComponent>
      <ModalComponent handleClose={handleisAlerClose} isOpen={isAlertOpen} key={"alerta"}>
        <Grid container spacing={2} style={{ textAlign: "center" }}>
          <Grid item xs={12}>
            <br />
            <br />
            <p>{mensajeAlert}</p>
          </Grid>
        </Grid>
      </ModalComponent>
    </DashboardLayout>
  );
}

export default ListaCanjeos;
