import React from "react";
import { render, screen, fireEvent, configure } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TabelaOrdenarAcoes } from "../../components/ReordenarAcoes/components/TabelaOrdenarAcoes";
import { useReordenarAcoesContext } from "../../components/ReordenarAcoes/hooks/useReordenarAcoesContext";
import { useRecursoSelecionadoContext } from "../../../../../../../context/RecursoSelecionado";

// Configura 'data-qa' como o atributo padrão do Testing Library
configure({ testIdAttribute: "data-qa" });

// Mocks dos Hooks de Contexto
jest.mock("../../components/ReordenarAcoes/hooks/useReordenarAcoesContext", () => ({
  useReordenarAcoesContext: jest.fn(),
}));

jest.mock(
  "../../../../../../../context/RecursoSelecionado",
  () => ({
    useRecursoSelecionadoContext: jest.fn(),
  })
);

// Mocks de Componentes Internos / Utilitários
jest.mock("../../../../../../../utils/Loading", () => () => (
  <div data-testid="loading-component" data-qa="loading-component">
    Carregando...
  </div>
));

jest.mock("antd", () => ({
  Spin: ({ children, spinning, tip }) => (
    <div data-testid="antd-spin" data-qa="antd-spin" data-spinning={spinning}>
      {tip}
      {children}
    </div>
  ),
}));

// Mocks dos Templates da Tabela
jest.mock("../../templates/acoesTemplates", () => ({
  aceitaCapitalTemplate: (rowData) => (
    <span data-qa={`capital-${rowData.uuid}`}>{rowData.aceita_capital ? "Sim" : "Não"}</span>
  ),
  aceitaCusteioTemplate: (rowData) => (
    <span data-qa={`custeio-${rowData.uuid}`}>{rowData.aceita_custeio ? "Sim" : "Não"}</span>
  ),
  aceitaLivreTemplate: (rowData) => (
    <span data-qa={`livre-${rowData.uuid}`}>{rowData.aceita_livre ? "Sim" : "Não"}</span>
  ),
  recursosPropriosTemplate: (rowData) => (
    <span data-qa={`recursos-proprios-${rowData.uuid}`}>{rowData.e_recursos_proprios ? "Sim" : "Não"}</span>
  ),
  exibePaaTemplate: (rowData) => (
    <span data-qa={`exibe-paa-${rowData.uuid}`}>{rowData.exibir_paa ? "Sim" : "Não"}</span>
  ),
  ordenacaoHeaderTemplate: (cor) => (
    <span data-qa="ordenacao-header" data-cor={cor}>
      Ordenação Header
    </span>
  ),
}));

// Mock do PrimeReact DataTable SEM ACESSAR A VARIÁVEL FORA DE ESCOPO 'React'
jest.mock("primereact/datatable", () => {
  return {
    DataTable: ({ children, value, onRowReorder }) => {
      // Normaliza as colunas em formato de Array
      const columns = Array.isArray(children) ? children : [children];

      return (
        <table data-testid="datatable" data-qa="datatable">
          <tbody>
            {value?.map((row, index) => (
              <tr key={row.uuid} data-qa={`row-${row.uuid}`}>
                {columns.map((col, colIdx) => (
                  <td key={colIdx}>
                    {col && col.props && col.props.body
                      ? col.props.body(row, { rowIndex: index })
                      : row[col?.props?.field]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <caption style={{ captionSide: "bottom" }}>
            <button
              data-qa="btn-simulate-reorder"
              onClick={() =>
                onRowReorder({
                  value: [
                    { uuid: "acao-2", nome: "Ação B" },
                    { uuid: "acao-1", nome: "Ação A" },
                  ],
                })
              }
            >
              Reordenar
            </button>
          </caption>
        </table>
      );
    },
  };
});

jest.mock("primereact/column", () => ({
  Column: () => null,
}));

describe("Componente <TabelaOrdenarAcoes />", () => {
  const mockSetTempResults = jest.fn();
  const mockSetUuidsOrdenados = jest.fn();
  const mockHandleSalvarOrdenacaoBtnSalvar = jest.fn();
  const mockExistemDiferencas = jest.fn();

  const mockTempResults = [
    {
      uuid: "acao-1",
      nome: "Ação A",
      aceita_capital: true,
      aceita_custeio: false,
      aceita_livre: true,
      e_recursos_proprios: false,
      exibir_paa: true,
      ordem_exibicao: 1,
    },
    {
      uuid: "acao-2",
      nome: "Ação B",
      aceita_capital: false,
      aceita_custeio: true,
      aceita_livre: false,
      e_recursos_proprios: true,
      exibir_paa: false,
      ordem_exibicao: 2,
    },
  ];

  const defaultReordenarContext = {
    isLoading: false,
    existemDiferencas: mockExistemDiferencas,
    tempResults: mockTempResults,
    setTempResults: mockSetTempResults,
    setUuidsOrdenados: mockSetUuidsOrdenados,
    handleSalvarOrdenacaoBtnSalvar: mockHandleSalvarOrdenacaoBtnSalvar,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useReordenarAcoesContext.mockReturnValue(defaultReordenarContext);
    useRecursoSelecionadoContext.mockReturnValue({
      recursoSelecionado: { cor: "#FF0000" },
    });
    mockExistemDiferencas.mockReturnValue(true);
  });

  test("deve exibir o componente Loading quando isLoading for true", () => {
    useReordenarAcoesContext.mockReturnValue({
      ...defaultReordenarContext,
      isLoading: true,
    });

    render(<TabelaOrdenarAcoes />);

    expect(screen.getByTestId("loading-component")).toBeInTheDocument();
    expect(screen.queryByTestId("datatable")).not.toBeInTheDocument();
  });

  test("deve renderizar a tabela e os registros quando isLoading for false", () => {
    render(<TabelaOrdenarAcoes />);

    expect(screen.getByTestId("datatable")).toBeInTheDocument();
    expect(screen.getByText("Ação A")).toBeInTheDocument();
    expect(screen.getByText("Ação B")).toBeInTheDocument();
  });

  test("deve calcular a ordem de exibição baseada no rowIndex + 1 no ordenacaoTemplateCustom", () => {
    render(<TabelaOrdenarAcoes />);

    // rowIndex (0) + 1 = 1 para a primeira linha
    // rowIndex (1) + 1 = 2 para a segunda linha
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  test("deve disparar setTempResults e setUuidsOrdenados ao reordenar as linhas", () => {
    render(<TabelaOrdenarAcoes />);

    const btnReordenar = screen.getByTestId("btn-simulate-reorder");
    fireEvent.click(btnReordenar);

    expect(mockSetTempResults).toHaveBeenCalledTimes(1);
    expect(mockSetTempResults).toHaveBeenCalledWith([
      { uuid: "acao-2", nome: "Ação B" },
      { uuid: "acao-1", nome: "Ação A" },
    ]);

    expect(mockSetUuidsOrdenados).toHaveBeenCalledTimes(1);
    expect(mockSetUuidsOrdenados).toHaveBeenCalledWith(["acao-2", "acao-1"]);
  });

  test("deve desabilitar o botão 'Salvar' quando não existirem diferenças", () => {
    mockExistemDiferencas.mockReturnValue(false);

    render(<TabelaOrdenarAcoes />);

    const btnSalvar = screen.getByRole("button", { name: "Salvar" });
    expect(btnSalvar).toBeDisabled();
  });

  test("deve habilitar e chamar handleSalvarOrdenacaoBtnSalvar ao clicar no botão 'Salvar'", () => {
    mockExistemDiferencas.mockReturnValue(true);

    render(<TabelaOrdenarAcoes />);

    const btnSalvar = screen.getByRole("button", { name: "Salvar" });
    expect(btnSalvar).not.toBeDisabled();

    fireEvent.click(btnSalvar);
    expect(mockHandleSalvarOrdenacaoBtnSalvar).toHaveBeenCalledTimes(1);
  });
});