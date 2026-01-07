import {
  useState,
  useEffect,
  useMemo,
  JSXElementConstructor,
  Key,
  ReactElement,
  useCallback,
} from "react";
import _ from "lodash";
// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
import logo from "assets/images/profile_icon.png";

// Material Dashboard 2 PRO React TS components
import MDBox from "./components/MDBox";

// Material Dashboard 2 PRO React TS exampless
import Sidenav from "./examples/Sidenav";
import Configurator from "./examples/Configurator";

// Material Dashboard 2 PRO React TS themes
import theme from "./assets/theme";
import themeRTL from "./assets/theme/theme-rtl";
import { useSelector } from "react-redux";

// Material Dashboard 2 PRO React TS Dark Mode themes
import themeDark from "./assets/theme-dark";
import themeDarkRTL from "./assets/theme-dark/theme-rtl";

// Material Dashboard 2 PRO React TS routes
import { StoreType } from "./types/genericTypes";
import routes from "./routes";
import textosMx from "./idiomas/mx";
import textoEn from "./idiomas/en";

// Material Dashboard 2 PRO React TS contexts
import {
  setOpenConfigurator,
  setFixedNavbar,
  setMiniSidenav,
  useMaterialUIController,
  setTransparentSidenav,
  setDarkMode,
  setWhiteSidenav,
  setSidenavColor,
} from "context";
import { IntlProvider, ReactIntlErrorCode } from "react-intl";
import { setAuth } from "./actions/auth";

// Images
import brandBrimagy from "./assets/images/Brimagy-Logo-Verde.svg";
import brandWhite from "./assets/images/logo-ct.png";
import brandDark from "./assets/images/logo-ct-dark.png";
import PublicRouter from "./hocs/PublicRouter";
import LoginPageIlustrator from "./pages/LoginPageIlustrator";
import NotFoundPage from "./pages/NotFoundPage";
import { Avatar } from "@mui/material";
import PrivateRouter from "hocs/PrivateRouter";
import MainPage from "./pages/MainPage";
import LogoutPage from "./pages/logoutPage";
import PasswordRecoverPage from "./pages/PasswordRecoverPage";
import PasswordRecoverValidationPage from "./pages/PasswordRecoverValidationPage";
import NuevoUsuario from "./pages/NuevoUsuario";
import ListaUsuarios from "./pages/ListaUsuarios";
import OpcionesMenuSeleccionadoPage from "./pages/OpcionesMenuSeleccionadoPage";
import AddMultiplesUsuarios from "pages/addMultiplesUsuarios";
import NuevoProducto from "pages/NuevoProducto";
import CatalogoProductos from "pages/CatalogoProductos";
import CategoriasProveedores from "pages/CategoriasProveedores";
import ListaProductos from "pages/ListaProductos";
import ListaCanjeos from "pages/ListaCanjeos";
import ValidarIdentidad from "pages/ValidarIdentidad";

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();
  const inSession = useSelector((state: StoreType) => state?.app?.user?.token || false);
  const userName = useSelector((state: StoreType) => state?.app?.user?.data?.name || false);
  const fotoUser = useSelector((state: StoreType) => state?.app?.user?.data?.foto || logo);
  const tipoUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.tipo_usuario || []);
  const ruta = useSelector((state: StoreType) => state?.app?.ruta || null);
  const local = useSelector((state: StoreType) => state?.app?.idioma || "mx");

  useEffect(() => {
    inSession && setAuth(inSession);
  }, [inSession]);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  const loadLocaleData = (locale: string) => {
    if (locale === "en") {
      return textoEn;
    }
    return textosMx;
  };

  const onError = (e: any) => {
    if (e.code === ReactIntlErrorCode.MISSING_DATA) {
      return;
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  const routes_ = {
    name: userName,
    icon: <Avatar className="AvatarUser" alt={userName || ""} src={fotoUser} />,
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );

  return (
    <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
      <CssBaseline />
      <IntlProvider onError={onError} locale={local} messages={loadLocaleData(local)}>
        {inSession && (
          <>
            <Sidenav
              key={""}
              color={sidenavColor}
              brand={
                (transparentSidenav && !darkMode) || whiteSidenav ? brandBrimagy : brandBrimagy
              }
              //brandName=""
              routes={routes
                .filter((r: any) => (r?.allow || []).includes(tipoUsuario))
                .map((a: any, key: any) => {
                  return key === 0
                    ? {
                        ...a,
                        ...routes_,
                      }
                    : a;
                })}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
            <Configurator />
            {configsButton}
          </>
        )}
        <Routes>
          {/* inicia rutas publicas */}
          <Route path="/validar-canje/:codigo" element={<ValidarIdentidad />} />

          <Route path="/login" element={<PublicRouter />}>
            <Route path="/login" element={<LoginPageIlustrator />} />
          </Route>
          <Route path="/recupera-password" element={<PublicRouter />}>
            <Route path="/recupera-password" element={<PasswordRecoverPage />} />
          </Route>
          <Route path="/recupera-password-validacion" element={<PublicRouter />}>
            <Route
              path="/recupera-password-validacion"
              element={<PasswordRecoverValidationPage />}
            />
          </Route>

          <Route path="/" element={<PrivateRouter path="/login" />}>
            {/* AUTH */}
            <Route path="/logoutPage" element={<LogoutPage />} />
            {/* MAIN */}
            <Route path="/" element={<MainPage />} />
            <Route path="/inicio" element={<MainPage />} />
            <Route path="/estadisticas" element={<MainPage />} />
            <Route path="/navegacion" element={<OpcionesMenuSeleccionadoPage />} />

            {/* USUARIOS */}
            <Route path="/lista-usuarios" element={<ListaUsuarios />} />
            <Route path="/nuevo-usuario" element={<NuevoUsuario />} />
            {/* PRODUCTOS */}
            <Route path="/nuevo-producto" element={<NuevoProducto />} />
            <Route path="/catalogo-productos" element={<ListaProductos />} />
            <Route path="/categorias-proveedores" element={<CategoriasProveedores />} />
            {/* CANJES */}
            <Route path="/catalogo-canjes" element={<ListaCanjeos />} />
          </Route>
          {/* inicia pagina no encontrada */}
          <Route path="*" element={<NotFoundPage />} />
          {/* fin pagina no encontrada */}
        </Routes>
      </IntlProvider>
    </ThemeProvider>
  );
}
