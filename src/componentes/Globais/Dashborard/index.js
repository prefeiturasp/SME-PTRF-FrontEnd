import React, {useEffect, useState} from "react";
import {DashboardCard} from "./DashboardCard";
import {DashboardCardInfoConta} from "./DashboardCardInfoConta";
import {SelectPeriodo} from "./SelectPeriodo";
import {SelectConta} from "./SelectConta";
import {getPeriodosNaoFuturos, getStatusPeriodoPorData} from "../../../services/escolas/PrestacaoDeContas.service";
import {getAcoesAssociacao, getAcoesAssociacaoPorPeriodo, getAcoesAssociacaoPorConta, getTabelas} from "../../../services/Dashboard.service";
import {exibeDataPT_BR, getCorStatusPeriodo} from "../../../utils/ValidacoesAdicionaisFormularios";
import Loading from "../../../utils/Loading";
import {BarraDeStatusPeriodoAssociacao} from "./BarraDeStatusPeriodoAssociacao";
import "./dashboard.scss"
import {ASSOCIACAO_UUID} from "../../../services/auth.service";
import {visoesService} from "../../../services/visoes.service";

export const Dashboard = () => {
    let uuid_associacao;
    let visao_selecionada = visoesService.getItemUsuarioLogado('visao_selecionada.nome');

    if (visao_selecionada === "UE"){
        uuid_associacao = localStorage.getItem(ASSOCIACAO_UUID);
    }else if (visao_selecionada === "DRE"){
        let dadosDaAssociacao = JSON.parse(localStorage.getItem("DADOS_DA_ASSOCIACAO"));
        uuid_associacao = dadosDaAssociacao.dados_da_associacao.uuid;
    }

    const [acoesAssociacao, setAcoesAssociacao] = useState({});
    const [periodosAssociacao, setPeriodosAssociacao] = useState(false);
    const [loading, setLoading] = useState(true);
    const [tiposConta, setTiposConta] = useState([]);
    const [statusPeriodoAssociacao, setStatusPeriodoAssociacao] = useState(false);
    // Lógica para "zerar" o select de Contas e Periodos
    const [selectConta, setSelectConta] = useState(false);
    const [selectPeriodo, setSelectPeriodo] = useState(false);

    useEffect(() => {
        buscaPeriodos();
        buscaListaAcoesAssociacao();
    }, []);

    useEffect(() => {
        const carregaTabelas = async () => {
            let tabela =  await getTabelas(uuid_associacao);
            setTiposConta(tabela.contas_associacao);
        };
        carregaTabelas()
    }, []);

    useEffect(()=>{
        const getStatus = async () =>{
            if (acoesAssociacao && acoesAssociacao.data_inicio_realizacao_despesas){
                let data_inicial = acoesAssociacao.data_inicio_realizacao_despesas;
                let status = await getStatusPeriodoPorData(data_inicial);
                setStatusPeriodoAssociacao(status)
            }
        };
        getStatus();
    }, [acoesAssociacao]);

    const buscaPeriodos = async () => {
        let periodos = await getPeriodosNaoFuturos();
        setPeriodosAssociacao(periodos);
    };

    const buscaListaAcoesAssociacao = async () => {
        const listaAcoes = await getAcoesAssociacao(uuid_associacao);
        setAcoesAssociacao(listaAcoes);
        setLoading(false);
    };

    const handleChangePeriodo = async (value) => {
        setLoading(true);
        setSelectPeriodo(false);
        if (value) {
            let acoesPorPeriodo = await getAcoesAssociacaoPorPeriodo(uuid_associacao, value);
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
            let acoesPorConta =  await getAcoesAssociacaoPorConta(uuid_associacao, value);
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
                        statusPeriodoAssociacao={statusPeriodoAssociacao}
                    />
                    <DashboardCardInfoConta
                        acoesAssociacao={acoesAssociacao}
                        corIconeFonte={getCorStatusPeriodo(acoesAssociacao.periodo_status)}
                    />
                    <DashboardCard
                        acoesAssociacao={acoesAssociacao}
                        corIconeFonte={getCorStatusPeriodo(acoesAssociacao.periodo_status)}
                    />
                </>
            }
        </>
    );
};