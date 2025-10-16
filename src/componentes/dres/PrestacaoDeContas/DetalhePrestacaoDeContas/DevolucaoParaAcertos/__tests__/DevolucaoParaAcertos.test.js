import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import DevolucaoParaAcertos from "../index";
import * as service from "../../../../../../services/dres/PrestacaoDeContas.service";
import { visoesService } from "../../../../../../services/visoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

jest.mock("../../../../../../services/dres/PrestacaoDeContas.service", () => ({
  getConcluirAnalise: jest.fn(),
  getLancamentosAjustes: jest.fn(),
  getDocumentosAjustes: jest.fn(),
  getUltimaAnalisePc: jest.fn(),
  getAnaliseAjustesSaldoPorConta: jest.fn(),
  getDespesasPeriodosAnterioresAjustes: jest.fn(),
  getPrestacaoDeContasDetalhe: jest.fn(),
}));

jest.mock("../../../../../../services/visoes.service", () => ({
  visoesService: {
    featureFlagAtiva: jest.fn(),
  },
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
    ToastCustomError: jest.fn(),
  },
}));

jest.mock("react-tooltip", () => ({
  Tooltip: () => <div data-testid="tooltip" />,
}));

jest.mock("../../../../../../utils/Loading", () => {
  return function Loading() {
    return <div data-testid="loading">Loading...</div>;
  };
});

jest.mock("../../../../../Globais/DatePickerField", () => ({
  DatePickerField: ({ name, value, onChange }) => (
    <input
      data-testid="data_limite_devolucao"
      name={name}
      value={value ?? ""}
      onChange={(event) => onChange(name, event.target.value)}
    />
  ),
}));

const mockPrestacaoDeContas = {
  uuid: "test-uuid",
  pode_devolver: true,
  analise_atual: {
    uuid: "analise-uuid",
    acertos_podem_alterar_saldo_conciliacao: false,
    tem_pendencia_conciliacao_sem_solicitacao_de_acerto_em_conta: false,
    contas_pendencia_conciliacao_sem_solicitacao_de_acerto_em_conta: [],
  },
};

const mockInfoAta = {
  contas: [
    {
      conta_associacao: {
        uuid: "conta-uuid-1",
        nome: "Conta Corrente",
      },
    },
    {
      conta_associacao: {
        uuid: "conta-uuid-2",
        nome: "Poupança",
      },
    },
  ],
};

const mockAnalisesDeContaDaPrestacao = [
  {
    uuid: "analise-conta-uuid",
    conta_associacao: "conta-uuid-1",
    data_extrato: "2023-12-31",
    saldo_extrato: "1000.00",
    solicitar_envio_do_comprovante_do_saldo_da_conta: false,
  },
];

const defaultProps = {
  prestacaoDeContas: mockPrestacaoDeContas,
  analisesDeContaDaPrestacao: mockAnalisesDeContaDaPrestacao,
  carregaPrestacaoDeContas: jest.fn(),
  infoAta: mockInfoAta,
  editavel: true,
  setLoadingAcompanhamentoPC: jest.fn(),
  setAnalisesDeContaDaPrestacao: jest.fn(),
};

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

const acionarDevolucaoParaAssociacao = async (analiseOverrides) => {
  service.getPrestacaoDeContasDetalhe.mockResolvedValueOnce({
    ...mockPrestacaoDeContas,
    analise_atual: {
      ...mockPrestacaoDeContas.analise_atual,
      ...analiseOverrides,
    },
  });

  const utils = renderWithRouter(<DevolucaoParaAcertos {...defaultProps} />);

  await waitFor(() =>
    expect(screen.queryByTestId("loading")).not.toBeInTheDocument()
  );

  const input = await screen.findByTestId("data_limite_devolucao");
  fireEvent.change(input, { target: { value: "2024-02-15" } });

  const button = screen.getByRole("button", {
    name: /devolver para associação/i,
  });

  await waitFor(() => expect(button).toBeEnabled());
  fireEvent.click(button);

  return utils;
};

describe("DevolucaoParaAcertos", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    visoesService.featureFlagAtiva.mockReturnValue(false);
    service.getLancamentosAjustes.mockResolvedValue([]);
    service.getDocumentosAjustes.mockResolvedValue([]);
    service.getDespesasPeriodosAnterioresAjustes.mockResolvedValue([]);
    service.getPrestacaoDeContasDetalhe.mockResolvedValue(mockPrestacaoDeContas);
  });

  it("deve renderizar o componente com título correto", async () => {
    renderWithRouter(<DevolucaoParaAcertos {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("Devolução para acertos")).toBeInTheDocument();
    });
  });

  it("deve renderizar o campo de data limite", async () => {
    renderWithRouter(<DevolucaoParaAcertos {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("Prazo para reenvio:")).toBeInTheDocument();
    });
  });

  it("deve renderizar o botão de devolução desabilitado", async () => {
    renderWithRouter(<DevolucaoParaAcertos {...defaultProps} />);

    await waitFor(() => {
      const button = screen.getByRole("button", { name: /devolver para associação/i });
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
    });
  });

  it("deve mostrar loading durante carregamento inicial", () => {
    renderWithRouter(<DevolucaoParaAcertos {...defaultProps} />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("deve ter o serviço getPrestacaoDeContasDetalhe mockado corretamente", () => {
    expect(service.getPrestacaoDeContasDetalhe).toBeDefined();
    expect(jest.isMockFunction(service.getPrestacaoDeContasDetalhe)).toBe(true);
  });

  it("deve renderizar o link 'Ver resumo' com href correto", async () => {
    renderWithRouter(<DevolucaoParaAcertos {...defaultProps} />);

    await waitFor(() => {
      const link = screen.getByRole("link", { name: /ver resumo/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/dre-detalhe-prestacao-de-contas-resumo-acertos/test-uuid");
    });
  });

  it("deve renderizar o campo de input para data limite", async () => {
    renderWithRouter(<DevolucaoParaAcertos {...defaultProps} />);

    await waitFor(() => {
      const input = screen.getByDisplayValue("");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("name", "data_limite_devolucao");
    });
  });

  it("deve verificar se os componentes de modal estão importados corretamente", () => {
    // Teste simples para verificar se os componentes de modal existem
    expect(require("../ModalConciliacaoBancaria")).toBeDefined();
    expect(require("../ModalComprovanteSaldoConta")).toBeDefined();
  });

  it("deve renderizar o componente sem modais abertos inicialmente", async () => {
    renderWithRouter(<DevolucaoParaAcertos {...defaultProps} />);

    await waitFor(() => {
      // Verifica se os modais não estão sendo exibidos inicialmente
      expect(screen.queryByText("Acertos que podem alterar a conciliação bancária")).not.toBeInTheDocument();
      expect(screen.queryByText("Comprovante de saldo da conta")).not.toBeInTheDocument();
    });
  });

  it("deve renderizar todas as seções do componente", async () => {
    renderWithRouter(<DevolucaoParaAcertos {...defaultProps} />);

    await waitFor(() =>
      expect(screen.queryByTestId("loading")).not.toBeInTheDocument()
    );

    // Verifica se todas as seções principais estão presentes
    expect(screen.getByText("Devolução para acertos")).toBeInTheDocument();
    expect(
      screen.getByText(/Caso deseje enviar todos esses apontamentos a Associação/)
    ).toBeInTheDocument();
    expect(screen.getByText("Prazo para reenvio:")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /ver resumo/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /devolver para associação/i })
    ).toBeInTheDocument();
  });

  it("exibe o modal de conciliação apenas quando não há pendência de conciliação", async () => {
    const primeiroRender = await acionarDevolucaoParaAssociacao({
      acertos_podem_alterar_saldo_conciliacao: true,
      tem_pendencia_conciliacao_sem_solicitacao_de_acerto_em_conta: false,
      contas_pendencia_conciliacao_sem_solicitacao_de_acerto_em_conta: [],
    });

    expect(
      await screen.findByText("Acertos que podem alterar a conciliação bancária")
    ).toBeInTheDocument();
    primeiroRender.unmount();

    const segundoRender = await acionarDevolucaoParaAssociacao({
      acertos_podem_alterar_saldo_conciliacao: true,
      tem_pendencia_conciliacao_sem_solicitacao_de_acerto_em_conta: true,
      contas_pendencia_conciliacao_sem_solicitacao_de_acerto_em_conta: [
        "conta-uuid-1",
      ],
    });

    expect(
      await screen.findByText("Comprovante de saldo da conta")
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Acertos que podem alterar a conciliação bancária")
    ).not.toBeInTheDocument();
    segundoRender.unmount();
  });
});
