import { useField } from "formik";
import type { SelectFieldProps } from "./types";
import { useState } from "react";
import { useMaterialUIController } from "context";

export const useSelectField = (props: SelectFieldProps) => {
  const [field, meta] = useField(props);
  const [didFocus, setDidFocus] = useState(false);
  const handleFocus = () => setDidFocus(true);
  const showFeedback = (!!didFocus && (props?.value + "" || "").trim().length > 2) || meta.touched;
  const isValid = meta.error ? "invalid" : "valid";
  const errorMessage = meta.error ? meta.error : "";
  const { formik, btnPlus } = props;
  const esError = formik?.touched && formik?.error;
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const newPros = Object.assign({}, props);
  delete newPros.btnPlus;
  delete newPros.onAdd;

  return {
    showFeedback,
    isValid,
    handleFocus,
    field,
    errorMessage,
    formik,
    darkMode,
    esError,
    btnPlus,
    newPros,
  };
};
