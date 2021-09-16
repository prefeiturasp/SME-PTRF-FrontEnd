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

        </>
    );
};
