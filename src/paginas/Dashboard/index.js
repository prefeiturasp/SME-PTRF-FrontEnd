import React, {useEffect, useState} from "react";
import moment from "moment";
import {PaginasContainer} from "../PaginasContainer";
import {Dashboard} from "../../componentes/Dashborard";
import {getAcoesAssociacao} from "../../services/Dashboard.service";

export const DashboardPage = () => {

    const [acoesAssociacao, setAcoesAssociacao] = useState({})

    useEffect(() => {
        buscaListaAcoesAssociacao();
    }, [])

    const buscaListaAcoesAssociacao = async () => {
        const listaAcoes = await getAcoesAssociacao()
        setAcoesAssociacao(listaAcoes)
    }

    const exibeDataPT = (data) => {
        if (data === 'None'){
            data = moment(new Date(), "YYYY-MM-DD").format("DD/MM/YYYY");
        }else {
            data =  moment(new Date(data), "YYYY-MM-DD").add(1, 'days').format("DD/MM/YYYY");
        }
        return data
    }

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Painel</h1>
            <h2 className="subtitulo-itens-painel-out">Ações recebidas no período: {exibeDataPT(acoesAssociacao.data_inicio_realizacao_despesas)} até {exibeDataPT(acoesAssociacao.data_fim_realizacao_despesas)}</h2>
            <div className="page-content-inner bg-transparent p-0">
                <Dashboard
                    acoesAssociacao={acoesAssociacao}
                />
            </div>
        </PaginasContainer>
    );
}