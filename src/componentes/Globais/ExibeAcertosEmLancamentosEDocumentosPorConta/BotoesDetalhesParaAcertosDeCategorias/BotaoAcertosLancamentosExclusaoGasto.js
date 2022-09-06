import React, {memo} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle} from "@fortawesome/free-solid-svg-icons";
import LinkCustom from "./LinkCustom";
import {RetornaSeTemPermissaoEdicaoAjustesLancamentos} from "../RetornaSeTemPermissaoEdicaoAjustesLancamentos";

const BotaoAcertosLancamentosExclusaoGasto = ({analise_lancamento, prestacaoDeContasUuid, prestacaoDeContas, tipo_transacao}) => {

    const TEMPERMISSAO = RetornaSeTemPermissaoEdicaoAjustesLancamentos(prestacaoDeContas)
    const URL = `/edicao-de-despesa/${analise_lancamento.despesa}`

    return (
        <>
            {analise_lancamento && !analise_lancamento.lancamento_excluido ? (

                <LinkCustom
                    url={URL}
                    analise_lancamento={analise_lancamento}
                    prestacaoDeContasUuid={prestacaoDeContasUuid}
                    prestacaoDeContas={prestacaoDeContas}
                    classeCssBotao='btn btn-outline-success mr-2'
                    operacao='requer_exclusao_lancamento_gasto'
                    tipo_transacao={tipo_transacao}
                >
                    { TEMPERMISSAO ? 'Excluir despesa' : "Ver despesa a excluir"}
                </LinkCustom>

            ):
                <span>
                    &nbsp;
                    <FontAwesomeIcon
                        style={{fontSize: '16px', color: '#00585E'}}
                        icon={faCheckCircle}
                    />
                     <strong> Despesa excluída.</strong>
                </span>
            }
        </>
    )
}

export default memo(BotaoAcertosLancamentosExclusaoGasto)