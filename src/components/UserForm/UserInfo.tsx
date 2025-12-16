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
import { TextField } from "@mui/material";
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
import { useEffect } from "react";
import { FormikProvider } from "formik";
import { Form } from "react-bootstrap";
import CampoAvatar from "components/CampoAvatar";

const UserInfo: React.FC<AddUserFormProps> = (props: AddUserFormProps) => {
  const {
    intl,
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
    usuario,
    setUsuario,
  } = useUserInfo(props);

  const notificarCambios = () => {
    if (props.onDatosChange) {
      props.onDatosChange({
        usuario,
        nombre,
        correo,
        telefono,
        password,
        password_confirm,
        foto,
      });
    }
  };
  useEffect(() => {
    notificarCambios();
  }, [usuario, nombre, correo, telefono, password, password_confirm, foto]);

  const isValidUsuario =
    props.formik!.touched.usuario &&
    !props.formik!.errors.usuario &&
    props.formik!.values.usuario &&
    props.formik!.values.usuario !== "";

  const isValidNombre =
    props.formik!.touched.nombre &&
    !props.formik!.errors.nombre &&
    props.formik!.values.nombre &&
    props.formik!.values.nombre !== "";

  const isValidCorreo =
    props.formik!.touched.correo &&
    !props.formik!.errors.correo &&
    props.formik!.values.correo &&
    props.formik!.values.correo !== "";

  const isValidTelefono =
    props.formik!.touched.telefono &&
    !props.formik!.errors.telefono &&
    props.formik!.values.telefono &&
    props.formik!.values.telefono !== "";

  const isValidPassword =
    props.formik!.touched.password &&
    !props.formik!.errors.password &&
    props.formik!.values.password &&
    props.formik!.values.password !== "";

  const isValidPasswordConfirm =
    props.formik!.touched.password_confirm &&
    !props.formik!.errors.password_confirm &&
    props.formik!.values.password_confirm &&
    props.formik!.values.password_confirm !== "";

  return (
    <MDBox>
      <MDBox lineHeight={0}>
        <MDTypography variant="h5">Información del Usuario</MDTypography>
        <MDTypography variant="button" color="text">
          Perfil general
        </MDTypography>
      </MDBox>
      <MDBox mt={1.625}>
        <FormikProvider value={props.formik!}>
          <Form.Group className="mb-3 ">
            <Grid container spacing={3} mb={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="usuario"
                  fullWidth
                  label={intl.formatMessage({ id: "input_usuario" })}
                  variant="standard"
                  name="usuario"
                  value={usuario}
                  onChange={(e) => {
                    const value = e.target.value;
                    props.formik!.setFieldValue("usuario", value);
                    setUsuario(value);
                  }}
                  onBlur={props.formik!.handleBlur}
                  error={props.formik!.touched.usuario && Boolean(props.formik!.errors.usuario)}
                  helperText={props.formik!.touched.usuario && props.formik!.errors.usuario}
                  sx={{
                    "& .MuiInputLabel-root": {
                      color: isValidUsuario ? "#00AB16" : undefined,
                    },
                    "& .MuiInput-underline:after": {
                      borderBottomColor: isValidUsuario ? "#00AB16" : undefined,
                    },
                    "& .MuiInput-underline:before": {
                      borderBottomColor: isValidUsuario ? "#00AB16" : undefined,
                    },
                    "& .MuiInputBase-input": {
                      color: isValidUsuario ? "#00AB16" : undefined,
                    },
                  }}
                ></TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="nombre"
                  fullWidth
                  label={intl.formatMessage({ id: "input_nombre" })}
                  variant="standard"
                  name="nombre"
                  value={nombre}
                  onChange={(e) => {
                    const value = e.target.value;
                    props.formik!.setFieldValue("nombre", value);
                    setNombre(value);
                  }}
                  onBlur={props.formik!.handleBlur}
                  error={props.formik!.touched.nombre && Boolean(props.formik!.errors.nombre)}
                  helperText={props.formik!.touched.nombre && props.formik!.errors.nombre}
                  sx={{
                    "& .MuiInputLabel-root": {
                      color: isValidNombre ? "#00AB16" : undefined,
                    },
                    "& .MuiInput-underline:after": {
                      borderBottomColor: isValidNombre ? "#00AB16" : undefined,
                    },
                    "& .MuiInput-underline:before": {
                      borderBottomColor: isValidNombre ? "#00AB16" : undefined,
                    },
                    "& .MuiInputBase-input": {
                      color: isValidNombre ? "#00AB16" : undefined,
                    },
                  }}
                ></TextField>
              </Grid>
            </Grid>
            <Grid container spacing={3} mb={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="correo"
                  fullWidth
                  label={intl.formatMessage({ id: "input_correo" })}
                  variant="standard"
                  name="correo"
                  value={correo}
                  onChange={(e) => {
                    const value = e.target.value;
                    props.formik!.setFieldValue("correo", value);
                    setCorreo(value);
                  }}
                  onBlur={props.formik!.handleBlur}
                  error={props.formik!.touched.correo && Boolean(props.formik!.errors.correo)}
                  helperText={props.formik!.touched.correo && props.formik!.errors.correo}
                  sx={{
                    "& .MuiInputLabel-root": {
                      color: isValidCorreo ? "#00AB16" : undefined,
                    },
                    "& .MuiInput-underline:after": {
                      borderBottomColor: isValidCorreo ? "#00AB16" : undefined,
                    },
                    "& .MuiInput-underline:before": {
                      borderBottomColor: isValidCorreo ? "#00AB16" : undefined,
                    },
                    "& .MuiInputBase-input": {
                      color: isValidCorreo ? "#00AB16" : undefined,
                    },
                  }}
                ></TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="telefono"
                  fullWidth
                  label={intl.formatMessage({ id: "input_telefono" })}
                  variant="standard"
                  name="telefono"
                  value={telefono}
                  onChange={(e) => {
                    const value = e.target.value;
                    props.formik!.setFieldValue("telefono", value);
                    setTelefono(value);
                  }}
                  onBlur={props.formik!.handleBlur}
                  error={props.formik!.touched.telefono && Boolean(props.formik!.errors.telefono)}
                  helperText={props.formik!.touched.telefono && props.formik!.errors.telefono}
                  sx={{
                    "& .MuiInputLabel-root": {
                      color: isValidTelefono ? "#00AB16" : undefined,
                    },
                    "& .MuiInput-underline:after": {
                      borderBottomColor: isValidTelefono ? "#00AB16" : undefined,
                    },
                    "& .MuiInput-underline:before": {
                      borderBottomColor: isValidTelefono ? "#00AB16" : undefined,
                    },
                    "& .MuiInputBase-input": {
                      color: isValidTelefono ? "#00AB16" : undefined,
                    },
                  }}
                ></TextField>
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="password"
                  fullWidth
                  label={intl.formatMessage({ id: "input_password" })}
                  variant="standard"
                  name="password"
                  value={password}
                  onChange={(e) => {
                    const value = e.target.value;
                    props.formik!.setFieldValue("password", value);
                    setPassword(value);
                  }}
                  onBlur={props.formik!.handleBlur}
                  error={props.formik!.touched.password && Boolean(props.formik!.errors.password)}
                  helperText={props.formik!.touched.password && props.formik!.errors.password}
                  sx={{
                    "& .MuiInputLabel-root": {
                      color: isValidPassword ? "#00AB16" : undefined,
                    },
                    "& .MuiInput-underline:after": {
                      borderBottomColor: isValidPassword ? "#00AB16" : undefined,
                    },
                    "& .MuiInput-underline:before": {
                      borderBottomColor: isValidPassword ? "#00AB16" : undefined,
                    },
                    "& .MuiInputBase-input": {
                      color: isValidPassword ? "#00AB16" : undefined,
                    },
                  }}
                ></TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="password_confirm"
                  fullWidth
                  label={intl.formatMessage({ id: "input_password_confirm" })}
                  variant="standard"
                  name="password_confirm"
                  value={password_confirm}
                  onChange={(e) => {
                    const value = e.target.value;
                    props.formik!.setFieldValue("password_confirm", value);
                    setPassword_confirm(value);
                  }}
                  onBlur={props.formik!.handleBlur}
                  error={
                    props.formik!.touched.password_confirm &&
                    Boolean(props.formik!.errors.password_confirm)
                  }
                  helperText={
                    props.formik!.touched.password_confirm && props.formik!.errors.password_confirm
                  }
                  sx={{
                    "& .MuiInputLabel-root": {
                      color: isValidPasswordConfirm ? "#00AB16" : undefined,
                    },
                    "& .MuiInput-underline:after": {
                      borderBottomColor: isValidPasswordConfirm ? "#00AB16" : undefined,
                    },
                    "& .MuiInput-underline:before": {
                      borderBottomColor: isValidPasswordConfirm ? "#00AB16" : undefined,
                    },
                    "& .MuiInputBase-input": {
                      color: isValidPasswordConfirm ? "#00AB16" : undefined,
                    },
                  }}
                ></TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <h5>Avatar</h5>
                <CampoAvatar foto={foto} alt={correo} onChangeImage={setImagen} />
                <br />
              </Grid>
            </Grid>
          </Form.Group>
        </FormikProvider>
      </MDBox>
    </MDBox>
  );
};

export default UserInfo;
