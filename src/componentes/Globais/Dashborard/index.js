import React, {useEffect, useState} from "react";
import {DashboardCard} from "./DashboardCard";
import {DashboardCardInfoConta} from "./DashboardCardInfoConta";
import {SelectPeriodo} from "./SelectPeriodo";
import {SelectConta} from "./SelectConta";
import {getPeriodosNaoFuturos} from "../../../services/escolas/PrestacaoDeContas.service";
import {getAcoesAssociacao, getAcoesAssociacaoPorPeriodo, getAcoesAssociacaoPorConta} from "../../../services/Dashboard.service";
import {exibeDataPT_BR, getCorStatusPeriodo, getTextoStatusPeriodo} from "../../../utils/ValidacoesAdicionaisFormularios";
import Loading from "../../../utils/Loading";
import {BarraDeStatusPeriodoAssociacao} from "./BarraDeStatusPeriodoAssociacao";
import {getTabelasReceita} from "../../../services/escolas/Receitas.service";
import "./dashboard.scss"

export const Dashboard = () => {
    const [acoesAssociacao, setAcoesAssociacao] = useState({});
    const [periodosAssociacao, setPeriodosAssociacao] = useState(false);
    const [loading, setLoading] = useState(true);
    const [tiposConta, setTiposConta] = useState([]);
    // Lógica para "zerar" o select de Contas e Periodos
    const [selectConta, setSelectConta] = useState(false);
    const [selectPeriodo, setSelectPeriodo] = useState(false);

    useEffect(() => {
        buscaPeriodos();
        buscaListaAcoesAssociacao()
    }, []);

    const buscaPeriodos = async () => {
        let periodos = await getPeriodosNaoFuturos();
        setPeriodosAssociacao(periodos);
    };

    const buscaListaAcoesAssociacao = async () => {
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
        setSelectPeriodo(false);
        if (value) {
            let acoesPorPeriodo = await getAcoesAssociacaoPorPeriodo(value);
            setSelectConta(true);
            setAcoesAssociacao(acoesPorPeriodo);
        }
        setLoading(false);
    };

    const handleChangeConta = async (value) => {
        setLoading(true);
        setSelectConta(false);
        setSelectPeriodo(true);
        if (value) {
            let acoesPorConta =  await getAcoesAssociacaoPorConta(value);
            setAcoesAssociacao(acoesPorConta);
        }else {
            await buscaListaAcoesAssociacao();
        }
        setLoading(false);
    };

    return (
        <>
            <div className="form-row align-items-center mb-3">
                <SelectPeriodo
                    periodosAssociacao={periodosAssociacao}
                    handleChangePeriodo={handleChangePeriodo}
                    selectPeriodo={selectPeriodo}
                    exibeDataPT_BR={exibeDataPT_BR}
                />
                <SelectConta
                    handleChangeConta={handleChangeConta}
                    selectConta={selectConta}
                    tiposConta={tiposConta}
                />
            </div>

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
                        corIconeFonte={getCorStatusPeriodo(acoesAssociacao.periodo_status)}
                    />
                    <DashboardCard
                        acoesAssociacao={acoesAssociacao}
                        statusPeriodoAssociacao={acoesAssociacao.periodo_status}
                        corIconeFonte={getCorStatusPeriodo(acoesAssociacao.periodo_status)}
                    />
                </>
            }
        </>
    );
};