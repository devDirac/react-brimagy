import { legacy_createStore as createStore } from "redux";
import rootReducer from "./reducers/appReducer";

const saveInStorage = (stateComing: any) => {
  try {
    localStorage.setItem("states", JSON.stringify(stateComing));
  } catch (e) {
    console.error(e);
  }
};

const loadStorage = () => {
  try {
    const state = localStorage.getItem("states");
    return state ? JSON.parse(state) : undefined;
  } catch (e) {
    return undefined;
  }
};

const persistedStore = loadStorage();

const configureStore = createStore(
  rootReducer,
  persistedStore,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);

configureStore.subscribe(() => {
  saveInStorage(configureStore.getState());
});

// Exporta los tipos del store
export type RootState = ReturnType<typeof configureStore.getState>;
export type AppDispatch = typeof configureStore.dispatch;

export default configureStore;
