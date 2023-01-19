import React, {memo} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle} from "@fortawesome/free-solid-svg-icons";
import LinkCustom from "./LinkCustom";
import {RetornaSeTemPermissaoEdicaoAjustesLancamentos} from "../RetornaSeTemPermissaoEdicaoAjustesLancamentos";

const BotaoAcertosDocumentosInclusaoGasto = ({analise_documento, prestacaoDeContasUuid, prestacaoDeContas, analisePermiteEdicao, uuid_acerto_documento, acerto}) => {

    const TEMPERMISSAO = RetornaSeTemPermissaoEdicaoAjustesLancamentos(prestacaoDeContas, analisePermiteEdicao)
    const URL = acerto.despesa_incluida ? `/edicao-de-despesa/${acerto.despesa_incluida}` : `/cadastro-de-despesa/`;

    return (
        <>
            {acerto && !acerto.despesa_incluida && TEMPERMISSAO ? (
                <LinkCustom
                    url={URL}
                    analise_documento={analise_documento}
                    uuid_acerto_documento={uuid_acerto_documento}
                    prestacaoDeContasUuid={prestacaoDeContasUuid}
                    prestacaoDeContas={prestacaoDeContas}
                    classeCssBotao='btn btn-outline-success mr-2'
                    operacao='requer_inclusao_documento_gasto'
                    analisePermiteEdicao={analisePermiteEdicao}
                >
                    Incluir novo gasto
                </LinkCustom>
                ) :
                acerto && acerto.despesa_incluida && TEMPERMISSAO ? (
                <LinkCustom
                    url={URL}
                    analise_documento={analise_documento}
                    uuid_acerto_documento={uuid_acerto_documento}
                    prestacaoDeContasUuid={prestacaoDeContasUuid}
                    prestacaoDeContas={prestacaoDeContas}
                    classeCssBotao='link-green text-center'
                    operacao='requer_inclusao_documento_gasto'
                    analisePermiteEdicao={analisePermiteEdicao}
                >
                    <>
                        <FontAwesomeIcon
                            style={{fontSize: '16px', color: '#00585E'}}
                            icon={faCheckCircle}
                        />
                        <strong> Gasto incluído. <span className='clique-aqui-atualizada'>Clique aqui para editar</span></strong>
                    </>
                </LinkCustom>
            ):
                    acerto && acerto.despesa_incluida && !TEMPERMISSAO &&
                <LinkCustom
                    url={URL}
                    analise_documento={analise_documento}
                    uuid_acerto_documento={uuid_acerto_documento}
                    prestacaoDeContasUuid={prestacaoDeContasUuid}
                    prestacaoDeContas={prestacaoDeContas}
                    classeCssBotao='link-green text-center'
                    operacao='requer_inclusao_documento_gasto'
                    analisePermiteEdicao={analisePermiteEdicao}
                >
                    <>
                        <FontAwesomeIcon
                            style={{fontSize: '16px', color: '#00585E'}}
                            icon={faCheckCircle}
                        />
                        <strong> Gasto incluído. <span className='clique-aqui-atualizada'>Clique aqui para ver</span></strong>
                    </>
                </LinkCustom>
            }
        </>
    )
}

export default memo(BotaoAcertosDocumentosInclusaoGasto)