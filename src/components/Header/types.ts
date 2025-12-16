export interface HeaderProps {
  tipoUsuario?: number | TipoUsuario[];
  nombreUsuario?: string | false;
  fotoPerfil?: string;
}
interface TipoUsuario {
  id: number;
}
