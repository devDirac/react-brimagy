/**
=========================================================
* Material Dashboard 2 PRO React TS - v1.0.2
=========================================================
*/

import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Avatar,
  Box,
  MenuItem,
  Tooltip,
  Typography,
  Grid,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { useIntl } from "react-intl";
import { useAppSelector, useAppDispatch } from "hocs/useRedux";
import {
  NotificationsOutlined,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as CheckIcon,
  Info as InfoIcon,
  AccessTime,
} from "@mui/icons-material";
import { Button, ButtonGroup } from "react-bootstrap";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDBadge from "components/MDBadge";
import Breadcrumbs from "examples/Breadcrumbs";
import ModalComponent from "../../../components/Modal";

// Material Dashboard 2 PRO React context
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";

import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarDesktopMenu,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

import {
  getNotificacionesPorUsuarioHTTP,
  removeNotificacionHTTP,
  setNotificaciones,
} from "actions/notificaciones";
import { getErrorHttpMessage } from "utils";
import { setAuth } from "actions/auth";
import env from "react-dotenv";
import { StoreType } from "../../../types/genericTypes";
import { useSelector } from "react-redux";

interface Props {
  absolute?: boolean;
  light?: boolean;
  isMini?: boolean;
}

function DashboardNavbar({ absolute, light, isMini }: Props): JSX.Element {
  const intl = useIntl();
  const dispatch_ = useAppDispatch();
  const idUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.id || 0);
  const token = useSelector((state: StoreType) => state?.app?.user?.token || "");
  const notificaciones = useAppSelector((state) => state?.app?.notificaciones || []);

  const [navbarType, setNavbarType] = useState<
    "fixed" | "absolute" | "relative" | "static" | "sticky"
  >();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller;
  const [openMenu, setOpenMenu] = useState<any>(false);
  const route = useLocation().pathname.split("/").slice(1);
  const navigate = useNavigate();

  const [procesando, setProcesando] = useState(false);
  const [procesandoNotificacion, setProcesandoNotificacion] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [mensajeAlert, setMensajeAlert] = useState("");
  const handleisAlertOpen = () => setIsAlertOpen(true);
  const handleisAlerClose = () => setIsAlertOpen(false);

  useEffect(() => {
    setAuth(token);
  }, [token]);

  useEffect(() => {
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    window.addEventListener("scroll", handleTransparentNavbar);
    handleTransparentNavbar();

    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event: any) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  const getTypeColor = (type: number) => {
    return "info.main";
  };

  const getTypeIcon = (type: number) => {
    switch (type) {
      case 1:
        return <InfoIcon fontSize="medium" sx={{ color: getTypeColor(type) }} />;
      default:
        return <InfoIcon fontSize="medium" sx={{ color: getTypeColor(type) }} />;
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "avisos generales":
        return "primary";
      default:
        return "primary";
    }
  };

  const handleAccionNotificacion = async (notificacion: any, accion: string) => {
    try {
      setProcesandoNotificacion(true);
      await removeNotificacionHTTP(notificacion?.id);
      const notificacionesUsuario = await getNotificacionesPorUsuarioHTTP(idUsuario);
      dispatch_(setNotificaciones(notificacionesUsuario));

      if (notificacion?.id_tipo_notificacion === 2) {
        navigate(`/gestion-almacen`);
      }
      if (notificacion?.id_tipo_notificacion === 3) {
        navigate(`/catalogo-encuestas`);
      }

      setProcesandoNotificacion(false);
    } catch (error) {
      setProcesandoNotificacion(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(
        message ||
          intl.formatMessage({
            id: "error_marcar_notificacion",
          })
      );
      handleisAlertOpen();
    }
  };

  // Filtrar solo notificaciones no vistas
  const notificacionesNoVistas = notificaciones.filter((r: any) => r?.vista === 0);
  const cantidadNoVistas = notificacionesNoVistas.length || 0;

  // Render the notifications menu
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      PaperProps={{
        elevation: 3,
        sx: {
          maxHeight: 480,
          width: "400px",
          maxWidth: "400px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          "& .MuiMenuItem-root": {
            px: 2,
            py: 1,
            borderBottom: "1px solid",
            borderColor: "divider",
            "&:last-child": {
              borderBottom: "none",
            },
          },
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <Box
        sx={{
          pt: 1,
          px: 2,
          pb: 1,
          bgcolor: "#0000000d",
          borderBottom: "1px solid",
          borderColor: "#0000000d",
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontSize: "1rem" }}>
          {intl.formatMessage({
            id: "notificaciones",
          })}
        </Typography>
        {cantidadNoVistas > 0 && (
          <Typography variant="caption" color="text.secondary">
            {intl.formatMessage({
              id: "notificaciones_1",
            })}{" "}
            ({cantidadNoVistas}){" "}
            {intl.formatMessage({
              id: "notificaciones_2",
            })}
            {cantidadNoVistas !== 1 ? "es" : ""}{" "}
            {intl.formatMessage({
              id: "notificaciones_3",
            })}
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          flex: 1,
          paddingTop: "10px",
          paddingBottom: "30px",
          overflow: "auto",
          maxHeight: "calc(480px - 100px)",
        }}
      >
        {cantidadNoVistas === 0 ? (
          <Box
            sx={{
              py: 6,
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            <NotificationsOutlined fontSize="large" sx={{ mb: 1, opacity: 0.3 }} />
            <br />
            <Typography variant="caption" color="text">
              {intl.formatMessage({
                id: "no_notificaciones_nuevas",
              })}
            </Typography>
          </Box>
        ) : (
          notificacionesNoVistas
            .sort((a: any, b: any) => new Date(b?.creada).getTime() - new Date(a?.creada).getTime())
            .map((notification: any, index: number) => (
              <MenuItem
                style={{ cursor: "default" }}
                className={`notification-item ${
                  !notification.vista ? "unread" : ""
                } text-${getBackgroundColor(notification.tipo_notificacion)}`}
                key={index}
                sx={{
                  m: 0.5,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 1,
                  bgcolor: !notification.vista ? "action.hover" : "transparent",
                  borderLeft: !notification.vista ? "4px solid red" : "none",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    display: "flex",
                    alignItems: "flex-start",
                    width: "100%",
                    gap: 1,
                  }}
                >
                  <Avatar
                    sx={{
                      background: "#ced4da69",
                      width: 30,
                      height: 30,
                      bgcolor: getBackgroundColor(notification.tipo_notificacion),
                    }}
                  >
                    {getTypeIcon(notification.id_tipo_notificacion)}
                  </Avatar>
                  <Box
                    sx={{
                      flex: 1,
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                    }}
                  >
                    <p
                      style={{ margin: 0, padding: 0, fontWeight: "bold" }}
                      className={"text-" + getBackgroundColor(notification.tipo_notificacion)}
                    >
                      {notification.descripcion}{" "}
                    </p>
                    <p
                      className="fs-75 m-0 text-black notification-description"
                      style={{
                        display: "-webkit-box",
                      }}
                    >
                      {notification.detalle}
                    </p>
                    <span className="fs-75 text-muted">
                      <AccessTime
                        sx={{ width: "13px", mt: "-2px", opacity: 0.8 }}
                        fontSize="small"
                      />{" "}
                      {notification.creada}
                    </span>
                    <div>
                      <ButtonGroup>
                        {notification?.id_tipo_notificacion === 4 && (
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => {
                              handleAccionNotificacion(notification, "ir");
                            }}
                          >
                            {intl.formatMessage({
                              id: "general_ir",
                            })}
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => {
                            handleAccionNotificacion(notification, "eliminar");
                          }}
                        >
                          {intl.formatMessage({
                            id: "marcar_leida",
                          })}
                        </Button>
                      </ButtonGroup>
                    </div>
                  </Box>
                </Box>
              </MenuItem>
            ))
        )}
      </Box>
      {procesandoNotificacion && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
          }}
        >
          <CircularProgress size={24} color="primary" />
        </Box>
      )}
    </Menu>
  );

  const iconsStyle = ({
    palette: { dark, white, text },
    functions: { rgba },
  }: {
    palette: any;
    functions: any;
  }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });

  return (
    <>
      <AppBar
        position={absolute ? "absolute" : navbarType}
        color="inherit"
        sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
      >
        <Toolbar sx={navbarContainer}>
          <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
            <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
            <IconButton
              sx={navbarDesktopMenu}
              onClick={handleMiniSidenav}
              size="medium"
              disableRipple
            >
              <Icon fontSize="medium" sx={iconsStyle}>
                {miniSidenav ? "menu_open" : "menu"}
              </Icon>
            </IconButton>
          </MDBox>
          {isMini ? null : (
            <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
              <MDBox color={light ? "white" : "inherit"}>
                <IconButton
                  size="small"
                  style={{ cursor: "pointer" }}
                  disableRipple
                  color="inherit"
                  sx={navbarIconButton}
                  aria-controls="atras-menu"
                  aria-haspopup="true"
                  onClick={() => navigate(-1)}
                >
                  <ArrowBackIcon fontSize="medium" color="primary" />
                </IconButton>
                <Link to="/logoutPage">
                  <Tooltip title="Cerrar Sesión">
                    <IconButton sx={navbarIconButton} size="small" disableRipple>
                      <LogoutIcon />
                    </IconButton>
                  </Tooltip>
                </Link>
                <Link to="/perfil-usuario">
                  <IconButton sx={navbarIconButton} size="small" disableRipple>
                    <Icon sx={iconsStyle}>account_circle</Icon>
                  </IconButton>
                </Link>
                <IconButton
                  size="small"
                  disableRipple
                  color="inherit"
                  sx={navbarMobileMenu}
                  onClick={handleMiniSidenav}
                >
                  <Icon sx={iconsStyle} fontSize="medium">
                    {miniSidenav ? "menu_open" : "menu"}
                  </Icon>
                </IconButton>
                <IconButton
                  size="small"
                  disableRipple
                  color="inherit"
                  sx={navbarIconButton}
                  onClick={handleConfiguratorOpen}
                >
                  <Icon sx={iconsStyle}>settings</Icon>
                </IconButton>
                <IconButton
                  size="small"
                  color="inherit"
                  sx={navbarIconButton}
                  onClick={handleOpenMenu}
                >
                  <MDBadge
                    badgeContent={cantidadNoVistas > 99 ? "+99" : cantidadNoVistas}
                    color="error"
                    size="xs"
                    circular
                  >
                    <Icon sx={iconsStyle}>notifications</Icon>
                  </MDBadge>
                </IconButton>
                {renderMenu()}
              </MDBox>
            </MDBox>
          )}
        </Toolbar>

        <ModalComponent handleClose={handleisAlerClose} isOpen={isAlertOpen} key={"alerta"}>
          <Grid container spacing={2} style={{ textAlign: "center" }}>
            <Grid item xs={12}>
              <br />
              <br />
              <p>{mensajeAlert}</p>
            </Grid>
          </Grid>
        </ModalComponent>
        <Backdrop className="BackdropClass" open={procesando}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </AppBar>
    </>
  );
}

DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

export default DashboardNavbar;
