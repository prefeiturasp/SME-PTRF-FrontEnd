import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PreviaDocumentoRetificado from "../PreviaDocumentoRetificado";
import { postCriarAtaAtrelarAoConsolidadoDre } from "../../../../services/dres/RelatorioConsolidado.service";
import { visoesService } from "../../../../services/visoes.service";

jest.mock("../../../../services/dres/RelatorioConsolidado.service", () => ({
  postCriarAtaAtrelarAoConsolidadoDre: jest.fn(),
}));

jest.mock("../../../../services/visoes.service", () => ({
  visoesService: { getPermissoes: jest.fn() },
}));

jest.mock("react-tooltip", () => ({ Tooltip: () => <div data-testid="react-tooltip" /> }));

jest.mock("antd", () => ({
  Tooltip: ({ children, title }) => <div data-testid="antd-tooltip" data-title={title}>{children}</div>,
  Button: ({ children, onClick, disabled, loading }) => (
    <button data-testid="btn-gerar" onClick={onClick} disabled={disabled} data-loading={String(!!loading)}>{children}</button>
  ),
}));

jest.mock("../../../../utils/Modais", () => ({
  ModalPublicarRetificacao: ({ show, alertaJustificativa, publicarRetificacao, handleClose }) =>
    show ? (
      <div data-testid="modal-publicar" data-alerta={String(alertaJustificativa)}>
        <button onClick={publicarRetificacao}>publicar</button>
        <button onClick={handleClose}>fechar-publicar</button>
      </div>
    ) : null,
  ModalPublicarRetificacaoPendente: ({ show, secaoMotivoRetificacao, secaoJustificativa, redirecionaMotivo, redirecionaJustifica, handleClose }) =>
    show ? (
      <div data-testid="modal-pendente" data-motivo={String(secaoMotivoRetificacao)} data-just={String(secaoJustificativa)}>
        <button onClick={redirecionaMotivo}>ir-motivo</button>
        <button onClick={redirecionaJustifica}>ir-just</button>
        <button onClick={handleClose}>fechar-pendente</button>
      </div>
    ) : null,
}));

const valoresIguais = {
  repasses_previstos_sme_custeio: 1, repasses_no_periodo_custeio: 1,
  repasses_previstos_sme_capital: 1, repasses_no_periodo_capital: 1,
  repasses_previstos_sme_livre: 1, repasses_no_periodo_livre: 1,
  repasses_previstos_sme_total: 3, repasses_no_periodo_total: 3,
};

const execIgual = { por_tipo_de_conta: [{ valores: valoresIguais }] };

const consolidadoBase = {
  uuid: "c1",
  eh_retificacao: true,
  ja_publicado: false,
  habilita_botao_gerar: true,
  motivo_retificacao: "motivo",
  dre_uuid: "d1",
  periodo_uuid: "p1",
};

describe("PreviaDocumentoRetificado", () => {
  let publicarRetificacao, gerarPreviaRetificacao, todas;
  let assignMock;
  const originalLocation = window.location;

  const setup = (props = {}) =>
    render(
      <PreviaDocumentoRetificado
        consolidadoDre={consolidadoBase}
        todasAsPcsDaRetificacaoConcluidas={todas}
        publicarRetificacao={publicarRetificacao}
        gerarPreviaRetificacao={gerarPreviaRetificacao}
        execucaoFinanceira={execIgual}
        execucaoFinanceiraCarregando={false}
        existeComissaoResponsavelPC={true}
        {...props}
      />
    );

  beforeEach(() => {
    publicarRetificacao = jest.fn();
    gerarPreviaRetificacao = jest.fn();
    todas = jest.fn().mockReturnValue(true);
    visoesService.getPermissoes.mockReturnValue(true);
    assignMock = jest.fn();
    delete window.location;
    window.location = { assign: assignMock };
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  it("não renderiza nada quando não é retificação", () => {
    const { container } = setup({ consolidadoDre: { ...consolidadoBase, eh_retificacao: false } });
    expect(container).toBeEmptyDOMElement();
  });

  it("não renderiza nada sem consolidadoDre", () => {
    const { container } = setup({ consolidadoDre: null });
    expect(container).toBeEmptyDOMElement();
  });

  it("botão Prévias chama gerarPreviaRetificacao", () => {
    setup();
    fireEvent.click(screen.getByText("Prévias"));
    expect(gerarPreviaRetificacao).toHaveBeenCalledWith(consolidadoBase);
  });

  it("Prévias desabilitado sem conclusão ou sem permissão", () => {
    todas.mockReturnValue(false);
    const { unmount } = setup();
    expect(screen.getByText("Prévias")).toBeDisabled();
    unmount();
    todas.mockReturnValue(true);
    visoesService.getPermissoes.mockReturnValue(false);
    setup();
    expect(screen.getByText("Prévias")).toBeDisabled();
  });

  it("oculta Prévias quando já publicado", () => {
    setup({ consolidadoDre: { ...consolidadoBase, ja_publicado: true } });
    expect(screen.queryByText("Prévias")).not.toBeInTheDocument();
  });

  it("oculta Gerar quando não habilita_botao_gerar", () => {
    setup({ consolidadoDre: { ...consolidadoBase, habilita_botao_gerar: false } });
    expect(screen.queryByText("Gerar")).not.toBeInTheDocument();
  });

  it("tooltip: sem comissão, PCs não concluídas e vazio", () => {
    const { unmount } = setup({ existeComissaoResponsavelPC: false });
    expect(screen.getByTestId("antd-tooltip").dataset.title).toMatch(/Não há comissão/);
    expect(screen.getByTestId("btn-gerar")).toBeDisabled();
    unmount();
    todas.mockReturnValue(false);
    const u2 = setup();
    expect(screen.getByTestId("antd-tooltip").dataset.title).toMatch(/ainda não podem ser gerados/);
    u2.unmount();
    todas.mockReturnValue(true);
    setup();
    expect(screen.getByTestId("antd-tooltip").dataset.title).toBe("");
  });

  it("Gerar abre modal de publicar sem pendências e publica", () => {
    setup();
    fireEvent.click(screen.getByTestId("btn-gerar"));
    const modal = screen.getByTestId("modal-publicar");
    expect(modal.dataset.alerta).toBe("false");
    fireEvent.click(screen.getByText("publicar"));
    expect(publicarRetificacao).toHaveBeenCalledWith(consolidadoBase);
    fireEvent.click(screen.getByText("fechar-publicar"));
    expect(screen.queryByTestId("modal-publicar")).not.toBeInTheDocument();
  });

  it("Gerar com diferença de valores mas com justificativa abre modal de publicar", () => {
    const exec = {
      por_tipo_de_conta: [{ valores: { ...valoresIguais, repasses_no_periodo_total: 9 }, justificativa_texto: "j" }],
    };
    setup({ execucaoFinanceira: exec });
    fireEvent.click(screen.getByTestId("btn-gerar"));
    expect(screen.getByTestId("modal-publicar")).toBeInTheDocument();
  });

  it("Gerar sem motivo abre pendente com seção de motivo", () => {
    setup({ consolidadoDre: { ...consolidadoBase, motivo_retificacao: "" } });
    fireEvent.click(screen.getByTestId("btn-gerar"));
    const modal = screen.getByTestId("modal-pendente");
    expect(modal.dataset.motivo).toBe("true");
    expect(modal.dataset.just).toBe("false");
    fireEvent.click(screen.getByText("fechar-pendente"));
    expect(screen.queryByTestId("modal-pendente")).not.toBeInTheDocument();
  });

  it("Gerar com diferença sem justificativa abre pendente com seção de justificativa", () => {
    const exec = { por_tipo_de_conta: [{ valores: { ...valoresIguais, repasses_previstos_sme_custeio: 5 } }] };
    setup({ execucaoFinanceira: exec });
    fireEvent.click(screen.getByTestId("btn-gerar"));
    const modal = screen.getByTestId("modal-pendente");
    expect(modal.dataset.just).toBe("true");
    expect(modal.dataset.motivo).toBe("false");
  });

  it.each(["capital", "livre"])("detecta diferença em %s", (campo) => {
    const exec = { por_tipo_de_conta: [{ valores: { ...valoresIguais, [`repasses_no_periodo_${campo}`]: 99 } }] };
    setup({ execucaoFinanceira: exec });
    fireEvent.click(screen.getByTestId("btn-gerar"));
    expect(screen.getByTestId("modal-pendente").dataset.just).toBe("true");
  });

  it("valores nulos na conta não geram diferença", () => {
    setup({ execucaoFinanceira: { por_tipo_de_conta: [{ valores: null }] } });
    fireEvent.click(screen.getByTestId("btn-gerar"));
    expect(screen.getByTestId("modal-publicar")).toBeInTheDocument();
  });

  it("Gerar sem execucaoFinanceira e sem motivo abre pendente", () => {
    setup({ execucaoFinanceira: undefined, consolidadoDre: { ...consolidadoBase, motivo_retificacao: null } });
    fireEvent.click(screen.getByTestId("btn-gerar"));
    expect(screen.getByTestId("modal-pendente")).toBeInTheDocument();
  });

  it("handleClick não faz nada se carregando ou publicações parciais", () => {
    const { unmount } = setup({ execucaoFinanceiraCarregando: true });
    fireEvent.click(screen.getByTestId("btn-gerar"));
    expect(screen.queryByTestId("modal-publicar")).not.toBeInTheDocument();
    expect(screen.getByTestId("btn-gerar").dataset.loading).toBe("true");
    unmount();
    setup({ consolidadoDre: { ...consolidadoBase, eh_consolidado_de_publicacoes_parciais: true } });
    fireEvent.click(screen.getByTestId("btn-gerar"));
    expect(screen.queryByTestId("modal-publicar")).not.toBeInTheDocument();
    expect(screen.queryByTestId("modal-pendente")).not.toBeInTheDocument();
  });

  const abrePendente = () => {
    fireEvent.click(screen.getByTestId("btn-gerar"));
  };

  it("redireciona para justificação", () => {
    const exec = { por_tipo_de_conta: [{ valores: { ...valoresIguais, repasses_previstos_sme_total: 5 } }] };
    setup({ execucaoFinanceira: exec });
    abrePendente();
    fireEvent.click(screen.getByText("ir-just"));
    expect(assignMock).toHaveBeenCalledWith("/dre-relatorio-consolidado-em-tela/p1/false/c1");
  });

  it("redireciona para ata existente ao preencher motivo", () => {
    setup({ consolidadoDre: { ...consolidadoBase, motivo_retificacao: "", ata_de_parecer_tecnico: { uuid: "a1" } } });
    abrePendente();
    fireEvent.click(screen.getByText("ir-motivo"));
    expect(assignMock).toHaveBeenCalledWith("/edicao-da-ata-parecer-tecnico/a1/");
  });

  it("cria ata e redireciona ao preencher motivo sem ata", async () => {
    postCriarAtaAtrelarAoConsolidadoDre.mockResolvedValue({ uuid: "nova" });
    setup({ consolidadoDre: { ...consolidadoBase, motivo_retificacao: "" } });
    abrePendente();
    fireEvent.click(screen.getByText("ir-motivo"));
    await waitFor(() => expect(assignMock).toHaveBeenCalledWith("/edicao-da-ata-parecer-tecnico/nova"));
    expect(postCriarAtaAtrelarAoConsolidadoDre).toHaveBeenCalledWith({ dre: "d1", periodo: "p1", consolidado: "c1" });
  });

  it("trata erro ao criar ata", async () => {
    postCriarAtaAtrelarAoConsolidadoDre.mockRejectedValue(new Error("x"));
    setup({ consolidadoDre: { ...consolidadoBase, motivo_retificacao: "" } });
    abrePendente();
    fireEvent.click(screen.getByText("ir-motivo"));
    await waitFor(() => expect(console.log).toHaveBeenCalled());
    expect(assignMock).not.toHaveBeenCalled();
  });
});
