import { Spinner } from "react-bootstrap";

interface Props {
  cargando: boolean;
  texto: string;
  textoCargando: string;
}

/** Texto de botón que cambia a spinner + "…" mientras la acción está en curso. */
const TextoCargando = ({ cargando, texto, textoCargando }: Props) =>
  cargando ? (
    <>
      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
      {textoCargando}...{" "}
    </>
  ) : (
    <>{texto}</>
  );

export default TextoCargando;
