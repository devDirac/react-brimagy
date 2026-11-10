import axios from "axios";
import env from "react-dotenv";
export const SET_NOTIFICACIONES = "@SET_NOTIFICACIONES";

export const setNotificaciones = (value: any) => {
  return {
    type: SET_NOTIFICACIONES,
    value,
  };
};

export const getNotificacionesPorUsuarioHTTP = async (id: number) => {
  const response = await axios.get(
    `${env.API_URL}/getNotificacionesPorUsuario?id_usuario_para=${id}`
  );
  return response?.data || [];
};

export const removeNotificacionHTTP = async (id: any) => {
  const response = await axios.put(`${env.API_URL}/removeNotificacion`, { id });
  return response?.data || [];
};
