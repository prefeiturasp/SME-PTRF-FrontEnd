import { render, screen } from "@testing-library/react";
import React  from "react";
import { ListaDeDespesasPage } from "../index";

describe('<ListaDeDespesasPage>', () => {
  test('Deve renderizar o componente', async () => {
    render(
      <ListaDeDespesasPage/>
    )
    expect(screen.getByText("Gastos da minha escola")).toBeInTheDocument();
  });
});
