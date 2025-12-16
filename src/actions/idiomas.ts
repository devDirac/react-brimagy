export const SET_IDIOMA = "@SET_IDIOMA";

export const setIdioma = (value: string) => {
  return {
    type: SET_IDIOMA,
    value,
  };
};
