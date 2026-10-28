import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PublicarDocumentos from "../PublicarDocumentos";
import { visoesService } from "../../../../services/visoes.service";

jest.mock("../../../../services/visoes.service", () => ({
  visoesService: { getPermissoes: jest.fn() },
}));

jest.mock("react-tooltip", () => ({ Tooltip: ({ id }) => <div data-testid={`react-tooltip-${id}`} /> }));

jest.mock("antd", () => ({
  Tooltip: ({ children, title }) => <div data-testid="antd-tooltip" data-title={title}>{children}</div>,
}));

jest.mock("../MarcarPublicacaoNoDiarioOficial/InfoPublicacaoNoDiarioOficial", () => () => <div data-testid="info-publicacao" />);
jest.mock("../MarcarPublicacaoNoDiarioOficial/BotaoMarcarPublicacaoNoDiarioOficial", () => () => <div data-testid="botao-marcar" />);
jest.mock("../Retificar", () => ({ Retificar: () => <div data-testid="retificar" /> }));
jest.mock("../PreviaDocumentoRetificado", () => () => <div data-testid="previa-retificado" />);

jest.mock("../../../../utils/Modais", () => ({
  ModalPublicarRelatorioConsolidado: ({ show, alertaJustificativa, publicarConsolidadoDre, handleClose }) =>
    show ? (
      <div data-testid="modal-publicar" data-alerta={String(alertaJustificativa)}>
        <button onClick={publicarConsolidadoDre}>confirmar</button>
        <button onClick={handleClose}>fechar-publicar</button>
      </div>
    ) : null,
  ModalPublicarRelatorioConsolidadoPendente: ({ show, handleClose }) =>
    show ? (
      <div data-testid="modal-pendente">
        <button onClick={handleClose}>fechar-pendente</button>
      </div>
    ) : null,
}));

const iguais = {
  repasses_previstos_sme_custeio: 1, repasses_no_periodo_custeio: 1,
  repasses_previstos_sme_capital: 1, repasses_no_periodo_capital: 1,
  repasses_previstos_sme_livre: 1, repasses_no_periodo_livre: 1,
  repasses_previstos_sme_total: 3, repasses_no_periodo_total: 3,
};

const consolidadoBase = {
  uuid: "c1",
  titulo_relatorio: "Publicação 1",
  ja_publicado: false,
  eh_retificacao: false,
  habilita_botao_gerar: true,
  eh_consolidado_de_publicacoes_parciais: false,
  texto_tool_tip_botao_gerar: "dica",
};

describe("PublicarDocumentos", () => {
  let publicarConsolidadoDre, podeGerarPrevia;

  const setup = (props = {}) =>
    render(
      <PublicarDocumentos
        publicarConsolidadoDre={publicarConsolidadoDre}
        podeGerarPrevia={podeGerarPrevia}
        consolidadoDre={consolidadoBase}
        execucaoFinanceira={{ por_tipo_de_conta: [{ valores: iguais }] }}
        disableGerar={false}
        existeComissaoResponsavelPC={true}
        {...props}
      >
        <span data-testid="filho">Prévia</span>
      </PublicarDocumentos>
    );

  beforeEach(() => {
    publicarConsolidadoDre = jest.fn();
    podeGerarPrevia = jest.fn().mockReturnValue(true);
    visoesService.getPermissoes.mockReturnValue(true);
  });

  it("renderiza título e componentes filhos fixos", () => {
    setup();
    expect(screen.getByText("Publicação 1")).toBeInTheDocument();
    ["info-publicacao", "botao-marcar", "previa-retificado", "retificar"].forEach((id) =>
      expect(screen.getByTestId(id)).toBeInTheDocument()
    );
  });

  it("exibe children quando pode gerar prévia, e não exibe quando não pode", () => {
    const { unmount } = setup();
    expect(screen.getByTestId("filho")).toBeInTheDocument();
    unmount();
    podeGerarPrevia.mockReturnValue(false);
    setup();
    expect(screen.queryByTestId("filho")).not.toBeInTheDocument();
  });

  it("oculta bloco de gerar quando ja_publicado, eh_retificacao ou removerBtnGerar", () => {
    const { unmount } = setup({ consolidadoDre: { ...consolidadoBase, ja_publicado: true } });
    expect(screen.queryByText("Gerar")).not.toBeInTheDocument();
    unmount();
    const u2 = setup({ consolidadoDre: { ...consolidadoBase, eh_retificacao: true } });
    expect(screen.queryByText("Gerar")).not.toBeInTheDocument();
    u2.unmount();
    setup({ removerBtnGerar: true });
    expect(screen.queryByText("Gerar")).not.toBeInTheDocument();
  });

  it("Gerar sem diferenças abre modal de publicação sem alerta e publica", () => {
    setup();
    fireEvent.click(screen.getByText("Gerar"));
    expect(screen.getByTestId("modal-publicar").dataset.alerta).toBe("false");
    fireEvent.click(screen.getByText("confirmar"));
    expect(publicarConsolidadoDre).toHaveBeenCalledWith(consolidadoBase, expect.any(Function));
    fireEvent.click(screen.getByText("fechar-publicar"));
    expect(screen.queryByTestId("modal-publicar")).not.toBeInTheDocument();
  });

  it("Gerar com justificativa abre modal de publicação", () => {
    setup({
      execucaoFinanceira: {
        por_tipo_de_conta: [{ valores: { ...iguais, repasses_no_periodo_custeio: 9 }, justificativa_texto: "j" }],
      },
    });
    fireEvent.click(screen.getByText("Gerar"));
    expect(screen.getByTestId("modal-publicar")).toBeInTheDocument();
  });

  it.each(["custeio", "capital", "livre", "total"])("diferença em %s sem justificativa abre modal pendente", (campo) => {
    setup({
      execucaoFinanceira: {
        por_tipo_de_conta: [{ valores: { ...iguais, [`repasses_no_periodo_${campo}`]: 99 } }],
      },
    });
    fireEvent.click(screen.getByText("Gerar"));
    expect(screen.getByTestId("modal-pendente")).toBeInTheDocument();
    expect(screen.queryByTestId("modal-publicar")).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("fechar-pendente"));
    expect(screen.queryByTestId("modal-pendente")).not.toBeInTheDocument();
  });

  it("valores nulos não geram diferença; execucaoFinanceira ausente abre modal de publicação", () => {
    const { unmount } = setup({ execucaoFinanceira: { por_tipo_de_conta: [{ valores: null }] } });
    fireEvent.click(screen.getByText("Gerar"));
    expect(screen.getByTestId("modal-publicar")).toBeInTheDocument();
    unmount();
    setup({ execucaoFinanceira: undefined });
    fireEvent.click(screen.getByText("Gerar"));
    expect(screen.getByTestId("modal-publicar")).toBeInTheDocument();
  });

  it("handleClick não faz nada em publicações parciais", () => {
    setup({ consolidadoDre: { ...consolidadoBase, eh_consolidado_de_publicacoes_parciais: true } });
    fireEvent.click(screen.getByText("Gerar"));
    expect(screen.queryByTestId("modal-publicar")).not.toBeInTheDocument();
    expect(screen.queryByTestId("modal-pendente")).not.toBeInTheDocument();
  });

  it("Gerar desabilitado sem comissão, disableGerar ou permissão", () => {
    const u1 = setup({ existeComissaoResponsavelPC: false });
    expect(screen.getByText("Gerar")).toBeDisabled();
    expect(screen.getByTestId("antd-tooltip").dataset.title).toMatch(/Não há comissão/);
    u1.unmount();
    const u2 = setup({ disableGerar: true });
    expect(screen.getByText("Gerar")).toBeDisabled();
    expect(screen.getByTestId("antd-tooltip").dataset.title).toBe("");
    u2.unmount();
    visoesService.getPermissoes.mockReturnValue(false);
    setup();
    expect(screen.getByText("Gerar")).toBeDisabled();
  });

  it("sem habilita_botao_gerar exibe botão desabilitado com tooltip", () => {
    setup({ consolidadoDre: { ...consolidadoBase, habilita_botao_gerar: false } });
    const btn = screen.getByText("Gerar");
    expect(btn).toBeDisabled();
    expect(screen.getByTestId("react-tooltip-tooltip-gerar-c1")).toBeInTheDocument();
    expect(btn.parentElement.getAttribute("data-tooltip-html")).toBe("dica");
    fireEvent.click(btn);
  });

  it("sem habilita_botao_gerar e em publicações parciais não exibe Gerar", () => {
    setup({
      consolidadoDre: { ...consolidadoBase, habilita_botao_gerar: false, eh_consolidado_de_publicacoes_parciais: true },
    });
    expect(screen.queryByText("Gerar")).not.toBeInTheDocument();
  });
});
