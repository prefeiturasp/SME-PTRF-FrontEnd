import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { RelatorioConsolidadoDadosDasUes } from "../index";
import { visoesService } from "../../../../../services/visoes.service";
import { auxGetNomes } from "../../auxGetNomes";
import * as svc from "../../../../../services/dres/RelatorioConsolidado.service";
import { getAssociacao, getContasAssociacao } from "../../../../../services/dres/Associacoes.service";

jest.mock("react-router-dom", () => ({
    useParams: jest.fn(),
}));
jest.mock("../../../../../services/visoes.service", () => ({
    visoesService: { getItemUsuarioLogado: jest.fn() },
}));
jest.mock("../../auxGetNomes", () => ({
    auxGetNomes: { nomePeriodo: jest.fn(), nomeConta: jest.fn() },
}));
jest.mock("../../../../../services/dres/RelatorioConsolidado.service", () => ({
    getListaPrestacaoDeContasDaDre: jest.fn(),
    getTiposDeUnidade: jest.fn(),
    getStatusPc: jest.fn(),
    getListaPrestacaoDeContasDaDreFiltros: jest.fn(),
    getListaAssociacoesNaoRegularizadas: jest.fn(),
}));
jest.mock("../../../../../services/dres/Associacoes.service", () => ({
    getAssociacao: jest.fn(),
    getContasAssociacao: jest.fn(),
}));
jest.mock("../../../../../utils/Loading", () => () => <div data-testid="loading" />);
jest.mock("../../../../Globais/Mensagens/MsgImgCentralizada", () => ({
    MsgImgCentralizada: ({ texto }) => <div data-testid="msg">{texto}</div>,
}));

let mockProps = {};
jest.mock("../FormFiltros", () => ({
    FormFiltros: (props) => {
        mockProps.filtros = props;
        return (
            <form data-testid="form" onSubmit={props.handleSubmitFiltros}>
                <button type="button" data-testid="change" onClick={() => props.handleChangeFiltros("filtrar_por_ue", "abc")} />
                <button type="button" data-testid="limpa" onClick={props.limpaFiltros} />
                <button type="submit" data-testid="submit" />
            </form>
        );
    },
}));
jest.mock("../AssociacoesNaoRegularizadas", () => ({
    __esModule: true,
    default: (props) => {
        mockProps.assoc = props;
        return <div data-testid="assoc" />;
    },
}));
jest.mock("../TabelaListaPrestacoesDaDre", () => ({
    TabelaListaPrestacoesDaDre: (props) => {
        mockProps.tabela = props;
        return <div data-testid="tabela">{props.listaPrestacoes.length}</div>;
    },
}));
jest.mock("../TopoComBotoes", () => ({
    TopoComBotoes: (props) => {
        mockProps.topo = props;
        return <div data-testid="topo">{props.periodoNome}|{props.contaNome}|{String(props.jaPublicado)}</div>;
    },
}));

import { useParams } from "react-router-dom";

const renderar = async () => {
    let r;
    await act(async () => {
        r = render(<RelatorioConsolidadoDadosDasUes />);
    });
    return r;
};

describe("RelatorioConsolidadoDadosDasUes", () => {
    const originalLocation = window.location;
    let assign;

    beforeEach(() => {
        mockProps = {};
        assign = jest.fn();
        delete window.location;
        window.location = { assign };
        jest.spyOn(console, "log").mockImplementation(() => {});
        useParams.mockReturnValue({ periodo_uuid: "p1", conta_uuid: "c1", ja_publicado: "true" });
        visoesService.getItemUsuarioLogado.mockReturnValue("dre-uuid");
        auxGetNomes.nomePeriodo.mockResolvedValue("2024.1");
        auxGetNomes.nomeConta.mockResolvedValue("Cheque");
        svc.getListaPrestacaoDeContasDaDre.mockResolvedValue([{ id: 1 }, { id: 2 }]);
        svc.getTiposDeUnidade.mockResolvedValue({ tipos_unidade: [{ id: "A" }] });
        svc.getStatusPc.mockResolvedValue({ status: [{ id: "S" }] });
        svc.getListaAssociacoesNaoRegularizadas.mockResolvedValue([{ uuid: "a1" }]);
        svc.getListaPrestacaoDeContasDaDreFiltros.mockResolvedValue([{ id: 9 }]);
        getAssociacao.mockResolvedValue({ nome: "Assoc" });
        getContasAssociacao.mockResolvedValue([{ id: 1 }]);
        localStorage.clear();
    });

    afterEach(() => {
        window.location = originalLocation;
        jest.restoreAllMocks();
    });

    it("exibe loading durante carregamento", async () => {
        svc.getListaPrestacaoDeContasDaDre.mockReturnValue(new Promise(() => {}));
        svc.getListaAssociacoesNaoRegularizadas.mockReturnValue(new Promise(() => {}));
        await renderar();
        expect(screen.getByTestId("loading")).toBeInTheDocument();
    });

    it("renderiza conteúdo carregado", async () => {
        await renderar();
        await waitFor(() => expect(screen.getByTestId("tabela")).toHaveTextContent("2"));
        expect(screen.getByTestId("topo")).toHaveTextContent("2024.1|Cheque|true");
        expect(svc.getListaPrestacaoDeContasDaDre).toHaveBeenCalledWith("dre-uuid", "p1", "c1");
        expect(mockProps.filtros.tiposDeUnidade).toEqual([{ id: "A" }]);
        expect(mockProps.filtros.statusPc).toEqual([{ id: "S" }]);
        expect(mockProps.assoc.listaAssociacoesNaoRegularizadas).toEqual([{ uuid: "a1" }]);
    });

    it("valorTemplate formata sem R$", async () => {
        await renderar();
        await waitFor(() => expect(mockProps.tabela).toBeDefined());
        const v = mockProps.tabela.valorTemplate(1234.5);
        expect(v).not.toMatch(/R|\$/);
        expect(v).toContain("1.234,50");
    });

    it("exibe mensagem quando não há prestações", async () => {
        svc.getListaPrestacaoDeContasDaDre.mockResolvedValue([]);
        await renderar();
        await waitFor(() => expect(screen.getByTestId("msg")).toHaveTextContent("Não encontramos nenhuma prestação de contas"));
        expect(screen.queryByTestId("tabela")).not.toBeInTheDocument();
    });

    it("não busca nome do período sem periodo_uuid", async () => {
        useParams.mockReturnValue({ conta_uuid: "c1", ja_publicado: "false" });
        await renderar();
        await waitFor(() => expect(screen.getByTestId("topo")).toBeInTheDocument());
        expect(auxGetNomes.nomePeriodo).not.toHaveBeenCalled();
        expect(auxGetNomes.nomeConta).toHaveBeenCalled();
    });

    it("filtra ao submeter o formulário", async () => {
        await renderar();
        await waitFor(() => expect(screen.getByTestId("form")).toBeInTheDocument());
        fireEvent.click(screen.getByTestId("change"));
        await act(async () => {
            fireEvent.submit(screen.getByTestId("form"));
        });
        expect(svc.getListaPrestacaoDeContasDaDreFiltros).toHaveBeenCalledWith("dre-uuid", "p1", "c1", "abc", "", "");
        await waitFor(() => expect(screen.getByTestId("tabela")).toHaveTextContent("1"));
    });

    it("limpa filtros e recarrega lista", async () => {
        await renderar();
        await waitFor(() => expect(screen.getByTestId("form")).toBeInTheDocument());
        fireEvent.click(screen.getByTestId("change"));
        svc.getListaPrestacaoDeContasDaDre.mockClear();
        await act(async () => {
            fireEvent.click(screen.getByTestId("limpa"));
        });
        expect(svc.getListaPrestacaoDeContasDaDre).toHaveBeenCalled();
        await waitFor(() => expect(mockProps.filtros.stateFiltros.filtrar_por_ue).toBe(""));
    });

    it("templates de associações não regularizadas", async () => {
        await renderar();
        await waitFor(() => expect(mockProps.assoc).toBeDefined());
        const { nomeTemplate, motivoTemplate } = mockProps.assoc;

        render(nomeTemplate({ unidade: { codigo_eol: "99" }, nome: "Assoc X" }, { field: "nome" }));
        expect(screen.getByText("99 - Assoc X")).toBeInTheDocument();

        render(motivoTemplate({ motivo: "Falta doc" }, { field: "motivo" }));
        expect(screen.getByText("Falta doc")).toBeInTheDocument();

        render(motivoTemplate({}, { field: "motivo" }));
        expect(screen.getByText(/Informe motivo/)).toBeInTheDocument();
    });

    it("acoesTemplate salva dados da associação e redireciona", async () => {
        await renderar();
        await waitFor(() => expect(mockProps.assoc).toBeDefined());
        const { container } = render(mockProps.assoc.acoesTemplate({ uuid: "a1" }));
        await act(async () => {
            fireEvent.click(container.querySelector("button"));
        });
        expect(getAssociacao).toHaveBeenCalledWith("a1");
        expect(getContasAssociacao).toHaveBeenCalledWith("a1");
        const salvo = JSON.parse(localStorage.getItem("DADOS_DA_ASSOCIACAO"));
        expect(salvo.dados_da_associacao.nome).toBe("Assoc");
        expect(salvo.dados_da_associacao.contas).toEqual([{ id: 1 }]);
        expect(assign).toHaveBeenCalledWith("/dre-detalhes-associacao/dre-relatorio-consolidado/p1/c1");
    });

    it("acoesTemplate trata erro sem redirecionar", async () => {
        await renderar();
        await waitFor(() => expect(mockProps.assoc).toBeDefined());
        getAssociacao.mockRejectedValue(new Error("falha"));
        const { container } = render(mockProps.assoc.acoesTemplate({ uuid: "a1" }));
        await act(async () => {
            fireEvent.click(container.querySelector("button"));
        });
        expect(assign).not.toHaveBeenCalled();
        await waitFor(() => expect(screen.getByTestId("topo")).toBeInTheDocument());
    });
});
