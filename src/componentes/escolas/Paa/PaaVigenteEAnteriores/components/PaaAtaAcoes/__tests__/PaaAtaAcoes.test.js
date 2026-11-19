import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PaaAtaAcoes } from "../PaaAtaAcoes";
import { postGerarAtaPaa } from "../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../Globais/ToastCustom";

const mockNavigate = jest.fn();
let mockPodeEditar = true;

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock("react-tooltip", () => ({
  Tooltip: ({ id }) => <div data-testid="tooltip" data-id={id} />,
}));

jest.mock("../../../../../../../services/visoes.service", () => ({
  visoesService: { getPermissoes: () => mockPodeEditar },
}));

jest.mock("../../../../../../../services/escolas/Paa.service", () => ({
  postGerarAtaPaa: jest.fn(),
}));

jest.mock("../../../../../../Globais/ToastCustom", () => ({
  toastCustom: { ToastCustomError: jest.fn(), ToastCustomSuccess: jest.fn() },
}));

jest.mock("../../ModalConfirmaGeracaoAta/ModalConfirmaGeracaoAta", () => ({
  ModalConfirmaGeracaoAta: ({ open, emRetificacao, onClose, onConfirm }) => (
    <div data-testid="modal-confirma" data-open={String(open)} data-retificacao={String(emRetificacao)}>
      <button type="button" onClick={onClose}>fechar-modal</button>
      <button type="button" onClick={onConfirm}>confirmar-modal</button>
    </div>
  ),
}));

describe("PaaAtaAcoes", () => {
  const renderAcoes = (props = {}) =>
    render(
      <PaaAtaAcoes
        paaUuid="paa-1"
        ata={{ pode_gerar_ata: true }}
        documentoPlano={{ status: { status_geracao: "CONCLUIDO" } }}
        onDepoisDeGerar={jest.fn()}
        dadosPaa={{ esta_em_retificacao: false }}
        {...props}
      />
    );

  const botaoGerar = () => screen.getByRole("button", { name: "Gerar ata" });

  beforeEach(() => {
    mockPodeEditar = true;
    mockNavigate.mockReset();
    postGerarAtaPaa.mockReset();
    toastCustom.ToastCustomError.mockReset();
    toastCustom.ToastCustomSuccess.mockReset();
  });

  describe("botão Visualizar prévia da ata", () => {
    it("aparece quando o documento final foi gerado", () => {
      renderAcoes();

      expect(screen.getByRole("button", { name: "Visualizar prévia da ata" })).toBeEnabled();
    });

    it("não aparece quando o documento final não foi concluído", () => {
      renderAcoes({ documentoPlano: { status: { status_geracao: "EM_PROCESSAMENTO" } } });

      expect(screen.queryByRole("button", { name: "Visualizar prévia da ata" })).not.toBeInTheDocument();
    });

    it("não aparece sem documento do plano", () => {
      renderAcoes({ documentoPlano: undefined });

      expect(screen.queryByRole("button", { name: "Visualizar prévia da ata" })).not.toBeInTheDocument();
    });

    it("fica desabilitado sem uuid do PAA", () => {
      renderAcoes({ paaUuid: undefined });

      expect(screen.getByRole("button", { name: "Visualizar prévia da ata" })).toBeDisabled();
    });

    it("navega para a visualização da ata informando a origem", async () => {
      renderAcoes();

      await userEvent.click(screen.getByRole("button", { name: "Visualizar prévia da ata" }));

      expect(mockNavigate).toHaveBeenCalledWith("/relatorios-paa/visualizacao-da-ata-paa/paa-1", {
        state: { origem: "paa-vigente-e-anteriores" },
      });
    });
  });

  describe("botão Gerar ata", () => {
    it("fica habilitado, sem tooltip, com permissão e ata apta", () => {
      renderAcoes();

      expect(botaoGerar()).toBeEnabled();
      expect(screen.queryByTestId("tooltip")).not.toBeInTheDocument();
    });

    it("fica desabilitado sem permissão e explica o motivo", () => {
      mockPodeEditar = false;
      renderAcoes();

      expect(botaoGerar()).toBeDisabled();
      expect(botaoGerar()).toHaveAttribute("data-tooltip-content", "Sem permissão para gerar ata.");
      expect(botaoGerar()).toHaveAttribute("data-tooltip-id", "tooltip-gerar-ata-paa-1");
      expect(screen.getByTestId("tooltip")).toHaveAttribute("data-id", "tooltip-gerar-ata-paa-1");
    });

    it("fica desabilitado quando a ata ainda não pode ser gerada", () => {
      renderAcoes({ ata: { pode_gerar_ata: false } });

      expect(botaoGerar()).toBeDisabled();
      expect(botaoGerar()).toHaveAttribute(
        "data-tooltip-content",
        "Quando todos os dados estiverem preenchidos, a opção fica habilitada."
      );
    });

    it("fica desabilitado sem uuid do PAA e usa id de tooltip genérico", () => {
      renderAcoes({ paaUuid: undefined });

      expect(botaoGerar()).toBeDisabled();
      expect(screen.getByTestId("tooltip")).toHaveAttribute("data-id", "tooltip-gerar-ata-x");
    });

    it("abre o modal de confirmação ao clicar", async () => {
      renderAcoes();
      expect(screen.getByTestId("modal-confirma")).toHaveAttribute("data-open", "false");

      await userEvent.click(botaoGerar());

      expect(screen.getByTestId("modal-confirma")).toHaveAttribute("data-open", "true");
    });

    it("não abre o modal quando desabilitado", async () => {
      renderAcoes({ ata: { pode_gerar_ata: false } });

      await userEvent.click(botaoGerar());

      expect(screen.getByTestId("modal-confirma")).toHaveAttribute("data-open", "false");
    });
  });

  describe("modal de confirmação", () => {
    it("indica ata de retificação quando o PAA está em retificação", () => {
      renderAcoes({ dadosPaa: { esta_em_retificacao: true } });

      expect(screen.getByTestId("modal-confirma")).toHaveAttribute("data-retificacao", "true");
    });

    it("assume que não é retificação quando dadosPaa não é informado", () => {
      renderAcoes({ dadosPaa: undefined });

      expect(screen.getByTestId("modal-confirma")).toHaveAttribute("data-retificacao", "false");
    });

    it("fecha o modal ao cancelar", async () => {
      renderAcoes();
      await userEvent.click(botaoGerar());

      await userEvent.click(screen.getByText("fechar-modal"));

      expect(screen.getByTestId("modal-confirma")).toHaveAttribute("data-open", "false");
    });

    it("gera a ata, avisa o sucesso e notifica o pai ao confirmar", async () => {
      postGerarAtaPaa.mockResolvedValue({});
      const onDepoisDeGerar = jest.fn();
      renderAcoes({ onDepoisDeGerar });
      await userEvent.click(botaoGerar());

      await userEvent.click(screen.getByText("confirmar-modal"));

      await waitFor(() => expect(onDepoisDeGerar).toHaveBeenCalledTimes(1));
      expect(postGerarAtaPaa).toHaveBeenCalledWith("paa-1", { confirmar: 1 });
      expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
        "Sucesso!",
        "Geração da ata iniciada. Aguarde o processamento."
      );
      expect(screen.getByTestId("modal-confirma")).toHaveAttribute("data-open", "false");
    });

    it("não falha ao gerar sem onDepoisDeGerar", async () => {
      postGerarAtaPaa.mockResolvedValue({});
      renderAcoes({ onDepoisDeGerar: undefined });
      await userEvent.click(botaoGerar());

      await userEvent.click(screen.getByText("confirmar-modal"));

      await waitFor(() => expect(toastCustom.ToastCustomSuccess).toHaveBeenCalled());
    });

    it("mostra a mensagem do servidor quando a geração falha", async () => {
      postGerarAtaPaa.mockRejectedValue({ response: { data: { mensagem: "Ata incompleta" } } });
      const onDepoisDeGerar = jest.fn();
      renderAcoes({ onDepoisDeGerar });
      await userEvent.click(botaoGerar());

      await userEvent.click(screen.getByText("confirmar-modal"));

      await waitFor(() => expect(toastCustom.ToastCustomError).toHaveBeenCalledWith("Erro!", "Ata incompleta"));
      expect(onDepoisDeGerar).not.toHaveBeenCalled();
      expect(toastCustom.ToastCustomSuccess).not.toHaveBeenCalled();
    });

    it("usa mensagem padrão quando o servidor não informa o erro", async () => {
      postGerarAtaPaa.mockRejectedValue(new Error("falha"));
      renderAcoes();
      await userEvent.click(botaoGerar());

      await userEvent.click(screen.getByText("confirmar-modal"));

      await waitFor(() =>
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith("Erro!", "Erro ao iniciar geração da ata.")
      );
    });

    it("avisa que o PAA não foi identificado quando confirma sem uuid", async () => {
      renderAcoes({ paaUuid: undefined });

      await userEvent.click(screen.getByText("confirmar-modal"));

      expect(toastCustom.ToastCustomError).toHaveBeenCalledWith("Erro!", "PAA não identificado.");
      expect(postGerarAtaPaa).not.toHaveBeenCalled();
    });
  });
});
