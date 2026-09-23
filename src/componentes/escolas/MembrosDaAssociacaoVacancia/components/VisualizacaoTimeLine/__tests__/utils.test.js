import {
    montaRegistroVazio,
    diasEntre,
    montaTicksDeMeses,
    encontraRegistroNaData,
    montaCargoRow,
} from "../utils";

describe("montaRegistroVazio", () => {
    const mandato = { data_inicial: "2026-01-01", data_final: "2026-12-31" };

    it("monta um registro sintético de cargo vago cobrindo todo o mandato", () => {
        const registro = montaRegistroVazio("PRESIDENTE_DIRETORIA_EXECUTIVA", "Presidente", mandato, true);

        expect(registro).toEqual({
            uuid: "PRESIDENTE_DIRETORIA_EXECUTIVA-vazio",
            cargo_associacao: "PRESIDENTE_DIRETORIA_EXECUTIVA",
            cargo_associacao_label: "Presidente",
            cargo_vago: true,
            cargo_vago_vigente: true,
            cargo_vigente: true,
            ocupante_vigente: false,
            eh_composicao_vigente: true,
            eh_ultimo_ocupante: false,
            pode_cancelar_entrada: false,
            pode_cancelar_saida: false,
            data_inicio_no_cargo: "2026-01-01",
            data_fim_no_cargo: "2026-12-31",
            ocupante_do_cargo: null,
            tag_novo_membro: null,
            tag_vacancia: null,
        });
    });

    it("repassa eh_composicao_vigente=false para mandatos anteriores", () => {
        const registro = montaRegistroVazio("TESOUREIRO", "Tesoureiro", mandato, false);

        expect(registro.eh_composicao_vigente).toBe(false);
    });
});

describe("diasEntre", () => {
    it("calcula a quantidade de dias entre duas datas", () => {
        expect(diasEntre("2026-01-01", "2026-01-11")).toBe(10);
    });

    it("retorna número negativo quando a data final é anterior à inicial", () => {
        expect(diasEntre("2026-01-11", "2026-01-01")).toBe(-10);
    });

    it("retorna zero para datas iguais", () => {
        expect(diasEntre("2026-01-01", "2026-01-01")).toBe(0);
    });
});

describe("montaTicksDeMeses", () => {
    it("gera um tick por mês entre a data inicial e final, com rótulo abreviado em português", () => {
        const ticks = montaTicksDeMeses("2026-01-01", "2026-03-31", 89);

        expect(ticks.map((tick) => tick.label)).toEqual(["jan/26", "fev/26", "mar/26"]);
        expect(ticks.map((tick) => tick.iso)).toEqual(["2026-01-01", "2026-02-01", "2026-03-01"]);
    });

    it("posiciona o primeiro tick em 0% e os demais proporcionalmente ao total de dias", () => {
        const ticks = montaTicksDeMeses("2026-01-01", "2026-03-31", 89);

        expect(ticks[0].leftPct).toBe(0);
        expect(ticks[1].leftPct).toBeCloseTo((31 / 89) * 100, 5);
    });

    it("não inclui um tick para o mês anterior ao início do mandato quando este começa no meio do mês", () => {
        // mandato começa em 15/01 - o cursor do mês (01/01) fica antes da data inicial,
        // então o primeiro tick deve avançar para fevereiro.
        const ticks = montaTicksDeMeses("2026-01-15", "2026-02-28", 44);

        expect(ticks.map((tick) => tick.iso)).toEqual(["2026-02-01"]);
    });

    it("retorna leftPct=0 para todos os ticks quando totalDias não é positivo", () => {
        const ticks = montaTicksDeMeses("2026-01-01", "2026-01-31", 0);

        expect(ticks.every((tick) => tick.leftPct === 0)).toBe(true);
    });
});

describe("encontraRegistroNaData", () => {
    const timeline = [
        { uuid: "r1", data_inicio_no_cargo: "2026-01-01", data_fim_no_cargo: "2026-06-30" },
        { uuid: "r2", data_inicio_no_cargo: "2026-07-01", data_fim_no_cargo: "2026-12-31" },
    ];

    it("encontra o registro cujo período contém a data informada", () => {
        expect(encontraRegistroNaData(timeline, "2026-08-15")).toEqual(timeline[1]);
    });

    it("retorna undefined quando nenhum registro cobre a data", () => {
        expect(encontraRegistroNaData(timeline, "2027-01-01")).toBeUndefined();
    });

    it("retorna undefined quando a timeline é undefined ou vazia", () => {
        expect(encontraRegistroNaData(undefined, "2026-01-01")).toBeUndefined();
        expect(encontraRegistroNaData([], "2026-01-01")).toBeUndefined();
    });
});

describe("montaCargoRow", () => {
    const cargoDaTimeline = {
        cargo_associacao: "PRESIDENTE_DIRETORIA_EXECUTIVA",
        cargo_associacao_label: "Presidente",
        timeline: [
            {
                uuid: "r1",
                cargo_vago: false,
                data_inicio_no_cargo: "2026-01-01",
                data_fim_no_cargo: "2026-06-30",
                ocupante_do_cargo: { nome: "Maria Silva" },
            },
            {
                uuid: "r2",
                cargo_vago: true,
                data_inicio_no_cargo: "2026-07-01",
                data_fim_no_cargo: "2026-12-31",
                ocupante_do_cargo: null,
            },
        ],
    };

    it("monta a linha com o nome do ocupante quando há um registro ocupado na data", () => {
        const row = montaCargoRow(cargoDaTimeline, "2026-03-01");

        expect(row.cargo_associacao).toBe("PRESIDENTE_DIRETORIA_EXECUTIVA");
        expect(row.cargo_associacao_label).toBe("Presidente");
        expect(row.nomeOuVago).toBe("Maria Silva");
        expect(row.uuid).toBe("r1");
    });

    it("monta a linha com nomeOuVago='Vago' quando o registro na data é um cargo vago", () => {
        const row = montaCargoRow(cargoDaTimeline, "2026-08-01");

        expect(row.nomeOuVago).toBe("Vago");
    });

    it("monta a linha com nomeOuVago='Vago' quando não há nenhum registro para a data", () => {
        const row = montaCargoRow(cargoDaTimeline, "2027-01-01");

        expect(row.nomeOuVago).toBe("Vago");
        expect(row.cargo_associacao).toBe("PRESIDENTE_DIRETORIA_EXECUTIVA");
    });
});
