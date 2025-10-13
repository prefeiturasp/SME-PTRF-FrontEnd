import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { TipoDeDespesaCusteioForm } from "../TipoDeDespesaCusteioForm";
import { postCreateTipoDeCusteio } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

jest.mock("../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
  getTipoCusteio: jest.fn(),
  patchAlterarTipoDeCusteio: jest.fn(),
  postCreateTipoDeCusteio: jest.fn(),
  deleteTipoDeCusteio: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
    ToastCustomError: jest.fn(),
  },
}));

let queryClient;
const navigateMock = jest.fn();
const mockStore = createStore(() => ({}));

describe("TipoDeDespesaCusteioForm", () => {
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

    useParams.mockReturnValue({ uuid: undefined });
    useNavigate.mockReturnValue(navigateMock);

    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
    useLocation.mockReturnValue({
      state: { selecionar_todas: undefined },
    });
  });

  test("renderiza o formulário corretamente", () => {
    render(
      <MemoryRouter>
        <Provider store={mockStore}>
          <QueryClientProvider client={queryClient}>
            <TipoDeDespesaCusteioForm />
          </QueryClientProvider>
        </Provider>
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Nome/i)).toBeInTheDocument();
  });

  test("atribui valores iniciais ao formulário quando for cadastro", async () => {
    render(
      <MemoryRouter>
        <Provider store={mockStore}>
          <QueryClientProvider client={queryClient}>
            <TipoDeDespesaCusteioForm />
          </QueryClientProvider>
        </Provider>
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText("Nome")).toHaveValue("");
  });

  it("handleSubmit cria tipo de despesa com sucesso", async () => {
    postCreateTipoDeCusteio.mockResolvedValue({ uuid: "1234" });

    render(
      <MemoryRouter>
        <Provider store={mockStore}>
          <QueryClientProvider client={queryClient}>
            <TipoDeDespesaCusteioForm />
          </QueryClientProvider>
        </Provider>
      </MemoryRouter>
    );

    const inputNome = screen.getByPlaceholderText("Nome");
    fireEvent.change(inputNome, { target: { value: "Teste" } });

    fireEvent.click(screen.getByText("Salvar"));

    await waitFor(() => {
      expect(postCreateTipoDeCusteio).toHaveBeenCalledWith({
        nome: "Teste",
        selecionar_todas: true,
      });
      expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
        "Sucesso!",
        "Cadastro do tipo de despesa de custeio realizado com sucesso."
      );
      expect(navigateMock).toHaveBeenCalledWith("/parametro-tipos-custeio");
    });
  });

  test("desabilita o formulário quando a permissão de edição não for concedida", () => {
    useParams.mockReturnValue({ uuid: undefined });
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);

    render(
      <MemoryRouter>
        <Provider store={mockStore}>
          <QueryClientProvider client={queryClient}>
            <TipoDeDespesaCusteioForm />
          </QueryClientProvider>
        </Provider>
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Nome/i)).toBeDisabled();
    expect(screen.getByRole("button", { name: /Salvar/i })).toBeDisabled();
  });

  test("rendireciona para página de listagem quando clicar em cancelar", () => {
    useParams.mockReturnValue({ uuid: undefined });
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);

    render(
      <MemoryRouter>
        <Provider store={mockStore}>
          <QueryClientProvider client={queryClient}>
            <TipoDeDespesaCusteioForm />
          </QueryClientProvider>
        </Provider>
      </MemoryRouter>
    );
    const cancelarButton = screen.getByRole("button", { name: "Cancelar" });
    fireEvent.click(cancelarButton);

    expect(navigateMock).toHaveBeenCalledWith("/parametro-tipos-custeio");
  });
});
