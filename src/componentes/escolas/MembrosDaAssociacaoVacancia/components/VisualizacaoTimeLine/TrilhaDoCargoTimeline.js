import { montaRegistroVazio, diasEntre } from "./utils";

// Uma trilha (linha) da timeline: os segmentos (ocupado/encerrado/vago) de um único
// cargo. Extraído para ser reaproveitado nas duas seções (Diretoria executiva e
// Conselho Fiscal) sem duplicar a lógica de posicionamento.
export const TrilhaDoCargoTimeline = ({
    cargoRow,
    registrosDoCargo,
    mandato,
    hojeDentroDoMandato,
    totalDias,
    dataTemplate,
    registroSelecionado,
    onSelecionarRegistro,
}) => {
    const registros =
        registrosDoCargo && registrosDoCargo.length > 0
            ? registrosDoCargo
            : [montaRegistroVazio(cargoRow.cargo_associacao, cargoRow.cargo_associacao_label, mandato, hojeDentroDoMandato)];

    return (
        <div className="trilha-cargo-timeline TrilhaDoCargoTimeline">
            {registros.map((registro) => {
                const leftPct =
                    totalDias > 0
                        ? (diasEntre(mandato.data_inicial, registro.data_inicio_no_cargo) / totalDias) * 100
                        : 0;
                const larguraDias = Math.max(diasEntre(registro.data_inicio_no_cargo, registro.data_fim_no_cargo), 0);
                const widthPct = Math.max(totalDias > 0 ? (larguraDias / totalDias) * 100 : 0, 0.6);
                const corClasse = registro.cargo_vago
                    ? "seg-vago"
                    : registro.ocupante_vigente
                    ? "seg-vigente"
                    : "seg-encerrado";
                const nome = registro.cargo_vago ? "Vago" : registro.ocupante_do_cargo?.nome;
                const periodo = `${dataTemplate("", "", registro.data_inicio_no_cargo)} até ${dataTemplate(
                    "",
                    "",
                    registro.data_fim_no_cargo
                )}`;
                const titulo = [nome, periodo, registro.tag_novo_membro, registro.tag_vacancia].filter(Boolean).join(" — ");
                const isSelecionado = registroSelecionado?.uuid === registro.uuid;

                return (
                    <button
                        type="button"
                        key={registro.uuid}
                        className={`segmento-timeline ${corClasse} ${isSelecionado ? "selecionado" : ""}`}
                        style={{ left: `${leftPct}%`, width: `${widthPct}%`, color: "#fff" }}
                        title={titulo}
                        aria-label={titulo}
                        onClick={() => onSelecionarRegistro({ ...registro, cargoLabel: cargoRow.cargo_associacao_label })}
                    >
                        {widthPct >= 5 && (
                            <span className="segmento-timeline-label">{registro.cargo_vago ? "Vago" : nome}</span>
                        )}
                    </button>
                );
            })}
        </div>
    );
};