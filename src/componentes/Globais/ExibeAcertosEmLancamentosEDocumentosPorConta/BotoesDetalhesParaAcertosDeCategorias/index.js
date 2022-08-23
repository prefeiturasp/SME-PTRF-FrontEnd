import React, {memo} from "react";
import BotaoAcertosLancamentosDevolucaoAoTesouro from "./BotaoAcertosLancamentosDevolucaoAoTesouro";
import "./BotoesDetalhesParaAcertosDeCategorias.scss"



const BotoesDetalhesParaAcertosDeCategorias = ({analise_lancamento, prestacaoDeContasUuid, prestacaoDeContas}) => {
    return (
        <>
            <div className='row'>
                <div className='col-12 px-4 py-2 text-right container-botoes-ajustes'>
                    {analise_lancamento && analise_lancamento.requer_atualizacao_devolucao_ao_tesouro &&
                        <BotaoAcertosLancamentosDevolucaoAoTesouro
                            analise_lancamento={analise_lancamento}
                            prestacaoDeContasUuid={prestacaoDeContasUuid}
                            prestacaoDeContas={prestacaoDeContas}
                        />
                    }
                </div>
            </div>
        </>
    )

}

export default memo(BotoesDetalhesParaAcertosDeCategorias)

