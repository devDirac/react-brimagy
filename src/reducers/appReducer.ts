import { combineReducers } from "redux";
import { RESET_STATE, SET_USER } from "../actions/auth";
import { SET_IDIOMA } from "../actions/idiomas";
import { SET_MENU_ROUTES } from "../actions/menu";

// Estado inicial del reducer app
const initialAppState = {
  user: {},
  employees: { data: [], detail: {} },
  upload: [],
  idioma: "mx",
  ruta: null,
};

const appReducer = (state = initialAppState, action: any) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action?.value || {} };
    case SET_IDIOMA:
      return { ...state, idioma: action?.value || "mx" };
    case SET_MENU_ROUTES:
      return { ...state, ruta: action?.value || null };
    case RESET_STATE:
      return initialAppState;
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  app: appReducer,
});

export default rootReducer;
