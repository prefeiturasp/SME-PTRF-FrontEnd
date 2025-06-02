import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FormularioBemProduzido } from "../index";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGetBemProduzido } from "../hooks/useGetBemProduzido";
import {
  mockBemProduzido,
  mockBemProduzidoDespesas,
} from "../__fixtures__/mockData";
import { useParams } from "react-router-dom";
import { combineReducers, createStore } from "redux";
import { usePostBemProduzido } from "../hooks/usePostBemProduzido";
import { usePatchBemProduzido } from "../hooks/usePatchBemProduzido";

const mockUseNavigate = jest.fn();
const mockMutatePostAsync = jest.fn();
const mockMutatePatchAsync = jest.fn();
const mockInformarValores = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

jest.mock("react-router-dom-v5-compat", () => ({
  ...jest.requireActual("react-router-dom-v5-compat"),
  useNavigate: () => mockUseNavigate,
}));

jest.mock("../../../../Globais/UI", () => ({
  IconButton: ({ label }) => <button>{label}</button>,
}));

jest.mock("../components/Steps", () => ({
  Steps: ({ currentStep }) => (
    <div data-testid="steps">Passo atual: {currentStep}</div>
  ),
}));

jest.mock("../VincularDespesas", () => ({
  VincularDespesas: ({ uuid, setDespesasSelecionadas, salvarRascunho }) => (
    setDespesasSelecionadas(mockBemProduzidoDespesas),
    (
      <div data-testid="vincular-despesas">
        <button onClick={() => salvarRascunho()}>Mock salvar rascunho</button>
      </div>
    )
  ),
}));

jest.mock("../InformarValores", () => ({
  InformarValores: ({ salvarRascunhoInformarValores }) => (
    <div data-testid="informar-valores">
      <button onClick={() => salvarRascunhoInformarValores({ campo: "valor" })}>
        Mock salvar rascunho em informar valores
      </button>
    </div>
  ),
}));

jest.mock("../hooks/useGetBemProduzido");
jest.mock("../hooks/usePostBemProduzido");
jest.mock("../hooks/usePatchBemProduzido");

const rootReducer = combineReducers({});
const mockStore = createStore(rootReducer);

let queryClient;

describe("Componente FormularioBemProduzido", () => {
  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <Provider store={mockStore}>
          <QueryClientProvider client={queryClient}>
            <FormularioBemProduzido />
          </QueryClientProvider>
        </Provider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    useGetBemProduzido.mockReturnValue({ data: null });
    usePostBemProduzido.mockReturnValue({
      mutationPost: { mutateAsync: mockMutatePostAsync, isLoading: false },
    });
    usePatchBemProduzido.mockReturnValue({
      mutationPatch: { mutateAsync: mockMutatePatchAsync, isLoading: false },
    });
    useParams.mockReturnValue({ uuid: undefined });
  });

  it("deve renderizar o botão 'Informar valores'", () => {
    renderComponent();

    expect(screen.getByText("Informar valores")).toBeInTheDocument();
  });

  // it("deve renderizar o componente Steps com o passo atual", () => {
  //   renderComponent();

  //   expect(screen.getByTestId("steps")).toHaveTextContent("Passo atual: 1");
  // });

  // it("deve renderizar o componente VincularDespesas quando o step é 1", () => {
  //   renderComponent();

  //   expect(screen.getByTestId("vincular-despesas")).toHaveTextContent("UUID:");
  // });

  it("deve definir step como 2 quando data tem despesas", () => {
    useParams.mockReturnValue({ uuid: "uuid-bem-produzido-1234" });
    useGetBemProduzido.mockReturnValue({ data: mockBemProduzido });

    renderComponent();

    expect(screen.getByTestId("steps")).toHaveTextContent("Passo atual: 2");
  });

  it("deve voltar para o passo 1 ao clicar em Selecionar despesas", async () => {
    useParams.mockReturnValue({ uuid: "uuid-bem-produzido-1234" });
    useGetBemProduzido.mockReturnValue({ data: mockBemProduzido });

    renderComponent();

    const buttonSelecionarDespesas = screen.getByRole("button", {
      name: /Selecionar despesas/,
    });
    fireEvent.click(buttonSelecionarDespesas);

    await waitFor(() => {
      expect(screen.getByTestId("steps")).toHaveTextContent("Passo atual: 1");
    });
  });

  it("deve chamar mutationPost e navegar para listagem ao clicar em Salvar rascunho", async () => {
    renderComponent();

    const buttonSalvarRascunho = screen.getByRole("button", {
      name: /Mock salvar rascunho/,
    });
    fireEvent.click(buttonSalvarRascunho);

    await waitFor(() => {
      expect(mockMutatePostAsync).toHaveBeenCalled();
      expect(mockUseNavigate).toHaveBeenCalledWith(
        "/lista-situacao-patrimonial"
      );
    });
  });

  it("deve chamar mutationPatch e navegar para listagem ao clicar em Salvar rascunho na etapa de informar valores", async () => {
    useParams.mockReturnValue({ uuid: "uuid-bem-produzido-1234" });
    useGetBemProduzido.mockReturnValue({ data: mockBemProduzido });

    renderComponent();

    const buttonSalvarRascunho = screen.getByRole("button", {
      name: /Mock salvar rascunho em informar valores/,
    });
    fireEvent.click(buttonSalvarRascunho);

    await waitFor(() => {
      expect(mockMutatePatchAsync).toHaveBeenCalled();
      expect(mockUseNavigate).toHaveBeenCalledWith(
        "/lista-situacao-patrimonial"
      );
    });
  });

  it("deve chamar mutationPost e navegar para edição ao clicar em Informar Valores", async () => {
    renderComponent();

    const buttonInformarValores = screen.getByRole("button", {
      name: /Informar valores/,
    });
    fireEvent.click(buttonInformarValores);

    await waitFor(() => {
      expect(mockMutatePostAsync).toHaveBeenCalled();
      expect(mockUseNavigate).toHaveBeenCalled();
    });
  });
});
