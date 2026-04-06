import React from "react";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import { Dashboard } from "../index";

jest.mock("../../../../services/visoes.service", () => ({
    visoesService: {
        getItemUsuarioLogado: jest.fn(),
    },
}));

jest.mock("../../../../services/auth.service", () => ({
    ASSOCIACAO_UUID: "UUID",
}));

jest.mock("../../../../services/escolas/PrestacaoDeContas.service", () => ({
    getPeriodosAteAgoraForaImplantacaoDaAssociacao: jest.fn(),
    getStatusPeriodoPorData: jest.fn(),
}));

jest.mock("../../../../services/Dashboard.service", () => ({
    getAcoesAssociacao: jest.fn(),
    getAcoesAssociacaoPorPeriodoConta: jest.fn(),
    getContas: jest.fn(),
}));

jest.mock("../../../../utils/ValidacoesAdicionaisFormularios", () => ({
    exibeDataPT_BR: jest.fn((data) => `formatado(${data})`),
}));

jest.mock("../../../../utils/Loading", () => () => (
    <div data-testid="loading">Carregando...</div>
));

let capturedGetCorSaldo = null;
let capturedGetCssDestaque = null;

jest.mock("../DashboardCard", () => ({
    DashboardCard: ({ acoesAssociacao, getCorSaldo, getCssDestaque }) => {
        capturedGetCorSaldo = getCorSaldo;
        capturedGetCssDestaque = getCssDestaque;
        return <div data-testid="dashboard-card">{JSON.stringify(acoesAssociacao)}</div>;
    },
}));

jest.mock("../DashboardCardInfoConta", () => ({
    DashboardCardInfoConta: ({ acoesAssociacao }) => (
        <div data-testid="dashboard-card-info-conta">{JSON.stringify(acoesAssociacao)}</div>
    ),
}));

jest.mock("../SelectPeriodo", () => ({
    SelectPeriodo: ({ periodosAssociacao, handleChangePeriodo, selectPeriodo }) => (
        <select
            data-testid="select-periodo"
            value={selectPeriodo}
            onChange={(e) => handleChangePeriodo(e.target.value)}
        >
            {periodosAssociacao &&
                periodosAssociacao.map((p) => (
                    <option key={p.uuid} value={p.uuid}>
                        {p.referencia}
                    </option>
                ))}
        </select>
    ),
}));

jest.mock("../SelectConta", () => ({
    SelectConta: ({ handleChangeConta, selectConta, tiposConta }) => (
        <select
            data-testid="select-conta"
            value={selectConta || ""}
            onChange={(e) => handleChangeConta(e.target.value)}
        >
            <option value="">Todas</option>
            {tiposConta &&
                tiposConta.map((c) => (
                    <option key={c.uuid} value={c.uuid}>
                        {c.nome}
                    </option>
                ))}
        </select>
    ),
}));

jest.mock("../BarraDeStatusPeriodoAssociacao", () => ({
    BarraDeStatusPeriodoAssociacao: ({ statusPeriodoAssociacao }) => (
        <div data-testid="barra-status">
            {statusPeriodoAssociacao ? statusPeriodoAssociacao.prestacao_contas_status?.texto_status : ""}
        </div>
    ),
}));

import { visoesService } from "../../../../services/visoes.service";
import {
    getPeriodosAteAgoraForaImplantacaoDaAssociacao,
    getStatusPeriodoPorData,
} from "../../../../services/escolas/PrestacaoDeContas.service";
import {
    getAcoesAssociacao,
    getAcoesAssociacaoPorPeriodoConta,
    getContas,
} from "../../../../services/Dashboard.service";

const PERIODOS_MOCK = [
    { uuid: "uuid-periodo-1", referencia: "2023.1" },
    { uuid: "uuid-periodo-2", referencia: "2023.2" },
];

const ACOES_MOCK = {
    info_acoes: [],
    ultima_atualizacao: null,
    data_inicio_realizacao_despesas: "2023-01-01",
};

const CONTAS_MOCK = [{ uuid: "uuid-conta-1", nome: "Custeio" }];

const STATUS_MOCK = {
    prestacao_contas_status: { texto_status: "Em apresentação", legenda_cor: "azul" },
};

function setupDefaultMocks() {
    visoesService.getItemUsuarioLogado.mockReturnValue("UE");
    localStorage.setItem("UUID", "uuid-associacao-ue");
    getAcoesAssociacao.mockResolvedValue(ACOES_MOCK);
    getPeriodosAteAgoraForaImplantacaoDaAssociacao.mockResolvedValue(PERIODOS_MOCK);
    getAcoesAssociacaoPorPeriodoConta.mockResolvedValue(ACOES_MOCK);
    getContas.mockResolvedValue(CONTAS_MOCK);
    getStatusPeriodoPorData.mockResolvedValue(STATUS_MOCK);
}

describe("Dashboard", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
        capturedGetCorSaldo = null;
        capturedGetCssDestaque = null;
    });

    describe("determinação do uuid_associacao", () => {
        it("usa localStorage UUID quando visao é UE", async () => {
            setupDefaultMocks();
            visoesService.getItemUsuarioLogado.mockReturnValue("UE");
            localStorage.setItem("UUID", "uuid-ue-123");

            await act(async () => {
                render(<Dashboard />);
            });

            expect(getAcoesAssociacao).toHaveBeenCalledWith("uuid-ue-123");
        });

        it("usa uuid de DADOS_DA_ASSOCIACAO quando visao é DRE", async () => {
            setupDefaultMocks();
            visoesService.getItemUsuarioLogado.mockReturnValue("DRE");
            localStorage.setItem(
                "DADOS_DA_ASSOCIACAO",
                JSON.stringify({ dados_da_associacao: { uuid: "uuid-dre-456" } })
            );

            await act(async () => {
                render(<Dashboard />);
            });

            expect(getAcoesAssociacao).toHaveBeenCalledWith("uuid-dre-456");
        });

        it("uuid_associacao é undefined quando visao não é UE nem DRE", async () => {
            setupDefaultMocks();
            visoesService.getItemUsuarioLogado.mockReturnValue("OUTRA");

            await act(async () => {
                render(<Dashboard />);
            });

            expect(getAcoesAssociacao).toHaveBeenCalledWith(undefined);
        });
    });

    describe("carregamento inicial", () => {
        it("exibe Loading durante o carregamento", async () => {
            setupDefaultMocks();
            getAcoesAssociacao.mockImplementation(
                () => new Promise((resolve) => setTimeout(() => resolve(ACOES_MOCK), 500))
            );

            render(<Dashboard />);

            expect(screen.getByTestId("loading")).toBeInTheDocument();
        });

        it("esconde Loading após carregamento e exibe cards", async () => {
            setupDefaultMocks();

            await act(async () => {
                render(<Dashboard />);
            });

            await waitFor(() => {
                expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
                expect(screen.getByTestId("dashboard-card")).toBeInTheDocument();
            });
        });

        it("chama getAcoesAssociacao na montagem", async () => {
            setupDefaultMocks();

            await act(async () => {
                render(<Dashboard />);
            });

            expect(getAcoesAssociacao).toHaveBeenCalled();
        });

        it("chama getPeriodosAteAgoraForaImplantacaoDaAssociacao na montagem", async () => {
            setupDefaultMocks();

            await act(async () => {
                render(<Dashboard />);
            });

            expect(getPeriodosAteAgoraForaImplantacaoDaAssociacao).toHaveBeenCalled();
        });

        it("chama getContas na montagem", async () => {
            setupDefaultMocks();

            await act(async () => {
                render(<Dashboard />);
            });

            expect(getContas).toHaveBeenCalled();
        });

        it("renderiza SelectPeriodo e SelectConta", async () => {
            setupDefaultMocks();

            await act(async () => {
                render(<Dashboard />);
            });

            expect(screen.getByTestId("select-periodo")).toBeInTheDocument();
            expect(screen.getByTestId("select-conta")).toBeInTheDocument();
        });
    });

    describe("carregaAcoesAssociacaoPorPeriodo", () => {
        it("chama getAcoesAssociacaoPorPeriodoConta quando selectPeriodo está definido", async () => {
            setupDefaultMocks();

            await act(async () => {
                render(<Dashboard />);
            });

            // buscaPeriodos define selectPeriodo = periodos[0].uuid => dispara carregaAcoesAssociacaoPorPeriodo
            expect(getAcoesAssociacaoPorPeriodoConta).toHaveBeenCalledWith(
                expect.anything(),
                "uuid-periodo-1"
            );
        });
    });

    describe("carregaStatusDoPeriodo (getStatus)", () => {
        it("chama getStatusPeriodoPorData quando acoesAssociacao tem data_inicio_realizacao_despesas", async () => {
            setupDefaultMocks();

            await act(async () => {
                render(<Dashboard />);
            });

            await waitFor(() => {
                expect(getStatusPeriodoPorData).toHaveBeenCalledWith(
                    expect.anything(),
                    "2023-01-01"
                );
            });
        });

        it("não chama getStatusPeriodoPorData quando acoesAssociacao não tem data_inicio_realizacao_despesas", async () => {
            setupDefaultMocks();
            const acoesSemData = { info_acoes: [], ultima_atualizacao: null };
            getAcoesAssociacao.mockResolvedValue(acoesSemData);
            getAcoesAssociacaoPorPeriodoConta.mockResolvedValue(acoesSemData);

            await act(async () => {
                render(<Dashboard />);
            });

            expect(getStatusPeriodoPorData).not.toHaveBeenCalled();
        });
    });

    describe("handleChangePeriodo", () => {
        it("chama getAcoesAssociacaoPorPeriodoConta com o novo período ao mudar seleção", async () => {
            setupDefaultMocks();

            await act(async () => {
                render(<Dashboard />);
            });

            await act(async () => {
                fireEvent.change(screen.getByTestId("select-periodo"), {
                    target: { value: "uuid-periodo-2" },
                });
            });

            expect(getAcoesAssociacaoPorPeriodoConta).toHaveBeenCalledWith(
                expect.anything(),
                "uuid-periodo-2",
                false
            );
        });

        it("não chama getAcoesAssociacaoPorPeriodoConta quando periodo_uuid é vazio", async () => {
            setupDefaultMocks();
            const periodos = [{ uuid: "uuid-vazio", referencia: "Selecione" }, ...PERIODOS_MOCK];
            getPeriodosAteAgoraForaImplantacaoDaAssociacao.mockResolvedValue(periodos);

            await act(async () => {
                render(<Dashboard />);
            });

            const callsBefore = getAcoesAssociacaoPorPeriodoConta.mock.calls.length;

            await act(async () => {
                fireEvent.change(screen.getByTestId("select-periodo"), {
                    target: { value: "" },
                });
            });

            // handleChangePeriodo com '' não deve chamar getAcoesAssociacaoPorPeriodoConta
            const callsAfter = getAcoesAssociacaoPorPeriodoConta.mock.calls.length;
            expect(callsAfter).toBe(callsBefore);
        });
    });

    describe("handleChangeConta", () => {
        it("chama getAcoesAssociacaoPorPeriodoConta com o uuid da conta ao mudar seleção", async () => {
            setupDefaultMocks();

            await act(async () => {
                render(<Dashboard />);
            });

            jest.clearAllMocks();
            getAcoesAssociacaoPorPeriodoConta.mockResolvedValue(ACOES_MOCK);

            await act(async () => {
                fireEvent.change(screen.getByTestId("select-conta"), {
                    target: { value: "uuid-conta-1" },
                });
            });

            expect(getAcoesAssociacaoPorPeriodoConta).toHaveBeenCalledWith(
                expect.anything(),
                expect.anything(),
                "uuid-conta-1"
            );
        });
    });

    describe("getCorSaldo", () => {
        it("retorna 'texto-cor-vermelha' para saldo negativo", async () => {
            setupDefaultMocks();

            await act(async () => {
                render(<Dashboard />);
            });

            await waitFor(() => expect(capturedGetCorSaldo).not.toBeNull());
            expect(capturedGetCorSaldo(-10)).toBe("texto-cor-vermelha");
        });

        it("retorna 'texto-cor-verde' para saldo positivo ou zero", async () => {
            setupDefaultMocks();

            await act(async () => {
                render(<Dashboard />);
            });

            await waitFor(() => expect(capturedGetCorSaldo).not.toBeNull());
            expect(capturedGetCorSaldo(100)).toBe("texto-cor-verde");
            expect(capturedGetCorSaldo(0)).toBe("texto-cor-verde");
        });
    });

    describe("getCssDestaque", () => {
        it("retorna classe com icone amarelo quando aceita_alteracoes é true", async () => {
            setupDefaultMocks();

            await act(async () => {
                render(<Dashboard />);
            });

            await waitFor(() => expect(capturedGetCssDestaque).not.toBeNull());
            expect(capturedGetCssDestaque(2, { aceita_alteracoes: true })).toBe(
                "pt-1 mb-2 texto-com-icone-amarelo"
            );
        });

        it("retorna classe sem icone quando aceita_alteracoes é false", async () => {
            setupDefaultMocks();

            await act(async () => {
                render(<Dashboard />);
            });

            await waitFor(() => expect(capturedGetCssDestaque).not.toBeNull());
            expect(capturedGetCssDestaque(1, { aceita_alteracoes: false })).toBe("pt-1 mb-1");
        });

        it("retorna classe sem icone quando statusPeriodoAssociacao é false", async () => {
            setupDefaultMocks();

            await act(async () => {
                render(<Dashboard />);
            });

            await waitFor(() => expect(capturedGetCssDestaque).not.toBeNull());
            expect(capturedGetCssDestaque(3, false)).toBe("pt-1 mb-3");
        });

        it("usa margin_bottom padrão 1 quando não informado", async () => {
            setupDefaultMocks();

            await act(async () => {
                render(<Dashboard />);
            });

            await waitFor(() => expect(capturedGetCssDestaque).not.toBeNull());
            expect(capturedGetCssDestaque(undefined, false)).toBe("pt-1 mb-1");
        });
    });

    describe("BarraDeStatusPeriodoAssociacao", () => {
        it("renderiza a barra de status após carregamento", async () => {
            setupDefaultMocks();

            await act(async () => {
                render(<Dashboard />);
            });

            await waitFor(() => {
                expect(screen.getByTestId("barra-status")).toBeInTheDocument();
            });
        });
    });
});
