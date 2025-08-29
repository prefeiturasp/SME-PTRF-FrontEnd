import { render, screen } from "@testing-library/react";
import React  from "react";
import { MemoryRouter } from 'react-router-dom';
import { EdicaoBemProduzidoPage } from "../../EdicaoBemProduzido";

jest.mock(
  "../../../../../componentes/escolas/SituacaoPatrimonial/FormularioBemProduzido",
  () => ({
    FormularioBemProduzido: () => <div>Formulario Bem Produzido Mock</div>,
  })
);

describe("EdicaoBemProduzidoPage", () => {
  it("deve renderizar o título 'Editar bem produzido'", () => {
    render(<MemoryRouter><EdicaoBemProduzidoPage /></MemoryRouter>);

    const titulo = screen.getByText("Editar bem produzido");
    expect(titulo).toBeInTheDocument();
  });

  it("deve renderizar o componente FormularioBemProduzido", () => {
    render(<MemoryRouter><EdicaoBemProduzidoPage /></MemoryRouter>);

    const formularioBemProduzido = screen.getByText(
      "Formulario Bem Produzido Mock"
    );
    expect(formularioBemProduzido).toBeInTheDocument();
  });
});
