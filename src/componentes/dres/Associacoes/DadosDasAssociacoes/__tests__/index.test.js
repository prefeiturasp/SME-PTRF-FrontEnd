import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { DetalhesDaAssociacao } from "../index";
import { DADOS_DA_ASSOCIACAO } from "../../../../../services/auth.service";
import { visoesService } from "../../../../../services/visoes.service";

// ---- Mocks de react-router-dom ----
let mockUseParamsReturn = {};
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: () => mockUseParamsReturn,
    Navigate: () => <div data-testid="navigate-redirect" />,
}));

// ---- Mock de visoes.service ----
jest.mock("../../../../../services/visoes.service", () => ({
    visoesService: {
        getPermissoes: jest.fn(),
        featureFlagAtiva: jest.fn(),
    },
}));

// ---- Mocks de componentes filhos ----
jest.mock("../TopoComBotoes", () => ({
    TopoComBotoes: ({ dadosDaAssociacao }) => (
        <div data-testid="topo-com-botoes">
            {dadosDaAssociacao?.dados_da_associacao?.nome}
        </div>
    ),
}));

jest.mock("../DadosDaAssociacao/InfosAssociacao", () => ({
    InfosAssociacao: () => <div data-testid="infos-associacao">InfosAssociacao</div>,
}));

jest.mock("../DadosDaUnidadeEducacional/InfosUnidadeEducacional", () => ({
    InfosUnidadeEducacional: () => (
        <div data-testid="infos-unidade-educacional">InfosUnidadeEducacional</div>
    ),
}));

jest.mock("../DadosDasContas/InfosContas", () => ({
    InfosContas: () => <div data-testid="infos-contas">InfosContas</div>,
}));

jest.mock("../ProcessosSei/ProcessoSeiRegularidade", () => ({
    ProcessoSeiRegularidade: () => (
        <div data-testid="processo-sei-regularidade">ProcessoSeiRegularidade</div>
    ),
}));

jest.mock("../ProcessosSei/ProcessosSeiPrestacaoDeContas", () => ({
    ProcessosSeiPrestacaoDeContas: ({ recurso_uuid, recurso_nome }) => (
        <div data-testid="processos-sei-prestacao-de-contas">
            ProcessosSeiPrestacaoDeContas
            {recurso_uuid ? `-${recurso_uuid}` : ""}
            {recurso_nome ? `-${recurso_nome}` : ""}
        </div>
    ),
}));

jest.mock("../SituacaoFinanceiraUnidadeEducacional", () => ({
    SituacaoFinanceiraUnidadeEducacional: () => (
        <div data-testid="situacao-financeira">SituacaoFinanceiraUnidadeEducacional</div>
    ),
}));

jest.mock("../SituacaoPatrimonial", () => ({
    SituacaoPatrimonialUnidadeEducacional: ({ visao_dre }) => (
        <div data-testid="situacao-patrimonial">
            SituacaoPatrimonialUnidadeEducacional-{String(visao_dre)}
        </div>
    ),
}));

const TODAS_PERMISSOES_TRUE = {
    access_dados_unidade_dre: true,
    access_processo_sei: true,
    access_situacao_financeira_dre: true,
    access_situacao_patrimonial_dre: true,
};

const setupGetPermissoes = (permissoesMap) => {
    visoesService.getPermissoes.mockImplementation((permissoesSolicitadas) => {
        const chave = permissoesSolicitadas[0];
        return !!permissoesMap[chave];
    });
};

const criarRecurso = (uuid, nome, nome_exibicao, legado = false) => ({
    uuid,
    nome,
    nome_exibicao,
    legado,
});

const popularLocalStorage = (recursos_da_associacao, extras = {}) => {
    const dados = {
        dados_da_associacao: {
            nome: "Associação Teste",
            uuid: "uuid-associacao-1",
            recursos_da_associacao,
            ...extras,
        },
    };
    localStorage.setItem(DADOS_DA_ASSOCIACAO, JSON.stringify(dados));
};

const setPathname = (pathname) => {
    window.history.pushState({}, "", pathname);
};

describe("DetalhesDaAssociacao", () => {
    beforeEach(() => {
        localStorage.clear();
        mockUseParamsReturn = {};
        setPathname("/dre-associacoes");
        visoesService.getPermissoes.mockReset();
        visoesService.featureFlagAtiva.mockReset();
        visoesService.featureFlagAtiva.mockReturnValue(false);
        setupGetPermissoes(TODAS_PERMISSOES_TRUE);
    });

    afterEach(() => {
        localStorage.clear();
    });

    describe("comportamento existente quando localStorage está vazio", () => {
        it("lança erro ao montar pois dadosDaAssociacao é null (bug pré-existente, ramo Navigate é código morto)", () => {
            // Suprime o log de erro do React sobre o erro não capturado
            const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
            expect(() => render(<DetalhesDaAssociacao />)).toThrow();
            consoleErrorSpy.mockRestore();
        });
    });

    describe("com permissões todas true e único recurso", () => {
        beforeEach(() => {
            popularLocalStorage([criarRecurso("r1", "recurso-1", "Recurso 1")]);
        });

        it("renderiza todas as 6 abas/links", () => {
            render(<DetalhesDaAssociacao />);
            expect(screen.getByText("Dados da unidade")).toBeInTheDocument();
            expect(screen.getByText("Dados da associação")).toBeInTheDocument();
            expect(screen.getByText("Contas da associação")).toBeInTheDocument();
            expect(screen.getByText("Processos SEI")).toBeInTheDocument();
            expect(screen.getByText("Situação Financeira")).toBeInTheDocument();
            expect(screen.getByText("Situação Patrimonial")).toBeInTheDocument();
        });

        it("renderiza o TopoComBotoes com os dados da associação", () => {
            render(<DetalhesDaAssociacao />);
            expect(screen.getByTestId("topo-com-botoes")).toHaveTextContent("Associação Teste");
        });

        it("a primeira aba (dados_unidade) fica ativa por padrão e mostra InfosUnidadeEducacional", () => {
            render(<DetalhesDaAssociacao />);
            const abaDadosUnidade = screen.getByText("Dados da unidade");
            expect(abaDadosUnidade).toHaveClass("btn-escolhe-aba-active");
            expect(screen.getByTestId("infos-unidade-educacional")).toBeInTheDocument();
        });

        it("clicar na aba dados_associacao ativa o conteúdo correspondente", () => {
            render(<DetalhesDaAssociacao />);
            fireEvent.click(screen.getByText("Dados da associação"));
            expect(screen.getByText("Dados da associação")).toHaveClass("btn-escolhe-aba-active");
            expect(screen.getByTestId("infos-associacao")).toBeInTheDocument();
        });

        it("clicar na aba contas_associacao ativa o conteúdo correspondente", () => {
            render(<DetalhesDaAssociacao />);
            fireEvent.click(screen.getByText("Contas da associação"));
            expect(screen.getByText("Contas da associação")).toHaveClass("btn-escolhe-aba-active");
            expect(screen.getByTestId("infos-contas")).toBeInTheDocument();
        });

        it("clicar na aba processos_sei ativa o conteúdo e mostra ProcessoSeiRegularidade + ProcessosSeiPrestacaoDeContas sem sub-abas", () => {
            render(<DetalhesDaAssociacao />);
            fireEvent.click(screen.getByText("Processos SEI"));
            expect(screen.getByText("Processos SEI")).toHaveClass("btn-escolhe-aba-active");
            expect(screen.getByTestId("processo-sei-regularidade")).toBeInTheDocument();
            expect(screen.getByTestId("processos-sei-prestacao-de-contas")).toBeInTheDocument();
        });

        it("clicar na aba situacao_financeira ativa o conteúdo correspondente", () => {
            render(<DetalhesDaAssociacao />);
            fireEvent.click(screen.getByText("Situação Financeira"));
            expect(screen.getByText("Situação Financeira")).toHaveClass("btn-escolhe-aba-active");
            expect(screen.getByTestId("situacao-financeira")).toBeInTheDocument();
        });

        it("clicar na aba situacao_patrimonial ativa o conteúdo correspondente", () => {
            render(<DetalhesDaAssociacao />);
            fireEvent.click(screen.getByText("Situação Patrimonial"));
            expect(screen.getByText("Situação Patrimonial")).toHaveClass("btn-escolhe-aba-active");
            expect(screen.getByTestId("situacao-patrimonial")).toHaveTextContent("true");
        });

        it("clicar duas vezes na mesma aba desativa e reativa (toggle)", () => {
            render(<DetalhesDaAssociacao />);
            const abaContas = screen.getByText("Contas da associação");
            fireEvent.click(abaContas);
            expect(abaContas).toHaveClass("btn-escolhe-aba-active");
            fireEvent.click(abaContas);
            expect(abaContas).not.toHaveClass("btn-escolhe-aba-active");
        });
    });

    describe("com algumas permissões false", () => {
        it("oculta abas sem permissão e setPrimeiroActive pula para a primeira permitida (contas_associacao)", () => {
            popularLocalStorage([criarRecurso("r1", "recurso-1", "Recurso 1")]);
            setupGetPermissoes({
                access_dados_unidade_dre: true,
                access_processo_sei: false,
                access_situacao_financeira_dre: false,
                access_situacao_patrimonial_dre: false,
            });

            render(<DetalhesDaAssociacao />);

            // dados_unidade, dados_associacao e contas_associacao usam a mesma permissão (true)
            expect(screen.getByText("Dados da unidade")).toBeInTheDocument();
            expect(screen.getByText("Dados da associação")).toBeInTheDocument();
            expect(screen.getByText("Contas da associação")).toBeInTheDocument();
            expect(screen.queryByText("Processos SEI")).not.toBeInTheDocument();
            expect(screen.queryByText("Situação Financeira")).not.toBeInTheDocument();
            expect(screen.queryByText("Situação Patrimonial")).not.toBeInTheDocument();

            // Primeira aba (dados_unidade) é a primeira na lista e tem permissão, deve estar ativa
            expect(screen.getByText("Dados da unidade")).toHaveClass("btn-escolhe-aba-active");
        });

        it("quando dados_unidade_dre é false, a primeira aba ativa é processos_sei (próxima com permissão)", () => {
            popularLocalStorage([criarRecurso("r1", "recurso-1", "Recurso 1")]);
            setupGetPermissoes({
                access_dados_unidade_dre: false,
                access_processo_sei: true,
                access_situacao_financeira_dre: true,
                access_situacao_patrimonial_dre: true,
            });

            render(<DetalhesDaAssociacao />);

            expect(screen.queryByText("Dados da unidade")).not.toBeInTheDocument();
            expect(screen.queryByText("Dados da associação")).not.toBeInTheDocument();
            expect(screen.queryByText("Contas da associação")).not.toBeInTheDocument();
            expect(screen.getByText("Processos SEI")).toBeInTheDocument();
            expect(screen.getByText("Processos SEI")).toHaveClass("btn-escolhe-aba-active");
            expect(screen.getByTestId("processo-sei-regularidade")).toBeInTheDocument();
        });

        it("quando nenhuma permissão é true, nenhuma aba é renderizada", () => {
            popularLocalStorage([criarRecurso("r1", "recurso-1", "Recurso 1")]);
            setupGetPermissoes({});

            render(<DetalhesDaAssociacao />);

            expect(screen.queryByText("Dados da unidade")).not.toBeInTheDocument();
            expect(screen.queryByText("Dados da associação")).not.toBeInTheDocument();
            expect(screen.queryByText("Contas da associação")).not.toBeInTheDocument();
            expect(screen.queryByText("Processos SEI")).not.toBeInTheDocument();
            expect(screen.queryByText("Situação Financeira")).not.toBeInTheDocument();
            expect(screen.queryByText("Situação Patrimonial")).not.toBeInTheDocument();
        });
    });

    describe("origem via useParams = 'situacao-patrimonial'", () => {
        it("inicia com a aba situacao_patrimonial ativa quando há permissão", () => {
            mockUseParamsReturn = { origem: "situacao-patrimonial" };
            popularLocalStorage([criarRecurso("r1", "recurso-1", "Recurso 1")]);

            render(<DetalhesDaAssociacao />);

            expect(screen.getByText("Situação Patrimonial")).toHaveClass("btn-escolhe-aba-active");
            expect(screen.getByText("Dados da unidade")).not.toHaveClass("btn-escolhe-aba-active");
            expect(screen.getByTestId("situacao-patrimonial")).toBeInTheDocument();
        });
    });

    describe("acesso via dre-relatorio-consolidado", () => {
        it("nenhuma aba inicia ativa quando pathname contém 'dre-relatorio-consolidado'", () => {
            setPathname("/dre-relatorio-consolidado/123");
            popularLocalStorage([criarRecurso("r1", "recurso-1", "Recurso 1")]);

            render(<DetalhesDaAssociacao />);

            expect(screen.getByText("Dados da unidade")).not.toHaveClass("btn-escolhe-aba-active");
            expect(screen.getByText("Dados da associação")).not.toHaveClass("btn-escolhe-aba-active");
            expect(screen.getByText("Contas da associação")).not.toHaveClass("btn-escolhe-aba-active");
            expect(screen.getByText("Processos SEI")).not.toHaveClass("btn-escolhe-aba-active");
            expect(screen.getByText("Situação Financeira")).not.toHaveClass("btn-escolhe-aba-active");
            expect(screen.getByText("Situação Patrimonial")).not.toHaveClass("btn-escolhe-aba-active");
        });
    });

    describe("múltiplos recursos + feature flag premio-excelencia-processo-sei", () => {
        it("com feature flag true e múltiplos recursos, mostra sub-abas ordenadas (legado primeiro, depois alfabético) e clicar nelas as ativa mantendo processos_sei ativo", () => {
            visoesService.featureFlagAtiva.mockImplementation(
                (flag) => flag === "premio-excelencia-processo-sei"
            );
            popularLocalStorage([
                criarRecurso("r-zeta", "zeta", "Zeta Recurso", false),
                criarRecurso("r-legado", "legado", "Legado Recurso", true),
                criarRecurso("r-alpha", "alpha", "Alpha Recurso", false),
            ]);

            render(<DetalhesDaAssociacao />);

            fireEvent.click(screen.getByText("Processos SEI"));

            // Ordem esperada: legado primeiro, depois alfabético por nome_exibicao (Alpha, Zeta)
            const subAbasContainer = screen.getByText("Legado Recurso").closest("div.nav-tabs");
            const linksTexts = within(subAbasContainer)
                .getAllByRole("tab")
                .map((el) => el.textContent);
            expect(linksTexts).toEqual(["Legado Recurso", "Alpha Recurso", "Zeta Recurso"]);

            // Ao clicar em processos_sei com >1 recurso, a primeira sub-aba (legado) já deve estar ativa
            expect(screen.getByText("Legado Recurso")).toHaveClass("btn-escolhe-aba-active");

            // Clicar em outra sub-aba (Alpha) a ativa
            fireEvent.click(screen.getByText("Alpha Recurso"));
            expect(screen.getByText("Alpha Recurso")).toHaveClass("btn-escolhe-aba-active");
            // processos_sei continua ativo
            expect(screen.getByText("Processos SEI")).toHaveClass("btn-escolhe-aba-active");

            // Existem 3 instâncias do ProcessosSeiPrestacaoDeContas, uma por recurso
            const instancias = screen.getAllByTestId("processos-sei-prestacao-de-contas");
            expect(instancias).toHaveLength(3);
        });

        it("com feature flag false (mesmo com múltiplos recursos), sub-abas não aparecem", () => {
            visoesService.featureFlagAtiva.mockReturnValue(false);
            popularLocalStorage([
                criarRecurso("r-zeta", "zeta", "Zeta Recurso", false),
                criarRecurso("r-alpha", "alpha", "Alpha Recurso", false),
            ]);

            render(<DetalhesDaAssociacao />);
            fireEvent.click(screen.getByText("Processos SEI"));

            expect(screen.queryByText("Zeta Recurso")).not.toBeInTheDocument();
            expect(screen.queryByText("Alpha Recurso")).not.toBeInTheDocument();
            expect(screen.getAllByTestId("processos-sei-prestacao-de-contas")).toHaveLength(1);
        });

        it("com feature flag true mas único recurso, sub-abas não aparecem", () => {
            visoesService.featureFlagAtiva.mockImplementation(
                (flag) => flag === "premio-excelencia-processo-sei"
            );
            popularLocalStorage([criarRecurso("r1", "recurso-1", "Recurso 1", false)]);

            render(<DetalhesDaAssociacao />);
            fireEvent.click(screen.getByText("Processos SEI"));

            expect(screen.queryByText("Recurso 1")).not.toBeInTheDocument();
            expect(screen.getAllByTestId("processos-sei-prestacao-de-contas")).toHaveLength(1);
        });
    });
});
