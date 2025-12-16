import { Backdrop, CircularProgress, Grid } from "@mui/material";
import bgImage from "../assets/images/background_login.jpg";
import PasswordResetForm from "../components/PasswordResetForm";
import { usePasswordRecoverValidationPage } from "./customHooksPages/usePasswordRecoverValidationPage";
import ModalComponent from "../components/Modal";
//import "./styles.scss";
import IllustrationLayout from "layouts/authentication/components/IllustrationLayout";
import MDBox from "components/MDBox";

const PasswordRecoverValidationPage = () => {
  const {
    queryParameters,
    isValidToken,
    procesando,
    actualizaPassword,
    isAlertOpen,
    handleisAlerClose,
    mensajeAlert,
    intl,
  } = usePasswordRecoverValidationPage();

  return (
    <IllustrationLayout illustration={bgImage}>
      <MDBox component="form" role="form">
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <h3 style={{ color: "#fff" }}>
            {intl.formatMessage({ id: "password_recover_validacion_page_titulo" })}
          </h3>
          <br></br>
        </Grid>
        {(!queryParameters.get("token") || !isValidToken) && !procesando ? (
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <h1>{intl.formatMessage({ id: "password_recover_validacion_page_token_invalido" })}</h1>
          </Grid>
        ) : null}
        {queryParameters.get("token") && isValidToken && !procesando ? (
          <Grid item xs={12}>
            <PasswordResetForm procesando={procesando} enAccion={actualizaPassword} />
          </Grid>
        ) : null}
        <Backdrop style={{ zIndex: 1000, color: "#fff" }} open={procesando}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </MDBox>
      <ModalComponent handleClose={handleisAlerClose} isOpen={isAlertOpen} key={"alerta"}>
        <Grid container spacing={2} style={{ textAlign: "center" }}>
          <Grid item xs={12}>
            <br />
            <br />
            <p>{mensajeAlert}</p>
          </Grid>
        </Grid>
      </ModalComponent>
    </IllustrationLayout>
  );
};

export default PasswordRecoverValidationPage;
