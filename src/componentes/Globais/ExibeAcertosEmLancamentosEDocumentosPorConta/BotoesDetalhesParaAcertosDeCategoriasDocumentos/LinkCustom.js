import React, {memo} from "react";
import {Link} from "react-router-dom";
import {visoesService} from "../../../../services/visoes.service";
import {RetornaSeTemPermissaoEdicaoAjustesLancamentos} from "../RetornaSeTemPermissaoEdicaoAjustesLancamentos";

const LinkCustom = ({url, analise_documento, prestacaoDeContasUuid, prestacaoDeContas, classeCssBotao, children, operacao, analisePermiteEdicao, uuid_acerto_documento}) => {

    const getCurrentPathWithoutLastPart = () => {
        const pathRgx = /\//g;
        const childroutecount = ((window.location.pathname || '').match(pathRgx) || []).length
        return childroutecount > 1 ? window.location.pathname.slice(0, window.location.pathname.lastIndexOf('/')) : window.location.pathname;
    }

    const TEMPERMISSAO = RetornaSeTemPermissaoEdicaoAjustesLancamentos(prestacaoDeContas, analisePermiteEdicao)

    const checaSeTemPermissao = () =>{
        let tem_permissao = TEMPERMISSAO
        if (tem_permissao){
            if (operacao === 'requer_exclusao_documento_gasto' || operacao === 'requer_exclusao_documento_credito'){
                tem_permissao = false
            }
        }

        return tem_permissao
    }

    return(
        <Link
            to={{
                pathname: `${url}`,
                state: {
                    uuid_acerto_documento: uuid_acerto_documento,
                    uuid_pc: prestacaoDeContasUuid,
                    uuid_despesa: analise_documento.despesa,
                    uuid_receita: analise_documento.receita,
                    uuid_associacao: prestacaoDeContas?.associacao?.uuid,
                    origem: getCurrentPathWithoutLastPart(),
                    origem_visao: visoesService.getItemUsuarioLogado('visao_selecionada.nome'),
                    tem_permissao_de_edicao: checaSeTemPermissao(),
                    operacao: operacao,
                    periodo_uuid: prestacaoDeContas?.periodo_uuid
                }
            }}
            className={classeCssBotao}
        >
            {children}
        </Link>
    )
}

export default memo(LinkCustom)