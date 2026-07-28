import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import { ClassificarBem } from "../../ClassificarBem";

const mockUseNavigate = jest.fn();
const mockCadastrarBem = jest.fn();

const mockUseParams = jest.fn().mockReturnValue({});

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockUseNavigate,
  useSearchParams: jest.fn(),
  useParams: () => mockUseParams(),
}));

jest.mock("../../../../../../services/escolas/Despesas.service", () => ({
  getEspecificacoesCapital: jest.fn(() =>
    Promise.resolve([
      { uuid: "1", descricao: "Bem 1" },
      { uuid: "2", descricao: "Bem 2" },
    ])
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
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const defaultProps = {
    items: [
      {
        num_processo_incorporacao: "",
        especificacao_do_bem: "",
        quantidade: "",
        valor_individual: "",
      },
    ],
    salvar: jest.fn(),
    cadastrarBens: jest.fn(),
    salvarRascunhoClassificarBens: jest.fn(),
    setBemProduzidoItems: jest.fn(),
    setHabilitaCadastrarBem: jest.fn(),
    habilitaCadastrarBem: false,
    total: 1000,
  };

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ClassificarBem {...defaultProps} {...props} />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe("ClassificarBem", () => {
  beforeEach(() => {
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

    jest.clearAllMocks();
    mockUseParams.mockReturnValue({});
  });

  it("Deve chamar cadastrarBens ao clicar em Salvar", async () => {
    const { container } = renderComponent({
      items: [
        {
          num_processo_incorporacao: "1111111111111111",
          especificacao_do_bem: "uuid-fake",
          quantidade: 1,
          valor_individual: 1000,
        },
      ],
      salvar: mockCadastrarBem,
      habilitaCadastrarBem: true,
    });

    const form = container.querySelector("form");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockCadastrarBem).toHaveBeenCalled();
    });
  });

  it("Não deve chamar salvar se valores inválidos", async () => {
    const mockSalvar = jest.fn();

    renderComponent({
      salvar: mockSalvar,
    });

    const buttonSalvar = screen.getByRole("button", {
      name: /Salvar/i,
    });

    fireEvent.click(buttonSalvar);

    await waitFor(() => {
      expect(mockSalvar).not.toHaveBeenCalled();
    });
  });

  it("Deve adicionar formulário na tela quando clicar em adicionar item", () => {
    renderComponent();


    const buttonAdicionarItem = screen.getByRole("button", {
      name: "plus Adicionar item",
    });
    fireEvent.click(buttonAdicionarItem);

    expect(screen.queryByText(/Item 2/i)).toBeInTheDocument();
  });

  it("Deve remover formulário da tela quando clicar em remover item", () => {
    renderComponent();

    expect(screen.getByText("Item 1")).toBeInTheDocument();

    const buttonRemoverItem = screen.getByRole("button", {
      name: "close-circle Remover item",
    });
    fireEvent.click(buttonRemoverItem);

    expect(screen.queryByText(/Item 1/i)).not.toBeInTheDocument();
  });

  it("Deve mostrar erro de validação quando quantidade e/ou valor utilizado igual a zero", async () => {
    renderComponent();

    const inputQnt = screen.getByRole("spinbutton", {
      name: /Quantidade/i,
    });
    await userEvent.type(inputQnt, "0");

    await waitFor(() => {
      expect(screen.getByText("O valor deve ser maior que 0")).toBeInTheDocument();
    });

    const inputValor = screen.getByRole("spinbutton", {
      name: /Valor Individual/i,
    });

    await userEvent.type(inputValor, "0");

    await waitFor(() => {
      expect(screen.getByText("O valor deve ser maior que 0")).toBeInTheDocument();
    });
  });

  it("Deve formatar o número de processo de incorporação ao digitar", async () => {
    renderComponent();

    const input = screen.getByRole("spinbutton", {
      name: /Número do processo de incorporação/i,
    });

    await userEvent.type(input, "1111111111111111");

    await waitFor(() => {
      expect(input).toHaveValue("1111.1111/1111111-1");
    });
  });

  it("Deve mostrar o valor total dos bens produzidos", async () => {
    renderComponent();

    expect(screen.getByText("R$ 1.000,00")).toBeInTheDocument();
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
