import { useMaterialUIController } from "context";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { StoreType } from "../../types/genericTypes";
import _ from "lodash";
import type { AddUserFormProps } from "./types";
import { useIntl } from "react-intl";

export const useUserInfo = (props: AddUserFormProps) => {
  const intl = useIntl();
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirm, setPassword_confirm] = useState("");
  const [telefono, setTelefono] = useState("");
  const [foto, setFoto] = useState("");
  const [usuario, setUsuario] = useState("");
  const [permisos, setPermisos] = useState<number>();
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const setImagen = (data: any) => {
    setFoto(data);
  };

  return {
    intl,
    darkMode,
    nombre,
    correo,
    password,
    password_confirm,
    telefono,
    foto,
    setNombre,
    setCorreo,
    setPassword,
    setPassword_confirm,
    setTelefono,
    setFoto,
    setImagen,
    permisos,
    setPermisos,
    usuario,
    setUsuario,
  };
};
