import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModalConfirmaGeracaoAta } from "../ModalConfirmaGeracaoAta";

describe("ModalConfirmaGeracaoAta", () => {
  const renderModal = (props = {}) => {
    const handlers = { onClose: jest.fn(), onConfirm: jest.fn() };
    render(<ModalConfirmaGeracaoAta open emRetificacao={false} {...handlers} {...props} />);
    return handlers;
  };

  it("não renderiza o conteúdo quando fechado", () => {
    renderModal({ open: false });

    expect(screen.queryByText("Confirmar geração da Ata")).not.toBeInTheDocument();
  });

  it("exibe o título e a mensagem de Apresentação por padrão", () => {
    renderModal();

    expect(screen.getByText("Confirmar geração da Ata")).toBeInTheDocument();
    expect(
      screen.getByText(/Ao gerar a Ata de Apresentação, não será mais possível editá-la\. Deseja continuar\?/)
    ).toBeInTheDocument();
  });

  it("exibe a mensagem de Retificação quando em retificação", () => {
    renderModal({ emRetificacao: true });

    expect(screen.getByText(/Ao gerar a Ata de Retificação/)).toBeInTheDocument();
    expect(screen.queryByText(/Ata de Apresentação/)).not.toBeInTheDocument();
  });

  it("chama onConfirm ao confirmar", async () => {
    const { onConfirm, onClose } = renderModal();

    await userEvent.click(screen.getByRole("button", { name: "Confirmar" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("chama onClose ao cancelar", async () => {
    const { onConfirm, onClose } = renderModal();

    await userEvent.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("chama onClose pelo botão de fechar do cabeçalho", async () => {
    const { onClose } = renderModal();

    await userEvent.click(screen.getByRole("button", { name: "Fechar" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
