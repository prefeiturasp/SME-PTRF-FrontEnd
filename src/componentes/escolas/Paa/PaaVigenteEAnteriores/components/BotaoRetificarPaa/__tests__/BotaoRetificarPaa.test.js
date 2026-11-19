import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BotaoRetificarPaa } from "../BotaoRetificarPaa";
import { toastCustom } from "../../../../../../Globais/ToastCustom";

const mockNavigate = jest.fn();
const mockMutateAsync = jest.fn();
let mockPodeEditar = true;

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock("antd", () => ({
  Spin: ({ spinning, children }) => <div data-testid="spin" data-spinning={String(spinning)}>{children}</div>,
}));

jest.mock("../../../../../../../services/visoes.service", () => ({
  visoesService: { getPermissoes: () => mockPodeEditar },
}));

jest.mock("../../../../../../Globais/ToastCustom", () => ({
  toastCustom: { ToastCustomError: jest.fn(), ToastCustomSuccess: jest.fn() },
}));

jest.mock("../../../../componentes/hooks/usePostIniciarRetificacaoPaa", () => ({
  usePostIniciarRetificacaoPaa: () => ({ mutationPost: { mutateAsync: (...args) => mockMutateAsync(...args) } }),
}));

jest.mock("../../ModalRetificarPaa/ModalRetificarPaa", () => ({
  ModalRetificarPAA: ({ open, onClose, onConfirm, paaData, statusDocumento, isLoading }) => (
    <div
      data-testid="modal-retificar"
      data-open={String(open)}
      data-loading={String(isLoading)}
      data-paa={paaData?.uuid}
      data-mensagem={statusDocumento?.mensagem}
    >
      <button type="button" onClick={onClose}>fechar-modal</button>
      <button type="button" onClick={() => onConfirm("Motivo X")}>confirmar-modal</button>
    </div>
  ),
}));

describe("BotaoRetificarPaa", () => {
  const paaGerado = { uuid: "paa-1", status: "GERADO" };
  const paaEmRetificacao = { uuid: "paa-1", status: "EM_RETIFICACAO" };
  const statusDocumento = { mensagem: "Documento gerado" };

  const renderBotao = (paa = paaGerado) => render(<BotaoRetificarPaa paa={paa} statusDocumento={statusDocumento} />);

  beforeEach(() => {
    mockPodeEditar = true;
    mockNavigate.mockReset();
    mockMutateAsync.mockReset();
    toastCustom.ToastCustomError.mockReset();
    toastCustom.ToastCustomSuccess.mockReset();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => jest.restoreAllMocks());

  describe("rótulo e permissão", () => {
    it("mostra 'Retificar o PAA' para PAA gerado", () => {
      renderBotao();

      expect(screen.getByRole("button", { name: "Retificar o PAA" })).toBeEnabled();
    });

    it("mostra 'Continuar Retificação' para PAA em retificação", () => {
      renderBotao(paaEmRetificacao);

      expect(screen.getByRole("button", { name: "Continuar Retificação" })).toBeInTheDocument();
    });

    it("fica desabilitado sem permissão de edição", () => {
      mockPodeEditar = false;
      renderBotao();

      expect(screen.getByRole("button", { name: "Retificar o PAA" })).toBeDisabled();
    });
  });

  describe("abertura", () => {
    it("abre o modal repassando o PAA e o status do documento", async () => {
      renderBotao();
      expect(screen.getByTestId("modal-retificar")).toHaveAttribute("data-open", "false");

      await userEvent.click(screen.getByRole("button", { name: "Retificar o PAA" }));

      const modal = screen.getByTestId("modal-retificar");
      expect(modal).toHaveAttribute("data-open", "true");
      expect(modal).toHaveAttribute("data-paa", "paa-1");
      expect(modal).toHaveAttribute("data-mensagem", "Documento gerado");
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("fecha o modal pelo onClose", async () => {
      renderBotao();
      await userEvent.click(screen.getByRole("button", { name: "Retificar o PAA" }));

      await userEvent.click(screen.getByText("fechar-modal"));

      expect(screen.getByTestId("modal-retificar")).toHaveAttribute("data-open", "false");
    });

    it("em retificação, navega direto para a tela de retificação sem abrir o modal", async () => {
      renderBotao(paaEmRetificacao);

      await userEvent.click(screen.getByRole("button", { name: "Continuar Retificação" }));

      expect(mockNavigate).toHaveBeenCalledWith("/retificacao-paa/paa-1", {
        state: { origem: "paa-vigente-e-anteriores" },
      });
      expect(screen.getByTestId("modal-retificar")).toHaveAttribute("data-open", "false");
    });
  });

  describe("confirmação da retificação", () => {
    const abrirEConfirmar = async () => {
      await userEvent.click(screen.getByRole("button", { name: "Retificar o PAA" }));
      await userEvent.click(screen.getByText("confirmar-modal"));
    };

    it("inicia a retificação com a justificativa, avisa o sucesso e navega", async () => {
      mockMutateAsync.mockResolvedValue({ data: { mensagem: "Iniciada com sucesso" } });
      renderBotao();

      await abrirEConfirmar();

      await waitFor(() => expect(mockNavigate).toHaveBeenCalledTimes(1));
      expect(mockMutateAsync).toHaveBeenCalledWith({ paaUuid: "paa-1", payload: { justificativa: "Motivo X" } });
      expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith("Retificação", "Iniciada com sucesso");
      expect(mockNavigate).toHaveBeenCalledWith("/retificacao-paa/paa-1", {
        state: { origem: "paa-vigente-e-anteriores" },
      });
      expect(screen.getByTestId("modal-retificar")).toHaveAttribute("data-open", "false");
    });

    it("usa mensagem padrão de sucesso quando a resposta não traz mensagem", async () => {
      mockMutateAsync.mockResolvedValue({});
      renderBotao();

      await abrirEConfirmar();

      await waitFor(() =>
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith("Retificação", "Retificação iniciada com sucesso!")
      );
    });

    it("mostra a mensagem do servidor quando falha e não navega", async () => {
      mockMutateAsync.mockRejectedValue({ response: { data: { mensagem: "PAA anterior pendente" } } });
      renderBotao();

      await abrirEConfirmar();

      await waitFor(() =>
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith("Retificação", "PAA anterior pendente")
      );
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(toastCustom.ToastCustomSuccess).not.toHaveBeenCalled();
    });

    it("usa mensagem padrão de erro quando o servidor não informa", async () => {
      mockMutateAsync.mockRejectedValue(new Error("falha"));
      renderBotao();

      await abrirEConfirmar();

      await waitFor(() =>
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith("Retificação", "Falha ao iniciar retificação do PAA!")
      );
    });

    it("sinaliza carregamento durante a requisição e o desfaz ao terminar", async () => {
      let resolver;
      mockMutateAsync.mockReturnValue(new Promise((resolve) => { resolver = resolve; }));
      renderBotao();

      await abrirEConfirmar();

      expect(screen.getByTestId("spin")).toHaveAttribute("data-spinning", "true");
      expect(screen.getByTestId("modal-retificar")).toHaveAttribute("data-loading", "true");

      resolver({});

      await waitFor(() => expect(screen.getByTestId("spin")).toHaveAttribute("data-spinning", "false"));
    });
  });
});
