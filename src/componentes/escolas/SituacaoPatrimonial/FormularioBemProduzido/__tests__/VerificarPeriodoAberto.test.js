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
import * as BensProduzidosService from "../../../../../services/escolas/BensProduzidos.service";

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
  
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

const rootReducer = combineReducers({ dummy: (state = {}) => state });
const mockStore = createStore(rootReducer);

let queryClient;

describe("FormularioBemProduzido - Verificar Período Aberto", () => {
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
      mutationPost: { mutateAsync: mockMutatePostAsync, isLoading: false },
    });
    usePatchBemProduzido.mockReturnValue({
      mutationPatch: { mutateAsync: mockMutatePatchAsync, isLoading: false },
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

  it("deve chamar o endpoint de verificação ao clicar em 'Informar valores' com período aberto", async () => {
    const mockPostVerificar = jest.spyOn(
      BensProduzidosService,
      "postVerificarSePodeInformarValores"
    );
    mockPostVerificar.mockResolvedValue({
      pode_informar_valores: true,
      mensagem: "Há pelo menos uma despesa de período não finalizado.",
    });

    renderComponent();

    const checkbox = screen.getAllByRole("checkbox", { checked: false });
    await userEvent.click(checkbox[0]);

    const buttonInformarValores = screen.getByRole("button", {
      name: /Informar valores/,
    });

    await fireEvent.click(buttonInformarValores);

    await waitFor(() => {
      expect(mockPostVerificar).toHaveBeenCalledTimes(1);
      expect(mockPostVerificar).toHaveBeenCalledWith({
        uuids: [mockItemDespesa.uuid],
      });
    });

    await waitFor(() => {
      expect(
        screen.getByText("Informar valores utilizados na produção do bem")
      ).toBeInTheDocument();
    });

    mockPostVerificar.mockRestore();
  });

  it("deve mostrar modal de período fechado quando pode_informar_valores é false", async () => {
    const mockPostVerificar = jest.spyOn(
      BensProduzidosService,
      "postVerificarSePodeInformarValores"
    );
    mockPostVerificar.mockResolvedValue({
      pode_informar_valores: false,
      mensagem:
        "Todas as despesas são de períodos finalizados com prestação de contas entregue.",
    });

    renderComponent();

    const checkbox = screen.getAllByRole("checkbox", { checked: false });
    await userEvent.click(checkbox[0]);

    const buttonInformarValores = screen.getByRole("button", {
      name: /Informar valores/,
    });

    await fireEvent.click(buttonInformarValores);

    await waitFor(() => {
      expect(mockPostVerificar).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(screen.getByText("Período Fechado")).toBeInTheDocument();
      expect(
        screen.getByText(/Para inclusão do bem produzido é necessário reabrir/)
      ).toBeInTheDocument();
    });

    // Não deve avançar para a próxima etapa
    expect(
      screen.queryByText("Informar valores utilizados na produção do bem")
    ).not.toBeInTheDocument();

    mockPostVerificar.mockRestore();
  });

  it("deve exibir o botão Fechar no modal de período fechado", async () => {
    const mockPostVerificar = jest.spyOn(
      BensProduzidosService,
      "postVerificarSePodeInformarValores"
    );
    mockPostVerificar.mockResolvedValue({
      pode_informar_valores: false,
      mensagem:
        "Todas as despesas são de períodos finalizados com prestação de contas entregue.",
    });

    renderComponent();

    const checkbox = screen.getAllByRole("checkbox", { checked: false });
    await userEvent.click(checkbox[0]);

    const buttonInformarValores = screen.getByRole("button", {
      name: /Informar valores/,
    });

    await fireEvent.click(buttonInformarValores);

    await waitFor(() => {
      expect(screen.getByText("Período Fechado")).toBeInTheDocument();
    });

    const botaoFechar = screen.getByTestId(
      "botao-fechar-modal-periodo-fechado"
    );
    expect(botaoFechar).toBeInTheDocument();
    expect(botaoFechar).toHaveTextContent("Fechar");

    mockPostVerificar.mockRestore();
  });

  it("deve mostrar toast de erro quando a verificação falha", async () => {
    const mockPostVerificar = jest.spyOn(
      BensProduzidosService,
      "postVerificarSePodeInformarValores"
    );
    const mockConsoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockPostVerificar.mockRejectedValue(
      new Error("Erro ao verificar períodos")
    );

    renderComponent();

    const checkbox = screen.getAllByRole("checkbox", { checked: false });
    await userEvent.click(checkbox[0]);

    const buttonInformarValores = screen.getByRole("button", {
      name: /Informar valores/,
    });

    await fireEvent.click(buttonInformarValores);

    await waitFor(() => {
      expect(mockPostVerificar).toHaveBeenCalledTimes(1);
      expect(mockConsoleError).toHaveBeenCalled();
    });

    // Não deve avançar para a próxima etapa
    expect(
      screen.queryByText("Informar valores utilizados na produção do bem")
    ).not.toBeInTheDocument();

    mockPostVerificar.mockRestore();
    mockConsoleError.mockRestore();
  });

  it("deve enviar os UUIDs das despesas selecionadas", async () => {
    const mockPostVerificar = jest.spyOn(
      BensProduzidosService,
      "postVerificarSePodeInformarValores"
    );
    mockPostVerificar.mockResolvedValue({
      pode_informar_valores: true,
      mensagem: "Há pelo menos uma despesa de período não finalizado.",
    });

    renderComponent();

    const checkbox = screen.getAllByRole("checkbox", { checked: false });
    await userEvent.click(checkbox[0]);

    const buttonInformarValores = screen.getByRole("button", {
      name: /Informar valores/,
    });

    await fireEvent.click(buttonInformarValores);

    await waitFor(() => {
      expect(mockPostVerificar).toHaveBeenCalledTimes(1);
      expect(mockPostVerificar).toHaveBeenCalledWith({
        uuids: [mockItemDespesa.uuid],
      });
    });

    mockPostVerificar.mockRestore();
  });
});
