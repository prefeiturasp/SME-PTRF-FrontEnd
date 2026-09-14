import React, {memo} from "react";
import "./styles.css";
import { useRecursoSelecionadoContext } from "../../../../../context/RecursoSelecionado";

const TabelaValoresPendentesPorAcao = ({valoresPendentes, valorTemplate}) => {
    const { recursoSelecionado } = useRecursoSelecionadoContext();
    const existeSaldoReprogramado = recursoSelecionado?.existe_saldo_reprogramado;

    return(
        <>
            <p className="detalhe-das-prestacoes-titulo-lancamentos">Quadro resumo</p>
            <table className="table table-bordered">
                <thead>
                <tr className='cabecalho-cinza-claro'>
                    <th scope="col"> </th>
                    <th scope="col">Total (R$)</th>
                    <th scope="col">Conciliado (R$)</th>
                    <th scope="col">À conciliar (R$)</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <th scope="row">
                        { existeSaldoReprogramado ? 'Saldo reprogramado anterior' : 'Saldo anterior' }
                    </th>
                    <td>{valorTemplate(valoresPendentes.saldo_anterior)}</td>
                    <td className='coluna-cinza-escuro'>{valorTemplate(valoresPendentes.saldo_anterior_conciliado)}</td>
                    <td className='coluna-cinza-escuro'>{valorTemplate(valoresPendentes.saldo_anterior_nao_conciliado)}</td>
                </tr>
                <tr>
                    <th scope="row">Créditos</th>
                    <td>{valorTemplate(valoresPendentes.receitas_total)}</td>
                    <td className='coluna-cinza-escuro'>{valorTemplate(valoresPendentes.receitas_conciliadas)}</td>
                    <td className='coluna-cinza-escuro'></td>
                </tr>
                <tr>
                    <th scope="row">Despesas</th>
                    <td>{valorTemplate(valoresPendentes.despesas_total)}</td>
                    <td>{valorTemplate(valoresPendentes.despesas_conciliadas)}</td>
                    <td>{valorTemplate(valoresPendentes.despesas_nao_conciliadas)}</td>
                </tr>
                <tr>
                    <th scope="row">
                        { existeSaldoReprogramado ? 'Saldo reprogramado' : 'Saldo' }
                    </th>
                    <td>{valorTemplate(valoresPendentes.saldo_posterior_total)}</td>
                    <td>{valorTemplate(valoresPendentes.saldo_posterior_conciliado)}</td>
                    <td>{valorTemplate(valoresPendentes.saldo_posterior_nao_conciliado)}</td>
                </tr>
                </tbody>
            </table>
        </>
    )
};
export default memo(TabelaValoresPendentesPorAcao)
