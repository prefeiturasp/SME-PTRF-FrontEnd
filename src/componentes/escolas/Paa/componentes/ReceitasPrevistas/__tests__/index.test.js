import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getPaaVigente } from "../../../../../../services/sme/Parametrizacoes.service";
import {
  postDesativarAtualizacaoSaldoPAA,
  postAtivarAtualizacaoSaldoPAA,
} from "../../../../../../services/escolas/Paa.service";
import { visoesService } from "../../../../../../services/visoes.service";
import { useGetTotalizadorRecursoProprio } from "../../DetalhamentoRecursosProprios/hooks/useGetTotalizarRecursoProprio";
import ReceitasPrevistas from "../index";
import { PaaContext } from "../../PaaContext";

jest.mock("../../../../../../services/visoes.service", () => ({
  visoesService: {
    getPermissoes: jest.fn(() => true),
    featureFlagAtiva: jest.fn(() => false),
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

jest.mock("../ReceitasPrevistasPTRF", () => {
  const { useState } = require("react");

  return function MockPTRF({ tituloMenu }) {
    const [exibirModal, setExibirModal] = useState(false);
    const [desabilitado, setDesabilitado] = useState(false);

    return (
      <div data-testid="componente-ptrf">
        <h4>{tituloMenu || "Receitas Previstas"}</h4>
        <input
          type="checkbox"
          data-testid="checkbox-parar-atualizacoes-saldo"
          onChange={() => setExibirModal(true)}
        />
        <span>Parar atualização do saldo</span>
        {exibirModal && (
          <div>
            <button
              data-testid="botao-confirmar-congelamento"
              disabled={desabilitado}
              onClick={() => setDesabilitado(true)}
            >
              Confirmar
            </button>
            <button
              data-testid="botao-cancelar-confirmar-congelamento"
              onClick={() => setExibirModal(false)}
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    );
  };
});

jest.mock("../ReceitasPrevistasPDDE", () => {
  return function MockPDDE() {
    return <div data-testid="componente-pdde">Componente PDDE</div>;
  };
});

jest.mock("../ReceitasPrevistasOutrosRecursosLegado", () => {
  return function MockOutrosRecursosLegado() {
    return <div data-testid="componente-outros-recursos-legado">Outros Recursos Legado</div>;
  };
});

jest.mock("../ReceitasPrevistasOutrosRecursos", () => {
  return function MockOutrosRecursos() {
    return <div data-testid="componente-outros-recursos">Componente Outros Recursos</div>;
  };
});

jest.mock("../../DetalhamentoAcoesPdde", () => ({
  DetalhamentoAcoesPdde: function MockDetalhamentoAcoesPdde() {
    return <div data-testid="componente-detalhamento-pdde">Detalhamento PDDE</div>;
  },
}));

jest.mock("../../DetalhamentoRecursosProprios", () => {
  return function MockDetalhamentoRecursosProprios({ tituloMenu }) {
    return (
      <div data-testid="componente-recursos-proprios">
        {tituloMenu || "Recursos Próprios"}
      </div>
    );
  };
});

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
      value: jest.fn().mockImplementation(() => ({ matches: false })),
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

  describe("Com Feature Flag Inativa (modo legado)", () => {
    beforeEach(() => {
      visoesService.featureFlagAtiva.mockReturnValue(false);
    });

    it("deve renderizar corretamente na aba padrão com os componentes legados", () => {
      render(<ReceitasPrevistas />, { wrapper });

      expect(screen.getByRole("button", { name: "Receitas Previstas" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Detalhamento das ações PDDE" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Detalhamento de Recursos Próprios" })).toBeInTheDocument();

      expect(screen.getByTestId("componente-ptrf")).toBeInTheDocument();
      expect(screen.getByTestId("componente-pdde")).toBeInTheDocument();
      expect(screen.getByTestId("componente-outros-recursos-legado")).toBeInTheDocument();
    });

    it("deve alternar entre as abas ao clicar nos botões do menu", async () => {
      const user = userEvent.setup();
      render(<ReceitasPrevistas />, { wrapper });

      const botaoPdde = screen.getByRole("button", { name: "Detalhamento das ações PDDE" });
      await user.click(botaoPdde);

      expect(screen.getByTestId("componente-detalhamento-pdde")).toBeInTheDocument();
      expect(screen.queryByTestId("componente-ptrf")).not.toBeInTheDocument();

      const botaoRecursosProprios = screen.getByRole("button", {
        name: "Detalhamento de Recursos Próprios",
      });
      await user.click(botaoRecursosProprios);

      expect(screen.getByTestId("componente-recursos-proprios")).toBeInTheDocument();
    });
  });

  describe("Com Feature Flag Ativa ('paa-receitas-prevista')", () => {
    beforeEach(() => {
      visoesService.featureFlagAtiva.mockReturnValue(true);
    });

    it("deve renderizar a estrutura de abas nova quando a feature flag estiver ativa", () => {
      render(<ReceitasPrevistas />, { wrapper });

      expect(screen.getByRole("button", { name: "Ações PTRF" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Ações PDDE" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Recursos Próprios" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Outros Recursos" })).toBeInTheDocument();

      expect(screen.getByTestId("componente-ptrf")).toBeInTheDocument();
      expect(screen.queryByTestId("componente-outros-recursos-legado")).not.toBeInTheDocument();
    });

    it("deve abrir diretamente a aba 'Outros Recursos' quando receitasDestino for 'outros-recursos'", () => {
      render(<ReceitasPrevistas receitasDestino="outros-recursos" />, { wrapper });

      expect(screen.getByTestId("componente-outros-recursos")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Outros Recursos" })).toHaveClass("btn-escolhe-acao-active");
    });

    it("deve abrir diretamente a aba 'Ações PDDE' quando receitasDestino for 'pdde'", () => {
      render(<ReceitasPrevistas receitasDestino="pdde" />, { wrapper });

      expect(screen.getByTestId("componente-detalhamento-pdde")).toBeInTheDocument();
    });

    it("deve abrir diretamente a aba 'Recursos Próprios' quando receitasDestino for 'recursos-proprios'", () => {
      render(<ReceitasPrevistas receitasDestino="recursos-proprios" />, { wrapper });

      expect(screen.getByTestId("componente-recursos-proprios")).toBeInTheDocument();
    });

    it("deve alternar para a aba 'Outros Recursos' ao clicar na navegação", async () => {
      const user = userEvent.setup();
      render(<ReceitasPrevistas />, { wrapper });

      const abaOutrosRecursos = screen.getByRole("button", { name: "Outros Recursos" });
      await user.click(abaOutrosRecursos);

      expect(screen.getByTestId("componente-outros-recursos")).toBeInTheDocument();
      expect(screen.queryByTestId("componente-ptrf")).not.toBeInTheDocument();
    });

    it("deve atualizar a aba ativa quando a prop receitasDestino mudar dinamicamente", () => {
      const { rerender } = render(<ReceitasPrevistas receitasDestino="pdde" />, { wrapper });

      expect(screen.getByTestId("componente-detalhamento-pdde")).toBeInTheDocument();

      rerender(<ReceitasPrevistas receitasDestino="outros-recursos" />);

      expect(screen.getByTestId("componente-outros-recursos")).toBeInTheDocument();
    });
  });

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
