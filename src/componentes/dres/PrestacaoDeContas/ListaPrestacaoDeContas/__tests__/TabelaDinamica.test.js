import React from "react";
import { render } from "@testing-library/react";
import { TabelaDinamica } from "../TabelaDinamica";

describe("TabelaDinamica", () => {
    const mockTemplates = {
        statusTemplate: jest.fn((rowData) => <div>{rowData.status}</div>),
        dataTemplate: jest.fn((rowData) => <div>{rowData.data_recebimento}</div>),
        acoesTemplate: jest.fn(() => <button>Ação</button>),
        seiTemplate: jest.fn((rowData) => <div>{rowData.processo_sei}</div>),
        devolucaoTemplate: jest.fn(() => <div>Devolução</div>),
        tecnicoTemplate: jest.fn(() => <div>Técnico</div>),
        nomeTemplate: jest.fn((rowData) => <div>{rowData.unidade_nome}</div>)
    };

    const defaultProps = {
        prestacaoDeContas: [],
        rowsPerPage: 10,
        columns: [],
        ...mockTemplates
    };

    it("renderiza tabela vazia", () => {
        const { container } = render(<TabelaDinamica {...defaultProps} />);
        expect(container.querySelector(".p-datatable")).toBeInTheDocument();
    });

    it("renderiza com dados", () => {
        const prestacaoDeContas = [
            { id: 1, status: "Aprovado", unidade_nome: "Escola A" }
        ];
        const columns = [
            { field: "status", header: "Status" }
        ];

        render(<TabelaDinamica {...defaultProps} prestacaoDeContas={prestacaoDeContas} columns={columns} />);
        expect(mockTemplates.statusTemplate).toHaveBeenCalled();
    });

    it("usa template para coluna status", () => {
        const columns = [{ field: "status", header: "Status" }];
        const prestacaoDeContas = [{ status: "Aprovado" }];

        render(<TabelaDinamica {...defaultProps} prestacaoDeContas={prestacaoDeContas} columns={columns} />);
        expect(mockTemplates.statusTemplate).toHaveBeenCalled();
    });

    it("usa template para coluna data_recebimento", () => {
        const columns = [{ field: "data_recebimento", header: "Data" }];
        const prestacaoDeContas = [{ data_recebimento: "2024-01-01" }];

        render(<TabelaDinamica {...defaultProps} prestacaoDeContas={prestacaoDeContas} columns={columns} />);
        expect(mockTemplates.dataTemplate).toHaveBeenCalled();
    });

    it("usa template para coluna data_ultima_analise", () => {
        const columns = [{ field: "data_ultima_analise", header: "Data Análise" }];
        const prestacaoDeContas = [{ data_ultima_analise: "2024-01-01" }];

        render(<TabelaDinamica {...defaultProps} prestacaoDeContas={prestacaoDeContas} columns={columns} />);
        expect(mockTemplates.dataTemplate).toHaveBeenCalled();
    });

    it("usa template para coluna processo_sei", () => {
        const columns = [{ field: "processo_sei", header: "Processo SEI" }];
        const prestacaoDeContas = [{ processo_sei: "123456" }];

        render(<TabelaDinamica {...defaultProps} prestacaoDeContas={prestacaoDeContas} columns={columns} />);
        expect(mockTemplates.seiTemplate).toHaveBeenCalled();
    });

    it("usa template para coluna tecnico_responsavel", () => {
        const columns = [{ field: "tecnico_responsavel", header: "Técnico" }];
        const prestacaoDeContas = [{ tecnico_responsavel: "João" }];

        render(<TabelaDinamica {...defaultProps} prestacaoDeContas={prestacaoDeContas} columns={columns} />);
        expect(mockTemplates.tecnicoTemplate).toHaveBeenCalled();
    });

    it("usa template para coluna devolucao_ao_tesouro", () => {
        const columns = [{ field: "devolucao_ao_tesouro", header: "Devolução" }];
        const prestacaoDeContas = [{ devolucao_ao_tesouro: "Sim" }];

        render(<TabelaDinamica {...defaultProps} prestacaoDeContas={prestacaoDeContas} columns={columns} />);
        expect(mockTemplates.devolucaoTemplate).toHaveBeenCalled();
    });

    it("usa template para coluna acoes", () => {
        const columns = [{ field: "acoes", header: "Ações" }];
        const prestacaoDeContas = [{ acoes: "" }];

        render(<TabelaDinamica {...defaultProps} prestacaoDeContas={prestacaoDeContas} columns={columns} />);
        expect(mockTemplates.acoesTemplate).toHaveBeenCalled();
    });

    it("usa template para coluna unidade_nome", () => {
        const columns = [{ field: "unidade_nome", header: "Unidade" }];
        const prestacaoDeContas = [{ unidade_nome: "Escola XYZ" }];

        render(<TabelaDinamica {...defaultProps} prestacaoDeContas={prestacaoDeContas} columns={columns} />);
        expect(mockTemplates.nomeTemplate).toHaveBeenCalled();
    });

    it("renderiza múltiplas colunas", () => {
        const columns = [
            { field: "status", header: "Status" },
            { field: "unidade_nome", header: "Unidade" },
            { field: "data_recebimento", header: "Data" }
        ];
        const prestacaoDeContas = [{ status: "Aprovado", unidade_nome: "Escola", data_recebimento: "2024-01-01" }];

        render(<TabelaDinamica {...defaultProps} prestacaoDeContas={prestacaoDeContas} columns={columns} />);
        expect(mockTemplates.statusTemplate).toHaveBeenCalled();
        expect(mockTemplates.nomeTemplate).toHaveBeenCalled();
        expect(mockTemplates.dataTemplate).toHaveBeenCalled();
    });

    it("não exibe paginador quando há poucos itens", () => {
        const prestacaoDeContas = [{ id: 1, status: "Aprovado" }];
        const columns = [{ field: "status", header: "Status" }];

        const { container } = render(<TabelaDinamica {...defaultProps} prestacaoDeContas={prestacaoDeContas} columns={columns} rowsPerPage={10} />);
        expect(container.querySelector(".p-paginator")).not.toBeInTheDocument();
    });

    it("exibe paginador quando há muitos itens", () => {
        const prestacaoDeContas = Array.from({ length: 15 }, (_, i) => ({ id: i, status: "Aprovado" }));
        const columns = [{ field: "status", header: "Status" }];

        const { container } = render(<TabelaDinamica {...defaultProps} prestacaoDeContas={prestacaoDeContas} columns={columns} rowsPerPage={10} />);
        expect(container.querySelector(".p-paginator")).toBeInTheDocument();
    });
});

