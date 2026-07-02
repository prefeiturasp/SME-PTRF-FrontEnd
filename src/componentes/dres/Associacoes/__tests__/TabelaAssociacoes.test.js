import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TabelaAssociacoes } from "../TabelaAssociacoes";

jest.mock("primereact/datatable", () => ({
    DataTable: ({ value, children, paginator, rows }) => {
        const colunas = Array.isArray(children) ? children : [children];
        return (
            <div
                data-testid="datatable"
                data-paginator={String(!!paginator)}
                data-rows={rows}
            >
                <table>
                    <tbody>
                        {value?.map((row, index) => (
                            <tr key={index} data-testid="datatable-row">
                                {colunas.map((col, i) => (
                                    <td key={i}>
                                        {col.props.body
                                            ? col.props.body(row)
                                            : row[col.props.field]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    },
}));

jest.mock("primereact/column", () => ({
    Column: (props) => props,
}));

jest.mock("../../../Globais/TableTags", () => ({
    TableTags: () => <div data-testid="table-tags" />,
}));

let capturedLegendaProps = null;
jest.mock("../../../Globais/ModalLegendaInformacao/LegendaInformacao", () => ({
    LegendaInformacao: (props) => {
        capturedLegendaProps = props;
        return <div data-testid="legenda-informacao" />;
    },
}));

describe("TabelaAssociacoes", () => {
    const unidadeEscolarTemplate = jest.fn((rowData) => (
        <strong data-testid="unidade-template">{rowData.unidade.nome_com_tipo}</strong>
    ));
    const acoesTemplate = jest.fn((rowData) => (
        <button data-testid="acao-template">{rowData.uuid}</button>
    ));

    const associacoesPadrao = [
        { uuid: "1", unidade: { codigo_eol: "111", nome_com_tipo: "EMEI Teste" } },
        { uuid: "2", unidade: { codigo_eol: "222", nome_com_tipo: "EMEF Teste" } },
    ];

    let setShowModalLegendaInformacao;

    beforeEach(() => {
        jest.clearAllMocks();
        capturedLegendaProps = null;
        setShowModalLegendaInformacao = jest.fn();
    });

    const renderComponent = (props = {}) => {
        return render(
            <TabelaAssociacoes
                associacoes={associacoesPadrao}
                rowsPerPage={15}
                unidadeEscolarTemplate={unidadeEscolarTemplate}
                acoesTemplate={acoesTemplate}
                showModalLegendaInformacao={false}
                setShowModalLegendaInformacao={setShowModalLegendaInformacao}
                {...props}
            />
        );
    };

    it("renderiza LegendaInformacao com entidadeDasTags 'associacao'", () => {
        renderComponent();
        expect(screen.getByTestId("legenda-informacao")).toBeInTheDocument();
        expect(capturedLegendaProps.entidadeDasTags).toBe("associacao");
    });

    it("repassa showModalLegendaInformacao e setShowModalLegendaInformacao para LegendaInformacao", () => {
        renderComponent({ showModalLegendaInformacao: true });
        expect(capturedLegendaProps.showModalLegendaInformacao).toBe(true);
        expect(capturedLegendaProps.setShowModalLegendaInformacao).toBe(
            setShowModalLegendaInformacao
        );
    });

    it("renderiza a tabela com as linhas de associacoes", () => {
        renderComponent();
        expect(screen.getAllByTestId("datatable-row")).toHaveLength(2);
    });

    it("ativa o paginator quando associacoes.length > rowsPerPage", () => {
        const muitasAssociacoes = Array.from({ length: 5 }, (_, i) => ({
            uuid: String(i),
            unidade: { codigo_eol: String(i), nome_com_tipo: `Escola ${i}` },
        }));
        renderComponent({ associacoes: muitasAssociacoes, rowsPerPage: 3 });
        expect(screen.getByTestId("datatable")).toHaveAttribute(
            "data-paginator",
            "true"
        );
    });

    it("não ativa o paginator quando associacoes.length <= rowsPerPage", () => {
        renderComponent({ rowsPerPage: 15 });
        expect(screen.getByTestId("datatable")).toHaveAttribute(
            "data-paginator",
            "false"
        );
    });

    it("renderiza TableTags para a coluna de informações", () => {
        renderComponent();
        expect(screen.getAllByTestId("table-tags").length).toBeGreaterThan(0);
    });

    it("renderiza sem quebrar quando associacoes é uma lista vazia", () => {
        renderComponent({ associacoes: [] });
        expect(screen.queryAllByTestId("datatable-row")).toHaveLength(0);
        expect(screen.getByTestId("datatable")).toHaveAttribute(
            "data-paginator",
            "false"
        );
    });
});
