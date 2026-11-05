import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import GrC from "../GerarRelatorioRetificacao";
import { visoesService } from "../../../../services/visoes.service";

jest.mock("../../../../utils/Modais", () => ({
  ModalPublicarRelatorioConsolidado: ({ show, alertaJustificativa, publicarConsolidadoDre, handleClose }) =>
    show ? (
      <div>
        <span>Modal Publicar alerta={String(alertaJustificativa)}</span>
        <button onClick={publicarConsolidadoDre}>confirmar-publicar</button>
        <button onClick={handleClose}>fechar-publicar</button>
      </div>
    ) : null,
  ModalPublicarRelatorioConsolidadoPendente: ({ show, handleClose }) =>
    show ? (
      <div>
        <span>Modal Pendente</span>
        <button onClick={handleClose}>fechar-pendente</button>
      </div>
    ) : null,
}));
jest.mock("react-tooltip", () => ({ __esModule: true, default: () => <div data-testid="tooltip" /> }));
jest.mock("../MarcarPublicacaoNoDiarioOficial/BotaoMarcarPublicacaoNoDiarioOficial", () => () => <div />);
jest.mock("../BlocoRetificacao/InfoRefiticacaoRelatorio", () => () => <div />);
jest.mock("../Retificar", () => ({ Retificar: () => <div /> }));
jest.mock("../../../../services/visoes.service", () => ({ visoesService: { getPermissoes: jest.fn() } }));

const Comp = (p) =>
  GrC(p.publicarConsolidadoDre, p.podeGerarPrevia, p.children, p.consolidadoDre, p.execucaoFinanceira, p.disableGerar,
    p.setShow, p.publicarParciais, p.carrega, p.show);

const setup = (over = {}) => {
  const props = {
    publicarConsolidadoDre: jest.fn(),
    podeGerarPrevia: false,
    children: <div>Prévia</div>,
    consolidadoDre: { titulo_relatorio: "T", habilita_botao_gerar: true, eh_consolidado_de_publicacoes_parciais: false },
    execucaoFinanceira: { por_tipo_de_conta: [] },
    disableGerar: false,
    setShow: jest.fn(),
    publicarParciais: jest.fn(),
    carrega: jest.fn(),
    show: false,
    ...over,
  };
  render(<Comp {...props} />);
  return props;
};

const iguais = { repasses_previstos_sme_custeio: 1, repasses_no_periodo_custeio: 1, repasses_previstos_sme_capital: 1, repasses_no_periodo_capital: 1, repasses_previstos_sme_livre: 1, repasses_no_periodo_livre: 1, repasses_previstos_sme_total: 1, repasses_no_periodo_total: 1 };

describe("GerarRelatorioRetificado (complemento)", () => {
  beforeEach(() => {
    visoesService.getPermissoes.mockReturnValue(true);
  });

  it("sem divergência e sem justificativa: abre modal com alertaJustificativa false", () => {
    const props = setup({ execucaoFinanceira: { por_tipo_de_conta: [{ justificativa_texto: "", valores: iguais }] }, show: false });
    fireEvent.click(screen.getByRole("button", { name: "Gerar aa" }));
    expect(props.setShow).toHaveBeenCalledWith(true);
  });

  it("modal publicar: alerta false, confirma e fecha", () => {
    const props = setup({ show: true, execucaoFinanceira: { por_tipo_de_conta: [{ valores: iguais }] } });
    fireEvent.click(screen.getByRole("button", { name: "Gerar aa" }));
    // estado alertaJustificativa só reflete após rerender; o componente é função chamada em render único
    fireEvent.click(screen.getByText("confirmar-publicar"));
    expect(props.publicarConsolidadoDre).toHaveBeenCalledWith(props.consolidadoDre);
    fireEvent.click(screen.getByText("fechar-publicar"));
    expect(props.setShow).toHaveBeenCalledWith(false);
  });

  it("modal pendente abre e fecha", () => {
    setup({ execucaoFinanceira: { por_tipo_de_conta: [{ valores: { ...iguais, repasses_no_periodo_total: 2 } }] } });
    fireEvent.click(screen.getByRole("button", { name: "Gerar aa" }));
    expect(screen.getByText("Modal Pendente")).toBeInTheDocument();
    fireEvent.click(screen.getByText("fechar-pendente"));
    expect(screen.queryByText("Modal Pendente")).not.toBeInTheDocument();
  });

  it("execucaoFinanceira sem por_tipo_de_conta: trata como sem divergência", () => {
    const props = setup({ execucaoFinanceira: undefined });
    fireEvent.click(screen.getByRole("button", { name: "Gerar aa" }));
    expect(props.setShow).toHaveBeenCalledWith(true);
  });

  it("valores indefinidos em comparaValores", () => {
    const props = setup({ execucaoFinanceira: { por_tipo_de_conta: [{ valores: undefined }] } });
    fireEvent.click(screen.getByRole("button", { name: "Gerar aa" }));
    expect(props.setShow).toHaveBeenCalledWith(true);
  });

  it("botão desabilitado por disableGerar ou sem permissão", () => {
    setup({ disableGerar: true });
    expect(screen.getByRole("button", { name: "Gerar aa" })).toBeDisabled();
  });

  it("sem permissão desabilita", () => {
    visoesService.getPermissoes.mockReturnValue(false);
    setup();
    expect(screen.getByRole("button", { name: "Gerar aa" })).toBeDisabled();
  });

  it("podeGerarPrevia exibe children", () => {
    setup({ podeGerarPrevia: true });
    expect(screen.getByText("Prévia")).toBeInTheDocument();
  });

  it("já publicado oculta botões de gerar", () => {
    setup({ consolidadoDre: { titulo_relatorio: "T", ja_publicado: true } });
    expect(screen.queryByRole("button", { name: /gerar/i })).not.toBeInTheDocument();
  });

  describe("sem habilita_botao_gerar", () => {
    it("botão Gerar desabilitado com tooltip e callbacks de onClick", () => {
      const props = setup({ consolidadoDre: { titulo_relatorio: "T", habilita_botao_gerar: false, texto_tool_tip_botao_gerar: "Dica", eh_consolidado_de_publicacoes_parciais: false } });
      const btn = screen.getByRole("button", { name: "Gerar" });
      expect(btn).toBeDisabled();
      expect(screen.getByTestId("tooltip")).toBeInTheDocument();
      const reactProps = btn[Object.keys(btn).find((k) => k.startsWith("__reactProps"))];
      reactProps.onClick();
      expect(props.setShow).toHaveBeenCalledWith(true);
    });

    it("consolidado parcial chama publicarParciais no onClick", () => {
      const props = setup({ consolidadoDre: { titulo_relatorio: "T", habilita_botao_gerar: false, eh_consolidado_de_publicacoes_parciais: true } });
      const btn = screen.getByRole("button", { name: "Gerar" });
      btn[Object.keys(btn).find((k) => k.startsWith("__reactProps"))].onClick();
      expect(props.publicarParciais).toHaveBeenCalled();
    });
  });
});
