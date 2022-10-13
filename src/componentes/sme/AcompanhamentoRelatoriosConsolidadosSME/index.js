import React, {useEffect, useState} from "react";
import {Redirect} from 'react-router-dom'
import {getPeriodos} from "../../../services/dres/Dashboard.service";
import {getCardRelatorios} from "../../../services/sme/DashboardSme.service"
import {SelectPeriodo} from "./SelectPeriodo";
import "./dashboard.scss"
import {BarraDeStatus} from "./BarraDeStatus";
import {DashboardCard} from "./DashboardCard";
import Loading from "../../../utils/Loading";

export const SmeDashboard = () => {

    const [periodos, setPeriodos] = useState();
    const [periodoEscolhido, setPeriodoEscolhido] = useState();
    const [itensDashboard, setItensDashboard] = useState(false);
    const [statusRelatorio, setStatusRelatorio] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        carregaPeriodos();
    }, []);
    
    useEffect(() => {
        if(periodoEscolhido) {
            carregaItensDashboard();
        }
    }, [periodoEscolhido]);

    const carregaPeriodos = async () => {
        setLoading(true);
        let periodoEncontrados = await getPeriodos();
        setPeriodos(periodoEncontrados);
        if (periodoEncontrados && periodoEncontrados.length > 0){
            const periodoIndex = periodoEncontrados.length > 1 ? 1 : 0;
            setPeriodoEscolhido(periodoEncontrados[periodoIndex].uuid)
        }
        setLoading(false);
    }

    const carregaItensDashboard = async () =>{
        setLoading(true);
        if (periodoEscolhido){
            let itens = await getCardRelatorios(periodoEscolhido);
            setItensDashboard(itens)
        }
        setLoading(false);
    };

    const handleChangePeriodos = async (uuid_periodo) => {
        setPeriodoEscolhido(uuid_periodo)
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
                            pathname: `/analises-relatorios-consolidados-dre-detalhe/f631ecc1-190b-4c85-b3bf-6ebcee38b601`,
                        }}
                    />
                    }
                </>
            }
        </>
    )
};