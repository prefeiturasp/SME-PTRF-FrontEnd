import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModalVincularLote } from "../../VinculaAssociacoesAAcao/Modais";

describe("ModalVincularLote", () => {
  const defaultProps = {
    show: true,
    onHide: jest.fn(),
    titulo: "Confirmar vinculação",
    quantidadeSelecionada: 2,
    tecnico: "Técnico Teste",
    primeiroBotaoOnclick: jest.fn(),
  };

  test("deve renderizar o título corretamente", () => {
    render(<ModalVincularLote {...defaultProps} />);
    expect(screen.getByText("Confirmar vinculação")).toBeInTheDocument();
  });

  test("deve exibir a quantidade selecionada corretamente", () => {
    render(<ModalVincularLote {...defaultProps} />);
    expect(screen.getByText("2 unidades")).toBeInTheDocument();
  });

  test("deve chamar onHide ao clicar no botão Cancelar", () => {
    render(<ModalVincularLote {...defaultProps} />);
    fireEvent.click(screen.getByText("Cancelar"));
    expect(defaultProps.onHide).toHaveBeenCalled();
  });

  test("deve chamar primeiroBotaoOnclick ao clicar no botão Vincular", () => {
    render(<ModalVincularLote {...defaultProps} />);
    fireEvent.click(screen.getByText("Vincular"));
    expect(defaultProps.primeiroBotaoOnclick).toHaveBeenCalled();
  });

  test("deve desabilitar o botão Vincular quando técnico estiver vazio", () => {
    render(<ModalVincularLote {...defaultProps} tecnico="" />);
    expect(screen.getByText("Vincular")).toBeDisabled();
  });
});
