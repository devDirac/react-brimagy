import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { StoreType } from "../types/genericTypes";
import ModalComponent from "../components/Modal";
import { Alert, Grid, Snackbar, Stack } from "@mui/material";
import moment from "moment";

interface PrivateRouterProps {
  path: string;
}

const PrivateRouter: React.FC<PrivateRouterProps> = (props: PrivateRouterProps) => {
  const userId = useSelector((state: any) => state?.app?.user?.data?.id || false);
  const espacio = useSelector((state: any) => state?.app?.espacio || null);
  const esPromotor = useSelector(
    (state: any) => (state?.app?.user?.data?.id_tipo_usuario || 0) === 2
  );
  const esAgente = useSelector(
    (state: any) => (state?.app?.user?.data?.id_tipo_usuario || 0) === 3
  );
  const [notifications, setNotifications] = useState<any>([]); // Lista de notificaciones

  // Función para cerrar una notificación
  const handleClose = (id: any) => {
    setNotifications((prev: any) =>
      prev.map(
        (notif: any) => (notif.id === id ? { ...notif, open: false } : notif) // Cambia "open" a false
      )
    );
  };

  // Eliminar notificación después de cerrarse
  const handleClosed = (id: any) => {
    setNotifications((prev: any) => prev.filter((notif: any) => notif.id !== id)); // Elimina la notificación
  };

  // Eliminar notificación después de cerrarse
  const handleExited = (id: any) => {
    setNotifications((prev: any) => prev.filter((notif: any) => notif.id !== id)); // Elimina la notificación
  };

  const [tiempoRestante, setTiempoRestante] = useState(0);
  const dispatch = useDispatch();
  const conteo: any = useRef(null);

  const navigate = useNavigate();

  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const [results, setResults] = useState<any>([]);

  const handleisAlertOpen = () => setIsAlertOpen(true);

  const handleisAlerClose = () => {
    setIsAlertOpen(false);
    if (conteo) {
      clearTimeout(conteo.current);
    }
  };

  const formatTime = (time: any) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const inSession = useSelector((state: StoreType) => state?.app?.user?.token || false);
  return inSession ? (
    <>
      <Outlet />
      <ModalComponent handleClose={handleisAlerClose} isOpen={isAlertOpen} key={"alerta"}>
        <Grid container spacing={2} style={{ textAlign: "center" }}>
          <Grid item xs={12}>
            <br />
            <br />
            <p>Se ha detectado inactividad</p>
            <p>
              Si no se detecta actividad en menos de <strong>{formatTime(tiempoRestante)}</strong>
            </p>
            <p>Por seguridad se cerrara esta sesión</p>
          </Grid>
        </Grid>
      </ModalComponent>

      {/* Contenedor para apilar las notificaciones */}
      <Stack
        spacing={2}
        sx={{ position: "fixed", top: 16, right: 16, zIndex: 1300 }} // Posición fija
      >
        {notifications.map((notif: any) => (
          <Snackbar
            key={notif.id}
            open={notif.open}
            autoHideDuration={7000}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            onClose={(event, reason) => {
              if (reason === "timeout") {
                handleClose(notif.id); // Cambia el estado "open" a false
              }
            }}
            onAnimationEnd={() => {
              if (!notif.open) {
                handleClosed(notif.id); // Elimina la notificación del estado
              }
            }}
          >
            <Alert
              severity={notif.severity}
              onClose={() => handleClose(notif.id)} // Cierra al presionar el botón "close"
              sx={{ width: "100%" }}
            >
              {notif.message}
            </Alert>
          </Snackbar>
        ))}
      </Stack>
    </>
  ) : (
    <Navigate to={props?.path} />
  );
};

export default PrivateRouter;
