import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormularioBemProduzido } from "../index";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGetBemProduzido } from "../hooks/useGetBemProduzido";
import { mockItemDespesa } from "../__fixtures__/mockData";
import { useParams } from "react-router-dom";
import { combineReducers, createStore } from "redux";
import { usePostBemProduzido } from "../hooks/usePostBemProduzido";
import { usePatchBemProduzido } from "../hooks/usePatchBemProduzido";
import { usePatchBemProduzidoRascunho } from "../hooks/usePatchBemProduzidoRascunho";
import { useGetDespesas } from "../VincularDespesas/hooks/useGetDespesas";
import { useGetPeriodos } from "../../../../../hooks/Globais/useGetPeriodo";

const mockUseNavigate = jest.fn();

const mockSearchParams = {
  get: jest.fn(),
};
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useNavigate: () => mockUseNavigate,
  useSearchParams: () => [mockSearchParams],
}));

const mockMutatePostAsync = jest.fn();
const mockMutatePatchAsync = jest.fn();
const mockMutationPatchBemProduzidoItemsRascunhoAsync = jest.fn();

// }));

jest.mock("../VincularDespesas/hooks/useGetDespesas");
jest.mock("../hooks/useGetBemProduzido");
jest.mock("../hooks/usePostBemProduzido");
jest.mock("../hooks/usePatchBemProduzido");
jest.mock("../hooks/usePatchBemProduzidoRascunho");
jest.mock("../../../../../hooks/Globais/useGetPeriodo");
jest.mock("../../../../../hooks/Globais/useCarregaTabelaDespesa", () => ({
  useCarregaTabelaDespesa: () => ({
    contas_associacao: [],
  }),
}));

beforeAll(() => {
  global.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

const rootReducer = combineReducers({ dummy: (state = {}) => state });
const mockStore = createStore(rootReducer);

let queryClient;

describe("Componente FormularioBemProduzido", () => {
  const renderComponent = () => {
    const { container } = render(
      <MemoryRouter>
        <Provider store={mockStore}>
          <QueryClientProvider client={queryClient}>
            <FormularioBemProduzido />
          </QueryClientProvider>
        </Provider>
      </MemoryRouter>
    );
    return container;
  };

  beforeEach(() => {
    mockUseNavigate.mockClear();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    useGetDespesas.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { results: [mockItemDespesa], count: 1 },
      error: null,
      refetch: jest.fn(),
    });

    useGetPeriodos.mockReturnValue({
      isLoading: false,
      isError: false,
      data: [],
      error: null,
      refetch: jest.fn(),
    });

    useGetBemProduzido.mockReturnValue({ data: null });
    usePostBemProduzido.mockReturnValue({
      mutationPost: { mutateAsync: mockMutatePostAsync, isPending: false },
    });
    usePatchBemProduzido.mockReturnValue({
      mutationPatch: { mutateAsync: mockMutatePatchAsync, isPending: false },
    });
    usePatchBemProduzidoRascunho.mockReturnValue({
      mutationPatch: {
        mutateAsync: mockMutationPatchBemProduzidoItemsRascunhoAsync,
        isLoading: false,
      },
    });

    mockSearchParams.get.mockImplementation((key) => {
      if (key === "step") return "1";
      return null;
    });
    useParams.mockReturnValue({ uuid: undefined });

    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));
  });

  it("deve renderizar etapas", () => {
    renderComponent();
    expect(screen.getByText("Selecionar despesas")).toBeInTheDocument();
    expect(screen.getByText("Informar valores utilizados")).toBeInTheDocument();
    expect(screen.getByText("Classificar o bem")).toBeInTheDocument();
  });

  it("deve desabilitar o botão 'Informar valores' se nenhuma despesa for selecionada no cadastro", async () => {
    renderComponent();
    const buttonInformarValores = screen.getByRole("button", {
      name: "Informar valores",
    });
    await waitFor(() => {
      expect(buttonInformarValores).toBeDisabled();
    });
  });

  it("deve habilitar o botão 'Informar valores' ao selecionar uma despesa no cadastro", async () => {
    renderComponent();

    const checkbox = screen.getAllByRole("checkbox", { checked: false });
    await userEvent.click(checkbox[0]);

    const buttonInformarValores = screen.getByRole("button", {
      name: /Informar valores/,
    });

    await waitFor(() => {
      expect(buttonInformarValores).not.toBeDisabled();
    });
  });

  it("deve navegar para Informar valores ao clicar no botão 'Informar valores'", async () => {
    renderComponent();

    const checkbox = screen.getAllByRole("checkbox", { checked: false });
    await userEvent.click(checkbox[0]);

    const buttonInformarValores = screen.getByRole("button", {
      name: /Informar valores/,
    });

    await fireEvent.click(buttonInformarValores);

    await waitFor(() => {
      expect(screen.getByText("Informar valores utilizados na produção do bem")).toBeInTheDocument();
    });
  });

  it("deve navegar para Informar valores ao clicar no botão 'Informar valores'", async () => {
    renderComponent();

    const checkbox = screen.getAllByRole("checkbox", { checked: false });
    await userEvent.click(checkbox[0]);

    const buttonInformarValores = screen.getByRole("button", {
      name: /Informar valores/,
    });

    await fireEvent.click(buttonInformarValores);

    await waitFor(() => {
      expect(screen.getByText("Informar valores utilizados na produção do bem")).toBeInTheDocument();
    });
  });

  it("deve desabilitar o botão 'Classificar o bem' se pelo menos 1 rateio por despesa não foi preenchido", async () => {
    renderComponent();

    const checkbox = screen.getAllByRole("checkbox", { checked: false });
    await userEvent.click(checkbox[0]);

    const buttonInformarValores = screen.getByRole("button", {
      name: /Informar valores/,
    });

    await fireEvent.click(buttonInformarValores);

    const buttonClassificarBem = screen.getByRole("button", {
      name: /Classificar o bem/,
    });

    await waitFor(() => {
      expect(buttonClassificarBem).toBeDisabled();
    });
  });
});
