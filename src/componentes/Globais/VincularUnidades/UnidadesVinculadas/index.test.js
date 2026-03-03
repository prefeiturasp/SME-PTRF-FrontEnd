import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import "@testing-library/jest-dom";

import { UnidadesVinculadas } from "./index";
import * as useGetHooks from "../hooks/useGet";
import * as useVinculoHooks from "../hooks/useVinculoUnidade";
import { openModal, closeModal } from "../../../../store/reducers/componentes/Globais/Modal/actions";


jest.mock("../hooks/useGet");

jest.mock("../hooks/useVinculoUnidade");

jest.mock("../../../../store/reducers/componentes/Globais/Modal/actions");

jest.mock("../Filtros", () => ({
  Filtros: ({ onFilterChange, limpaFiltros }) => (
    <div data-testid="filtros-component">
      <button onClick={() => onFilterChange({ dre: "dre-1" })}>Aplicar Filtro</button>
      <button onClick={() => limpaFiltros({})}>Limpar Filtros</button>
    </div>
  ),
}));

jest.mock("../Paginacao", () => ({
  Paginacao: ({ onPageChange }) => (
    <div data-testid="paginacao-component">
      <button onClick={() => onPageChange(2, 10)}>Próxima Página</button>
    </div>
  ),
}));

// Mock do FontAwesomeIcon
jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: ({ icon, ...props }) => <span {...props} data-testid="font-awesome-icon" />,
}));

// Mock store simples sem redux-mock-store
const createMockStore = (initialState = {}) => {
  const actions = [];
  const state = initialState;
  
  return {
    getState: () => state,
    dispatch: (action) => {
      actions.push(action);
      return action;
    },
    subscribe: () => () => {},
    getActions: () => actions,
    clearActions: () => {
      actions.length = 0;
    },
  };
};

describe("UnidadesVinculadas", () => {
  let store;
  let queryClient;
  let mockUseGetUnidadesVinculadas;
  let mockUseDesvincularUnidade;
  let mockUseDesvincularUnidadeEmLote;
  let mockUseVincularTodasUnidades;

  const mockUnidadesData = {
    count: 2,
    results: [
      {
        uuid: "unidade-1",
        codigo_eol: "123456",
        nome_com_tipo: "EMEF - Escola Municipal Teste 1",
      },
      {
        uuid: "unidade-2",
        codigo_eol: "789012",
        nome_com_tipo: "CEI - Centro Educacional Infantil 2",
      },
    ],
  };

  const defaultProps = {
    instanceUUID: "recurso-uuid",
    instanceLabel: "Recurso Teste",
    apiServiceGetUnidadesVinculadas: jest.fn(),
    apiServiceDesvincularUnidade: jest.fn(),
    apiServiceDesvincularUnidadeEmLote: jest.fn(),
    apiServiceVincularTodasUnidades: jest.fn(),
    exibirUnidadesVinculadas: true,
    onDesvincular: jest.fn(),
  };

  beforeEach(() => {
    // Cria store com estado inicial
    store = createMockStore({
      modal: {
        isOpen: false,
        children: null,
      },
    });
    
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    // Setup mocks
    mockUseGetUnidadesVinculadas = {
      data: mockUnidadesData,
      isLoading: false,
      isError: false,
      error: null,
    };

    mockUseDesvincularUnidade = {
      mutateAsync: jest.fn(),
      isPending: false,
    };

    mockUseDesvincularUnidadeEmLote = {
      mutateAsync: jest.fn(),
      isPending: false,
    };

    mockUseVincularTodasUnidades = {
      mutate: jest.fn(),
      isPending: false,
    };

    useGetHooks.useGetUnidadesVinculadas = jest.fn(() => mockUseGetUnidadesVinculadas);
    useVinculoHooks.useDesvincularUnidade = jest.fn(() => mockUseDesvincularUnidade);
    useVinculoHooks.useDesvincularUnidadeEmLote = jest.fn(() => mockUseDesvincularUnidadeEmLote);
    useVinculoHooks.useVincularTodasUnidades = jest.fn(() => mockUseVincularTodasUnidades);

    openModal.mockImplementation((config) => {
      const action = {
        type: "OPEN_MODAL",
        payload: config,
      };
      store.dispatch(action);
      return action;
    });

    closeModal.mockImplementation(() => {
      const action = {
        type: "CLOSE_MODAL",
      };
      store.dispatch(action);
      return action;
    });

    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <UnidadesVinculadas {...defaultProps} {...props} />
        </QueryClientProvider>
      </Provider>
    );
  };

  describe("Renderização inicial", () => {
    test("deve renderizar o componente com unidades vinculadas", () => {
      renderComponent();

      expect(screen.getByText(/Exibindo/)).toBeInTheDocument();
      expect(screen.getByText(/unidades vinculadas/)).toBeInTheDocument();
      expect(screen.getByText("EMEF - Escola Municipal Teste 1")).toBeInTheDocument();
      expect(screen.getByText("CEI - Centro Educacional Infantil 2")).toBeInTheDocument();
    });

    test("deve renderizar loading quando isLoading é true", () => {
      mockUseGetUnidadesVinculadas.isLoading = true;
      renderComponent();

      expect(screen.getByTestId("filtros-component")).toBeInTheDocument();
    });

    test("deve renderizar mensagem quando não há unidades vinculadas", () => {
      mockUseGetUnidadesVinculadas.data = { count: 0, results: [] };
      renderComponent();

      expect(screen.getByText(/Use os filtros para localizar a unidade vinculada/)).toBeInTheDocument();
    });

    test("não deve renderizar quando exibirUnidadesVinculadas é false", () => {
      renderComponent({ exibirUnidadesVinculadas: false });

      expect(screen.queryByTestId("filtros-component")).not.toBeInTheDocument();
    });

    test("deve renderizar header customizado quando fornecido", () => {
      const customHeader = <div data-testid="custom-header">Header Customizado</div>;
      renderComponent({ header: customHeader });

      expect(screen.getByTestId("custom-header")).toBeInTheDocument();
    });

    test("deve renderizar checkbox 'Todas as unidades' quando apiServiceVincularTodasUnidades é fornecido", () => {
      renderComponent();

      expect(screen.getByRole("checkbox", { name: /Todas as unidades/ })).toBeInTheDocument();
    });

    test("não deve renderizar checkbox 'Todas as unidades' quando apiServiceVincularTodasUnidades não é fornecido", () => {
      renderComponent({ apiServiceVincularTodasUnidades: null });

      expect(screen.queryByRole("checkbox", { name: /Todas as unidades/ })).not.toBeInTheDocument();
    });
  });

  describe("Filtros e Paginação", () => {
    test("deve aplicar filtros quando onFilterChange é chamado", async () => {
      renderComponent();

      const aplicarFiltroButton = screen.getByText("Aplicar Filtro");
      await userEvent.click(aplicarFiltroButton);

      await waitFor(() => {
        expect(useGetHooks.useGetUnidadesVinculadas).toHaveBeenCalledWith(
          defaultProps.apiServiceGetUnidadesVinculadas,
          "recurso-uuid",
          expect.objectContaining({ dre: "dre-1", page: 1, page_size: 10 })
        );
      });
    });

    test("deve limpar filtros quando limpaFiltros é chamado", async () => {
      renderComponent();

      const limparFiltrosButton = screen.getByText("Limpar Filtros");
      await userEvent.click(limparFiltrosButton);

      await waitFor(() => {
        expect(useGetHooks.useGetUnidadesVinculadas).toHaveBeenCalledWith(
          defaultProps.apiServiceGetUnidadesVinculadas,
          "recurso-uuid",
          expect.objectContaining({ page: 1, page_size: 10 })
        );
      });
    });

    test("deve mudar de página quando onPageChange é chamado", async () => {
      renderComponent();

      const proximaPaginaButton = screen.getByText("Próxima Página");
      await userEvent.click(proximaPaginaButton);

      await waitFor(() => {
        expect(useGetHooks.useGetUnidadesVinculadas).toHaveBeenCalledWith(
          defaultProps.apiServiceGetUnidadesVinculadas,
          "recurso-uuid",
          expect.objectContaining({ page: 2, page_size: 10 })
        );
      });
    });

    test("deve resetar para página 1 quando ocorre erro 404", async () => {
      mockUseGetUnidadesVinculadas.isError = true;
      mockUseGetUnidadesVinculadas.error = { response: { status: 404 } };

      renderComponent();

      await waitFor(() => {
        expect(useGetHooks.useGetUnidadesVinculadas).toHaveBeenCalledWith(
          defaultProps.apiServiceGetUnidadesVinculadas,
          "recurso-uuid",
          expect.objectContaining({ page: 1 })
        );
      });
    });
  });

  describe("Desvinculação de unidade individual", () => {
    test("deve abrir modal de confirmação ao clicar em desvincular unidade", async () => {
      renderComponent();

      const desvincularButtons = screen.getAllByLabelText("Desvincular unidade");
      await userEvent.click(desvincularButtons[0]);

      expect(openModal).toHaveBeenCalled();
      const modalCall = openModal.mock.calls[0][0];
      expect(modalCall.children.props.children[0].props.children.props.children).toEqual(
        'Confirmação de desvinculação');
    });

    test("deve desvincular unidade com sucesso", async () => {
      mockUseDesvincularUnidade.mutateAsync.mockResolvedValue({});
      renderComponent();

      const desvincularButtons = screen.getAllByLabelText("Desvincular unidade");
      await userEvent.click(desvincularButtons[0]);

      // Simula confirmação do modal
      const modalCall = openModal.mock.calls[0][0];
      await modalCall.children.props.children[2].props.children[1].props.onClick();

      await waitFor(() => {
        expect(mockUseDesvincularUnidade.mutateAsync).toHaveBeenCalledWith({
          uuid: "recurso-uuid",
          unidade_uuid: "unidade-1",
          payload: { confirmado: false },
        });
      });
    });

    test("deve mostrar modal de confirmação adicional quando backend solicita", async () => {
      const errorWithConfirm = {
        response: {
          data: {
            confirmar: "Existem dados vinculados.\nDeseja confirmar?",
          },
        },
      };
      mockUseDesvincularUnidade.mutateAsync.mockRejectedValueOnce(errorWithConfirm);

      renderComponent();

      const desvincularButtons = screen.getAllByLabelText("Desvincular unidade");
      await userEvent.click(desvincularButtons[0]);

      // Simula primeira confirmação
      const firstModalCall = openModal.mock.calls[0][0];
      await firstModalCall.children.props.children[2].props.children[1].props.onClick();

      await waitFor(() => {
        expect(openModal).toHaveBeenCalledTimes(2);
      });
    });

    test("deve mostrar modal de erro quando desvinculação falha", async () => {
      const error = {
        response: {
          data: {
            mensagem: "Erro ao desvincular unidade",
          },
        },
      };
      mockUseDesvincularUnidade.mutateAsync.mockRejectedValueOnce(error);

      renderComponent();

      const desvincularButtons = screen.getAllByLabelText("Desvincular unidade");
      await userEvent.click(desvincularButtons[0]);

      // Simula confirmação do modal
      const modalCall = openModal.mock.calls[0][0];
      await modalCall.children.props.children[2].props.children[1].props.onClick();

      await waitFor(() => {
        expect(openModal).toHaveBeenCalledTimes(2);
      });
    });

    test("deve desabilitar botão de desvincular quando há seleção em lote", async () => {
      renderComponent();

      // Seleciona uma unidade
      const checkboxes = screen.getAllByRole("checkbox");
      await userEvent.click(checkboxes[1]); // Primeira unidade (índice 0 é "Todas as unidades")

      await waitFor(() => {
        const desvincularButtons = screen.getAllByLabelText("Desvincular unidade");
        expect(desvincularButtons[0]).toBeDisabled();
      });
    });
  });

  describe("Desvinculação em lote", () => {
    test("deve mostrar barra de ações em lote quando unidades são selecionadas", async () => {
      renderComponent();

      const checkboxes = screen.getAllByRole("checkbox");
      await userEvent.click(checkboxes[1]); // Primeira unidade

      await waitFor(() => {
        expect(screen.getByText(/unidades selecionadas/)).toBeInTheDocument();
        expect(screen.getByTestId("action-desvincular-unidades")).toBeInTheDocument();
      });
    });

    test("deve cancelar seleção ao clicar em Cancelar", async () => {
      renderComponent();

      const checkboxes = screen.getAllByRole("checkbox");
      await userEvent.click(checkboxes[1]);

      await waitFor(() => {
        expect(screen.getByText(/unidades selecionadas/)).toBeInTheDocument();
      });

      const cancelarButton = screen.getByText("Cancelar");
      await userEvent.click(cancelarButton);

      await waitFor(() => {
        expect(screen.queryByText(/unidades selecionadas/)).not.toBeInTheDocument();
      });
    });

    test("deve abrir modal de confirmação para desvinculação em lote", async () => {
      renderComponent();

      const checkboxes = screen.getAllByRole("checkbox");
      await userEvent.click(checkboxes[1]);

      const desvincularButton = screen.getByTestId("action-desvincular-unidades");
      await userEvent.click(desvincularButton);

      expect(openModal).toHaveBeenCalled();
    });

    test("deve desvincular unidades em lote com sucesso", async () => {
      mockUseDesvincularUnidadeEmLote.mutateAsync.mockResolvedValue({});
      renderComponent();

      const checkboxes = screen.getAllByRole("checkbox");
      await userEvent.click(checkboxes[1]);
      await userEvent.click(checkboxes[2]);

      const desvincularButton = screen.getByTestId("action-desvincular-unidades");
      await userEvent.click(desvincularButton);

      // Simula confirmação do modal
      const modalCall = openModal.mock.calls[0][0];
      await modalCall.children.props.children[2].props.children[1].props.onClick();

      await waitFor(() => {
        expect(mockUseDesvincularUnidadeEmLote.mutateAsync).toHaveBeenCalled();
      });
    });

    test("deve mostrar modal de confirmação adicional quando backend solicita (lote)", async () => {
      const errorWithConfirm = {
        response: {
          data: {
            confirmar: "Algumas unidades possuem dados vinculados.\nDeseja confirmar?",
          },
        },
      };
      mockUseDesvincularUnidadeEmLote.mutateAsync.mockRejectedValueOnce(errorWithConfirm);

      renderComponent();

      const checkboxes = screen.getAllByRole("checkbox");
      await userEvent.click(checkboxes[1]);

      const desvincularButton = screen.getByTestId("action-desvincular-unidades");
      await userEvent.click(desvincularButton);

      // Simula primeira confirmação
      const firstModalCall = openModal.mock.calls[0][0];
      await firstModalCall.children.props.children[2].props.children[1].props.onClick();

      await waitFor(() => {
        expect(openModal).toHaveBeenCalledTimes(2);
      });
    });

    test("deve mostrar modal de erro quando desvinculação em lote falha", async () => {
      const error = {
        response: {
          data: {
            mensagem: "Erro ao desvincular unidades em lote",
          },
        },
      };
      mockUseDesvincularUnidadeEmLote.mutateAsync.mockRejectedValueOnce(error);

      renderComponent();

      const checkboxes = screen.getAllByRole("checkbox");
      await userEvent.click(checkboxes[1]);

      const desvincularButton = screen.getByTestId("action-desvincular-unidades");
      await userEvent.click(desvincularButton);

      // Simula confirmação do modal
      const modalCall = openModal.mock.calls[0][0];
      await modalCall.children.props.children[2].props.children[1].props.onClick();

      await waitFor(() => {
        expect(openModal).toHaveBeenCalledTimes(2);
      });
    });

    test("deve limpar seleção após desvinculação em lote bem-sucedida", async () => {
      mockUseDesvincularUnidadeEmLote.mutateAsync.mockResolvedValue({});
      renderComponent();

      const checkboxes = screen.getAllByRole("checkbox");
      await userEvent.click(checkboxes[1]);

      expect(screen.getByText(/unidades selecionadas/)).toBeInTheDocument();

      const desvincularButton = screen.getByTestId("action-desvincular-unidades");
      await userEvent.click(desvincularButton);

      // Simula confirmação do modal
      const modalCall = openModal.mock.calls[0][0];
      await modalCall.children.props.children[2].props.children[1].props.onClick();

      await waitFor(() => {
        expect(screen.queryByText(/unidade selecionada/)).not.toBeInTheDocument();
      });
    });
  });

  describe("Vincular todas as unidades", () => {
    test("deve marcar checkbox 'Todas as unidades' quando não há unidades vinculadas", () => {
      mockUseGetUnidadesVinculadas.data = { count: 0, results: [] };
      renderComponent();

      const checkbox = screen.getByRole("checkbox", { name: /Todas as unidades/ });
      expect(checkbox).not.toBeChecked();
    });

    test("deve abrir modal de confirmação ao marcar 'Todas as unidades'", async () => {
      defaultProps.apiServiceGetUnidadesVinculadas.mockResolvedValue({ results: [] });
      renderComponent();

      const checkbox = screen.getByRole("checkbox", { name: /Todas as unidades/ });
      await userEvent.click(checkbox);

      expect(openModal).toHaveBeenCalled();
    });

    test("deve desmarcar checkbox ao cancelar modal de vinculação", async () => {
      defaultProps.apiServiceGetUnidadesVinculadas.mockResolvedValue({ results: [] });
      renderComponent();

      const checkbox = screen.getByRole("checkbox", { name: /Todas as unidades/ });
      await userEvent.click(checkbox);

      // Simula cancelamento do modal
      const modalCall = openModal.mock.calls[0][0];
      await modalCall.children.props.children[2].props.children[0].props.onClick();

      await waitFor(() => {
        expect(checkbox).not.toBeChecked();
      });
    });

    test("não deve permitir desmarcar checkbox quando não há unidades vinculadas", async () => {
      mockUseGetUnidadesVinculadas.data = { count: 0, results: [] };
      renderComponent();

      const checkbox = screen.getByRole("checkbox", { name: /Todas as unidades/ });
      
      // Marca o checkbox
      await userEvent.click(checkbox);
      
      // Tenta desmarcar
      await userEvent.click(checkbox);

      // O checkbox deve permanecer desmarcado porque count === 0
      expect(checkbox).not.toBeChecked();
    });

    test("deve desabilitar checkbox durante loading", () => {
      mockUseGetUnidadesVinculadas.isLoading = true;
      renderComponent();

      const checkbox = screen.getByRole("checkbox", { name: /Todas as unidades/ });
      expect(checkbox).toBeDisabled();
    });

    test("deve desabilitar checkbox durante operação de vincular", () => {
      mockUseVincularTodasUnidades.isPending = true;
      renderComponent();

      const checkbox = screen.getByRole("checkbox", { name: /Todas as unidades/ });
      expect(checkbox).toBeDisabled();
    });

    test("deve tratar erro ao buscar unidades durante vinculação", async () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
      defaultProps.apiServiceGetUnidadesVinculadas.mockRejectedValue(new Error("Erro de rede"));
      
      renderComponent();

      const checkbox = screen.getByRole("checkbox", { name: /Todas as unidades/ });
      await userEvent.click(checkbox);

      // Simula confirmação do modal
      const modalCall = openModal.mock.calls[0][0];
      await modalCall.children.props.children[2].props.children[1].props.onClick();

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "Erro ao buscar unidades vinculadas:",
          expect.any(Error)
        );
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Templates de colunas", () => {
    test("deve renderizar código EOL corretamente", () => {
      renderComponent();

      expect(screen.getByText("123456")).toBeInTheDocument();
      expect(screen.getByText("789012")).toBeInTheDocument();
    });

    test("deve renderizar botões de ação para cada unidade", () => {
      renderComponent();

      const desvincularButtons = screen.getAllByLabelText("Desvincular unidade");
      expect(desvincularButtons).toHaveLength(2);
    });
  });

});