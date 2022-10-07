import React, {useEffect, useState} from "react";
import {Redirect} from 'react-router-dom'
import {getPeriodos} from "../../../services/dres/Dashboard.service";
import {getItensDashboardSme} from "../../../services/sme/DashboardSme.service"
import {SelectPeriodo} from "./SelectPeriodo";
import "./dashboard.scss"
import {BarraDeStatus} from "./BarraDeStatus";
import {DashboardCard} from "./DashboardCard";
import Loading from "../../../utils/Loading";

export const SmeDashboard = () => {

    const [periodos, setPeriodos] = useState(false);
    const [periodoEscolhido, setPeriodoEsolhido] = useState(false);
    const [itensDashboard, setItensDashboard] = useState(false);
    const [statusRelatorio, setStatusRelatorio] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        carregaPeriodos();
    }, []);

    useEffect(() => {
        // carregaItensDashboard();
        const dashboard = {
            "cards": [
                {
                    "titulo": "DREs sem relatório gerado",
                    "quantidade_de_relatorios": 14,
                    "status": "NAO_GERADO"
                },
                {
                    "titulo": "Relatórios não publicados",
                    "quantidade_de_relatorios": 0,
                    "status": "NAO_PUBLICADO"
                },
                {
                    "titulo": "Relatórios publicados",
                    "quantidade_de_relatorios": 2,
                    "status": "PUBLICADO"
                },
                {
                    "titulo": "Relatórios em análise",
                    "quantidade_de_relatorios": 0,
                    "status": "EM_ANALISE"
                },
                {
                    "titulo": "Relatórios devolvidos para acertos",
                    "quantidade_de_relatorios": 0,
                    "status": "DEVOLVIDO"
                },
                {
                    "titulo": "Relatórios analisados",
                    "quantidade_de_relatorios": 0,
                    "status": "ANALISADO"
                }
            ],
            "total_de_relatorios": 2
        }
        setItensDashboard(dashboard)
    }, [periodoEscolhido]);

    const carregaPeriodos = async () => {
        setLoading(true);
        let periodos = await getPeriodos();
        setPeriodos(periodos);
        if (periodos && periodos.length > 0){
            const periodoIndex = periodos.length > 1 ? 1 : 0;
            setPeriodoEsolhido(periodos[periodoIndex].uuid)
        }
        setLoading(false);
    };

    // const carregaItensDashboard = async () =>{
    //     setLoading(true);
    //     if (periodoEscolhido){
    //         let itens = await getItensDashboard(periodoEscolhido);
    //         setItensDashboard(itens)
    //     }
    //     setLoading(false);
    // };

    const handleChangePeriodos = async (uuid_periodo) => {
        setPeriodoEsolhido(uuid_periodo)
    };

    const handleClickVerRelatorios = (status) =>{
        setStatusRelatorio(status);
    };

    const handleClickVerDRE = () => {
        return ''
    }

    return (
        <>
            <SelectPeriodo
                periodos={periodos}
                periodoEscolhido={periodoEscolhido}
                handleChangePeriodos={handleChangePeriodos}
           />

            {loading ? (
                    <Loading
                        corGrafico="black"
                        corFonte="dark"
                        marginTop="0"
                        marginBottom="0"
                    />
                ) :
                <>
                    <BarraDeStatus
                        itensDashboard={itensDashboard}
                        handleClickVerRelatorios={handleClickVerRelatorios}
                    />
                    <DashboardCard
                        itensDashboard={itensDashboard}
                        handleClickVerRelatorios={handleClickVerRelatorios}
                        handleClickVerDRE={handleClickVerDRE}
                    />
                    {statusRelatorio &&
                    <Redirect
                        to={{
                            pathname: `/dre-lista-prestacao-de-contas/${periodoEscolhido}/${statusRelatorio}`,
                        }}
                    />
                    }
                </>
            }
        </>
    )
};