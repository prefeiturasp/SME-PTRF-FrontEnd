import React, {useEffect, useState} from "react";
import moment from "moment";
import {PaginasContainer} from "../PaginasContainer";
import {Dashboard} from "../../componentes/Dashborard";
import {getAcoesAssociacao} from "../../services/Dashboard.service";
import {exibeDataPT_BR} from "../../utils/ValidacoesAdicionaisFormularios"

export const DashboardPage = () => {

    const [acoesAssociacao, setAcoesAssociacao] = useState({})

    useEffect(() => {
        buscaListaAcoesAssociacao();
    }, [])

    const buscaListaAcoesAssociacao = async () => {
        const listaAcoes = await getAcoesAssociacao()
        setAcoesAssociacao(listaAcoes)
    }

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Painel</h1>
            <h2 className="subtitulo-itens-painel-out">Ações recebidas no período: {exibeDataPT_BR(acoesAssociacao.data_inicio_realizacao_despesas)} até {exibeDataPT_BR(acoesAssociacao.data_fim_realizacao_despesas)}</h2>
            <div className="page-content-inner bg-transparent p-0">
                <Dashboard
                    acoesAssociacao={acoesAssociacao}
                />
            </div>
        </PaginasContainer>
    );
}