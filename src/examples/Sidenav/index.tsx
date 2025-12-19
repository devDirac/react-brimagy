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

import { useEffect, useMemo, useState, useCallback, ReactNode } from "react";
import _ from "lodash";
import env from "react-dotenv";
import { useSelector, useDispatch } from "react-redux";
import { StoreType } from "../../types/genericTypes";

// react-router-dom components
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../hocs/useRedux";

// @mui material components
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";
import AppsIcon from "@mui/icons-material/Dashboard";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React TS examples components
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";
import SidenavList from "examples/Sidenav/SidenavList";
import SidenavItem from "examples/Sidenav/SidenavItem";

// Custom styles for the Sidenav
import SidenavRoot from "examples/Sidenav/SidenavRoot";
import sidenavLogoLabel from "examples/Sidenav/styles/sidenav";

// Material Dashboard 2 PRO React context
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
  setDarkMode,
  setFixedNavbar,
  setSidenavColor,
} from "context";
import ModalComponent from "components/Modal";
import { Avatar, Grid, SpeedDial } from "@mui/material";
import MenuHome from "components/MenuHome/MenuHome";
import logoIcono from "assets/images/logo_icono-sf.png";

// Declaring props types for Sidenav
interface Props {
  color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "dark";
  brand?: string;
  brandName?: string;
  routes: {
    [key: string]:
      | ReactNode
      | string
      | {
          [key: string]:
            | ReactNode
            | string
            | {
                [key: string]: ReactNode | string;
              }[];
        }[];
  }[];
  [key: string]: any;
}

function Sidenav({ color, brand, brandName, routes, ...rest }: Props): JSX.Element {
  const navigate = useNavigate();
  const dispatch_ = useAppDispatch();
  const nameUsuario = useAppSelector((state) => state?.app?.user?.data?.name || "");
  const ruta = useAppSelector((state) => state?.app?.ruta || null);
  const superAdministrador = useAppSelector((state) => state?.app?.user?.data?.tipo_usuario);
  const id_usuario = useAppSelector((state) => state?.app?.user?.data?.id || 0);
  const ajustes_sitio = useAppSelector((state) => state?.app?.user?.data?.ajustes_sitio || []);
  const tipoUsuario = useAppSelector((state) => state?.app?.user?.data?.tipo_usuario || []);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [mensajeAlert, setMensajeAlert] = useState("");
  const handleisAlertOpen = () => setIsAlertOpen(true);
  const handleisAlerClose = () => {
    navigate(`/inicio`);
    setIsAlertOpen(false);
  };
  const [isAlertMenuOpen, setIsAlertMenuOpen] = useState(false);
  const handleisAlertMenuOpen = () => setIsAlertMenuOpen(true);
  const handleisAlertMenuClose = () => setIsAlertMenuOpen(false);

  const [isAlertProgreso, setIsAlertProgreso] = useState(false);
  const [mensajeBienvenida, setMensajeBienvenida] = useState("");
  const [openCollapse, setOpenCollapse] = useState<boolean | string>(false);
  const [openNestedCollapse, setOpenNestedCollapse] = useState<boolean | string>(false);
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode } = controller;
  const location = useLocation();
  const { pathname } = location;
  const collapseName = useMemo(() => {
    return pathname.split("/").slice(1)[0];
  }, [pathname]);
  const items = pathname.split("/").slice(1);
  const itemParentName = useMemo(() => {
    return items[1];
  }, [items]);
  const itemName = items[items.length - 1];

  let textColor:
    | "primary"
    | "secondary"
    | "info"
    | "success"
    | "warning"
    | "error"
    | "dark"
    | "white"
    | "inherit"
    | "text"
    | "light" = "white";

  if (transparentSidenav || (whiteSidenav && !darkMode)) {
    textColor = "dark";
  } else if (whiteSidenav && darkMode) {
    textColor = "inherit";
  }

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  useEffect(() => {
    setOpenCollapse(collapseName);
    setOpenNestedCollapse(itemParentName);
  }, [collapseName, itemParentName]);

  useEffect(() => {
    // A function that sets the mini state of the sidenav.
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
      setTransparentSidenav(dispatch, window.innerWidth < 1200 ? false : transparentSidenav);
      setWhiteSidenav(dispatch, window.innerWidth < 1200 ? false : whiteSidenav);
    }

    /** 
     The event listener that's calling the handleMiniSidenav function when resizing the window.
    */
    window.addEventListener("resize", handleMiniSidenav);

    // Call the handleMiniSidenav function to set the state with the initial value.
    //handleMiniSidenav();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, location, transparentSidenav, whiteSidenav]);

  const setAjustes = useCallback(() => {
    if (!_.isEmpty(ajustes_sitio)) {
      setDarkMode(dispatch, (ajustes_sitio?.[0]?.tema_claro_oscuro || 0) === 1 ? true : false);
      setMiniSidenav(dispatch, (ajustes_sitio?.[0]?.menu_lateral_mini || 0) === 1 ? true : false);
      setFixedNavbar(dispatch, (ajustes_sitio?.[0]?.cabecera_fija || 0) === 1 ? true : false);
      setSidenavColor(dispatch, ajustes_sitio?.[0]?.color_menu_lateral || "primary");
    }
    if ((ajustes_sitio?.[0]?.tipo_menu_lateral || "") === "trasparent") {
      setTransparentSidenav(dispatch, true);
      setWhiteSidenav(dispatch, false);
    }

    if ((ajustes_sitio?.[0]?.tipo_menu_lateral || "") === "white") {
      setWhiteSidenav(dispatch, true);
      setTransparentSidenav(dispatch, false);
    }

    if ((ajustes_sitio?.[0]?.tipo_menu_lateral || "") === "dark") {
      setWhiteSidenav(dispatch, false);
      setTransparentSidenav(dispatch, false);
    }
  }, [ajustes_sitio]);

  useEffect(() => {
    setAjustes();
  }, [setAjustes]);

  // Render all the nested collapse items from the routes.js
  const renderNestedCollapse = (collapse: any) => {
    const template = collapse
      .filter((c: any) => (c?.allow || []).includes(tipoUsuario))
      .map(({ name, route, key, href }: any) =>
        href ? (
          <Link
            key={key}
            href={href}
            target="_blank"
            rel="noreferrer"
            sx={{ textDecoration: "none" }}
          >
            <SidenavItem name={name} nested />
          </Link>
        ) : (
          <NavLink to={route} key={key} style={{ textDecoration: "none" }}>
            <SidenavItem name={name} active={route === pathname} nested />
          </NavLink>
        )
      );

    return template;
  };
  // Render the all the collpases from the routes.js
  const renderCollapse = (collapses: any) =>
    collapses
      .filter((c: any) => (c?.allow || []).includes(tipoUsuario))
      .map(({ name, collapse, route, href, key }: any) => {
        let returnValue;

        if (collapse) {
          returnValue = (
            <SidenavItem
              key={key}
              color={color}
              name={name}
              active={key === itemParentName ? "isParent" : false}
              open={openNestedCollapse === key}
              onClick={({ currentTarget }: any) =>
                openNestedCollapse === key && currentTarget.classList.contains("MuiListItem-root")
                  ? setOpenNestedCollapse(false)
                  : setOpenNestedCollapse(key)
              }
            >
              {renderNestedCollapse(collapse)}
            </SidenavItem>
          );
        } else {
          returnValue = href ? (
            <Link
              href={href}
              key={key}
              target="_blank"
              rel="noreferrer"
              sx={{ textDecoration: "none" }}
            >
              <SidenavItem color={color} name={name} active={key === itemName} />
            </Link>
          ) : (
            <NavLink to={route} key={key} style={{ textDecoration: "none" }}>
              <SidenavItem color={color} name={name} active={key === itemName} />
            </NavLink>
          );
        }
        return <SidenavList key={key}>{returnValue}</SidenavList>;
      });

  // Render all the routes from the routes.js (All the visible items on the Sidenav)
  const renderRoutes = routes.map(
    ({ type, name, icon, title, collapse, noCollapse, key, href, route }: any) => {
      let returnValue;

      if (type === "collapse") {
        if (href) {
          returnValue = (
            <Link
              href={href}
              key={key}
              target="_blank"
              rel="noreferrer"
              sx={{ textDecoration: "none" }}
            >
              <SidenavCollapse
                name={name}
                icon={icon}
                active={key === collapseName}
                noCollapse={noCollapse}
              />
            </Link>
          );
        } else if (noCollapse && route) {
          returnValue = (
            <NavLink to={route} key={key}>
              <SidenavCollapse
                name={name}
                icon={icon}
                noCollapse={noCollapse}
                active={key === collapseName}
              >
                {collapse ? renderCollapse(collapse) : null}
              </SidenavCollapse>
            </NavLink>
          );
        } else {
          returnValue = (
            <SidenavCollapse
              key={key}
              name={name}
              icon={icon}
              active={key === collapseName}
              open={openCollapse === key}
              onClick={() => (openCollapse === key ? setOpenCollapse(false) : setOpenCollapse(key))}
            >
              {collapse ? renderCollapse(collapse) : null}
            </SidenavCollapse>
          );
        }
      } else if (type === "title") {
        returnValue = (
          <MDTypography
            key={key}
            color={textColor}
            display="block"
            variant="caption"
            fontWeight="bold"
            textTransform="uppercase"
            pl={3}
            mt={2}
            mb={1}
            ml={1}
          >
            {title}
          </MDTypography>
        );
      } else if (type === "divider") {
        returnValue = (
          <Divider
            key={key}
            light={
              (!darkMode && !whiteSidenav && !transparentSidenav) ||
              (darkMode && !transparentSidenav && whiteSidenav)
            }
          />
        );
      }

      return returnValue;
    }
  );

  return (
    <>
      {ruta ? (
        <SidenavRoot
          {...rest}
          variant="permanent"
          ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
        >
          <MDBox pt={3} pb={1} px={4} textAlign="center">
            <MDBox
              display={{ xs: "block", xl: "none" }}
              position="absolute"
              top={0}
              right={0}
              p={1.625}
              onClick={closeSidenav}
              sx={{ cursor: "pointer" }}
            >
              <MDTypography variant="h6" color="secondary">
                <Icon sx={{ fontWeight: "bold" }}>close</Icon>
              </MDTypography>
            </MDBox>
            <MDBox
              component={NavLink}
              to="/"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              {brand && (
                <MDBox
                  component="img"
                  src={brand}
                  alt="Brimagy"
                  width={!brandName ? "60%" : undefined}
                />
              )}
              {brandName && (
                <MDBox
                  width={!brandName ? "100%" : undefined}
                  sx={(theme: any) => sidenavLogoLabel(theme, { miniSidenav })}
                >
                  <MDTypography
                    component="h6"
                    variant="button"
                    fontWeight="medium"
                    color={textColor}
                  >
                    {brandName}
                  </MDTypography>
                </MDBox>
              )}
            </MDBox>
          </MDBox>
          <Divider
            light={
              (!darkMode && !whiteSidenav && !transparentSidenav) ||
              (darkMode && !transparentSidenav && whiteSidenav)
            }
          />
          <List>{renderRoutes}</List>
          <ModalComponent handleClose={handleisAlerClose} isOpen={isAlertOpen} key={"alerta"}>
            <Grid container spacing={2} style={{ textAlign: "center" }}>
              <Grid item xs={12}>
                <br />
                <br />
                <p>{mensajeAlert}</p>
              </Grid>
            </Grid>
          </ModalComponent>
        </SidenavRoot>
      ) : null}

      <ModalComponent
        titleBoton={"MINIMIZAR"}
        size={"xl"}
        handleClose={handleisAlertMenuClose}
        isOpen={isAlertMenuOpen}
        key={"______"}
      >
        <MenuHome onSeleccion={handleisAlertMenuClose} />
      </ModalComponent>

      <SpeedDial
        onClick={() => {
          handleisAlertMenuOpen();
        }}
        FabProps={{
          sx: {
            bgcolor: "#2f2f2f",
            "&:hover": {
              bgcolor: "#171717",
            },
          },
        }}
        ariaLabel="SpeedDial basic example"
        sx={{ position: "fixed", bottom: "95px", right: "10px", width: "100px" }}
        icon={
          <Avatar src={logoIcono} alt="Icon" sx={{ width: 32, height: 32 }} />
        } /*<AppsIcon fontSize="medium" />*/
      />
    </>
  );
}

// Declaring default props for Sidenav
Sidenav.defaultProps = {
  color: "info",
  brand: "",
};

export default Sidenav;
