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

// @mui material components
import { Checkbox, Paper, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useIntl } from "react-intl";
import { styled } from "@mui/material/styles";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Avatar, Badge, IconButton, Button, Box } from "@mui/material";

// NewUser page components
import FormField from "layouts/pages/users/new-user/components/FormField";
import InputField from "components/InputField";
import { AddUserFormProps } from "./types";
import { useUserInfo } from "./useUserForm";
import { useEffect, useState } from "react";
import { FormikProvider } from "formik";
import { Form } from "react-bootstrap";
import CampoAvatar from "components/CampoAvatar";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import LogoDevIcon from "@mui/icons-material/LogoDev";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import FaceSharpIcon from "@mui/icons-material/FaceSharp";

const UserPermiso: React.FC<AddUserFormProps> = (props: AddUserFormProps) => {
  if (!props.formik) {
    return null;
  }
  const {
    darkMode,
    nombre,
    correo,
    password,
    password_confirm,
    telefono,
    foto,
    setNombre,
    setCorreo,
    setPassword,
    setPassword_confirm,
    setTelefono,
    setFoto,
    setImagen,
    permisos,
    setPermisos,
  } = useUserInfo(props);
  const notificarCambios = () => {
    if (props.onDatosChange) {
      props.onDatosChange({
        permisos,
      });
    }
  };
  useEffect(() => {
    notificarCambios();
  }, [permisos]);

  const isSuperAdmin = props?.permisoUser === 3;
  const isEditor = props?.permisoUser === 2;

  const items = [
    ...(isSuperAdmin
      ? [
          { nombre: "Super Admin", color: "#6d45a6", icon: LogoDevIcon, id: 3 },
          { nombre: "Editor", color: "#1976d2", icon: FaceSharpIcon, id: 2 },
        ]
      : []),
    ...(isEditor
      ? [
          { nombre: "Super Admin", color: "#6d45a6", icon: LogoDevIcon, id: 3 },
          { nombre: "Editor", color: "#1976d2", icon: FaceSharpIcon, id: 2 },
        ]
      : []),
    { nombre: "Usuario", color: "#ed6c02", icon: PersonAddAltIcon, id: 1 },
  ];

  const gridSize = 12 / items.length;

  return (
    <MDBox>
      <MDBox lineHeight={0}>
        <MDTypography variant="h5">Permisos</MDTypography>
        <MDTypography variant="button" color="text">
          Selecciona el permiso del usuario
        </MDTypography>
      </MDBox>
      <MDBox mt={1.625}>
        <FormikProvider value={props?.formik}>
          <Form.Group className="mb-3 ">
            <Grid container spacing={3}>
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <Grid item xs={6} sm={gridSize} key={item.nombre}>
                    <Paper
                      elevation={props.formik!.values.permiso === item.nombre ? 8 : 3}
                      sx={{
                        p: 3,
                        textAlign: "center",
                        cursor: "pointer",
                        border:
                          props.formik!.values.permiso === item.nombre
                            ? `3px solid ${item.color}`
                            : "3px solid transparent",
                        "&:hover": { transform: "translateY(-10px)" },
                      }}
                      onClick={() => {
                        setPermisos(item.id);
                        props.formik!.setFieldValue("permiso", item.nombre);
                      }}
                    >
                      <Icon
                        sx={{
                          width: "100%",
                          height: "70px",
                          color: props.formik!.values.permiso === item.nombre ? item.color : "grey",
                        }}
                      />
                      <Typography variant="h6">{item.nombre}</Typography>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Form.Group>
        </FormikProvider>
      </MDBox>
    </MDBox>
  );
};

export default UserPermiso;
