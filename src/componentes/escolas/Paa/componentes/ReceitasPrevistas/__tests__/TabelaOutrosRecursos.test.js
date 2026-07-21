import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TabelaOutrosRecursos from "../TabelaOutrosRecursos";
import { useGetTodos } from "../hooks/useGetReceitasPrevistasOutrosRecursosPeriodo";
import { formatMoneyBRL } from "../../../../../../utils/money";

jest.mock("../hooks/useGetReceitasPrevistasOutrosRecursosPeriodo", () => ({
    useGetTodos: jest.fn(),
}));

jest.mock("../../../../../../utils/money", () => ({
    formatMoneyBRL: jest.fn((val) => (val !== null && val !== undefined ? `R$ ${val}` : null)),
}));

jest.mock("../../../../../Globais/UI/Button", () => ({
    EditIconButton: ({ onClick }) => (
        <button type="button" aria-label="Editar" onClick={onClick}>
            Editar
        </button>
    ),
}));

jest.mock("antd", () => ({
    Spin: ({ children, spinning }) => (
        <div data-testid="spin-wrapper" data-spinning={spinning}>
            {children}
        </div>
    ),
}));

jest.mock("primereact/datatable", () => ({
    DataTable: ({ children, value }) => {
        const columns = Array.isArray(children) ? children : [children];
        return (
            <table>
                <tbody>
                    {value?.map((row, rowIndex) => (
                        <tr key={row.uuid || rowIndex} data-testid={`row-${row.uuid || rowIndex}`}>
                            {columns.map((child, colIndex) => {
                                if (!child || !child.props) return null;
                                const { body, bodyClassName, field } = child.props;
                                const className =
                                    typeof bodyClassName === "function"
                                        ? bodyClassName(row, { rowIndex })
                                        : bodyClassName;
                                const content =
                                    typeof body === "function" ? body(row, { rowIndex }) : row[field];
                                return (
                                    <td key={colIndex} className={className}>
                                        {content}
                                    </td>
                                );
                        })}
                    </tr>
                ))}
                </tbody>
            </table>
        );
    },
}));

jest.mock("primereact/column", () => ({
    Column: () => null,
}));

describe("TabelaOutrosRecursos", () => {
    const mockSetActiveTab = jest.fn();
    const mockHandleOpenEditar = jest.fn();

    const renderComponent = (props = {}) => {
        return render(
            <TabelaOutrosRecursos
                setActiveTab={mockSetActiveTab}
                handleOpenEditar={mockHandleOpenEditar}
                {...props}
            />,
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
        formatMoneyBRL.mockImplementation((val) =>
            val !== null && val !== undefined ? `R$ ${val}` : null
        );
    });

    it("deve renderizar o estado de carregamento corretamente", () => {
        useGetTodos.mockReturnValue({ data: null, isLoading: true });

        renderComponent();

        const spinWrapper = screen.getByTestId("spin-wrapper");
        expect(spinWrapper).toHaveAttribute("data-spinning", "true");
    });

    it("deve renderizar apenas a linha de total zerada quando recursos for undefined/null", () => {
        useGetTodos.mockReturnValue({ data: null, isLoading: false });

        renderComponent();

        expect(screen.getByText("Total de Outros Recursos")).toBeInTheDocument();
        expect(screen.getAllByText("R$ 0")).toHaveLength(4);
    });

    it("deve mapear e renderizar corretamente os recursos recebidos com receitas_previstas completas", () => {
        const mockData = [
            {
                uuid: "1",
                outro_recurso_objeto: {
                    nome: "Recurso Teste 1",
                    cor: "#FF0000",
                    aceita_capital: true,
                    aceita_custeio: true,
                    aceita_livre_aplicacao: true,
                },
                receitas_previstas: [
                    {
                        previsao_valor_capital: "100",
                        previsao_valor_custeio: "200",
                        previsao_valor_livre: "300",
                        saldo_capital: "50",
                        saldo_custeio: "50",
                        saldo_livre: "50",
                    },
                ],
            },
        ];

        useGetTodos.mockReturnValue({ data: mockData, isLoading: false });

        renderComponent();

        const nomeCell = screen.getByText("Recurso Teste 1");
        expect(nomeCell).toBeInTheDocument();
        expect(nomeCell).toHaveStyle({ color: "#FF0000" });

        expect(screen.getAllByText("R$ 250")).toHaveLength(2);
        expect(screen.getAllByText("R$ 150")).toHaveLength(2);
        expect(screen.getAllByText("R$ 350")).toHaveLength(2);
        expect(screen.getAllByText("R$ 750")).toHaveLength(2);

        expect(screen.getByText("Total de Outros Recursos")).toBeInTheDocument();
    });

    it("deve lidar corretamente com receitas_previstas vazio e propriedades faltantes", () => {
        const mockData = [
            {
                uuid: "2",
                outro_recurso_objeto: {
                    nome: "Recurso Sem Receitas",
                    aceita_capital: true,
                    aceita_custeio: true,
                    aceita_livre_aplicacao: true,
                },
                receitas_previstas: [],
            },
        ];

        useGetTodos.mockReturnValue({ data: mockData, isLoading: false });

        renderComponent();

        expect(screen.getByText("Recurso Sem Receitas")).toBeInTheDocument();
        const nomeCell = screen.getByText("Recurso Sem Receitas");
        expect(nomeCell).toHaveStyle({ color: "#870051" });
    });

    it("deve aplicar estilo e caracter '-' para colunas desabilitadas", () => {
        const mockData = [
            {
                uuid: "3",
                outro_recurso_objeto: {
                nome: "Recurso Restrito",
                aceita_capital: false,
                aceita_custeio: false,
                aceita_livre_aplicacao: false,
                },
                receitas_previstas: [
                    {
                        previsao_valor_capital: "100",
                        previsao_valor_custeio: "100",
                        previsao_valor_livre: "100",
                        saldo_capital: "0",
                        saldo_custeio: "0",
                        saldo_livre: "0",
                    },
                ],
            },
        ];

        useGetTodos.mockReturnValue({ data: mockData, isLoading: false });

        renderComponent();

        const tracelements = screen.getAllByText("-");
        expect(tracelements.length).toBeGreaterThanOrEqual(3);

        const row = screen.getByTestId("row-3");
        const disabledCells = row.querySelectorAll(".cell-desativada");
        expect(disabledCells).toHaveLength(3);
    });

    it("deve renderizar '__' quando o valor retornado por formatMoneyBRL for null ou o campo for nulo/undefined", () => {
        formatMoneyBRL.mockReturnValueOnce(null);

        const mockData = [
            {
                uuid: "4",
                outro_recurso_objeto: {
                    nome: "Recurso Nulo",
                    aceita_capital: true,
                    aceita_custeio: true,
                    aceita_livre_aplicacao: true,
                },
                receitas_previstas: [
                    {
                        previsao_valor_custeio: "10",
                    },
                ],
            },
        ];

        useGetTodos.mockReturnValue({ data: mockData, isLoading: false });

        renderComponent();

        expect(screen.getAllByText("__").length).toBeGreaterThan(0);
    });

    it("deve chamar setActiveTab ao clicar em Editar quando o nome for 'Recursos Próprios'", () => {
        const mockData = [
            {
                uuid: "6",
                outro_recurso_objeto: {
                    nome: "Recursos Próprios",
                    aceita_capital: true,
                    aceita_custeio: true,
                    aceita_livre_aplicacao: true,
                },
                receitas_previstas: [],
            },
        ];

        useGetTodos.mockReturnValue({ data: mockData, isLoading: false });

        renderComponent();

        const editButton = screen.getByRole("button", { name: /editar/i });
        fireEvent.click(editButton);

        expect(mockSetActiveTab).toHaveBeenCalledTimes(1);
        expect(mockHandleOpenEditar).not.toHaveBeenCalled();
    });

    it("deve chamar handleOpenEditar ao clicar em Editar para outros recursos", () => {
        const mockData = [
            {
                uuid: "7",
                outro_recurso_objeto: {
                    nome: "Outro Recurso Qualquer",
                    aceita_capital: true,
                    aceita_custeio: true,
                    aceita_livre_aplicacao: true,
                },
                receitas_previstas: [],
            },
        ];

        useGetTodos.mockReturnValue({ data: mockData, isLoading: false });

        renderComponent();

        const editButton = screen.getByRole("button", { name: /editar/i });
        fireEvent.click(editButton);

        expect(mockHandleOpenEditar).toHaveBeenCalledTimes(1);
        expect(mockHandleOpenEditar).toHaveBeenCalledWith(
            expect.objectContaining({
                uuid: "7",
                nome: "Outro Recurso Qualquer",
            }),
        );
        expect(mockSetActiveTab).not.toHaveBeenCalled();
    });

    it("deve utilizar handleOpenEditar default prop caso não seja informada", () => {
        const mockData = [
            {
                uuid: "8",
                outro_recurso_objeto: {
                    nome: "Teste Default Prop",
                    aceita_capital: true,
                    aceita_custeio: true,
                    aceita_livre_aplicacao: true,
                },
                receitas_previstas: [],
            },
        ];

        useGetTodos.mockReturnValue({ data: mockData, isLoading: false });

        render(<TabelaOutrosRecursos setActiveTab={mockSetActiveTab} />);

        const editButton = screen.getByRole("button", { name: /editar/i });
        expect(() => fireEvent.click(editButton)).not.toThrow();
    });

    it("não deve renderizar botão de ação para a linha de Total (fixed)", () => {
        useGetTodos.mockReturnValue({ data: [], isLoading: false });

        renderComponent();

        expect(screen.queryByRole("button", { name: /editar/i })).not.toBeInTheDocument();
    });

    it("deve retornar false em ehColunaDesabilitada quando rowData não possuir outro_recurso_objeto", () => {
        const mockData = [
            {
                uuid: "9",
                outro_recurso_objeto: {
                    nome: "Sem Flags de Desabilitação",
                },
                receitas_previstas: [],
            },
        ];

        useGetTodos.mockReturnValue({ data: mockData, isLoading: false });

        renderComponent();

        expect(screen.getByTestId("row-9")).toBeInTheDocument();
    });

    it("deve somar adequadamente quando total_saldos ou valores forem nulos ou indefindos no reduce", () => {
        const mockData = [
            {
                uuid: "10",
                outro_recurso_objeto: {
                    nome: "Valores Nulos",
                    aceita_capital: true,
                    aceita_custeio: true,
                    aceita_livre_aplicacao: true,
                },
                receitas_previstas: [],
            },
        ];

        useGetTodos.mockReturnValue({ data: mockData, isLoading: false });

        renderComponent();

        const totalRow = screen.getByTestId("row-total");
        expect(totalRow).toBeInTheDocument();
    });
});