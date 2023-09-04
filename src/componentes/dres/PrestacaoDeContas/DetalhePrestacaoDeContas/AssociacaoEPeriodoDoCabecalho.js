import React, {memo, useCallback, useEffect, useState} from "react";
import {getPeriodos} from "../../../../services/sme/DashboardSme.service";
import {exibeDataPT_BR} from "../../../../utils/ValidacoesAdicionaisFormularios";

const AssociacaoEPeriodoDoCabecalho = ({prestacaoDeContas}) => {

    const [periodoTexto, setPeriodoTexto] = useState('')

    const carregaPeriodo = useCallback(async ()=>{
        if (prestacaoDeContas && prestacaoDeContas.periodo_uuid){
            let periodo_uuid = prestacaoDeContas.periodo_uuid
            let periodos = await getPeriodos(periodo_uuid)
            let periodo_atual = periodos.find(p => p.uuid === prestacaoDeContas.periodo_uuid)
            let periodo_texto = `${periodo_atual.referencia} - ${periodo_atual.data_inicio_realizacao_despesas ? exibeDataPT_BR(periodo_atual.data_inicio_realizacao_despesas) : "-"} até ${periodo_atual.data_fim_realizacao_despesas ? exibeDataPT_BR(periodo_atual.data_fim_realizacao_despesas) : "-"}`
            setPeriodoTexto(periodo_texto)
        }
    }, [prestacaoDeContas])

    useEffect(()=>{
        carregaPeriodo()
    }, [carregaPeriodo])
    
    return (
        <>
            {Object.entries(prestacaoDeContas).length > 0 &&
            <>
                <div className="flex-grow-1 bd-highlight">
                    <p className='titulo-explicativo mb-0'>{prestacaoDeContas.associacao.nome}</p>
                    {periodoTexto &&
                        <p className='fonte-16'><strong>Período: {periodoTexto}</strong></p>
                    }
                </div>
            </>
            }
        </>
    );
}
export default memo(AssociacaoEPeriodoDoCabecalho)