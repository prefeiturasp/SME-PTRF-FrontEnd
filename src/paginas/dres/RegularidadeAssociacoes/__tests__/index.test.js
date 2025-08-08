import React  from "react";
import { render, screen } from "@testing-library/react";
import { RegularidadeAssociacoesPage } from "../index";
import { MemoryRouter } from "react-router-dom";

describe('<RegularidadeAssociacoesPage>', () => {
  test('Deve renderizar o componente', async () => {
    render(
      <MemoryRouter>
        <RegularidadeAssociacoesPage/>
      </MemoryRouter>
    )
    expect(screen.getByText('Regularidade das Associações')).toBeInTheDocument()
  });

});
