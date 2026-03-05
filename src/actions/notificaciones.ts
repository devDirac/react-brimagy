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
  try {
    const response: any = await axios.get(
      `${env.API_URL}${"/getNotificacionesPorUsuario"}?id_usuario_para=${id}`
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};

export const removeNotificacionHTTP = async (id: any) => {
  try {
    const response: any = await axios.put(`${env.API_URL}${"/removeNotificacion"}`, { id });
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
