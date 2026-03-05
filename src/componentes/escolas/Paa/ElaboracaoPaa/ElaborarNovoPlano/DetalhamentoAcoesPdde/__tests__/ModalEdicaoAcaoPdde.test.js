import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ModalEdicaoReceitaPrevistaPDDE from "../ModalEdicaoReceitaPrevistaPdde";
import { usePatchReceitaPrevistaPdde } from '../hooks/usePatchReceitaPrevistaPdde';
import { usePostReceitaPrevistaPdde } from '../hooks/usePostReceitaPrevistaPdde';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("../hooks/usePatchReceitaPrevistaPdde");
jest.mock("../hooks/usePostReceitaPrevistaPdde");

const mockMutatePatch = jest.fn();
const mockMutatePost = jest.fn();
const mockOnClose = jest.fn();

const receitaPrevisaPdde = {
  id: 1,
  uuid: "acao-pdde-uuid-1234",
  nome: "Recurso PDDE",
  programa: 1,
  programa_objeto: { id: 1, uuid: "1de0c2ac-8468-48a6-89e8-14ffa0d78133" },
  aceita_custeio: true,
  aceita_capital: true,
  aceita_livre_aplicacao: true,
  receitas_previstas_pdde_valores: {
    uuid: "1de0c2ac-8468-48a6-89e8-14ffa0d78131",
    saldo_capital: "100.00",
    saldo_custeio: "200.00",
    saldo_livre: "300.00",
    previsao_valor_capital: "50.00",
    previsao_valor_custeio: "60.00",
    previsao_valor_livre: "70.00",
  },
};

describe("ModalEdicaoAcaoPdde", () => {
  let queryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("PAA", "fake-uuid-paa");

    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

    usePatchReceitaPrevistaPdde.mockReturnValue({
      mutationPatch: { mutate: mockMutatePatch, isPending: false },
    });

    usePostReceitaPrevistaPdde.mockReturnValue({
      mutationPost: { mutate: mockMutatePost, isPending: false },
    });
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      open: true,
      onClose: mockOnClose,
      receitaPrevistaPDDE: receitaPrevisaPdde,
    };
    return render(
      <QueryClientProvider client={queryClient}>
        <ModalEdicaoReceitaPrevistaPDDE {...defaultProps} {...props} />
      </QueryClientProvider>
    );
  };

  describe("Renderização", () => {
    it("renderiza o título com o nome do recurso", () => {
      renderComponent();
      expect(
        screen.getByText(`Editar Recurso ${receitaPrevisaPdde.nome}`)
      ).toBeInTheDocument();
    });

    it("renderiza as colunas do cabeçalho do formulário", () => {
      renderComponent();
      expect(screen.getByText("Saldo reprogramado")).toBeInTheDocument();
      expect(screen.getByText("Receita prevista")).toBeInTheDocument();
      expect(screen.getByText("Total")).toBeInTheDocument();
    });

    it("renderiza os labels Custeio, Capital e Livre Aplicação", () => {
      renderComponent();
      expect(screen.getAllByText("Custeio")).toHaveLength(3);
      expect(screen.getAllByText("Capital")).toHaveLength(3);
      expect(screen.getAllByText("Livre Aplicação")).toHaveLength(3);
    });

    it("renderiza os botões Cancelar e Salvar", () => {
      renderComponent();
      expect(screen.getByText("Cancelar")).toBeInTheDocument();
      expect(screen.getByText("Salvar")).toBeInTheDocument();
    });

    it("não exibe o modal quando open é false", () => {
      renderComponent({ open: false });
      expect(
        screen.queryByText(`Editar Recurso ${receitaPrevisaPdde.nome}`)
      ).not.toBeInTheDocument();
    });
  });

  describe("Botão Cancelar", () => {
    it("chama onClose ao clicar em Cancelar", () => {
      renderComponent();
      fireEvent.click(screen.getByText("Cancelar"));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("Botão Salvar", () => {
    it("desabilita o botão Salvar quando nenhum tipo é aceito", async () => {
      renderComponent({
        receitaPrevistaPDDE: {
          ...receitaPrevisaPdde,
          aceita_custeio: false,
          aceita_capital: false,
          aceita_livre_aplicacao: false,
        },
      });

      await waitFor(() => {
        expect(screen.getByText("Salvar")).toBeDisabled();
      });
    });

    it("mantém o botão Salvar habilitado quando ao menos um tipo é aceito", async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText("Salvar")).not.toBeDisabled();
      });
    });
  });

  describe("Campos desabilitados", () => {
    it("desabilita saldo e previsão de Custeio quando aceita_custeio é false", () => {
      renderComponent({
        receitaPrevistaPDDE: { ...receitaPrevisaPdde, aceita_custeio: false },
      });

      const inputsCusteio = screen.getAllByLabelText("Custeio");
      // saldo_custeio e previsao_valor_custeio ficam desabilitados
      expect(inputsCusteio[0]).toBeDisabled();
      expect(inputsCusteio[1]).toBeDisabled();
    });

    it("desabilita saldo e previsão de Capital quando aceita_capital é false", () => {
      renderComponent({
        receitaPrevistaPDDE: { ...receitaPrevisaPdde, aceita_capital: false },
      });

      const inputsCapital = screen.getAllByLabelText("Capital");
      expect(inputsCapital[0]).toBeDisabled();
      expect(inputsCapital[1]).toBeDisabled();
    });

    it("desabilita saldo e previsão de Livre Aplicação quando aceita_livre_aplicacao é false", () => {
      renderComponent({
        receitaPrevistaPDDE: {
          ...receitaPrevisaPdde,
          aceita_livre_aplicacao: false,
        },
      });

      const inputsLivre = screen.getAllByLabelText("Livre Aplicação");
      expect(inputsLivre[0]).toBeDisabled();
      expect(inputsLivre[1]).toBeDisabled();
    });

    it("mantém os campos de Total sempre desabilitados", () => {
      renderComponent();

      const inputsCusteio = screen.getAllByLabelText("Custeio");
      const inputsCapital = screen.getAllByLabelText("Capital");
      const inputsLivre = screen.getAllByLabelText("Livre Aplicação");

      // O terceiro campo de cada linha (total) é sempre disabled
      expect(inputsCusteio[2]).toBeDisabled();
      expect(inputsCapital[2]).toBeDisabled();
      expect(inputsLivre[2]).toBeDisabled();
    });
  });

  describe("Submissão do formulário", () => {
    it("chama mutationPatch ao submeter quando receitas_previstas_pdde_valores tem uuid", async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText("Salvar")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("Salvar"));

      await waitFor(() => {
        expect(mockMutatePatch).toHaveBeenCalledWith({
          uuid: receitaPrevisaPdde.receitas_previstas_pdde_valores.uuid,
          payload: {
            saldo_custeio: parseFloat(
              receitaPrevisaPdde.receitas_previstas_pdde_valores.saldo_custeio
            ),
            saldo_capital: parseFloat(
              receitaPrevisaPdde.receitas_previstas_pdde_valores.saldo_capital
            ),
            saldo_livre: parseFloat(
              receitaPrevisaPdde.receitas_previstas_pdde_valores.saldo_livre
            ),
            previsao_valor_custeio: parseFloat(
              receitaPrevisaPdde.receitas_previstas_pdde_valores.previsao_valor_custeio
            ),
            previsao_valor_capital: parseFloat(
              receitaPrevisaPdde.receitas_previstas_pdde_valores.previsao_valor_capital
            ),
            previsao_valor_livre: parseFloat(
              receitaPrevisaPdde.receitas_previstas_pdde_valores.previsao_valor_livre
            ),
          },
        });
      });
    });

    it("não chama mutationPost ao submeter quando receitas_previstas_pdde_valores tem uuid", async () => {
      renderComponent();

      fireEvent.click(screen.getByText("Salvar"));

      await waitFor(() => {
        expect(mockMutatePatch).toHaveBeenCalled();
      });

      expect(mockMutatePost).not.toHaveBeenCalled();
    });

    it("chama mutationPost ao submeter quando receitas_previstas_pdde_valores não tem uuid", async () => {
      renderComponent({
        receitaPrevistaPDDE: {
          ...receitaPrevisaPdde,
          receitas_previstas_pdde_valores: undefined,
        },
      });

      await waitFor(() => {
        expect(screen.getByText("Salvar")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("Salvar"));

      await waitFor(() => {
        expect(mockMutatePost).toHaveBeenCalledWith({
          paa: "fake-uuid-paa",
          acao_pdde: receitaPrevisaPdde.uuid,
          saldo_custeio: 0,
          saldo_capital: 0,
          saldo_livre: 0,
          previsao_valor_custeio: 0,
          previsao_valor_capital: 0,
          previsao_valor_livre: 0,
        });
      });
    });

    it("não chama mutationPatch ao submeter quando receitas_previstas_pdde_valores não tem uuid", async () => {
      renderComponent({
        receitaPrevistaPDDE: {
          ...receitaPrevisaPdde,
          receitas_previstas_pdde_valores: undefined,
        },
      });

      fireEvent.click(screen.getByText("Salvar"));

      await waitFor(() => {
        expect(mockMutatePost).toHaveBeenCalled();
      });

      expect(mockMutatePatch).not.toHaveBeenCalled();
    });
  });
});
