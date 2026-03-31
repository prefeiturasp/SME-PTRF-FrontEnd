import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import TabsConferenciaAtualHistorico from "../TabsConferenciaAtualHistorico";
import { getAnalisePrestacaoConta } from "../../../../../../services/dres/PrestacaoDeContas.service";

jest.mock("../DevolverParaAcertos", () => (props) => (
  <div data-testid="devolver-para-acertos-mock">
    {props.editavel ? "editavel" : "nao-editavel"}
  </div>
));

jest.mock("../RelatorioDosAcertos", () => ({
  RelatorioDosAcertos: (props) => (
    <div
      data-testid={
        props.podeGerarPrevia
          ? "relatorio-acertos-atual"
          : "relatorio-acertos-historico"
      }
    />
  ),
}));

jest.mock(
  "../../../../../Globais/ExibeAcertosEmLancamentosEDocumentosPorConta",
  () =>
    jest.fn((props) => (
      <div
        data-testid="acertos-por-conta-mock"
        data-prestacao={props.prestacaoDeContasUuid}
      />
    ))
);

jest.mock(
  "../../../../../Globais/Mensagens/MsgImgCentralizada",
  () => ({
    MsgImgCentralizada: (props) => (
      <div data-testid="msg-img-centralizada-mock">
        {props.texto}
      </div>
    ),
  })
);

jest.mock(
  "../../../../../Globais/ExibeAcertosEmLancamentosEDocumentosPorConta/RelatorioAposAcertos",
  () => ({
    RelatorioAposAcertos: (props) => (
      <div
        data-testid="relatorio-apos-acertos-mock"
        data-prestacao={props.prestacaoDeContasUuid}
      />
    ),
  })
);

jest.mock(
  "../../../../../Globais/CardsDevolucoesParaAcertoDaDre",
  () =>
    jest.fn((props) => (
      <div
        data-testid="cards-devolucoes-mock"
        data-prestacao={props.prestacao_conta_uuid}
      />
    ))
);

jest.mock(
  "../../../../../../services/dres/PrestacaoDeContas.service",
  () => ({
    getAnalisePrestacaoConta: jest.fn(),
  })
);

const defaultProps = {
  dataLimiteDevolucao: "2025-01-01",
  handleChangeDataLimiteDevolucao: jest.fn(),
  prestacao_conta_uuid: "pc-uuid",
  analiseAtualUuid: "analise-uuid",
  msgNaoExistemSolicitacoesDeAcerto: null,
  totalAnalisesDePcDevolvidas: 1,
  setAnaliseAtualUuidComPCAnaliseAtualUuid: jest.fn(),
  setPrimeiraAnalisePcDevolvida: jest.fn(),
  setAnaliseAtualUuid: jest.fn(),
  editavel: true,
  pcEmAnalise: true,
  prestacaoDeContas: { status: "EM_ANALISE" },
  limpaStorage: jest.fn(),
};

const setup = (props = {}) =>
  render(<TabsConferenciaAtualHistorico {...defaultProps} {...props} />);

beforeEach(() => {
  jest.clearAllMocks();
  getAnalisePrestacaoConta.mockResolvedValue({
    versao_pdf_apresentacao_apos_acertos: "RASCUNHO",
  });
});

describe("TabsConferenciaAtualHistorico", () => {
  it("renderiza abas de Conferência atual e Histórico quando há análises devolvidas", () => {
    setup();

    expect(
      screen.getByText("Conferência atual")
    ).toBeInTheDocument();
    expect(screen.getByText("Histórico")).toBeInTheDocument();
  });

  it("dispara setAnaliseAtualUuidComPCAnaliseAtualUuid ao clicar na aba Conferência atual", () => {
    const setAnaliseAtualUuidComPCAnaliseAtualUuid = jest.fn();
    setup({ setAnaliseAtualUuidComPCAnaliseAtualUuid });

    fireEvent.click(screen.getByText("Conferência atual"));
    expect(setAnaliseAtualUuidComPCAnaliseAtualUuid).toHaveBeenCalled();
  });

  it("ao clicar em Histórico chama setPrimeiraAnalisePcDevolvida e limpaStorage", () => {
    const setPrimeiraAnalisePcDevolvida = jest.fn();
    const limpaStorage = jest.fn();

    setup({ setPrimeiraAnalisePcDevolvida, limpaStorage });

    fireEvent.click(screen.getByText("Histórico"));

    expect(setPrimeiraAnalisePcDevolvida).toHaveBeenCalled();
    expect(limpaStorage).toHaveBeenCalled();
  });

  it("quando msgNaoExistemSolicitacoesDeAcerto é fornecida exibe mensagem de vazio", () => {
    setup({ msgNaoExistemSolicitacoesDeAcerto: "Sem acertos", abaAtiva: 'conferencia-atual' });

    expect(
      screen.getByTestId("msg-img-centralizada-mock")
    ).toHaveTextContent("Sem acertos");
    expect(
      screen.queryByTestId("devolver-para-acertos-mock")
    ).not.toBeInTheDocument();
  });

  it("renderiza componentes da aba Conferência atual", async () => {
    setup({ abaAtiva: 'conferencia-atual' });

    await waitFor(() =>
      expect(
        screen.getByTestId("devolver-para-acertos-mock")
      ).toBeInTheDocument()
    );

    expect(
      screen.getByTestId("relatorio-acertos-atual")
    ).toBeInTheDocument();
  });

  it("renderiza componentes da aba Histórico e RelatorioAposAcertos quando versao_pdf_apresentacao_apos_acertos é FINAL", async () => {
    getAnalisePrestacaoConta.mockResolvedValue({
      versao_pdf_apresentacao_apos_acertos: "FINAL",
    });

    setup({ abaAtiva: 'historico' });

    // deve existir RelatorioDosAcertos na aba histórico
    expect(
      screen.getByTestId("relatorio-acertos-historico")
    ).toBeInTheDocument();
  });

  it("não renderiza aba Conferência atual quando pcEmAnalise=false", () => {
    setup({ pcEmAnalise: false });

    expect(
      screen.queryByText("Conferência atual")
    ).not.toBeInTheDocument();
    expect(screen.getByText("Histórico")).toBeInTheDocument();
  });
});

