import { memo } from "react"

export const Manifestacoes = memo(({dadosAta, paaRetificacao,tabelas, isLoading }) => {
    return (
        <>
            <div className="col-12 mt-4">
                <h4 style={{ fontWeight: "bold", fontSize: "20px", color: "#42474A" }}>Manifestações</h4>
                {dadosAta.comentarios && <p className="mt-3">{dadosAta.comentarios}</p>}
            </div>

            <div className="col-12 mt-4">
            {(() => {
                if (!dadosAta.parecer_conselho || !tabelas.pareceres) {
                return null;
                }
                const parecer = tabelas.pareceres.find((p) => p.id === dadosAta.parecer_conselho);
                if (!parecer) {
                return null;
                }
                const parecerId = (parecer.id || "").toUpperCase();

                if (parecerId === "APROVADA" || parecerId.includes("APROV")) {
                return <p style={{ fontWeight: "bold" }}>Diante ao exposto, o Plano Anual de Atividades
                { paaRetificacao && !isLoading && " retificado" } foi aprovado.</p>;
                }
                if (parecerId === "REJEITADA" || parecerId.includes("REJEIT") || parecerId.includes("REPROV")) {
                return (
                    <>
                    <p style={{ fontWeight: "bold" }}>
                        Diante ao exposto, o Plano Anual de Atividades foi{" "}
                        <span style={{ color: "#B40C02" }}>reprovado</span>.{" "}
                        {dadosAta.justificativa && <>{dadosAta.justificativa}</>}
                    </p>
                    </>
                );
                }
                return null;
            })()}
            </div>
        </>
    )
})