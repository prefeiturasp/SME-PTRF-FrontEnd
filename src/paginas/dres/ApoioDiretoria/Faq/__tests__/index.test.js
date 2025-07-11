import { render, screen } from "@testing-library/react";
import React  from "react";
import { FaqDrePage } from "../index";
import { MemoryRouter } from "react-router-dom";


describe('<FaqDrePage>', () => {
  
  test('Deve renderizar o componente', async () => {
    render(
        <MemoryRouter>
          <FaqDrePage/>
        </MemoryRouter>
    )
    expect(screen.getByText("Perguntas Frequentes")).toBeInTheDocument();
  });

});
