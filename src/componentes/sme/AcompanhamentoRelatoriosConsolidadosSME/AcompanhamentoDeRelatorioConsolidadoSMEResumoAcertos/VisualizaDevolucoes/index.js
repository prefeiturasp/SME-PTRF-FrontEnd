import React, { useEffect } from 'react';
import {Ordinais} from '../../../../../utils/ValidacoesNumeros.js'
import {DatePickerField} from "../../../../Globais/DatePickerField";
import moment from "moment";
import './styles.scss'

export const VisualizaDevolucoes = ({relatorioConsolidado, dataLimiteDevolucao, handleChangeDataLimiteDevolucao, tabAtual, setTabAtual, getDetalhamentoConferenciaDocumentosHistorico}) => {

    useEffect(() => {
        if(relatorioConsolidado?.status_sme === "DEVOLVIDO"){
            setTabAtual('historico')
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
                            getDetalhamentoConferenciaDocumentosHistorico(e.target.value) 
                        }}>

                        {
                        relatorioConsolidado?.analises_do_consolidado_dre.length && relatorioConsolidado.status_sme === 'DEVOLVIDO' ?
                        relatorioConsolidado?.analises_do_consolidado_dre.map((item, index) => {
                                        return <option key={index}
                                            value={item.uuid}>
                                            {
                                            Ordinais(index)
                                        }
                                            {" "}devolução
                                        </option>
                                }):
                                relatorioConsolidado?.analises_do_consolidado_dre.slice(0, (relatorioConsolidado?.analises_do_consolidado_dre.length - 1)).map((item, index) => {
                                            return <option key={index}
                                                value={item.uuid}>
                                                {
                                                Ordinais(index)
                                            }
                                                {" "}devolução
                                            </option>
                                    })
                    }
                    </select>
                </div>
            )
        } </div>
    )

}
