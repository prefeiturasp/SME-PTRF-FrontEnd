import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import BlocoPublicacaoParcial from "../BlocoPublicacaoParcial";
import { getExecucaoFinanceira } from "../../../../services/dres/RelatorioConsolidado.service";
import { visoesService } from "../../../../services/visoes.service";

jest.mock("../../../../services/visoes.service", () => ({ visoesService: { getItemUsuarioLogado: jest.fn() } }));
jest.mock("../../../../services/dres/RelatorioConsolidado.service", () => ({ getExecucaoFinanceira: jest.fn() }));

const mockPublicar = jest.fn();
const mockDemonstrativo = jest.fn();
const mockAta = jest.fn();
const mockLauda = jest.fn();

jest.mock("../PublicarDocumentos", () => (props) => {
  mockPublicar(props);
  return <div data-testid="publicar">{props.children}</div>;
});
jest.mock("../DemonstrativoDaExecucaoFisicoFinanceira", () => (props) => {
  mockDemonstrativo(props);
  return <div data-testid="demonstrativo" />;
});
jest.mock("../PreviaDocumento", () => (props) => (
  <button onClick={props.gerarPreviaConsolidadoDre}>previa</button>
));
jest.mock("../AtaParecerTecnico", () => ({
  AtaParecerTecnico: (props) => { mockAta(props); return <div data-testid="ata" />; },
}));
jest.mock("../Lauda", () => (props) => { mockLauda(props); return <div data-testid="lauda" />; });

const baseProps = () => ({
  isShowLauda: false,
  consolidadoDre: { uuid: "c1" },
  periodoEscolhido: "per1",
  podeGerarPreviaRetificacao: jest.fn().mockReturnValue("pode-previa"),
  podeAcessarInfoConsolidado: jest.fn(),
  gerarPreviaConsolidadoDre: jest.fn(),
  existeComissaoResponsavelPC: true,
});

describe("BlocoPublicacaoParcial", () => {
  beforeEach(() => {
    visoesService.getItemUsuarioLogado.mockReturnValue("dre-uuid");
    getExecucaoFinanceira.mockResolvedValue({ por_tipo_de_conta: [] });
  });

  it("carrega execução financeira e repassa aos filhos", async () => {
    const props = baseProps();
    render(<BlocoPublicacaoParcial {...props} />);
    await waitFor(() => expect(mockPublicar.mock.calls.at(-1)[0].execucaoFinanceiraCarregando).toBe(false));
    expect(getExecucaoFinanceira).toHaveBeenCalledWith("dre-uuid", "per1", "c1");
    expect(mockPublicar.mock.calls.at(-1)[0].execucaoFinanceira).toEqual({ por_tipo_de_conta: [] });
    expect(mockDemonstrativo.mock.calls.at(-1)[0].execucaoFinanceira).toEqual({ por_tipo_de_conta: [] });
    expect(props.podeGerarPreviaRetificacao).toHaveBeenCalledWith(props.consolidadoDre);
    expect(mockAta.mock.calls.at(-1)[0].podeGerarPreviaRetificacao).toBe("pode-previa");
    expect(screen.queryByTestId("lauda")).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("previa"));
    expect(props.gerarPreviaConsolidadoDre).toHaveBeenCalled();
  });

  it("renderiza Lauda quando isShowLauda", async () => {
    render(<BlocoPublicacaoParcial {...baseProps()} isShowLauda />);
    expect(screen.getByTestId("lauda")).toBeInTheDocument();
    await waitFor(() => expect(getExecucaoFinanceira).toHaveBeenCalled());
  });

  it("consolidadoDre.uuid 'null' envia string vazia", async () => {
    render(<BlocoPublicacaoParcial {...baseProps()} consolidadoDre={{ uuid: "null" }} />);
    await waitFor(() => expect(getExecucaoFinanceira).toHaveBeenCalledWith("dre-uuid", "per1", ""));
  });

  it("erro ao carregar é logado e mantém carregando", async () => {
    const spy = jest.spyOn(console, "log").mockImplementation(() => {});
    getExecucaoFinanceira.mockRejectedValue(new Error("falha"));
    render(<BlocoPublicacaoParcial {...baseProps()} />);
    await waitFor(() => expect(spy).toHaveBeenCalled());
    expect(mockPublicar.mock.calls.at(-1)[0].execucaoFinanceiraCarregando).toBe(true);
    spy.mockRestore();
  });
});
