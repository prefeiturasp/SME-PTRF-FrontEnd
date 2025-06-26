import { render } from "@testing-library/react";
import React  from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { CadastroSaidaPage } from "../index";

describe('<CadastroSaidaPage>', () => {
  it('Deve renderizar o componente', async () => {
    render(
      <MemoryRouter initialEntries={["/cadastro-saida/uuid-receitas/uuid-despesas"]}>
        <Routes>
          <Route path="/cadastro-saida/:uuid_receita/:uuid_despesa" element={<CadastroSaidaPage />} />
        </Routes>
      </MemoryRouter>
    );
  });
});
