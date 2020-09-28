import React from "react";
import {DatePickerField} from "../../../Globais/DatePickerField";

export const CobrancaPrestacaoDeContasEditavel = ({listaDeCobrancas, dataCobranca, handleChangeDataCobranca, addCobranca, deleteCobranca}) =>{

    console.log("listaDeCobrancas ", listaDeCobrancas)

    return(
        <>
            <hr className='mt-4 mb-3'/>
            <h4>Cobrança da prestação de contas</h4>

            <form method='post'>
                <div className="col">
                    <label htmlFor="data_cobranca">Data de recebimento</label>
                    <DatePickerField
                        name="data_cobranca"
                        id="data_cobranca"
                        value={dataCobranca ? dataCobranca : ''}
                        onChange={handleChangeDataCobranca}
                    />
                </div>
                <button type='button' onClick={addCobranca}>Add Cobranca</button>
            </form>

            {listaDeCobrancas && listaDeCobrancas.length > 0 && listaDeCobrancas.map((cobrancao, index)=>
                <p key={index}><button onClick={()=>deleteCobranca(cobrancao.uuid)}>Cobrança Data {cobrancao.data} <button>Excluir</button></button></p>
            )}

        </>
    )
};