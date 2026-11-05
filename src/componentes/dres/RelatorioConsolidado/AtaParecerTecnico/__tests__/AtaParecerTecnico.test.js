import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AtaParecerTecnico } from "../index";
import { getDownloadAtaParecerTecnico } from "../../../../../services/dres/AtasParecerTecnico.service";
import { postCriarAtaAtrelarAoConsolidadoDre } from "../../../../../services/dres/RelatorioConsolidado.service";

jest.mock("../../../../../services/dres/AtasParecerTecnico.service", () => ({ getDownloadAtaParecerTecnico: jest.fn() }));
jest.mock("../../../../../services/dres/RelatorioConsolidado.service", () => ({ postCriarAtaAtrelarAoConsolidadoDre: jest.fn() }));
jest.mock("../../../../../utils/ValidacoesAdicionaisFormularios", () => ({ exibeDateTimePT_BR_Ata: jest.fn() }));
jest.mock("react-tooltip", () => ({ Tooltip: () => null }));
jest.mock("../ata-parecer-tecnico.scss", () => ({}), { virtual: true });

import { exibeDateTimePT_BR_Ata } from "../../../../../utils/ValidacoesAdicionaisFormularios";

const mockAssign = jest.fn();
const originalLocation = window.location;
beforeAll(() => { delete window.location; window.location = { assign: mockAssign }; });
afterAll(() => { window.location = originalLocation; });

const pode = jest.fn();
const setup = (consolidadoDre, comissao = true) =>
  render(<AtaParecerTecnico consolidadoDre={consolidadoDre} podeAcessarInfoConsolidado={pode} existeComissaoResponsavelPC={comissao} />);

describe("AtaParecerTecnico", () => {
  beforeEach(() => {
    pode.mockReturnValue(true);
    exibeDateTimePT_BR_Ata.mockImplementation((d) => `fmt(${d})`);
  });

  describe("sem ata", () => {
    it("mostra pendente e botão Preencher ata cria ata e navega", async () => {
      postCriarAtaAtrelarAoConsolidadoDre.mockResolvedValue({ uuid: "ata1" });
      const { container } = setup({ uuid: "c1", dre_uuid: "d", periodo_uuid: "p", ja_publicado: false });
      expect(screen.getByText("Documento pendente de geração")).toBeInTheDocument();
      expect(container.querySelector("p.ata-nao-preenchida")).toBeInTheDocument();
      fireEvent.click(screen.getByText("Preencher ata"));
      await waitFor(() => expect(mockAssign).toHaveBeenCalledWith("/visualizacao-da-ata-parecer-tecnico/ata1/false"));
      expect(postCriarAtaAtrelarAoConsolidadoDre).toHaveBeenCalledWith({ dre: "d", periodo: "p", consolidado: "c1" });
    });

    it("consolidado sem uuid envia null", async () => {
      postCriarAtaAtrelarAoConsolidadoDre.mockResolvedValue({ uuid: "ata1" });
      setup({ dre_uuid: "d", periodo_uuid: "p" });
      fireEvent.click(screen.getByText("Preencher ata"));
      await waitFor(() => expect(postCriarAtaAtrelarAoConsolidadoDre).toHaveBeenCalledWith({ dre: "d", periodo: "p", consolidado: null }));
    });

    it("erro na criação é capturado", async () => {
      const spy = jest.spyOn(console, "log").mockImplementation(() => {});
      postCriarAtaAtrelarAoConsolidadoDre.mockRejectedValue(new Error("x"));
      setup({ uuid: "c1" });
      fireEvent.click(screen.getByText("Preencher ata"));
      await waitFor(() => expect(spy).toHaveBeenCalled());
      expect(mockAssign).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    it("sem comissão: botão desabilitado e tooltip de comissão", () => {
      const { container } = setup({ uuid: "c1" }, false);
      expect(screen.getByText("Preencher ata")).toBeDisabled();
      expect(container.querySelector("[data-tooltip-html]").getAttribute("data-tooltip-html")).toMatch(/Não há comissão/);
    });

    it("sem acesso às infos: botão desabilitado e tooltip de retificação", () => {
      pode.mockReturnValue(false);
      const { container } = setup({ uuid: "c1" });
      expect(screen.getByText("Preencher ata")).toBeDisabled();
      expect(container.querySelector("[data-tooltip-html]").getAttribute("data-tooltip-html")).toMatch(/Não é possível preencher a ata/);
    });

    it("ata com uuid indefinido é tratada como pendente", () => {
      setup({ uuid: "c1", ata_de_parecer_tecnico: {} });
      expect(screen.getByText("Documento pendente de geração")).toBeInTheDocument();
    });
  });

  describe("com ata", () => {
    it("preenchida: mostra data, Consultar ata (publicado) e navega", () => {
      const { container } = setup({ uuid: "c1", ja_publicado: true, ata_de_parecer_tecnico: { uuid: "a1", alterado_em: "2024-01-01" } });
      expect(screen.getByText("Último preenchimento em fmt(2024-01-01)")).toBeInTheDocument();
      expect(container.querySelector("p.ata-preenchida")).toBeInTheDocument();
      fireEvent.click(screen.getByText("Consultar ata"));
      expect(mockAssign).toHaveBeenCalledWith("/visualizacao-da-ata-parecer-tecnico/a1/true");
    });

    it("não preenchida (alterado_em null): Preencher ata, classe não preenchida", () => {
      const { container } = setup({ uuid: "c1", ja_publicado: false, ata_de_parecer_tecnico: { uuid: "a1", alterado_em: null } });
      expect(screen.getByText("Ata não preenchida")).toBeInTheDocument();
      expect(container.querySelector("p.ata-nao-preenchida")).toBeInTheDocument();
      expect(screen.getByText("Preencher ata")).toBeEnabled();
    });

    it("alterado_em undefined não gera mensagem", () => {
      const { container } = setup({ uuid: "c1", ata_de_parecer_tecnico: { uuid: "a1" } });
      expect(container.querySelector("p.fonte-12 span").textContent).toBe("");
    });

    it("botão desabilitado sem comissão", () => {
      setup({ uuid: "c1", ata_de_parecer_tecnico: { uuid: "a1", alterado_em: null } }, false);
      expect(screen.getByText("Preencher ata")).toBeDisabled();
    });

    it("download do PDF", () => {
      const { container } = setup({ uuid: "c1", ata_de_parecer_tecnico: { uuid: "a1", alterado_em: "x", arquivo_pdf: "f.pdf" } });
      fireEvent.click(container.querySelector("button.btn-editar-membro svg"));
      expect(getDownloadAtaParecerTecnico).toHaveBeenCalledWith("a1");
    });
  });
});
