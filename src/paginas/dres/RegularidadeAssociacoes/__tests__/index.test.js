import React  from "react";
import { render, screen } from "@testing-library/react";
import { RegularidadeAssociacoesPage } from "../index";

describe('<RegularidadeAssociacoesPage>', () => {
  test('Deve renderizar o componente', async () => {
    render(
      <RegularidadeAssociacoesPage/>
    )
    expect(screen.getByText('Regularidade das Associações')).toBeInTheDocument()
  });

});
