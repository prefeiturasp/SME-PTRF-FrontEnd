import React from "react";
import { render, screen, configure } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReordenarAcoes } from "../../components/ReordenarAcoes";

// Configura 'data-qa' como o atributo padrão do Testing Library
configure({ testIdAttribute: "data-qa" });

// Mock do PaginasContainer usando 'data-qa'
jest.mock("../../../../../../../paginas/PaginasContainer", () => ({
  PaginasContainer: ({ children }) => (
    <div data-qa="paginas-container">{children}</div>
  ),
}));

// Mock dos subcomponentes de tela
jest.mock("../../components/ReordenarAcoes/components/TopoComBotoes", () => ({
  TopoComBotoes: () => <div data-qa="topo-com-botoes">TopoComBotoes</div>,
}));

jest.mock("../../components/ReordenarAcoes/components/TabelaOrdenarAcoes", () => ({
  TabelaOrdenarAcoes: () => (
    <div data-qa="tabela-ordenar-acoes">TabelaOrdenarAcoes</div>
  ),
}));

jest.mock("../../components/ReordenarAcoes/components/ModalAlteracoesNaoSalvas", () => ({
  ModalAlteracoesNaoSalvas: () => (
    <div data-qa="modal-alteracoes-nao-salvas">
      ModalAlteracoesNaoSalvas
    </div>
  ),
}));

jest.mock("../../components/ReordenarAcoes/components/ModalSalvarOrdenacao", () => ({
  ModalSalvarOrdenacao: () => (
    <div data-qa="modal-salvar-ordenacao">ModalSalvarOrdenacao</div>
  ),
}));

// Mock dos hooks externos consumidos pelo ReordenarAcoesContextProvider real
jest.mock("../../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext", () => ({
  useAbasPorRecursoContext: () => ({
    selectedRecurso: { uuid: "rec-contexto-padrao" },
  }),
}));

jest.mock("../../components/ReordenarAcoes/hooks/useGetAcoesOrdenadas", () => ({
  useGetAcoesOrdenadas: () => ({
    isLoading: false,
    data: [{ uuid: "acao-1", nome: "Ação 1" }],
  }),
}));

jest.mock("../../components/ReordenarAcoes/hooks/usePostReordenarAcoes", () => ({
  usePostReordenarAcoes: () => ({
    mutationPost: { mutate: jest.fn() },
  }),
}));

jest.mock("../../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes: () => true,
}));

describe("Componente <ReordenarAcoes />", () => {
  let queryClient;

  const renderWithProviders = (initialEntries = ["/"]) => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path="*" element={<ReordenarAcoes />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("deve renderizar a estrutura básica (PaginasContainer e título h1)", () => {
    renderWithProviders(["/?recurso_uuid=rec-123-uuid"]);

    expect(screen.getByTestId("paginas-container")).toBeInTheDocument();

    const titulo = screen.getByRole("heading", { level: 1, name: "Ações" });
    expect(titulo).toBeInTheDocument();
    expect(titulo).toHaveClass("titulo-itens-painel", "mt-5");
  });

  test("deve renderizar todos os subcomponentes internos na árvore DOM", () => {
    renderWithProviders(["/?recurso_uuid=rec-123-uuid"]);

    expect(screen.getByTestId("topo-com-botoes")).toBeInTheDocument();
    expect(screen.getByTestId("tabela-ordenar-acoes")).toBeInTheDocument();
    expect(
      screen.getByTestId("modal-alteracoes-nao-salvas")
    ).toBeInTheDocument();
    expect(screen.getByTestId("modal-salvar-ordenacao")).toBeInTheDocument();
  });
});