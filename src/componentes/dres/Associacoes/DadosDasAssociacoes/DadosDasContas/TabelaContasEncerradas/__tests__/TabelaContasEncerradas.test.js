import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TabelaContasEncerradas } from "../index";

jest.mock("primereact/datatable", () => {
    const ReactLocal = require("react");
    return {
        DataTable: ({ value, children, paginator, rows }) => (
            <table data-testid="datatable" data-paginator={String(paginator)} data-rows={rows}>
                <tbody>
                    {value?.map((row, index) => (
                        <tr key={index}>
                            {ReactLocal.Children.toArray(children).map((col, i) => (
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
        ),
    };
});

jest.mock("primereact/column", () => ({
    Column: (props) => props,
}));

describe("TabelaContasEncerradas", () => {
    const contaComEncerramento = {
        nome_exibicao_recurso: "Recurso 1",
        tipo_conta: { nome: "Tipo A" },
        banco_nome: "Banco X",
        agencia: "1234",
        numero_conta: "5678-9",
        solicitacao_encerramento: {
            data_de_encerramento_na_agencia: "2024-03-15",
        },
    };

    const contaSemEncerramento = {
        nome_exibicao_recurso: "Recurso 2",
        tipo_conta: { nome: "Tipo B" },
        banco_nome: "Banco Y",
        agencia: "4321",
        numero_conta: "9876-5",
        solicitacao_encerramento: null,
    };

    it("renderiza o título da tabela", () => {
        render(<TabelaContasEncerradas contas={[]} rowsPerPage={10} />);

        expect(screen.getByText("Histórico de contas encerradas")).toBeInTheDocument();
    });

    it("renderiza a tabela com os dados das contas", () => {
        render(
            <TabelaContasEncerradas
                contas={[contaComEncerramento, contaSemEncerramento]}
                rowsPerPage={10}
            />
        );

        expect(screen.getByText("Recurso 1")).toBeInTheDocument();
        expect(screen.getByText("Recurso 2")).toBeInTheDocument();
        expect(screen.getByText("Banco X")).toBeInTheDocument();
        expect(screen.getByText("Banco Y")).toBeInTheDocument();
    });

    it("paginator é true quando contas.length > rowsPerPage", () => {
        const contas = [contaComEncerramento, contaSemEncerramento, contaComEncerramento];
        render(<TabelaContasEncerradas contas={contas} rowsPerPage={2} />);

        const datatable = screen.getByTestId("datatable");
        expect(datatable).toHaveAttribute("data-paginator", "true");
        expect(datatable).toHaveAttribute("data-rows", "2");
    });

    it("paginator é false quando contas.length <= rowsPerPage", () => {
        const contas = [contaComEncerramento];
        render(<TabelaContasEncerradas contas={contas} rowsPerPage={10} />);

        const datatable = screen.getByTestId("datatable");
        expect(datatable).toHaveAttribute("data-paginator", "false");
    });

    it("dataTemplate formata a data quando há solicitacao_encerramento", () => {
        render(
            <TabelaContasEncerradas contas={[contaComEncerramento]} rowsPerPage={10} />
        );

        expect(screen.getByText("15/03/2024")).toBeInTheDocument();
    });

    it("dataTemplate retorna '-' quando não há solicitacao_encerramento", () => {
        render(
            <TabelaContasEncerradas contas={[contaSemEncerramento]} rowsPerPage={10} />
        );

        expect(screen.getByText("-")).toBeInTheDocument();
    });
});
