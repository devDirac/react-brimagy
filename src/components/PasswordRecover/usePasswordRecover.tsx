import { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useMaterialUIController } from "context";
import { useIntl } from "react-intl";

export const usePasswordRecover = () => {
  const intl = useIntl();
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: async (values) => {},
    validationSchema: Yup.object({
      email: Yup.string().required(intl.formatMessage({ id: "input_validation_requerido" })),
    }),
  });

  const isValidEmail =
    formik!.touched.email &&
    !formik!.errors.email &&
    formik!.values.email &&
    formik!.values.email !== "";

  return {
    isValidEmail,
    formik,
    email,
    setEmail,
    navigate,
    darkMode,
    intl,
  };
};
