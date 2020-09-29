import React from "react";
import {DatePickerField} from "../../../Globais/DatePickerField";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrashAlt, faPlus} from '@fortawesome/free-solid-svg-icons'
import moment from "moment";

export const CobrancaPrestacaoDeContas = ({listaDeCobrancas, dataCobranca, handleChangeDataCobranca, addCobranca, deleteCobranca, editavel, retornaNumeroCardinal}) =>{
    return(
        <>
            <hr className='mt-4 mb-3'/>
            <h4 className='mb-4'>Cobrança da prestação de contas</h4>
            {editavel &&
                <form className="form-inline mt-4">
                    <div className="form-group">
                        <label className='mr-3' htmlFor="data_cobranca">Data de recebimento</label>
                        <DatePickerField
                            name="data_cobranca"
                            id="data_cobranca"
                            value={dataCobranca ? dataCobranca : ''}
                            onChange={handleChangeDataCobranca}
                        />
                        <button disabled={!dataCobranca} onClick={addCobranca} type="button" className="btn btn-link btn-add-cobranca my-1 ml-3">
                            <FontAwesomeIcon
                                style={{fontSize: '18px', marginRight: "5px"}}
                                icon={faPlus}
                            />
                            Adicionar outra cobranca
                        </button>
                    </div>
                </form>
            }

            {listaDeCobrancas && listaDeCobrancas.length > 0 && listaDeCobrancas.map((cobrancao, index)=>
                <p className='mt-3 pb-2 border-bottom' key={index}>
                    <button
                        className="btn-excluir-cobranca pl-0"
                        onClick={()=>deleteCobranca(cobrancao.uuid)}
                        >
                        {retornaNumeroCardinal(index)} cobrança: <strong>{cobrancao.data ? moment(new Date(cobrancao.data), "YYYY-MM-DD").add(1, 'days').format("DD/MM/YYYY") : ""}</strong>
                        <FontAwesomeIcon
                            style={{fontSize: '20px', marginLeft: "1rem"}}
                            icon={faTrashAlt}
                        />
                    </button>
                </p>
            )}
        </>
    )
};