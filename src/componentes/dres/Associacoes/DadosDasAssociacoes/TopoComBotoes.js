import React, {useCallback} from "react";
import {Link, useParams} from "react-router-dom";
import {visoesService} from "../../../../services/visoes.service"

export const TopoComBotoes = ({dadosDaAssociacao}) => {
    let {origem, periodo_uuid, conta_uuid} = useParams();

    const getPath = useCallback(() => {
        let path;
        if (origem === undefined) {
            path = `/dre-associacoes`;
        } else if (origem === 'dre-relatorio-consolidado' && periodo_uuid && conta_uuid) {
            path = `/dre-relatorio-consolidado-dados-das-ues/${periodo_uuid}/${conta_uuid}/`;
        }
        window.location.assign(path)
    }, [origem, periodo_uuid, conta_uuid]);

    return (
        <>
            <div className="d-flex bd-highlight">
                <div className="p-2 flex-grow-1 bd-highlight">
                    <h1 className="titulo-itens-painel mt-5">{dadosDaAssociacao.dados_da_associacao.nome}</h1>
                </div>
                <div className="p-2 bd-highlight mt-5">
                    <button onClick={() => getPath()} className="btn btn btn-success">Voltar</button>
                </div>
            </div>

            <div className="d-flex justify-content-between p-3 mb-4 mt-2 bg-white container-menu-dados-das-associacoes">
                {visoesService.getPermissoes(["access_dados_unidade_dre"]) ?
                    <Link
                        to={`/dre-dados-da-unidade-educacional${origem ? '/' + origem : ''}${periodo_uuid ? '/'+ periodo_uuid : ''}${conta_uuid ? '/'+conta_uuid : ''}`}
                    >
                        Dados da unidade
                    </Link>
                    : null
                }
                {visoesService.getPermissoes(["access_regularidade_dre"]) ?
                    <Link
                        to={`/dre-regularidade-unidade-educacional${origem ? '/' + origem : ''}${periodo_uuid ? '/'+ periodo_uuid : ''}${conta_uuid ? '/'+conta_uuid : ''}`}
                    >
                        Regularidade
                    </Link>
                    : null}
                {visoesService.getPermissoes(["access_situacao_financeira_dre"]) ?
                    <Link
                        to={`/dre-situacao-financeira-unidade-educacional${origem ? '/' + origem : ''}${periodo_uuid ? '/'+ periodo_uuid : ''}${conta_uuid ? '/'+conta_uuid : ''}`}
                    >
                        Situação financeira
                    </Link>
                    : null
                }
                {visoesService.getPermissoes(["access_situacao_financeira_dre"]) ?
                    <Link
                        to={`/dre-situacao-financeira-unidade-educacional${origem ? '/' + origem : ''}${periodo_uuid ? '/'+ periodo_uuid : ''}${conta_uuid ? '/'+conta_uuid : ''}`}
                    >
                        Situação patrimonial
                    </Link>
                    : null
                }
            </div>
        </>
    );
};
