import React, {Fragment} from "react";

export const DevolucoesPrestacaoDeContas = ({prestacaoDeContas, retornaNumeroOrdinal}) => {

    console.log("DevolucoesPrestacaoDeContas XXXXXX ", prestacaoDeContas.devolucoes_da_prestacao)

    return (
        <>
            {prestacaoDeContas && prestacaoDeContas.devolucoes_da_prestacao && prestacaoDeContas.devolucoes_da_prestacao.length > 0 && prestacaoDeContas.devolucoes_da_prestacao.map((devolucao, index) =>
                <Fragment key={index}>
                    <p className='pb-1 mt-3 mb-0'><strong>{retornaNumeroOrdinal(index)} devolução</strong></p>
                    <hr className='mt-0 mb-2'/>
                    <p className='mb-1'>Data da devolução: {devolucao.data} | Data limite para a UE: {devolucao.data_limite_ue}</p>
                    <p className='mb-1'> Primeira cobrança: 26/05/2020</p>
                </Fragment>
            )}
        </>
    )

};