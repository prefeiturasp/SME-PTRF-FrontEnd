import { render } from "@testing-library/react";
import React  from "react";
import { ListaDeReceitasPage } from "../index";

describe('<ListaDeReceitasPage>', () => {
  it('Deve renderizar o componente', async () => {
    // teste de, apenas, renderização
    render(<ListaDeReceitasPage/>)
  });
});
