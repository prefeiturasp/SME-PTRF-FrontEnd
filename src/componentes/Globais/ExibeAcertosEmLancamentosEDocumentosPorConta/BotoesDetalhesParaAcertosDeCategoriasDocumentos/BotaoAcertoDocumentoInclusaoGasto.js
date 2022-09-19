import React, {memo} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle} from "@fortawesome/free-solid-svg-icons";
import LinkCustom from "./LinkCustom";
import {RetornaSeTemPermissaoEdicaoAjustesLancamentos} from "../RetornaSeTemPermissaoEdicaoAjustesLancamentos";

const BotaoAcertosDocumentosInclusaoGasto = ({analise_documento, prestacaoDeContasUuid, prestacaoDeContas}) => {

    const TEMPERMISSAO = RetornaSeTemPermissaoEdicaoAjustesLancamentos(prestacaoDeContas)
    const URL = analise_documento.despesa_incluida ? `/edicao-de-despesa/${analise_documento.despesa_incluida}` : `/cadastro-de-despesa/`;

    return (
        <>
            {analise_documento && !analise_documento.despesa_incluida && TEMPERMISSAO ? (
                <LinkCustom
                    url={URL}
                    analise_documento={analise_documento}
                    prestacaoDeContasUuid={prestacaoDeContasUuid}
                    prestacaoDeContas={prestacaoDeContas}
                    classeCssBotao='btn btn-outline-success mr-2'
                    operacao='requer_inclusao_documento_gasto'
                >
                    Incluir novo gasto
                </LinkCustom>
                ) :
            analise_documento && analise_documento.despesa_incluida && TEMPERMISSAO ? (
                <LinkCustom
                    url={URL}
                    analise_documento={analise_documento}
                    prestacaoDeContasUuid={prestacaoDeContasUuid}
                    prestacaoDeContas={prestacaoDeContas}
                    classeCssBotao='link-green text-center'
                    operacao='requer_inclusao_documento_gasto'
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
            analise_documento && analise_documento.despesa_incluida && !TEMPERMISSAO &&
                <LinkCustom
                    url={URL}
                    analise_documento={analise_documento}
                    prestacaoDeContasUuid={prestacaoDeContasUuid}
                    prestacaoDeContas={prestacaoDeContas}
                    classeCssBotao='link-green text-center'
                    operacao='requer_inclusao_documento_gasto'
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