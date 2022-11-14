import React from 'react';
import { Ordinais } from '../../../../../utils/NumeroPorExtenso'
import './styles.scss'

const mockData = Array.from({length: 9}, () => ({
    "data_devolucao": "2024-11-13",
	"data_limite": "2024-11-15",
	"data_retorno_analise": "2024-11-13",
}))

export const VisualizaDevolucoes = ({}) => {
    // #TODO: Adicionar span com prazo para envio quando for em conferencia atual
    return (
        <div className='visualizacao-container d-flex mt-5' >
            <div className='col-md-3'>
                <span>
                    Visualize as devoluções pelas datas : 
                </span>
            </div>
            <div className='col-md-9'>
                <select name="escolhe-data-devolucao" id="escolhe-data-devolucao" className='form-control'>
                    {mockData.map( (item, index) => {
                        return <option key={index} value="">{Ordinais(index)} devolução {new Intl.DateTimeFormat('pt-BR', {year: 'numeric', month: '2-digit', day: '2-digit'},).format(new Date(item.data_devolucao))}</option>
                    })}
                </select>
            </div>
        </div>
    )
    
}
