import React, { memo, useState } from "react";
import { PaaCardBarraTitulo } from "../PaaCardBarraTitulo/PaaCardBarraTitulo";
import { PaaCard } from "../PaaCard/PaaCard";
import { AcoesRetificacaoPaa } from "../AcoesRetificacaoPaa";
import { tituloCardPaa } from "../../utils/formatReferenciaPaaTitulo";
import { PaaListaVazia } from "../PaaListaVazia/PaaListaVazia";

/** PAA da Próxima Vigência com Plano gerado: consulta, ações do Plano e da ata e retificação. */
export const SecaoProximaVigencia = memo(({ paa, onDadosAtualizados }) => {
    const [expandido, setExpandido] = useState(true);

    return (
        <div className="mt-5" data-testid="secao-proxima-vigencia">
            <h3 className="paa-vigente-e-anteriores__titulo-secao">Plano da próxima vigência</h3>
            <PaaCardBarraTitulo
                titulo={tituloCardPaa(paa?.referencia)}
                isAberto={expandido}
                onToggle={() => setExpandido((aberto) => !aberto)}
                acoesExtras={<AcoesRetificacaoPaa dados={paa} />}
            />
            {expandido && <PaaCard dados={paa} onDadosAtualizados={onDadosAtualizados} />}
            <PaaListaVazia>
                A sua unidade ainda não possui Próxima vigência !!!!!!!!!!!.
            </PaaListaVazia>
        </div>
    );
});