import React from "react";
import { render, screen, fireEvent, configure } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TabelaAssociacaoAcao } from "../components/TabelaAssociacaoAcao";
import useTagInformacaoAssociacaoEncerradaTemplate from "../../../../../../hooks/Globais/TagsInformacoesAssociacoes/useTagInformacaoAssociacaoEncerradaTemplate";

// Configura o Testing Library para identificar o atributo 'data-qa'
configure({ testIdAttribute: "data-qa" });

// Mock do hook customizado
jest.mock(
  "../../../../../../hooks/Globais/TagsInformacoesAssociacoes/useTagInformacaoAssociacaoEncerradaTemplate",
  () => jest.fn()
);

// Mock do componente LegendaInformacao
jest.mock(
  "../../../../../Globais/ModalLegendaInformacao/LegendaInformacao",
  () => ({
    LegendaInformacao: ({
      showModalLegendaInformacao,
      setShowModalLegendaInformacao,
      entidadeDasTags,
      excludedTags,
    }) => (
      <div data-qa="modal-legenda-informacao">
        <span>Modal Legenda: {showModalLegendaInformacao ? "Aberto" : "Fechado"}</span>
        <span>Entidade: {entidadeDasTags}</span>
        <span>ExcludedTags: {excludedTags.join(", ")}</span>
        <button
          data-qa="btn-toggle-modal"
          onClick={() => setShowModalLegendaInformacao(!showModalLegendaInformacao)}
        >
          Toggle Modal
        </button>
      </div>
    ),
  })
);

describe("Componente <TabelaAssociacaoAcao />", () => {
  const mockOnPageChange = jest.fn();

  // Função pura para garantir o retorno JSX do cabeçalho
  const mockSelecionarHeader = jest.fn(() => <span>Header Selecionar</span>);

  // Funções de retorno dos templates de linha
  const selecionarTemplate = (rowData) => (
    <input type="checkbox" data-qa={`select-${rowData.id}`} />
  );

  const acoesTemplate = (rowData) => (
    <button data-qa={`btn-acao-${rowData.id}`}>Ação</button>
  );

  const mockTagInformacao = (rowData) => (
    <span data-qa={`tag-info-${rowData.id}`}>Tag: {rowData.informacao}</span>
  );

  const defaultUnidadesProps = {
    count: 25,
    results: [
      {
        id: 1,
        informacao: "Encerrada",
        unidade: {
          codigo_eol: "123456",
          nome_com_tipo: "EMEF Escola Exemplo 1",
        },
      },
      {
        id: 2,
        informacao: "Ativa",
        unidade: {
          codigo_eol: "654321",
          nome_com_tipo: "CEI Creche Exemplo 2",
        },
      },
    ],
  };

  const defaultProps = {
    unidades: defaultUnidadesProps,
    rowsPerPage: 10,
    selecionarHeader: mockSelecionarHeader,
    selecionarTemplate: selecionarTemplate,
    acoesTemplate: acoesTemplate,
    autoLayout: true,
    caminhoUnidade: "unidade",
    onPageChange: mockOnPageChange,
    firstPage: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Re-garante os retornos das funções mockadas após o clearAllMocks
    mockSelecionarHeader.mockImplementation(() => <span>Header Selecionar</span>);
    useTagInformacaoAssociacaoEncerradaTemplate.mockReturnValue(mockTagInformacao);
  });

  test("deve renderizar a LegendaInformacao com as props corretas", () => {
    render(<TabelaAssociacaoAcao {...defaultProps} />);

    expect(screen.getByTestId("modal-legenda-informacao")).toBeInTheDocument();
    expect(screen.getByText("Modal Legenda: Fechado")).toBeInTheDocument();
    expect(screen.getByText("Entidade: associacao")).toBeInTheDocument();
    expect(
      screen.getByText("ExcludedTags: Encerramento de conta pendente")
    ).toBeInTheDocument();
  });

  test("deve alternar o estado de exibição do modal da legenda", () => {
    render(<TabelaAssociacaoAcao {...defaultProps} />);

    const btnToggleModal = screen.getByTestId("btn-toggle-modal");
    expect(screen.getByText("Modal Legenda: Fechado")).toBeInTheDocument();

    fireEvent.click(btnToggleModal);

    expect(screen.getByText("Modal Legenda: Aberto")).toBeInTheDocument();
  });

  test("deve renderizar os cabeçalhos das colunas corretamente", () => {
    render(<TabelaAssociacaoAcao {...defaultProps} />);

    expect(mockSelecionarHeader).toHaveBeenCalled();

    const colunas = screen.getAllByRole("columnheader");
    expect(colunas[0]).toHaveTextContent("Header Selecionar");
    expect(colunas[1]).toHaveTextContent("Código Eol");
    expect(colunas[2]).toHaveTextContent("Nome UE");
    expect(colunas[3]).toHaveTextContent("Informações");
    expect(colunas[4]).toHaveTextContent("Ações");
  });

  test("deve renderizar os dados das unidades e templates nas linhas da tabela", () => {
    render(<TabelaAssociacaoAcao {...defaultProps} />);

    expect(screen.getByText("123456")).toBeInTheDocument();
    expect(screen.getByText("EMEF Escola Exemplo 1")).toBeInTheDocument();

    expect(screen.getByText("654321")).toBeInTheDocument();
    expect(screen.getByText("CEI Creche Exemplo 2")).toBeInTheDocument();

    expect(screen.getByTestId("select-1")).toBeInTheDocument();
    expect(screen.getByTestId("btn-acao-1")).toBeInTheDocument();
    expect(screen.getByTestId("tag-info-1")).toHaveTextContent("Tag: Encerrada");
  });

  test("deve configurar a paginação e chamar onPageChange ao trocar de página", () => {
    render(<TabelaAssociacaoAcao {...defaultProps} />);

    const btnProximaPagina = screen.getByRole("button", { name: "Next Page" });
    expect(btnProximaPagina).toBeInTheDocument();

    fireEvent.click(btnProximaPagina);

    expect(mockOnPageChange).toHaveBeenCalledTimes(1);
    expect(mockOnPageChange).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 1,
        first: 10,
        rows: 10,
      })
    );
  });
});