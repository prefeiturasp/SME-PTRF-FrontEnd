import {
    formatarListaCargoComposicaoVacanciaParaFormatoDaListaParticipantes,
    formataDataInicioNoCargo,
} from "../utils";

const membroOcupado = {
    id: 1,
    cargo_associacao_label: "Presidente da Diretoria Executiva",
    data_inicio_no_cargo: "2025-01-15",
    ocupante_do_cargo: {
        codigo_identificacao: "1234567",
        nome: "Maria da Silva",
    },
    vago: false,
};

const membroVago = {
    id: 2,
    cargo_associacao_label: "Vice-Presidente da Diretoria Executiva",
    data_inicio_no_cargo: "2025-02-01",
    ocupante_do_cargo: null,
    vago: true,
};

describe("NovoFormularioEditaAta - utils", () => {
    describe("formatarListaCargoComposicaoVacanciaParaFormatoDaListaParticipantes", () => {
        it("deve formatar um membro ocupado no formato da lista de participantes", () => {
            const resultado = formatarListaCargoComposicaoVacanciaParaFormatoDaListaParticipantes({
                presidente_diretoria_executiva: membroOcupado,
            });

            expect(resultado).toEqual([
                {
                    id: 1,
                    cargo: "Presidente da Diretoria Executiva",
                    data_inicio_no_cargo: "15/01/2025",
                    identificacao: "1234567",
                    membro: true,
                    nome: "Maria da Silva",
                    presente: true,
                    vago: false,
                    presidente_da_reuniao: false,
                    secretario_da_reuniao: false,
                    professor_gremio: false,
                },
            ]);
        });

        it("deve formatar um cargo vago como ausente e com nome e identificação vazios", () => {
            const [resultado] = formatarListaCargoComposicaoVacanciaParaFormatoDaListaParticipantes({
                vice_presidente_diretoria_executiva: membroVago,
            });

            expect(resultado.presente).toBe(false);
            expect(resultado.vago).toBe(true);
            expect(resultado.nome).toBe("");
            expect(resultado.identificacao).toBe("");
            expect(resultado.data_inicio_no_cargo).toBe("01/02/2025");
        });

        it("deve manter a ordem dos cargos ao formatar vários membros", () => {
            const resultado = formatarListaCargoComposicaoVacanciaParaFormatoDaListaParticipantes({
                presidente_diretoria_executiva: membroOcupado,
                vice_presidente_diretoria_executiva: membroVago,
            });

            expect(resultado).toHaveLength(2);
            expect(resultado.map((item) => item.id)).toEqual([1, 2]);
        });

        it("deve ignorar cargos nulos ou indefinidos", () => {
            const resultado = formatarListaCargoComposicaoVacanciaParaFormatoDaListaParticipantes({
                presidente_diretoria_executiva: membroOcupado,
                secretario: null,
                tesoureiro: undefined,
            });

            expect(resultado).toHaveLength(1);
            expect(resultado[0].id).toBe(1);
        });

        it("deve considerar o membro presente quando o campo vago não for informado", () => {
            const { vago, ...membroSemVago } = membroOcupado;

            const [resultado] = formatarListaCargoComposicaoVacanciaParaFormatoDaListaParticipantes({
                presidente_diretoria_executiva: membroSemVago,
            });

            expect(resultado.presente).toBe(true);
            expect(resultado.vago).toBeUndefined();
        });

        it("deve retornar data de início indefinida quando o membro não tiver data", () => {
            const [resultado] = formatarListaCargoComposicaoVacanciaParaFormatoDaListaParticipantes({
                presidente_diretoria_executiva: { ...membroOcupado, data_inicio_no_cargo: undefined },
            });

            expect(resultado.data_inicio_no_cargo).toBeUndefined();
        });

        it("deve retornar nome e identificação vazios quando o ocupante não tiver esses dados", () => {
            const [resultado] = formatarListaCargoComposicaoVacanciaParaFormatoDaListaParticipantes({
                presidente_diretoria_executiva: { ...membroOcupado, ocupante_do_cargo: {} },
            });

            expect(resultado.nome).toBe("");
            expect(resultado.identificacao).toBe("");
        });

        it.each([
            ["nula", null],
            ["indefinida", undefined],
            ["vazia", {}],
        ])("deve retornar lista vazia quando a composição for %s", (_, composicao) => {
            expect(formatarListaCargoComposicaoVacanciaParaFormatoDaListaParticipantes(composicao)).toEqual([]);
        });
    });

    describe("formataDataInicioNoCargo", () => {
        it("deve converter data no formato AAAA-MM-DD para DD/MM/AAAA", () => {
            expect(formataDataInicioNoCargo("2025-01-15")).toBe("15/01/2025");
        });

        it("deve retornar a data sem alteração quando já estiver no formato DD/MM/AAAA", () => {
            expect(formataDataInicioNoCargo("15/01/2025")).toBe("15/01/2025");
        });

        it.each([
            ["sem zeros à esquerda", "2025-1-5"],
            ["com horário", "2025-01-15T10:00:00"],
            ["texto inválido", "data-invalida"],
            ["vazia", ""],
        ])("deve retornar a data sem alteração quando for uma string %s", (_, data) => {
            expect(formataDataInicioNoCargo(data)).toBe(data);
        });

        it.each([
            ["nula", null],
            ["indefinida", undefined],
            ["numérica", 20250115],
        ])("deve retornar o valor sem alteração quando a data for %s", (_, data) => {
            expect(formataDataInicioNoCargo(data)).toBe(data);
        });
    });
});
