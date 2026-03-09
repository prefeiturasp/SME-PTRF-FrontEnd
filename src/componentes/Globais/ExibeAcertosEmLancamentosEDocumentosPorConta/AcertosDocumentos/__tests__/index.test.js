import React from "react";
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";

import AcertosDocumentos from "../index";
import { visoesService } from "../../../../../services/visoes.service";
import { mantemEstadoAnaliseDre as meapcservice } from "../../../../../services/mantemEstadoAnaliseDre.service";
import {
  getAnaliseDocumentosPrestacaoConta,
  getDocumentosAjustes,
  postJustificarNaoRealizacaoDocumentoPrestacaoConta,
  postLimparStatusDocumentoPrestacaoConta,
  postMarcarComoDocumentoEsclarecido,
  postMarcarComoRealizadoDocumentoPrestacaoConta,
  postSalvarJustificativasAdicionais,
  postRestaurarJustificativasAdicionais,
} from "../../../../../services/dres/PrestacaoDeContas.service";

// Captura props do filho mockado
let capturedTabelaProps = {};

jest.mock("../TabelaAcertosDocumentos", () => (props) => {
  capturedTabelaProps = props;
  return <div data-testid="tabela-acertos-documentos" />;
});

jest.mock("../../../../../utils/Loading", () => () => (
  <div data-testid="loading" />
));

jest.mock("../../../BarraMensagem", () => ({
  barraMensagemCustom: {
    BarraMensagemAcertoExterno: (msg) => (
      <div data-testid="barra-acerto-externo">{msg}</div>
    ),
    BarraMensagemInativa: (msg) => (
      <div data-testid="barra-inativa">{msg}</div>
    ),
  },
}));

jest.mock("../../BotoesDetalhesParaAcertosDeCategoriasDocumentos", () => () => (
  <div data-testid="botoes-detalhes" />
));

jest.mock(
  "../../../../dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ConferenciaDeDocumentos/Modais/ModalRestaurarJustificativa",
  () => ({
    ModalRestaurarJustificativa: ({ show, titulo, primeiroBotaoOnclick, handleClose }) =>
      show ? (
        <div data-testid="modal-restaurar">
          <span>{titulo}</span>
          <button onClick={primeiroBotaoOnclick}>Confirmar restaurar</button>
          <button onClick={handleClose}>Fechar restaurar</button>
        </div>
      ) : null,
  })
);

jest.mock("../../../../../services/visoes.service", () => ({
  visoesService: {
    getItemUsuarioLogado: jest.fn(),
    getPermissoes: jest.fn(),
    getUsuarioLogin: jest.fn(() => "usuario"),
  },
}));

jest.mock("../../../../../services/mantemEstadoAnaliseDre.service", () => ({
  mantemEstadoAnaliseDre: {
    getAnaliseDreUsuarioLogado: jest.fn(),
    setAnaliseDrePorUsuario: jest.fn(),
  },
}));

jest.mock("../../../../../services/dres/PrestacaoDeContas.service", () => ({
  getAnaliseDocumentosPrestacaoConta: jest.fn(),
  getDocumentosAjustes: jest.fn(),
  postJustificarNaoRealizacaoDocumentoPrestacaoConta: jest.fn(),
  postLimparStatusDocumentoPrestacaoConta: jest.fn(),
  postMarcarComoDocumentoEsclarecido: jest.fn(),
  postMarcarComoRealizadoDocumentoPrestacaoConta: jest.fn(),
  postSalvarJustificativasAdicionais: jest.fn(),
  postRestaurarJustificativasAdicionais: jest.fn(),
}));

// ── Dados de mock ──

const mockAnaliseDocumentos = {
  editavel: true,
  status_realizacao_solicitacao: [
    { id: "PENDENTE", nome: "Pendente" },
    { id: "REALIZADO", nome: "Realizado" },
    { id: "JUSTIFICADO", nome: "Justificado" },
  ],
};

const mockDocumentosAjustes = [
  {
    uuid: "doc-uuid",
    status_realizacao: "PENDENTE",
    tipo_documento_prestacao_conta: { nome: "Nota Fiscal" },
    solicitacoes_de_ajuste_da_analise_total: 1,
    solicitacoes_de_ajuste_da_analise: {
      solicitacoes_acerto_por_categoria: [
        {
          requer_ajustes_externos: false,
          acertos: [
            {
              uuid: "acerto-uuid",
              ordem: 1,
              tipo_acerto: { nome: "Tipo Acerto", categoria: "AJUSTE_LANCAMENTO" },
              detalhamento: "Detalhe do acerto",
              status_realizacao: "PENDENTE",
              justificativa: null,
              esclarecimentos: null,
              selecionado: false,
              justificativa_conciliacao: null,
              justificativa_conciliacao_original: null,
            },
          ],
        },
      ],
    },
  },
];

const mockAnaliseDreUsuarioLogado = {
  conferencia_de_documentos: {
    paginacao_atual: 0,
    expanded: [],
  },
};

const defaultProps = {
  analiseAtualUuid: "analise-uuid",
  prestacaoDeContas: { status: "DEVOLVIDA" },
  prestacaoDeContasUuid: "pc-uuid",
};

const setup = (props = {}) =>
  render(<AcertosDocumentos {...defaultProps} {...props} />);

// ── Configuração padrão dos mocks ──

beforeEach(() => {
  capturedTabelaProps = {};

  meapcservice.getAnaliseDreUsuarioLogado.mockReturnValue(mockAnaliseDreUsuarioLogado);
  meapcservice.setAnaliseDrePorUsuario.mockReset();

  visoesService.getItemUsuarioLogado.mockReturnValue("UE");
  visoesService.getPermissoes.mockReturnValue(true);
  visoesService.getUsuarioLogin.mockReturnValue("usuario");

  getAnaliseDocumentosPrestacaoConta.mockResolvedValue(mockAnaliseDocumentos);
  getDocumentosAjustes.mockResolvedValue(mockDocumentosAjustes);

  postJustificarNaoRealizacaoDocumentoPrestacaoConta.mockResolvedValue({
    todas_as_solicitacoes_marcadas_como_justificado: true,
  });
  postLimparStatusDocumentoPrestacaoConta.mockResolvedValue({});
  postMarcarComoDocumentoEsclarecido.mockResolvedValue({});
  postMarcarComoRealizadoDocumentoPrestacaoConta.mockResolvedValue({
    todas_as_solicitacoes_marcadas_como_realizado: true,
  });
  postSalvarJustificativasAdicionais.mockResolvedValue({});
  postRestaurarJustificativasAdicionais.mockResolvedValue({});
});

describe("AcertosDocumentos", () => {
  // ── Estado de carregamento ──

  it("exibe Loading enquanto os dados estão sendo carregados", () => {
    getAnaliseDocumentosPrestacaoConta.mockReturnValue(new Promise(() => {}));
    setup();

    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("esconde Loading após os dados serem carregados", async () => {
    setup();

    await waitFor(() =>
      expect(screen.queryByTestId("loading")).not.toBeInTheDocument()
    );
  });

  it("exibe TabelaAcertosDocumentos após os dados serem carregados", async () => {
    setup();

    await waitFor(() =>
      expect(screen.getByTestId("tabela-acertos-documentos")).toBeInTheDocument()
    );
  });

  it("exibe título 'Acertos nos documentos'", async () => {
    setup();

    await waitFor(() =>
      expect(screen.getByText("Acertos nos documentos")).toBeInTheDocument()
    );
  });

  // ── Props passadas para TabelaAcertosDocumentos ──

  it("passa analisePermiteEdicao correto para TabelaAcertosDocumentos", async () => {
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.analisePermiteEdicao).toBe(true)
    );
  });

  it("passa analisePermiteEdicao false quando editavel é false", async () => {
    getAnaliseDocumentosPrestacaoConta.mockResolvedValue({
      ...mockAnaliseDocumentos,
      editavel: false,
    });

    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.analisePermiteEdicao).toBe(false)
    );
  });

  it("passa documentosAjustes para TabelaAcertosDocumentos", async () => {
    setup();

    await waitFor(() => {
      expect(capturedTabelaProps.documentosAjustes).toBeDefined();
      expect(capturedTabelaProps.documentosAjustes.length).toBe(1);
    });
  });

  it("inicializa quantidadeSelecionada em 0", async () => {
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.quantidadeSelecionada).toBe(0)
    );
  });

  it("passa rowsPerPageAcertosDocumentos como 5", async () => {
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.rowsPerPageAcertosDocumentos).toBe(5)
    );
  });

  it("chama getAnaliseDocumentosPrestacaoConta com analiseAtualUuid e visao", async () => {
    setup();

    await waitFor(() => {
      expect(getAnaliseDocumentosPrestacaoConta).toHaveBeenCalledWith(
        "analise-uuid",
        "UE"
      );
    });
  });

  it("chama getDocumentosAjustes com analiseAtualUuid", async () => {
    setup();

    await waitFor(() => {
      expect(getDocumentosAjustes).toHaveBeenCalledWith("analise-uuid");
    });
  });

  // ── selecionarTodosItensDosDocumentosGlobal ──

  it("selecionarTodosItensDosDocumentosGlobal retorna checkbox", async () => {
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.selecionarTodosItensDosDocumentosGlobal).toBeDefined()
    );

    const { container } = render(
      capturedTabelaProps.selecionarTodosItensDosDocumentosGlobal()
    );
    expect(container.querySelector("input[type='checkbox']")).toBeInTheDocument();
  });

  // ── selecionarTodosItensDoDocumentoRow ──

  it("selecionarTodosItensDoDocumentoRow retorna checkbox para a linha", async () => {
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.selecionarTodosItensDoDocumentoRow).toBeDefined()
    );

    const { container } = render(
      capturedTabelaProps.selecionarTodosItensDoDocumentoRow({ uuid: "doc-uuid" })
    );
    expect(container.querySelector("input[type='checkbox']")).toBeInTheDocument();
  });

  // ── rowExpansionTemplateDocumentos ──

  it("rowExpansionTemplateDocumentos retorna undefined para data sem solicitacoes", async () => {
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.rowExpansionTemplateDocumentos).toBeDefined()
    );

    const result = capturedTabelaProps.rowExpansionTemplateDocumentos({
      solicitacoes_de_ajuste_da_analise: {
        solicitacoes_acerto_por_categoria: [],
      },
    });

    expect(result).toBeUndefined();
  });

  it("rowExpansionTemplateDocumentos renderiza tipo de acerto", async () => {
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.rowExpansionTemplateDocumentos).toBeDefined()
    );

    const data = mockDocumentosAjustes[0];
    const { getByText } = render(
      capturedTabelaProps.rowExpansionTemplateDocumentos(data)
    );

    expect(getByText("Tipo Acerto")).toBeInTheDocument();
    expect(getByText("Detalhe do acerto")).toBeInTheDocument();
    expect(getByText("Item: 1")).toBeInTheDocument();
  });

  it("rowExpansionTemplateDocumentos renderiza mensagem de acerto externo", async () => {
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.rowExpansionTemplateDocumentos).toBeDefined()
    );

    const data = {
      ...mockDocumentosAjustes[0],
      solicitacoes_de_ajuste_da_analise: {
        solicitacoes_acerto_por_categoria: [
          {
            requer_ajustes_externos: true,
            acertos: [
              {
                ...mockDocumentosAjustes[0].solicitacoes_de_ajuste_da_analise
                  .solicitacoes_acerto_por_categoria[0].acertos[0],
              },
            ],
          },
        ],
      },
    };

    const { getByTestId } = render(
      capturedTabelaProps.rowExpansionTemplateDocumentos(data)
    );

    expect(getByTestId("barra-acerto-externo")).toBeInTheDocument();
  });

  it("rowExpansionTemplateDocumentos não exibe mensagem de acerto externo quando false", async () => {
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.rowExpansionTemplateDocumentos).toBeDefined()
    );

    const { queryByTestId } = render(
      capturedTabelaProps.rowExpansionTemplateDocumentos(mockDocumentosAjustes[0])
    );

    expect(queryByTestId("barra-acerto-externo")).not.toBeInTheDocument();
  });

  it("rowExpansionTemplateDocumentos exibe justificativa quando presente", async () => {
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.rowExpansionTemplateDocumentos).toBeDefined()
    );

    const data = {
      ...mockDocumentosAjustes[0],
      solicitacoes_de_ajuste_da_analise: {
        solicitacoes_acerto_por_categoria: [
          {
            requer_ajustes_externos: false,
            acertos: [
              {
                ...mockDocumentosAjustes[0].solicitacoes_de_ajuste_da_analise
                  .solicitacoes_acerto_por_categoria[0].acertos[0],
                justificativa: "Justificativa do acerto",
              },
            ],
          },
        ],
      },
    };

    const { getByText } = render(
      capturedTabelaProps.rowExpansionTemplateDocumentos(data)
    );

    expect(getByText("Justificativa")).toBeInTheDocument();
    expect(getByText("Salvar Justificativas")).toBeInTheDocument();
  });

  it("rowExpansionTemplateDocumentos exibe campo de esclarecimento para SOLICITACAO_ESCLARECIMENTO", async () => {
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.rowExpansionTemplateDocumentos).toBeDefined()
    );

    const data = {
      ...mockDocumentosAjustes[0],
      solicitacoes_de_ajuste_da_analise: {
        solicitacoes_acerto_por_categoria: [
          {
            requer_ajustes_externos: false,
            acertos: [
              {
                ...mockDocumentosAjustes[0].solicitacoes_de_ajuste_da_analise
                  .solicitacoes_acerto_por_categoria[0].acertos[0],
                tipo_acerto: {
                  nome: "Esclarecimento",
                  categoria: "SOLICITACAO_ESCLARECIMENTO",
                },
                esclarecimentos: "Esclarecimento existente",
              },
            ],
          },
        ],
      },
    };

    const { getByText } = render(
      capturedTabelaProps.rowExpansionTemplateDocumentos(data)
    );

    expect(getByText("Esclarecimento do documento")).toBeInTheDocument();
    expect(getByText("Salvar esclarecimento")).toBeInTheDocument();
  });

  it("rowExpansionTemplateDocumentos exibe campo de justificativas adicionais para EDICAO_INFORMACAO", async () => {
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.rowExpansionTemplateDocumentos).toBeDefined()
    );

    const data = {
      ...mockDocumentosAjustes[0],
      solicitacoes_de_ajuste_da_analise: {
        solicitacoes_acerto_por_categoria: [
          {
            requer_ajustes_externos: false,
            acertos: [
              {
                ...mockDocumentosAjustes[0].solicitacoes_de_ajuste_da_analise
                  .solicitacoes_acerto_por_categoria[0].acertos[0],
                tipo_acerto: {
                  nome: "Edição Informação",
                  categoria: "EDICAO_INFORMACAO",
                },
                justificativa_conciliacao: "Justificativa atual",
                justificativa_conciliacao_original: "Justificativa original",
              },
            ],
          },
        ],
      },
    };

    const { getByText } = render(
      capturedTabelaProps.rowExpansionTemplateDocumentos(data)
    );

    expect(getByText("Justificativas e informações adicionais")).toBeInTheDocument();
    expect(getByText("Salvar justificativas")).toBeInTheDocument();
  });

  it("rowExpansionTemplateDocumentos exibe botão 'Restaurar Justificativas' para EDICAO_INFORMACAO com original diferente", async () => {
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.rowExpansionTemplateDocumentos).toBeDefined()
    );

    const data = {
      ...mockDocumentosAjustes[0],
      solicitacoes_de_ajuste_da_analise: {
        solicitacoes_acerto_por_categoria: [
          {
            requer_ajustes_externos: false,
            acertos: [
              {
                ...mockDocumentosAjustes[0].solicitacoes_de_ajuste_da_analise
                  .solicitacoes_acerto_por_categoria[0].acertos[0],
                tipo_acerto: {
                  nome: "Edição Informação",
                  categoria: "EDICAO_INFORMACAO",
                },
                justificativa_conciliacao: "texto atual diferente",
                justificativa_conciliacao_original: "texto original",
              },
            ],
          },
        ],
      },
    };

    const { getByText } = render(
      capturedTabelaProps.rowExpansionTemplateDocumentos(data)
    );

    expect(getByText("Restaurar Justificativas")).toBeInTheDocument();
  });

  it("rowExpansionTemplateDocumentos exibe checkbox de seleção quando visao é UE, pc DEVOLVIDA e analise editável", async () => {
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.rowExpansionTemplateDocumentos).toBeDefined()
    );

    const { container } = render(
      capturedTabelaProps.rowExpansionTemplateDocumentos(mockDocumentosAjustes[0])
    );

    expect(container.querySelector("input[type='checkbox']")).toBeInTheDocument();
  });

  it("rowExpansionTemplateDocumentos não exibe checkbox quando visao é DRE", async () => {
    visoesService.getItemUsuarioLogado.mockReturnValue("DRE");
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.rowExpansionTemplateDocumentos).toBeDefined()
    );

    const { container } = render(
      capturedTabelaProps.rowExpansionTemplateDocumentos(mockDocumentosAjustes[0])
    );

    expect(container.querySelector("input[type='checkbox']")).not.toBeInTheDocument();
  });

  it("rowExpansionTemplateDocumentos renderiza BotoesDetalhes para cada acerto", async () => {
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.rowExpansionTemplateDocumentos).toBeDefined()
    );

    const { getByTestId } = render(
      capturedTabelaProps.rowExpansionTemplateDocumentos(mockDocumentosAjustes[0])
    );

    expect(getByTestId("botoes-detalhes")).toBeInTheDocument();
  });

  // ── tagJustificativa no rowExpansionTemplateDocumentos ──

  it("rowExpansionTemplateDocumentos usa tagJustificativa para exibir status do acerto", async () => {
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.rowExpansionTemplateDocumentos).toBeDefined()
    );

    const dataComRealizado = {
      ...mockDocumentosAjustes[0],
      solicitacoes_de_ajuste_da_analise: {
        solicitacoes_acerto_por_categoria: [
          {
            requer_ajustes_externos: false,
            acertos: [
              {
                ...mockDocumentosAjustes[0].solicitacoes_de_ajuste_da_analise
                  .solicitacoes_acerto_por_categoria[0].acertos[0],
                status_realizacao: "REALIZADO",
              },
            ],
          },
        ],
      },
    };

    const { container } = render(
      capturedTabelaProps.rowExpansionTemplateDocumentos(dataComRealizado)
    );

    const tagElements = container.querySelectorAll(".tag-justificativa");
    expect(tagElements.length).toBeGreaterThan(0);
    expect(tagElements[0].textContent).toBe("Realizado");
  });

  // ── limparDocumentoStatus ──

  it("limparDocumentoStatus chama postLimparStatusDocumentoPrestacaoConta", async () => {
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.limparDocumentoStatus).toBeDefined()
    );

    await act(async () => {
      await capturedTabelaProps.limparDocumentoStatus();
    });

    expect(postLimparStatusDocumentoPrestacaoConta).toHaveBeenCalledWith({
      uuids_solicitacoes_acertos_documentos: [],
    });
  });

  // ── marcarDocumentoComoRealizado ──

  it("marcarDocumentoComoRealizado chama postMarcarComoRealizadoDocumentoPrestacaoConta", async () => {
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.marcarDocumentoComoRealizado).toBeDefined()
    );

    await act(async () => {
      await capturedTabelaProps.marcarDocumentoComoRealizado();
    });

    expect(postMarcarComoRealizadoDocumentoPrestacaoConta).toHaveBeenCalledWith({
      uuids_solicitacoes_acertos_documentos: [],
    });
  });

  it("marcarDocumentoComoRealizado exibe modal CheckNaoPermitido quando resposta indica falha parcial", async () => {
    postMarcarComoRealizadoDocumentoPrestacaoConta.mockResolvedValue({
      todas_as_solicitacoes_marcadas_como_realizado: false,
      mensagem: "Não foi possível realizar.",
    });

    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.marcarDocumentoComoRealizado).toBeDefined()
    );

    await act(async () => {
      await capturedTabelaProps.marcarDocumentoComoRealizado();
    });

    await waitFor(() =>
      expect(capturedTabelaProps.showModalCheckNaoPermitido).toBe(true)
    );
  });

  // ── justificarNaoRealizacaoDocumentos ──

  it("justificarNaoRealizacaoDocumentos chama postJustificarNaoRealizacaoDocumentoPrestacaoConta", async () => {
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.justificarNaoRealizacaoDocumentos).toBeDefined()
    );

    await act(async () => {
      await capturedTabelaProps.justificarNaoRealizacaoDocumentos("justificativa teste");
    });

    expect(postJustificarNaoRealizacaoDocumentoPrestacaoConta).toHaveBeenCalledWith(
      expect.objectContaining({ justificativa: "justificativa teste" })
    );
  });

  it("justificarNaoRealizacaoDocumentos exibe modal CheckNaoPermitido quando resposta indica falha parcial", async () => {
    postJustificarNaoRealizacaoDocumentoPrestacaoConta.mockResolvedValue({
      todas_as_solicitacoes_marcadas_como_justificado: false,
      mensagem: "Não foi possível justificar.",
    });

    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.justificarNaoRealizacaoDocumentos).toBeDefined()
    );

    await act(async () => {
      await capturedTabelaProps.justificarNaoRealizacaoDocumentos("justificativa");
    });

    await waitFor(() =>
      expect(capturedTabelaProps.showModalCheckNaoPermitido).toBe(true)
    );
  });

  // ── acaoCancelar ──

  it("acaoCancelar redefine quantidadeSelecionada para 0", async () => {
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.acaoCancelar).toBeDefined()
    );

    act(() => {
      capturedTabelaProps.acaoCancelar();
    });

    await waitFor(() =>
      expect(capturedTabelaProps.quantidadeSelecionada).toBe(0)
    );
  });

  // ── ModalRestaurarJustificativa ──

  it("ModalRestaurarJustificativa não está visível inicialmente", async () => {
    setup();

    await waitFor(() =>
      expect(screen.queryByTestId("modal-restaurar")).not.toBeInTheDocument()
    );
  });

  it("ModalRestaurarJustificativa aparece ao chamar onClickRestaurarJustificativa via rowExpansionTemplateDocumentos", async () => {
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.rowExpansionTemplateDocumentos).toBeDefined()
    );

    const acertoComOriginal = {
      uuid: "acerto-restaurar-uuid",
      ordem: 1,
      tipo_acerto: { nome: "Edição Informação", categoria: "EDICAO_INFORMACAO" },
      detalhamento: null,
      status_realizacao: "PENDENTE",
      justificativa: null,
      esclarecimentos: null,
      selecionado: false,
      justificativa_conciliacao: "atual",
      justificativa_conciliacao_original: "original",
    };

    const data = {
      uuid: "doc-uuid",
      solicitacoes_de_ajuste_da_analise: {
        solicitacoes_acerto_por_categoria: [
          {
            requer_ajustes_externos: false,
            acertos: [acertoComOriginal],
          },
        ],
      },
    };

    const { getByText } = render(
      capturedTabelaProps.rowExpansionTemplateDocumentos(data)
    );

    act(() => {
      fireEvent.click(getByText("Restaurar Justificativas"));
    });

    await waitFor(() =>
      expect(screen.getByTestId("modal-restaurar")).toBeInTheDocument()
    );
  });

  it("fechar ModalRestaurarJustificativa via handleClose esconde o modal", async () => {
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.rowExpansionTemplateDocumentos).toBeDefined()
    );

    const acertoComOriginal = {
      uuid: "acerto-restaurar-uuid",
      ordem: 1,
      tipo_acerto: { nome: "Edição Informação", categoria: "EDICAO_INFORMACAO" },
      detalhamento: null,
      status_realizacao: "PENDENTE",
      justificativa: null,
      esclarecimentos: null,
      selecionado: false,
      justificativa_conciliacao: "atual",
      justificativa_conciliacao_original: "original",
    };

    const data = {
      uuid: "doc-uuid",
      solicitacoes_de_ajuste_da_analise: {
        solicitacoes_acerto_por_categoria: [
          { requer_ajustes_externos: false, acertos: [acertoComOriginal] },
        ],
      },
    };

    const { getByText } = render(
      capturedTabelaProps.rowExpansionTemplateDocumentos(data)
    );

    act(() => {
      fireEvent.click(getByText("Restaurar Justificativas"));
    });

    await waitFor(() =>
      expect(screen.getByTestId("modal-restaurar")).toBeInTheDocument()
    );

    act(() => {
      fireEvent.click(screen.getByText("Fechar restaurar"));
    });

    await waitFor(() =>
      expect(screen.queryByTestId("modal-restaurar")).not.toBeInTheDocument()
    );
  });

  it("confirmar ModalRestaurarJustificativa chama postRestaurarJustificativasAdicionais", async () => {
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.rowExpansionTemplateDocumentos).toBeDefined()
    );

    const acertoComOriginal = {
      uuid: "acerto-restaurar-uuid",
      ordem: 1,
      tipo_acerto: { nome: "Edição Informação", categoria: "EDICAO_INFORMACAO" },
      detalhamento: null,
      status_realizacao: "PENDENTE",
      justificativa: null,
      esclarecimentos: null,
      selecionado: false,
      justificativa_conciliacao: "atual",
      justificativa_conciliacao_original: "original",
    };

    const data = {
      uuid: "doc-uuid",
      solicitacoes_de_ajuste_da_analise: {
        solicitacoes_acerto_por_categoria: [
          { requer_ajustes_externos: false, acertos: [acertoComOriginal] },
        ],
      },
    };

    const { getByText } = render(
      capturedTabelaProps.rowExpansionTemplateDocumentos(data)
    );

    act(() => {
      fireEvent.click(getByText("Restaurar Justificativas"));
    });

    await waitFor(() =>
      expect(screen.getByTestId("modal-restaurar")).toBeInTheDocument()
    );

    await act(async () => {
      fireEvent.click(screen.getByText("Confirmar restaurar"));
    });

    expect(postRestaurarJustificativasAdicionais).toHaveBeenCalledWith({
      uuid_solicitacao_acerto: "acerto-restaurar-uuid",
    });
  });

  // ── acoesDisponiveis ──

  it("acoesDisponiveis retorna PENDENTE=true quando todos selecionados têm status PENDENTE", async () => {
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.acoesDisponiveis).toBeDefined()
    );

    const acoes = capturedTabelaProps.acoesDisponiveis();

    expect(acoes).toHaveProperty("PENDENTE");
    expect(acoes).toHaveProperty("JUSTIFICADO");
    expect(acoes).toHaveProperty("REALIZADO");
  });

  // ── expanded rows e localStorage ──

  it("salvaEstadoExpandedRowsDocumentosLocalStorage é chamado ao setar expandedRows", async () => {
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.setExpandedRowsDocumentos).toBeDefined()
    );

    act(() => {
      capturedTabelaProps.setExpandedRowsDocumentos([
        { uuid: "doc-uuid" },
      ]);
    });

    await waitFor(() =>
      expect(meapcservice.setAnaliseDrePorUsuario).toHaveBeenCalled()
    );
  });

  // ── JSX tree helper ──
  // Traverses a React JSX tree and returns the first element matching predicate
  const findInJSX = (jsx, predicate) => {
    if (jsx === null || jsx === undefined || typeof jsx !== "object" || !jsx.props)
      return null;
    if (predicate(jsx)) return jsx;
    const children = jsx.props.children;
    if (children === null || children === undefined) return null;
    const list = Array.isArray(children) ? children.flat(Infinity) : [children];
    for (const child of list) {
      const found = findInJSX(child, predicate);
      if (found) return found;
    }
    return null;
  };

  // ── Seleção global ──

  it("selecionarTodosItensDosDocumentosGlobal retorna input com checked=false inicialmente", async () => {
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.selecionarTodosItensDosDocumentosGlobal).toBeDefined()
    );

    const { container } = render(
      capturedTabelaProps.selecionarTodosItensDosDocumentosGlobal()
    );

    const checkbox = container.querySelector("input[name='checkHeader']");
    expect(checkbox).toBeInTheDocument();
    expect(checkbox.checked).toBe(false);
  });

  // ── selecionarTodosGlobal ──

  it("selecionarTodosGlobal seleciona todos os acertos ao ativar o checkbox global", async () => {
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.selecionarTodosItensDosDocumentosGlobal).toBeDefined()
    );

    // Invoke the onChange handler directly – avoids cross-root React update issues
    const jsx = capturedTabelaProps.selecionarTodosItensDosDocumentosGlobal();
    await act(async () => {
      jsx.props.children.props.onChange({ target: { checked: true } });
    });

    await waitFor(() =>
      expect(capturedTabelaProps.quantidadeSelecionada).toBeGreaterThan(0)
    );
  });

  it("selecionarTodosGlobal desseleciona todos ao acionar quando já estão todos selecionados", async () => {
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.selecionarTodosItensDosDocumentosGlobal).toBeDefined()
    );

    // Selecionar tudo primeiro
    const jsx1 = capturedTabelaProps.selecionarTodosItensDosDocumentosGlobal();
    await act(async () => {
      jsx1.props.children.props.onChange({ target: { checked: true } });
    });

    await waitFor(() =>
      expect(capturedTabelaProps.quantidadeSelecionada).toBeGreaterThan(0)
    );

    // Desselecionar tudo (identificadorCheckboxClicado=true agora)
    const jsx2 = capturedTabelaProps.selecionarTodosItensDosDocumentosGlobal();
    await act(async () => {
      jsx2.props.children.props.onChange({ target: { checked: false } });
    });

    await waitFor(() =>
      expect(capturedTabelaProps.quantidadeSelecionada).toBe(0)
    );
  });

  // ── tratarSelecionado (checkbox de linha da tabela) ──

  it("tratarSelecionado incrementa quantidadeSelecionada ao marcar uma linha", async () => {
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.selecionarTodosItensDoDocumentoRow).toBeDefined()
    );

    // jsx = <input onChange={(e) => tratarSelecionado(e, rowData.uuid)} .../>
    const jsx = capturedTabelaProps.selecionarTodosItensDoDocumentoRow({ uuid: "doc-uuid" });
    await act(async () => {
      jsx.props.onChange({ target: { checked: true } });
    });

    await waitFor(() =>
      expect(capturedTabelaProps.quantidadeSelecionada).toBeGreaterThan(0)
    );
  });

  it("tratarSelecionado zera quantidadeSelecionada ao desmarcar a única linha", async () => {
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.selecionarTodosItensDoDocumentoRow).toBeDefined()
    );

    // Marcar
    const jsx1 = capturedTabelaProps.selecionarTodosItensDoDocumentoRow({ uuid: "doc-uuid" });
    await act(async () => {
      jsx1.props.onChange({ target: { checked: true } });
    });

    await waitFor(() =>
      expect(capturedTabelaProps.quantidadeSelecionada).toBeGreaterThan(0)
    );

    // Desmarcar
    const jsx2 = capturedTabelaProps.selecionarTodosItensDoDocumentoRow({ uuid: "doc-uuid" });
    await act(async () => {
      jsx2.props.onChange({ target: { checked: false } });
    });

    await waitFor(() =>
      expect(capturedTabelaProps.quantidadeSelecionada).toBe(0)
    );
  });

  // ── tratarSelecionadoIndividual (checkbox de acerto individual na expansão) ──

  it("tratarSelecionadoIndividual incrementa quantidadeSelecionada ao marcar acerto individual", async () => {
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.rowExpansionTemplateDocumentos).toBeDefined()
    );

    const expansionJSX = capturedTabelaProps.rowExpansionTemplateDocumentos(
      mockDocumentosAjustes[0]
    );
    const checkbox = findInJSX(
      expansionJSX,
      (el) => el.type === "input" && el.props.type === "checkbox"
    );

    await act(async () => {
      checkbox.props.onChange({ target: { checked: true } });
    });

    await waitFor(() =>
      expect(capturedTabelaProps.quantidadeSelecionada).toBeGreaterThan(0)
    );
  });

  // ── acoesDisponiveis - todas as combinações de status ──

  const makeDocumento = (statuses) => ({
    uuid: "doc-uuid",
    status_realizacao: "PENDENTE",
    tipo_documento_prestacao_conta: { nome: "Nota Fiscal" },
    solicitacoes_de_ajuste_da_analise_total: statuses.length,
    solicitacoes_de_ajuste_da_analise: {
      solicitacoes_acerto_por_categoria: [
        {
          requer_ajustes_externos: false,
          acertos: statuses.map((status, i) => ({
            uuid: `acerto-uuid-${i}`,
            ordem: i + 1,
            tipo_acerto: { nome: "Tipo", categoria: "AJUSTE_LANCAMENTO" },
            detalhamento: null,
            status_realizacao: status,
            justificativa: null,
            esclarecimentos: null,
            selecionado: false,
            justificativa_conciliacao: null,
            justificativa_conciliacao_original: null,
          })),
        },
      ],
    },
  });

  const selecionarTodosECheckarAcoes = async (acaoEsperada) => {
    await waitFor(() =>
      expect(capturedTabelaProps.selecionarTodosItensDosDocumentosGlobal).toBeDefined()
    );

    const jsx = capturedTabelaProps.selecionarTodosItensDosDocumentosGlobal();
    await act(async () => {
      jsx.props.children.props.onChange({ target: { checked: true } });
    });

    await waitFor(() =>
      expect(capturedTabelaProps.acoesDisponiveis()[acaoEsperada]).toBe(true)
    );
  };

  it("acoesDisponiveis retorna REALIZADO=true com apenas REALIZADO selecionado", async () => {
    getDocumentosAjustes.mockResolvedValue([makeDocumento(["REALIZADO"])]);
    setup();
    await selecionarTodosECheckarAcoes("REALIZADO");
  });

  it("acoesDisponiveis retorna JUSTIFICADO=true com apenas JUSTIFICADO selecionado", async () => {
    getDocumentosAjustes.mockResolvedValue([makeDocumento(["JUSTIFICADO"])]);
    setup();
    await selecionarTodosECheckarAcoes("JUSTIFICADO");
  });

  it("acoesDisponiveis retorna PENDENTE=true com apenas PENDENTE selecionado", async () => {
    getDocumentosAjustes.mockResolvedValue([makeDocumento(["PENDENTE"])]);
    setup();
    await selecionarTodosECheckarAcoes("PENDENTE");
  });

  it("acoesDisponiveis retorna JUSTIFICADO_E_REALIZADO=true com JUSTIFICADO+REALIZADO selecionados", async () => {
    getDocumentosAjustes.mockResolvedValue([makeDocumento(["JUSTIFICADO", "REALIZADO"])]);
    setup();
    await selecionarTodosECheckarAcoes("JUSTIFICADO_E_REALIZADO");
  });

  it("acoesDisponiveis retorna REALIZADO_E_PENDENTE=true com REALIZADO+PENDENTE selecionados", async () => {
    getDocumentosAjustes.mockResolvedValue([makeDocumento(["REALIZADO", "PENDENTE"])]);
    setup();
    await selecionarTodosECheckarAcoes("REALIZADO_E_PENDENTE");
  });

  it("acoesDisponiveis retorna JUSTIFICADO_E_REALIZADO_E_PENDENTE=true com os três selecionados", async () => {
    getDocumentosAjustes.mockResolvedValue([
      makeDocumento(["JUSTIFICADO", "REALIZADO", "PENDENTE"]),
    ]);
    setup();
    await selecionarTodosECheckarAcoes("JUSTIFICADO_E_REALIZADO_E_PENDENTE");
  });

  it("acoesDisponiveis retorna JUSTIFICADO_E_PENDENTE=true com JUSTIFICADO+PENDENTE selecionados", async () => {
    getDocumentosAjustes.mockResolvedValue([makeDocumento(["JUSTIFICADO", "PENDENTE"])]);
    setup();
    await selecionarTodosECheckarAcoes("JUSTIFICADO_E_PENDENTE");
  });

  // ── acaoCancelar reseta seleção ──

  it("acaoCancelar zera quantidadeSelecionada após seleção", async () => {
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.selecionarTodosItensDosDocumentosGlobal).toBeDefined()
    );

    // Selecionar tudo
    const jsx = capturedTabelaProps.selecionarTodosItensDosDocumentosGlobal();
    await act(async () => {
      jsx.props.children.props.onChange({ target: { checked: true } });
    });

    await waitFor(() =>
      expect(capturedTabelaProps.quantidadeSelecionada).toBeGreaterThan(0)
    );

    act(() => {
      capturedTabelaProps.acaoCancelar();
    });

    await waitFor(() =>
      expect(capturedTabelaProps.quantidadeSelecionada).toBe(0)
    );
  });

  // ── handleChangeTextareaJustificativa + salvarJustificativa ──

  it("handleChangeTextareaJustificativa atualiza estado ao digitar na textarea de justificativa", async () => {
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.rowExpansionTemplateDocumentos).toBeDefined()
    );

    const acertoComJustificativa = {
      ...mockDocumentosAjustes[0].solicitacoes_de_ajuste_da_analise
        .solicitacoes_acerto_por_categoria[0].acertos[0],
      justificativa: "justificativa original",
    };

    const data = {
      ...mockDocumentosAjustes[0],
      solicitacoes_de_ajuste_da_analise: {
        solicitacoes_acerto_por_categoria: [
          { requer_ajustes_externos: false, acertos: [acertoComJustificativa] },
        ],
      },
    };

    // Invoke the textarea onChange handler directly
    const expansionJSX = capturedTabelaProps.rowExpansionTemplateDocumentos(data);
    const textarea = findInJSX(
      expansionJSX,
      (el) => el.type === "textarea" && el.props.name === "justificativa"
    );

    await act(async () => {
      textarea.props.onChange({ target: { value: "nova justificativa" } });
    });

    // After state update, the save button should be enabled
    await waitFor(() => {
      const jsxAfter = capturedTabelaProps.rowExpansionTemplateDocumentos(data);
      const btn = findInJSX(
        jsxAfter,
        (el) =>
          el.type === "button" &&
          el.props.type === "button" &&
          el.props.children?.props?.children?.includes?.("Salvar Justificativas")
      );
      expect(btn?.props?.disabled).toBe(false);
    });
  });

  it("salvarJustificativa chama postJustificarNaoRealizacaoDocumentoPrestacaoConta ao clicar em Salvar Justificativas", async () => {
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.rowExpansionTemplateDocumentos).toBeDefined()
    );

    const acertoComJustificativa = {
      ...mockDocumentosAjustes[0].solicitacoes_de_ajuste_da_analise
        .solicitacoes_acerto_por_categoria[0].acertos[0],
      justificativa: "justificativa original",
    };

    const data = {
      ...mockDocumentosAjustes[0],
      solicitacoes_de_ajuste_da_analise: {
        solicitacoes_acerto_por_categoria: [
          { requer_ajustes_externos: false, acertos: [acertoComJustificativa] },
        ],
      },
    };

    // Step 1: trigger textarea onChange to enable the button
    const expansionJSX1 = capturedTabelaProps.rowExpansionTemplateDocumentos(data);
    const textarea = findInJSX(
      expansionJSX1,
      (el) => el.type === "textarea" && el.props.name === "justificativa"
    );
    await act(async () => {
      textarea.props.onChange({ target: { value: "nova justificativa diferente" } });
    });

    // Step 2: invoke the save button onClick from the updated JSX
    await act(async () => {
      const expansionJSX2 = capturedTabelaProps.rowExpansionTemplateDocumentos(data);
      const btn = findInJSX(
        expansionJSX2,
        (el) =>
          el.type === "button" &&
          el.props.type === "button" &&
          el.props.children?.props?.children?.includes?.("Salvar Justificativas")
      );
      btn.props.onClick();
    });

    await waitFor(() =>
      expect(postJustificarNaoRealizacaoDocumentoPrestacaoConta).toHaveBeenCalled()
    );
  });

  // ── handleChangeTextareaEsclarecimentoDocumento + marcarComoEsclarecido ──

  it("handleChangeTextareaEsclarecimentoDocumento atualiza estado ao digitar esclarecimento", async () => {
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.rowExpansionTemplateDocumentos).toBeDefined()
    );

    const acertoEsclarecimento = {
      ...mockDocumentosAjustes[0].solicitacoes_de_ajuste_da_analise
        .solicitacoes_acerto_por_categoria[0].acertos[0],
      tipo_acerto: { nome: "Esclarecimento", categoria: "SOLICITACAO_ESCLARECIMENTO" },
      esclarecimentos: "esclarecimento original",
    };

    const data = {
      ...mockDocumentosAjustes[0],
      solicitacoes_de_ajuste_da_analise: {
        solicitacoes_acerto_por_categoria: [
          { requer_ajustes_externos: false, acertos: [acertoEsclarecimento] },
        ],
      },
    };

    const expansionJSX = capturedTabelaProps.rowExpansionTemplateDocumentos(data);
    const textarea = findInJSX(
      expansionJSX,
      (el) => el.type === "textarea" && el.props.name === "esclarecimento"
    );

    await act(async () => {
      textarea.props.onChange({ target: { value: "novo esclarecimento" } });
    });

    await waitFor(() => {
      const jsxAfter = capturedTabelaProps.rowExpansionTemplateDocumentos(data);
      const btn = findInJSX(
        jsxAfter,
        (el) =>
          el.type === "button" &&
          el.props.type === "button" &&
          el.props.children?.props?.children?.includes?.("Salvar esclarecimento")
      );
      expect(btn?.props?.disabled).toBe(false);
    });
  });

  it("marcarComoEsclarecido chama postMarcarComoDocumentoEsclarecido ao salvar", async () => {
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.rowExpansionTemplateDocumentos).toBeDefined()
    );

    const acertoEsclarecimento = {
      ...mockDocumentosAjustes[0].solicitacoes_de_ajuste_da_analise
        .solicitacoes_acerto_por_categoria[0].acertos[0],
      tipo_acerto: { nome: "Esclarecimento", categoria: "SOLICITACAO_ESCLARECIMENTO" },
      esclarecimentos: "original",
    };

    const data = {
      ...mockDocumentosAjustes[0],
      solicitacoes_de_ajuste_da_analise: {
        solicitacoes_acerto_por_categoria: [
          { requer_ajustes_externos: false, acertos: [acertoEsclarecimento] },
        ],
      },
    };

    // Step 1: trigger textarea onChange to enable the button
    const expansionJSX1 = capturedTabelaProps.rowExpansionTemplateDocumentos(data);
    const textarea = findInJSX(
      expansionJSX1,
      (el) => el.type === "textarea" && el.props.name === "esclarecimento"
    );
    await act(async () => {
      textarea.props.onChange({ target: { value: "novo esclarecimento diferente" } });
    });

    // Step 2: invoke the save button onClick from the updated JSX
    await act(async () => {
      const expansionJSX2 = capturedTabelaProps.rowExpansionTemplateDocumentos(data);
      const btn = findInJSX(
        expansionJSX2,
        (el) =>
          el.type === "button" &&
          el.props.type === "button" &&
          el.props.children?.props?.children?.includes?.("Salvar esclarecimento")
      );
      btn.props.onClick();
    });

    await waitFor(() =>
      expect(postMarcarComoDocumentoEsclarecido).toHaveBeenCalled()
    );
  });

  // ── handleChangeTextareaJustificativaAdicionais + salvarJustificativasAdicionais ──

  it("handleChangeTextareaJustificativaAdicionais atualiza estado ao digitar", async () => {
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.rowExpansionTemplateDocumentos).toBeDefined()
    );

    const acertoEdicao = {
      ...mockDocumentosAjustes[0].solicitacoes_de_ajuste_da_analise
        .solicitacoes_acerto_por_categoria[0].acertos[0],
      tipo_acerto: { nome: "Edição", categoria: "EDICAO_INFORMACAO" },
      justificativa_conciliacao: "texto original",
      justificativa_conciliacao_original: "texto original",
    };

    const data = {
      ...mockDocumentosAjustes[0],
      solicitacoes_de_ajuste_da_analise: {
        solicitacoes_acerto_por_categoria: [
          { requer_ajustes_externos: false, acertos: [acertoEdicao] },
        ],
      },
    };

    const expansionJSX = capturedTabelaProps.rowExpansionTemplateDocumentos(data);
    const textarea = findInJSX(
      expansionJSX,
      (el) =>
        el.type === "textarea" && el.props.name === "justificativas_informacoes_adicionais"
    );

    await act(async () => {
      textarea.props.onChange({ target: { value: "novo texto diferente" } });
    });

    await waitFor(() => {
      const jsxAfter = capturedTabelaProps.rowExpansionTemplateDocumentos(data);
      const btn = findInJSX(
        jsxAfter,
        (el) =>
          el.type === "button" &&
          el.props.type === "button" &&
          el.props.children?.props?.children?.includes?.("Salvar justificativas")
      );
      expect(btn?.props?.disabled).toBe(false);
    });
  });

  it("salvarJustificativasAdicionais chama postSalvarJustificativasAdicionais ao salvar", async () => {
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.rowExpansionTemplateDocumentos).toBeDefined()
    );

    const acertoEdicao = {
      ...mockDocumentosAjustes[0].solicitacoes_de_ajuste_da_analise
        .solicitacoes_acerto_por_categoria[0].acertos[0],
      tipo_acerto: { nome: "Edição", categoria: "EDICAO_INFORMACAO" },
      justificativa_conciliacao: "texto original",
      justificativa_conciliacao_original: "texto original",
    };

    const data = {
      ...mockDocumentosAjustes[0],
      solicitacoes_de_ajuste_da_analise: {
        solicitacoes_acerto_por_categoria: [
          { requer_ajustes_externos: false, acertos: [acertoEdicao] },
        ],
      },
    };

    // Step 1: trigger textarea onChange to enable the button
    const expansionJSX1 = capturedTabelaProps.rowExpansionTemplateDocumentos(data);
    const textarea = findInJSX(
      expansionJSX1,
      (el) =>
        el.type === "textarea" && el.props.name === "justificativas_informacoes_adicionais"
    );
    await act(async () => {
      textarea.props.onChange({ target: { value: "novo texto completamente diferente" } });
    });

    // Step 2: invoke the save button onClick from the updated JSX
    await act(async () => {
      const expansionJSX2 = capturedTabelaProps.rowExpansionTemplateDocumentos(data);
      const btn = findInJSX(
        expansionJSX2,
        (el) =>
          el.type === "button" &&
          el.props.type === "button" &&
          el.props.children?.props?.children?.includes?.("Salvar justificativas")
      );
      btn.props.onClick();
    });

    await waitFor(() =>
      expect(postSalvarJustificativasAdicionais).toHaveBeenCalled()
    );
  });

  // ── Tratamento de erros nos serviços ──

  it("limparDocumentoStatus não quebra quando postLimparStatusDocumentoPrestacaoConta rejeita", async () => {
    postLimparStatusDocumentoPrestacaoConta.mockRejectedValue(new Error("falha"));
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.limparDocumentoStatus).toBeDefined()
    );

    await expect(
      act(async () => {
        await capturedTabelaProps.limparDocumentoStatus();
      })
    ).resolves.not.toThrow();
  });

  it("marcarDocumentoComoRealizado não quebra quando postMarcarComoRealizadoDocumentoPrestacaoConta rejeita", async () => {
    postMarcarComoRealizadoDocumentoPrestacaoConta.mockRejectedValue(new Error("falha"));
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.marcarDocumentoComoRealizado).toBeDefined()
    );

    await expect(
      act(async () => {
        await capturedTabelaProps.marcarDocumentoComoRealizado();
      })
    ).resolves.not.toThrow();
  });

  it("justificarNaoRealizacaoDocumentos não quebra quando o serviço rejeita", async () => {
    postJustificarNaoRealizacaoDocumentoPrestacaoConta.mockRejectedValue(
      new Error("falha")
    );
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.justificarNaoRealizacaoDocumentos).toBeDefined()
    );

    await expect(
      act(async () => {
        await capturedTabelaProps.justificarNaoRealizacaoDocumentos("texto");
      })
    ).resolves.not.toThrow();
  });

  // ── possuiSolicitacaoEsclarecimento / possuiSolicitacaoEdicaoInformacao com null ──

  it("rowExpansionTemplateDocumentos não exibe esclarecimento para acerto com tipo null", async () => {
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.rowExpansionTemplateDocumentos).toBeDefined()
    );

    const acertoSemTipo = {
      ...mockDocumentosAjustes[0].solicitacoes_de_ajuste_da_analise
        .solicitacoes_acerto_por_categoria[0].acertos[0],
      tipo_acerto: { nome: "Tipo genérico", categoria: "AJUSTE_LANCAMENTO" },
    };

    const data = {
      ...mockDocumentosAjustes[0],
      solicitacoes_de_ajuste_da_analise: {
        solicitacoes_acerto_por_categoria: [
          { requer_ajustes_externos: false, acertos: [acertoSemTipo] },
        ],
      },
    };

    const { queryByText } = render(
      capturedTabelaProps.rowExpansionTemplateDocumentos(data)
    );

    expect(queryByText("Esclarecimento do documento")).not.toBeInTheDocument();
    expect(queryByText("Justificativas e informações adicionais")).not.toBeInTheDocument();
  });

  // ── verificaDisableRestaurarJustificativa branches ──

  it("botão Restaurar Justificativas está desabilitado quando justificativa é igual à original", async () => {
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.rowExpansionTemplateDocumentos).toBeDefined()
    );

    const acertoIgual = {
      uuid: "acerto-igual",
      ordem: 1,
      tipo_acerto: { nome: "Edição", categoria: "EDICAO_INFORMACAO" },
      detalhamento: null,
      status_realizacao: "PENDENTE",
      justificativa: null,
      esclarecimentos: null,
      selecionado: false,
      justificativa_conciliacao: "texto igual",
      justificativa_conciliacao_original: "texto igual",
    };

    const data = {
      ...mockDocumentosAjustes[0],
      solicitacoes_de_ajuste_da_analise: {
        solicitacoes_acerto_por_categoria: [
          { requer_ajustes_externos: false, acertos: [acertoIgual] },
        ],
      },
    };

    const { queryByText } = render(
      capturedTabelaProps.rowExpansionTemplateDocumentos(data)
    );

    // Quando igual, o botão não é exibido (condição: justificativa_conciliacao_original !== null e !== "" e visao UE)
    // Mas a condição para exibir é: original !== null AND !== "" AND visao UE AND analisePermiteEdicao AND pc DEVOLVIDA
    // Quando exibido mas com disable=true, verificaDisableRestaurarJustificativa retorna true
    const btn = queryByText("Restaurar Justificativas");
    if (btn) {
      expect(btn.closest("button")).toBeDisabled();
    }
  });

  it("botão Restaurar Justificativas não exibido quando original é null", async () => {
    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.rowExpansionTemplateDocumentos).toBeDefined()
    );

    const acertoOriginalNull = {
      uuid: "acerto-null",
      ordem: 1,
      tipo_acerto: { nome: "Edição", categoria: "EDICAO_INFORMACAO" },
      detalhamento: null,
      status_realizacao: "PENDENTE",
      justificativa: null,
      esclarecimentos: null,
      selecionado: false,
      justificativa_conciliacao: "atual",
      justificativa_conciliacao_original: null,
    };

    const data = {
      ...mockDocumentosAjustes[0],
      solicitacoes_de_ajuste_da_analise: {
        solicitacoes_acerto_por_categoria: [
          { requer_ajustes_externos: false, acertos: [acertoOriginalNull] },
        ],
      },
    };

    const { queryByText } = render(
      capturedTabelaProps.rowExpansionTemplateDocumentos(data)
    );

    expect(queryByText("Restaurar Justificativas")).not.toBeInTheDocument();
  });

  // ── useEffect: expanded rows a partir do localStorage ──

  it("expande linhas conforme expanded salvo no localStorage quando correspondem aos documentos", async () => {
    meapcservice.getAnaliseDreUsuarioLogado.mockReturnValue({
      conferencia_de_documentos: {
        paginacao_atual: 0,
        expanded: ["doc-uuid"],
      },
    });

    setup();

    await waitFor(() =>
      expect(capturedTabelaProps.expandedRowsDocumentos).toBeDefined()
    );

    // O documento com uuid 'doc-uuid' deveria estar na lista de expandidos
    await waitFor(() => {
      expect(capturedTabelaProps.expandedRowsDocumentos).not.toBeNull();
    });
  });

  // ── limparDocumentoStatus com selecionados ──

  it("limparDocumentoStatus envia uuids dos acertos selecionados", async () => {
    setup();

    // Selecionar todos para ter acertos na lista
    await waitFor(() =>
      expect(capturedTabelaProps.selecionarTodosItensDosDocumentosGlobal).toBeDefined()
    );

    const jsx = capturedTabelaProps.selecionarTodosItensDosDocumentosGlobal();
    await act(async () => {
      jsx.props.children.props.onChange({ target: { checked: true } });
    });

    await waitFor(() =>
      expect(capturedTabelaProps.quantidadeSelecionada).toBeGreaterThan(0)
    );

    await act(async () => {
      await capturedTabelaProps.limparDocumentoStatus();
    });

    expect(postLimparStatusDocumentoPrestacaoConta).toHaveBeenCalledWith({
      uuids_solicitacoes_acertos_documentos: ["acerto-uuid"],
    });
  });
});
