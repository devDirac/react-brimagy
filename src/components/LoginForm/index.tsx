import { FormikProvider } from "formik";
import React from "react";
import type { LoginFormProps } from "./types";
import { useLoginForm } from "./useLoginForm";
import { Backdrop, Button, CircularProgress, Grid, TextField } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";

const LoginForm: React.FC<LoginFormProps> = (props: LoginFormProps) => {
  const {
    isValidPassword,
    isValidEmail,
    formik,
    email,
    setEmail,
    password,
    setPassword,
    navigate,
    darkMode,
    intl,
  } = useLoginForm();

  return (
    <div style={{ width: "100%" }}>
      <FormikProvider value={formik}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <TextField
              id="email"
              fullWidth
              label={intl.formatMessage({ id: "input_email_descripcion" })}
              variant="standard"
              name="email"
              value={email}
              onChange={(e) => {
                const value = e.target.value;
                formik!.setFieldValue("email", value);
                setEmail(value);
              }}
              onBlur={formik!.handleBlur}
              error={formik!.touched.email && Boolean(formik!.errors.email)}
              helperText={formik!.touched.email && formik!.errors.email}
              sx={{
                "& .MuiInputLabel-root": {
                  color: isValidEmail ? "#00AB16" : undefined,
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: isValidEmail ? "#00AB16" : undefined,
                },
                "& .MuiInput-underline:before": {
                  borderBottomColor: isValidEmail ? "#00AB16" : undefined,
                },
                "& .MuiInputBase-input": {
                  color: isValidEmail ? "#00AB16" : undefined,
                },
                "& input:-webkit-autofill": {
                  WebkitBoxShadow: "0 0 0 100px transparent inset !important",
                  WebkitTextFillColor: isValidEmail ? "#00AB16" : "inherit",
                  transition: "background-color 5000s ease-in-out 0s",
                },
                "& input:-webkit-autofill:hover": {
                  WebkitBoxShadow: "0 0 0 100px transparent inset !important",
                },
                "& input:-webkit-autofill:focus": {
                  WebkitBoxShadow: "0 0 0 100px transparent inset !important",
                },
                "& input:-webkit-autofill:active": {
                  WebkitBoxShadow: "0 0 0 100px transparent inset !important",
                },
              }}
            ></TextField>
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              id="password"
              fullWidth
              label={intl.formatMessage({ id: "input_contrasena_descripcion" })}
              variant="standard"
              name="password"
              type="password"
              value={password}
              onChange={(e) => {
                const value = e.target.value;
                formik!.setFieldValue("password", value);
                setPassword(value);
              }}
              onBlur={formik!.handleBlur}
              error={formik!.touched.password && Boolean(formik!.errors.password)}
              helperText={formik!.touched.password && formik!.errors.password}
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
                "& input:-webkit-autofill": {
                  WebkitBoxShadow: "0 0 0 100px transparent inset !important",
                  WebkitTextFillColor: isValidPassword ? "#00AB16" : "inherit",
                  transition: "background-color 5000s ease-in-out 0s",
                },
                "& input:-webkit-autofill:hover": {
                  WebkitBoxShadow: "0 0 0 100px transparent inset !important",
                },
                "& input:-webkit-autofill:focus": {
                  WebkitBoxShadow: "0 0 0 100px transparent inset !important",
                },
                "& input:-webkit-autofill:active": {
                  WebkitBoxShadow: "0 0 0 100px transparent inset !important",
                },
              }}
            ></TextField>
          </Grid>
          <br />
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <Button
              sx={{ color: "#fff", background: "#084d6e" }}
              variant="contained"
              endIcon={<LoginIcon />}
              disabled={props?.procesando || !formik.dirty || !formik.isValid}
              onClick={(e) => {
                props?.enAccion({ email, password });
              }}
            >
              {intl.formatMessage({ id: "login_form_component_acceder" })}
            </Button>
          </Grid>
          <Backdrop style={{ zIndex: 1000, color: "#fff" }} open={props?.procesando}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </Grid>
      </FormikProvider>
    </div>
  );
};

export default LoginForm;
