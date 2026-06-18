import { memo, useMemo } from "react";
import { TagRetificacao } from "../../../../../Paa/componentes/TagRetificacao";
import { TabelaPrioridades } from "../../TabelaPrioridades";

export const BlocoPrioridadesRetificacao = memo(({ prioridadesAgrupadas }) => {
    const ptrf = useMemo(() => {
        const prioridades = prioridadesAgrupadas.PTRF.prioridades.filter(
            prioridade => prioridade.alteracao
        );

        const total = prioridades.reduce(
            (acc, prioridade) => acc + (Number(prioridade.valor_total) || 0),
            0
        );

        return { prioridades, total };
    }, [prioridadesAgrupadas.PTRF.prioridades]);

    const pdde = useMemo(() => {
        const prioridades = prioridadesAgrupadas.PDDE.prioridades.filter(
            prioridade => prioridade.alteracao
        );

        const total = prioridades.reduce(
            (acc, prioridade) => acc + (Number(prioridade.valor_total) || 0),
            0
        );

        return { prioridades, total };
    }, [prioridadesAgrupadas.PDDE.prioridades]);

    const recursoProprio = useMemo(() => {
        const prioridades = prioridadesAgrupadas.RECURSO_PROPRIO.prioridades.filter(
            prioridade => prioridade.alteracao
        );

        const total = prioridades.reduce(
            (acc, prioridade) => acc + (Number(prioridade.valor_total) || 0),
            0
        );

        return { prioridades, total };
    }, [prioridadesAgrupadas.RECURSO_PROPRIO.prioridades]);

    return (
        <>
            <TabelaPrioridades
                titulo={
                    <>
                        <span className="mr-3">Prioridades PTRF</span>
                        <TagRetificacao />
                    </>
                }
                prioridades={ptrf.prioridades}
                total={ptrf.total}
            />

            <TabelaPrioridades
                titulo={
                    <>
                        <span className="mr-3">Prioridades PDDE</span>
                        <TagRetificacao />
                    </>
                }
                prioridades={pdde.prioridades}
                total={pdde.total}
            />

            <TabelaPrioridades
                titulo={
                    <>
                        <span className="mr-3">Prioridades Outros Recursos</span>
                        <TagRetificacao />
                    </>
                }
                prioridades={recursoProprio.prioridades}
                total={recursoProprio.total}
            />
        </>
    );
});