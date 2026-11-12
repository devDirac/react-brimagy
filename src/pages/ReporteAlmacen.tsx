import Grid from "@mui/material/Grid";
import { useSelector } from "react-redux";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Header from "components/Header";
import logo from "assets/images/profile_icon.png";
import { StoreType } from "../types/genericTypes";
import { ReporteSemanalAlmacen } from "modules/reporteSemanalAlmacen";
import MDBox from "components/MDBox";
import { Card, CardContent, Typography } from "@mui/material";

function ReporteAlmacenPage(): JSX.Element {
    const tipoUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.tipo_usuario || 0);
    const userName = useSelector((state: StoreType) => state?.app?.user?.data?.name || false);
    const fotoUser: any = useSelector((state: StoreType) => state?.app?.user?.data?.foto || logo);

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Header tipoUsuario={tipoUsuario} nombreUsuario={userName} fotoPerfil={fotoUser} />
            <MDBox py={2}>
                <Card>
                    <CardContent>
                        <Grid container justifyContent="center" alignItems="center" sx={{ height: "100%", mt: 1 }}>
                            <Typography variant="h4" gutterBottom>
                                Reporte de Almacén
                            </Typography>
                        </Grid>
                        <Grid container spacing={2}>
                            <ReporteSemanalAlmacen />
                        </Grid>
                    </CardContent>
                </Card>
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
}

export default ReporteAlmacenPage;