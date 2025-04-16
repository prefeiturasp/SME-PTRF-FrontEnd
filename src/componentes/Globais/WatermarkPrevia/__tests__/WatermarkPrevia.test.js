import React from "react";
import { render, screen } from "@testing-library/react";
import WatermarkPrevia from "../WatermarkPrevia";

jest.mock(
  "../../../../assets/img/watermark-visualizacao-previa.svg",
  () => "mocked-rascunho.svg"
);
jest.mock(
  "../../../../assets/img/watermark-visualizacao.svg",
  () => "mocked-visualizacao.svg"
);

describe("Componente WatermarkPrevia", () => {
  it("renderiza múltiplas marcas d’água de acordo com a altura do documento", () => {
    render(<WatermarkPrevia alturaDocumento={1200} icon="rascunho" />);

    const imagens = screen.getAllByAltText("Rascunho");
    expect(imagens.length).toBe(3);
  });

  it('usa a imagem correta quando o ícone for "rascunho"', () => {
    render(<WatermarkPrevia alturaDocumento={500} icon="rascunho" />);
    const imagem = screen.getByAltText("Rascunho");
    expect(imagem).toHaveAttribute("src", "mocked-rascunho.svg");
  });

  it('usa a imagem correta quando o ícone não for "rascunho"', () => {
    render(<WatermarkPrevia alturaDocumento={500} icon="visualizacao" />);
    const imagem = screen.getByAltText("Rascunho");
    expect(imagem).toHaveAttribute("src", "mocked-visualizacao.svg");
  });
});
