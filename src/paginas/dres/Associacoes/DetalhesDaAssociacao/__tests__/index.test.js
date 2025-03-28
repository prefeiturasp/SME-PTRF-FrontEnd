import { render, screen } from "@testing-library/react";
import React  from "react";
import { MemoryRouter } from "react-router-dom";
import { DetalhesDaAssociacaoDrePage } from "../index";


describe('<DetalhesDaAssociacaoDrePage>', () => {
  
  test('Deve renderizar o componente', async () => {
    render(
      <MemoryRouter>
        <DetalhesDaAssociacaoDrePage/>
      </MemoryRouter>
    )
  });

});
