import React from "react";
import { render, screen } from "@testing-library/react";
import InfoRefiticacaoRelatorio from "../InfoRefiticacaoRelatorio";
import { useRecursoSelecionadoContext } from "../../../../../context/RecursoSelecionado";

jest.mock("../../../../../context/RecursoSelecionado", () => ({
  useRecursoSelecionadoContext: jest.fn(),
}));

const mockIconeEditarRetificacao = jest.fn();

jest.mock("../IconeEditarRetificacao", () => (props) => {
  mockIconeEditarRetificacao(props);
  return <span data-testid="icone-editar-retificacao" />;
});

describe("InfoRefiticacaoRelatorio Component", () => {
  const mockConsolidadoDre = {
    ja_publicado: true,
    data_publicacao: "2025-03-10",
    eh_retificacao: true,
  };

  const mockContexto = (habilitaLauda = false) => {
    useRecursoSelecionadoContext.mockReturnValue({
      recursoSelecionado: { habilita_exibicao_de_lauda: habilitaLauda },
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockContexto();
  });

  describe("Condições de exibição", () => {
    it("deve renderizar as informações quando o consolidado tiver data de publicação", () => {
      render(<InfoRefiticacaoRelatorio consolidadoDre={mockConsolidadoDre} />);

      expect(screen.getByText("10/03/2025", { exact: false })).toBeInTheDocument();
      expect(screen.getByTestId("icone-editar-retificacao")).toBeInTheDocument();
    });

    it("não deve renderizar nada quando o consolidado não tiver data de publicação", () => {
      const { container } = render(
        <InfoRefiticacaoRelatorio
          consolidadoDre={{ ...mockConsolidadoDre, data_publicacao: null }}
        />
      );

      expect(container).toBeEmptyDOMElement();
      expect(mockIconeEditarRetificacao).not.toHaveBeenCalled();
    });

    it("não deve renderizar nada quando consolidadoDre não for informado", () => {
      const { container } = render(
        <InfoRefiticacaoRelatorio consolidadoDre={undefined} />
      );

      expect(container).toBeEmptyDOMElement();
    });
  });

  describe("Texto da data", () => {
    it("deve exibir 'Data do relatório' quando a lauda não estiver habilitada", () => {
      render(<InfoRefiticacaoRelatorio consolidadoDre={mockConsolidadoDre} />);

      expect(screen.getByText("Data do relatório:")).toBeInTheDocument();
    });

    it("deve exibir 'Data da publicação' quando a lauda estiver habilitada", () => {
      mockContexto(true);

      render(<InfoRefiticacaoRelatorio consolidadoDre={mockConsolidadoDre} />);

      expect(screen.getByText("Data da publicação:")).toBeInTheDocument();
    });

    it("deve exibir a data de publicação no formato DD/MM/AAAA", () => {
      const { container } = render(
        <InfoRefiticacaoRelatorio consolidadoDre={mockConsolidadoDre} />
      );

      expect(container.textContent).toContain("Data do relatório: 10/03/2025");
    });
  });

  describe("Ícone de edição da retificação", () => {
    it("deve repassar o consolidadoDre para o IconeEditarRetificacao", () => {
      render(<InfoRefiticacaoRelatorio consolidadoDre={mockConsolidadoDre} />);

      expect(mockIconeEditarRetificacao).toHaveBeenCalledWith({
        consolidadoDre: mockConsolidadoDre,
      });
    });
  });
});
