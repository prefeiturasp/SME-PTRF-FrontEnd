import { render, screen } from "@testing-library/react";
import React  from "react";
import { ListaDeDespesasPage } from "../index";
import { MemoryRouter } from "react-router-dom";

describe('<ListaDeDespesasPage>', () => {
  test('Deve renderizar o componente', async () => {
    render(
      <MemoryRouter>
        <ListaDeDespesasPage/>
      </MemoryRouter>
    )
    expect(screen.getByText("Gastos da minha escola")).toBeInTheDocument();
  });
});
