export interface HeaderProps {
  tipoUsuario?: number | TipoUsuario[];
  nombreUsuario?: string | false;
  fotoPerfil?: string;
  onCanjeValidado?: () => void;
}
interface TipoUsuario {
  id: number;
}
