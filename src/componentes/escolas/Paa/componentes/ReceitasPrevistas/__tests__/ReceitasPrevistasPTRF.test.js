import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReceitasPrevistasPTRF from "../ReceitasPrevistasPTRF";
import { useGetReceitasPrevistas } from "../hooks/useGetReceitasPrevistas";
import { useGetTotalizadorRecursoProprio } from "../../DetalhamentoRecursosProprios/hooks/useGetTotalizarRecursoProprio";
import { visoesService } from "../../../../../../services/visoes.service";
import { usePaaContext } from "../../PaaContext";

jest.mock("../hooks/useGetReceitasPrevistas");
jest.mock(
  "../../DetalhamentoRecursosProprios/hooks/useGetTotalizarRecursoProprio"
);
jest.mock("../../../../../../services/visoes.service", () => ({
  visoesService: {
    getPermissoes: jest.fn(),
  },
}));
jest.mock("../../PaaContext");

jest.mock("../ReceitasPrevistasModalForm", () => {
  return function MockModalForm({ open, acaoAssociacao, onClose }) {
    if (!open) return null;
    return (
      <div data-testid="modal-form-editar">
        <span>Modal Form Editar: {acaoAssociacao?.nome || "Sem nome"}</span>
        <button onClick={onClose}>Fechar Modal Form</button>
      </div>
    );
  };
});

jest.mock("../ModalConfirmarPararAtualizacaoSaldo", () => {
  return function MockModalConfirmacao({
    open,
    onClose,
    check,
    onSubmitParadaSaldo,
  }) {
    if (!open) return null;
    return (
      <div data-testid="modal-confirmar-parada-saldo">
        <span>Status Check: {String(check)}</span>
        <button onClick={onSubmitParadaSaldo}>Confirmar Parada</button>
        <button onClick={onClose}>Cancelar Parada</button>
      </div>
    );
  };
});

jest.mock("../TabelaReceitasPrevistas", () => {
  return function MockTabela({ data, handleOpenEditar, totalRecursosProprios }) {
    return (
      <div data-testid="tabela-receitas-previstas">
        <span>Total Proprio: {totalRecursosProprios?.total || 0}</span>
        {data?.map((item) => (
          <div key={item.id}>
            <span>{item.nome}</span>
            <button
              onClick={() => handleOpenEditar(item)}
              aria-label={`Editar ${item.nome}`}
            >
              Editar
            </button>
          </div>
        ))}
      </div>
    );
  };
});

describe("ReceitasPrevistasPTRF Component", () => {
  let queryClient;

  const mockPaaPadrao = {
    uuid: "paa-uuid-123",
    associacao: "assoc-uuid-456",
    status: "EM_ELABORACAO",
    saldo_congelado_em: null,
  };

  const mockRefetchPaa = jest.fn().mockResolvedValue({});
  const mockRefetchReceitasPrevistas = jest.fn().mockResolvedValue({});

  const setupDefaultMocks = (customPaa = {}, customPaaContext = {}) => {
    const paaObj = { ...mockPaaPadrao, ...customPaa };

    usePaaContext.mockReturnValue({
      paa: paaObj,
      refetch: mockRefetchPaa,
      isFetching: false,
      ...customPaaContext,
    });

    useGetReceitasPrevistas.mockReturnValue({
      data: [
        { id: 1, nome: "Ação 1" },
        { id: 2, nome: "Ação 2" },
      ],
      isLoading: false,
      refetch: mockRefetchReceitasPrevistas,
      isFetching: false,
    });

    useGetTotalizadorRecursoProprio.mockReturnValue({
      data: { total: 1000 },
    });

    visoesService.getPermissoes.mockReturnValue(true);
  };

  const renderComponent = (props = {}) => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    return render(
      <QueryClientProvider client={queryClient}>
        <ReceitasPrevistasPTRF {...props} />
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Renderização e Props", () => {
    it("deve renderizar o título padrão 'Ações PTRF' quando nenhuma prop tituloMenu for informada", () => {
      setupDefaultMocks();
      renderComponent();

      const heading = screen.getByRole("heading", {
        level: 4,
        name: "Ações PTRF",
      });
      expect(heading).toBeInTheDocument();
    });

    it("deve renderizar o título customizado informado via prop tituloMenu", () => {
      setupDefaultMocks();
      renderComponent({ tituloMenu: "Título Customizado PTRF" });

      const heading = screen.getByRole("heading", {
        level: 4,
        name: "Título Customizado PTRF",
      });
      expect(heading).toBeInTheDocument();
    });

    it("deve renderizar a tabela com os dados fornecidos pelo hook de receitas previstas e o totalizador", () => {
      setupDefaultMocks();
      renderComponent();

      expect(
        screen.getByTestId("tabela-receitas-previstas")
      ).toBeInTheDocument();
      expect(screen.getByText("Ação 1")).toBeInTheDocument();
      expect(screen.getByText("Ação 2")).toBeInTheDocument();
      expect(screen.getByText("Total Proprio: 1000")).toBeInTheDocument();
    });

    it("deve renderizar o ícone com tooltip explicativo sobre o congelamento de saldo", () => {
      setupDefaultMocks();
      renderComponent();

      expect(
        screen.getByText("Parar atualizações do saldo")
      ).toBeInTheDocument();
    });
  });

  describe("Exibição Condicional do Checkbox de Atualização do Saldo", () => {
    it("deve exibir o checkbox quando paa.uuid existir e o status NÃO for 'EM_RETIFICACAO'", () => {
      setupDefaultMocks({ uuid: "valid-uuid", status: "EM_ELABORACAO" });
      renderComponent();

      expect(
        screen.getByTestId("checkbox-parar-atualizacoes-saldo")
      ).toBeInTheDocument();
    });

    it("não deve exibir o checkbox se paa não tiver uuid", () => {
      setupDefaultMocks({ uuid: null });
      renderComponent();

      expect(
        screen.queryByTestId("checkbox-parar-atualizacoes-saldo")
      ).not.toBeInTheDocument();
    });

    it("não deve exibir o checkbox se paa.status for 'EM_RETIFICACAO'", () => {
      setupDefaultMocks({ uuid: "valid-uuid", status: "EM_RETIFICACAO" });
      renderComponent();

      expect(
        screen.queryByTestId("checkbox-parar-atualizacoes-saldo")
      ).not.toBeInTheDocument();
    });
  });

  describe("Estados de Habilitação do Checkbox", () => {
    it("deve manter o checkbox habilitado quando tiver permissão e não houver pendências de carregamento", () => {
      setupDefaultMocks();
      renderComponent();

      const checkbox = screen.getByRole("checkbox", {
        name: /parar atualizações do saldo/i,
      });
      expect(checkbox).toBeEnabled();
    });

    it("deve desabilitar o checkbox quando o usuário não tiver permissão 'custom_change_paa'", () => {
      setupDefaultMocks();
      visoesService.getPermissoes.mockReturnValue(false);
      renderComponent();

      const checkbox = screen.getByRole("checkbox", {
        name: /parar atualizações do saldo/i,
      });
      expect(checkbox).toBeDisabled();
    });

    it("deve desabilitar o checkbox quando isLoadingReceitasPrevistas for true", () => {
      setupDefaultMocks();
      useGetReceitasPrevistas.mockReturnValue({
        data: [],
        isLoading: true,
        refetch: mockRefetchReceitasPrevistas,
        isFetching: false,
      });
      renderComponent();

      const checkbox = screen.getByRole("checkbox", {
        name: /parar atualizações do saldo/i,
      });
      expect(checkbox).toBeDisabled();
    });

    it("deve desabilitar o checkbox quando isFetchingReceitasPrevistas for true", () => {
      setupDefaultMocks();
      useGetReceitasPrevistas.mockReturnValue({
        data: [],
        isLoading: false,
        refetch: mockRefetchReceitasPrevistas,
        isFetching: true,
      });
      renderComponent();

      const checkbox = screen.getByRole("checkbox", {
        name: /parar atualizações do saldo/i,
      });
      expect(checkbox).toBeDisabled();
    });

    it("deve desabilitar o checkbox quando isFetchingPaa do contexto for true", () => {
      setupDefaultMocks({}, { isFetching: true });
      renderComponent();

      const checkbox = screen.getByRole("checkbox", {
        name: /parar atualizações do saldo/i,
      });
      expect(checkbox).toBeDisabled();
    });

    it("deve iniciar o checkbox desmarcado se paa.saldo_congelado_em for falsy", () => {
      setupDefaultMocks({ saldo_congelado_em: null });
      renderComponent();

      const checkbox = screen.getByRole("checkbox", {
        name: /parar atualizações do saldo/i,
      });
      expect(checkbox).not.toBeChecked();
    });

    it("deve iniciar o checkbox marcado se paa.saldo_congelado_em tiver valor", () => {
      setupDefaultMocks({ saldo_congelado_em: "2026-01-01T10:00:00Z" });
      renderComponent();

      const checkbox = screen.getByRole("checkbox", {
        name: /parar atualizações do saldo/i,
      });
      expect(checkbox).toBeChecked();
    });
  });

  describe("Interações com a Tabela e Modal Form", () => {
    it("deve abrir o modal de edição ao acionar o handler na tabela e fechar ao clicar em fechar", async () => {
      setupDefaultMocks();
      renderComponent();

      expect(
        screen.queryByTestId("modal-form-editar")
      ).not.toBeInTheDocument();

      const botaoEditar = screen.getByRole("button", { name: "Editar Ação 1" });
      fireEvent.click(botaoEditar);

      expect(screen.getByTestId("modal-form-editar")).toBeInTheDocument();
      expect(
        screen.getByText("Modal Form Editar: Ação 1")
      ).toBeInTheDocument();

      const botaoFechar = screen.getByRole("button", {
        name: "Fechar Modal Form",
      });
      fireEvent.click(botaoFechar);

      expect(
        screen.queryByTestId("modal-form-editar")
      ).not.toBeInTheDocument();
    });
  });

  describe("Fluxo do Modal de Confirmação de Parada do Saldo", () => {
    it("deve abrir o modal de confirmação ao clicar no checkbox de parada de saldo", () => {
      setupDefaultMocks({ saldo_congelado_em: null });
      renderComponent();

      expect(
        screen.queryByTestId("modal-confirmar-parada-saldo")
      ).not.toBeInTheDocument();

      const checkbox = screen.getByRole("checkbox", {
        name: /parar atualizações do saldo/i,
      });
      fireEvent.click(checkbox);

      expect(
        screen.getByTestId("modal-confirmar-parada-saldo")
      ).toBeInTheDocument();
      expect(screen.getByText("Status Check: true")).toBeInTheDocument();
    });

    it("deve fechar o modal de confirmação ao clicar em cancelar", () => {
      setupDefaultMocks();
      renderComponent();

      const checkbox = screen.getByRole("checkbox", {
        name: /parar atualizações do saldo/i,
      });
      fireEvent.click(checkbox);

      expect(
        screen.getByTestId("modal-confirmar-parada-saldo")
      ).toBeInTheDocument();

      const botaoCancelar = screen.getByRole("button", {
        name: "Cancelar Parada",
      });
      fireEvent.click(botaoCancelar);

      expect(
        screen.queryByTestId("modal-confirmar-parada-saldo")
      ).not.toBeInTheDocument();
    });

    it("deve refazer a busca de receitas e PAA e fechar o modal ao confirmar a parada do saldo", async () => {
      setupDefaultMocks();
      renderComponent();

      const checkbox = screen.getByRole("checkbox", {
        name: /parar atualizações do saldo/i,
      });
      fireEvent.click(checkbox);

      const botaoConfirmar = screen.getByRole("button", {
        name: "Confirmar Parada",
      });
      fireEvent.click(botaoConfirmar);

      await waitFor(() => {
        expect(mockRefetchReceitasPrevistas).toHaveBeenCalledTimes(1);
        expect(mockRefetchPaa).toHaveBeenCalledTimes(1);
        expect(
          screen.queryByTestId("modal-confirmar-parada-saldo")
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Efeitos do Spin / Carregamento", () => {
    it("deve ativar o indicador de carregamento do Spin quando o modal de confirmação estiver aberto", () => {
      setupDefaultMocks();
      renderComponent();

      const checkbox = screen.getByRole("checkbox", {
        name: /parar atualizações do saldo/i,
      });
      fireEvent.click(checkbox);

      expect(
        screen.getByTestId("modal-confirmar-parada-saldo")
      ).toBeInTheDocument();
    });

    it("deve disparar invalidação de queries do react-query com a chave retrieve-paa", async () => {
      setupDefaultMocks();
      renderComponent();

      const invalidateQueriesSpy = jest.spyOn(
        queryClient,
        "invalidateQueries"
      );

      const user = userEvent.setup();
      const checkbox = screen.getByRole("checkbox", {
        name: /parar atualizações do saldo/i,
      });
      await user.click(checkbox);

      expect(checkbox).toBeInTheDocument();
    });
  });
});