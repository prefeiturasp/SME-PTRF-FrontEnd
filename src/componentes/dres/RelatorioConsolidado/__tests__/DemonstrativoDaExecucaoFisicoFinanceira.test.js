import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Demonstrativo from "../DemonstrativoDaExecucaoFisicoFinanceira";
import { getDownloadRelatorio } from "../../../../services/dres/RelatorioConsolidado.service";
import { haDiferencaPrevisaoExecucaoRepasse } from "../haDiferencaPrevisaoExecucaoRepasse";

jest.mock("../../../../services/dres/RelatorioConsolidado.service", () => ({ getDownloadRelatorio: jest.fn() }));
jest.mock("../haDiferencaPrevisaoExecucaoRepasse", () => ({ haDiferencaPrevisaoExecucaoRepasse: jest.fn() }));
jest.mock("react-tooltip", () => ({ Tooltip: () => <div data-testid="tooltip" /> }));

const mockAssign = jest.fn();
const originalLocation = window.location;

beforeAll(() => {
  delete window.location;
  window.location = { assign: mockAssign };
});
afterAll(() => {
  window.location = originalLocation;
});

const pode = jest.fn();

const setup = (consolidadoDre, execucaoFinanceira = false) =>
  render(<Demonstrativo consolidadoDre={consolidadoDre} periodoEscolhido="per1" execucaoFinanceira={execucaoFinanceira} podeAcessarInfoConsolidado={pode} />);

describe("DemonstrativoDaExecucaoFisicoFinanceira", () => {
  beforeEach(() => {
    pode.mockReturnValue(true);
    haDiferencaPrevisaoExecucaoRepasse.mockReturnValue(false);
  });

  describe("com relatórios", () => {
    const rel = (o) => ({ uuid: "r" + Math.random(), versao: "FINAL", ...o });

    it("gerado: título com conta, download e consultar resumo", () => {
      const r = rel({ uuid: "r1", tipo_conta: "Cheque", status_geracao: "GERADO_TOTAL", status_geracao_arquivo: "Gerado ok" });
      const { container } = setup({ uuid: "c1", ja_publicado: false, relatorios_fisico_financeiros: [r] });
      expect(screen.getByText(/Conta Cheque/)).toBeInTheDocument();
      expect(container.querySelector("p.documento-gerado")).toBeInTheDocument();
      fireEvent.click(container.querySelector("svg"));
      expect(getDownloadRelatorio).toHaveBeenCalledWith("r1", "FINAL");
      fireEvent.click(screen.getByText("Consultar resumo"));
      expect(mockAssign).toHaveBeenCalledWith("/dre-relatorio-consolidado-em-tela/per1/false/c1");
    });

    it("parcial gerado também mostra download", () => {
      const { container } = setup({ uuid: "c1", relatorios_fisico_financeiros: [rel({ status_geracao: "GERADO_PARCIAL" })] });
      expect(container.querySelector("button.btn-editar-membro")).toBeInTheDocument();
    });

    it("pendente mostra spinner e classe pendente (sem conta)", () => {
      const { container } = setup({ uuid: "c1", relatorios_fisico_financeiros: [rel({ status_geracao: "NAO_GERADOS" })] });
      expect(container.querySelector("img")).toBeInTheDocument();
      expect(container.querySelector("p.documento-pendente")).toBeInTheDocument();
    });

    it("em processamento", () => {
      const { container } = setup({ uuid: "c1", relatorios_fisico_financeiros: [rel({ status_geracao: "EM_PROCESSAMENTO" })] });
      expect(container.querySelector("p.documento-processando")).toBeInTheDocument();
    });

    it("consolidado de publicações parciais não mostra Consultar resumo", () => {
      setup({ uuid: "c1", eh_consolidado_de_publicacoes_parciais: true, relatorios_fisico_financeiros: [rel({ status_geracao: "GERADO_TOTAL" })] });
      expect(screen.queryByText("Consultar resumo")).not.toBeInTheDocument();
    });
  });

  describe("sem relatórios", () => {
    it("mostra pendente e botão Consultar resumo habilitado", () => {
      setup({ uuid: "c1", ja_publicado: true, relatorios_fisico_financeiros: [] });
      expect(screen.getByText("Documento pendente de geração")).toBeInTheDocument();
      const btn = screen.getByText("Consultar resumo");
      expect(btn).toBeEnabled();
      fireEvent.click(btn);
      expect(mockAssign).toHaveBeenCalledWith("/dre-relatorio-consolidado-em-tela/per1/true/c1");
      expect(screen.getByTestId("tooltip")).toBeInTheDocument();
    });

    it("botão desabilitado quando não pode acessar", () => {
      pode.mockReturnValue(false);
      const { container } = setup({ uuid: "c1" });
      expect(screen.getByText("Consultar resumo")).toBeDisabled();
      expect(container.querySelector("[data-tooltip-html]").getAttribute("data-tooltip-html")).toMatch(/Não é possível consultar/);
    });

    it("consolidado parcial não exibe botão", () => {
      setup({ uuid: "c1", eh_consolidado_de_publicacoes_parciais: true });
      expect(screen.queryByText("Consultar resumo")).not.toBeInTheDocument();
    });

    // isDiferencaValores() é chamado sem argumento (relatorio undefined)
    it("com execucaoFinanceira e diferença: 'Preencher resumo'", () => {
      haDiferencaPrevisaoExecucaoRepasse.mockReturnValue(true);
      setup({ uuid: "c1" }, { por_tipo_de_conta: [{ valores: {} }] });
      expect(screen.getByText("Preencher resumo")).toBeInTheDocument();
    });

    it("com execucaoFinanceira sem diferença: 'Consultar resumo'", () => {
      setup({ uuid: "c1" }, { por_tipo_de_conta: [{ valores: {} }] });
      expect(screen.getByText("Consultar resumo")).toBeInTheDocument();
    });
  });
});
