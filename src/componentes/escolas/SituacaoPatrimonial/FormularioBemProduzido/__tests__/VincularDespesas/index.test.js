import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { VincularDespesas } from "../../VincularDespesas";


const mockUseNavigate = jest.fn();
const mockSalvarRascunho = jest.fn();
const mockSetDespesasSelecionadas = jest.fn();

const mockUseParams = jest.fn().mockReturnValue({});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useSearchParams: jest.fn(),
  useParams: () => mockUseParams(),
}));

jest.mock("../../hooks/usePostBemProduzido", () => ({
  usePostBemProduzido: () => ({
    mutationPost: { mutate: jest.fn() },
  }),
}));

jest.mock("../../VincularDespesas/hooks/useGetDespesas", () => ({
  useGetDespesas: () => ({
    data: {
      count: 1,
      results: [
        {
          uuid: "1",
          periodo_referencia: "2023-01",
          numero_documento: "ABC123",
          data_documento: "2023-01-01",
          tipo_documento: { nome: "Nota Fiscal" },
          valor_total: 1000,
          rateios: [],
        },
      ],
    },
    refetch: jest.fn(),
    isLoading: false,
    error: null,
    isError: false,
  }),
}));

jest.mock("../../../../../../hooks/Globais/useCarregaTabelaDespesa", () => ({
  useCarregaTabelaDespesa: () => ({
    contas_associacao: [],
  }),
}));

jest.mock("../../../../../../hooks/Globais/useGetPeriodo", () => ({
  useGetPeriodos: () => ({
    data: [],
  }),
}));

jest.mock("../../VincularDespesas/FormFiltrosDespesas", () => ({
  FormFiltrosDespesas: ({ onFiltrar }) => (
    <button onClick={onFiltrar}>Filtrar</button>
  ),
}));

jest.mock("../../Modais/DeletarBemProduzidoModal", () => ({
  DeletarBemProduzidoModal: ({ showModal }) => (
    showModal ? <div data-testid="modal-deletar">Modal Aberto</div> : null
  ),
}));

jest.mock("../../hooks/useGetStatusDelecaoBemProduzido", () => ({
  useGetStatusDelecaoBemProduzido: () => ({
    error: null,
    isLoading: false,
    isError: false,
  }),
}));

const renderComponent = (props = {}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  const defaultProps = {
    despesasSelecionadas: [],
    setDespesasSelecionadas: mockSetDespesasSelecionadas,
    salvarRascunho: mockSalvarRascunho,
  };

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <VincularDespesas {...defaultProps} {...props} />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe("VincularDespesas", () => {
  beforeEach(() => {
    // Set up the useNavigate mock before each test
    const { useNavigate } = require('react-router-dom');
    useNavigate.mockImplementation(() => mockUseNavigate);

    mockUseParams.mockReturnValue({});

    jest.clearAllMocks();
  });

  it("deve renderizar a tabela de despesas", async () => {
    renderComponent();

    expect(
      screen.getByText("Pesquise as despesas relacionadas à produção do bem")
    ).toBeInTheDocument();
    expect(await screen.findByText("ABC123")).toBeInTheDocument();
    expect(screen.getByText("Filtrar")).toBeInTheDocument();
    expect(screen.getByText("Salvar rascunho")).toBeDisabled();
  });

  it("Deve voltar para a página de listagem ao clicar no botão cancelar", () => {
    renderComponent();

    const buttonCancelar = screen.getByRole("button", { name: "Cancelar" });
    fireEvent.click(buttonCancelar);

    expect(mockUseNavigate).toHaveBeenCalledWith("/lista-situacao-patrimonial");
  });
  
  it("Não deve renderizar o botão de excluir quando não houver uuid", () => {
    mockUseParams.mockReturnValue({ uuid: undefined });

    renderComponent();

    const buttonExcluir = screen.queryByRole("button", { name: /Excluir bem/i });
    expect(buttonExcluir).not.toBeInTheDocument();
  });

  it("Deve renderizar e abrir o modal de exclusão ao clicar no botão de excluir bem", async () => {
    mockUseParams.mockReturnValue({ uuid: "123-uuid" });

    renderComponent();

    const buttonExcluir = screen.getByRole("button", { name: /Excluir bem/i });
    expect(buttonExcluir).toBeInTheDocument();

    fireEvent.click(buttonExcluir);

    await waitFor(() => {
      expect(screen.getByTestId("modal-deletar")).toBeInTheDocument();
    });
  });
});