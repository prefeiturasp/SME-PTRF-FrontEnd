import React, {memo} from "react";
import {RetornaSeTemPermissaoEdicaoAjustesLancamentos} from "../RetornaSeTemPermissaoEdicaoAjustesLancamentos";
import {botoesAcertosLancamentosService as BtnService} from "./botoesAcertosLancamentosService.service";
import { Icon } from "../../UI/Icon";

const BotaoAcertosLancamentosConciliacaoGasto = ({carregaAcertosLancamentos, conta, analise_lancamento, prestacaoDeContas, analisePermiteEdicao}) => {

    const TEMPERMISSAO = RetornaSeTemPermissaoEdicaoAjustesLancamentos(prestacaoDeContas, analisePermiteEdicao)
    return (
        <>
            {analise_lancamento && !analise_lancamento.conciliacao_atualizada ? (

                <button
                    onClick={()=>BtnService.marcarGastoComoConciliado(analise_lancamento, prestacaoDeContas, carregaAcertosLancamentos, conta)}
                    className='btn btn-link clique-aqui-atualizada font-weight-bold'
                >
                    { TEMPERMISSAO && 'Clique para conciliar'}
                </button>

            ):(
                TEMPERMISSAO ? (
                    <>
                        <button
                            onClick={() => BtnService.marcarGastoComoDesconciliado(analise_lancamento, carregaAcertosLancamentos, conta)}
                            className='btn btn-link link-green text-center'
                        >
                            <Icon
                                icon="faCheckCircle"
                                iconProps={{style: {fontSize: '16px'}}}
                            />
                            <strong> Gasto atualizado. <span
                                className='clique-aqui-atualizada'>{TEMPERMISSAO && 'Clique para desconciliar'}</span></strong>
                        </button>
                    </>
                ) : (
                    <>
                        <span>
                            <Icon
                                icon="faCheckCircle"
                                iconProps={{style: {fontSize: '16px'}}}
                            />
                            <strong> Gasto atualizado.</strong>
                        </span>
                    </>
                )
            )}
        </>
    )
}

export default memo(BotaoAcertosLancamentosConciliacaoGasto)