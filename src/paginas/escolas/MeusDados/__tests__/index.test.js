import { render } from "@testing-library/react";
import React  from "react";
import { MeusDadosPage } from "../index";
import { MemoryRouter } from "react-router-dom";

describe('<MeusDadosPage>', () => {
  it('Deve renderizar o componente', async () => {
    // teste de, apenas, renderização
    render(<MemoryRouter><MeusDadosPage/></MemoryRouter>)
  });
});
