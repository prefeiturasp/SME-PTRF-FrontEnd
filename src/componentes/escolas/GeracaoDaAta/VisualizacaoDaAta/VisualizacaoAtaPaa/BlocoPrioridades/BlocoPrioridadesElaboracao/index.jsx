import { memo } from "react";
import { TabelaPrioridades } from "../../TabelaPrioridades";

export const BlocoPrioridadesElaboracao = memo(({ prioridadesAgrupadas }) => {
    return (
          <>
            <TabelaPrioridades
              titulo="Prioridades PTRF"
              prioridades={prioridadesAgrupadas.PTRF.prioridades}
              total={prioridadesAgrupadas.PTRF.total}
            />
            <TabelaPrioridades
              titulo="Prioridades PDDE"
              prioridades={prioridadesAgrupadas.PDDE.prioridades}
              total={prioridadesAgrupadas.PDDE.total}
            />
            <TabelaPrioridades
              titulo="Prioridades Outros Recursos"
              prioridades={prioridadesAgrupadas.RECURSO_PROPRIO.prioridades}
              total={prioridadesAgrupadas.RECURSO_PROPRIO.total}
            />
        </>
    );
});
