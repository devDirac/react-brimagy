import { FormikProvider } from "formik";
import React from "react";
import type { usePasswordRecoverProps } from "./types";
import { usePasswordRecover } from "./usePasswordRecover";
import { Backdrop, Button, CircularProgress, Grid, TextField } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";

const PasswordRecover: React.FC<usePasswordRecoverProps> = (props: usePasswordRecoverProps) => {
  const { isValidEmail, formik, email, setEmail, navigate, darkMode, intl } = usePasswordRecover();

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
                // Quitar fondo amarillo del autocompletado
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
          <br />
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <Button
              sx={{ color: "#fff", background: "#084d6e" }}
              variant="contained"
              endIcon={<LoginIcon />}
              disabled={props?.procesando || !formik.dirty || !formik.isValid}
              onClick={(e) => {
                props?.enAccion({ email });
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

export default PasswordRecover;
