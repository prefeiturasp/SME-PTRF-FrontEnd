import React, {useContext, useCallback, useEffect, useState} from "react";
import { useHistory } from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {getPeriodoPorUuid} from "../../../../services/sme/Parametrizacoes.service";
import { AnaliseDREContext } from "../../../../context/AnaliseDRE";

export const TopoComBotaoVoltar = ({prestacaoContaUuid, onClickVoltar, periodoFormatado, periodoUuid, podeAbrirModalAcertos}) =>{
    const {lancamentosAjustes, podeConcluir, setPodeConcluir} = useContext(AnaliseDREContext)
    const [periodo, setPeriodo] = useState({});
    const history = useHistory()

    // const verificarComStatusRealizadoJustificado = useCallback(() => {
    //     setPodeConcluir(
    //         lancamentosAjustes.every((analise) => {
    //         return !(analise.analise_lancamento.status_realizacao.includes('PARCIALMENTE') || analise.analise_lancamento.status_realizacao.includes('PENDENTE'))
    //     }))
    //
    // }, [lancamentosAjustes])


    // useEffect( () => {
    //     (async() => {
    //         let periodo = await getPeriodoPorUuid(periodoUuid);
    //         setPeriodo(periodo)
    //     })()
    //     verificarComStatusRealizadoJustificado()
    // }, [verificarComStatusRealizadoJustificado])

    const handleVerificaAcertos = () => {
        if(podeConcluir){
            localStorage.setItem('uuidPrestacaoConta', prestacaoContaUuid);
            localStorage.setItem('periodoPrestacaoDeConta', JSON.stringify({data_final: periodo.data_fim_realizacao_despesas , data_inicial: periodo.data_inicio_realizacao_despesas  , periodo_uuid: periodo.uuid}));
            history.push(`/prestacao-de-contas/`)
        }else {
            podeAbrirModalAcertos()
        }
    }

    return(
        <div className="d-flex bd-highlight align-items-center">
            <div className="flex-grow-1 bd-highlight texto-periodo-topo">
                <p className='mb-2'>{periodoFormatado && periodoFormatado.referencia ? periodoFormatado.referencia : ''} - {periodoFormatado && periodoFormatado.data_inicio_realizacao_despesas ? periodoFormatado.data_inicio_realizacao_despesas : '-'} até {periodoFormatado && periodoFormatado.data_fim_realizacao_despesas ? periodoFormatado.data_fim_realizacao_despesas : '-'}</p>
                <h1 className="titulo-itens-painel">Devolução para acertos</h1>
            </div>
            <div className="p-2 bd-highlight">
                <button onClick={onClickVoltar} className="btn btn-outline-success ml-2"><FontAwesomeIcon
                    style={{marginRight: "5px", color: '#00585E'}}
                    icon={faArrowLeft}
                />
                    Voltar
                </button>
            </div>
            {/*            <div className="p-3 bd-highlight">
                <button
                    className="btn btn-success mr-2"
                    onClick={handleVerificaAcertos}
                >
                    Ir para concluir acerto
                </button>
            </div>*/}
        </div>
    )
}