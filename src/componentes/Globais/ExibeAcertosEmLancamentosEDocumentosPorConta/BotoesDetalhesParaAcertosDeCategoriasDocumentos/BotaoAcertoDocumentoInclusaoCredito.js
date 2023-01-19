import React, {memo} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle} from "@fortawesome/free-solid-svg-icons";
import LinkCustom from "./LinkCustom";
import {RetornaSeTemPermissaoEdicaoAjustesLancamentos} from "../RetornaSeTemPermissaoEdicaoAjustesLancamentos";

const BotaoAcertosDocumentosInclusaoCredito = ({analise_documento, prestacaoDeContasUuid, prestacaoDeContas, analisePermiteEdicao, uuid_acerto_documento, acerto}) => {

    const TEMPERMISSAO = RetornaSeTemPermissaoEdicaoAjustesLancamentos(prestacaoDeContas, analisePermiteEdicao)
    const URL = acerto.receita_incluida ? `/edicao-de-receita/${acerto.receita_incluida}` : `/cadastro-de-credito/`;

    return (
        <>
            {acerto && !acerto.receita_incluida && TEMPERMISSAO ? (
                <LinkCustom
                    url={URL}
                    analise_documento={analise_documento}
                    uuid_acerto_documento={uuid_acerto_documento}
                    prestacaoDeContasUuid={prestacaoDeContasUuid}
                    prestacaoDeContas={prestacaoDeContas}
                    classeCssBotao='btn btn-outline-success mr-2'
                    operacao='requer_inclusao_documento_credito'
                    analisePermiteEdicao={analisePermiteEdicao}
                >
                    Incluir novo crédito
                </LinkCustom>
                ) :
                acerto && acerto.receita_incluida && TEMPERMISSAO ? (
                <LinkCustom
                    url={URL}
                    analise_documento={analise_documento}
                    uuid_acerto_documento={uuid_acerto_documento}
                    prestacaoDeContasUuid={prestacaoDeContasUuid}
                    prestacaoDeContas={prestacaoDeContas}
                    classeCssBotao='link-green text-center'
                    operacao='requer_inclusao_documento_credito'
                    analisePermiteEdicao={analisePermiteEdicao}
                >
                    <>
                        <FontAwesomeIcon
                            style={{fontSize: '16px', color: '#00585E'}}
                            icon={faCheckCircle}
                        />
                        <strong> Crédito incluído. <span className='clique-aqui-atualizada'>Clique aqui para editar</span></strong>
                    </>
                </LinkCustom>
            ):
                    acerto && acerto.receita_incluida && !TEMPERMISSAO &&
                <LinkCustom
                    url={URL}
                    analise_documento={analise_documento}
                    uuid_acerto_documento={uuid_acerto_documento}
                    prestacaoDeContasUuid={prestacaoDeContasUuid}
                    prestacaoDeContas={prestacaoDeContas}
                    classeCssBotao='link-green text-center'
                    operacao='requer_inclusao_documento_credito'
                    analisePermiteEdicao={analisePermiteEdicao}
                >
                    <>
                        <FontAwesomeIcon
                            style={{fontSize: '16px', color: '#00585E'}}
                            icon={faCheckCircle}
                        />
                        <strong> Crédito incluído. <span className='clique-aqui-atualizada'>Clique aqui para ver</span></strong>
                    </>
                </LinkCustom>
            }
        </>
    )
}

export default memo(BotaoAcertosDocumentosInclusaoCredito)