import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TopoComBotoes } from "../index";
import { visoesService } from "../../../../../../../services/visoes.service";

jest.mock("../../../../../../../services/visoes.service", () => ({
  visoesService: {
    getPermissoes: jest.fn(),
  },
}));

describe("TopoComBotoes Component", () => {
  const defaultProps = {
    dadosAta: {},
    paaRetificacao: false,
    handleClickEditarAta: jest.fn(),
    handleClickFecharAta: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Renderização e Condicionais de Título", () => {
    it("deve renderizar o título de prévia quando paaRetificacao for falso", () => {
      visoesService.getPermissoes.mockReturnValue(false);

      render(<TopoComBotoes {...defaultProps} paaRetificacao={false} />);

      const titulo = screen.getByText("Visualização da prévia da Ata de Apresentação do PAA");
      expect(titulo).toBeInTheDocument();
    });

    it("deve renderizar o título de retificação quando paaRetificacao for verdadeiro", () => {
      visoesService.getPermissoes.mockReturnValue(false);

      render(<TopoComBotoes {...defaultProps} paaRetificacao={true} />);

      const titulo = screen.getByText("Visualização da Ata de Retificação do PAA");
      expect(titulo).toBeInTheDocument();
    });
  });

  describe("Controle de Permissões e Botões", () => {
    it("deve renderizar apenas o botão 'Fechar' se o usuário não tiver permissão para editar", () => {
      visoesService.getPermissoes.mockReturnValue(false);

      render(<TopoComBotoes {...defaultProps} />);

      const botaoFechar = screen.getByRole("button", { name: /fechar/i });
      const botaoEditar = screen.queryByRole("button", { name: /editar ata/i });

      expect(botaoFechar).toBeInTheDocument();
      expect(botaoEditar).not.toBeInTheDocument();
    });

    it("deve renderizar ambos os botões ('Editar ata' e 'Fechar') se o usuário tiver permissão", () => {
      visoesService.getPermissoes.mockReturnValue(true);

      render(<TopoComBotoes {...defaultProps} />);

      const botaoFechar = screen.getByRole("button", { name: /fechar/i });
      const botaoEditar = screen.getByRole("button", { name: /editar ata/i });

      expect(botaoFechar).toBeInTheDocument();
      expect(botaoEditar).toBeInTheDocument();
      expect(visoesService.getPermissoes).toHaveBeenCalledWith(["custom_change_paa"]);
    });
  });

  describe("Interações do Usuário", () => {
    it("deve chamar a função handleClickFecharAta quando o botão 'Fechar' for clicado", async () => {
      visoesService.getPermissoes.mockReturnValue(false);
      const user = userEvent.setup();

      render(<TopoComBotoes {...defaultProps} />);

      const botaoFechar = screen.getByRole("button", { name: /fechar/i });
      await user.click(botaoFechar);

      expect(defaultProps.handleClickFecharAta).toHaveBeenCalledTimes(1);
    });

    it("deve chamar a função handleClickEditarAta quando o botão 'Editar ata' for clicado", async () => {
      visoesService.getPermissoes.mockReturnValue(true);
      const user = userEvent.setup();

      render(<TopoComBotoes {...defaultProps} />);

      const botaoEditar = screen.getByRole("button", { name: /editar ata/i });
      await user.click(botaoEditar);

      expect(defaultProps.handleClickEditarAta).toHaveBeenCalledTimes(1);
    });
  });
});