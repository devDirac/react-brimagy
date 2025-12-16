import { useMaterialUIController } from "context";
import { useFormik } from "formik";
import { useCallback, useEffect, useState } from "react";
import * as Yup from "yup";
import type { SearchFiltroProps } from "./SearchFiltro";

const useSearchFiltro = (props: SearchFiltroProps) => {
  const [texto, setTexto] = useState<string>("");
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const formik = useFormik({
    initialValues: {
      texto: "",
    },
    onSubmit: async (values) => {},
    validationSchema: Yup.object({}),
  });

  const sendTo = useCallback(() => {
    props?.onFiltro(texto);
  }, [props, texto]);

  useEffect(() => {
    const getData = setTimeout(() => {
      sendTo();
    }, 800);
    return () => clearTimeout(getData);
  }, [texto, sendTo]);

  return {
    darkMode,
    formik,
    texto,
    setTexto,
  };
};

export default useSearchFiltro;
