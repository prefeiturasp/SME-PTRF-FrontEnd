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


const abrirMenu = (idx) => fireEvent.click(document.querySelectorAll("#checkHeader")[idx]);
const clicarItem = (nome, idx = 0) => fireEvent.click(screen.getAllByText(nome)[idx]);
const selecionado = (texto) => screen.getByText((_, el) => el.className === "col-5" && el.textContent.replace(/\s+/g, " ").trim() === texto);

describe("RetificacaoRelatorioConsolidado - ações modo adição", () => {
  beforeEach(setupMocks);

  it("seleciona/desmarca linhas individualmente e cancela seleção", async () => {
    await renderIt(stateNovo);
    const cbs = checkboxes("checkAtribuido");
    expect(cbs[1]).toBeDisabled();
    fireEvent.click(cbs[0]);
    expect(selecionado("1 unidade selecionada / 3 totais")).toBeInTheDocument();
    fireEvent.click(checkboxes("checkAtribuido")[2]);
    expect(selecionado("2 unidades selecionadas / 3 totais")).toBeInTheDocument();
    fireEvent.click(checkboxes("checkAtribuido")[2]);
    expect(selecionado("1 unidade selecionada / 3 totais")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(screen.queryByText(/totais/)).not.toBeInTheDocument();
  });

  it("selecionar todos ignora PCs já em retificação e desmarcar todos limpa", async () => {
    await renderIt(stateNovo);
    abrirMenu(0);
    clicarItem("Selecionar todos");
    expect(selecionado("2 unidades selecionadas / 3 totais")).toBeInTheDocument();
    expect(document.querySelector("#checkHeader").checked).toBe(true);
    abrirMenu(0);
    clicarItem("Desmarcar todos");
    expect(screen.queryByText(/totais/)).not.toBeInTheDocument();
    expect(document.querySelector("#checkHeader").checked).toBe(false);
  });

  it("marca o header quando todas as linhas foram selecionadas manualmente", async () => {
    getPcsDoConsolidado.mockImplementation(async () => [listaConsolidado()[0]]);
    await renderIt(stateNovo);
    fireEvent.click(checkboxes("checkAtribuido")[0]);
    expect(document.querySelector("#checkHeader").checked).toBe(true);
    fireEvent.click(checkboxes("checkAtribuido")[0]);
    expect(document.querySelector("#checkHeader").checked).toBe(false);
  });

  it("retificar (criação): chama postRetificarPcs, toast e volta", async () => {
    await renderIt(stateNovo);
    fireEvent.change(document.querySelector("textarea"), { target: { name: "motivo_retificacao", value: "meu motivo" } });
    fireEvent.click(checkboxes("checkAtribuido")[0]);
    fireEvent.click(screen.getByRole("button", { name: /Retificar/ }));
    expect(screen.getByTestId("modal-retificar")).toBeInTheDocument();
    expect(screen.getByText(/gerarão novos documentos\./)).toBeInTheDocument();
    fireEvent.click(screen.getByText("ok-retificar"));
    await waitFor(() => expect(postRetificarPcs).toHaveBeenCalledWith("rc-1", { motivo: "meu motivo", lista_pcs: ["a"] }));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/dre-relatorio-consolidado/"));
    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith("Retificação criada com sucesso.", "A retificação do relatório foi criada com sucesso.");
    expect(updateRetificarPcs).not.toHaveBeenCalled();
  });

  it("cancelar o modal de retificar o fecha", async () => {
    await renderIt(stateNovo);
    fireEvent.click(checkboxes("checkAtribuido")[0]);
    fireEvent.click(screen.getByRole("button", { name: /Retificar/ }));
    fireEvent.click(screen.getByText("cancel-retificar"));
    expect(screen.queryByTestId("modal-retificar")).not.toBeInTheDocument();
  });

  it("texto com lauda inclui informação de lauda a ser publicada", async () => {
    useRecursoSelecionadoContext.mockReturnValue({ recursoSelecionado: { habilita_exibicao_de_lauda: true } });
    await renderIt(stateNovo);
    fireEvent.click(checkboxes("checkAtribuido")[0]);
    fireEvent.click(screen.getByRole("button", { name: /Retificar/ }));
    expect(screen.getByTestId("modal-retificar").textContent).toMatch(/lauda/i);
  });
});

describe("RetificacaoRelatorioConsolidado - filtros", () => {
  beforeEach(setupMocks);

  it("filtra por nome (case-insensitive) e tipo na tabela de retificáveis e limpa", async () => {
    await renderIt(stateNovo);
    fireEvent.click(checkboxes("checkAtribuido")[0]);
    fireEvent.change(screen.getByPlaceholderText("Nome da unidade"), { target: { name: "filtro_por_nome", value: "creche" } });
    fireEvent.click(screen.getByRole("button", { name: "Filtrar" }));
    await waitFor(() => expect(screen.queryByText(/ESCOLA A/)).not.toBeInTheDocument());
    expect(screen.getByText(/CRECHE C/)).toBeInTheDocument();
    expect(screen.queryByText(/totais/)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Limpar" }));
    await waitFor(() => expect(screen.getByText(/ESCOLA A/)).toBeInTheDocument());
    expect(screen.getByPlaceholderText("Nome da unidade")).toHaveValue("");

    fireEvent.change(screen.getByLabelText("Pesquisar por tipo unidade"), { target: { name: "filtro_por_tipo", value: "CEU" } });
    fireEvent.click(screen.getByRole("button", { name: "Filtrar" }));
    await waitFor(() => expect(screen.queryByText(/ESCOLA A/)).not.toBeInTheDocument());
    expect(screen.getByText(/ESCOLA B/)).toBeInTheDocument();
  });

  it("filtro sem resultados mostra mensagem de vazio", async () => {
    await renderIt(stateNovo);
    fireEvent.change(screen.getByPlaceholderText("Nome da unidade"), { target: { name: "filtro_por_nome", value: "zzz" } });
    fireEvent.click(screen.getByRole("button", { name: "Filtrar" }));
    await waitFor(() => expect(screen.getByTestId("msg-vazio")).toBeInTheDocument());
  });

  it("modo edição: filtros usam getPcsRetificaveis e getPcsEmRetificacao", async () => {
    await renderIt(stateEdicao, "ESCOLA X");
    // Filtros da tabela em retificação (primeiro)
    fireEvent.change(screen.getAllByPlaceholderText("Nome da unidade")[0], { target: { name: "filtro_por_nome", value: "escola z" } });
    fireEvent.click(screen.getAllByRole("button", { name: "Filtrar" })[0]);
    await waitFor(() => expect(screen.queryByText(/ESCOLA X/)).not.toBeInTheDocument());
    expect(screen.getByText(/ESCOLA Z/)).toBeInTheDocument();

    fireEvent.change(screen.getAllByLabelText("Pesquisar por tipo unidade")[0], { target: { name: "filtro_por_tipo", value: "CEU" } });
    fireEvent.click(screen.getAllByRole("button", { name: "Filtrar" })[0]);
    await waitFor(() => expect(screen.getByTestId("msg-vazio")).toBeInTheDocument());

    fireEvent.click(screen.getAllByRole("button", { name: "Limpar" })[0]);
    await waitFor(() => expect(screen.getByText(/ESCOLA X/)).toBeInTheDocument());
    expect(screen.getAllByPlaceholderText("Nome da unidade")[0]).toHaveValue("");

    // Filtros da tabela de retificáveis (segundo)
    getPcsRetificaveis.mockClear();
    fireEvent.change(screen.getAllByPlaceholderText("Nome da unidade")[1], { target: { name: "filtro_por_nome", value: "creche" } });
    fireEvent.click(screen.getAllByRole("button", { name: "Filtrar" })[1]);
    await waitFor(() => expect(getPcsRetificaveis).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(screen.getByText(/CRECHE C/)).toBeInTheDocument());
    fireEvent.click(screen.getAllByRole("button", { name: "Limpar" })[1]);
    await waitFor(() => expect(getPcsRetificaveis).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(screen.getByText(/ESCOLA A/)).toBeInTheDocument());
  });
});

describe("RetificacaoRelatorioConsolidado - ações modo edição", () => {
  beforeEach(setupMocks);

  it("salvar motivo chama patchMotivoRetificaoPcs", async () => {
    await renderIt(stateEdicao, "ESCOLA X");
    const salvar = screen.getByRole("button", { name: "Salvar" });
    expect(salvar).toBeDisabled();
    fireEvent.change(screen.getByDisplayValue("Motivo antigo"), { target: { name: "motivo_retificacao", value: "Motivo novo" } });
    expect(salvar).toBeEnabled();
    fireEvent.click(salvar);
    await waitFor(() => expect(patchMotivoRetificaoPcs).toHaveBeenCalledWith("rc-1", { motivo: "Motivo novo" }));
    expect(screen.getByText(/Salvo/)).toBeInTheDocument();
  });

  it("retificar em edição chama updateRetificarPcs e recarrega as listas", async () => {
    await renderIt(stateEdicao, "ESCOLA X");
    fireEvent.click(checkboxes("checkAtribuido")[0]);
    fireEvent.click(screen.getByRole("button", { name: /Retificar/ }));
    getPcsRetificaveis.mockClear();
    getPcsEmRetificacao.mockClear();
    getConsolidadoDrePorUuid.mockClear();
    fireEvent.click(screen.getByText("ok-retificar"));
    await waitFor(() => expect(updateRetificarPcs).toHaveBeenCalledWith("rc-1", { motivo: "Motivo antigo", lista_pcs: ["a"] }));
    await waitFor(() => expect(getConsolidadoDrePorUuid).toHaveBeenCalled());
    expect(getPcsRetificaveis).toHaveBeenCalled();
    expect(getPcsEmRetificacao).toHaveBeenCalled();
    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith("Inclusão de PCs efetuada com sucesso.", expect.any(String));
    expect(postRetificarPcs).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByTestId("modal-retificar")).not.toBeInTheDocument());
  });

  it("selecionar linhas em retificação atualiza contagem e header; desabilita as não desfazíveis", async () => {
    await renderIt(stateEdicao, "ESCOLA X");
    const cbs = checkboxes("checkAtribuidoEmRetificacao");
    expect(cbs[1]).toBeDisabled();
    fireEvent.click(cbs[0]);
    expect(selecionado("1 unidade selecionada / 3 totais")).toBeInTheDocument();
    expect(document.querySelectorAll("#checkHeader")[0].checked).toBe(false);
    fireEvent.click(checkboxes("checkAtribuidoEmRetificacao")[2]);
    expect(selecionado("2 unidades selecionadas / 3 totais")).toBeInTheDocument();
    expect(document.querySelectorAll("#checkHeader")[0].checked).toBe(true);
    fireEvent.click(checkboxes("checkAtribuidoEmRetificacao")[2]);
    expect(document.querySelectorAll("#checkHeader")[0].checked).toBe(false);
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(screen.queryByText(/totais/)).not.toBeInTheDocument();
  });

  it("selecionar/desmarcar todos em retificação", async () => {
    await renderIt(stateEdicao, "ESCOLA X");
    abrirMenu(0);
    clicarItem("Selecionar todos", 0);
    expect(selecionado("2 unidades selecionadas / 3 totais")).toBeInTheDocument();
    abrirMenu(0);
    clicarItem("Desmarcar todos", 0);
    expect(screen.queryByText(/totais/)).not.toBeInTheDocument();
  });

  it("cancelar retificação parcial: abre modal de desfazer e chama postDesfazerRetificacaoPcs", async () => {
    await renderIt(stateEdicao, "ESCOLA X");
    fireEvent.click(checkboxes("checkAtribuidoEmRetificacao")[0]);
    fireEvent.click(screen.getByRole("button", { name: /Cancelar retificação/ }));
    expect(screen.getByTestId("modal-desfazer")).toBeInTheDocument();
    getPcsEmRetificacao.mockClear();
    fireEvent.click(screen.getByText("ok-desfazer"));
    await waitFor(() => expect(postDesfazerRetificacaoPcs).toHaveBeenCalledWith("rc-1", { motivo: "Motivo antigo", lista_pcs: ["x"], deve_apagar_retificacao: false }));
    await waitFor(() => expect(getPcsEmRetificacao).toHaveBeenCalled());
    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith("Remoção de PCs efetuada com sucesso.", "PCs removidas da retificação do relatório com sucesso.");
    await waitFor(() => expect(screen.queryByTestId("modal-desfazer")).not.toBeInTheDocument());
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("cancelar modal de desfazer o fecha", async () => {
    await renderIt(stateEdicao, "ESCOLA X");
    fireEvent.click(checkboxes("checkAtribuidoEmRetificacao")[0]);
    fireEvent.click(screen.getByRole("button", { name: /Cancelar retificação/ }));
    fireEvent.click(screen.getByText("cancel-desfazer"));
    expect(screen.queryByTestId("modal-desfazer")).not.toBeInTheDocument();
  });

  it("cancelar todas as PCs: abre modal de apagar e remove a retificação", async () => {
    getPcsEmRetificacao.mockImplementation(async () => [listaEmRetificacao()[0]]);
    await renderIt(stateEdicao, "ESCOLA X");
    fireEvent.click(checkboxes("checkAtribuidoEmRetificacao")[0]);
    fireEvent.click(screen.getByRole("button", { name: /Cancelar retificação/ }));
    expect(screen.getByTestId("modal-apagar")).toBeInTheDocument();
    fireEvent.click(screen.getByText("ok-apagar"));
    await waitFor(() => expect(postDesfazerRetificacaoPcs).toHaveBeenCalledWith("rc-1", { motivo: "Motivo antigo", lista_pcs: ["x"], deve_apagar_retificacao: true }));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/dre-relatorio-consolidado/"));
    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith("Retificação removida com sucesso.", "A retificação do relatório foi removida com sucesso.");
  });

  it("cancelar modal de apagar o fecha", async () => {
    getPcsEmRetificacao.mockImplementation(async () => [listaEmRetificacao()[0]]);
    await renderIt(stateEdicao, "ESCOLA X");
    fireEvent.click(checkboxes("checkAtribuidoEmRetificacao")[0]);
    fireEvent.click(screen.getByRole("button", { name: /Cancelar retificação/ }));
    fireEvent.click(screen.getByText("cancel-apagar"));
    expect(screen.queryByTestId("modal-apagar")).not.toBeInTheDocument();
  });
});
