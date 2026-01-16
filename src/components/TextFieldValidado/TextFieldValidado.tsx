import { TextField, TextFieldProps } from "@mui/material";
import { useFormikContext } from "formik";
import { useMemo } from "react";

interface TextFieldValidadoProps extends Omit<TextFieldProps, "name"> {
  name: string;
}

export const TextFieldValidado = ({ name, sx, ...props }: TextFieldValidadoProps) => {
  const formik = useFormikContext<any>();

  const validColor = useMemo(() => {
    const isValid =
      formik.touched[name] &&
      !formik.errors[name] &&
      formik.values[name] &&
      formik.values[name] !== "";
    return isValid ? "#00AB16" : undefined;
  }, [formik.touched[name], formik.errors[name], formik.values[name], name]);

  return (
    <TextField
      {...props}
      name={name}
      value={formik.values[name] || ""}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={formik.touched[name] && Boolean(formik.errors[name])}
      helperText={
        formik.touched[name] && formik.errors[name] ? String(formik.errors[name]) : undefined
      }
      sx={{
        "& .MuiInputLabel-root": {
          color: validColor,
        },
        "& .MuiInput-underline:after": {
          borderBottomColor: validColor,
        },
        "& .MuiInput-underline:before": {
          borderBottomColor: validColor,
        },
        "& .MuiInputBase-input": {
          color: validColor,
        },
        ...sx,
      }}
    />
  );
};
