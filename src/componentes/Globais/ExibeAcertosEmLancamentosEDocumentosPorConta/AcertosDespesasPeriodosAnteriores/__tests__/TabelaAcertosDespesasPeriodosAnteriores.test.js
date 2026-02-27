import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";

import { TabelaAcertosDespesasPeriodosAnteriores } from "../TabelaAcertosDespesasPeriodosAnteriores";
import { mantemEstadoAnaliseDre } from "../../../../../services/mantemEstadoAnaliseDre.service";
import { visoesService } from "../../../../../services/visoes.service";

let mockCapturedColumnProps = [];
let mockCapturedDataTableOnPage = null;

jest.mock("primereact/datatable", () => ({
  DataTable: ({ children, onPage }) => {
    mockCapturedDataTableOnPage = onPage;
    return <div>{children}</div>;
  },
}));

jest.mock("primereact/column", () => ({
  Column: (props) => {
    mockCapturedColumnProps.push(props);
    const { header } = props;
    return <div>{typeof header === "function" ? header() : header}</div>;
  },
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
      show ? (
        <div data-testid="modal-check-nao-permitido">{titulo}</div>
      ) : null,
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
  status_realizacao: [
    { id: "PENDENTE", nome: "Pendente" },
    { id: "REALIZADO", nome: "Realizado" },
    { id: "JUSTIFICADO", nome: "Justificado" },
  ],
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
  visoesService.getItemUsuarioLogado.mockReturnValue("UE");
  visoesService.getPermissoes.mockReturnValue(true);
  mockCapturedColumnProps = [];
  mockCapturedDataTableOnPage = null;
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

  it("exibe mensagem de contagem quando há lançamentos e nenhum está selecionado", () => {
    setup({ quantidadeSelecionada: 0, totalDeAcertosDosLancamentos: 3 });

    expect(
      screen.getByText(/gastos de períodos anteriores pendentes de conciliação/)
    ).toBeInTheDocument();
  });

  it("exibe ações quando há seleção", () => {
    setup({ quantidadeSelecionada: 1 });

    expect(
      screen.getByText((content) => content.includes("lançamento selecionado"))
    ).toBeInTheDocument();
  });

  it("exibe 'lançamentos selecionados' no plural quando quantidadeSelecionada > 1", () => {
    setup({ quantidadeSelecionada: 2 });

    expect(
      screen.getByText((content) =>
        content.includes("lançamentos selecionados")
      )
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

  // --- JUSTIFICADO_E_REALIZADO ---

  it("JUSTIFICADO_E_REALIZADO: chama acaoCancelar ao clicar em Cancelar", () => {
    const acaoCancelar = jest.fn();

    setup({
      quantidadeSelecionada: 1,
      acaoCancelar,
      acoesDisponiveis: jest.fn(() => ({ JUSTIFICADO_E_REALIZADO: true })),
    });

    fireEvent.click(screen.getByText("Cancelar").closest("button"));

    expect(acaoCancelar).toHaveBeenCalled();
  });

  it("JUSTIFICADO_E_REALIZADO: Limpar Status abre ModalJustificadaApagada e confirmar chama limparStatus", () => {
    const limparStatus = jest.fn();

    setup({
      quantidadeSelecionada: 1,
      limparStatus,
      acoesDisponiveis: jest.fn(() => ({ JUSTIFICADO_E_REALIZADO: true })),
    });

    fireEvent.click(screen.getByText("Limpar Status").closest("button"));
    expect(screen.getByText("Confirmar apagar")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Confirmar apagar"));

    expect(limparStatus).toHaveBeenCalled();
  });

  // --- REALIZADO_E_PENDENTE ---

  it("REALIZADO_E_PENDENTE: chama acaoCancelar ao clicar em Cancelar", () => {
    const acaoCancelar = jest.fn();

    setup({
      quantidadeSelecionada: 1,
      acaoCancelar,
      acoesDisponiveis: jest.fn(() => ({ REALIZADO_E_PENDENTE: true })),
    });

    fireEvent.click(screen.getByText("Cancelar").closest("button"));

    expect(acaoCancelar).toHaveBeenCalled();
  });

  it("REALIZADO_E_PENDENTE: Limpar Status chama limparStatus diretamente sem abrir modal", () => {
    const limparStatus = jest.fn();

    setup({
      quantidadeSelecionada: 1,
      limparStatus,
      acoesDisponiveis: jest.fn(() => ({ REALIZADO_E_PENDENTE: true })),
    });

    fireEvent.click(screen.getByText("Limpar Status").closest("button"));

    expect(limparStatus).toHaveBeenCalled();
    expect(screen.queryByText("Confirmar apagar")).not.toBeInTheDocument();
  });

  // --- JUSTIFICADO_E_REALIZADO_E_PENDENTE ---

  it("JUSTIFICADO_E_REALIZADO_E_PENDENTE: chama acaoCancelar ao clicar em Cancelar", () => {
    const acaoCancelar = jest.fn();

    setup({
      quantidadeSelecionada: 1,
      acaoCancelar,
      acoesDisponiveis: jest.fn(() => ({
        JUSTIFICADO_E_REALIZADO_E_PENDENTE: true,
      })),
    });

    fireEvent.click(screen.getByText("Cancelar").closest("button"));

    expect(acaoCancelar).toHaveBeenCalled();
  });

  it("JUSTIFICADO_E_REALIZADO_E_PENDENTE: Limpar Status abre modal e confirmar chama limparStatus", () => {
    const limparStatus = jest.fn();

    setup({
      quantidadeSelecionada: 1,
      limparStatus,
      acoesDisponiveis: jest.fn(() => ({
        JUSTIFICADO_E_REALIZADO_E_PENDENTE: true,
      })),
    });

    fireEvent.click(screen.getByText("Limpar Status").closest("button"));
    fireEvent.click(screen.getByText("Confirmar apagar"));

    expect(limparStatus).toHaveBeenCalled();
  });

  // --- JUSTIFICADO_E_PENDENTE ---

  it("JUSTIFICADO_E_PENDENTE: chama acaoCancelar ao clicar em Cancelar", () => {
    const acaoCancelar = jest.fn();

    setup({
      quantidadeSelecionada: 1,
      acaoCancelar,
      acoesDisponiveis: jest.fn(() => ({ JUSTIFICADO_E_PENDENTE: true })),
    });

    fireEvent.click(screen.getByText("Cancelar").closest("button"));

    expect(acaoCancelar).toHaveBeenCalled();
  });

  it("JUSTIFICADO_E_PENDENTE: Limpar Status abre modal e confirmar chama limparStatus", () => {
    const limparStatus = jest.fn();

    setup({
      quantidadeSelecionada: 1,
      limparStatus,
      acoesDisponiveis: jest.fn(() => ({ JUSTIFICADO_E_PENDENTE: true })),
    });

    fireEvent.click(screen.getByText("Limpar Status").closest("button"));
    fireEvent.click(screen.getByText("Confirmar apagar"));

    expect(limparStatus).toHaveBeenCalled();
  });

  it("JUSTIFICADO_E_PENDENTE: Marcar como realizado abre modal e confirmar chama marcarComoRealizado", () => {
    const marcarComoRealizado = jest.fn();

    setup({
      quantidadeSelecionada: 1,
      marcarComoRealizado,
      acoesDisponiveis: jest.fn(() => ({ JUSTIFICADO_E_PENDENTE: true })),
    });

    fireEvent.click(
      screen.getByText("Marcar como realizado").closest("button")
    );
    fireEvent.click(screen.getByText("Confirmar apagar"));

    expect(marcarComoRealizado).toHaveBeenCalled();
  });

  // --- REALIZADO ---

  it("REALIZADO: chama acaoCancelar ao clicar em Cancelar", () => {
    const acaoCancelar = jest.fn();

    setup({
      quantidadeSelecionada: 1,
      acaoCancelar,
      acoesDisponiveis: jest.fn(() => ({ REALIZADO: true })),
    });

    fireEvent.click(screen.getByText("Cancelar").closest("button"));

    expect(acaoCancelar).toHaveBeenCalled();
  });

  it("REALIZADO: Limpar Status chama limparStatus diretamente sem abrir modal", () => {
    const limparStatus = jest.fn();

    setup({
      quantidadeSelecionada: 1,
      limparStatus,
      acoesDisponiveis: jest.fn(() => ({ REALIZADO: true })),
    });

    fireEvent.click(screen.getByText("Limpar Status").closest("button"));

    expect(limparStatus).toHaveBeenCalled();
    expect(screen.queryByText("Confirmar apagar")).not.toBeInTheDocument();
  });

  it("REALIZADO: Justificar não realização abre ModalJustificarNaoRealizacao", () => {
    setup({
      quantidadeSelecionada: 1,
      acoesDisponiveis: jest.fn(() => ({ REALIZADO: true })),
    });

    fireEvent.click(
      screen.getByText("Justificar não realização").closest("button")
    );

    expect(
      screen.getAllByText(/Justificar não realização/i).length
    ).toBeGreaterThan(1);
    expect(screen.getByRole("button", { name: /Confirmar/i })).toBeInTheDocument();
  });

  // --- JUSTIFICADO ---

  it("JUSTIFICADO: chama acaoCancelar ao clicar em Cancelar", () => {
    const acaoCancelar = jest.fn();

    setup({
      quantidadeSelecionada: 1,
      acaoCancelar,
      acoesDisponiveis: jest.fn(() => ({ JUSTIFICADO: true })),
    });

    fireEvent.click(screen.getByText("Cancelar").closest("button"));

    expect(acaoCancelar).toHaveBeenCalled();
  });

  it("JUSTIFICADO: Marcar como realizado abre modal e confirmar chama marcarComoRealizado", () => {
    const marcarComoRealizado = jest.fn();

    setup({
      quantidadeSelecionada: 1,
      marcarComoRealizado,
      acoesDisponiveis: jest.fn(() => ({ JUSTIFICADO: true })),
    });

    fireEvent.click(
      screen.getByText("Marcar como realizado").closest("button")
    );
    fireEvent.click(screen.getByText("Confirmar apagar"));

    expect(marcarComoRealizado).toHaveBeenCalled();
  });

  // --- PENDENTE ---

  it("PENDENTE: chama acaoCancelar ao clicar em Cancelar", () => {
    const acaoCancelar = jest.fn();

    setup({
      quantidadeSelecionada: 1,
      acaoCancelar,
      acoesDisponiveis: jest.fn(() => ({ PENDENTE: true })),
    });

    fireEvent.click(screen.getByText("Cancelar").closest("button"));

    expect(acaoCancelar).toHaveBeenCalled();
  });

  it("PENDENTE: Marcar como realizado chama marcarComoRealizado diretamente sem abrir modal", () => {
    const marcarComoRealizado = jest.fn();

    setup({
      quantidadeSelecionada: 1,
      marcarComoRealizado,
      acoesDisponiveis: jest.fn(() => ({ PENDENTE: true })),
    });

    fireEvent.click(
      screen.getByText("Marcar como realizado").closest("button")
    );

    expect(marcarComoRealizado).toHaveBeenCalled();
    expect(screen.queryByText("Confirmar apagar")).not.toBeInTheDocument();
  });

  it("PENDENTE: Justificar não realização abre ModalJustificarNaoRealizacao", () => {
    setup({
      quantidadeSelecionada: 1,
      acoesDisponiveis: jest.fn(() => ({ PENDENTE: true })),
    });

    fireEvent.click(
      screen.getByText("Justificar não realização").closest("button")
    );

    expect(
      screen.getAllByText(/Justificar não realização/i).length
    ).toBeGreaterThan(1);
  });

  // --- ModalCheckNaoPermitido ---

  it("exibe ModalCheckNaoPermitido quando showModalCheckNaoPermitido é true", () => {
    setup({
      showModalCheckNaoPermitido: true,
      tituloModalCheckNaoPermitido: "Título da modal de verificação",
    });

    expect(
      screen.getByTestId("modal-check-nao-permitido")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Título da modal de verificação")
    ).toBeInTheDocument();
  });

  it("não exibe ModalCheckNaoPermitido quando showModalCheckNaoPermitido é false", () => {
    setup({ showModalCheckNaoPermitido: false });

    expect(
      screen.queryByTestId("modal-check-nao-permitido")
    ).not.toBeInTheDocument();
  });

  // --- tagJustificativa (via mockCapturedColumnProps) ---

  it("tagJustificativa renderiza '-' quando status é PENDENTE", () => {
    setup();

    const statusCol = mockCapturedColumnProps.find((p) => p.header === "Status");
    const { container } = render(
      statusCol.body({ analise_lancamento: { status_realizacao: "PENDENTE" } })
    );

    expect(container.querySelector(".tag-justificativa")).toBeInTheDocument();
    expect(container.querySelector(".tag-justificativa").textContent).toBe("-");
  });

  it("tagJustificativa renderiza nome do status para REALIZADO", () => {
    setup();

    const statusCol = mockCapturedColumnProps.find((p) => p.header === "Status");
    const { container } = render(
      statusCol.body({ analise_lancamento: { status_realizacao: "REALIZADO" } })
    );

    expect(
      container.querySelector(".tag-justificativa").textContent
    ).toBe("Realizado");
  });

  it("tagJustificativa renderiza nome do status para JUSTIFICADO", () => {
    setup();

    const statusCol = mockCapturedColumnProps.find((p) => p.header === "Status");
    const { container } = render(
      statusCol.body({
        analise_lancamento: { status_realizacao: "JUSTIFICADO" },
      })
    );

    expect(
      container.querySelector(".tag-justificativa").textContent
    ).toBe("Justificado");
  });

  it("tagJustificativa renderiza '-' quando statusId é undefined", () => {
    setup();

    const statusCol = mockCapturedColumnProps.find((p) => p.header === "Status");
    const { container } = render(
      statusCol.body({ analise_lancamento: { status_realizacao: undefined } })
    );

    expect(
      container.querySelector(".tag-justificativa").textContent
    ).toBe("-");
  });

  // --- demonstradoTemplate (via mockCapturedColumnProps) ---

  it("demonstradoTemplate renderiza checkbox para tipo_transacao Gasto", () => {
    setup();

    const demonstradoCol = mockCapturedColumnProps.find(
      (p) => p.header === "Demonstrado"
    );
    const { container } = render(
      demonstradoCol.body({ tipo_transacao: "Gasto", conferido: true })
    );

    const checkbox = container.querySelector(
      "input[type='checkbox'][name='acerto_lancamento_demonstrado']"
    );
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toBeChecked();
    expect(checkbox).toBeDisabled();
  });

  it("demonstradoTemplate renderiza '-' para tipos de transação que não são Gasto", () => {
    setup();

    const demonstradoCol = mockCapturedColumnProps.find(
      (p) => p.header === "Demonstrado"
    );
    const { container } = render(
      demonstradoCol.body({ tipo_transacao: "Receita", conferido: false })
    );

    expect(container.textContent).toBe("-");
    expect(container.querySelector("input")).not.toBeInTheDocument();
  });

  // --- onPaginationClick / salvaEstadoPaginacaoLancamentosLocalStorage ---

  it("salva estado de paginação ao mudar de página via onPage do DataTable", () => {
    setup();

    act(() => {
      mockCapturedDataTableOnPage({ first: 10, rows: 10, page: 1 });
    });

    expect(mantemEstadoAnaliseDre.setAnaliseDrePorUsuario).toHaveBeenCalled();
  });

  // --- Coluna de seleção condicional ---

  it("não chama selecionarTodosItensDosLancamentosGlobal quando analisePermiteEdicao é false", () => {
    const selecionarTodosItensDosLancamentosGlobal = jest.fn(() => "Selecionar");

    setup({
      analisePermiteEdicao: false,
      selecionarTodosItensDosLancamentosGlobal,
    });

    expect(selecionarTodosItensDosLancamentosGlobal).not.toHaveBeenCalled();
  });

  it("não chama selecionarTodosItensDosLancamentosGlobal quando status da PC não é DEVOLVIDA", () => {
    const selecionarTodosItensDosLancamentosGlobal = jest.fn(() => "Selecionar");

    setup({
      prestacaoDeContas: { status: "APROVADA" },
      selecionarTodosItensDosLancamentosGlobal,
    });

    expect(selecionarTodosItensDosLancamentosGlobal).not.toHaveBeenCalled();
  });

  it("renderiza coluna de seleção quando todas as condições são atendidas", () => {
    setup({
      analisePermiteEdicao: true,
      prestacaoDeContas: { status: "DEVOLVIDA" },
      selecionarTodosItensDosLancamentosGlobal: jest.fn(() => "Selecionar"),
    });

    expect(screen.getByText("Selecionar")).toBeInTheDocument();
  });
});
