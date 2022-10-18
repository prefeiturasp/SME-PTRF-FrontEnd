import React, {memo} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle} from "@fortawesome/free-solid-svg-icons";
import LinkCustom from "./LinkCustom";
import {RetornaSeTemPermissaoEdicaoAjustesLancamentos} from "../RetornaSeTemPermissaoEdicaoAjustesLancamentos";

const BotaoAcertosLancamentosDevolucaoAoTesouro = ({analise_lancamento, prestacaoDeContasUuid, prestacaoDeContas, tipo_transacao}) => {

    const TEMPERMISSAO = RetornaSeTemPermissaoEdicaoAjustesLancamentos(prestacaoDeContas)
    const URL = '/devolucao-ao-tesouro-ajuste/'

    return (
        <>
            {analise_lancamento && !analise_lancamento.devolucao_tesouro_atualizada ? (
                <LinkCustom
                    url={URL}
                    analise_lancamento={analise_lancamento}
                    prestacaoDeContasUuid={prestacaoDeContasUuid}
                    prestacaoDeContas={prestacaoDeContas}
                    classeCssBotao='btn btn-outline-success mr-2'
                    operacao='requer_atualizacao_devolucao_ao_tesouro'
                    tipo_transacao={tipo_transacao}
                >
                    { TEMPERMISSAO ? 'Informar dev. tesouro' : "Ver dev. tesouro"}
                </LinkCustom>
            ):

                <LinkCustom
                    url={URL}
                    analise_lancamento={analise_lancamento}
                    prestacaoDeContasUuid={prestacaoDeContasUuid}
                    prestacaoDeContas={prestacaoDeContas}
                    classeCssBotao='link-green text-center'
                    operacao='requer_atualizacao_devolucao_ao_tesouro'
                    tipo_transacao={tipo_transacao}
                >
                    <>
                        <FontAwesomeIcon
                            style={{fontSize: '16px', color: '#00585E'}}
                            icon={faCheckCircle}
                        />
                        <strong> Dev.Tesouro atualizada. <span className='clique-aqui-atualizada mr-2'>Clique para { TEMPERMISSAO ? 'editar' : "ver"}</span></strong>
                    </>
                </LinkCustom>
            }
        </>
    )
}

export default memo(BotaoAcertosLancamentosDevolucaoAoTesouro)