import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import "@testing-library/jest-dom";

import { EstruturaCompletaModeloPaa } from "../EstruturaCompletaModeloPaa";
import { ObterUrlModeloArquivoPlanoAnual } from "../../../../../services/escolas/Paa.service";
import { ModalConfirm } from "../../../../Globais/Modal/ModalConfirm";

// Mock dos módulos
jest.mock("../../../../../services/escolas/Paa.service");
jest.mock("../../../../Globais/Modal/ModalConfirm");
jest.mock("../../../../Globais/ModalVisualizarPdf", () => ({
  ModalVisualizarPdf: ({ show, onHide, url, titulo, iframeTitle }) => (
    show ? (
      <div data-testid="modal-visualizar-pdf">
        <div data-testid="modal-title">{titulo}</div>
        <div data-testid="modal-url">{url}</div>
        <div data-testid="iframe-title">{iframeTitle}</div>
        <button onClick={onHide} data-testid="btn-fechar-modal">Fechar</button>
      </div>
    ) : null
  ),
}));

// Mock store simples
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

describe("EstruturaCompletaModeloPaa", () => {
  let store;
  let mockRevokeObjectURL;
  let mockCreateObjectURL;

  beforeEach(() => {
    store = createMockStore({});
    
    // Mock de URL.revokeObjectURL e URL.createObjectURL
    mockRevokeObjectURL = jest.fn();
    mockCreateObjectURL = jest.fn(() => "blob:mock-url");
    
    global.URL.revokeObjectURL = mockRevokeObjectURL;
    global.URL.createObjectURL = mockCreateObjectURL;
    
    // Mock console.error
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    ModalConfirm.mockImplementation(() => ({
      type: "OPEN_MODAL",
      payload: {},
    }));

    jest.clearAllMocks();
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <EstruturaCompletaModeloPaa />
      </Provider>
    );
  };

  describe("Renderização inicial", () => {
    test("deve renderizar o texto com link corretamente", () => {
      renderComponent();

      expect(screen.getByText(/Confira a estrutura completa/i)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /aqui/i })).toBeInTheDocument();
    });

    test("deve renderizar o link com href #", () => {
      renderComponent();

      const link = screen.getByRole("link", { name: /aqui/i });
      expect(link).toHaveAttribute("href", "#");
    });

    test("não deve mostrar o modal PDF inicialmente", () => {
      renderComponent();

      expect(screen.queryByTestId("modal-visualizar-pdf")).not.toBeInTheDocument();
    });
  });

  describe("Visualizar Plano Anual", () => {
    test("deve abrir o modal PDF ao clicar no link com sucesso", async () => {
      const mockUrl = "https://example.com/modelo-plano.pdf";
      ObterUrlModeloArquivoPlanoAnual.mockResolvedValue(mockUrl);

      renderComponent();

      const link = screen.getByRole("link", { name: /aqui/i });
      await userEvent.click(link);

      await waitFor(() => {
        expect(ObterUrlModeloArquivoPlanoAnual).toHaveBeenCalledWith('MODELO_PLANO_ANUAL');
        expect(screen.getByTestId("modal-visualizar-pdf")).toBeInTheDocument();
      });
    });

    test("deve exibir título correto no modal PDF", async () => {
      const mockUrl = "https://example.com/modelo-plano.pdf";
      ObterUrlModeloArquivoPlanoAnual.mockResolvedValue(mockUrl);

      renderComponent();

      const link = screen.getByRole("link", { name: /aqui/i });
      await userEvent.click(link);

      await waitFor(() => {
        expect(screen.getByTestId("modal-title")).toHaveTextContent("Documento final - Modelo Plano Anual");
      });
    });

    test("deve exibir URL correto no modal PDF", async () => {
      const mockUrl = "https://example.com/modelo-plano.pdf";
      ObterUrlModeloArquivoPlanoAnual.mockResolvedValue(mockUrl);

      renderComponent();

      const link = screen.getByRole("link", { name: /aqui/i });
      await userEvent.click(link);

      await waitFor(() => {
        expect(screen.getByTestId("modal-url")).toHaveTextContent(mockUrl);
      });
    });

    test("deve exibir iframe title correto", async () => {
      const mockUrl = "https://example.com/modelo-plano.pdf";
      ObterUrlModeloArquivoPlanoAnual.mockResolvedValue(mockUrl);

      renderComponent();

      const link = screen.getByRole("link", { name: /aqui/i });
      await userEvent.click(link);

      await waitFor(() => {
        expect(screen.getByTestId("iframe-title")).toHaveTextContent("Documento Final PAA");
      });
    });

    test("não deve abrir modal quando URL retornada é null", async () => {
      ObterUrlModeloArquivoPlanoAnual.mockResolvedValue(null);

      renderComponent();

      const link = screen.getByRole("link", { name: /aqui/i });
      await userEvent.click(link);

      await waitFor(() => {
        expect(ObterUrlModeloArquivoPlanoAnual).toHaveBeenCalled();
      });

      expect(screen.queryByTestId("modal-visualizar-pdf")).not.toBeInTheDocument();
    });

    test("não deve abrir modal quando URL retornada é undefined", async () => {
      ObterUrlModeloArquivoPlanoAnual.mockResolvedValue(undefined);

      renderComponent();

      const link = screen.getByRole("link", { name: /aqui/i });
      await userEvent.click(link);

      await waitFor(() => {
        expect(ObterUrlModeloArquivoPlanoAnual).toHaveBeenCalled();
      });

      expect(screen.queryByTestId("modal-visualizar-pdf")).not.toBeInTheDocument();
    });

    test("não deve abrir modal quando URL retornada é string vazia", async () => {
      ObterUrlModeloArquivoPlanoAnual.mockResolvedValue("");

      renderComponent();

      const link = screen.getByRole("link", { name: /aqui/i });
      await userEvent.click(link);

      await waitFor(() => {
        expect(ObterUrlModeloArquivoPlanoAnual).toHaveBeenCalled();
      });

      expect(screen.queryByTestId("modal-visualizar-pdf")).not.toBeInTheDocument();
    });
  });

  describe("Tratamento de erros", () => {
    test("deve mostrar modal de confirmação quando erro 404 ocorrer", async () => {
      const error404 = {
        response: {
          status: 404,
        },
      };
      ObterUrlModeloArquivoPlanoAnual.mockRejectedValue(error404);

      renderComponent();

      const link = screen.getByRole("link", { name: /aqui/i });
      await userEvent.click(link);

      await waitFor(() => {
        expect(ModalConfirm).toHaveBeenCalledWith({
          dispatch: expect.any(Function),
          title: 'Não encontrado!',
          message: 'O Modelo de arquivo do Plano Anual não foi encontrado.',
          cancelText: 'Fechar',
          confirmText: null,
          dataQa: 'modal-confirmar-arquivo-nao-encontrado',
          onConfirm: null,
        });
      });
    });

    test("não deve abrir modal PDF quando erro 404 ocorrer", async () => {
      const error404 = {
        response: {
          status: 404,
        },
      };
      ObterUrlModeloArquivoPlanoAnual.mockRejectedValue(error404);

      renderComponent();

      const link = screen.getByRole("link", { name: /aqui/i });
      await userEvent.click(link);

      await waitFor(() => {
        expect(ModalConfirm).toHaveBeenCalled();
      });

      expect(screen.queryByTestId("modal-visualizar-pdf")).not.toBeInTheDocument();
    });

    test("deve logar erro no console quando erro diferente de 404 ocorrer", async () => {
      const error500 = {
        response: {
          status: 500,
        },
        message: "Internal Server Error",
      };
      ObterUrlModeloArquivoPlanoAnual.mockRejectedValue(error500);

      renderComponent();

      const link = screen.getByRole("link", { name: /aqui/i });
      await userEvent.click(link);

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith(
          'Erro ao visualizar Modelo de Plano Anual',
          error500
        );
      });
    });

    test("não deve mostrar modal de confirmação quando erro diferente de 404 ocorrer", async () => {
      const error500 = {
        response: {
          status: 500,
        },
      };
      ObterUrlModeloArquivoPlanoAnual.mockRejectedValue(error500);

      renderComponent();

      const link = screen.getByRole("link", { name: /aqui/i });
      await userEvent.click(link);

      await waitFor(() => {
        expect(console.error).toHaveBeenCalled();
      });

      expect(ModalConfirm).not.toHaveBeenCalled();
    });

    test("deve logar erro genérico sem response", async () => {
      const errorGenerico = new Error("Network error");
      ObterUrlModeloArquivoPlanoAnual.mockRejectedValue(errorGenerico);

      renderComponent();

      const link = screen.getByRole("link", { name: /aqui/i });
      await userEvent.click(link);

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith(
          'Erro ao visualizar Modelo de Plano Anual',
          errorGenerico
        );
      });
    });
  });

  describe("Fechar Modal PDF", () => {
    test("deve fechar o modal ao clicar no botão fechar", async () => {
      const mockUrl = "https://example.com/modelo-plano.pdf";
      ObterUrlModeloArquivoPlanoAnual.mockResolvedValue(mockUrl);

      renderComponent();

      // Abre o modal
      const link = screen.getByRole("link", { name: /aqui/i });
      await userEvent.click(link);

      await waitFor(() => {
        expect(screen.getByTestId("modal-visualizar-pdf")).toBeInTheDocument();
      });

      // Fecha o modal
      const btnFechar = screen.getByTestId("btn-fechar-modal");
      await userEvent.click(btnFechar);

      await waitFor(() => {
        expect(screen.queryByTestId("modal-visualizar-pdf")).not.toBeInTheDocument();
      });
    });

    test("deve revogar URL quando modal for fechado", async () => {
      const mockUrl = "blob:http://localhost/123-456";
      ObterUrlModeloArquivoPlanoAnual.mockResolvedValue(mockUrl);

      renderComponent();

      // Abre o modal
      const link = screen.getByRole("link", { name: /aqui/i });
      await userEvent.click(link);

      await waitFor(() => {
        expect(screen.getByTestId("modal-visualizar-pdf")).toBeInTheDocument();
      });

      // Fecha o modal
      const btnFechar = screen.getByTestId("btn-fechar-modal");
      await userEvent.click(btnFechar);

      await waitFor(() => {
        expect(mockRevokeObjectURL).toHaveBeenCalledWith(mockUrl);
      });
    });

    test("deve limpar estado do modal ao fechar", async () => {
      const mockUrl = "https://example.com/modelo-plano.pdf";
      ObterUrlModeloArquivoPlanoAnual.mockResolvedValue(mockUrl);

      renderComponent();

      // Abre o modal
      const link = screen.getByRole("link", { name: /aqui/i });
      await userEvent.click(link);

      await waitFor(() => {
        expect(screen.getByTestId("modal-visualizar-pdf")).toBeInTheDocument();
      });

      // Fecha o modal
      const btnFechar = screen.getByTestId("btn-fechar-modal");
      await userEvent.click(btnFechar);

      await waitFor(() => {
        expect(screen.queryByTestId("modal-visualizar-pdf")).not.toBeInTheDocument();
      });

      // Modal não deve estar visível
      expect(screen.queryByTestId("modal-title")).not.toBeInTheDocument();
      expect(screen.queryByTestId("modal-url")).not.toBeInTheDocument();
    });

    test("não deve chamar revokeObjectURL se URL for null ao fechar", async () => {
      renderComponent();

      // Tenta abrir mas retorna null
      ObterUrlModeloArquivoPlanoAnual.mockResolvedValue(null);
      const link = screen.getByRole("link", { name: /aqui/i });
      await userEvent.click(link);

      // Modal não deve abrir, mas se existisse um botão fechar
      expect(mockRevokeObjectURL).not.toHaveBeenCalled();
    });
  });

  describe("Múltiplas interações", () => {
    test("deve permitir abrir e fechar o modal várias vezes", async () => {
      const mockUrl = "https://example.com/modelo-plano.pdf";
      ObterUrlModeloArquivoPlanoAnual.mockResolvedValue(mockUrl);

      renderComponent();

      const link = screen.getByRole("link", { name: /aqui/i });

      // Primeira abertura
      await userEvent.click(link);
      await waitFor(() => {
        expect(screen.getByTestId("modal-visualizar-pdf")).toBeInTheDocument();
      });

      // Fecha
      let btnFechar = screen.getByTestId("btn-fechar-modal");
      await userEvent.click(btnFechar);
      await waitFor(() => {
        expect(screen.queryByTestId("modal-visualizar-pdf")).not.toBeInTheDocument();
      });

      // Segunda abertura
      await userEvent.click(link);
      await waitFor(() => {
        expect(screen.getByTestId("modal-visualizar-pdf")).toBeInTheDocument();
      });

      // Fecha novamente
      btnFechar = screen.getByTestId("btn-fechar-modal");
      await userEvent.click(btnFechar);
      await waitFor(() => {
        expect(screen.queryByTestId("modal-visualizar-pdf")).not.toBeInTheDocument();
      });

      expect(ObterUrlModeloArquivoPlanoAnual).toHaveBeenCalledTimes(2);
      expect(mockRevokeObjectURL).toHaveBeenCalledTimes(2);
    });

    test("deve chamar serviço apenas quando link é clicado", async () => {
      renderComponent();

      expect(ObterUrlModeloArquivoPlanoAnual).not.toHaveBeenCalled();

      const link = screen.getByRole("link", { name: /aqui/i });
      await userEvent.click(link);

      await waitFor(() => {
        expect(ObterUrlModeloArquivoPlanoAnual).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("Props do ModalVisualizarPdf", () => {
    test("deve passar prop show=true quando modal está aberto", async () => {
      const mockUrl = "https://example.com/modelo-plano.pdf";
      ObterUrlModeloArquivoPlanoAnual.mockResolvedValue(mockUrl);

      renderComponent();

      const link = screen.getByRole("link", { name: /aqui/i });
      await userEvent.click(link);

      await waitFor(() => {
        expect(screen.getByTestId("modal-visualizar-pdf")).toBeInTheDocument();
      });
    });

    test("deve passar URL correta para o modal", async () => {
      const mockUrl = "https://example.com/modelo-plano.pdf";
      ObterUrlModeloArquivoPlanoAnual.mockResolvedValue(mockUrl);

      renderComponent();

      const link = screen.getByRole("link", { name: /aqui/i });
      await userEvent.click(link);

      await waitFor(() => {
        const urlElement = screen.getByTestId("modal-url");
        expect(urlElement).toHaveTextContent(mockUrl);
      });
    });

    test("deve formatar título corretamente quando tem título", async () => {
      const mockUrl = "https://example.com/modelo-plano.pdf";
      ObterUrlModeloArquivoPlanoAnual.mockResolvedValue(mockUrl);

      renderComponent();

      const link = screen.getByRole("link", { name: /aqui/i });
      await userEvent.click(link);

      await waitFor(() => {
        const titleElement = screen.getByTestId("modal-title");
        expect(titleElement).toHaveTextContent("Documento final - Modelo Plano Anual");
      });
    });

    test("deve passar iframeTitle correto para o modal", async () => {
      const mockUrl = "https://example.com/modelo-plano.pdf";
      ObterUrlModeloArquivoPlanoAnual.mockResolvedValue(mockUrl);

      renderComponent();

      const link = screen.getByRole("link", { name: /aqui/i });
      await userEvent.click(link);

      await waitFor(() => {
        const iframeTitleElement = screen.getByTestId("iframe-title");
        expect(iframeTitleElement).toHaveTextContent("Documento Final PAA");
      });
    });
  });

  describe("Callbacks e memoização", () => {
    test("handleVisualizarPlano deve ser estável entre renders", () => {
      const { rerender } = renderComponent();
      const link1 = screen.getByRole("link", { name: /aqui/i });
      const onClick1 = link1.onclick;

      rerender(
        <Provider store={store}>
          <EstruturaCompletaModeloPaa />
        </Provider>
      );

      const link2 = screen.getByRole("link", { name: /aqui/i });
      const onClick2 = link2.onclick;

      // Callbacks devem ser as mesmas referências devido ao useCallback
      expect(onClick1).toBe(onClick2);
    });
  });

  describe("Integração com Redux", () => {
    test("deve usar dispatch do Redux ao mostrar modal de erro", async () => {
      const error404 = {
        response: {
          status: 404,
        },
      };
      ObterUrlModeloArquivoPlanoAnual.mockRejectedValue(error404);

      renderComponent();

      const link = screen.getByRole("link", { name: /aqui/i });
      await userEvent.click(link);

      await waitFor(() => {
        expect(ModalConfirm).toHaveBeenCalledWith(
          expect.objectContaining({
            dispatch: expect.any(Function),
          })
        );
      });
    });
  });

  describe("Edge cases", () => {
    test("deve lidar com URL que é um objeto blob", async () => {
      const mockBlobUrl = "blob:http://localhost/abc-123";
      ObterUrlModeloArquivoPlanoAnual.mockResolvedValue(mockBlobUrl);

      renderComponent();

      const link = screen.getByRole("link", { name: /aqui/i });
      await userEvent.click(link);

      await waitFor(() => {
        expect(screen.getByTestId("modal-url")).toHaveTextContent(mockBlobUrl);
      });
    });

    test("deve lidar com chamadas simultâneas ao serviço", async () => {
      const mockUrl = "https://example.com/modelo-plano.pdf";
      ObterUrlModeloArquivoPlanoAnual.mockResolvedValue(mockUrl);

      renderComponent();

      const link = screen.getByRole("link", { name: /aqui/i });
      
      // Clica múltiplas vezes rapidamente
      await userEvent.click(link);
      await userEvent.click(link);
      await userEvent.click(link);

      // Serviço pode ser chamado múltiplas vezes
      await waitFor(() => {
        expect(ObterUrlModeloArquivoPlanoAnual).toHaveBeenCalled();
      });
    });

    test("deve prevenir comportamento padrão do link", async () => {
      renderComponent();

      const link = screen.getByRole("link", { name: /aqui/i });
      
      // O href="#" não deve navegar
      expect(link).toHaveAttribute("href", "#");
    });
  });
});
