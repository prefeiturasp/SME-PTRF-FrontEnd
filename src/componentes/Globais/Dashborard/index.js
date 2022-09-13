import React, {useCallback, useEffect, useState} from "react";
import {DashboardCard} from "./DashboardCard";
import {DashboardCardInfoConta} from "./DashboardCardInfoConta";
import {SelectPeriodo} from "./SelectPeriodo";
import {SelectConta} from "./SelectConta";
import {getPeriodosAteAgoraForaImplantacaoDaAssociacao, getStatusPeriodoPorData} from "../../../services/escolas/PrestacaoDeContas.service";
import {getAcoesAssociacao, getAcoesAssociacaoPorPeriodoConta, getTabelas} from "../../../services/Dashboard.service";
import {exibeDataPT_BR, getCorStatusPeriodo} from "../../../utils/ValidacoesAdicionaisFormularios";
import Loading from "../../../utils/Loading";
import {BarraDeStatusPeriodoAssociacao} from "./BarraDeStatusPeriodoAssociacao";
import "./dashboard.scss"
import {ASSOCIACAO_UUID} from "../../../services/auth.service";
import {visoesService} from "../../../services/visoes.service";
import {getPeriodosDePrestacaoDeContasDaAssociacao} from "../../../services/escolas/Associacao.service";

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

    const buscaListaAcoesAssociacao = useCallback(async () => {
        const listaAcoes = await getAcoesAssociacao(uuid_associacao);
        setAcoesAssociacao(listaAcoes);
        setLoading(false);
    }, [uuid_associacao]);

    const buscaPeriodos = useCallback(async () => {
        let periodos = await getPeriodosAteAgoraForaImplantacaoDaAssociacao(uuid_associacao);
        setSelectPeriodo(periodos[0].uuid)
        setPeriodosAssociacao(periodos);
    }, []);

    useEffect(() => {
        buscaListaAcoesAssociacao();
    }, [buscaListaAcoesAssociacao]);

    useEffect(() => {
        buscaPeriodos();
    }, [buscaPeriodos]);


    const carregaAcoesAssociacaoPorPeriodo = useCallback(async ()=>{
        if (selectPeriodo) {
            let acoesPorPeriodo = await getAcoesAssociacaoPorPeriodoConta(uuid_associacao, selectPeriodo);
            setAcoesAssociacao(acoesPorPeriodo);
        }
    }, [uuid_associacao, selectPeriodo])

    useEffect(() => {
        carregaAcoesAssociacaoPorPeriodo();
    }, [carregaAcoesAssociacaoPorPeriodo]);


    useEffect(() => {
        const carregaTabelas = async () => {
            let tabela =  await getTabelas(uuid_associacao);
            setTiposConta(tabela.contas_associacao);
        };
        carregaTabelas()
    }, [uuid_associacao]);


    useEffect(()=>{
        const getStatus = async () =>{
            if (acoesAssociacao && acoesAssociacao.data_inicio_realizacao_despesas){
                let data_inicial = acoesAssociacao.data_inicio_realizacao_despesas;
                let status = await getStatusPeriodoPorData(uuid_associacao, data_inicial);
                setStatusPeriodoAssociacao(status)
            }
        };
        getStatus();
    }, [uuid_associacao, acoesAssociacao]);


    const handleChangePeriodo = async (periodo_uuid) => {
        setLoading(true);
        setSelectPeriodo(periodo_uuid);
        if (periodo_uuid) {
            let acoesPorPeriodo = await getAcoesAssociacaoPorPeriodoConta(uuid_associacao, periodo_uuid, selectConta);
            setAcoesAssociacao(acoesPorPeriodo);
        }
        setLoading(false);
    };

    const handleChangeConta = async (conta_associacao_uuid) => {
        setLoading(true);
        setSelectConta(conta_associacao_uuid);
        let acoesPorConta =  await getAcoesAssociacaoPorPeriodoConta(uuid_associacao, selectPeriodo, conta_associacao_uuid);
        setAcoesAssociacao(acoesPorConta);
        setLoading(false);
    };


    const getCorSaldo = (valor_saldo) => {
        return valor_saldo < 0 ? "texto-cor-vermelha" : "texto-cor-verde"
    };

    const getCssDestaque = (tamanho_margin_bottom= 1, statusPeriodoAssociacao) =>{
        if (statusPeriodoAssociacao && statusPeriodoAssociacao.aceita_alteracoes){
            return `pt-1 mb-${tamanho_margin_bottom} texto-com-icone-amarelo`
        }else {
            return `pt-1 mb-${tamanho_margin_bottom}`
        }
    }

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
                        getCorSaldo={getCorSaldo}
                        getCssDestaque={getCssDestaque}
                        statusPeriodoAssociacao={statusPeriodoAssociacao}
                    />
                    <DashboardCard
                        acoesAssociacao={acoesAssociacao}
                        getCorSaldo={getCorSaldo}
                        getCssDestaque={getCssDestaque}
                        statusPeriodoAssociacao={statusPeriodoAssociacao}
                    />
                </>
            }
        </>
    );
};