import { render } from "@testing-library/react";
import React  from "react";
import { MeusDadosPage } from "../index";

describe('<MeusDadosPage>', () => {
  it('Deve renderizar o componente', async () => {
    // teste de, apenas, renderização
    render(<MeusDadosPage/>)
  });
});
