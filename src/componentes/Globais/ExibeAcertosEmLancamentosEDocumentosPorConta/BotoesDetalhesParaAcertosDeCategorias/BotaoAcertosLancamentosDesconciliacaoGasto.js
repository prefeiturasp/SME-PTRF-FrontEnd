import React, {memo} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle} from "@fortawesome/free-solid-svg-icons";
import {RetornaSeTemPermissaoEdicaoAjustesLancamentos} from "../RetornaSeTemPermissaoEdicaoAjustesLancamentos";
import {botoesAcertosLancamentosService as BtnService} from "./botoesAcertosLancamentosService.service";

const BotaoAcertosLancamentosDesconciliacaoGasto = ({
                                                        carregaAcertosLancamentos,
                                                        conta,
                                                        analise_lancamento,
                                                        prestacaoDeContas,
                                                        analisePermiteEdicao
                                                    }) => {

    const TEMPERMISSAO = RetornaSeTemPermissaoEdicaoAjustesLancamentos(prestacaoDeContas, analisePermiteEdicao)

    return (
        <>
            {analise_lancamento && !analise_lancamento.conciliacao_atualizada ? (

                <button
                    onClick={() => BtnService.marcarGastoComoDesconciliado(analise_lancamento, carregaAcertosLancamentos, conta)}
                    className='btn btn-link clique-aqui-atualizada font-weight-bold'
                >
                    {TEMPERMISSAO && 'Clique para desconciliar'}
                </button>

            ) : (
                TEMPERMISSAO ? (
                    <>
                        <button
                            onClick={() => BtnService.marcarGastoComoConciliado(analise_lancamento, prestacaoDeContas, carregaAcertosLancamentos, conta)}
                            className='btn btn-link link-green text-center'
                        >
                            <FontAwesomeIcon
                                style={{fontSize: '16px', color: '#00585E'}}
                                icon={faCheckCircle}
                            />
                            <strong> Gasto atualizado. <span
                                className='clique-aqui-atualizada'>{TEMPERMISSAO && 'Clique para conciliar'}</span></strong>
                        </button>
                    </>
                ) : (
                    <>
                        <span>
                            <FontAwesomeIcon
                                style={{fontSize: '16px', color: '#00585E'}}
                                icon={faCheckCircle}
                            />
                            <strong> Gasto atualizado.</strong>
                        </span>
                    </>
                )
            )}
        </>
    )
}

export default memo(BotaoAcertosLancamentosDesconciliacaoGasto)