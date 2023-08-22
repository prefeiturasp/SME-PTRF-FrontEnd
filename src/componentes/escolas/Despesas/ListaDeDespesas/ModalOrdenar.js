import React from "react";
import {ModalFormBodyText} from "../../../Globais/ModalBootstrap";

export const ModalOrdenar = ({showModalOrdenar, setShowModalOrdenar, camposOrdenacao, handleChangeOrdenacao, onSubmitOrdenar, handleChangeCheckBoxOrdenarPorImposto}) => {



    const bodyTextarea = () => {
        return (
            <form>
                <div className='row'>

                    <div className='col-12 mt-2'>
                        <label htmlFor="ordenar_por_numero_do_documento"><strong>Nº do documento</strong></label>
                        <select
                            value={camposOrdenacao.ordenar_por_numero_do_documento}
                            onChange={(e) => handleChangeOrdenacao(e.target.name, e.target.value)}
                            name="ordenar_por_numero_do_documento"
                            id="ordenar_por_numero_do_documento"
                            className="form-control"
                            data-qa="ordenar-por-numero-documento"
                        >
                            <option data-qa={`option-ordenar-por-numero-documento-${0}`} value=''>Selecionar</option>
                            <option data-qa={`option-ordenar-por-numero-documento-${1}`} value='crescente'>Crescente</option>
                            <option data-qa={`option-ordenar-por-numero-documento-${2}`} value='decrescente'>Decrescente</option>

                        </select>
                    </div>

                    <div className='col-12 mt-2'>
                        <label htmlFor="ordenar_por_data_especificacao"><strong>Data da Especif. do material ou serviço</strong></label>
                        <select
                            value={camposOrdenacao.ordenar_por_data_especificacao}
                            onChange={(e) => handleChangeOrdenacao(e.target.name, e.target.value)}
                            name="ordenar_por_data_especificacao"
                            id="ordenar_por_data_especificacao"
                            className="form-control"
                            data-qa="ordenar-por-data-especificacao"
                        >
                            <option data-qa={`option-ordenar-por-data-especificacao-${0}`} value=''>Selecionar</option>
                            <option data-qa={`option-ordenar-por-data-especificacao-${1}`} value='crescente'>Crescente</option>
                            <option data-qa={`option-ordenar-por-data-especificacao-${2}`} value='decrescente'>Decrescente</option>
                        </select>
                    </div>

                    <div className='col-12 mt-2'>
                        <label htmlFor="ordenar_por_valor"><strong>Valor</strong></label>
                        <select
                            value={camposOrdenacao.ordenar_por_valor}
                            onChange={(e) => handleChangeOrdenacao(e.target.name, e.target.value)}
                            name="ordenar_por_valor"
                            id="ordenar_por_valor"
                            className="form-control"
                            data-qa="ordenar-por-valor"
                        >
                            <option data-qa={`option-ordenar-por-valor-${0}`} value=''>Selecionar</option>
                            <option data-qa={`option-ordenar-por-valor-${1}`} value='crescente'>Crescente</option>
                            <option data-qa={`option-ordenar-por-valor-${2}`} value='decrescente'>Decrescente</option>
                        </select>
                    </div>

                    <div className='col-12 mt-2'>
                        <div className="form-group form-check">
                            <input
                                onChange={(e) => handleChangeOrdenacao(e.target.name, e.target.checked)}
                                checked={camposOrdenacao.ordenar_por_imposto}
                                name={`ordenar_por_imposto`}
                                id={`ordenar_por_imposto`}
                                type="checkbox"
                                className="form-check-input"
                                data-qa="ordenar-por-imposto"
                            />
                            <label className="form-check-label" htmlFor={`ordenar_por_imposto`}>Ordenar com imposto vinculados às despesas</label>
                        </div>
                    </div>

                    <div className="col-12 mt-2">
                        <div className='text-right'>
                            <button
                                type='button'
                                onClick={()=>setShowModalOrdenar(false)}
                                className='btn btn-outline-success mr-2'
                                data-qa='btn-cancelar-modal-ordenacao'
                            >
                                Cancelar
                            </button>
                            <button
                                type='button'
                                onClick={onSubmitOrdenar}
                                className='btn btn-success'
                                data-qa='btn-ordenar-modal-ordenacao'
                            >
                                Ordenar
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        )
    }

    return(
        <ModalFormBodyText
            show={showModalOrdenar}
            titulo="Ordenar por"
            onHide={()=>setShowModalOrdenar(false)}
            bodyText={bodyTextarea()}
        />
    )

}