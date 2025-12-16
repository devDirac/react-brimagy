import React from "react";
import { useSelector } from "react-redux";

export const perfilContext = React.createContext(null);

export const ProviderContextComponent: any = ({ children }: any) => {
  const perfil = useSelector((state: any) => state?.app?.user?.data?.id_tipo_usuario || 0);
  return <perfilContext.Provider value={perfil}>{children}</perfilContext.Provider>;
};
