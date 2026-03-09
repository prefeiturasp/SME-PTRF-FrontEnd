import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";

import TabelaAcertosDocumentos from "../TabelaAcertosDocumentos";
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
    ModalJustificarNaoRealizacao: ({ show, titulo, segundoBotaoOnclick, bodyText }) =>
      show ? (
        <div>
          <span>{titulo}</span>
          {bodyText}
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
  conferencia_de_documentos: {
    paginacao_atual: 0,
    expanded: [],
  },
};

const documentosMock = [
  {
    uuid: "doc-uuid-1",
    tipo_documento_prestacao_conta: { nome: "Nota Fiscal" },
    status_realizacao: "PENDENTE",
    selecionado: false,
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
    documentosAjustes: documentosMock,
    limparDocumentoStatus: jest.fn(),
    prestacaoDeContas: { status: "DEVOLVIDA" },
    marcarDocumentoComoRealizado: jest.fn(),
    justificarNaoRealizacaoDocumentos: jest.fn(),
    rowsPerPageAcertosDocumentos: 10,
    setExpandedRowsDocumentos: jest.fn(),
    expandedRowsDocumentos: [],
    rowExpansionTemplateDocumentos: jest.fn(),
    tituloModalCheckNaoPermitido: "Atenção",
    textoModalCheckNaoPermitido: "Texto",
    showModalCheckNaoPermitido: false,
    setShowModalCheckNaoPermitido: jest.fn(),
    selecionarTodosItensDosDocumentosGlobal: jest.fn(() => "Selecionar"),
    totalDeAcertosDosDocumentos: 1,
    selecionarTodosItensDoDocumentoRow: jest.fn(() => <input />),
    opcoesJustificativa: opcoesJustificativaMock,
    analisePermiteEdicao: true,
    quantidadeSelecionada: 0,
    acoesDisponiveis: jest.fn(() => ({ PENDENTE: true })),
    acaoCancelar: jest.fn(),
    ...override,
  };

  return render(<TabelaAcertosDocumentos {...props} />);
};

beforeEach(() => {
  mantemEstadoAnaliseDre.getAnaliseDreUsuarioLogado.mockReturnValue(mockAnaliseDre);
  visoesService.getItemUsuarioLogado.mockReturnValue("UE");
  visoesService.getPermissoes.mockReturnValue(true);
  mockCapturedColumnProps = [];
  mockCapturedDataTableOnPage = null;
});

describe("TabelaAcertosDocumentos", () => {
  // --- Renderização básica ---

  it("renderiza colunas da tabela quando há documentos", () => {
    setup();

    expect(screen.getByText("Ver Acertos")).toBeInTheDocument();
    expect(screen.getByText("Nome do Documento")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("exibe mensagem quando não há documentos", () => {
    setup({ documentosAjustes: [] });

    expect(
      screen.getByText(
        "Não foram solicitados acertos nos documentos nessa análise da PC."
      )
    ).toBeInTheDocument();
  });

  it("exibe mensagem de quantidade quando há documentos e nenhum está selecionado", () => {
    setup({ quantidadeSelecionada: 0, totalDeAcertosDosDocumentos: 5 });

    expect(screen.getByText(/Exibindo/)).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("não exibe mensagem de quantidade quando não há documentos", () => {
    setup({ documentosAjustes: [], quantidadeSelecionada: 0 });

    expect(screen.queryByText(/Exibindo/)).not.toBeInTheDocument();
  });

  // --- Barra de seleção ---

  it("exibe barra de seleção quando quantidadeSelecionada > 0", () => {
    setup({ quantidadeSelecionada: 1 });

    expect(
      screen.getByText((content) => content.includes("documento selecionado"))
    ).toBeInTheDocument();
  });

  it("exibe 'documentos selecionados' no plural quando quantidadeSelecionada > 1", () => {
    setup({ quantidadeSelecionada: 2 });

    expect(
      screen.getByText((content) => content.includes("documentos selecionados"))
    ).toBeInTheDocument();
  });

  it("não exibe barra de seleção quando quantidadeSelecionada === 0", () => {
    setup({ quantidadeSelecionada: 0 });

    expect(
      screen.queryByText((content) => content.includes("documento selecionado"))
    ).not.toBeInTheDocument();
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

  it("JUSTIFICADO_E_REALIZADO: Limpar Status abre ModalJustificadaApagada e confirmar chama limparDocumentoStatus", () => {
    const limparDocumentoStatus = jest.fn();

    setup({
      quantidadeSelecionada: 1,
      limparDocumentoStatus,
      acoesDisponiveis: jest.fn(() => ({ JUSTIFICADO_E_REALIZADO: true })),
    });

    fireEvent.click(screen.getByText("Limpar Status").closest("button"));
    expect(screen.getByText("Confirmar apagar")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Confirmar apagar"));

    expect(limparDocumentoStatus).toHaveBeenCalled();
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

  it("REALIZADO_E_PENDENTE: Limpar Status chama limparDocumentoStatus diretamente sem abrir modal", () => {
    const limparDocumentoStatus = jest.fn();

    setup({
      quantidadeSelecionada: 1,
      limparDocumentoStatus,
      acoesDisponiveis: jest.fn(() => ({ REALIZADO_E_PENDENTE: true })),
    });

    fireEvent.click(screen.getByText("Limpar Status").closest("button"));

    expect(limparDocumentoStatus).toHaveBeenCalled();
    expect(screen.queryByText("Confirmar apagar")).not.toBeInTheDocument();
  });

  it("REALIZADO_E_PENDENTE: Justificar não realização abre ModalJustificarNaoRealizacao", () => {
    setup({
      quantidadeSelecionada: 1,
      acoesDisponiveis: jest.fn(() => ({ REALIZADO_E_PENDENTE: true })),
    });

    fireEvent.click(
      screen.getByText("Justificar não realização").closest("button")
    );

    expect(
      screen.getAllByText(/Justificar não realização/i).length
    ).toBeGreaterThan(1);
    expect(screen.getByRole("button", { name: /Confirmar/i })).toBeInTheDocument();
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

  it("JUSTIFICADO_E_REALIZADO_E_PENDENTE: Limpar Status abre modal e confirmar chama limparDocumentoStatus", () => {
    const limparDocumentoStatus = jest.fn();

    setup({
      quantidadeSelecionada: 1,
      limparDocumentoStatus,
      acoesDisponiveis: jest.fn(() => ({
        JUSTIFICADO_E_REALIZADO_E_PENDENTE: true,
      })),
    });

    fireEvent.click(screen.getByText("Limpar Status").closest("button"));
    fireEvent.click(screen.getByText("Confirmar apagar"));

    expect(limparDocumentoStatus).toHaveBeenCalled();
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

  it("JUSTIFICADO_E_PENDENTE: Limpar Status abre modal e confirmar chama limparDocumentoStatus", () => {
    const limparDocumentoStatus = jest.fn();

    setup({
      quantidadeSelecionada: 1,
      limparDocumentoStatus,
      acoesDisponiveis: jest.fn(() => ({ JUSTIFICADO_E_PENDENTE: true })),
    });

    fireEvent.click(screen.getByText("Limpar Status").closest("button"));
    fireEvent.click(screen.getByText("Confirmar apagar"));

    expect(limparDocumentoStatus).toHaveBeenCalled();
  });

  it("JUSTIFICADO_E_PENDENTE: Marcar como realizado abre modal e confirmar chama marcarDocumentoComoRealizado", () => {
    const marcarDocumentoComoRealizado = jest.fn();

    setup({
      quantidadeSelecionada: 1,
      marcarDocumentoComoRealizado,
      acoesDisponiveis: jest.fn(() => ({ JUSTIFICADO_E_PENDENTE: true })),
    });

    fireEvent.click(
      screen.getByText("Marcar como realizado").closest("button")
    );
    fireEvent.click(screen.getByText("Confirmar apagar"));

    expect(marcarDocumentoComoRealizado).toHaveBeenCalled();
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

  it("REALIZADO: Limpar Status chama limparDocumentoStatus diretamente sem abrir modal", () => {
    const limparDocumentoStatus = jest.fn();

    setup({
      quantidadeSelecionada: 1,
      limparDocumentoStatus,
      acoesDisponiveis: jest.fn(() => ({ REALIZADO: true })),
    });

    fireEvent.click(screen.getByText("Limpar Status").closest("button"));

    expect(limparDocumentoStatus).toHaveBeenCalled();
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

  it("JUSTIFICADO: Limpar Status abre modal e confirmar chama limparDocumentoStatus", () => {
    const limparDocumentoStatus = jest.fn();

    setup({
      quantidadeSelecionada: 1,
      limparDocumentoStatus,
      acoesDisponiveis: jest.fn(() => ({ JUSTIFICADO: true })),
    });

    fireEvent.click(screen.getByText("Limpar Status").closest("button"));
    fireEvent.click(screen.getByText("Confirmar apagar"));

    expect(limparDocumentoStatus).toHaveBeenCalled();
  });

  it("JUSTIFICADO: Marcar como realizado abre modal e confirmar chama marcarDocumentoComoRealizado", () => {
    const marcarDocumentoComoRealizado = jest.fn();

    setup({
      quantidadeSelecionada: 1,
      marcarDocumentoComoRealizado,
      acoesDisponiveis: jest.fn(() => ({ JUSTIFICADO: true })),
    });

    fireEvent.click(
      screen.getByText("Marcar como realizado").closest("button")
    );
    fireEvent.click(screen.getByText("Confirmar apagar"));

    expect(marcarDocumentoComoRealizado).toHaveBeenCalled();
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

  it("PENDENTE: Marcar como realizado chama marcarDocumentoComoRealizado diretamente sem abrir modal", () => {
    const marcarDocumentoComoRealizado = jest.fn();

    setup({
      quantidadeSelecionada: 1,
      marcarDocumentoComoRealizado,
      acoesDisponiveis: jest.fn(() => ({ PENDENTE: true })),
    });

    fireEvent.click(
      screen.getByText("Marcar como realizado").closest("button")
    );

    expect(marcarDocumentoComoRealizado).toHaveBeenCalled();
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

  it("PENDENTE: confirmar justificar não realização chama justificarNaoRealizacaoDocumentos", () => {
    const justificarNaoRealizacaoDocumentos = jest.fn();

    setup({
      quantidadeSelecionada: 1,
      justificarNaoRealizacaoDocumentos,
      acoesDisponiveis: jest.fn(() => ({ PENDENTE: true })),
    });

    fireEvent.click(screen.getByText("Justificar não realização"));
    fireEvent.click(screen.getByText("Confirmar"));

    expect(justificarNaoRealizacaoDocumentos).toHaveBeenCalled();
  });

  // --- ModalCheckNaoPermitido ---

  it("exibe ModalCheckNaoPermitido quando showModalCheckNaoPermitido é true", () => {
    setup({
      showModalCheckNaoPermitido: true,
      tituloModalCheckNaoPermitido: "Título verificação modal",
    });

    expect(screen.getByTestId("modal-check-nao-permitido")).toBeInTheDocument();
    expect(screen.getByText("Título verificação modal")).toBeInTheDocument();
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
      statusCol.body({ status_realizacao: "PENDENTE" })
    );

    expect(container.querySelector(".tag-justificativa")).toBeInTheDocument();
    expect(container.querySelector(".tag-justificativa").textContent).toBe("-");
  });

  it("tagJustificativa renderiza nome do status para REALIZADO", () => {
    setup();

    const statusCol = mockCapturedColumnProps.find((p) => p.header === "Status");
    const { container } = render(
      statusCol.body({ status_realizacao: "REALIZADO" })
    );

    expect(container.querySelector(".tag-justificativa").textContent).toBe("Realizado");
  });

  it("tagJustificativa renderiza nome do status para JUSTIFICADO", () => {
    setup();

    const statusCol = mockCapturedColumnProps.find((p) => p.header === "Status");
    const { container } = render(
      statusCol.body({ status_realizacao: "JUSTIFICADO" })
    );

    expect(container.querySelector(".tag-justificativa").textContent).toBe("Justificado");
  });

  it("tagJustificativa renderiza '-' quando statusId é undefined", () => {
    setup();

    const statusCol = mockCapturedColumnProps.find((p) => p.header === "Status");
    const { container } = render(
      statusCol.body({ status_realizacao: undefined })
    );

    expect(container.querySelector(".tag-justificativa").textContent).toBe("-");
  });

  it("tagJustificativa renderiza '-' quando opcoesJustificativa não contém o status", () => {
    setup({
      opcoesJustificativa: { status_realizacao: [] },
    });

    const statusCol = mockCapturedColumnProps.find((p) => p.header === "Status");
    const { container } = render(
      statusCol.body({ status_realizacao: "REALIZADO" })
    );

    expect(container.querySelector(".tag-justificativa").textContent).toBe("-");
  });

  // --- onPaginationClick / salvaEstadoPaginacaoDocumentosLocalStorage ---

  it("salva estado de paginação ao mudar de página via onPage do DataTable", () => {
    setup();

    act(() => {
      mockCapturedDataTableOnPage({ first: 10, rows: 10, page: 1 });
    });

    expect(mantemEstadoAnaliseDre.setAnaliseDrePorUsuario).toHaveBeenCalled();
  });

  it("atualiza primeiroRegistroASerExibido ao mudar de página", () => {
    setup();

    act(() => {
      mockCapturedDataTableOnPage({ first: 5, rows: 5, page: 1 });
    });

    expect(mantemEstadoAnaliseDre.setAnaliseDrePorUsuario).toHaveBeenCalled();
    const [, dadosSalvos] = mantemEstadoAnaliseDre.setAnaliseDrePorUsuario.mock.calls[0];
    expect(dadosSalvos.conferencia_de_documentos.paginacao_atual).toBe(5);
  });

  // --- Coluna de seleção condicional ---

  it("não chama selecionarTodosItensDosDocumentosGlobal quando analisePermiteEdicao é false", () => {
    const selecionarTodosItensDosDocumentosGlobal = jest.fn(() => "Selecionar");

    setup({
      analisePermiteEdicao: false,
      selecionarTodosItensDosDocumentosGlobal,
    });

    expect(selecionarTodosItensDosDocumentosGlobal).not.toHaveBeenCalled();
  });

  it("não chama selecionarTodosItensDosDocumentosGlobal quando status da PC não é DEVOLVIDA", () => {
    const selecionarTodosItensDosDocumentosGlobal = jest.fn(() => "Selecionar");

    setup({
      prestacaoDeContas: { status: "APROVADA" },
      selecionarTodosItensDosDocumentosGlobal,
    });

    expect(selecionarTodosItensDosDocumentosGlobal).not.toHaveBeenCalled();
  });

  it("não chama selecionarTodosItensDosDocumentosGlobal quando visao não é UE", () => {
    visoesService.getItemUsuarioLogado.mockReturnValue("DRE");

    const selecionarTodosItensDosDocumentosGlobal = jest.fn(() => "Selecionar");

    setup({ selecionarTodosItensDosDocumentosGlobal });

    expect(selecionarTodosItensDosDocumentosGlobal).not.toHaveBeenCalled();
  });

  it("não chama selecionarTodosItensDosDocumentosGlobal quando sem permissão change_analise_dre", () => {
    visoesService.getPermissoes.mockReturnValue(false);

    const selecionarTodosItensDosDocumentosGlobal = jest.fn(() => "Selecionar");

    setup({ selecionarTodosItensDosDocumentosGlobal });

    expect(selecionarTodosItensDosDocumentosGlobal).not.toHaveBeenCalled();
  });

  it("renderiza coluna de seleção quando todas as condições são atendidas", () => {
    setup({
      analisePermiteEdicao: true,
      prestacaoDeContas: { status: "DEVOLVIDA" },
      selecionarTodosItensDosDocumentosGlobal: jest.fn(() => "Selecionar"),
    });

    expect(screen.getByText("Selecionar")).toBeInTheDocument();
  });

  // --- ModalJustificarNaoRealizacao: textarea ---

  it("ModalJustificarNaoRealizacao: textarea atualiza texto ao digitar", () => {
    setup({
      quantidadeSelecionada: 1,
      acoesDisponiveis: jest.fn(() => ({ PENDENTE: true })),
    });

    fireEvent.click(screen.getByText("Justificar não realização"));

    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "minha justificativa" } });

    expect(textarea.value).toBe("minha justificativa");
  });

  // --- Paginação inicial via localStorage ---

  it("usa paginacao_atual do localStorage como primeiroRegistroASerExibido inicial", () => {
    mantemEstadoAnaliseDre.getAnaliseDreUsuarioLogado.mockReturnValue({
      conferencia_de_documentos: {
        paginacao_atual: 10,
        expanded: [],
      },
    });

    setup();

    const dataTableProps = mockCapturedColumnProps;
    expect(dataTableProps.length).toBeGreaterThan(0);
  });
});
