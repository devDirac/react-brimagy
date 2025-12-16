export interface usePasswordRecoverProps {
  procesando: boolean;
  enAccion: (data: { email: string }) => void;
}
