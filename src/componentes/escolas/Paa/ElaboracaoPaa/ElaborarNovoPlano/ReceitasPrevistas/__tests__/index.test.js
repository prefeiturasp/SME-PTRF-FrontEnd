import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { getPaaVigente } from "../../../../../../../services/sme/Parametrizacoes.service";
import { useGetAcoesAssociacao } from "../hooks/useGetAcoesAssociacao";
import { useGetTotalizadorRecursoProprio } from "../../DetalhamentoRecursosProprios/hooks/useGetTotalizarRecursoProprio";
import ReceitasPrevistas from "../index";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("../hooks/useGetAcoesAssociacao");
jest.mock(
  "../../DetalhamentoRecursosProprios/hooks/useGetTotalizarRecursoProprio"
);

jest.mock("../../../../../../../services/sme/Parametrizacoes.service");

describe("ReceitasPrevistas Component", () => {
  let queryClient;

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({ matches: false })),
    })
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    useGetTotalizadorRecursoProprio.mockReturnValue({
      data: { total: 0 },
      isLoading: false,
    });
  });

  it("deve renderizar corretamente", () => {
    useGetAcoesAssociacao.mockReturnValue({
      data: [],
      isLoading: false,
    });

    render(<ReceitasPrevistas />, { wrapper });

    const titulo = screen.getByRole("heading", {
      level: 4,
      name: /receitas previstas/i,
    });
    expect(titulo).toBeInTheDocument();
    expect(screen.getAllByText("Receitas Previstas")[0]).toBeInTheDocument();
    expect(screen.getByText("Detalhamento das ações PDDE")).toBeInTheDocument();
    expect(
      screen.getByText("Detalhamento de Recursos Próprios")
    ).toBeInTheDocument();
  });

  it("onChange checkbox Para atualizacoes do Saldo", async ()=>{
    localStorage.setItem("PAA", "fake-uuid-paa")
    localStorage.setItem("DADOS_PAA", JSON.stringify({uuid: "fake-uuid-paa", saldo_congelado_em: null }))
    getPaaVigente.mockReturnValue({data: {uuid: "fake-uuid-paa"}})
    useGetAcoesAssociacao.mockReturnValue({
      data: [],
      isLoading: false,
    });
    render(<ReceitasPrevistas />, { wrapper });

    await waitFor(()=> {
      const checkbox = screen.getByTestId("checkbox-parar-atualizacoes-saldo")
      expect(checkbox).toBeEnabled();
      fireEvent.click(checkbox)
    })
    const botaoConfirmar = screen.getByText("Confirmar");
    const botaoCancelar = screen.getByText("Cancelar");
    expect(botaoConfirmar).toBeEnabled();
    expect(botaoCancelar).toBeEnabled();

  })

  it("Cancelar checkbox Para atualizacoes do Saldo", async ()=>{
    localStorage.setItem("PAA", "fake-uuid-paa")
    localStorage.setItem("DADOS_PAA", JSON.stringify({uuid: "fake-uuid-paa", saldo_congelado_em: null }))
    useGetAcoesAssociacao.mockReturnValue({
      data: [],
      isLoading: false,
    });
    render(<ReceitasPrevistas />, { wrapper });

    await waitFor(()=> {
      const checkbox = screen.getByTestId("checkbox-parar-atualizacoes-saldo")
      expect(checkbox).toBeEnabled();
      fireEvent.click(checkbox)
    })
    const botaoCancelar = screen.getByTestId("botao-cancelar-confirmar-congelamento");
    expect(botaoCancelar).toBeEnabled();
    fireEvent.click(botaoCancelar)
    await waitFor(()=> {
      expect(screen.getByText("Parar atualização do saldo")).toBeInTheDocument();
    })
  })

  it("Submit checkbox Para atualizacoes do Saldo", async ()=>{
    localStorage.setItem("PAA", "fake-uuid-paa")
    localStorage.setItem("DADOS_PAA", JSON.stringify({uuid: "fake-uuid-paa", saldo_congelado_em: null }))
    useGetAcoesAssociacao.mockReturnValue({
      data: [],
      isLoading: false,
    });
    render(<ReceitasPrevistas />, { wrapper });

    await waitFor(()=> {
      const checkbox = screen.getByTestId("checkbox-parar-atualizacoes-saldo")
      expect(checkbox).toBeEnabled();
      fireEvent.click(checkbox)
    })
    const botaoConfirmar = screen.getByTestId("botao-confirmar-congelamento");
    expect(botaoConfirmar).toBeEnabled();
    fireEvent.click(botaoConfirmar)

    await waitFor(()=> {
      expect(botaoConfirmar).toBeDisabled();
    }, { timeout: 5000 })
  })
});
