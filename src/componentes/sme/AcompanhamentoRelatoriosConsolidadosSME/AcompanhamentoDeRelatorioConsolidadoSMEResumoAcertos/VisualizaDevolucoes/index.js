import React from 'react';
import './styles.scss'

const mockData = [{
    "data_devolucao": "2022-11-13",
	"data_limite": "2022-11-15",
	"data_retorno_analise": "2022-11-13",
},
{
    "data_devolucao": "2023-11-13",
	"data_limite": "2023-11-15",
	"data_retorno_analise": "2023-11-13",
},
{
    "data_devolucao": "2024-11-13",
	"data_limite": "2024-11-15",
	"data_retorno_analise": "2024-11-13",
},
]

export const VisualizaDevolucoes = ({}) => {
    return (
        <div>
            <span>
                Visualize as devoluções pelas datas
            </span>
            {}
            <select name="visual" id="visual">
                <option value="" disabled></option>
            </select>
        </div>
    )
    
}
