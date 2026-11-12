import type { ReactNode } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import SummarizeOutlinedIcon from "@mui/icons-material/SummarizeOutlined";

const normalizar = (texto: string): string =>
    texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

const ICONOS_POR_VERBO: ReadonlyArray<[string[], ReactNode]> = [
    [["buscar", "consultar", "filtrar"], <SearchRoundedIcon fontSize="small" />],
    [["generar", "reporte"], <SummarizeOutlinedIcon fontSize="small" />],
    [["descargar", "exportar"], <FileDownloadOutlinedIcon fontSize="small" />],
    [["cargar", "subir", "adjuntar"], <FileUploadOutlinedIcon fontSize="small" />],
    [["eliminar", "borrar"], <DeleteOutlineRoundedIcon fontSize="small" />],
    [["rechazar"], <CancelOutlinedIcon fontSize="small" />],
    [
        ["aprobar", "aceptar", "confirmar"],
        <CheckCircleOutlineRoundedIcon fontSize="small" />,
    ],
    [["enviar"], <SendRoundedIcon fontSize="small" />],
    [["editar", "modificar"], <EditOutlinedIcon fontSize="small" />],
    [["agregar", "anadir", "nuevo", "nueva", "crear"], <AddRoundedIcon fontSize="small" />],
    [["entrar", "iniciar sesion", "acceder"], <LoginRoundedIcon fontSize="small" />],
    [["cerrar", "cancelar"], <CloseRoundedIcon fontSize="small" />],
    [["guardar", "salvar", "actualizar"], <SaveOutlinedIcon fontSize="small" />],
];

const GERUNDIOS_POR_VERBO: ReadonlyArray<[string[], string]> = [
    [["buscar", "consultar", "filtrar"], "Buscando"],
    [["generar"], "Generando"],
    [["descargar", "exportar"], "Descargando"],
    [["cargar", "subir", "adjuntar"], "Cargando"],
    [["eliminar", "borrar"], "Eliminando"],
    [["rechazar"], "Rechazando"],
    [["aprobar", "aceptar", "confirmar"], "Procesando"],
    [["enviar"], "Enviando"],
    [["editar", "modificar"], "Editando"],
    [["registrar"], "Registrando"],
    [["agregar", "anadir", "nuevo", "nueva", "crear"], "Agregando"],
    [["entrar", "iniciar sesion", "acceder"], "Entrando"],
    [["actualizar"], "Actualizando"],
    [["guardar", "salvar"], "Guardando"],
];

const TEXTO_PROCESO_NEUTRO = "Procesando";

const buscarPorVerbo = <T,>(
    texto: string,
    mapa: ReadonlyArray<[string[], T]>
): T | undefined => {
    const normalizado = normalizar(texto);

    if (normalizado === "") {
        return undefined;
    }

    return mapa.find(([verbos]) =>
        verbos.some((verbo) => normalizado.includes(verbo))
    )?.[1];
};

export const iconoPorTexto = (texto: string): ReactNode | undefined =>
    buscarPorVerbo(texto, ICONOS_POR_VERBO);

export const textoProcesoPorTexto = (texto: string): string =>
    buscarPorVerbo(texto, GERUNDIOS_POR_VERBO) ?? TEXTO_PROCESO_NEUTRO;
