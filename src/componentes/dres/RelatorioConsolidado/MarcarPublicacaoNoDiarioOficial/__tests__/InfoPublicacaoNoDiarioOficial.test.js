import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import InfoPublicacaoNoDiarioOficial from "../InfoPublicacaoNoDiarioOficial";
import { visoesService } from "../../../../../services/visoes.service";
import { useRecursoSelecionadoContext } from "../../../../../context/RecursoSelecionado";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

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
    <button onClick={onClick} disabled={disabled}>
      {tooltipMessage}
    </button>
  ),
}));

const mockIconeMarcarPublicacao = jest.fn();

jest.mock("../IconeMarcarPublicacaoNoDiarioOficial", () => (props) => {
  mockIconeMarcarPublicacao(props);
  return <span data-testid="icone-marcar-publicacao" />;
});

describe("InfoPublicacaoNoDiarioOficial Component", () => {
  const mockConsolidadoDre = {
    uuid: "consolidado-uuid-1",
    ja_publicado: true,
    data_publicacao: "2025-03-10",
    eh_retificacao: false,
    titulo_relatorio: "Publicação 1",
  };

  const mockCarregaConsolidados = jest.fn();

  const mockContexto = (habilitaLauda = false) => {
    useRecursoSelecionadoContext.mockReturnValue({
      recursoSelecionado: { habilita_exibicao_de_lauda: habilitaLauda },
    });
  };

  const renderComponente = (consolidadoDre = mockConsolidadoDre) =>
    render(
      <InfoPublicacaoNoDiarioOficial
        consolidadoDre={consolidadoDre}
        carregaConsolidadosDreJaPublicadosProximaPublicacao={mockCarregaConsolidados}
      />
    );

  beforeEach(() => {
    jest.clearAllMocks();
    visoesService.getPermissoes.mockReturnValue(true);
    mockContexto();
  });

  describe("Informação da data de publicação", () => {
    it("deve exibir a data do envio da documentação quando a lauda não estiver habilitada", () => {
      const { container } = renderComponente();

      expect(screen.getByText("Data do envio da documentação:")).toBeInTheDocument();
      expect(container.textContent).toContain(
        "Data do envio da documentação: 10/03/2025"
      );
    });

    it("deve exibir a data da publicação quando a lauda estiver habilitada", () => {
      mockContexto(true);

      const { container } = renderComponente();

      expect(screen.getByText("Data da publicação:")).toBeInTheDocument();
      expect(container.textContent).toContain("Data da publicação: 10/03/2025");
    });

    it("deve renderizar o ícone de marcar publicação com as props recebidas", () => {
      renderComponente();

      expect(screen.getByTestId("icone-marcar-publicacao")).toBeInTheDocument();
      expect(mockIconeMarcarPublicacao).toHaveBeenCalledWith({
        consolidadoDre: mockConsolidadoDre,
        carregaConsolidadosDreJaPublicadosProximaPublicacao: mockCarregaConsolidados,
      });
    });

    it("não deve exibir a data nem o ícone quando não houver data de publicação", () => {
      renderComponente({ ...mockConsolidadoDre, data_publicacao: null });

      expect(screen.queryByText(/Data do envio/)).not.toBeInTheDocument();
      expect(screen.queryByTestId("icone-marcar-publicacao")).not.toBeInTheDocument();
    });

    it("não deve renderizar nada quando consolidadoDre não for informado", () => {
      const { container } = renderComponente(null);

      expect(container).toBeEmptyDOMElement();
    });
  });

  describe("Edição de retificação", () => {
    const mockRetificacaoNaoPublicada = {
      ...mockConsolidadoDre,
      ja_publicado: false,
      data_publicacao: null,
      eh_retificacao: true,
    };

    it("deve exibir o botão de editar retificação quando for retificação não publicada", () => {
      renderComponente(mockRetificacaoNaoPublicada);

      expect(
        screen.getByRole("button", { name: "Editar Retificação" })
      ).toBeInTheDocument();
    });

    it("não deve exibir o botão de editar retificação quando a retificação já estiver publicada", () => {
      renderComponente({ ...mockRetificacaoNaoPublicada, ja_publicado: true });

      expect(
        screen.queryByRole("button", { name: "Editar Retificação" })
      ).not.toBeInTheDocument();
    });

    it("não deve exibir o botão de editar retificação quando não for retificação", () => {
      renderComponente({ ...mockRetificacaoNaoPublicada, eh_retificacao: false });

      expect(
        screen.queryByRole("button", { name: "Editar Retificação" })
      ).not.toBeInTheDocument();
    });

    it("deve desabilitar o botão quando o usuário não tiver permissão", () => {
      visoesService.getPermissoes.mockReturnValue(false);

      renderComponente(mockRetificacaoNaoPublicada);

      expect(
        screen.getByRole("button", { name: "Editar Retificação" })
      ).toBeDisabled();
      expect(visoesService.getPermissoes).toHaveBeenCalledWith([
        "change_relatorio_consolidado_dre",
      ]);
    });

    it("deve navegar para a tela de retificação ao clicar no botão", () => {
      renderComponente(mockRetificacaoNaoPublicada);

      fireEvent.click(screen.getByRole("button", { name: "Editar Retificação" }));

      expect(mockNavigate).toHaveBeenCalledWith(
        "/dre-relatorio-consolidado-retificacao/consolidado-uuid-1",
        {
          state: {
            referencia_publicacao: "Publicação 1",
            eh_edicao_retificacao: true,
          },
        }
      );
    });
  });
});
