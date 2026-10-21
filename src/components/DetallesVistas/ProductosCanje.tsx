import { useState } from "react";
import { Box, Pagination, PaginationItem, Typography } from "@mui/material";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { numericFormatter } from "react-number-format";

const IconoAnterior = () => <IconChevronLeft size={18} stroke={2} />;
const IconoSiguiente = () => <IconChevronRight size={18} stroke={2} />;

export const ProductosCanje = ({ productos, porPagina = 3 }: { productos: any[]; porPagina?: number }) => {
    const [pagina, setPagina] = useState(1);
    const totalPaginas = Math.ceil(productos.length / porPagina);
    const visibles = productos.slice((pagina - 1) * porPagina, pagina * porPagina);

    return (
        <Box>
            {visibles.map((p, i) => (
                <Box key={`${p.id_producto}-${i}`} sx={{ py: 1, borderBottom: "1px solid #0000001f" }}>
                    <Typography variant="button" noWrap sx={{ fontWeight: 600, display: "block" }}>
                        {p.nombre_premio}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        SKU {p.sku} · x{p.number_of_awards} ·{" "}
                        {numericFormatter(String(p.puntos_canjeados), { thousandSeparator: "," })} pts
                    </Typography>
                </Box>
            ))}
            {totalPaginas > 1 && (
                <Pagination
                    dir="ltr"
                    size="small"
                    count={totalPaginas}
                    page={pagina}
                    onChange={(_, v) => setPagina(v)}
                    renderItem={(item) => (
                        <PaginationItem
                            {...item}
                            slots={{ previous: IconoSiguiente, next: IconoAnterior }}
                        />
                    )}
                    sx={{ mt: 1, display: "flex", justifyContent: "center" }}
                />
            )}
        </Box>
    );
};