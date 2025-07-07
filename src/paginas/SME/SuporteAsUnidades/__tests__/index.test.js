import { render, screen } from "@testing-library/react";
import React  from "react";
import { SuporteAsUnidadesSme } from "../index";
import { MemoryRouter } from "react-router-dom";

describe('<SuporteAsUnidadesSme>', () => {
  
  test('Deve renderizar o componente', async () => {
    render(
        <MemoryRouter>
          <SuporteAsUnidadesSme/>
        </MemoryRouter>
    )
    expect(screen.getByText("Suporte às unidades")).toBeInTheDocument();
  });

});
