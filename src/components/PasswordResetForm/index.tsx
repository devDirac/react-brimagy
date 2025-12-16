import React from "react";
import { Backdrop, Button, CircularProgress, Grid, TextField } from "@mui/material";
import { FormikProvider } from "formik";
import InputField from "../InputField";
import type { passwordResetFormProps } from "./types";
//import "./index.scss";
import usePasswordResetForm from "./usePasswordResetForm";
import LockOpenIcon from "@mui/icons-material/LockOpen";

const PasswordResetForm: React.FC<passwordResetFormProps> = (props: passwordResetFormProps) => {
  const {
    isValidPassword,
    isValidPasswordConfirm,
    formik,
    password,
    setPassword,
    passwordConfirm,
    setPasswordConfirm,
    intl,
  } = usePasswordResetForm();

  return (
    <Grid container spacing={2}>
      <FormikProvider value={formik}>
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
                color: isValidPassword ? "#93e56f" : undefined,
              },
              "& .MuiInput-underline:after": {
                borderBottomColor: isValidPassword ? "#93e56f" : undefined,
              },
              "& .MuiInput-underline:before": {
                borderBottomColor: isValidPassword ? "#93e56f" : undefined,
              },
              "& .MuiInputBase-input": {
                color: isValidPassword ? "#93e56f" : undefined,
              },
              // Quitar fondo amarillo del autocompletado
              "& input:-webkit-autofill": {
                WebkitBoxShadow: "0 0 0 100px transparent inset !important",
                WebkitTextFillColor: isValidPassword ? "#93e56f" : "inherit",
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
            id="passwordConfirm"
            fullWidth
            label={intl.formatMessage({ id: "input_contrasena_confirmacion" })}
            variant="standard"
            name="passwordConfirm"
            type="password"
            value={passwordConfirm}
            onChange={(e) => {
              const value = e.target.value;
              formik!.setFieldValue("passwordConfirm", value);

              setPasswordConfirm(value);
            }}
            onBlur={formik!.handleBlur}
            error={formik!.touched.passwordConfirm && Boolean(formik!.errors.passwordConfirm)}
            helperText={formik!.touched.passwordConfirm && formik!.errors.passwordConfirm}
            sx={{
              "& .MuiInputLabel-root": {
                color: isValidPasswordConfirm ? "#93e56f" : undefined,
              },
              "& .MuiInput-underline:after": {
                borderBottomColor: isValidPasswordConfirm ? "#93e56f" : undefined,
              },
              "& .MuiInput-underline:before": {
                borderBottomColor: isValidPasswordConfirm ? "#93e56f" : undefined,
              },
              "& .MuiInputBase-input": {
                color: isValidPasswordConfirm ? "#93e56f" : undefined,
              },
              // Quitar fondo amarillo del autocompletado
              "& input:-webkit-autofill": {
                WebkitBoxShadow: "0 0 0 100px transparent inset !important",
                WebkitTextFillColor: isValidPasswordConfirm ? "#93e56f" : "inherit",
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
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <Button
            sx={{ color: "#fff", background: "#084d6e" }}
            variant="contained"
            endIcon={<LockOpenIcon />}
            disabled={!password || !passwordConfirm}
            onClick={(e) => {
              props?.enAccion({ password, passwordConfirm });
            }}
          >
            {intl.formatMessage({ id: "general_actualizar_contra" })}
          </Button>
        </Grid>
        <Backdrop style={{ zIndex: 1000, color: "#fff" }} open={props?.procesando}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </FormikProvider>
    </Grid>
  );
};

export default PasswordResetForm;
