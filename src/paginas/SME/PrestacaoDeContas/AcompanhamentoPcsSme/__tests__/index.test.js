import { render, screen } from "@testing-library/react";
import React  from "react";
import { AcompanhamentoPcsSmePage } from "../index";
import { MemoryRouter } from "react-router-dom";


describe('<AcompanhamentoPcsSmePage>', () => {
  
  test('Deve renderizar o componente', async () => {
    render(
        <MemoryRouter>
          <AcompanhamentoPcsSmePage/>
        </MemoryRouter>
    )
    expect(screen.getByText("Acompanhamento das Prestações de Contas")).toBeInTheDocument();
  });

});
