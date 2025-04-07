import { reducers } from "../index";
import { createStore } from "redux";

describe("Reducer combinado", () => {
  let store;

  beforeEach(() => {
    store = createStore(reducers);
  });

  it("deve ter o estado inicial esperado", () => {
    const state = store.getState();

    expect(state).toHaveProperty("DetalharAcertos");
    expect(state).toHaveProperty("DetalharAcertosDocumentos");
    expect(state).toHaveProperty("DadosAssociacao");
    expect(state).toHaveProperty("PendenciaCadastro");
    expect(state).toHaveProperty("Modal");
  });

  it("deve retornar o mesmo estado para uma ação desconhecida", () => {
    const previousState = store.getState();
    store.dispatch({ type: "TIPO_DESCONHECIDO" });
    const newState = store.getState();

    expect(newState).toEqual(previousState);
  });
});
