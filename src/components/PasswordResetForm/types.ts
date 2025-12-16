export interface passwordResetFormProps {
  procesando: boolean;
  enAccion: (value: { password: string; passwordConfirm: string }) => void;
}
