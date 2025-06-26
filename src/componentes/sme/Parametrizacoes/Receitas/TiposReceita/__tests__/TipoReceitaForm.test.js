import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { TipoReceitaForm } from "../TipoReceitaForm";
import { useGetFiltrosTiposReceita } from "../hooks/useGetFiltrosTiposReceita";
import { usePostTipoReceita } from "../hooks/usePostTipoReceita";
import { usePatchTipoReceita } from "../hooks/usePatchTipoReceita";
import { useDeleteTipoReceita } from "../hooks/useDeleteTipoReceita";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { useGetTipoReceita } from "../hooks/useGetTipoReceita";

jest.mock("../hooks/useGetTipoReceita");
jest.mock("../hooks/useGetFiltrosTiposReceita");
jest.mock("../hooks/usePostTipoReceita");
jest.mock("../hooks/usePatchTipoReceita");
jest.mock("../hooks/useDeleteTipoReceita");
jest.mock("../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
  useParams: jest.fn(),
}));

let queryClient;
const mockMutateAsyncPost = jest.fn();
const mockMutatePatch = jest.fn();
const mockNavigate = jest.fn();

const mockStore = createStore(() => ({}));

describe("TipoReceitaForm", () => {
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

    useGetFiltrosTiposReceita.mockReturnValue({
      data: {
        tipos_contas: [{ uuid: "1234", id: 5, nome: "Conta 1" }],
        aceita: [{ field_name: "aceita_capital", name: "Capital" }],
        tipos: [{ field_name: "e_rendimento", name: "Rendimento" }],
        detalhes: [{ id: "1", nome: "Detalhe 1" }],
      },
    });
    useParams.mockReturnValue({ uuid: undefined });
    useNavigate.mockReturnValue(mockNavigate);
    usePostTipoReceita.mockReturnValue({
      mutationPost: { mutateAsync: mockMutateAsyncPost },
    });
    usePatchTipoReceita.mockReturnValue({
      mutationPatch: { mutate: mockMutatePatch },
    });
    useDeleteTipoReceita.mockReturnValue({
      mutationDelete: { mutate: jest.fn() },
    });
    useGetTipoReceita.mockReturnValue({ data: null, isLoading: true });
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
    useLocation.mockReturnValue({
      state: { selecionar_todas: undefined },
    });
  });

  test("renderiza o formulário corretamente", () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            <TipoReceitaForm />
          </QueryClientProvider>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByLabelText(/Nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tipos de conta/i)).toBeInTheDocument();
  });

  test("atribui valores iniciais ao formulário quando for cadastro", async () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            <TipoReceitaForm />
          </QueryClientProvider>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByPlaceholderText("Nome do tipo de crédito")).toHaveValue(
      ""
    );
  });

  test("atribui valores da api no formulário quando for edição", () => {
    const data = {
      id: 1,
      uuid: "1234",
      nome: "todas",
      aceita_capital: true,
      aceita_custeio: false,
      aceita_livre: false,
      e_rendimento: true,
      e_repasse: false,
      e_devolucao: false,
      e_recursos_proprios: true,
      e_estorno: false,
      mensagem_usuario: "",
      possui_detalhamento: true,
      detalhes: [],
      tipos_conta: [
        {
          uuid: "1234",
          id: 5,
          nome: "Conta 1",
          banco_nome: "Conta 1",
          agencia: "11111",
          numero_conta: "111111",
          numero_cartao: "11111",
          apenas_leitura: false,
          permite_inativacao: true,
        },
      ],
      unidades: [],
      todas_unidades_selecionadas: true,
    };
    useGetTipoReceita.mockReturnValue({ data: data });
    useParams.mockReturnValue({ uuid: "1234" });

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            <TipoReceitaForm />
          </QueryClientProvider>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByPlaceholderText("Nome do tipo de crédito")).toHaveValue(
      "todas"
    );
    expect(screen.getByLabelText("Todas as unidades")).toBeChecked();
  });

  test("quando desmarcar `Todas as unidades` no fluxo de cadastro, validar campos", async () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            <TipoReceitaForm />
          </QueryClientProvider>
        </MemoryRouter>
      </Provider>
    );

    const checkbox = screen.getByLabelText("Todas as unidades");
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();

    await waitFor(() => {
      expect(checkbox).toBeChecked();
    });
  });

  test("submete o formulário de cadastro com valores preenchidos corretamente", async () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            <TipoReceitaForm />
          </QueryClientProvider>
        </MemoryRouter>
      </Provider>
    );

    const nome = screen.getByPlaceholderText("Nome do tipo de crédito");
    const selects = await screen.findAllByRole("combobox");

    fireEvent.change(nome, {
      target: { value: "Novo Tipo" },
    });

    selects[0].style.pointerEvents = "auto";
    userEvent.click(selects[0]);
    const optionTipo = await screen.findByText("Rendimento");
    userEvent.click(optionTipo);

    selects[1].style.pointerEvents = "auto";
    userEvent.click(selects[1]);
    const optionAceita = await screen.findByText("Capital");
    userEvent.click(optionAceita);

    selects[2].style.pointerEvents = "auto";
    userEvent.click(selects[2]);
    const optionContas = await screen.findByText("Conta 1");
    userEvent.click(optionContas);

    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(mockMutateAsyncPost).toHaveBeenCalled();
    });
  });

  test("submete o formulário de edição com valores preenchidos corretamente", async () => {
    const data = {
      id: 1,
      uuid: "1234",
      nome: "todas",
      aceita_capital: true,
      aceita_custeio: false,
      aceita_livre: false,
      e_rendimento: true,
      e_repasse: false,
      e_devolucao: false,
      e_recursos_proprios: true,
      e_estorno: false,
      mensagem_usuario: "",
      possui_detalhamento: false,
      detalhes: [],
      tipos_conta: [
        {
          uuid: "1234",
          id: 5,
          nome: "Conta 1",
          banco_nome: "Conta 1",
          agencia: "11111",
          numero_conta: "111111",
          numero_cartao: "11111",
          apenas_leitura: false,
          permite_inativacao: true,
        },
      ],
      unidades: [],
      todas_unidades_selecionadas: true,
    };
    useGetTipoReceita.mockReturnValue({ data: data });
    useParams.mockReturnValue({ uuid: "1234" });

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            <TipoReceitaForm />
          </QueryClientProvider>
        </MemoryRouter>
      </Provider>
    );

    const nome = screen.getByPlaceholderText("Nome do tipo de crédito");

    fireEvent.change(nome, {
      target: { value: "Novo Tipo" },
    });

    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(mockMutatePatch).toHaveBeenCalled();
    });
  });

  test("desabilita o formulário quando a permissão de edição não for concedida", () => {
    useParams.mockReturnValue({ uuid: undefined });
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            <TipoReceitaForm />
          </QueryClientProvider>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByLabelText(/Nome/i)).toBeDisabled();
    expect(screen.getByRole("button", { name: /Salvar/i })).toBeDisabled();
  });

  test("rendireciona para página de listagem quando clicar em cancelar", () => {
    useParams.mockReturnValue({ uuid: undefined });
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            <TipoReceitaForm />
          </QueryClientProvider>
        </MemoryRouter>
      </Provider>
    );
    const cancelarButton = screen.getByRole("button", { name: "Cancelar" });
    fireEvent.click(cancelarButton);

    expect(mockNavigate).toHaveBeenCalledWith("/parametro-tipos-receita");
  });
});
