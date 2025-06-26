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
import { usePatchBemProduzidoItemsRascunho } from "../ClassificarBem/hooks/usePatchBemProduzidoItemsRascunho";
import { usePatchBemProduzidoItems } from "../ClassificarBem/hooks/usePatchBemProduzidoItems";

const mockUseNavigate = jest.fn();
const mockSearchParams = new URLSearchParams("?step=1");
const mockSetSearchParams = jest.fn();
const mockMutatePostAsync = jest.fn();
const mockMutatePatchAsync = jest.fn();
const mockMutationPatchBemProduzidoItemsRascunhoAsync = jest.fn();
const mockMutationPatchBemProduzidoItemsAsync = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useSearchParams: jest.fn()
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
      <button onClick={() => salvarRascunhoInformarValores()}>
        Mock salvar rascunho em informar valores
      </button>
    </div>
  ),
}));

jest.mock("../ClassificarBem", () => ({
  ClassificarBem: ({ salvarRascunhoClassificarBens, cadastrarBens }) => (
    <div data-testid="informar-valores">
      <button onClick={() => salvarRascunhoClassificarBens()}>
        Mock salvar rascunho em classificar bem
      </button>
      <button onClick={() => cadastrarBens()}>Mock cadastrar bem</button>
    </div>
  ),
}));

jest.mock("../hooks/useGetBemProduzido");
jest.mock("../hooks/usePostBemProduzido");
jest.mock("../hooks/usePatchBemProduzido");
jest.mock("../ClassificarBem/hooks/usePatchBemProduzidoItemsRascunho");
jest.mock("../ClassificarBem/hooks/usePatchBemProduzidoItems");

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
    usePatchBemProduzidoItemsRascunho.mockReturnValue({
      mutationPatch: {
        mutateAsync: mockMutationPatchBemProduzidoItemsRascunhoAsync,
        isLoading: false,
      },
    });
    usePatchBemProduzidoItems.mockReturnValue({
      mutationPatch: {
        mutateAsync: mockMutationPatchBemProduzidoItemsAsync,
        isLoading: false,
      },
    });

    useParams.mockReturnValue({ uuid: undefined });
  });

  it("deve renderizar o botão 'Informar valores'", () => {
    renderComponent();

    expect(screen.getByText("Informar valores")).toBeInTheDocument();
  });

  it("deve chamar a função salvarRascunhoInformarValores e navegar para listagem ao clicar em Salvar rascunho", async () => {
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

  it("deve chamar a função salvarDespesas e navegar para edição ao clicar em Informar Valores", async () => {
    renderComponent();

    const buttonInformarValores = screen.getByRole("button", {
      name: /Informar valores/,
    });
    fireEvent.click(buttonInformarValores);

    await waitFor(() => {
      expect(buttonInformarValores).toBeInTheDocument();
      expect(mockMutatePostAsync).toHaveBeenCalled();
      expect(mockUseNavigate).toHaveBeenCalled();
    });
  });

  it("deve chamar mutationPatch e navegar para listagem ao clicar em Salvar rascunho na etapa de informar valores", async () => {
    mockSearchParams.set("step", "2");

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

  it("deve chamar a função informarValores ao clicar no botão 'Classificar o bem'", async () => {
    useParams.mockReturnValue({ uuid: "uuid-bem-produzido-1234" });
    mockSearchParams.set("step", "2");

    useGetBemProduzido.mockReturnValue({ data: mockBemProduzido });

    renderComponent();

    const buttonClassificarBem = screen.getByRole("button", {
      name: /Classificar o bem/,
    });
    fireEvent.click(buttonClassificarBem);

    await waitFor(() => {
      expect(mockMutatePatchAsync).toHaveBeenCalled();
      expect(mockUseNavigate).toHaveBeenCalledWith(
        "/edicao-bem-produzido/uuid-bem-produzido-1234/?step=3"
      );
    });
  });

  it("deve chamar a função salvarRascunhoClassificarBens ao clicar no botão 'Salvar rascunho' no passo 3", async () => {
    useParams.mockReturnValue({ uuid: "uuid-bem-produzido-1234" });
    mockSearchParams.set("step", "3");

    useGetBemProduzido.mockReturnValue({ data: mockBemProduzido });

    renderComponent();

    const buttonSalvarRascunho = screen.getByRole("button", {
      name: /Mock salvar rascunho em classificar bem/,
    });
    fireEvent.click(buttonSalvarRascunho);

    await waitFor(() => {
      expect(
        mockMutationPatchBemProduzidoItemsRascunhoAsync
      ).toHaveBeenCalled();
      expect(mockUseNavigate).toHaveBeenCalledWith(
        "/lista-situacao-patrimonial"
      );
    });
  });

  it("deve chamar a função cadastrarBens ao clicar no botão 'Cadastrar bem' no passo 3", async () => {
    useParams.mockReturnValue({ uuid: "uuid-bem-produzido-1234" });
    mockSearchParams.set("step", "3");

    useGetBemProduzido.mockReturnValue({ data: mockBemProduzido });

    renderComponent();

    const buttonCadastrarBem = screen.getByRole("button", {
      name: /Mock cadastrar bem/,
    });
    fireEvent.click(buttonCadastrarBem);

    await waitFor(() => {
      expect(mockMutationPatchBemProduzidoItemsAsync).toHaveBeenCalled();
      expect(mockUseNavigate).toHaveBeenCalledWith(
        "/lista-situacao-patrimonial"
      );
    });
  });
});
