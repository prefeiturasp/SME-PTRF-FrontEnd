import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { TopoComBotoes } from "../TopoComBotoes";
import { visoesService } from "../../../../../../services/visoes.service";

jest.mock("../../../../../../services/visoes.service", () => ({
  visoesService: {
    getPermissoes: jest.fn(),
  },
}));

describe("TopoComBotoes Component", () => {
  const mockDadosAta = {
    periodo: {
      referencia: "2025.1",
    },
    arquivo_pdf: "https://exemplo.com/ata.pdf",
  };

  const renderComponente = (props = {}) => {
    const propsPadrao = {
      dadosAta: mockDadosAta,
      retornaDadosAtaFormatado: jest.fn((campo) => `[${campo}]`),
      handleClickFecharAtaParecerTecnico: jest.fn(),
      handleClickEditarAta: jest.fn(),
      downloadAtaParecerTecnico: jest.fn(),
      retornaTituloCabecalhoAta: jest.fn(() => "Ata de Parecer Técnico Conclusivo"),
      jaPublicado: false,
      ...props,
    };

    render(<TopoComBotoes {...propsPadrao} />);

    return propsPadrao;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    visoesService.getPermissoes.mockReturnValue(true);
  });

  describe("Renderização do cabeçalho", () => {
    it("deve renderizar o título do cabeçalho da ata", () => {
      renderComponente();

      expect(
        screen.getByText("Ata de Parecer Técnico Conclusivo")
      ).toBeInTheDocument();
    });

    it("deve renderizar o período com referência e datas formatadas", () => {
      const { retornaDadosAtaFormatado } = renderComponente();

      expect(
        screen.getByText(
          "Período 2025.1 - [periodo.data_inicio_realizacao_despesas] até [periodo.data_fim_realizacao_despesas]"
        )
      ).toBeInTheDocument();
      expect(retornaDadosAtaFormatado).toHaveBeenCalledWith(
        "periodo.data_inicio_realizacao_despesas"
      );
      expect(retornaDadosAtaFormatado).toHaveBeenCalledWith(
        "periodo.data_fim_realizacao_despesas"
      );
    });
  });

  describe("Botão Editar ata", () => {
    it("deve estar habilitado quando o usuário tiver permissão e a ata não estiver publicada", () => {
      renderComponente();

      expect(
        screen.getByRole("button", { name: "Editar ata" })
      ).toBeEnabled();
      expect(visoesService.getPermissoes).toHaveBeenCalledWith(
        ["change_ata_parecer_tecnico"],
        0,
        [["change_ata_parecer_tecnico"]]
      );
    });

    it("deve estar desabilitado quando o usuário não tiver permissão", () => {
      visoesService.getPermissoes.mockReturnValue(false);

      renderComponente();

      expect(
        screen.getByRole("button", { name: "Editar ata" })
      ).toBeDisabled();
    });

    it("não deve ser renderizado quando a ata já estiver publicada", () => {
      renderComponente({ jaPublicado: true });

      expect(
        screen.queryByRole("button", { name: "Editar ata" })
      ).not.toBeInTheDocument();
    });

    it("deve chamar handleClickEditarAta ao ser clicado", () => {
      const { handleClickEditarAta } = renderComponente();

      fireEvent.click(screen.getByRole("button", { name: "Editar ata" }));

      expect(handleClickEditarAta).toHaveBeenCalledTimes(1);
    });
  });

  describe("Botão Baixar ata", () => {
    it("deve ser renderizado quando existir arquivo PDF da ata", () => {
      renderComponente();

      expect(
        screen.getByRole("button", { name: "Baixar ata" })
      ).toBeInTheDocument();
    });

    it("não deve ser renderizado quando não existir arquivo PDF da ata", () => {
      renderComponente({
        dadosAta: { ...mockDadosAta, arquivo_pdf: null },
      });

      expect(
        screen.queryByRole("button", { name: "Baixar ata" })
      ).not.toBeInTheDocument();
    });

    it("deve chamar downloadAtaParecerTecnico ao ser clicado", () => {
      const { downloadAtaParecerTecnico } = renderComponente();

      fireEvent.click(screen.getByRole("button", { name: "Baixar ata" }));

      expect(downloadAtaParecerTecnico).toHaveBeenCalledTimes(1);
    });
  });

  describe("Botão Fechar", () => {
    it("deve ser renderizado mesmo quando a ata já estiver publicada", () => {
      renderComponente({ jaPublicado: true });

      expect(
        screen.getByRole("button", { name: "Fechar" })
      ).toBeInTheDocument();
    });

    it("deve chamar handleClickFecharAtaParecerTecnico ao ser clicado", () => {
      const { handleClickFecharAtaParecerTecnico } = renderComponente();

      fireEvent.click(screen.getByRole("button", { name: "Fechar" }));

      expect(handleClickFecharAtaParecerTecnico).toHaveBeenCalledTimes(1);
    });
  });
});
