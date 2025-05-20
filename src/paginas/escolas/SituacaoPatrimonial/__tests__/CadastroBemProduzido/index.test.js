import { render, screen } from "@testing-library/react";
import { CadastroBemProduzidoPage } from "../../CadastroBemProduzido";

jest.mock(
  "../../../../../componentes/escolas/SituacaoPatrimonial/FormularioBemProduzido",
  () => ({
    FormularioBemProduzido: () => <div>Formulario Bem Produzido Mock</div>,
  })
);

describe("CadastroBemProduzidoPage", () => {
  it("deve renderizar o título 'Adicionar bem produzido'", () => {
    render(<CadastroBemProduzidoPage />);

    const titulo = screen.getByText("Adicionar bem produzido");
    expect(titulo).toBeInTheDocument();
  });

  it("deve renderizar o componente FormularioBemProduzido", () => {
    render(<CadastroBemProduzidoPage />);

    const formularioBemProduzido = screen.getByText(
      "Formulario Bem Produzido Mock"
    );
    expect(formularioBemProduzido).toBeInTheDocument();
  });
});
