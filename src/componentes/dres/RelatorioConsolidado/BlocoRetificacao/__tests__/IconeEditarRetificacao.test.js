import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import IconeEditarRetificacao from "../IconeEditarRetificacao";
import { visoesService } from "../../../../../services/visoes.service";
import { useRecursoSelecionadoContext } from "../../../../../context/RecursoSelecionado";
import { TextoDocumentoConsolidadoPC } from "../../../../../utils/TextoDocumentoConsolidadoPC";

jest.mock("../../../../../services/visoes.service", () => ({
  visoesService: {
    getPermissoes: jest.fn(),
  },
}));

jest.mock("../../../../../context/RecursoSelecionado", () => ({
  useRecursoSelecionadoContext: jest.fn(),
}));

jest.mock("../../../../Globais/UI/Button", () => ({
  EditIconButton: ({ tooltipMessage, onClick, disabled }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-tooltip={tooltipMessage}
    >
      Editar
    </button>
  ),
}));

const normalizaEspacos = (texto) => texto.replace(/\s+/g, " ").trim();

describe("IconeEditarRetificacao Component", () => {
  const mockConsolidadoDre = {
    ja_publicado: true,
    data_publicacao: "2025-03-10",
    pagina_publicacao: "42",
    eh_retificacao: true,
  };

  const mockContexto = (habilitaLauda = false) => {
    useRecursoSelecionadoContext.mockReturnValue({
      recursoSelecionado: { habilita_exibicao_de_lauda: habilitaLauda },
      textDocumentConsolidadoPC: new TextoDocumentoConsolidadoPC(habilitaLauda),
    });
  };

  const obtemTooltip = () =>
    normalizaEspacos(
      screen.getByRole("button", { name: "Editar" }).getAttribute("data-tooltip")
    );

  beforeEach(() => {
    jest.clearAllMocks();
    visoesService.getPermissoes.mockReturnValue(true);
    mockContexto();
  });

  describe("Condições de exibição", () => {
    it("deve renderizar o botão de edição quando o consolidado for uma retificação publicada", () => {
      render(<IconeEditarRetificacao consolidadoDre={mockConsolidadoDre} />);

      expect(screen.getByRole("button", { name: "Editar" })).toBeInTheDocument();
    });

    it("não deve renderizar o botão quando consolidadoDre não for informado", () => {
      render(<IconeEditarRetificacao consolidadoDre={null} />);

      expect(screen.queryByRole("button", { name: "Editar" })).not.toBeInTheDocument();
    });

    it.each([
      ["não estiver publicado", { ja_publicado: false }],
      ["não tiver data de publicação", { data_publicacao: null }],
      ["não for uma retificação", { eh_retificacao: false }],
    ])("não deve renderizar o botão quando o consolidado %s", (_, alteracao) => {
      render(
        <IconeEditarRetificacao
          consolidadoDre={{ ...mockConsolidadoDre, ...alteracao }}
        />
      );

      expect(screen.queryByRole("button", { name: "Editar" })).not.toBeInTheDocument();
    });
  });

  describe("Permissão de edição", () => {
    it("deve habilitar o botão quando o usuário tiver permissão", () => {
      render(<IconeEditarRetificacao consolidadoDre={mockConsolidadoDre} />);

      expect(screen.getByRole("button", { name: "Editar" })).toBeEnabled();
      expect(visoesService.getPermissoes).toHaveBeenCalledWith([
        "change_relatorio_consolidado_dre",
      ]);
    });

    it("deve desabilitar o botão quando o usuário não tiver permissão", () => {
      visoesService.getPermissoes.mockReturnValue(false);

      render(<IconeEditarRetificacao consolidadoDre={mockConsolidadoDre} />);

      expect(screen.getByRole("button", { name: "Editar" })).toBeDisabled();
    });
  });

  describe("Mensagem do tooltip", () => {
    it("deve exibir a data do envio sem a página quando a lauda não estiver habilitada", () => {
      render(<IconeEditarRetificacao consolidadoDre={mockConsolidadoDre} />);

      const tooltip = obtemTooltip();

      expect(tooltip).toContain("<p class='mb-1'>Data envio: 10/03/2025</p>");
      expect(tooltip).not.toContain("Página publicação");
    });

    it("deve exibir a data e a página da publicação quando a lauda estiver habilitada", () => {
      mockContexto(true);

      render(<IconeEditarRetificacao consolidadoDre={mockConsolidadoDre} />);

      const tooltip = obtemTooltip();

      expect(tooltip).toContain("<p class='mb-1'>Data publicação: 10/03/2025</p>");
      expect(tooltip).toContain("<p class='mb-1'>Página publicação: 42</p>");
    });
  });

  describe("Clique no botão", () => {
    it("deve registrar o evento no console ao ser clicado", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

      render(<IconeEditarRetificacao consolidadoDre={mockConsolidadoDre} />);

      fireEvent.click(screen.getByRole("button", { name: "Editar" }));

      expect(consoleSpy).toHaveBeenCalledTimes(1);

      consoleSpy.mockRestore();
    });
  });
});
