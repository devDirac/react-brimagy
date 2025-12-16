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
import { styled } from "@mui/material/styles";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Avatar, Badge, IconButton, Button, Box } from "@mui/material";

// NewUser page components
import FormField from "layouts/pages/users/new-user/components/FormField";
import InputField from "components/InputField";

function UserInfo({ formData }: any): JSX.Element {
  const { formField, values, errors, touched } = formData;
  const { firstName, lastName, company, email, password, repeatPassword } = formField;
  const {
    firstName: firstNameV,
    lastName: lastNameV,
    company: companyV,
    email: emailV,
    password: passwordV,
    repeatPassword: repeatPasswordV,
  } = values;

  const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: 22,
    height: 22,
    border: `2px solid ${theme.palette.background.paper}`,
  }));

  return (
    <MDBox>
      <MDBox lineHeight={0}>
        <MDTypography variant="h5">Sobre mi</MDTypography>
        <MDTypography variant="button" color="text">
          Información de perfil
        </MDTypography>
      </MDBox>
      <MDBox mt={1.625}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField style={{ width: "100%" }} id="nombre" label="Nombre" variant="standard" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              style={{ width: "100%" }}
              id="direccion_fiscal"
              label="Dirección"
              variant="standard"
            />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField style={{ width: "100%" }} id="rfc" label="RFC" variant="standard" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField style={{ width: "100%" }} id="correo" label="Correo" variant="standard" />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              style={{ width: "100%" }}
              id="telefono"
              label="Teléfono"
              variant="standard"
            />
          </Grid>
          <Grid item xs={12} sm={6}></Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormField
              type={password.type}
              label={password.label}
              name={password.name}
              value={passwordV}
              placeholder={password.placeholder}
              error={errors.password && touched.password}
              success={passwordV.length > 0 && !errors.password}
              inputProps={{ autoComplete: "" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              type={repeatPassword.type}
              label={repeatPassword.label}
              name={repeatPassword.name}
              value={repeatPasswordV}
              placeholder={repeatPassword.placeholder}
              error={errors.repeatPassword && touched.repeatPassword}
              success={repeatPasswordV.length > 0 && !errors.repeatPassword}
              inputProps={{ autoComplete: "" }}
            />
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  );
}

export default UserInfo;
