const LINEAS_POR_DEFECTO = 2;

interface SharedTextoRecortadoProps {
    texto: string;
    lineas?: number;
}

export const SharedTextoRecortado = ({
    texto,
    lineas = LINEAS_POR_DEFECTO,
}: SharedTextoRecortadoProps): JSX.Element => (
    <span
        title={texto}
        style={{
            display: "-webkit-box",
            WebkitLineClamp: lineas,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            wordBreak: "break-word",
        }}
    >
        {texto}
    </span>
);
