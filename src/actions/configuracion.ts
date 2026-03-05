import { GeneralHttpResponse } from "../types/genericTypes";
import axios from "axios";
import env from "react-dotenv";

export const crearVariablesGlobalesHttp = async (data: any) => {
  try {
    const response: GeneralHttpResponse = await axios.post(
      `${env.API_URL}${"/crearVariablesGlobales"}`,
      data
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};

export const crearPlataformaHttp = async (data: any) => {
  try {
    const response: GeneralHttpResponse = await axios.post(
      `${env.API_URL}${"/crearPlataforma"}`,
      data
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};

export const sincronizarVariablesEnProductosHttp = async () => {
  try {
    const response: GeneralHttpResponse = await axios.put(
      `${env.API_URL}${"/sincronizarVariablesEnProductos"}`
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};

export const getVariablesGlobalesHttp = async () => {
  try {
    const response = await axios.get(`${env.API_URL}/getVariablesGlobales`);
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};

export const getPlataformasHttp = async () => {
  try {
    const response = await axios.get(`${env.API_URL}/getPlataformas`);
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};

export const getProductosSincronizadosHttp = async () => {
  try {
    const response = await axios.get(`${env.API_URL}/getProductosSincronizados`);
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
