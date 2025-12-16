import { LoginAction } from "../components/LoginForm/types";

export interface HttpResponse {
  success: boolean;
  data: {
    employees: any;
  };
}

export interface GeneralHttpResponse {
  config: any;
  data: HttpResponse;
  headers: any;
  request: any;
  status: number;
  statusText: string;
}

export interface AppType {
  user: LoginAction;
  employees: any;
  upload: string[];
  idioma: string;
  catalogos: any;
  espacio: any;
  ruta: any;
  notificaciones: any[];
}

export interface StoreType {
  app: AppType;
}
