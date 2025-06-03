import { render, screen } from "@testing-library/react";
import { EdicaoBemProduzidoPage } from "../../EdicaoBemProduzido";

jest.mock(
  "../../../../../componentes/escolas/SituacaoPatrimonial/FormularioBemProduzido",
  () => ({
    FormularioBemProduzido: () => <div>Formulario Bem Produzido Mock</div>,
  })
);

describe("EdicaoBemProduzidoPage", () => {
  it("deve renderizar o título 'Adicionar bem produzido'", () => {
    render(<EdicaoBemProduzidoPage />);

    const titulo = screen.getByText("Adicionar bem produzido");
    expect(titulo).toBeInTheDocument();
  });

  it("deve renderizar o componente FormularioBemProduzido", () => {
    render(<EdicaoBemProduzidoPage />);

    const formularioBemProduzido = screen.getByText(
      "Formulario Bem Produzido Mock"
    );
    expect(formularioBemProduzido).toBeInTheDocument();
  });
});
