import React, {Fragment} from "react";
import {exibeDataPT_BR} from "../../../../utils/ValidacoesAdicionaisFormularios";

export const DevolucoesPrestacaoDeContas = ({prestacaoDeContas, retornaNumeroOrdinal, excluiUltimaCobranca}) => {
    return (
        <>
            {prestacaoDeContas && prestacaoDeContas.devolucoes_da_prestacao && prestacaoDeContas.devolucoes_da_prestacao.length > 0 && prestacaoDeContas.devolucoes_da_prestacao.map((devolucao, index) =>
                <Fragment key={index}>
                    <p className='pb-1 mt-3 mb-0 titulo-devolucao'><strong>{retornaNumeroOrdinal(index)} devolução</strong></p>
                    <hr className='mt-0 mb-2'/>
                    <p className='mb-1'>Data da devolução: <strong>{exibeDataPT_BR(devolucao.data)}</strong> | Data limite para a UE: <strong>{exibeDataPT_BR(devolucao.data_limite_ue)}</strong></p>
                    { excluiUltimaCobranca && index+1 === prestacaoDeContas.devolucoes_da_prestacao.length ? null:
                        devolucao && devolucao.cobrancas_da_devolucao && devolucao.cobrancas_da_devolucao.length > 0 && devolucao.cobrancas_da_devolucao.map((cobranca, index)=>
                            <p className='mb-1' key={index}> {retornaNumeroOrdinal(index)} cobrança: {exibeDataPT_BR(cobranca.data)}</p>
                        )}
                </Fragment>
            )}
        </>
    )
};