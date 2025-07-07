import { render } from "@testing-library/react";
import React  from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { CadastroSaida } from "../index";
import { Provider } from "react-redux";
import { createStore } from "redux";

// Mock simples do reducer
const mockReducer = (state = {}) => state;
const mockStore = createStore(mockReducer);

describe('<CadastroSaida>', () => {
  it('Deve renderizar o componente', async () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter initialEntries={["/cadastro-saida/uuid-receitas/uuid-despesas"]}>
          <Routes>
            <Route path="/cadastro-saida/:uuid_receita/:uuid_despesa" element={<CadastroSaida />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  });
});
