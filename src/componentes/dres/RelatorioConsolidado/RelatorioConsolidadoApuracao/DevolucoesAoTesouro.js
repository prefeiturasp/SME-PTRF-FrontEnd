import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHandHoldingUsd, faPlus} from "@fortawesome/free-solid-svg-icons";

export const DevolucoesAoTesouro = ({devolucoesAoTesouro, valorTemplate}) => {
    return(
        <>
            <div className='row mt-2'>
                <div className='col-12'>
                    <p className='titulo-devolucoes'>
                        <FontAwesomeIcon
                            style={{fontSize: '20px', marginRight: "3px", color: "#00585e"}}
                            icon={faHandHoldingUsd}
                        />
                        Devoluções ao tesouro
                    </p>
                    {devolucoesAoTesouro && devolucoesAoTesouro.length > 0 ? (
                            <table className="table table-bordered tabela-execucao-financeira">
                                <thead>
                                <tr className='tr-titulo'>
                                    <th scope="col">Tipo de devolução ao tesouro</th>
                                    <th scope="col">Número de ocorrências</th>
                                    <th scope="col">Valor</th>
                                    <th scope="col">Observações da DRE</th>
                                </tr>
                                </thead>
                                <tbody>
                                {devolucoesAoTesouro.map((devolucao, index)=>
                                    <tr key={index}>
                                        <td>{devolucao.tipo__nome}</td>
                                        <td>{devolucao.ocorrencias}</td>
                                        <td>{devolucao.valor ? valorTemplate(devolucao.valor) : '-'}</td>
                                        <td>
                                            <button className="btn-adicionar-devolucoes float-right">
                                                <FontAwesomeIcon
                                                    style={{fontSize: '15px', marginRight: "0"}}
                                                    icon={faPlus}
                                                />
                                                <strong> adicionar</strong>
                                            </button>
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        ) :
                        <p><strong>Não existem devoluções a serem exibidas</strong></p>
                    }
                </div>
            </div>
        </>
    )
};