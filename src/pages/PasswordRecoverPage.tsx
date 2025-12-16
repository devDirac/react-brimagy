import IllustrationLayout from "../layouts/authentication/components/IllustrationLayout";
import bgImage from "../assets/images/background_login.jpg";
import MDBox from "../components/MDBox";
import MDTypography from "../components/MDTypography";
import { Link } from "react-router-dom";
import ModalComponent from "../components/Modal";
import { Grid } from "@mui/material";
import "./styles.scss";
import { usePasswordRecoverPage } from "./customHooksPages/usePasswordRecoverPage";
import PasswordRecover from "components/PasswordRecover";

const LoginPageIlustrator = () => {
  const { procesando, recuperaPassword, isAlertOpen, handleisAlerClose, mensajeAlert, intl } =
    usePasswordRecoverPage();
  return (
    <IllustrationLayout
      title={intl.formatMessage({ id: "recupera_password_page_titulo" })}
      description={intl.formatMessage({ id: "recupera_password_ingresa_correo" })}
      illustration={bgImage}
    >
      <MDBox component="form" role="form">
        <PasswordRecover procesando={procesando} enAccion={(d) => recuperaPassword(d)} />
        <MDBox mt={3} textAlign="center">
          <MDTypography variant="button" color="white">
            <MDTypography
              component={Link}
              to="/login"
              variant="button"
              color="info"
              fontWeight="medium"
              textGradient
            >
              {intl.formatMessage({ id: "iniciar_sesion" })}
            </MDTypography>
          </MDTypography>
        </MDBox>
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

export default LoginPageIlustrator;
