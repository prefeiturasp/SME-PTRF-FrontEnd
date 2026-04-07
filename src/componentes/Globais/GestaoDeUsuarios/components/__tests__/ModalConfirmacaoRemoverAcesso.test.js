import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import { ModalConfirmacaoRemoverAcesso } from "../ModalConfirmacaoRemoverAcesso";

jest.mock("../../../ModalAntDesign/modalRemoverAcessoUsuario", () => ({
  ModalRemovelAcessoUsuario: ({
    handleShow,
    titulo,
    bodyText,
    observacao,
    cancelText,
    okText,
    handleCancel,
    handleOk,
  }) => {
    if (!handleShow) {
      return null;
    }

    return (
      <section aria-label="Modal remover acesso" role="dialog">
        <h1>{titulo}</h1>
        <p>{bodyText}</p>

        {observacao ? (
          <div data-testid="observacao-modal">
            <span>Observação:</span>
            <p>{observacao}</p>
          </div>
        ) : null}

        <button type="button" onClick={handleCancel}>
          {cancelText}
        </button>
        <button type="button" onClick={handleOk}>
          {okText}
        </button>
      </section>
    );
  },
}));

const defaultProps = {
  visao: "UE",
  show: true,
  botaoCancelarHandle: jest.fn(),
  botaoConfirmarHandle: jest.fn(),
};

const setup = (props = {}) =>
  render(<ModalConfirmacaoRemoverAcesso {...defaultProps} {...props} />);

describe("ModalConfirmacaoRemoverAcesso", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should render safely when props are absent", () => {
    render(<ModalConfirmacaoRemoverAcesso />);

    expect(screen.queryByRole("dialog", { name: /Modal remover acesso/i })).not.toBeInTheDocument();
  });

  test("should render with UE message and without observacao when visao is UE", () => {
    setup({ visao: "UE", show: true });

    expect(screen.getByRole("dialog", { name: /Modal remover acesso/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Remover acesso" })).toBeInTheDocument();
    expect(
      screen.getByText("Tem certeza que deseja remover o acesso deste usuário nessa unidade?")
    ).toBeInTheDocument();
    expect(screen.queryByTestId("observacao-modal")).not.toBeInTheDocument();
  });

  test("should render with DRE message and observacao when visao is DRE", () => {
    setup({ visao: "DRE", show: true });

    expect(
      screen.getByText(
        "Tem certeza que deseja remover o acesso deste usuário nesta DRE e em suas unidades, se houver?"
      )
    ).toBeInTheDocument();
    expect(screen.getByTestId("observacao-modal")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Para remover o acesso a apenas uma de suas unidades, basta desabilitá-lo na referida unidade."
      )
    ).toBeInTheDocument();
  });

  test("should render with SME message and observacao when visao is SME", () => {
    setup({ visao: "SME", show: true });

    expect(
      screen.getByText("Tem certeza que deseja remover o acesso deste usuário em todas as unidades?")
    ).toBeInTheDocument();
    expect(screen.getByTestId("observacao-modal")).toBeInTheDocument();
  });

  test("should render fallback message when visao is invalid", () => {
    setup({ visao: "INVALIDA", show: true });

    expect(
      screen.getByText("Mensagem não disponível para a visão selecionada.")
    ).toBeInTheDocument();
    expect(screen.queryByTestId("observacao-modal")).not.toBeInTheDocument();
  });

  test("should not render dialog when show is false", () => {
    setup({ show: false, visao: "UE" });

    expect(screen.queryByRole("dialog", { name: /Modal remover acesso/i })).not.toBeInTheDocument();
  });

  test("should call cancel and confirm callbacks when user clicks action buttons", async () => {
    const user = userEvent.setup();
    const botaoCancelarHandle = jest.fn();
    const botaoConfirmarHandle = jest.fn();

    setup({
      show: true,
      visao: "UE",
      botaoCancelarHandle,
      botaoConfirmarHandle,
    });

    await user.click(screen.getByRole("button", { name: "Cancelar" }));
    await user.click(screen.getByRole("button", { name: "Remover acesso" }));

    expect(botaoCancelarHandle).toHaveBeenCalledTimes(1);
    expect(botaoConfirmarHandle).toHaveBeenCalledTimes(1);
  });

  test("should update message and observacao when props change on rerender", () => {
    const { rerender } = setup({ visao: "UE", show: true });

    expect(
      screen.getByText("Tem certeza que deseja remover o acesso deste usuário nessa unidade?")
    ).toBeInTheDocument();
    expect(screen.queryByTestId("observacao-modal")).not.toBeInTheDocument();

    rerender(
      <ModalConfirmacaoRemoverAcesso
        {...defaultProps}
        visao="DRE"
        show={true}
      />
    );

    expect(
      screen.getByText(
        "Tem certeza que deseja remover o acesso deste usuário nesta DRE e em suas unidades, se houver?"
      )
    ).toBeInTheDocument();
    expect(screen.getByTestId("observacao-modal")).toBeInTheDocument();
  });
});
