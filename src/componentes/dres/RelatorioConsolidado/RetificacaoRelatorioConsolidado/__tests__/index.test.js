import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import RetificacaoRelatorioConsolidado from "../index";
import {
  getConsolidadoDrePorUuid,
  getPcsRetificaveis,
  postRetificarPcs,
  getPcsEmRetificacao,
  postDesfazerRetificacaoPcs,
  patchMotivoRetificaoPcs,
  updateRetificarPcs,
  getPcsDoConsolidado,
} from "../../../../../services/dres/RelatorioConsolidado.service";
import { getTabelaAssociacoes } from "../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../Globais/ToastCustom";
import { useRecursoSelecionadoContext } from "../../../../../context/RecursoSelecionado";

const mockNavigate = jest.fn();
const mockUseParams = jest.fn();
const mockUseLocation = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams(),
  useLocation: () => mockUseLocation(),
}));

jest.mock("../../../../../services/dres/RelatorioConsolidado.service", () => ({
  getConsolidadoDrePorUuid: jest.fn(),
  getPcsRetificaveis: jest.fn(),
  postRetificarPcs: jest.fn(),
  getPcsEmRetificacao: jest.fn(),
  postDesfazerRetificacaoPcs: jest.fn(),
  patchMotivoRetificaoPcs: jest.fn(),
  updateRetificarPcs: jest.fn(),
  getPcsDoConsolidado: jest.fn(),
}));
jest.mock("../../../../../services/sme/Parametrizacoes.service", () => ({ getTabelaAssociacoes: jest.fn() }));
jest.mock("../../../../../context/RecursoSelecionado", () => ({ useRecursoSelecionadoContext: jest.fn() }));
jest.mock("../../../../Globais/ToastCustom", () => ({
  toastCustom: { ToastCustomSuccess: jest.fn() },
}));
jest.mock("../../../../../paginas/PaginasContainer", () => ({ PaginasContainer: ({ children }) => <div>{children}</div> }));
jest.mock("../../../../../utils/Loading", () => () => <div data-testid="loading">Carregando...</div>);
jest.mock("../../../../Globais/Mensagens/MsgImgCentralizada", () => ({
  MsgImgCentralizada: ({ texto }) => <div data-testid="msg-vazio">{texto}</div>,
}));
jest.mock("react-tooltip", () => ({ Tooltip: ({ id }) => <div data-testid={`tooltip-${id}`} /> }));
jest.mock("../../../../Globais/ModalAntDesign", () => ({
  ModalAntDesignConfirmacao: ({ handleShow, bodyText, handleOk, handleCancel }) => {
    if (!handleShow) return null;
    const nome = bodyText.includes("apagará") ? "apagar" : bodyText.includes("Lembre-se") ? "retificar" : "desfazer";
    return (
      <div data-testid={`modal-${nome}`}>
        <span>{bodyText}</span>
        <button onClick={handleOk}>{`ok-${nome}`}</button>
        <button onClick={handleCancel}>{`cancel-${nome}`}</button>
      </div>
    );
  },
}));

const listaConsolidado = () => [
  { uuid: "a", unidade_nome: "ESCOLA A", unidade_tipo_unidade: "EMEF", pc_em_retificacao: false },
  { uuid: "b", unidade_nome: "ESCOLA B", unidade_tipo_unidade: "CEU", pc_em_retificacao: true, tooltip_nao_pode_retificar: "ja em retificacao" },
  { uuid: "c", unidade_nome: "CRECHE C", unidade_tipo_unidade: "EMEF", pc_em_retificacao: false },
];
const listaEmRetificacao = () => [
  { uuid: "x", unidade_nome: "ESCOLA X", unidade_tipo_unidade: "EMEF", pode_desfazer_retificacao: true },
  { uuid: "y", unidade_nome: "ESCOLA Y", unidade_tipo_unidade: "CEU", pode_desfazer_retificacao: false, tooltip_nao_pode_desfazer_retificacao: "nao pode" },
  { uuid: "z", unidade_nome: "ESCOLA Z", unidade_tipo_unidade: "EMEF", pode_desfazer_retificacao: true },
];

const consolidado = {
  motivo_retificacao: "Motivo antigo",
  periodo: { uuid: "per-1", referencia: "2024.1", data_inicio_realizacao_despesas: "2024-01-01", data_fim_realizacao_despesas: "2024-06-30" },
};

const locationState = (state) => ({ state });
const stateEdicao = { referencia_publicacao: "Ref X", eh_edicao_retificacao: true };
const stateNovo = { referencia_publicacao: "Ref X", eh_edicao_retificacao: false };

const setupMocks = () => {
  mockUseParams.mockReturnValue({ relatorio_consolidado_uuid: "rc-1" });
  useRecursoSelecionadoContext.mockReturnValue({ recursoSelecionado: { habilita_exibicao_de_lauda: false } });
  getConsolidadoDrePorUuid.mockImplementation(async () => ({ ...consolidado }));
  getTabelaAssociacoes.mockResolvedValue({ tipos_unidade: [{ id: "EMEF", nome: "EMEF" }, { id: "CEU", nome: "CEU" }] });
  getPcsRetificaveis.mockImplementation(async () => listaConsolidado());
  getPcsDoConsolidado.mockImplementation(async () => listaConsolidado());
  getPcsEmRetificacao.mockImplementation(async () => listaEmRetificacao());
  postRetificarPcs.mockResolvedValue({});
  updateRetificarPcs.mockResolvedValue({});
  postDesfazerRetificacaoPcs.mockResolvedValue({});
  patchMotivoRetificaoPcs.mockResolvedValue({});
};

const renderIt = async (state, waitFor_ = "ESCOLA A") => {
  mockUseLocation.mockReturnValue(locationState(state));
  const utils = render(<RetificacaoRelatorioConsolidado />);
  await waitFor(() => expect(screen.getByText(new RegExp(waitFor_))).toBeInTheDocument());
  return utils;
};

const exibindo = (texto) => screen.getByText((_, el) => el.className === "col-12" && el.textContent.trim() === texto);
const checkboxes = (name) => Array.from(document.querySelectorAll(`input[name="${name}"]`));

describe("RetificacaoRelatorioConsolidado - renderização", () => {
  beforeEach(() => {
    setupMocks();
    jest.spyOn(Storage.prototype, "setItem");
  });
  afterEach(() => jest.restoreAllMocks());

  it("exibe loading inicialmente e depois cabeçalho/período", async () => {
    mockUseLocation.mockReturnValue(locationState(stateNovo));
    render(<RetificacaoRelatorioConsolidado />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("Ref X")).toBeInTheDocument());
    expect(screen.getByText("Retificação do relatório")).toBeInTheDocument();
    expect(screen.getByText(/2024\.1 - 01\/01\/2024 à 30\/06\/2024/)).toBeInTheDocument();
  });

  it("com lauda usa texto 'da publicação'", async () => {
    useRecursoSelecionadoContext.mockReturnValue({ recursoSelecionado: { habilita_exibicao_de_lauda: true } });
    await renderIt(stateNovo);
    expect(screen.getByText("Retificação da publicação")).toBeInTheDocument();
  });

  it("sem uuid permanece em loading e não chama serviços", async () => {
    mockUseParams.mockReturnValue({});
    mockUseLocation.mockReturnValue(locationState(stateNovo));
    render(<RetificacaoRelatorioConsolidado />);
    await act(async () => {});
    expect(screen.getByTestId("loading")).toBeInTheDocument();
    expect(getConsolidadoDrePorUuid).not.toHaveBeenCalled();
    expect(getPcsDoConsolidado).not.toHaveBeenCalled();
  });

  it("sem state de location não carrega listas", async () => {
    mockUseLocation.mockReturnValue(null);
    render(<RetificacaoRelatorioConsolidado />);
    await waitFor(() => expect(screen.queryByTestId("loading")).not.toBeInTheDocument());
    expect(getPcsDoConsolidado).not.toHaveBeenCalled();
    expect(getPcsRetificaveis).not.toHaveBeenCalled();
  });

  it("state sem eh_edicao_retificacao booleano não carrega listas", async () => {
    mockUseLocation.mockReturnValue(locationState({ referencia_publicacao: "R" }));
    render(<RetificacaoRelatorioConsolidado />);
    await waitFor(() => expect(screen.getByText("R")).toBeInTheDocument());
    expect(getPcsDoConsolidado).not.toHaveBeenCalled();
  });

  it("modo adição: usa getPcsDoConsolidado, sem tabela em retificação, com tooltip", async () => {
    await renderIt(stateNovo);
    expect(getPcsDoConsolidado).toHaveBeenCalledWith("rc-1");
    expect(getPcsRetificaveis).not.toHaveBeenCalled();
    expect(getPcsEmRetificacao).not.toHaveBeenCalled();
    expect(screen.queryByText("Unidades com PCs em retificação")).not.toBeInTheDocument();
    expect(screen.getByText("Unidades com PCs não retificadas")).toBeInTheDocument();
    expect(exibindo("Exibindo 3 unidades")).toBeInTheDocument();
    expect(screen.getByTestId("tooltip-tooltip-id-b")).toBeInTheDocument();
    expect(screen.queryByTestId("tooltip-tooltip-id-a")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Salvar" })).not.toBeInTheDocument();
  });

  it("modo edição: usa getPcsRetificaveis e getPcsEmRetificacao, exibe as duas tabelas", async () => {
    await renderIt(stateEdicao, "ESCOLA X");
    expect(getPcsRetificaveis).toHaveBeenCalledWith("rc-1");
    expect(getPcsEmRetificacao).toHaveBeenCalledWith("rc-1");
    expect(screen.getByText("Unidades com PCs em retificação")).toBeInTheDocument();
    expect(screen.getByText(/ESCOLA A/)).toBeInTheDocument();
    expect(screen.getByDisplayValue("Motivo antigo")).toBeInTheDocument();
    expect(screen.getByTestId("tooltip-tooltip-retificacao-id-y")).toBeInTheDocument();
    expect(screen.queryByTestId("tooltip-tooltip-retificacao-id-x")).not.toBeInTheDocument();
  });

  it("mensagem de quantidade no singular", async () => {
    getPcsDoConsolidado.mockImplementation(async () => [listaConsolidado()[0]]);
    await renderIt(stateNovo);
    expect(exibindo("Exibindo 1 unidade")).toBeInTheDocument();
  });

  it("lista de PCs do consolidado vazia: não exibe tabela de retificáveis", async () => {
    getPcsEmRetificacao.mockImplementation(async () => [listaEmRetificacao()[0]]);
    getPcsRetificaveis.mockImplementation(async () => []);
    await renderIt(stateEdicao, "ESCOLA X");
    expect(screen.queryByText("Unidades com PCs não retificadas")).not.toBeInTheDocument();
    expect(exibindo("Exibindo 1 unidade")).toBeInTheDocument();
  });

  it("onClickVoltar grava período no localStorage e navega", async () => {
    await renderIt(stateNovo);
    fireEvent.click(screen.getByRole("button", { name: /voltar/i }));
    expect(localStorage.setItem).toHaveBeenCalledWith(expect.any(String), "per-1");
    expect(mockNavigate).toHaveBeenCalledWith("/dre-relatorio-consolidado/");
  });

  it("onClickVoltar sem período não navega e formataPeriodo retorna vazio", async () => {
    getConsolidadoDrePorUuid.mockImplementation(async () => ({}));
    await renderIt(stateNovo);
    fireEvent.click(screen.getByRole("button", { name: /voltar/i }));
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
