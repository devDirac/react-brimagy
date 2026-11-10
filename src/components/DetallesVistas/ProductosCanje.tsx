import { useState } from "react";
import { Box, Chip, Pagination, PaginationItem, Typography } from "@mui/material";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { numericFormatter } from "react-number-format";

const IconoAnterior = () => <IconChevronRight size={18} stroke={2} />;
const IconoSiguiente = () => <IconChevronLeft size={18} stroke={2} />;

interface ProductosCanjeProps {
    productos: any[];
    porPagina?: number;
    marcarNoRegistrados?: boolean;
}

export const ProductosCanje = ({
    productos,
    porPagina = 3,
    marcarNoRegistrados = false,
}: ProductosCanjeProps) => {
    const [pagina, setPagina] = useState(1);
    const totalPaginas = Math.max(1, Math.ceil(productos.length / porPagina));
    const paginaActual = Math.min(pagina, totalPaginas);
    const visibles = productos.slice((paginaActual - 1) * porPagina, paginaActual * porPagina);

    return (
        <Box>
            {visibles.map((p, i) => {
                const noRegistrado = marcarNoRegistrados && !p.id_producto;

                return (
                    <Box
                        key={`${p.award_id ?? p.id_producto}-${i}`}
                        sx={
                            noRegistrado
                                ? {
                                    position: "relative",
                                    mt: 2,
                                    mb: 1,
                                    p: 1.5,
                                    pt: 2,
                                    border: "2px solid",
                                    borderColor: "error.main",
                                    borderRadius: 2,
                                }
                                : { py: 1, borderBottom: "1px solid #0000001f" }
                        }
                    >
                        {noRegistrado && (
                            <Chip
                                label="No registrado en catálogo"
                                size="small"
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: 12,
                                    transform: "translateY(-50%)",
                                    bgcolor: "error.main",
                                    color: "#fff",
                                    fontWeight: "bold",
                                    height: 20,
                                    fontSize: "0.65rem",
                                }}
                            />
                        )}
                        <Typography variant="button" noWrap sx={{ fontWeight: 600, display: "block" }}>
                            {p.nombre_premio}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {p.sku} · x{p.number_of_awards} ·{" "}
                            {numericFormatter(String(p.puntos_canjeados), { thousandSeparator: "," })} pts
                        </Typography>
                    </Box>
                );
            })}

            {totalPaginas > 1 && (
                <Pagination
                    dir="ltr"
                    size="small"
                    count={totalPaginas}
                    page={paginaActual}
                    onChange={(_, v) => setPagina(v)}
                    renderItem={(item) => (
                        <PaginationItem {...item} slots={{ previous: IconoAnterior, next: IconoSiguiente }} />
                    )}
                    sx={{ mt: 1, display: "flex", justifyContent: "center" }}
                />
            )}
        </Box>
    );
};