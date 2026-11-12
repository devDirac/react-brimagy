import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

const SELECTOR_TOPBAR = ".apm-topbar";
const HOLGURA_DESBORDE = 2;
const ANCHO_MINIMO_PULGAR = 40;

export interface ResultadoHeaderFijo {
    refCentinela: RefObject<HTMLDivElement>;
    refEncabezado: RefObject<HTMLDivElement>;
    refCuerpo: RefObject<HTMLDivElement>;
    refPista: RefObject<HTMLDivElement>;
    refPulgar: RefObject<HTMLDivElement>;
    desplazamientoSuperior: number;
    mostrarHerramientas: boolean;
    pegado: boolean;
    hayDesbordeHorizontal: boolean;
}

const medirTopbar = (): number => {
    const topbar = document.querySelector(SELECTOR_TOPBAR);

    if (topbar === null) {
        return 0;
    }

    if (window.getComputedStyle(topbar).position !== "sticky") {
        return 0;
    }

    return Math.round(topbar.getBoundingClientRect().height);
};

export const useHeaderFijo = (
    activo: boolean,
    refPie?: RefObject<HTMLElement>
): ResultadoHeaderFijo => {
    const refCentinela = useRef<HTMLDivElement>(null);
    const refEncabezado = useRef<HTMLDivElement>(null);
    const refCuerpo = useRef<HTMLDivElement>(null);
    const refPista = useRef<HTMLDivElement>(null);
    const refPulgar = useRef<HTMLDivElement>(null);
    const refBloqueo = useRef(false);

    const [desplazamientoSuperior, setDesplazamientoSuperior] = useState(0);
    const [pegado, setPegado] = useState(false);
    const [alFinal, setAlFinal] = useState(false);
    const [hayDesbordeHorizontal, setHayDesbordeHorizontal] = useState(false);

    const pintarPulgar = useCallback((): void => {
        const cuerpo = refCuerpo.current;
        const pista = refPista.current;
        const pulgar = refPulgar.current;

        if (cuerpo === null || pista === null || pulgar === null) {
            return;
        }

        const anchoPista = pista.clientWidth;
        const desplazableCuerpo = cuerpo.scrollWidth - cuerpo.clientWidth;

        if (anchoPista === 0 || desplazableCuerpo <= 0) {
            return;
        }

        const anchoPulgar = Math.max(
            ANCHO_MINIMO_PULGAR,
            Math.round((cuerpo.clientWidth / cuerpo.scrollWidth) * anchoPista)
        );
        const recorridoPulgar = anchoPista - anchoPulgar;
        const posicion = (cuerpo.scrollLeft / desplazableCuerpo) * recorridoPulgar;

        pulgar.style.width = `${anchoPulgar}px`;
        pulgar.style.transform = `translateX(${Math.round(posicion)}px)`;
    }, []);

    const medirDesborde = useCallback((): void => {
        const cuerpo = refCuerpo.current;

        if (cuerpo === null) {
            return;
        }

        setHayDesbordeHorizontal(
            cuerpo.scrollWidth > cuerpo.clientWidth + HOLGURA_DESBORDE
        );
        pintarPulgar();
    }, [pintarPulgar]);

    useEffect(() => {
        if (!activo) {
            return;
        }

        const actualizar = (): void => setDesplazamientoSuperior(medirTopbar());

        actualizar();
        window.addEventListener("resize", actualizar);

        // El topbar cambia de alto al abrir o cerrar el sidebar, y eso no dispara
        // un resize de ventana: sin observarlo, la zona fija se queda pegada a la
        // altura vieja y las herramientas acaban debajo del topbar.
        const topbar = document.querySelector(SELECTOR_TOPBAR);

        if (typeof ResizeObserver === "undefined" || topbar === null) {
            return () => window.removeEventListener("resize", actualizar);
        }

        const observador = new ResizeObserver(actualizar);

        // border-box: se mide con getBoundingClientRect, asi que un cambio de
        // relleno del topbar tambien tiene que mover la zona fija.
        observador.observe(topbar, { box: "border-box" });

        return () => {
            observador.disconnect();
            window.removeEventListener("resize", actualizar);
        };
    }, [activo]);

    useEffect(() => {
        if (!activo) {
            return;
        }

        medirDesborde();

        if (typeof ResizeObserver === "undefined") {
            window.addEventListener("resize", medirDesborde);

            return () => window.removeEventListener("resize", medirDesborde);
        }

        const observador = new ResizeObserver(medirDesborde);
        const cuerpo = refCuerpo.current;

        if (cuerpo !== null) {
            observador.observe(cuerpo);
        }

        return () => observador.disconnect();
    }, [activo, medirDesborde]);


    // El estado se calcula leyendo posiciones en cada cuadro de scroll en vez de
    // con IntersectionObserver: el navbar despacha al contexto de MUI en cada
    // evento de scroll y re-renderiza la app entera, y un observador que se
    // recrea con cada cambio de desplazamiento se perdia transiciones.
    useEffect(() => {
        if (!activo) {
            return;
        }

        let pendiente = false;

        const evaluar = (): void => {
            pendiente = false;

            const centinela = refCentinela.current;

            if (centinela === null) {
                return;
            }

            const limite = medirTopbar();

            setDesplazamientoSuperior((anterior) =>
                anterior === limite ? anterior : limite
            );
            setPegado(centinela.getBoundingClientRect().top < limite);

            const pie = refPie?.current ?? null;

            setAlFinal(
                pie === null
                    ? false
                    : pie.getBoundingClientRect().top < window.innerHeight
            );
        };

        const alDesplazar = (): void => {
            if (pendiente) {
                return;
            }

            pendiente = true;
            window.requestAnimationFrame(evaluar);
        };

        evaluar();
        window.addEventListener("scroll", alDesplazar, { passive: true });
        window.addEventListener("resize", alDesplazar);

        return () => {
            window.removeEventListener("scroll", alDesplazar);
            window.removeEventListener("resize", alDesplazar);
        };
    }, [activo, refPie]);

    useEffect(() => {
        if (!activo) {
            return;
        }

        const cuerpo = refCuerpo.current;
        const encabezado = refEncabezado.current;

        if (cuerpo === null || encabezado === null) {
            return;
        }

        const propagar = (origen: HTMLElement): void => {
            if (refBloqueo.current) {
                return;
            }

            refBloqueo.current = true;

            const destino = origen === cuerpo ? encabezado : cuerpo;
            destino.scrollLeft = origen.scrollLeft;
            pintarPulgar();

            window.requestAnimationFrame(() => {
                refBloqueo.current = false;
            });
        };

        const desdeCuerpo = (): void => propagar(cuerpo);
        const desdeEncabezado = (): void => propagar(encabezado);

        cuerpo.addEventListener("scroll", desdeCuerpo, { passive: true });
        encabezado.addEventListener("scroll", desdeEncabezado, { passive: true });

        encabezado.scrollLeft = cuerpo.scrollLeft;
        pintarPulgar();

        return () => {
            cuerpo.removeEventListener("scroll", desdeCuerpo);
            encabezado.removeEventListener("scroll", desdeEncabezado);
        };
    }, [activo, hayDesbordeHorizontal, pintarPulgar]);

    useEffect(() => {
        if (!activo || !hayDesbordeHorizontal) {
            return;
        }

        const cuerpo = refCuerpo.current;
        const pista = refPista.current;
        const pulgar = refPulgar.current;

        if (cuerpo === null || pista === null || pulgar === null) {
            return;
        }

        let arrastrando = false;
        let inicioX = 0;
        let inicioScroll = 0;

        const recorridoPulgar = (): number => pista.clientWidth - pulgar.offsetWidth;
        const desplazableCuerpo = (): number =>
            cuerpo.scrollWidth - cuerpo.clientWidth;

        const alPresionar = (evento: PointerEvent): void => {
            arrastrando = true;
            inicioX = evento.clientX;
            inicioScroll = cuerpo.scrollLeft;
            pulgar.setPointerCapture(evento.pointerId);
            evento.preventDefault();
            evento.stopPropagation();
        };

        const alMover = (evento: PointerEvent): void => {
            if (!arrastrando) {
                return;
            }

            const recorrido = recorridoPulgar();

            if (recorrido <= 0) {
                return;
            }

            const avance =
                ((evento.clientX - inicioX) / recorrido) * desplazableCuerpo();

            cuerpo.scrollLeft = inicioScroll + avance;
        };

        const alSoltar = (evento: PointerEvent): void => {
            arrastrando = false;

            try {
                pulgar.releasePointerCapture(evento.pointerId);
            } catch {
                // el puntero ya se habia liberado
            }
        };

        const alPulsarPista = (evento: PointerEvent): void => {
            if (evento.target === pulgar) {
                return;
            }

            const caja = pista.getBoundingClientRect();
            const proporcion = (evento.clientX - caja.left) / caja.width;

            cuerpo.scrollLeft = proporcion * desplazableCuerpo();
        };

        pulgar.addEventListener("pointerdown", alPresionar);
        pulgar.addEventListener("pointermove", alMover);
        pulgar.addEventListener("pointerup", alSoltar);
        pulgar.addEventListener("pointercancel", alSoltar);
        pista.addEventListener("pointerdown", alPulsarPista);

        return () => {
            pulgar.removeEventListener("pointerdown", alPresionar);
            pulgar.removeEventListener("pointermove", alMover);
            pulgar.removeEventListener("pointerup", alSoltar);
            pulgar.removeEventListener("pointercancel", alSoltar);
            pista.removeEventListener("pointerdown", alPulsarPista);
        };
    }, [activo, hayDesbordeHorizontal]);

    return {
        refCentinela,
        refEncabezado,
        refCuerpo,
        refPista,
        refPulgar,
        desplazamientoSuperior,
        mostrarHerramientas: pegado && !alFinal,
        pegado,
        hayDesbordeHorizontal,
    };
};
