import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { TabelaDinamicaPaginada } from "../TabelaDinamicaPaginada";

describe("TabelaDinamicaPaginada", () => {
    const mockTemplates = {
        statusTemplate: jest.fn((rowData) => <div>{rowData.status}</div>),
        dataTemplate: jest.fn((rowData) => (
            <div>{rowData.data_recebimento || rowData.data_ultima_analise}</div>
        )),
        acoesTemplate: jest.fn(() => <button>Ação</button>),
        seiTemplate: jest.fn((rowData) => <div>{rowData.processo_sei}</div>),
        devolucaoTemplate: jest.fn(() => <div>Devolução</div>),
        tecnicoTemplate: jest.fn(() => <div>Técnico</div>),
        nomeTemplate: jest.fn((rowData) => <div>{rowData.unidade_nome}</div>),
    };

    const mockHandlePageChange = jest.fn();

    const defaultProps = {
        prestacaoDeContas: [],
        rowsPerPage: 10,
        columns: [],
        paginaAtual: 1,
        totalRegistros: 0,
        handlePageChange: mockHandlePageChange,
        ...mockTemplates,
    };

    beforeEach(() => {
        jest.clearAllMocks();

        mockTemplates.statusTemplate.mockImplementation((rowData) => (
            <div>{rowData.status}</div>
        ));

        mockTemplates.dataTemplate.mockImplementation((rowData) => (
            <div>{rowData.data_recebimento || rowData.data_ultima_analise}</div>
        ));

        mockTemplates.acoesTemplate.mockImplementation(() => (
            <button>Ação</button>
        ));

        mockTemplates.seiTemplate.mockImplementation((rowData) => (
            <div>{rowData.processo_sei}</div>
        ));

        mockTemplates.devolucaoTemplate.mockImplementation(() => (
            <div>Devolução</div>
        ));

        mockTemplates.tecnicoTemplate.mockImplementation(() => (
            <div>Técnico</div>
        ));

        mockTemplates.nomeTemplate.mockImplementation((rowData) => (
            <div>{rowData.unidade_nome}</div>
        ));
    });

    it("renderiza tabela vazia", () => {
        const { container } = render(
            <TabelaDinamicaPaginada {...defaultProps} />,
        );

        expect(container.querySelector(".p-datatable")).toBeInTheDocument();
    });

    it("exibe mensagem quando não há registros", () => {
        render(<TabelaDinamicaPaginada {...defaultProps} />);

        expect(
            screen.getByText("Nenhuma prestação de contas encontrada."),
        ).toBeInTheDocument();
    });

    it("renderiza com dados", () => {
        const prestacaoDeContas = [
            { id: 1, status: "Aprovado", unidade_nome: "Escola A" },
        ];
        const columns = [{ field: "status", header: "Status" }];

        render(
            <TabelaDinamicaPaginada
                {...defaultProps}
                prestacaoDeContas={prestacaoDeContas}
                columns={columns}
                totalRegistros={1}
            />,
        );

        expect(mockTemplates.statusTemplate).toHaveBeenCalled();
        expect(screen.getByText("Aprovado")).toBeInTheDocument();
    });

    it("usa template para coluna status", () => {
        const columns = [{ field: "status", header: "Status" }];
        const prestacaoDeContas = [{ status: "Aprovado" }];

        render(
            <TabelaDinamicaPaginada
                {...defaultProps}
                prestacaoDeContas={prestacaoDeContas}
                columns={columns}
                totalRegistros={1}
            />,
        );

        expect(mockTemplates.statusTemplate).toHaveBeenCalled();
    });

    it("usa template para coluna data_recebimento", () => {
        const columns = [{ field: "data_recebimento", header: "Data" }];
        const prestacaoDeContas = [{ data_recebimento: "2024-01-01" }];

        render(
            <TabelaDinamicaPaginada
                {...defaultProps}
                prestacaoDeContas={prestacaoDeContas}
                columns={columns}
                totalRegistros={1}
            />,
        );

        expect(mockTemplates.dataTemplate).toHaveBeenCalled();
    });

    it("usa template para coluna data_ultima_analise", () => {
        const columns = [
            { field: "data_ultima_analise", header: "Data Análise" },
        ];
        const prestacaoDeContas = [{ data_ultima_analise: "2024-01-01" }];

        render(
            <TabelaDinamicaPaginada
                {...defaultProps}
                prestacaoDeContas={prestacaoDeContas}
                columns={columns}
                totalRegistros={1}
            />,
        );

        expect(mockTemplates.dataTemplate).toHaveBeenCalled();
    });

    it("usa template para coluna processo_sei", () => {
        const columns = [{ field: "processo_sei", header: "Processo SEI" }];
        const prestacaoDeContas = [{ processo_sei: "123456" }];

        render(
            <TabelaDinamicaPaginada
                {...defaultProps}
                prestacaoDeContas={prestacaoDeContas}
                columns={columns}
                totalRegistros={1}
            />,
        );

        expect(mockTemplates.seiTemplate).toHaveBeenCalled();
    });

    it("usa template para coluna tecnico_responsavel", () => {
        const columns = [{ field: "tecnico_responsavel", header: "Técnico" }];
        const prestacaoDeContas = [{ tecnico_responsavel: "João" }];

        render(
            <TabelaDinamicaPaginada
                {...defaultProps}
                prestacaoDeContas={prestacaoDeContas}
                columns={columns}
                totalRegistros={1}
            />,
        );

        expect(mockTemplates.tecnicoTemplate).toHaveBeenCalled();
    });

    it("usa template para coluna devolucao_ao_tesouro", () => {
        const columns = [
            { field: "devolucao_ao_tesouro", header: "Devolução" },
        ];
        const prestacaoDeContas = [{ devolucao_ao_tesouro: "Sim" }];

        render(
            <TabelaDinamicaPaginada
                {...defaultProps}
                prestacaoDeContas={prestacaoDeContas}
                columns={columns}
                totalRegistros={1}
            />,
        );

        expect(mockTemplates.devolucaoTemplate).toHaveBeenCalled();
    });

    it("usa template para coluna acoes", () => {
        const columns = [{ field: "acoes", header: "Ações" }];
        const prestacaoDeContas = [{ acoes: "" }];

        render(
            <TabelaDinamicaPaginada
                {...defaultProps}
                prestacaoDeContas={prestacaoDeContas}
                columns={columns}
                totalRegistros={1}
            />,
        );

        expect(mockTemplates.acoesTemplate).toHaveBeenCalled();
    });

    it("usa template para coluna unidade_nome", () => {
        const columns = [{ field: "unidade_nome", header: "Unidade" }];
        const prestacaoDeContas = [{ unidade_nome: "Escola XYZ" }];

        render(
            <TabelaDinamicaPaginada
                {...defaultProps}
                prestacaoDeContas={prestacaoDeContas}
                columns={columns}
                totalRegistros={1}
            />,
        );

        expect(mockTemplates.nomeTemplate).toHaveBeenCalled();
    });

    it("renderiza coluna comum sem template específico", () => {
        const columns = [{ field: "codigo_eol", header: "Código EOL" }];
        const prestacaoDeContas = [{ codigo_eol: "123456" }];

        render(
            <TabelaDinamicaPaginada
                {...defaultProps}
                prestacaoDeContas={prestacaoDeContas}
                columns={columns}
                totalRegistros={1}
            />,
        );

        expect(screen.getByText("123456")).toBeInTheDocument();
    });

    it("renderiza múltiplas colunas", () => {
        const columns = [
            { field: "status", header: "Status" },
            { field: "unidade_nome", header: "Unidade" },
            { field: "data_recebimento", header: "Data" },
        ];

        const prestacaoDeContas = [
            {
                status: "Aprovado",
                unidade_nome: "Escola",
                data_recebimento: "2024-01-01",
            },
        ];

        render(
            <TabelaDinamicaPaginada
                {...defaultProps}
                prestacaoDeContas={prestacaoDeContas}
                columns={columns}
                totalRegistros={1}
            />,
        );

        expect(mockTemplates.statusTemplate).toHaveBeenCalled();
        expect(mockTemplates.nomeTemplate).toHaveBeenCalled();
        expect(mockTemplates.dataTemplate).toHaveBeenCalled();
    });

    it("não exibe paginador quando totalRegistros é menor que rowsPerPage", () => {
        const prestacaoDeContas = [{ id: 1, status: "Aprovado" }];
        const columns = [{ field: "status", header: "Status" }];

        const { container } = render(
            <TabelaDinamicaPaginada
                {...defaultProps}
                prestacaoDeContas={prestacaoDeContas}
                columns={columns}
                totalRegistros={5}
                rowsPerPage={10}
            />,
        );

        expect(container.querySelector(".p-paginator")).not.toBeInTheDocument();
    });

    it("não exibe paginador quando totalRegistros é igual a rowsPerPage", () => {
        const { container } = render(
            <TabelaDinamicaPaginada
                {...defaultProps}
                totalRegistros={10}
                rowsPerPage={10}
            />,
        );

        expect(container.querySelector(".p-paginator")).not.toBeInTheDocument();
    });

    it("exibe paginador quando totalRegistros é maior que rowsPerPage", () => {
        const prestacaoDeContas = [{ id: 1, status: "Aprovado" }];
        const columns = [{ field: "status", header: "Status" }];

        const { container } = render(
            <TabelaDinamicaPaginada
                {...defaultProps}
                prestacaoDeContas={prestacaoDeContas}
                columns={columns}
                totalRegistros={25}
                rowsPerPage={10}
            />,
        );

        expect(container.querySelector(".p-paginator")).toBeInTheDocument();
    });

    it("utiliza totalRegistros do backend em vez do tamanho da lista", () => {
        const prestacaoDeContas = [{ id: 1, status: "Aprovado" }];

        const columns = [{ field: "status", header: "Status" }];

        const { container } = render(
            <TabelaDinamicaPaginada
                {...defaultProps}
                prestacaoDeContas={prestacaoDeContas}
                columns={columns}
                totalRegistros={100}
                rowsPerPage={10}
            />,
        );

        expect(container.querySelector(".p-paginator")).toBeInTheDocument();
        expect(screen.getByText("Aprovado")).toBeInTheDocument();
    });

    it("exibe corretamente a quantidade total de registros", () => {
        render(
            <TabelaDinamicaPaginada
                {...defaultProps}
                totalRegistros={25}
                rowsPerPage={10}
                paginaAtual={1}
            />,
        );

        expect(screen.getByText(/1 a 10 de 25/)).toBeInTheDocument();
    });

    it("exibe corretamente a segunda página", () => {
        const prestacaoDeContas = [{ id: 11, unidade_nome: "Escola B" }];

        const columns = [{ field: "unidade_nome", header: "Unidade" }];

        render(
            <TabelaDinamicaPaginada
                {...defaultProps}
                prestacaoDeContas={prestacaoDeContas}
                columns={columns}
                paginaAtual={2}
                totalRegistros={25}
                rowsPerPage={10}
            />,
        );

        expect(screen.getByText("Escola B")).toBeInTheDocument();
        expect(screen.getByText(/11 a 20 de 25/)).toBeInTheDocument();
    });

    it("exibe corretamente a última página com menos registros", () => {
        const prestacaoDeContas = [{ id: 21, status: "Aprovado" }];

        const columns = [{ field: "status", header: "Status" }];

        render(
            <TabelaDinamicaPaginada
                {...defaultProps}
                prestacaoDeContas={prestacaoDeContas}
                columns={columns}
                paginaAtual={3}
                totalRegistros={25}
                rowsPerPage={10}
            />,
        );

        expect(screen.getByText("Aprovado")).toBeInTheDocument();
        expect(screen.getByText(/21 a 25 de 25/)).toBeInTheDocument();
    });

    it("chama handlePageChange ao avançar para próxima página", () => {
        const { container } = render(
            <TabelaDinamicaPaginada
                {...defaultProps}
                totalRegistros={25}
                rowsPerPage={10}
                paginaAtual={1}
            />,
        );

        const botaoProximaPagina = container.querySelector(".p-paginator-next");

        expect(botaoProximaPagina).toBeInTheDocument();

        fireEvent.click(botaoProximaPagina);

        expect(mockHandlePageChange).toHaveBeenCalledTimes(1);
        expect(mockHandlePageChange).toHaveBeenCalledWith(
            expect.objectContaining({
                first: 10,
                rows: 10,
            }),
        );
    });

    it("chama handlePageChange ao voltar para página anterior", () => {
        const { container } = render(
            <TabelaDinamicaPaginada
                {...defaultProps}
                totalRegistros={25}
                rowsPerPage={10}
                paginaAtual={2}
            />,
        );

        const botaoPaginaAnterior =
            container.querySelector(".p-paginator-prev");

        expect(botaoPaginaAnterior).toBeInTheDocument();

        fireEvent.click(botaoPaginaAnterior);

        expect(mockHandlePageChange).toHaveBeenCalledTimes(1);
        expect(mockHandlePageChange).toHaveBeenCalledWith(
            expect.objectContaining({
                first: 0,
                rows: 10,
            }),
        );
    });

    it("atualiza os registros ao receber uma nova página", () => {
        const columns = [{ field: "unidade_nome", header: "Unidade" }];

        const { rerender } = render(
            <TabelaDinamicaPaginada
                {...defaultProps}
                columns={columns}
                prestacaoDeContas={[{ id: 1, unidade_nome: "Escola A" }]}
                totalRegistros={20}
                paginaAtual={1}
            />,
        );

        expect(screen.getByText("Escola A")).toBeInTheDocument();

        rerender(
            <TabelaDinamicaPaginada
                {...defaultProps}
                columns={columns}
                prestacaoDeContas={[{ id: 11, unidade_nome: "Escola B" }]}
                totalRegistros={20}
                paginaAtual={2}
            />,
        );

        expect(screen.getByText("Escola B")).toBeInTheDocument();
        expect(screen.queryByText("Escola A")).not.toBeInTheDocument();
    });
});
