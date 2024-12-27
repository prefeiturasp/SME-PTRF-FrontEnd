import React, {useEffect, useState} from "react";
import {Redirect, useLocation} from 'react-router-dom'
import {getPeriodos, getItensDashboard} from "../../../services/dres/Dashboard.service";
import {SelectPeriodo} from "./SelectPeriodo";
import "./dashboard.scss"
import {BarraDeStatus} from "./BarraDeStatus";
import {DashboardCard} from "./DashboardCard";
import Loading from "../../../utils/Loading";

export const DreDashboard = () => {

    const [periodos, setPeriodos] = useState(false);
    const [periodoEscolhido, setPeriodoEsolhido] = useState(false);
    const [itensDashboard, setItensDashboard] = useState(false);
    const [statusPrestacao, setStatusPrestacao] = useState(false);
    const [loading, setLoading] = useState(false);

    const location = useLocation();
    const acessadoPelaSidebar = location.state?.acessadoPelaSidebar || false;

    useEffect(() => {
        carregaPeriodos();
    }, []);

    useEffect(() => {
        carregaItensDashboard();
        if (periodoEscolhido) {
            localStorage.setItem('PERIODO_SELECIONADO_DRE_ACOMPANHAMENTO', periodoEscolhido);
        }
    }, [periodoEscolhido]);

    const carregaPeriodos = async () => {
        setLoading(true);
        let periodos = await getPeriodos();
        setPeriodos(periodos);

        const storedPeriodo = localStorage.getItem('PERIODO_SELECIONADO_DRE_ACOMPANHAMENTO');
        if (periodos && periodos.length > 0){
            if(storedPeriodo && !acessadoPelaSidebar) {
                setPeriodoEsolhido(storedPeriodo);
            } else {
                //Caso exista mais de um período seleciona por default o anterior ao corrente.
                const periodoIndex = periodos.length > 1 ? 1 : 0;
                setPeriodoEsolhido(periodos[periodoIndex].uuid)
            }
        }
        setLoading(false);
    };

    const carregaItensDashboard = async () =>{
        setLoading(true);
        if (periodoEscolhido){
            let itens = await getItensDashboard(periodoEscolhido);
            setItensDashboard(itens)
        }
        setLoading(false);
    };

    const handleChangePeriodos = async (uuid_periodo) => {
        setPeriodoEsolhido(uuid_periodo)
    };

    const handleClickVerPrestacaoes = (status) =>{
        setStatusPrestacao(status);
    };

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
                        handleClickVerPrestacaoes={handleClickVerPrestacaoes}
                    />
                    <DashboardCard
                        itensDashboard={itensDashboard}
                        handleClickVerPrestacaoes={handleClickVerPrestacaoes}
                    />
                    {statusPrestacao &&
                    <Redirect
                        to={{
                            pathname: `/dre-lista-prestacao-de-contas/${periodoEscolhido}/${statusPrestacao}`,
                        }}
                    />
                    }
                </>
            }
        </>
    )
};