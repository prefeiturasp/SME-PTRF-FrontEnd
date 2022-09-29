import React, {memo} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle} from "@fortawesome/free-solid-svg-icons";
import LinkCustom from "./LinkCustom";
import {RetornaSeTemPermissaoEdicaoAjustesLancamentos} from "../RetornaSeTemPermissaoEdicaoAjustesLancamentos";

const BotaoAcertosDocumentosInclusaoCredito = ({analise_documento, prestacaoDeContasUuid, prestacaoDeContas}) => {

    const TEMPERMISSAO = RetornaSeTemPermissaoEdicaoAjustesLancamentos(prestacaoDeContas)
    const URL = analise_documento.receita_incluida ? `/edicao-de-receita/${analise_documento.receita_incluida}` : `/cadastro-de-credito/`;

    return (
        <>
            {analise_documento && !analise_documento.receita_incluida && TEMPERMISSAO ? (
                <LinkCustom
                    url={URL}
                    analise_documento={analise_documento}
                    prestacaoDeContasUuid={prestacaoDeContasUuid}
                    prestacaoDeContas={prestacaoDeContas}
                    classeCssBotao='btn btn-outline-success mr-2'
                    operacao='requer_inclusao_documento_credito'
                >
                    Incluir novo crédito
                </LinkCustom>
                ) :
            analise_documento && analise_documento.receita_incluida && TEMPERMISSAO ? (
                <LinkCustom
                    url={URL}
                    analise_documento={analise_documento}
                    prestacaoDeContasUuid={prestacaoDeContasUuid}
                    prestacaoDeContas={prestacaoDeContas}
                    classeCssBotao='link-green text-center'
                    operacao='requer_inclusao_documento_credito'
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
            analise_documento && analise_documento.receita_incluida && !TEMPERMISSAO &&
                <LinkCustom
                    url={URL}
                    analise_documento={analise_documento}
                    prestacaoDeContasUuid={prestacaoDeContasUuid}
                    prestacaoDeContas={prestacaoDeContas}
                    classeCssBotao='link-green text-center'
                    operacao='requer_inclusao_documento_credito'
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