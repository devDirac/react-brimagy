import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useIntl } from "react-intl";
import { useMaterialUIController } from "context";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useState } from "react";

const useModalConfirm = () => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const intl = useIntl();
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [comentarios, setComentarios] = useState<string>("");
  const formik = useFormik({
    initialValues: {
      comentarios: "",
    },
    onSubmit: async (values) => {},
    validationSchema: Yup.object({
      comentarios: Yup.string()
        .min(4, intl.formatMessage({ id: "input_validation_min_4" }))
        .max(255, intl.formatMessage({ id: "input_validation_max_500" }))
        .required(intl.formatMessage({ id: "input_validation_requerido" })),
    }),
  });

  return {
    fullScreen,
    intl,
    darkMode,
    formik,
    comentarios,
    setComentarios,
  };
};
export default useModalConfirm;
