import React, {useCallback, useEffect, useState, useMemo} from "react";
import {useParams} from "react-router-dom";
import {NomeAssociacaoBotaoVoltar} from "./NomeAssociacaoBotaoVoltar";
import {TabsAnaliseAnoVigenteHistorico} from "./TabsAnaliseAnoVigenteHistorico";
import {getAssociacaoByUUID} from "../../../../services/escolas/Associacao.service";

export const AnalisesRegularidadeAssociacao = () => {
    const {associacao_uuid} = useParams()
    const [associacao, setAssociacao] = useState({})

    const buscaAssociacao = async ()=>{
        try {
            let associacaoObj = await getAssociacaoByUUID(associacao_uuid);
            setAssociacao(associacaoObj);
        }catch (e) {
            console.log(`Erro ao buscar associação de uuid ${associacao_uuid}.`, e)
        }
    };

    useEffect(() => {
        buscaAssociacao()
    }, [associacao_uuid])

    return (
        <>
            <NomeAssociacaoBotaoVoltar nomeAssociacao={`${associacao.nome}`}/>
            <div className="page-content-inner">
                <TabsAnaliseAnoVigenteHistorico associacaoUuid={associacao.uuid}/>
            </div>
        </>
    )
}