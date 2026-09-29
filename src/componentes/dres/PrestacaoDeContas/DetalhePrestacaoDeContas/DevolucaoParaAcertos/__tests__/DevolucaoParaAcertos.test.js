import { render, screen, fireEvent, waitFor, within, act } from "@testing-library/react";
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
    tem_solicitacoes_lancar_credito_ou_despesa_com_pendencia_conciliacao: false,
    solicitacoes_lancar_credito_ou_despesa_com_pendencia_conciliacao: false,
    contas_solicitacoes_lancar_credito_ou_despesa_com_pendencia_conciliacao: [],
    solicitar_correcao_de_justificativa_de_conciliacao: false,
    contas_solicitar_correcao_de_justificativa_de_conciliacao: [],
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
      expect(screen.queryByText("Pendências da conciliação bancária")).not.toBeInTheDocument();
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

  it("exibe o modal de justificativa de saldo quando apenas essa pendência existe", async () => {
    const renderResult = await acionarDevolucaoParaAssociacao({
      solicitar_correcao_de_justificativa_de_conciliacao: true,
      contas_solicitar_correcao_de_justificativa_de_conciliacao: ["conta-uuid-1"],
    });

    const tituloModal = await screen.findByText("Justificativa de saldo da conta", {
      selector: ".modal-title",
    });
    const modalJustificativa = tituloModal.closest(".modal");
    expect(modalJustificativa).not.toBeNull();
    if (!modalJustificativa) {
      throw new Error("Modal de justificativa não encontrado");
    }
    const modalJustificativaElement = modalJustificativa;

    expect(
      within(modalJustificativaElement).getByText(
        /A\(s\) conta\(s\) Conta Corrente não possuem justificativa de diferença entre saldo reprogramado e saldo bancário/i
      )
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Comprovante de saldo da conta")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Pendências da conciliação bancária")
    ).not.toBeInTheDocument();

    renderResult.unmount();
  });

  it("exibe o modal unificado com mensagem de justificativa quando há múltiplas pendências", async () => {
    const renderResult = await acionarDevolucaoParaAssociacao({
      tem_pendencia_conciliacao_sem_solicitacao_de_acerto_em_conta: true,
      contas_pendencia_conciliacao_sem_solicitacao_de_acerto_em_conta: ["conta-uuid-1"],
      solicitar_correcao_de_justificativa_de_conciliacao: true,
      contas_solicitar_correcao_de_justificativa_de_conciliacao: ["conta-uuid-2"],
    });

    const tituloModal = await screen.findByText("Pendências da conciliação bancária", {
      selector: ".modal-title",
    });
    const modalUnificado = tituloModal.closest(".modal");
    expect(modalUnificado).not.toBeNull();
    if (!modalUnificado) {
      throw new Error("Modal unificado não encontrado");
    }
    const modalUnificadoElement = modalUnificado;

    const modalText = within(modalUnificadoElement).getByText(
      /A\(s\) conta\(s\) Conta Corrente não possuem comprovante de saldo/i
    );
    expect(modalText).toBeInTheDocument();
    expect(
      within(modalUnificadoElement).getByText(
        /A\(s\) conta\(s\) Poupança não possuem justificativa de diferença entre saldo reprogramado e saldo bancário/i
      )
    ).toBeInTheDocument();

    renderResult.unmount();
  });
});

describe("DevolucaoParaAcertos - cobertura adicional", () => {
  const renderEClicarDevolver = async (propsOverride = {}, analiseAtualOverride = {}) => {
    service.getPrestacaoDeContasDetalhe.mockResolvedValueOnce({
      ...mockPrestacaoDeContas,
      ...(propsOverride.prestacaoDeContas || {}),
      analise_atual: {
        ...mockPrestacaoDeContas.analise_atual,
        ...analiseAtualOverride,
      },
    });

    const utils = renderWithRouter(
      <DevolucaoParaAcertos {...defaultProps} {...propsOverride} />
    );

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

  beforeEach(() => {
    jest.clearAllMocks();
    visoesService.featureFlagAtiva.mockReturnValue(false);
    service.getLancamentosAjustes.mockResolvedValue([]);
    service.getDocumentosAjustes.mockResolvedValue([]);
    service.getDespesasPeriodosAnterioresAjustes.mockResolvedValue([]);
    service.getPrestacaoDeContasDetalhe.mockResolvedValue(mockPrestacaoDeContas);
    window.scrollTo = jest.fn();
    Element.prototype.scrollIntoView = jest.fn();
  });

  afterEach(() => {
    window.location.hash = "";
  });

  // ---- valor default de "editavel" (linha 34) ----

  it("usa editavel=true por padrão quando a prop não é informada", async () => {
    const { editavel, ...propsSemEditavel } = defaultProps;

    renderWithRouter(<DevolucaoParaAcertos {...propsSemEditavel} />);

    await waitFor(() =>
      expect(screen.queryByTestId("loading")).not.toBeInTheDocument()
    );
    const input = screen.getByTestId("data_limite_devolucao");
    expect(input).not.toBeDisabled();
  });

  // ---- editavel=false: busca a última análise da PC (linhas 107-112) ----

  it("busca a última análise da PC quando não editável e usa seu uuid para buscar ajustes", async () => {
    service.getUltimaAnalisePc.mockResolvedValueOnce({ uuid: "ultima-analise-uuid" });

    renderWithRouter(<DevolucaoParaAcertos {...defaultProps} editavel={false} />);

    await waitFor(() =>
      expect(service.getUltimaAnalisePc).toHaveBeenCalledWith("test-uuid")
    );
    await waitFor(() =>
      expect(service.getLancamentosAjustes).toHaveBeenCalledWith(
        "ultima-analise-uuid",
        "conta-uuid-1"
      )
    );
  });

  it("não define analise_atual_uuid quando a última análise da PC não possui uuid", async () => {
    service.getUltimaAnalisePc.mockResolvedValueOnce({});

    renderWithRouter(<DevolucaoParaAcertos {...defaultProps} editavel={false} />);

    await waitFor(() => expect(service.getUltimaAnalisePc).toHaveBeenCalled());
    await waitFor(() =>
      expect(service.getLancamentosAjustes).toHaveBeenCalledWith(
        undefined,
        "conta-uuid-1"
      )
    );
  });

  it("não busca a última análise quando não editável e a prestação de contas não possui uuid", async () => {
    renderWithRouter(
      <DevolucaoParaAcertos {...defaultProps} editavel={false} prestacaoDeContas={{}} />
    );

    await waitFor(() =>
      expect(screen.queryByTestId("loading")).not.toBeInTheDocument()
    );
    expect(service.getUltimaAnalisePc).not.toHaveBeenCalled();
  });

  it("não interrompe a busca de ajustes quando editável e a prestação não possui analise_atual", async () => {
    renderWithRouter(
      <DevolucaoParaAcertos
        {...defaultProps}
        prestacaoDeContas={{ uuid: "test-uuid", pode_devolver: true }}
      />
    );

    await waitFor(() =>
      expect(screen.queryByTestId("loading")).not.toBeInTheDocument()
    );
    expect(service.getLancamentosAjustes).toHaveBeenCalledWith(
      undefined,
      "conta-uuid-1"
    );
  });

  it("não conclui o carregamento quando infoAta não possui contas", async () => {
    renderWithRouter(
      <DevolucaoParaAcertos {...defaultProps} infoAta={{ contas: [] }} />
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("não atualiza o estado após o componente ser desmontado antes da resposta da última análise", async () => {
    let resolverPromise;
    service.getUltimaAnalisePc.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolverPromise = resolve;
        })
    );

    const { unmount } = renderWithRouter(
      <DevolucaoParaAcertos {...defaultProps} editavel={false} />
    );

    unmount();

    await act(async () => {
      resolverPromise({ uuid: "ultima-analise-uuid" });
      await Promise.resolve();
      await Promise.resolve();
    });
  });

  // ---- efeito de rolagem por hash (linhas 141-164) ----

  it("rola até a seção quando a hash indica síntese por realização da despesa e o elemento existe", async () => {
    const elemento = document.createElement("div");
    elemento.id = "collapse_sintese_por_realizacao_da_despesa";
    document.body.appendChild(elemento);
    window.location.hash = "#collapse_sintese_por_realizacao_da_despesa";

    renderWithRouter(<DevolucaoParaAcertos {...defaultProps} />);

    await waitFor(() =>
      expect(screen.queryByTestId("loading")).not.toBeInTheDocument()
    );

    await waitFor(
      () => expect(Element.prototype.scrollIntoView).toHaveBeenCalled(),
      { timeout: 2000 }
    );
    expect(elemento.classList.contains("show")).toBe(true);

    elemento.remove();
  });

  it("tenta novamente rolar até a seção quando o elemento ainda não está no DOM", async () => {
    window.location.hash = "#collapse_sintese_por_realizacao_da_despesa";

    renderWithRouter(<DevolucaoParaAcertos {...defaultProps} />);

    await waitFor(() =>
      expect(screen.queryByTestId("loading")).not.toBeInTheDocument()
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 250));
    });

    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
  });

  // ---- devolverParaAcertos (linhas 173-219) e modal de confirmação/erro ----

  it("confirma devolução para acertos com sucesso e atualiza a prestação de contas", async () => {
    service.getConcluirAnalise.mockResolvedValueOnce({});

    await renderEClicarDevolver();
    const confirmarBtn = await screen.findByRole("button", { name: "Confirmar" });
    fireEvent.click(confirmarBtn);

    await waitFor(() =>
      expect(service.getConcluirAnalise).toHaveBeenCalledWith(
        "test-uuid",
        expect.objectContaining({ resultado_analise: "DEVOLVIDA" })
      )
    );
    await waitFor(() =>
      expect(defaultProps.carregaPrestacaoDeContas).toHaveBeenCalled()
    );
    await waitFor(() =>
      expect(toastCustom.ToastCustomSuccess).toHaveBeenCalled()
    );
  });

  it("trata análises sem data_extrato ou saldo_extrato ao montar o payload de devolução", async () => {
    service.getConcluirAnalise.mockResolvedValueOnce({});
    const analisesSemDados = [
      { uuid: "analise-conta-uuid", conta_associacao: "conta-uuid-1" },
    ];

    await renderEClicarDevolver({ analisesDeContaDaPrestacao: analisesSemDados });
    const confirmarBtn = await screen.findByRole("button", { name: "Confirmar" });
    fireEvent.click(confirmarBtn);

    await waitFor(() =>
      expect(service.getConcluirAnalise).toHaveBeenCalledWith(
        "test-uuid",
        expect.objectContaining({
          analises_de_conta_da_prestacao: [
            expect.objectContaining({ data_extrato: null, saldo_extrato: 0 }),
          ],
        })
      )
    );
  });

  it("cancela o modal de confirmação de devolução para acertos", async () => {
    await renderEClicarDevolver();
    await screen.findByText("Mudança de Status", { selector: ".modal-title" });

    const cancelarBtn = screen.getByRole("button", { name: "Cancelar" });
    fireEvent.click(cancelarBtn);

    await waitFor(() =>
      expect(
        screen.queryByText("Mudança de Status", { selector: ".modal-title" })
      ).not.toBeInTheDocument()
    );
    expect(service.getConcluirAnalise).not.toHaveBeenCalled();
  });

  it("exibe modal de erro quando a prestação de contas não pode ser devolvida", async () => {
    await renderEClicarDevolver({
      prestacaoDeContas: { ...mockPrestacaoDeContas, pode_devolver: false },
    });

    const confirmarBtn = await screen.findByRole("button", { name: "Confirmar" });
    fireEvent.click(confirmarBtn);

    expect(
      await screen.findByText("Devolução para acerto não permitida", {
        selector: ".modal-title",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Foram solicitados acertos que demandam exclusão/)
    ).toBeInTheDocument();
    expect(service.getConcluirAnalise).not.toHaveBeenCalled();

    const fecharBtn = screen.getByRole("button", { name: "Fechar" });
    fireEvent.click(fecharBtn);

    await waitFor(() =>
      expect(
        screen.queryByText("Devolução para acerto não permitida", {
          selector: ".modal-title",
        })
      ).not.toBeInTheDocument()
    );
  });

  it("trata falha ao devolver para acertos usando a mensagem retornada pela API", async () => {
    service.getConcluirAnalise.mockRejectedValueOnce({
      response: { data: { mensagem: "Erro customizado da API" } },
    });

    await renderEClicarDevolver();
    const confirmarBtn = await screen.findByRole("button", { name: "Confirmar" });
    fireEvent.click(confirmarBtn);

    await waitFor(() => expect(service.getConcluirAnalise).toHaveBeenCalled());
    await waitFor(() =>
      expect(defaultProps.setLoadingAcompanhamentoPC).toHaveBeenCalledWith(false)
    );
    expect(toastCustom.ToastCustomSuccess).not.toHaveBeenCalled();
  });

  it("trata falha genérica ao devolver para acertos quando a API não retorna mensagem", async () => {
    service.getConcluirAnalise.mockRejectedValueOnce({ response: { data: {} } });

    await renderEClicarDevolver();
    const confirmarBtn = await screen.findByRole("button", { name: "Confirmar" });
    fireEvent.click(confirmarBtn);

    await waitFor(() => expect(service.getConcluirAnalise).toHaveBeenCalled());
    await waitFor(() =>
      expect(defaultProps.setLoadingAcompanhamentoPC).toHaveBeenCalledWith(false)
    );
    expect(toastCustom.ToastCustomSuccess).not.toHaveBeenCalled();
  });

  // ---- modal de conciliação bancária (linhas 223-224, 497) ----

  it("cancela o modal de conciliação bancária", async () => {
    await renderEClicarDevolver({}, { acertos_podem_alterar_saldo_conciliacao: true });

    expect(
      await screen.findByText("Acertos que podem alterar a conciliação bancária")
    ).toBeInTheDocument();

    const cancelarBtn = screen.getByRole("button", { name: "Cancelar" });
    fireEvent.click(cancelarBtn);

    await waitFor(() =>
      expect(
        screen.queryByText("Acertos que podem alterar a conciliação bancária")
      ).not.toBeInTheDocument()
    );
  });

  it("confirma devolução a partir do modal de conciliação bancária e abre o modal de confirmação", async () => {
    await renderEClicarDevolver({}, { acertos_podem_alterar_saldo_conciliacao: true });

    const confirmarBtn = await screen.findByRole("button", {
      name: "Confirmar devolução para acertos",
    });
    fireEvent.click(confirmarBtn);

    expect(
      await screen.findByText("Mudança de Status", { selector: ".modal-title" })
    ).toBeInTheDocument();
  });

  // ---- modal de comprovante de saldo (linhas 252-253, 536) e rolagem (228-248) ----

  it("fecha o modal de comprovante de saldo da conta", async () => {
    await renderEClicarDevolver(
      {},
      {
        tem_pendencia_conciliacao_sem_solicitacao_de_acerto_em_conta: true,
        contas_pendencia_conciliacao_sem_solicitacao_de_acerto_em_conta: [
          "conta-uuid-1",
        ],
      }
    );

    expect(
      await screen.findByText("Comprovante de saldo da conta", {
        selector: ".modal-title",
      })
    ).toBeInTheDocument();

    const fecharBtn = screen.getByRole("button", { name: "Fechar" });
    fireEvent.click(fecharBtn);

    await waitFor(() =>
      expect(
        screen.queryByText("Comprovante de saldo da conta", {
          selector: ".modal-title",
        })
      ).not.toBeInTheDocument()
    );
  });

  it("rola até o extrato bancário ao confirmar comprovante de saldo quando o elemento existe", async () => {
    const elemento = document.createElement("div");
    elemento.id = "collapse_sintese_por_realizacao_da_despesa";
    document.body.appendChild(elemento);

    await renderEClicarDevolver(
      {},
      {
        tem_pendencia_conciliacao_sem_solicitacao_de_acerto_em_conta: true,
        contas_pendencia_conciliacao_sem_solicitacao_de_acerto_em_conta: [
          "conta-uuid-1",
        ],
      }
    );

    const irBtn = await screen.findByRole("button", {
      name: "Ir para Extrato Bancário",
    });
    fireEvent.click(irBtn);

    await waitFor(
      () => expect(Element.prototype.scrollIntoView).toHaveBeenCalled(),
      { timeout: 2000 }
    );

    elemento.remove();
  });

  it("não rola até o extrato bancário quando o elemento não existe no DOM", async () => {
    await renderEClicarDevolver(
      {},
      {
        tem_pendencia_conciliacao_sem_solicitacao_de_acerto_em_conta: true,
        contas_pendencia_conciliacao_sem_solicitacao_de_acerto_em_conta: [
          "conta-uuid-1",
        ],
      }
    );

    const irBtn = await screen.findByRole("button", {
      name: "Ir para Extrato Bancário",
    });
    fireEvent.click(irBtn);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
    });

    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
  });

  // ---- modal de justificativa de saldo (linhas 257-258, 523) ----

  it("fecha o modal de justificativa de saldo da conta", async () => {
    await renderEClicarDevolver(
      {},
      {
        solicitar_correcao_de_justificativa_de_conciliacao: true,
        contas_solicitar_correcao_de_justificativa_de_conciliacao: [
          "conta-uuid-1",
        ],
      }
    );

    await screen.findByText("Justificativa de saldo da conta", {
      selector: ".modal-title",
    });

    const fecharBtn = screen.getByRole("button", { name: "Fechar" });
    fireEvent.click(fecharBtn);

    await waitFor(() =>
      expect(
        screen.queryByText("Justificativa de saldo da conta", {
          selector: ".modal-title",
        })
      ).not.toBeInTheDocument()
    );
  });

  it("navega para o extrato bancário a partir do modal de justificativa de saldo", async () => {
    await renderEClicarDevolver(
      {},
      {
        solicitar_correcao_de_justificativa_de_conciliacao: true,
        contas_solicitar_correcao_de_justificativa_de_conciliacao: [
          "conta-uuid-1",
        ],
      }
    );

    await screen.findByText("Justificativa de saldo da conta", {
      selector: ".modal-title",
    });

    const irBtn = screen.getByRole("button", { name: "Ir para Extrato Bancário" });
    fireEvent.click(irBtn);

    await waitFor(() =>
      expect(
        screen.queryByText("Justificativa de saldo da conta", {
          selector: ".modal-title",
        })
      ).not.toBeInTheDocument()
    );
  });

  // ---- modal unificado de lançamentos (linhas 262-269, 315, 377, 381) ----

  it("exibe apenas o bloco de solicitações quando só há pendência de lançamentos", async () => {
    await renderEClicarDevolver(
      {},
      {
        solicitacoes_lancar_credito_ou_despesa_com_pendencia_conciliacao: true,
        contas_solicitacoes_lancar_credito_ou_despesa_com_pendencia_conciliacao: [
          "conta-uuid-2",
        ],
      }
    );

    const tituloModal = await screen.findByText("Pendências da conciliação bancária", {
      selector: ".modal-title",
    });
    const modal = tituloModal.closest(".modal");

    expect(
      within(modal).getByText(/Foram indicados acertos de inclusão\/exclusão de lançamento/)
    ).toBeInTheDocument();
    expect(
      within(modal).queryByText(/não possuem comprovante de saldo/)
    ).not.toBeInTheDocument();
    expect(
      within(modal).queryByText(/não possuem justificativa de diferença/)
    ).not.toBeInTheDocument();

    const fecharBtn = within(modal).getByRole("button", { name: "Fechar" });
    fireEvent.click(fecharBtn);

    await waitFor(() =>
      expect(
        screen.queryByText("Pendências da conciliação bancária", {
          selector: ".modal-title",
        })
      ).not.toBeInTheDocument()
    );
  });

  it("navega até o extrato bancário a partir do modal unificado de lançamentos", async () => {
    await renderEClicarDevolver(
      {},
      {
        solicitacoes_lancar_credito_ou_despesa_com_pendencia_conciliacao: true,
        contas_solicitacoes_lancar_credito_ou_despesa_com_pendencia_conciliacao: [
          "conta-uuid-2",
        ],
      }
    );

    const irBtn = await screen.findByRole("button", {
      name: "Ir para Extrato Bancário",
    });
    fireEvent.click(irBtn);

    await waitFor(() =>
      expect(
        screen.queryByText("Pendências da conciliação bancária", {
          selector: ".modal-title",
        })
      ).not.toBeInTheDocument()
    );
  });

  it("monta o modal unificado com todos os blocos quando há três tipos de pendência", async () => {
    await renderEClicarDevolver(
      {},
      {
        tem_pendencia_conciliacao_sem_solicitacao_de_acerto_em_conta: true,
        contas_pendencia_conciliacao_sem_solicitacao_de_acerto_em_conta: [
          "conta-uuid-1",
        ],
        solicitacoes_lancar_credito_ou_despesa_com_pendencia_conciliacao: true,
        contas_solicitacoes_lancar_credito_ou_despesa_com_pendencia_conciliacao: [
          "conta-uuid-2",
        ],
        solicitar_correcao_de_justificativa_de_conciliacao: true,
        contas_solicitar_correcao_de_justificativa_de_conciliacao: [
          "conta-uuid-1",
        ],
      }
    );

    const tituloModal = await screen.findByText("Pendências da conciliação bancária", {
      selector: ".modal-title",
    });
    const modal = tituloModal.closest(".modal");

    expect(
      within(modal).getByText(/Foram indicados acertos de inclusão\/exclusão de lançamento/)
    ).toBeInTheDocument();
    expect(
      within(modal).getByText(/não possuem comprovante de saldo/)
    ).toBeInTheDocument();
    expect(
      within(modal).getByText(/não possuem justificativa de diferença/)
    ).toBeInTheDocument();
  });

  // ---- obterNomeConta: formatos diversos e fallback N/E (linhas 274, 282, 286, 289-299) ----

  it("resolve nomes de conta a partir de diferentes formatos e usa N/E como fallback", async () => {
    await renderEClicarDevolver(
      {},
      {
        tem_pendencia_conciliacao_sem_solicitacao_de_acerto_em_conta: true,
        contas_pendencia_conciliacao_sem_solicitacao_de_acerto_em_conta: [
          { nome: "Conta Objeto Direta" },
          { conta_associacao: { nome: "Conta Aninhada" } },
          { uuid: "uuid-que-nao-existe-em-info-ata" },
          {},
          42,
          null,
          "conta-uuid-que-nao-existe",
        ],
      }
    );

    const modalTitulo = await screen.findByText("Comprovante de saldo da conta", {
      selector: ".modal-title",
    });
    const modal = modalTitulo.closest(".modal");

    expect(within(modal).getByText(/Conta Objeto Direta/)).toBeInTheDocument();
    expect(within(modal).getByText(/Conta Aninhada/)).toBeInTheDocument();
    expect(within(modal).getByText(/N\/E/)).toBeInTheDocument();
  });

  // ---- link "Ver resumo" desabilitado (linha 440) e histórico de devoluções (404, 450) ----

  it('previne a navegação ao clicar em "Ver resumo" quando não há histórico nem acertos selecionados', async () => {
    const analisesSemUuid = [
      { ...mockAnalisesDeContaDaPrestacao[0], uuid: undefined },
    ];

    renderWithRouter(
      <DevolucaoParaAcertos
        {...defaultProps}
        analisesDeContaDaPrestacao={analisesSemUuid}
      />
    );

    await waitFor(() =>
      expect(screen.queryByTestId("loading")).not.toBeInTheDocument()
    );

    const link = screen.getByRole("link", { name: /ver resumo/i });
    expect(link).toHaveAttribute(
      "title",
      "Esta PC não possui histórico de devoluções."
    );

    fireEvent.click(link);

    expect(screen.getByText("Devolução para acertos")).toBeInTheDocument();
  });

  it('exibe o link "Ver resumo" sem aviso de histórico quando já existem devoluções anteriores', async () => {
    const prestacaoComHistorico = {
      ...mockPrestacaoDeContas,
      devolucoes_da_prestacao: [{ uuid: "devolucao-1" }],
    };

    renderWithRouter(
      <DevolucaoParaAcertos
        {...defaultProps}
        prestacaoDeContas={prestacaoComHistorico}
      />
    );

    await waitFor(() =>
      expect(screen.queryByTestId("loading")).not.toBeInTheDocument()
    );

    const link = screen.getByRole("link", { name: /ver resumo/i });
    expect(link).not.toHaveAttribute("title");
  });

  // ---- feature flag de ajustes de despesas anteriores (linha 409) ----

  it("considera despesas de períodos anteriores para habilitar o botão quando a feature flag está ativa", async () => {
    visoesService.featureFlagAtiva.mockReturnValue(true);
    service.getDespesasPeriodosAnterioresAjustes.mockResolvedValue([
      { uuid: "despesa-1" },
    ]);
    const analisesSemUuid = [
      { ...mockAnalisesDeContaDaPrestacao[0], uuid: undefined },
    ];

    renderWithRouter(
      <DevolucaoParaAcertos
        {...defaultProps}
        analisesDeContaDaPrestacao={analisesSemUuid}
      />
    );

    await waitFor(() =>
      expect(screen.queryByTestId("loading")).not.toBeInTheDocument()
    );

    const input = await screen.findByTestId("data_limite_devolucao");
    fireEvent.change(input, { target: { value: "2024-02-15" } });

    const button = screen.getByRole("button", {
      name: /devolver para associação/i,
    });
    await waitFor(() => expect(button).toBeEnabled());
  });
});
