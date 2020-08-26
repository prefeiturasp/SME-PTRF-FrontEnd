import React, {useEffect, useState} from "react";
import {DashboardCard} from "./DashboardCard";
import {DashboardCardInfoConta} from "./DashboardCardInfoConta";
import {SelectsPeriodoAcao} from "./SelectsPeriodoAcao";
import {getPeriodosNaoFuturos} from "../../../services/escolas/PrestacaoDeContas.service";
import {getAcoesAssociacao, getAcoesAssociacaoPorPeriodo, getAcoesAssociacaoPorConta} from "../../../services/Dashboard.service";
import {exibeDataPT_BR, getCorStatusPeriodo, getTextoStatusPeriodo} from "../../../utils/ValidacoesAdicionaisFormularios";
import Loading from "../../../utils/Loading";
import {BarraDeStatusPeriodoAssociacao} from "./BarraDeStatusPeriodoAssociacao";
import {getTabelasReceita} from "../../../services/escolas/Receitas.service";

export const Dashboard = () => {
    const [acoesAssociacao, setAcoesAssociacao] = useState({});
    const [periodosAssociacao, setPeriodosAssociacao] = useState(false);
    const [loading, setLoading] = useState(true);
    const [tiposConta, setTiposConta] = useState([]);

    useEffect(() => {
        buscaListaAcoesAssociacao()
    }, []);

    const buscaListaAcoesAssociacao = async () => {
        let periodos = await getPeriodosNaoFuturos();
        setPeriodosAssociacao(periodos);

        const listaAcoes = await getAcoesAssociacao();
        setAcoesAssociacao(listaAcoes);

        setLoading(false);
    };

    useEffect(() => {
        const carregaTabelas = async () => {
            let tabela =  await getTabelasReceita();
            setTiposConta(tabela.data.contas_associacao);
        };
        carregaTabelas()
    }, []);

    const handleChangePeriodo = async (value) => {
        setLoading(true);
        if (value) {
            let acoesPorPeriodo = await getAcoesAssociacaoPorPeriodo(value);
            await handleChangeAcao("")
            setAcoesAssociacao(acoesPorPeriodo);

        }
        setLoading(false);
    };

    const handleChangeAcao = async (value) => {
        setLoading(true);

        if (value) {
            if (value === 'todas_contas'){
                await buscaListaAcoesAssociacao()
            }else {
                let acoesPorConta =  await getAcoesAssociacaoPorConta(value);
                setAcoesAssociacao(acoesPorConta);
            }
        }
        setLoading(false);
    };

    return (
        <>
            <SelectsPeriodoAcao
                periodosAssociacao={periodosAssociacao}
                handleChangePeriodo={handleChangePeriodo}
                tiposConta={tiposConta}
                handleChangeAcao={handleChangeAcao}
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
                    <BarraDeStatusPeriodoAssociacao
                        statusPeriodoAssociacao={acoesAssociacao.periodo_status}
                        corBarraDeStatusPeriodoAssociacao={getCorStatusPeriodo(acoesAssociacao.periodo_status)}
                        textoBarraDeStatusPeriodoAssociacao={getTextoStatusPeriodo(acoesAssociacao.periodo_status)}
                    />
                    <DashboardCardInfoConta
                        acoesAssociacao={acoesAssociacao}
                        statusPeriodoAssociacao={acoesAssociacao.periodo_status}
                    />
                    <DashboardCard
                        acoesAssociacao={acoesAssociacao}
                        statusPeriodoAssociacao={acoesAssociacao.periodo_status}
                    />
                </>
            }


        </>
    );
}