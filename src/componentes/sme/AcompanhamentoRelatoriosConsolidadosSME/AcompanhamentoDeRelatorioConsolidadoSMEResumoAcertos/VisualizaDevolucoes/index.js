import React from 'react';
// import { Ordinais } from '../../../../../utils/ValidacoesNumeros.js'
import {DatePickerField} from "../../../../Globais/DatePickerField";
import './styles.scss'

export const VisualizaDevolucoes = ({relatorioConsolidado, dataLimiteDevolucao, handleChangeDataLimiteDevolucao}) => {

    return (
        <div className='visualizacao-container d-flex mt-5' >
            <div className='texto-reenvio'>
                <span>
                    Prazo para acertos : 
                </span>
            </div>
            <div className='data-limite-field'>
                    <DatePickerField
                        name='data_limite_reenvio'
                        onChange={handleChangeDataLimiteDevolucao}
                        placeholderText='dd/mm/aaaa'
                        value={dataLimiteDevolucao}
                        disabled={relatorioConsolidado?.status_sme != "EM_ANALISE"}
                    />
                {/* <select name="escolhe-data-devolucao" id="escolhe-data-devolucao" className='form-control'>
                    {mockData.map( (item, index) => {
                        return <option key={index} value="">{Ordinais(index)} devolução {new Intl.DateTimeFormat('pt-BR', {year: 'numeric', month: '2-digit', day: '2-digit'},).format(new Date(item.data_devolucao))}</option>
                    })}
                </select> */}
            </div>
        </div>
    )
    
}
