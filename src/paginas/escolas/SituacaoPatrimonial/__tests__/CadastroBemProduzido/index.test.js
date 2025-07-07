import { render, screen } from "@testing-library/react";
import React  from "react";
import { MemoryRouter } from 'react-router-dom';
import { CadastroBemProduzidoPage } from "../../CadastroBemProduzido";

jest.mock(
  "../../../../../componentes/escolas/SituacaoPatrimonial/FormularioBemProduzido",
  () => ({
    FormularioBemProduzido: () => <div>Formulario Bem Produzido Mock</div>,
  })
);

describe("CadastroBemProduzidoPage", () => {
  it("deve renderizar o título 'Adicionar bem produzido'", () => {
    render(<MemoryRouter><CadastroBemProduzidoPage /></MemoryRouter>);

    const titulo = screen.getByText("Adicionar bem produzido");
    expect(titulo).toBeInTheDocument();
  });

  it("deve renderizar o componente FormularioBemProduzido", () => {
    render(<MemoryRouter><CadastroBemProduzidoPage /></MemoryRouter>);

    const formularioBemProduzido = screen.getByText(
      "Formulario Bem Produzido Mock"
    );
    expect(formularioBemProduzido).toBeInTheDocument();
  });
});
