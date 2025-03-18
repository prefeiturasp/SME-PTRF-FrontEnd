import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, useParams } from "react-router-dom";
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
jest.mock("react-router-dom-v5-compat", () => ({
  useNavigate: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Keep other parts of react-router-dom intact
  useParams: jest.fn(), // Mock useParams
}));


let queryClient;

beforeEach(() => {
  queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  window.matchMedia = jest.fn().mockImplementation(query => ({
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }));

  useGetFiltrosTiposReceita.mockReturnValue({
    data: {
      tipos_contas: [{ uuid: "1", nome: "Conta 1" }],
      aceita: [{ field_name: "aceita_capital", name: "Capital" }],
      tipos: [{ field_name: "e_rendimento", name: "Rendimento" }],
      detalhes: [{ id: "1", nome: "Detalhe 1" }],
    },
  });

  usePostTipoReceita.mockReturnValue({ mutationPost: { mutate: jest.fn() } });
  usePatchTipoReceita.mockReturnValue({ mutationPatch: { mutate: jest.fn() } });
  useDeleteTipoReceita.mockReturnValue({ mutationDelete: { mutate: jest.fn() } });
  useGetTipoReceita.mockReturnValue({ data: null, isLoading: true})
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
});

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const mockStore = createStore(() => ({}));

describe("TipoReceitaForm", () => {
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

  test("submete o formulário com valores preenchidos corretamente", async () => {
    const mockMutatePost = jest.fn();
    useParams.mockReturnValue({ uuid: undefined }); 
    usePostTipoReceita.mockReturnValue({ mutationPost: { mutate: mockMutatePost } });
  
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            <TipoReceitaForm />
          </QueryClientProvider>
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: "Novo Tipo" } });
    fireEvent.change(screen.getByLabelText(/Categoria/i), { target: { value: "e_rendimento" } });
    fireEvent.change(screen.getByLabelText(/Aceita/i), { target: { value: "aceita_custeio" } });
    fireEvent.submit(screen.getByRole("form"));
  });

  test("desabilita o formulário quando a permissão de edição não for concedida", () => {
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
});