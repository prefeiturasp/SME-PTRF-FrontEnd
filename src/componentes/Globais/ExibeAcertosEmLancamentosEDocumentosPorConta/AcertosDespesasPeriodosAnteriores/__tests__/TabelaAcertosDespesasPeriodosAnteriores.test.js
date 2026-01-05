import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";

import { TabelaAcertosDespesasPeriodosAnteriores } from "../TabelaAcertosDespesasPeriodosAnteriores";
import { mantemEstadoAnaliseDre } from "../../../../../services/mantemEstadoAnaliseDre.service";

jest.mock("primereact/datatable", () => ({
  DataTable: ({ children }) => <div>{children}</div>,
}));

jest.mock("primereact/column", () => ({
  Column: ({ header }) => (
    <div>{typeof header === "function" ? header() : header}</div>
  ),
}));

jest.mock("../../../../../services/visoes.service", () => ({
  visoesService: {
    getUsuarioLogin: jest.fn(() => "usuario"),
    getItemUsuarioLogado: jest.fn(() => "UE"),
    getPermissoes: jest.fn(() => true),
  },
}));

jest.mock("../../../../../services/mantemEstadoAnaliseDre.service", () => ({
  mantemEstadoAnaliseDre: {
    getAnaliseDreUsuarioLogado: jest.fn(),
    setAnaliseDrePorUsuario: jest.fn(),
  },
}));

jest.mock(
  "../../../../dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ConferenciaDeLancamentos/Modais/ModalCheckNaoPermitidoConfererenciaDeLancamentos",
  () => ({
    ModalCheckNaoPermitidoConfererenciaDeLancamentos: ({ show, titulo }) =>
      show ? <div>{titulo}</div> : null,
  })
);

jest.mock(
  "../../../../dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ConferenciaDeLancamentos/Modais/ModalJustificarNaoRealizacao",
  () => ({
    ModalJustificarNaoRealizacao: ({ show, titulo, segundoBotaoOnclick }) =>
      show ? (
        <div>
          <span>{titulo}</span>
          <button onClick={segundoBotaoOnclick}>Confirmar</button>
        </div>
      ) : null,
  })
);

jest.mock(
  "../../../../dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ConferenciaDeLancamentos/Modais/ModalJustificadaApagada",
  () => ({
    ModalJustificadaApagada: ({ show, primeiroBotaoOnclick }) =>
      show ? (
        <button onClick={primeiroBotaoOnclick}>Confirmar apagar</button>
      ) : null,
  })
);

const mockAnaliseDre = {
  conferencia_de_despesas_periodos_anteriores: {
    paginacao_atual: 0,
    expanded: [],
  },
};

const lancamentosMock = [
  {
    id: 1,
    descricao: "Despesa teste",
    tipo_transacao: "Gasto",
    conferido: true,
    analise_lancamento: { status_realizacao: "PENDENTE" },
    conferencia_de_despesas_periodos_anteriores: {
      status_realizacao: "PENDENTE",
    },
  },
];

const opcoesJustificativaMock = {
  status_realizacao: [{ id: "PENDENTE", nome: "Pendente" }],
};

const setup = (override = {}) => {
  const props = {
    lancamentosAjustes: lancamentosMock,
    limparStatus: jest.fn(),
    marcarComoRealizado: jest.fn(),
    justificarNaoRealizacao: jest.fn(),
    prestacaoDeContas: { status: "DEVOLVIDA" },
    opcoesJustificativa: opcoesJustificativaMock,
    setExpandedRowsLancamentos: jest.fn(),
    expandedRowsLancamentos: [],
    rowExpansionTemplateLancamentos: jest.fn(),
    rowsPerPageAcertosLancamentos: 10,
    dataTemplate: jest.fn(),
    numeroDocumentoTemplate: jest.fn(),
    valor_template: jest.fn(),
    selecionarTodosItensDosLancamentosGlobal: jest.fn(() => "Selecionar"),
    selecionarTodosItensDoLancamentoRow: jest.fn(() => <input />),
    tituloModalCheckNaoPermitido: "Atenção",
    textoModalCheckNaoPermitido: "Texto",
    showModalCheckNaoPermitido: false,
    setShowModalCheckNaoPermitido: jest.fn(),
    totalDeAcertosDosLancamentos: 1,
    analisePermiteEdicao: true,
    quantidadeSelecionada: 0,
    acoesDisponiveis: jest.fn(() => ({ PENDENTE: true })),
    acaoCancelar: jest.fn(),
    ...override,
  };

  return render(<TabelaAcertosDespesasPeriodosAnteriores {...props} />);
};

beforeEach(() => {
  mantemEstadoAnaliseDre.getAnaliseDreUsuarioLogado.mockReturnValue(
    mockAnaliseDre
  );
});

describe("TabelaAcertosDespesasPeriodosAnteriores", () => {
  it("renderiza estrutura da tabela", () => {
    setup();

    expect(screen.getByText("Descrição")).toBeInTheDocument();
    expect(screen.getByText("Valor (R$)")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("exibe mensagem quando não há lançamentos", () => {
    setup({ lancamentosAjustes: [] });

    expect(
      screen.getByText(
        "Não foram solicitados acertos nas despesas de períodos anteriores nessa análise da PC."
      )
    ).toBeInTheDocument();
  });

  it("exibe ações quando há seleção", () => {
    setup({ quantidadeSelecionada: 1 });

    expect(
      screen.getByText((content) => content.includes("lançamento selecionado"))
    ).toBeInTheDocument();
  });

  it("abre modal de justificar não realização", () => {
    setup({
      quantidadeSelecionada: 1,
      acoesDisponiveis: jest.fn(() => ({ REALIZADO_E_PENDENTE: true })),
    });

    const justificarBtn = screen
      .getByText(/Justificar não realização/i)
      .closest("button");

    expect(justificarBtn).toBeInTheDocument();

    fireEvent.click(justificarBtn);

    expect(
      screen.getAllByText(/Justificar não realização/i).length
    ).toBeGreaterThan(1);

    expect(
      screen.getByRole("button", { name: /Confirmar/i })
    ).toBeInTheDocument();
  });

  it("chama justificarNaoRealizacao ao confirmar", () => {
    const justificarNaoRealizacao = jest.fn();

    setup({
      quantidadeSelecionada: 1,
      justificarNaoRealizacao,
    });

    fireEvent.click(screen.getByText("Justificar não realização"));
    fireEvent.click(screen.getByText("Confirmar"));

    expect(justificarNaoRealizacao).toHaveBeenCalled();
  });

  it("chama limparStatus ao confirmar apagar", () => {
    const limparStatus = jest.fn();

    setup({
      quantidadeSelecionada: 1,
      limparStatus,
      acoesDisponiveis: jest.fn(() => ({ JUSTIFICADO: true })),
    });

    fireEvent.click(screen.getByText("Limpar Status"));
    fireEvent.click(screen.getByText("Confirmar apagar"));

    expect(limparStatus).toHaveBeenCalled();
  });
});
