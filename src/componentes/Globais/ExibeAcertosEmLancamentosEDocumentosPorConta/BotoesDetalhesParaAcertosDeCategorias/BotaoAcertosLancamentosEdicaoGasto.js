import React, {memo} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle} from "@fortawesome/free-solid-svg-icons";
import LinkCustom from "./LinkCustom";
import {RetornaSeTemPermissaoEdicaoAjustesLancamentos} from "../RetornaSeTemPermissaoEdicaoAjustesLancamentos";

const BotaoAcertosLancamentosEdicaoGasto = ({analise_lancamento, prestacaoDeContasUuid, prestacaoDeContas, tipo_transacao}) => {

    const TEMPERMISSAO = RetornaSeTemPermissaoEdicaoAjustesLancamentos(prestacaoDeContas)
    const URL = `/edicao-de-despesa/${analise_lancamento.despesa}`

    return (
        <>
            {analise_lancamento && !analise_lancamento.lancamento_atualizado ? (

                <LinkCustom
                    url={URL}
                    analise_lancamento={analise_lancamento}
                    prestacaoDeContasUuid={prestacaoDeContasUuid}
                    prestacaoDeContas={prestacaoDeContas}
                    classeCssBotao='btn btn-outline-success mr-2'
                    operacao='requer_atualizacao_lancamento_gasto'
                    tipo_transacao={tipo_transacao}
                >
                    { TEMPERMISSAO ? 'Ajustar despesa' : "Ver despesa a ajustar"}
                </LinkCustom>

            ):
                <LinkCustom
                    url={URL}
                    analise_lancamento={analise_lancamento}
                    prestacaoDeContasUuid={prestacaoDeContasUuid}
                    prestacaoDeContas={prestacaoDeContas}
                    classeCssBotao='link-green text-center'
                    operacao='requer_atualizacao_lancamento_gasto'
                    tipo_transacao={tipo_transacao}
                >
                    <>
                        <FontAwesomeIcon
                            style={{fontSize: '16px', color: '#00585E'}}
                            icon={faCheckCircle}
                        />
                        <strong> Despesa atualizada. <span className='clique-aqui-atualizada'>Clique para { TEMPERMISSAO ? 'editar' : "ver"}</span></strong>
                    </>
                </LinkCustom>
            }
        </>
    )
}

export default memo(BotaoAcertosLancamentosEdicaoGasto)