import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ModalConfirmDesmarcar from "../ModalConfirmDesmarcarPublicacaoNoDiarioOficial";
import { ModalMsgGeracaoLauda } from "../ModalMsgGeracaoRelatorio";
import { ModalSalvarJustificativa } from "../ModalSalvarJustificativa";

describe("ModalConfirmDesmarcarPublicacaoNoDiarioOficial", () => {
  it("renderiza e aciona cancelar/confirmar", () => {
    const handleClose = jest.fn();
    const segundo = jest.fn();
    render(<ModalConfirmDesmarcar show titulo="Desmarcar" texto="<p>Texto confirmação</p>" handleClose={handleClose} segundoBotaoOnclick={segundo} />);
    expect(screen.getByText("Desmarcar")).toBeInTheDocument();
    expect(screen.getByText("Texto confirmação")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Cancelar"));
    expect(handleClose).toHaveBeenCalled();
    fireEvent.click(screen.getByText("Confirmar"));
    expect(segundo).toHaveBeenCalled();
  });

  it("não renderiza quando show é false", () => {
    render(<ModalConfirmDesmarcar show={false} titulo="Oculto" />);
    expect(screen.queryByText("Oculto")).not.toBeInTheDocument();
  });
});

describe("ModalMsgGeracaoLauda", () => {
  it("renderiza e fecha", () => {
    const handleClose = jest.fn();
    render(<ModalMsgGeracaoLauda show titulo="Geração" texto="<p>Gerando lauda</p>" handleClose={handleClose} />);
    expect(screen.getByText("Gerando lauda")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Fechar"));
    expect(handleClose).toHaveBeenCalled();
  });
});

describe("ModalSalvarJustificativa", () => {
  it("renderiza mensagem e fecha com OK", () => {
    const handleClose = jest.fn();
    render(<ModalSalvarJustificativa show handleClose={handleClose} />);
    expect(screen.getByText("Informações salvas")).toBeInTheDocument();
    expect(screen.getByText("Informações salvas com sucesso!")).toBeInTheDocument();
    fireEvent.click(screen.getByText("OK"));
    expect(handleClose).toHaveBeenCalled();
  });
});
