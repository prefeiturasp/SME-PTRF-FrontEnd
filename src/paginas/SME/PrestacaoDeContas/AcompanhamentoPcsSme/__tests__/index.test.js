import { render, screen } from "@testing-library/react";
import React  from "react";
import { AcompanhamentoPcsSmePage } from "../index";


describe('<AcompanhamentoPcsSmePage>', () => {
  
  test('Deve renderizar o componente', async () => {
    render(
        <AcompanhamentoPcsSmePage/>
    )
    expect(screen.getByText("Acompanhamento das Prestações de Contas")).toBeInTheDocument();
  });

});
