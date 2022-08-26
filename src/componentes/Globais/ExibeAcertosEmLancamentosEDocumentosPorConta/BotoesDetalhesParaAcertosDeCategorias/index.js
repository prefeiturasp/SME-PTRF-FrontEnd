import React, {memo} from "react";
import BotaoAcertosLancamentosDevolucaoAoTesouro from "./BotaoAcertosLancamentosDevolucaoAoTesouro";
import "./BotoesDetalhesParaAcertosDeCategorias.scss"
import BotaoAcertosLancamentosEdicaoGasto from "./BotaoAcertosLancamentosEdicaoGasto";
import BotaoAcertosLancamentosEdicaoCredito from "./BotaoAcertosLancamentosEdicaoCredito";

const BotoesDetalhesParaAcertosDeCategorias = ({analise_lancamento, prestacaoDeContasUuid, prestacaoDeContas, tipo_transacao}) => {
    return (
        <>
            <div className='row'>
                <div className='col-12 px-4 py-2 text-right container-botoes-ajustes'>
                    {analise_lancamento && analise_lancamento.requer_atualizacao_devolucao_ao_tesouro && tipo_transacao === "Gasto" &&
                        <BotaoAcertosLancamentosDevolucaoAoTesouro
                            analise_lancamento={analise_lancamento}
                            prestacaoDeContasUuid={prestacaoDeContasUuid}
                            prestacaoDeContas={prestacaoDeContas}
                            tipo_transacao='Gasto'
                        />
                    }
                    {analise_lancamento && analise_lancamento.requer_atualizacao_lancamento && tipo_transacao === "Gasto" &&
                        <BotaoAcertosLancamentosEdicaoGasto
                            analise_lancamento={analise_lancamento}
                            prestacaoDeContasUuid={prestacaoDeContasUuid}
                            prestacaoDeContas={prestacaoDeContas}
                            tipo_transacao='Gasto'
                        />
                    }
                    {analise_lancamento && analise_lancamento.requer_atualizacao_lancamento && tipo_transacao === "Crédito" &&
                        <BotaoAcertosLancamentosEdicaoCredito
                            analise_lancamento={analise_lancamento}
                            prestacaoDeContasUuid={prestacaoDeContasUuid}
                            prestacaoDeContas={prestacaoDeContas}
                            tipo_transacao='Crédito'
                        />
                    }
                </div>
            </div>
        </>
    )

}

export default memo(BotoesDetalhesParaAcertosDeCategorias)

