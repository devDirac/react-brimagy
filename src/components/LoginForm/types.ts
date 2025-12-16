export interface TipoUsuario {
  id: number;
  tipo: string;
  created_at: string;
  updated_at: string;
}
export interface UserD {
  id?: number;
  name?: string;
  email?: string;
  telefono?: string;
  foto?: string;
  tipo_usuario?: number;
  created_at?: string;
  updated_at?: string;
}
export interface LoginAction {
  email?: UserD | string;
  data?: UserD;
  token?: string;
  password?: string;
}
export interface LoginFormProps {
  procesando: boolean;
  enAccion: (data: LoginAction) => void;
}
