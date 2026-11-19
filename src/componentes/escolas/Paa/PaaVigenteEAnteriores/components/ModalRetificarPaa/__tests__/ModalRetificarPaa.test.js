import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModalRetificarPAA } from "../ModalRetificarPaa";

describe("ModalRetificarPAA", () => {
  const baseProps = () => ({
    open: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    paaData: { uuid: "paa-1" },
    statusDocumento: { mensagem: "Documento gerado em 01/01/2026" },
    isLoading: false,
  });

  const renderModal = (props = {}) => {
    const all = { ...baseProps(), ...props };
    const utils = render(<ModalRetificarPAA {...all} />);
    return { ...all, ...utils };
  };

  const campo = () => screen.getByPlaceholderText("Digite a justificativa aqui");
  const botaoRetificar = () => screen.getByRole("button", { name: "Retificar" });

  it("não renderiza o conteúdo quando fechado", () => {
    renderModal({ open: false });

    expect(screen.queryByText("Retificar o PAA")).not.toBeInTheDocument();
  });

  it("exibe o título, o aviso e a mensagem do status do documento", () => {
    renderModal();

    expect(screen.getByText("Retificar o PAA")).toBeInTheDocument();
    expect(screen.getByText(/Documento gerado em 01\/01\/2026/)).toBeInTheDocument();
    expect(screen.getByText(/Deseja prosseguir com a retificação\?/)).toBeInTheDocument();
  });

  it("omite o aviso quando não há dados do PAA, mas mantém a justificativa", () => {
    renderModal({ paaData: null });

    expect(screen.queryByText(/Deseja prosseguir com a retificação\?/)).not.toBeInTheDocument();
    expect(campo()).toBeInTheDocument();
  });

  it("tolera ausência de statusDocumento", () => {
    renderModal({ statusDocumento: undefined });

    expect(screen.getByText(/Deseja prosseguir com a retificação\?/)).toBeInTheDocument();
  });

  it("mantém Retificar desabilitado enquanto a justificativa está vazia", () => {
    renderModal();

    expect(botaoRetificar()).toBeDisabled();
  });

  it("habilita Retificar ao digitar a justificativa", async () => {
    renderModal();

    await userEvent.type(campo(), "Erro de valor");

    expect(campo()).toHaveValue("Erro de valor");
    expect(botaoRetificar()).toBeEnabled();
  });

  it("mantém Retificar desabilitado durante o carregamento", async () => {
    renderModal({ isLoading: true });

    await userEvent.type(campo(), "Motivo");

    expect(botaoRetificar()).toBeDisabled();
  });

  it("confirma com a justificativa digitada", async () => {
    const { onConfirm } = renderModal();

    await userEvent.type(campo(), "Motivo da retificação");
    await userEvent.click(botaoRetificar());

    expect(onConfirm).toHaveBeenCalledWith("Motivo da retificação");
  });

  it("chama onClose ao cancelar e pelo botão de fechar", async () => {
    const { onClose } = renderModal();

    await userEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    await userEvent.click(screen.getByRole("button", { name: "Fechar" }));

    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("limpa a justificativa ao reabrir o modal", async () => {
    const props = baseProps();
    const { rerender } = render(<ModalRetificarPAA {...props} />);
    await userEvent.type(campo(), "Texto antigo");

    rerender(<ModalRetificarPAA {...props} open={false} />);
    rerender(<ModalRetificarPAA {...props} open />);

    expect(campo()).toHaveValue("");
    expect(botaoRetificar()).toBeDisabled();
  });
});
