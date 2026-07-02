import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Associacoes } from "../index";

jest.mock("../../../../services/dres/Associacoes.service", () => ({
    getAssociacoesPorUnidade: jest.fn(),
    filtrosAssociacoes: jest.fn(),
    getAssociacao: jest.fn(),
    getContasAssociacao: jest.fn(),
    getContasAssociacaoEncerradas: jest.fn(),
    getTabelaAssociacoesDre: jest.fn(),
}));

jest.mock("../../../../services/visoes.service", () => ({
    visoesService: {
        getPermissoes: jest.fn(),
    },
}));

jest.mock("../../../../services/auth.service", () => ({
    DADOS_DA_ASSOCIACAO: "DADOS_DA_ASSOCIACAO",
}));

jest.mock("../../../../utils/Loading", () => () => (
    <div data-testid="loading" />
));

jest.mock("react-router-dom", () => ({
    Navigate: () => <div data-testid="navigate" />,
}));

let capturedMsgImgCentralizada = null;
jest.mock("../../../Globais/Mensagens/MsgImgCentralizada", () => ({
    MsgImgCentralizada: (props) => {
        capturedMsgImgCentralizada = props;
        return <div data-testid="msg-img-centralizada">{props.texto}</div>;
    },
}));

let capturedMsgImgLadoDireito = null;
jest.mock("../../../Globais/Mensagens/MsgImgLadoDireito", () => ({
    MsgImgLadoDireito: (props) => {
        capturedMsgImgLadoDireito = props;
        return <div data-testid="msg-img-lado-direito">{props.texto}</div>;
    },
}));

jest.mock("../../../Globais/UI/Icon", () => ({
    Icon: () => <span data-testid="icon" />,
}));

let capturedTabelaAssociacoesProps = null;
jest.mock("../TabelaAssociacoes", () => ({
    TabelaAssociacoes: (props) => {
        capturedTabelaAssociacoesProps = props;
        return <div data-testid="tabela-associacoes" />;
    },
}));

let capturedFiltrosAssociacoesProps = null;
jest.mock("../FiltrosAssociacoes", () => ({
    FiltrosAssociacoes: (props) => {
        capturedFiltrosAssociacoesProps = props;
        return <div data-testid="filtros-associacoes" />;
    },
}));

import {
    getAssociacoesPorUnidade,
    filtrosAssociacoes,
    getAssociacao,
    getContasAssociacao,
    getContasAssociacaoEncerradas,
    getTabelaAssociacoesDre,
} from "../../../../services/dres/Associacoes.service";
import { visoesService } from "../../../../services/visoes.service";

describe("Associacoes (index)", () => {
    const associacaoMock = {
        uuid: "assoc-1",
        unidade: { codigo_eol: "111", nome_com_tipo: "EMEI Teste" },
    };

    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
        capturedMsgImgCentralizada = null;
        capturedMsgImgLadoDireito = null;
        capturedTabelaAssociacoesProps = null;
        capturedFiltrosAssociacoesProps = null;

        getTabelaAssociacoesDre.mockResolvedValue({
            tipos_unidade: [],
            filtro_informacoes: [],
        });
        getAssociacoesPorUnidade.mockResolvedValue([]);
        filtrosAssociacoes.mockResolvedValue([]);
        getAssociacao.mockResolvedValue({ uuid: "assoc-1" });
        getContasAssociacao.mockResolvedValue([]);
        getContasAssociacaoEncerradas.mockResolvedValue([]);
        visoesService.getPermissoes.mockReturnValue(false);
    });

    afterEach(() => {
        localStorage.clear();
    });

    it("chama getTabelaAssociacoesDre e getAssociacoesPorUnidade na montagem", async () => {
        render(<Associacoes />);
        await waitFor(() => {
            expect(getTabelaAssociacoesDre).toHaveBeenCalledTimes(1);
            expect(getAssociacoesPorUnidade).toHaveBeenCalledTimes(1);
        });
    });

    it("exibe Loading enquanto getAssociacoesPorUnidade não resolve", async () => {
        let resolveFn;
        getAssociacoesPorUnidade.mockReturnValue(
            new Promise((resolve) => {
                resolveFn = resolve;
            })
        );

        render(<Associacoes />);
        expect(screen.getByTestId("loading")).toBeInTheDocument();

        await act(async () => {
            resolveFn([]);
        });

        await waitFor(() => {
            expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
        });
    });

    it("renderiza TabelaAssociacoes quando associacoes.length > 0", async () => {
        getAssociacoesPorUnidade.mockResolvedValue([associacaoMock]);

        render(<Associacoes />);

        await waitFor(() => {
            expect(screen.getByTestId("tabela-associacoes")).toBeInTheDocument();
        });
        expect(screen.queryByTestId("msg-img-centralizada")).not.toBeInTheDocument();
        expect(screen.queryByTestId("msg-img-lado-direito")).not.toBeInTheDocument();
    });

    it("renderiza MsgImgLadoDireito quando lista vazia e sem busca por filtros", async () => {
        getAssociacoesPorUnidade.mockResolvedValue([]);

        render(<Associacoes />);

        await waitFor(() => {
            expect(screen.getByTestId("msg-img-lado-direito")).toBeInTheDocument();
        });
        expect(screen.queryByTestId("tabela-associacoes")).not.toBeInTheDocument();
        expect(screen.queryByTestId("msg-img-centralizada")).not.toBeInTheDocument();
        expect(capturedMsgImgLadoDireito.texto).toBe(
            "Não encontramos nenhuma Associação com este perfil, tente novamente"
        );
    });

    it("renderiza MsgImgCentralizada quando lista vazia após busca por filtros", async () => {
        getAssociacoesPorUnidade.mockResolvedValue([]);
        filtrosAssociacoes.mockResolvedValue([]);

        render(<Associacoes />);

        await waitFor(() => {
            expect(capturedFiltrosAssociacoesProps).not.toBeNull();
        });

        await act(async () => {
            await capturedFiltrosAssociacoesProps.handleSubmitFiltrosAssociacao({
                preventDefault: jest.fn(),
            });
        });

        await waitFor(() => {
            expect(screen.getByTestId("msg-img-centralizada")).toBeInTheDocument();
        });
        expect(screen.queryByTestId("msg-img-lado-direito")).not.toBeInTheDocument();
        expect(capturedMsgImgCentralizada.texto).toBe(
            "Não encontramos resultados, verifique os filtros e tente novamente."
        );
    });

    it("handleSubmitFiltrosAssociacao chama filtrosAssociacoes com os 4 argumentos corretos e atualiza a tabela", async () => {
        const resultadoFiltro = [associacaoMock];
        filtrosAssociacoes.mockResolvedValue(resultadoFiltro);

        render(<Associacoes />);

        await waitFor(() => {
            expect(capturedFiltrosAssociacoesProps).not.toBeNull();
        });

        await act(async () => {
            capturedFiltrosAssociacoesProps.handleChangeFiltrosAssociacao(
                "unidade_escolar_ou_associacao",
                "Termo X"
            );
        });
        await act(async () => {
            capturedFiltrosAssociacoesProps.handleChangeFiltrosAssociacao(
                "tipo_de_unidade",
                "EMEI"
            );
        });
        await act(async () => {
            capturedFiltrosAssociacoesProps.handleOnChangeMultipleSelectStatus([
                "status1",
            ]);
        });

        await act(async () => {
            await capturedFiltrosAssociacoesProps.handleSubmitFiltrosAssociacao({
                preventDefault: jest.fn(),
            });
        });

        expect(filtrosAssociacoes).toHaveBeenCalledWith(
            "Termo X",
            null,
            "EMEI",
            ["status1"]
        );

        await waitFor(() => {
            expect(screen.getByTestId("tabela-associacoes")).toBeInTheDocument();
        });
        expect(capturedTabelaAssociacoesProps.associacoes).toEqual(resultadoFiltro);
    });

    it("limpaFiltros reseta stateFiltros e rechama getAssociacoesPorUnidade", async () => {
        render(<Associacoes />);

        await waitFor(() => {
            expect(capturedFiltrosAssociacoesProps).not.toBeNull();
        });

        await act(async () => {
            capturedFiltrosAssociacoesProps.handleChangeFiltrosAssociacao(
                "unidade_escolar_ou_associacao",
                "Termo Y"
            );
        });

        expect(capturedFiltrosAssociacoesProps.stateFiltros.unidade_escolar_ou_associacao).toBe(
            "Termo Y"
        );

        getAssociacoesPorUnidade.mockClear();
        getAssociacoesPorUnidade.mockResolvedValue([]);

        await act(async () => {
            await capturedFiltrosAssociacoesProps.limpaFiltros();
        });

        expect(getAssociacoesPorUnidade).toHaveBeenCalledTimes(1);
        expect(capturedFiltrosAssociacoesProps.stateFiltros).toEqual({
            unidade_escolar_ou_associacao: "",
            tipo_de_unidade: "",
            filtro_status: [],
        });
    });

    it("handleChangeFiltrosAssociacao e handleOnChangeMultipleSelectStatus atualizam stateFiltros", async () => {
        render(<Associacoes />);

        await waitFor(() => {
            expect(capturedFiltrosAssociacoesProps).not.toBeNull();
        });

        await act(async () => {
            capturedFiltrosAssociacoesProps.handleChangeFiltrosAssociacao(
                "unidade_escolar_ou_associacao",
                "Buscar Algo"
            );
        });
        expect(capturedFiltrosAssociacoesProps.stateFiltros.unidade_escolar_ou_associacao).toBe(
            "Buscar Algo"
        );

        await act(async () => {
            capturedFiltrosAssociacoesProps.handleOnChangeMultipleSelectStatus([
                "status1",
                "status2",
            ]);
        });
        expect(capturedFiltrosAssociacoesProps.stateFiltros.filtro_status).toEqual([
            "status1",
            "status2",
        ]);
    });

    it("trata erro de getAssociacoesPorUnidade no useEffect inicial sem quebrar", async () => {
        const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
        getAssociacoesPorUnidade.mockRejectedValue(new Error("Erro de rede"));

        render(<Associacoes />);

        await waitFor(() => {
            expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
        });

        expect(screen.getByTestId("msg-img-lado-direito")).toBeInTheDocument();
        consoleSpy.mockRestore();
    });

    it("unidadeEscolarTemplate retorna strong quando rowData.unidade.nome_com_tipo existe", async () => {
        getAssociacoesPorUnidade.mockResolvedValue([associacaoMock]);

        render(<Associacoes />);

        await waitFor(() => {
            expect(capturedTabelaAssociacoesProps).not.toBeNull();
        });

        const { container } = render(
            capturedTabelaAssociacoesProps.unidadeEscolarTemplate(associacaoMock)
        );
        expect(container.querySelector("strong")).toHaveTextContent("EMEI Teste");
    });

    it("unidadeEscolarTemplate não renderiza strong quando nome_com_tipo não existe", async () => {
        getAssociacoesPorUnidade.mockResolvedValue([associacaoMock]);

        render(<Associacoes />);

        await waitFor(() => {
            expect(capturedTabelaAssociacoesProps).not.toBeNull();
        });

        const semNome = { uuid: "assoc-2", unidade: {} };
        const { container } = render(
            capturedTabelaAssociacoesProps.unidadeEscolarTemplate(semNome)
        );
        expect(container.querySelector("strong")).not.toBeInTheDocument();
    });

    it("o botão de ação fica desabilitado quando o usuário não possui nenhuma permissão", async () => {
        getAssociacoesPorUnidade.mockResolvedValue([associacaoMock]);
        visoesService.getPermissoes.mockReturnValue(false);

        render(<Associacoes />);

        await waitFor(() => {
            expect(capturedTabelaAssociacoesProps).not.toBeNull();
        });

        const { container } = render(
            capturedTabelaAssociacoesProps.acoesTemplate(associacaoMock)
        );
        expect(container.querySelector("button")).toBeDisabled();
    });

    it("o botão de ação fica habilitado quando o usuário possui ao menos uma permissão", async () => {
        getAssociacoesPorUnidade.mockResolvedValue([associacaoMock]);
        visoesService.getPermissoes.mockImplementation((permissoes) =>
            permissoes.includes("access_dados_unidade_dre")
        );

        render(<Associacoes />);

        await waitFor(() => {
            expect(capturedTabelaAssociacoesProps).not.toBeNull();
        });

        const { container } = render(
            capturedTabelaAssociacoesProps.acoesTemplate(associacaoMock)
        );
        expect(container.querySelector("button")).not.toBeDisabled();
    });

    it("passa showModalLegendaInformacao e setShowModalLegendaInformacao para TabelaAssociacoes", async () => {
        getAssociacoesPorUnidade.mockResolvedValue([associacaoMock]);

        render(<Associacoes />);

        await waitFor(() => {
            expect(capturedTabelaAssociacoesProps).not.toBeNull();
        });

        expect(capturedTabelaAssociacoesProps.showModalLegendaInformacao).toBe(false);
        expect(typeof capturedTabelaAssociacoesProps.setShowModalLegendaInformacao).toBe(
            "function"
        );
    });

    it("passa rowsPerPage de 15 para TabelaAssociacoes", async () => {
        getAssociacoesPorUnidade.mockResolvedValue([associacaoMock]);

        render(<Associacoes />);

        await waitFor(() => {
            expect(capturedTabelaAssociacoesProps).not.toBeNull();
        });

        expect(capturedTabelaAssociacoesProps.rowsPerPage).toBe(15);
    });

    it("passa tabelaAssociacoes obtido de getTabelaAssociacoesDre para FiltrosAssociacoes", async () => {
        getTabelaAssociacoesDre.mockResolvedValue({
            tipos_unidade: [{ id: "EMEI", nome: "EMEI" }],
            filtro_informacoes: [{ id: "status1", nome: "Status 1" }],
        });

        render(<Associacoes />);

        await waitFor(() => {
            expect(capturedFiltrosAssociacoesProps.tabelaAssociacoes.tipos_unidade).toEqual([
                { id: "EMEI", nome: "EMEI" },
            ]);
        });
    });
});
