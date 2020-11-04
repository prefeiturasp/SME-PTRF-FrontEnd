import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faWallet} from "@fortawesome/free-solid-svg-icons";

export const DevolucoesContaPtrf = ({devolucoesContaPtrf}) => {
    return(
        <>
            <div className='row mt-0'>
                <div className='col-12'>
                    <p className='titulo-devolucoes'>
                        <FontAwesomeIcon
                            style={{fontSize: '20px', marginRight: "3px", color: "#00585e"}}
                            icon={faWallet}
                        />
                        Devoluções a conta PTRF
                    </p>
                    {devolucoesContaPtrf && devolucoesContaPtrf.length > 0 ? (
                        <table className="table table-bordered tabela-execucao-financeira">
                            <thead>
                            <tr className='tr-titulo'>
                                <th scope="col">Tipo de devolução a conta PTRF </th>
                                <th scope="col">Número de ocorrências</th>
                                <th scope="col">Valor</th>
                                <th scope="col">Observações da DRE</th>
                            </tr>
                            </thead>
                            <tbody>
                            {devolucoesContaPtrf.map((devolucao)=>
                                <tr>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>1</td>
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