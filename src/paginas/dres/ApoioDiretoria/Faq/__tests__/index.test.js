import { render, screen } from "@testing-library/react";
import React  from "react";
import { FaqDrePage } from "../index";


describe('<FaqDrePage>', () => {
  
  test('Deve renderizar o componente', async () => {
    render(
        <FaqDrePage/>
    )
    expect(screen.getByText("Perguntas Frequentes")).toBeInTheDocument();
  });

});
