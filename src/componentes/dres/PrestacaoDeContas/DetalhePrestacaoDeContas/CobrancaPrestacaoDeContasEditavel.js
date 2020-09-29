import React from "react";
import {DatePickerField} from "../../../Globais/DatePickerField";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrashAlt} from '@fortawesome/free-solid-svg-icons'

export const CobrancaPrestacaoDeContasEditavel = ({listaDeCobrancas, dataCobranca, handleChangeDataCobranca, addCobranca, deleteCobranca}) =>{

    console.log("listaDeCobrancas ", listaDeCobrancas)

    return(
        <>
            <hr className='mt-4 mb-3'/>
            <h4>Cobrança da prestação de contas</h4>

{/*            <form method='post'>
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
            </form>*/}

            <form className="form-inline mt-4 mb-4">
                <div className="form-group">
                    <label className='mr-3' htmlFor="data_cobranca">Data de recebimento</label>
                    <DatePickerField
                        name="data_cobranca"
                        id="data_cobranca"
                        value={dataCobranca ? dataCobranca : ''}
                        onChange={handleChangeDataCobranca}
                    />
                    <button disabled={!dataCobranca} onClick={addCobranca} type="button" className="btn btn-success my-1 ml-3">Adicionar Cobranca</button>
                </div>
            </form>



            {listaDeCobrancas && listaDeCobrancas.length > 0 && listaDeCobrancas.map((cobrancao, index)=>
                <p key={index}>
                    <button
                        className="btn-excluir-valores-reprogramados"
                        onClick={()=>deleteCobranca(cobrancao.uuid)}
                        >
                        Cobrança Data {cobrancao.data}
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