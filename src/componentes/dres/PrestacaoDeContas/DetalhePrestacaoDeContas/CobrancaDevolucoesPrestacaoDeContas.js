import React from "react";
import {DatePickerField} from "../../../Globais/DatePickerField";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrashAlt, faPlus} from '@fortawesome/free-solid-svg-icons'
import moment from "moment";

export const CobrancaDevolucoesPrestacaoDeContas = ({listaDeCobrancasDevolucoes, dataCobrancaDevolucoes, handleChangeDataCobrancaDevolucoes, addCobrancaDevolucoes, deleteCobrancaDevolucoes, editavel, retornaNumeroOrdinal}) =>{

    //console.log("CobrancaDevolucoesPrestacaoDeContas ", listaDeCobrancasDevolucoes)

    return(
        <>
            {editavel &&
                <form className="form-inline mt-4">
                    <div className="form-group">
                        <label className='mr-3' htmlFor="data_cobranca">Data de recebimento</label>
                        <DatePickerField
                            name="data_cobranca"
                            id="data_cobranca"
                            value={dataCobrancaDevolucoes ? dataCobrancaDevolucoes : ''}
                            onChange={handleChangeDataCobrancaDevolucoes}
                        />
                        <button disabled={!dataCobrancaDevolucoes} onClick={addCobrancaDevolucoes} type="button" className="btn btn-link btn-add-cobranca my-1 ml-3">
                            <FontAwesomeIcon
                                style={{fontSize: '18px', marginRight: "5px"}}
                                icon={faPlus}
                            />
                            Adicionar outra cobranca
                        </button>
                    </div>
                </form>
            }

            {listaDeCobrancasDevolucoes && listaDeCobrancasDevolucoes.length > 0 && listaDeCobrancasDevolucoes.map((cobrancao, index)=>
                <p className='mt-3 pb-2 border-bottom' key={index}>
                    {editavel ? (
                        <button
                            className="btn-excluir-cobranca pl-0"
                            onClick={()=>deleteCobrancaDevolucoes(cobrancao.uuid)}
                        >
                            {retornaNumeroOrdinal(index)} cobrança: <strong>{cobrancao.data ? moment(new Date(cobrancao.data), "YYYY-MM-DD").add(1, 'days').format("DD/MM/YYYY") : ""}</strong>
                            <FontAwesomeIcon
                                style={{fontSize: '20px', marginLeft: "1rem"}}
                                icon={faTrashAlt}
                            />
                        </button>
                    ) :
                        <span>{retornaNumeroOrdinal(index)} cobrança: <strong>{cobrancao.data ? moment(new Date(cobrancao.data), "YYYY-MM-DD").add(1, 'days').format("DD/MM/YYYY") : ""}</strong></span>
                    }
                </p>
            )}
        </>
    )
};