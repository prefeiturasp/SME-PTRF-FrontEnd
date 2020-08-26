import React, {useEffect, useState} from "react";
import {DashboardCard} from "./DashboardCard";
import {getPeriodosNaoFuturos} from "../../../services/escolas/PrestacaoDeContas.service";
import {getAcoesAssociacao, getAcoesAssociacaoPorPeriodo} from "../../../services/Dashboard.service";
import {exibeDataPT_BR, getCorStatusPeriodo, getTextoStatusPeriodo} from "../../../utils/ValidacoesAdicionaisFormularios";
import Loading from "../../../utils/Loading";
import {BarraDeStatusPeriodoAssociacao} from "./BarraDeStatusPeriodoAssociacao";

export const Dashboard = () => {
    const [acoesAssociacao, setAcoesAssociacao] = useState({});
    const [periodosAssociacao, setPeriodosAssociacao] = useState(false);
    const [loading, setLoading] = useState(true);

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

    const handleChangePeriodo = async (value) => {
        setLoading(true);
        if (value) {
            let acoesPorPeriodo = await getAcoesAssociacaoPorPeriodo(value);
            setAcoesAssociacao(acoesPorPeriodo);
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
                        //defaultValue=""
                        onChange={(e) => handleChangePeriodo(e.target.value)}
                        name="periodo"
                        id="periodo"
                        className="form-control"
                    >
                        {periodosAssociacao && periodosAssociacao.map((periodo) =>
                            <option key={periodo.uuid}
                                    value={periodo.uuid}>{`${periodo.referencia} - ${periodo.data_inicio_realizacao_despesas ? exibeDataPT_BR(periodo.data_inicio_realizacao_despesas) : "-"} até ${periodo.data_fim_realizacao_despesas ? exibeDataPT_BR(periodo.data_fim_realizacao_despesas) : "-"}`}</option>
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
                    <DashboardCard
                        acoesAssociacao={acoesAssociacao}
                        statusPeriodoAssociacao={acoesAssociacao.periodo_status}
                    />
                </>
            }


        </>
    );
}