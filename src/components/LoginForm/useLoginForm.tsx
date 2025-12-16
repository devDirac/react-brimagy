import { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useMaterialUIController } from "context";
import { useIntl } from "react-intl";

export const useLoginForm = () => {
  const intl = useIntl();
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {},
    validationSchema: Yup.object({
      email: Yup.string().required(intl.formatMessage({ id: "input_validation_requerido" })),
      password: Yup.string().required(intl.formatMessage({ id: "input_validation_requerido" })),
    }),
  });

  const isValidEmail =
    formik!.touched.email &&
    !formik!.errors.email &&
    formik!.values.email &&
    formik!.values.email !== "";

  const isValidPassword =
    formik!.touched.password &&
    !formik!.errors.password &&
    formik!.values.password &&
    formik!.values.password !== "";

  return {
    isValidPassword,
    isValidEmail,
    formik,
    email,
    setEmail,
    password,
    setPassword,
    navigate,
    darkMode,
    intl,
  };
};
