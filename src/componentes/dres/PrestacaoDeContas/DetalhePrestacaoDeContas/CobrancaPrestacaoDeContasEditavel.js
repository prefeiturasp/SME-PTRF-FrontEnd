import React from "react";
import {Formik, FieldArray} from "formik";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import CurrencyInput from "react-currency-input";
import {DatePickerField} from "../../../Globais/DatePickerField";

export const CobrancaPrestacaoDeContasEditavel = ({listaDeCobrancas, dataCobranca, handleChangeDataCobranca, addCobranca}) =>{

    return(
        <>
            <hr className='mt-4 mb-3'/>
            <h4>Cobrança da prestação de contas</h4>

            <form>
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


            {listaDeCobrancas && listaDeCobrancas.length > 0 && listaDeCobrancas.map((cobrancao)=>
                <p>Cobrança Data {cobrancao.data} <button>Excluir</button></p>
            )}

        </>
    )
};