import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { getPaaVigente } from "../../../../../../services/sme/Parametrizacoes.service";
import {
  postDesativarAtualizacaoSaldoPAA,
  postAtivarAtualizacaoSaldoPAA,
} from "../../../../../../services/escolas/Paa.service";
import { useGetTotalizadorRecursoProprio } from "../../DetalhamentoRecursosProprios/hooks/useGetTotalizarRecursoProprio";
import ReceitasPrevistas from "../index";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PaaContext } from "../../PaaContext";

jest.mock("../../../../../../services/visoes.service", () => ({
  visoesService: {
    getPermissoes: () => true,
  },
}));

jest.mock(
  "../../DetalhamentoRecursosProprios/hooks/useGetTotalizarRecursoProprio",
);

jest.mock("../../../../../../services/sme/Parametrizacoes.service");
jest.mock("../../../../../../services/escolas/Paa.service", () => ({
  postDesativarAtualizacaoSaldoPAA: jest.fn(),
  postAtivarAtualizacaoSaldoPAA: jest.fn(),
  getPaaReceitasPrevistas: jest.fn().mockResolvedValue([]),
  getProgramasPddeTotais: jest.fn().mockResolvedValue([]),
}));

const paaMock = {
  uuid: "123",
  associacao: 999,
  status: "EM_ELABORACAO",
  saldo_congelado_em: null,
};

describe("ReceitasPrevistas Component", () => {
  let queryClient;

  beforeEach(() => {
    jest.clearAllMocks();

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({ matches: false })),
    });
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    useGetTotalizadorRecursoProprio.mockReturnValue({
      data: { total: 0 },
      isLoading: false,
    });

    postDesativarAtualizacaoSaldoPAA.mockReturnValue(new Promise(() => {}));
    postAtivarAtualizacaoSaldoPAA.mockReturnValue(new Promise(() => {}));
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <PaaContext.Provider value={{ paa: paaMock, refetch: jest.fn() }}>
        {children}
      </PaaContext.Provider>
    </QueryClientProvider>
  );

  it("deve renderizar corretamente", () => {
    render(<ReceitasPrevistas />, { wrapper });

    const titulo = screen.getByRole("heading", {
      level: 4,
      name: /receitas previstas/i,
    });
    expect(titulo).toBeInTheDocument();
    expect(screen.getAllByText("Receitas Previstas")[0]).toBeInTheDocument();
    expect(screen.getByText("Detalhamento das ações PDDE")).toBeInTheDocument();
    expect(
      screen.getByText("Detalhamento de Recursos Próprios"),
    ).toBeInTheDocument();
  });

  it("onChange checkbox Para atualizacoes do Saldo", async () => {
    localStorage.setItem("PAA", "fake-uuid-paa");
    localStorage.setItem(
      "DADOS_PAA",
      JSON.stringify({ uuid: "fake-uuid-paa", saldo_congelado_em: null }),
    );
    getPaaVigente.mockResolvedValue({ uuid: "fake-uuid-paa" });

    render(<ReceitasPrevistas />, { wrapper });

    const checkbox = screen.getByTestId("checkbox-parar-atualizacoes-saldo");
    await waitFor(() => {
      expect(checkbox).toBeEnabled();
      fireEvent.click(checkbox);
    });
    const botaoConfirmar = screen.getByText("Confirmar");
    const botaoCancelar = screen.getByText("Cancelar");
    expect(botaoConfirmar).toBeEnabled();
    expect(botaoCancelar).toBeEnabled();
  });

  it("Cancelar checkbox Para atualizacoes do Saldo", async () => {
    localStorage.setItem("PAA", "fake-uuid-paa");
    localStorage.setItem(
      "DADOS_PAA",
      JSON.stringify({ uuid: "fake-uuid-paa", saldo_congelado_em: null }),
    );

    render(<ReceitasPrevistas />, { wrapper });

    await waitFor(() => {
      const checkbox = screen.getByTestId("checkbox-parar-atualizacoes-saldo");
      expect(checkbox).toBeEnabled();
      fireEvent.click(checkbox);
    });
    const botaoCancelar = screen.getByTestId(
      "botao-cancelar-confirmar-congelamento",
    );
    expect(botaoCancelar).toBeEnabled();
    fireEvent.click(botaoCancelar);
    await waitFor(() => {
      expect(
        screen.getByText("Parar atualização do saldo"),
      ).toBeInTheDocument();
    });
  });

  it("Submit checkbox Para atualizacoes do Saldo", async () => {
    localStorage.setItem("PAA", "fake-uuid-paa");
    localStorage.setItem(
      "DADOS_PAA",
      JSON.stringify({ uuid: "fake-uuid-paa", saldo_congelado_em: null }),
    );

    render(<ReceitasPrevistas />, { wrapper });

    await waitFor(() => {
      const checkbox = screen.getByTestId("checkbox-parar-atualizacoes-saldo");
      expect(checkbox).toBeEnabled();
      fireEvent.click(checkbox);
    });
    const botaoConfirmar = screen.getByTestId("botao-confirmar-congelamento");
    expect(botaoConfirmar).toBeEnabled();
    fireEvent.click(botaoConfirmar);

    await waitFor(
      () => {
        expect(botaoConfirmar).toBeDisabled();
      },
      { timeout: 5000 },
    );
  });
});
