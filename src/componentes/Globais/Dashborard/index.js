import React, {useEffect, useState} from "react";
import {DashboardCard} from "./DashboardCard";
import {DashboardCardInfoConta} from "./DashboardCardInfoConta";
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
            <div className="form-row align-items-center mb-3">
                <div className="col-auto my-1">
                    <h2 className="subtitulo-itens-painel-out mb-0">Ações recebidas no período:</h2>
                </div>
                <div className="col-auto my-1">
                    <select
                        value={periodosAssociacao.uuid}
                        onChange={(e) => handleChangePeriodo(e.target.value)}
                        name="periodo"
                        id="periodo"
                        className="form-control"
                    >
                        {periodosAssociacao && periodosAssociacao.map((periodo) =>
                            <option key={periodo.uuid} value={periodo.uuid}>{`${periodo.referencia} - ${periodo.data_inicio_realizacao_despesas ? exibeDataPT_BR(periodo.data_inicio_realizacao_despesas) : "-"} até ${periodo.data_fim_realizacao_despesas ? exibeDataPT_BR(periodo.data_fim_realizacao_despesas) : "-"}`}</option>
                        )}
                    </select>
                </div>


                <div className="col-auto ml-3 my-1">
                    <h2 className="subtitulo-itens-painel-out mb-0">Tipo de conta:</h2>
                </div>

                <div className="col-auto my-1">
                    <select
                        value={tiposConta.uuid}
                        onChange={(e) => handleChangeAcao(e.target.value)}
                        name="periodo"
                        id="periodo"
                        className="form-control"
                    >
                        <option value="">Escolha uma conta</option>
                        <option value="todas_contas">Todas as contas</option>
                        {tiposConta && tiposConta.map((conta) =>
                            <option key={conta.uuid} value={conta.uuid}>{conta.nome}</option>
                        )}
                    </select>
                </div>
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