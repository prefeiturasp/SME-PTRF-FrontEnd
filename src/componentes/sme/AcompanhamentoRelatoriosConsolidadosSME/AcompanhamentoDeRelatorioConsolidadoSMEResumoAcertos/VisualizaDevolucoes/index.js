import React, { useEffect } from 'react';
import {Ordinais} from '../../../../../utils/ValidacoesNumeros.js'
import {DatePickerField} from "../../../../Globais/DatePickerField";
import useDataTemplate from "../../../../../hooks/Globais/useDataTemplate";
import moment from "moment";
import './styles.scss'

export const VisualizaDevolucoes = ({relatorioConsolidado, dataLimiteDevolucao, handleChangeDataLimiteDevolucao, tabAtual, setTabAtual, getDetalhamentoConferenciaDocumentosHistorico, setAnaliseSequenciaVisualizacao}) => {
    const dataTemplate = useDataTemplate()

    useEffect(() => {
        if(relatorioConsolidado?.status_sme === "DEVOLVIDO"){
            setTabAtual('historico')
        }
        if(typeof relatorioConsolidado?.analises_do_consolidado_dre !== 'undefined'){

            let sequenciaConferencia = relatorioConsolidado?.analises_do_consolidado_dre[relatorioConsolidado?.analises_do_consolidado_dre.length - 1]
            let newAnaliseSequencia = {sequenciaConferencia, 'versao': Ordinais(relatorioConsolidado?.analises_do_consolidado_dre.indexOf(sequenciaConferencia))}

            if(relatorioConsolidado?.analises_do_consolidado_dre.lengt === 1 || relatorioConsolidado?.status_sme === "EM_ANALISE") {
                sequenciaConferencia = relatorioConsolidado?.analises_do_consolidado_dre[relatorioConsolidado?.analises_do_consolidado_dre.length - 2]
                newAnaliseSequencia = {sequenciaConferencia, 'versao': Ordinais(relatorioConsolidado?.analises_do_consolidado_dre.indexOf(sequenciaConferencia))}
            }

            setAnaliseSequenciaVisualizacao(newAnaliseSequencia)
        }
    }, [relatorioConsolidado])
    
    return (

        <div className='visualizacao-container d-flex mt-5'>
            {
            tabAtual !== 'historico' ? (
                <>
                    <div className='texto-reenvio'>
                        <span>
                            Prazo para acerto :
                        </span>
                    </div>
                    <div className='data-limite-field'>
                        <DatePickerField name='data_limite_reenvio'
                            onChange={handleChangeDataLimiteDevolucao}
                            placeholderText='dd/mm/aaaa'
                            value={dataLimiteDevolucao}
                            disabled={
                                relatorioConsolidado ?. status_sme != "EM_ANALISE"
                            }
                            minDate={
                                new Date(moment())
                            }/>
                    </div>
                </>
            ) : (

                <div className='d-flex align-items-center w-100 pb-2'>
                    <p className='pr-5'>
                        Visualize as devoluções pelas datas:
                    </p>
                    <select 
                        name="escolhe-data-devolucao" 
                        id="escolhe-data-devolucao" 
                        className='form-control w-75'
                        onChange={ (e) => {
                            const valor = e.target.value
                            const sequenciaConferencia = relatorioConsolidado?.analises_do_consolidado_dre.find(e => e.uuid === valor)
                            setAnaliseSequenciaVisualizacao({sequenciaConferencia, 'versao': Ordinais(relatorioConsolidado?.analises_do_consolidado_dre.indexOf(sequenciaConferencia))})
                            getDetalhamentoConferenciaDocumentosHistorico(valor) 
                        }}>

                        {
                        relatorioConsolidado?.analises_do_consolidado_dre.length && relatorioConsolidado.status_sme === 'DEVOLVIDO' ?
                        relatorioConsolidado?.analises_do_consolidado_dre.sort().map((item, index) => {
                                        return <option key={index}
                                            value={item.uuid}>
                                            {
                                            Ordinais(index)
                                        }
                                            {" "} devolução {dataTemplate(null, null, item.data_devolucao)}
                                        </option>
                                }).reverse():
                                relatorioConsolidado?.analises_do_consolidado_dre.slice(0, (relatorioConsolidado?.analises_do_consolidado_dre.length - 1)).map((item, index) => {
                                            return <option key={index}
                                                value={item.uuid}>
                                                {
                                                Ordinais(index)
                                            }
                                                {" "} devolução {dataTemplate(null, null, item.data_devolucao)}
                                            </option>
                                    }).reverse()
                    }
                    </select>
                </div>
            )
        } </div>
    )

}
