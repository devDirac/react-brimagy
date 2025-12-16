import React from "react";
import DefaultInfoCard from "../../examples/Cards/InfoCards/DefaultInfoCard";
import HomeIcon from "@mui/icons-material/Home";
import { Grid } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { setMenuRoutes } from "../../actions/menu";
import ModalComponent from "../../components/Modal";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import useMenuHome from "./useMenuHome";
import "./style.scss";
import _ from "lodash";

const MenuHome = (props: any) => {
  const {
    navigate,
    intl,
    newRoutes,
    superAdministrador,
    dispatch,
    mensajeAlert,
    isAlertOpen,
    darkMode,
  } = useMenuHome(props);
  return (
    <Grid container spacing={2} style={{ textAlign: "center" }}>
      <Grid item xs={12} md={12}>
        <h1 style={{ color: darkMode ? "white" : "#344767" }}>
          {intl.formatMessage({ id: "menu_home_titulo" })}
        </h1>
      </Grid>

      {
        <Grid item xs={12} md={3}>
          <DefaultInfoCard
            color={"info"}
            icon={<HomeIcon />}
            title={intl.formatMessage({ id: "menu_regresar_inicio" })}
            elemento={{}}
            onSelec={(_: any) => {
              props?.onSeleccion();
              navigate("/inicio");
            }}
          />
        </Grid>
      }

      {newRoutes
        ?.filter((w) => w?.name)
        .map((e, key) => {
          return (
            <Grid item xs={12} md={3} key={key}>
              <DefaultInfoCard
                color={"info"}
                icon={e?.icon}
                title={e?.name || ""}
                elemento={e}
                onSelec={(e: any) => {
                  dispatch(setMenuRoutes(e));
                  props?.onSeleccion();
                  !e?.route ? navigate("/navegacion") : navigate(e?.route);
                }}
              />
            </Grid>
          );
        })}
      {
        <Grid item xs={12} md={3}>
          <DefaultInfoCard
            color={"info"}
            icon={<LoginIcon />}
            title={intl.formatMessage({ id: "menu_cerrar_sesion" })}
            elemento={{}}
            onSelec={(_: any) => {
              props?.onSeleccion();
              navigate("/logoutPage");
            }}
          />
        </Grid>
      }
    </Grid>
  );
};

export default MenuHome;
