import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import IconeMarcarPublicacaoNoDiarioOficial from "../IconeMarcarPublicacaoNoDiarioOficial";
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

jest.mock("../../../../Globais/UI/Button", () => ({
  EditIconButton: ({ tooltipMessage, onClick, disabled }) => (
    <div>
      <button onClick={onClick} disabled={disabled}>
        Editar
      </button>
      <div data-testid="tooltip">{tooltipMessage}</div>
    </div>
  ),
}));

const mockModalMarcarPublicacao = jest.fn();

jest.mock("../../ModalMarcarPublicacaoNoDiarioOficial", () => ({
  ModalMarcarPublicacaoNoDiarioOficial: (props) => {
    mockModalMarcarPublicacao(props);
    return props.show ? (
      <div data-testid="modal-marcar-publicacao">
        <button onClick={props.handleClose}>Fechar modal</button>
      </div>
    ) : null;
  },
}));

describe("IconeMarcarPublicacaoNoDiarioOficial Component", () => {
  const mockConsolidadoDre = {
    uuid: "consolidado-uuid-1",
    ja_publicado: true,
    data_publicacao: "2025-03-10",
    pagina_publicacao: "42",
  };

  const mockCarregaConsolidados = jest.fn();

  const mockContexto = (habilitaLauda = false) => {
    useRecursoSelecionadoContext.mockReturnValue({
      recursoSelecionado: { habilita_exibicao_de_lauda: habilitaLauda },
    });
  };

  const renderComponente = (consolidadoDre = mockConsolidadoDre) =>
    render(
      <IconeMarcarPublicacaoNoDiarioOficial
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

  describe("Condições de exibição do ícone", () => {
    it("deve renderizar o ícone quando o consolidado estiver publicado e com data de publicação", () => {
      renderComponente();

      expect(screen.getByRole("button", { name: "Editar" })).toBeInTheDocument();
    });

    it("não deve renderizar o ícone quando o consolidado não estiver publicado", () => {
      renderComponente({ ...mockConsolidadoDre, ja_publicado: false });

      expect(screen.queryByRole("button", { name: "Editar" })).not.toBeInTheDocument();
    });

    it("não deve renderizar o ícone quando o consolidado não tiver data de publicação", () => {
      renderComponente({ ...mockConsolidadoDre, data_publicacao: null });

      expect(screen.queryByRole("button", { name: "Editar" })).not.toBeInTheDocument();
    });
  });

  describe("Tooltip", () => {
    it("deve exibir a data do envio sem a página quando a lauda não estiver habilitada", () => {
      renderComponente();

      const tooltip = screen.getByTestId("tooltip");

      expect(tooltip).toHaveTextContent("Data do envio: 10/03/2025");
      expect(tooltip).not.toHaveTextContent("Página publicação");
    });

    it("deve exibir a data e a página da publicação quando a lauda estiver habilitada", () => {
      mockContexto(true);

      renderComponente();

      const tooltip = screen.getByTestId("tooltip");

      expect(tooltip).toHaveTextContent("Data da publicação: 10/03/2025");
      expect(tooltip).toHaveTextContent("Página publicação: 42");
    });
  });

  describe("Permissão", () => {
    it("deve habilitar o ícone quando o usuário tiver permissão", () => {
      renderComponente();

      expect(screen.getByRole("button", { name: "Editar" })).toBeEnabled();
      expect(visoesService.getPermissoes).toHaveBeenCalledWith([
        "change_relatorio_consolidado_dre",
      ]);
    });

    it("deve desabilitar o ícone quando o usuário não tiver permissão", () => {
      visoesService.getPermissoes.mockReturnValue(false);

      renderComponente();

      expect(screen.getByRole("button", { name: "Editar" })).toBeDisabled();
    });
  });

  describe("Modal de marcar publicação", () => {
    it("deve abrir o modal ao clicar no ícone e fechá-lo pelo handleClose", () => {
      renderComponente();

      expect(screen.queryByTestId("modal-marcar-publicacao")).not.toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: "Editar" }));

      expect(screen.getByTestId("modal-marcar-publicacao")).toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: "Fechar modal" }));

      expect(screen.queryByTestId("modal-marcar-publicacao")).not.toBeInTheDocument();
    });

    it("deve repassar os textos de envio para o modal quando a lauda não estiver habilitada", () => {
      renderComponente();

      expect(ultimasPropsDoModal()).toMatchObject({
        titulo: "Informar data do envio da documentação",
        textoMsg: "Informações do envio alteradas com sucesso.",
        textoBotaoSalvar: "Salvar",
        consolidadoDre: mockConsolidadoDre,
        carregaConsolidadosDreJaPublicadosProximaPublicacao: mockCarregaConsolidados,
      });
    });

    it("deve repassar os textos de publicação para o modal quando a lauda estiver habilitada", () => {
      mockContexto(true);

      renderComponente();

      expect(ultimasPropsDoModal()).toMatchObject({
        titulo: "Informar publicação",
        textoMsg: "Informações da publicação alteradas com sucesso.",
        textoBotaoSalvar: "Salvar",
      });
    });
  });
});
