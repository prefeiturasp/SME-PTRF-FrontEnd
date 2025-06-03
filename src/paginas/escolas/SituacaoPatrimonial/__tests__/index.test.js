import { render, screen } from "@testing-library/react";
import { SituacaoPatrimonialPage } from "../index";

jest.mock(
  "../../../../componentes/escolas/SituacaoPatrimonial/ListaBemProduzido",
  () => ({
    ListaBemProduzido: () => <div>Lista Bem Produzido Mock</div>,
  })
);

describe("SituacaoPatrimonialPage", () => {
  it("deve renderizar o título 'Situação Patrimonial'", () => {
    render(<SituacaoPatrimonialPage />);

    const titulo = screen.getByText("Situação Patrimonial");
    expect(titulo).toBeInTheDocument();
  });

  it("deve renderizar o componente ListaBemProduzido", () => {
    render(<SituacaoPatrimonialPage />);

    const formularioBemProduzido = screen.getByText("Lista Bem Produzido Mock");
    expect(formularioBemProduzido).toBeInTheDocument();
  });
});
