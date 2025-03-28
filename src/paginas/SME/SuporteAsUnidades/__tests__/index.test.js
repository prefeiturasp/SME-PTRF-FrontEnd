import { render, screen } from "@testing-library/react";
import React  from "react";
import { SuporteAsUnidadesSme } from "../index";

describe('<SuporteAsUnidadesSme>', () => {
  
  test('Deve renderizar o componente', async () => {
    render(
        <SuporteAsUnidadesSme/>
    )
    expect(screen.getByText("Suporte às unidades")).toBeInTheDocument();
  });

});
