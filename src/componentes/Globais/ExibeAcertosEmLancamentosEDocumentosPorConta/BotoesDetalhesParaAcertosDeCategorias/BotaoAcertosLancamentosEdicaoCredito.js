import React, {memo} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle} from "@fortawesome/free-solid-svg-icons";
import LinkCustom from "./LinkCustom";
import {RetornaSeTemPermissaoEdicaoAjustesLancamentos} from "../RetornaSeTemPermissaoEdicaoAjustesLancamentos";

const BotaoAcertosLancamentosEdicaoCredito = ({analise_lancamento, prestacaoDeContasUuid, prestacaoDeContas, tipo_transacao, analisePermiteEdicao}) => {

    const TEMPERMISSAO = RetornaSeTemPermissaoEdicaoAjustesLancamentos(prestacaoDeContas, analisePermiteEdicao)
    const URL = `/edicao-de-receita/${analise_lancamento.receita}/`

    return (
        <>
            {analise_lancamento && !analise_lancamento.lancamento_atualizado ? (

                <LinkCustom
                    url={URL}
                    analise_lancamento={analise_lancamento}
                    prestacaoDeContasUuid={prestacaoDeContasUuid}
                    prestacaoDeContas={prestacaoDeContas}
                    classeCssBotao='btn btn-outline-success mr-2'
                    operacao='requer_atualizacao_lancamento_credito'
                    tipo_transacao={tipo_transacao}
                    analisePermiteEdicao={analisePermiteEdicao}
                >
                    { TEMPERMISSAO ? 'Ajustar crédito' : "Ver crédito"}
                </LinkCustom>

            ):
                <LinkCustom
                    url={URL}
                    analise_lancamento={analise_lancamento}
                    prestacaoDeContasUuid={prestacaoDeContasUuid}
                    prestacaoDeContas={prestacaoDeContas}
                    classeCssBotao='link-green text-center'
                    operacao='requer_atualizacao_lancamento_credito'
                    tipo_transacao={tipo_transacao}
                    analisePermiteEdicao={analisePermiteEdicao}
                >
                    <>
                        <FontAwesomeIcon
                            style={{fontSize: '16px', color: '#00585E'}}
                            icon={faCheckCircle}
                        />
                        <strong> Crédito atualizado. <span className='clique-aqui-atualizada'>Clique para { TEMPERMISSAO ? 'editar' : "ver"}</span></strong>
                    </>
                </LinkCustom>
            }
        </>
    )
}

export default memo(BotaoAcertosLancamentosEdicaoCredito)