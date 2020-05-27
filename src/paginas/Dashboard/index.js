import React, {useEffect, useState} from 'react'
import {PaginasContainer} from '../PaginasContainer'
import {Dashboard} from '../../componentes/Dashborard'
import {getAcoesAssociacao,getAcoesAssociacaoPorPeriodo} from '../../services/Dashboard.service'
import {exibeDataPT_BR, getCorStatusPeriodo, getTextoStatusPeriodo,} from '../../utils/ValidacoesAdicionaisFormularios'
import {BarraDeStatusPeriodoAssociacao} from '../../componentes/Dashborard/BarraDeStatusPeriodoAssociacao'
import {getPeriodos} from "../../services/PrestacaoDeContas.service";
import Loading from "../../utils/Loading";

export const DashboardPage = () => {
    const [acoesAssociacao, setAcoesAssociacao] = useState({})
    const [periodosAssociacao, setPeriodosAssociacao] = useState(false);
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        setLoading(true)
        buscaListaAcoesAssociacao()
        setLoading(false)
    }, [])

    const buscaListaAcoesAssociacao = async () => {
        let periodos = await getPeriodos();
        //console.log("carregaPeriodos ", periodos)

        setPeriodosAssociacao(periodos);
        const listaAcoes = await getAcoesAssociacao();
        console.log("buscaListaAcoesAssociacao ", listaAcoes)
        setAcoesAssociacao(listaAcoes)

    }

    const handleChangePeriodo = async (value) => {
        setLoading(true)
        console.log("handleChangePeriodo ", value)

        let acoesPorPeriodo = await getAcoesAssociacaoPorPeriodo(value)
        console.log("acoesPorPeriodo ", acoesPorPeriodo)
        setAcoesAssociacao(acoesPorPeriodo)
        setLoading(false)

    }

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Painel</h1>
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
                        <option value="">Escolha um período</option>
                        {periodosAssociacao && periodosAssociacao.map((periodo)=>
                            <option key={periodo.uuid} value={periodo.uuid}>{`${periodo.referencia} - ${periodo.data_inicio_realizacao_despesas ? exibeDataPT_BR(periodo.data_inicio_realizacao_despesas) : "-"} até ${periodo.data_fim_realizacao_despesas ? exibeDataPT_BR(periodo.data_fim_realizacao_despesas) : "-"}`}</option>
                        )}
                    </select>
                </div>

            </div>

            <BarraDeStatusPeriodoAssociacao
                statusPeriodoAssociacao={acoesAssociacao.periodo_status}
                corBarraDeStatusPeriodoAssociacao={getCorStatusPeriodo(
                    acoesAssociacao.periodo_status
                )}
                textoBarraDeStatusPeriodoAssociacao={getTextoStatusPeriodo(
                    acoesAssociacao.periodo_status
                )}
            />
            {loading ? (
                <Loading
                    corGrafico="black"
                    corFonte="dark"
                    marginTop="0"
                    marginBottom="0"
                />
            ) :
                <div className="page-content-inner bg-transparent p-0">
                    <Dashboard acoesAssociacao={acoesAssociacao}/>
                </div>
            }


        </PaginasContainer>
    )
}
