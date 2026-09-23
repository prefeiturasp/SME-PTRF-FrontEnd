import moment from "moment";


const MESES_ABREVIADOS = [
    "jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"
];

// Segmento sintético usado só quando o cargo nunca teve nenhum registro (nem ocupado,
// nem vago) na composição - o backend garante ausência de "buracos" a partir do primeiro
// registro que existir (ValidatorSemGapNaTimelineDoCargo), mas cargos nunca tocados não
// têm nenhuma linha no banco.
export const montaRegistroVazio = (cargoId, cargoLabel, mandato, ehComposicaoVigente) => ({
    uuid: `${cargoId}-vazio`,
    cargo_associacao: cargoId,
    cargo_associacao_label: cargoLabel,
    cargo_vago: true,
    cargo_vago_vigente: true,
    cargo_vigente: true,
    ocupante_vigente: false,
    eh_composicao_vigente: ehComposicaoVigente,
    eh_ultimo_ocupante: false,
    pode_cancelar_entrada: false,
    pode_cancelar_saida: false,
    data_inicio_no_cargo: mandato.data_inicial,
    data_fim_no_cargo: mandato.data_final,
    ocupante_do_cargo: null,
    tag_novo_membro: null,
    tag_vacancia: null,
});

export const diasEntre = (dataInicio, dataFim) => moment(dataFim).diff(moment(dataInicio), "days");

export const montaTicksDeMeses = (dataInicial, dataFinal, totalDias) => {
    const ticks = [];
    let cursor = moment(dataInicial).startOf("month");
    if (cursor.isBefore(dataInicial, "day")) cursor = cursor.add(1, "month");
    const fim = moment(dataFinal);
    while (cursor.isSameOrBefore(fim, "day")) {
        const iso = cursor.format("YYYY-MM-DD");
        ticks.push({
            iso,
            leftPct: totalDias > 0 ? (diasEntre(dataInicial, iso) / totalDias) * 100 : 0,
            label: `${MESES_ABREVIADOS[cursor.month()]}/${cursor.format("YY")}`,
        });
        cursor = cursor.add(1, "month");
    }
    return ticks;
};

export const encontraRegistroNaData = (timeline, data) =>
    (timeline || []).find(
        (registro) => registro.data_inicio_no_cargo <= data && data <= registro.data_fim_no_cargo
    );

export const montaCargoRow = (cargoDaTimeline, dataSelecionada) => {
    const registroNaData = encontraRegistroNaData(cargoDaTimeline.timeline, dataSelecionada);
    return {
        ...(registroNaData || {}),
        cargo_associacao: cargoDaTimeline.cargo_associacao,
        cargo_associacao_label: cargoDaTimeline.cargo_associacao_label,
        nomeOuVago: !registroNaData || registroNaData.cargo_vago ? "Vago" : registroNaData.ocupante_do_cargo?.nome,
    };
};