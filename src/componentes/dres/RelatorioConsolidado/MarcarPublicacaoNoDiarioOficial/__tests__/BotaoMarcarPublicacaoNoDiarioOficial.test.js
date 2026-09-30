import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import BotaoMarcarPublicacaoNoDiarioOficial from "../BotaoMarcarPublicacaoNoDiarioOficial";
import { visoesService } from "../../../../../services/visoes.service";
import { useRecursoSelecionadoContext } from "../../../../../context/RecursoSelecionado";

jest.mock("../../../../../services/visoes.service", () => ({
  visoesService: {
    getPermissoes: jest.fn(),
  },
}));

jest.mock("../../../../../context/RecursoSelecionado", () => ({
  useRecursoSelecionadoContext: jest.fn(),
}));

const mockModalMarcarPublicacao = jest.fn();

jest.mock("../../ModalMarcarPublicacaoNoDiarioOficial", () => ({
  ModalMarcarPublicacaoNoDiarioOficial: (props) => {
    mockModalMarcarPublicacao(props);
    return props.show ? (
      <div data-testid="modal-marcar-publicacao">
        <span>{props.titulo}</span>
        <button onClick={props.handleClose}>Fechar modal</button>
      </div>
    ) : null;
  },
}));

describe("BotaoMarcarPublicacaoNoDiarioOficial Component", () => {
  const mockConsolidadoDre = {
    uuid: "consolidado-uuid-1",
    ja_publicado: true,
    data_publicacao: null,
  };

  const mockCarregaConsolidados = jest.fn();

  const mockContexto = (habilitaLauda = false) => {
    useRecursoSelecionadoContext.mockReturnValue({
      recursoSelecionado: { habilita_exibicao_de_lauda: habilitaLauda },
    });
  };

  const renderComponente = (consolidadoDre = mockConsolidadoDre) =>
    render(
      <BotaoMarcarPublicacaoNoDiarioOficial
        consolidadoDre={consolidadoDre}
        carregaConsolidadosDreJaPublicadosProximaPublicacao={mockCarregaConsolidados}
      />
    );

  const ultimasPropsDoModal = () =>
    mockModalMarcarPublicacao.mock.calls[
      mockModalMarcarPublicacao.mock.calls.length - 1
    ][0];

  beforeEach(() => {
    jest.clearAllMocks();
    visoesService.getPermissoes.mockReturnValue(true);
    mockContexto();
  });

  describe("Condições de exibição do botão", () => {
    it("deve renderizar o botão quando o consolidado estiver publicado e sem data de publicação", () => {
      renderComponente();

      expect(
        screen.getByRole("button", { name: "Informar envio externo" })
      ).toBeInTheDocument();
    });

    it("não deve renderizar o botão quando o consolidado não estiver publicado", () => {
      renderComponente({ ...mockConsolidadoDre, ja_publicado: false });

      expect(
        screen.queryByRole("button", { name: "Informar envio externo" })
      ).not.toBeInTheDocument();
    });

    it("não deve renderizar o botão quando o consolidado já tiver data de publicação", () => {
      renderComponente({ ...mockConsolidadoDre, data_publicacao: "2025-03-10" });

      expect(
        screen.queryByRole("button", { name: "Informar envio externo" })
      ).not.toBeInTheDocument();
    });

    it("não deve renderizar o botão quando consolidadoDre não for informado", () => {
      renderComponente(null);

      expect(screen.queryByRole("button", { name: /Informar/ })).not.toBeInTheDocument();
    });
  });

  describe("Textos conforme a lauda", () => {
    it("deve usar os textos de envio externo quando a lauda não estiver habilitada", () => {
      renderComponente();

      expect(
        screen.getByRole("button", { name: "Informar envio externo" })
      ).toBeInTheDocument();
      expect(ultimasPropsDoModal()).toMatchObject({
        titulo: "Informar data do envio da documentação",
        textoMsg: "Data  com sucesso.",
        textoBotaoSalvar: "Informar",
      });
    });

    it("deve usar os textos de publicação quando a lauda estiver habilitada", () => {
      mockContexto(true);

      renderComponente();

      expect(
        screen.getByRole("button", { name: "Informar publicação" })
      ).toBeInTheDocument();
      expect(ultimasPropsDoModal()).toMatchObject({
        titulo: "Informar publicação",
        textoMsg: "Data e página da publicação com sucesso.",
        textoBotaoSalvar: "Informar",
      });
    });
  });

  describe("Permissão", () => {
    it("deve habilitar o botão quando o usuário tiver permissão", () => {
      renderComponente();

      expect(
        screen.getByRole("button", { name: "Informar envio externo" })
      ).toBeEnabled();
      expect(visoesService.getPermissoes).toHaveBeenCalledWith([
        "change_relatorio_consolidado_dre",
      ]);
    });

    it("deve desabilitar o botão quando o usuário não tiver permissão", () => {
      visoesService.getPermissoes.mockReturnValue(false);

      renderComponente();

      expect(
        screen.getByRole("button", { name: "Informar envio externo" })
      ).toBeDisabled();
    });
  });

  describe("Modal de marcar publicação", () => {
    it("deve iniciar com o modal fechado", () => {
      renderComponente();

      expect(screen.queryByTestId("modal-marcar-publicacao")).not.toBeInTheDocument();
    });

    it("deve abrir o modal ao clicar no botão e fechá-lo pelo handleClose", () => {
      renderComponente();

      fireEvent.click(screen.getByRole("button", { name: "Informar envio externo" }));

      expect(screen.getByTestId("modal-marcar-publicacao")).toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: "Fechar modal" }));

      expect(screen.queryByTestId("modal-marcar-publicacao")).not.toBeInTheDocument();
    });

    it("deve repassar o consolidado e a função de recarregamento para o modal", () => {
      renderComponente();

      expect(ultimasPropsDoModal()).toMatchObject({
        consolidadoDre: mockConsolidadoDre,
        carregaConsolidadosDreJaPublicadosProximaPublicacao: mockCarregaConsolidados,
      });
    });
  });
});
