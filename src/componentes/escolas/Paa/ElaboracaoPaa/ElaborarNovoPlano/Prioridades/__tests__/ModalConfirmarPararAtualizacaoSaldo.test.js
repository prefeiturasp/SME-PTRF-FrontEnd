import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ModalConfirmaPararAtualizacaoSaldo from "../ModalConfirmarPararAtualizacaoSaldo";
import { postDesativarAtualizacaoSaldoPAA } from "../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../Globais/ToastCustom";

jest.mock("../../../../../../../services/escolas/Paa.service", () => ({
  postDesativarAtualizacaoSaldoPAA: jest.fn(),
}));

jest.mock("../../../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
    ToastCustomError: jest.fn(),
  },
}));

const criarCliente = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

describe("Modal de bloqueio do saldo nas prioridades", () => {
  const onClose = jest.fn();
  const onSubmitParadaSaldo = jest.fn();

  const renderModal = () =>
    render(
      <QueryClientProvider client={criarCliente()}>
        <ModalConfirmaPararAtualizacaoSaldo
          open
          onClose={onClose}
          paa={{ uuid: "paa-1" }}
          onSubmitParadaSaldo={onSubmitParadaSaldo}
        />
      </QueryClientProvider>
    );

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  it("deve explicar o bloqueio do saldo e permitir cancelar", async () => {
    const user = userEvent.setup();
    renderModal();

    expect(
      screen.getByText("Gostaria de Bloquear a atualização do Saldo?")
    ).toBeInTheDocument();
    expect(
      screen.getByText(/O Saldo reprogramado do PTRF será bloqueado/)
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Não" }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(postDesativarAtualizacaoSaldoPAA).not.toHaveBeenCalled();
  });

  it("deve bloquear o saldo e confirmar a ação quando a gravação tem sucesso", async () => {
    const user = userEvent.setup();
    postDesativarAtualizacaoSaldoPAA.mockResolvedValue({ ok: true });

    renderModal();
    await user.click(screen.getByRole("button", { name: "Sim" }));

    await waitFor(() => {
      expect(postDesativarAtualizacaoSaldoPAA).toHaveBeenCalledWith("paa-1");
    });
    await waitFor(() => {
      expect(onSubmitParadaSaldo).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });
    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
      "As atualizações de saldo estão bloqueadas."
    );
  });

  it("deve fechar o aviso e manter a atualização do saldo quando a gravação falha", async () => {
    const user = userEvent.setup();
    postDesativarAtualizacaoSaldoPAA.mockRejectedValue({
      response: { data: { mensagem: "Não foi possível bloquear." } },
    });

    renderModal();
    await user.click(screen.getByRole("button", { name: "Sim" }));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
    });
    expect(onSubmitParadaSaldo).not.toHaveBeenCalled();
    expect(toastCustom.ToastCustomError).toHaveBeenCalledWith("Não foi possível bloquear.");
  });
});
