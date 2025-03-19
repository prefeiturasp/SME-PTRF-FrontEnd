import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModalDesvincularLote } from "../../AssociacoesDaAcao/Modais";

describe("ModalDesvincularLote", () => {
  const defaultProps = {
    show: true,
    onHide: jest.fn(),
    titulo: "Confirmar Desvinculação",
    quantidadeSelecionada: 2,
    tecnico: "Técnico Teste",
    primeiroBotaoOnclick: jest.fn(),
  };

  test("deve renderizar o título corretamente", () => {
    render(<ModalDesvincularLote {...defaultProps} />);
    expect(screen.getByText("Confirmar Desvinculação")).toBeInTheDocument();
  });

  test("deve exibir a quantidade selecionada corretamente", () => {
    render(<ModalDesvincularLote {...defaultProps} />);
    expect(screen.getByText("2 unidades")).toBeInTheDocument();
  });

  test("deve chamar onHide ao clicar no botão Cancelar", () => {
    render(<ModalDesvincularLote {...defaultProps} />);
    fireEvent.click(screen.getByText("Cancelar"));
    expect(defaultProps.onHide).toHaveBeenCalled();
  });

  test("deve chamar primeiroBotaoOnclick ao clicar no botão Desvincular", () => {
    render(<ModalDesvincularLote {...defaultProps} />);
    fireEvent.click(screen.getByText("Desvincular"));
    expect(defaultProps.primeiroBotaoOnclick).toHaveBeenCalled();
  });

  test("deve desabilitar o botão Desvincular quando técnico estiver vazio", () => {
    render(<ModalDesvincularLote {...defaultProps} tecnico="" />);
    expect(screen.getByText("Desvincular")).toBeDisabled();
  });
});
