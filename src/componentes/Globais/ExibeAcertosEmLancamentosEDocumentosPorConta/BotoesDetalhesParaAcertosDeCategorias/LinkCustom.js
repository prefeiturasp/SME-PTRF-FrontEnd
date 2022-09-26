import React, {memo} from "react";
import {Link} from "react-router-dom";
import {visoesService} from "../../../../services/visoes.service";
import {RetornaSeTemPermissaoEdicaoAjustesLancamentos} from "../RetornaSeTemPermissaoEdicaoAjustesLancamentos";

const LinkCustom = ({url, analise_lancamento, prestacaoDeContasUuid, prestacaoDeContas, classeCssBotao, children, operacao, tipo_transacao}) => {

    const getCurrentPathWithoutLastPart = () => {
        const pathRgx = /\//g;
        const childroutecount = ((window.location.pathname || '').match(pathRgx) || []).length
        return childroutecount > 1 ? window.location.pathname.slice(0, window.location.pathname.lastIndexOf('/')) : window.location.pathname;
    }

    const TEMPERMISSAO = RetornaSeTemPermissaoEdicaoAjustesLancamentos(prestacaoDeContas)

    const checaSeTemPermissao = () =>{
        let tem_permissao = TEMPERMISSAO
        if (tem_permissao){
            if (operacao === 'requer_exclusao_lancamento_gasto' || operacao === 'requer_exclusao_lancamento_credito'){
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
                    uuid_analise_lancamento: analise_lancamento.uuid,
                    uuid_pc: prestacaoDeContasUuid,
                    uuid_despesa: analise_lancamento.despesa,
                    uuid_receita: analise_lancamento.receita,
                    uuid_associacao: prestacaoDeContas.associacao.uuid,
                    origem: getCurrentPathWithoutLastPart(),
                    origem_visao: visoesService.getItemUsuarioLogado('visao_selecionada.nome'),
                    tem_permissao_de_edicao: checaSeTemPermissao(),
                    operacao: operacao,
                    tipo_transacao: tipo_transacao,
                    periodo_uuid: prestacaoDeContas.periodo_uuid
                }
            }}
            className={classeCssBotao}
        >
            {children}
        </Link>
    )
}

export default memo(LinkCustom)