import React from 'react';
import {DatePickerField} from "../DatePickerField";
import './extracao-dados.scss'

export const ExtracaoDados = () => {
    return (
     <>
      <h6 className="extracao-title">Dados disponíveis para extração</h6>
      <p className="extracao-title-filter">Filtrar por data</p>
      <div className="extracao-filter">
        <div className="extracao-filter-field">
            <label for="data-inicio">Selecione data inicial</label>
            <DatePickerField
                name="filtrar_por_data_inicio"
                id="filtrar_por_data_inicio"
                value={5}
                onChange={() => console.log('batata')}
            />
        </div>
        <div className="extracao-filter-field">
            <label for="data-inicio">Selecione data inicial</label>
            <DatePickerField
                name="filtrar_por_data_inicio"
                id="filtrar_por_data_inicio"
                value={5}
                onChange={() => console.log('batata')}
            />
        </div>
      </div>
     </>   
    )
}  