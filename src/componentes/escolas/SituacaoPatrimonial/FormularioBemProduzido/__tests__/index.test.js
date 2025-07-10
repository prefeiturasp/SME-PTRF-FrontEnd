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
// import { usePatchBemProduzidoItemsRascunho } from "../ClassificarBem/hooks/usePatchBemProduzidoItemsRascunho";
// import { usePatchBemProduzidoItems } from "../ClassificarBem/hooks/usePatchBemProduzidoItems";

const mockUseNavigate = jest.fn();

const mockSearchParams = {
  get: jest.fn(),
};
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: () => mockUseNavigate,
  useSearchParams: () => [mockSearchParams],
}));

const mockSetSearchParams = jest.fn();
const mockMutatePostAsync = jest.fn();
const mockMutatePatchAsync = jest.fn();
const mockMutationPatchBemProduzidoItemsRascunhoAsync = jest.fn();
const mockMutationPatchBemProduzidoItemsAsync = jest.fn();

jest.mock("../../../../Globais/UI", () => ({
  IconButton: ({ label }) => <button>{label}</button>,
}));

jest.mock("../components/Steps", () => ({
  Steps: ({ currentStep }) => (
    <div data-testid="steps">Passo atual: {currentStep}</div>
  ),
}));

jest.mock("../VincularDespesas", () => ({
  VincularDespesas: ({ setDespesasSelecionadas, salvarRascunho }) => (
    <div data-testid="vincular-despesas">
      <button onClick={() => setDespesasSelecionadas([{ uuid: "despesa-1" }])}>Set Despesas</button>
      <button onClick={() => salvarRascunho()}>Mock salvar rascunho</button>
    </div>
  ),
}));

jest.mock("../InformarValores", () => ({
  InformarValores: ({ setRateiosComValores, salvarRascunhoInformarValores }) => (
    <div data-testid="informar-valores">
      <button onClick={() => setRateiosComValores && setRateiosComValores([{ valor: 100 }])}>Set Rateios</button>
      <button onClick={() => salvarRascunhoInformarValores()}>Mock salvar rascunho em informar valores</button>
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
// jest.mock("../ClassificarBem/hooks/usePatchBemProduzidoItemsRascunho");
// jest.mock("../ClassificarBem/hooks/usePatchBemProduzidoItems");

const rootReducer = combineReducers({ dummy: (state = {}) => state });
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
    mockUseNavigate.mockClear();
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
    mockSearchParams.get.mockImplementation((key) => {
      if (key === 'step') return '1';
      return null;
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
    mockMutatePostAsync.mockResolvedValue({ uuid: 'new-uuid' });
    useParams.mockReturnValue({ uuid: 'uuid-bem-produzido-1234' });
    renderComponent();
    const setDespesasButton = screen.getByRole("button", { name: /Set Despesas/ });
    fireEvent.click(setDespesasButton);
    const buttonInformarValores = screen.getByRole("button", {
      name: /Informar valores/,
    });
    await waitFor(() => expect(buttonInformarValores).not.toBeDisabled());
    await new Promise(r => setTimeout(r, 0));
    fireEvent.click(buttonInformarValores);
    await waitFor(() => {
      expect(buttonInformarValores).toBeInTheDocument();
      expect(mockMutatePostAsync).toHaveBeenCalled();
      expect(mockUseNavigate).toHaveBeenCalled();
    });
  });

  it("deve chamar mutationPatch e navegar para listagem ao clicar em Salvar rascunho na etapa de informar valores", async () => {
    mockSearchParams.get.mockImplementation((key) => {
      if (key === 'step') return '2';
      return null;
    });
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
    mockSearchParams.get.mockImplementation((key) => {
      if (key === 'step') return '2';
      return null;
    });
    mockMutatePatchAsync.mockResolvedValue({ uuid: 'uuid-bem-produzido-1234' });
    useParams.mockReturnValue({ uuid: "uuid-bem-produzido-1234" });
    useGetBemProduzido.mockReturnValue({ data: { ...mockBemProduzido, status: 'INCOMPLETO' } });
    renderComponent();
    const setRateiosButton = screen.getByRole("button", { name: /Set Rateios/ });
    fireEvent.click(setRateiosButton);
    const buttonClassificarBem = screen.getByRole("button", {
      name: /Classificar o bem/,
    });
    await waitFor(() => expect(buttonClassificarBem).not.toBeDisabled());
    await new Promise(r => setTimeout(r, 0));
    fireEvent.click(buttonClassificarBem);
    await waitFor(() => {
      expect(mockMutatePatchAsync).toHaveBeenCalled();
      expect(mockUseNavigate).toHaveBeenCalledWith(
        "/edicao-bem-produzido/uuid-bem-produzido-1234/?step=3"
      );
    });
  });

  it("deve chamar a função salvarRascunhoClassificarBens ao clicar no botão 'Salvar rascunho' no passo 3", async () => {
    mockSearchParams.get.mockImplementation((key) => {
      if (key === 'step') return '3';
      return null;
    });
    useParams.mockReturnValue({ uuid: "uuid-bem-produzido-1234" });
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
    mockSearchParams.get.mockImplementation((key) => {
      if (key === 'step') return '3';
      return null;
    });
    useParams.mockReturnValue({ uuid: "uuid-bem-produzido-1234" });
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
