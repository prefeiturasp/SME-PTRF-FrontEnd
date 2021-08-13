import React, {memo} from "react";
import "./styles.css";

const TabelaValoresPendentesPorAcao = ({valoresPendentes, valorTemplate}) =>{

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
                    <th scope="row">Saldo reprogramado anterior</th>
                    <td>{valorTemplate(valoresPendentes.saldo_anterior)}</td>
                    <td className='coluna-cinza-escuro'>{valorTemplate(valoresPendentes.saldo_anterior)}</td>
                    <td className='coluna-cinza-escuro'> </td>
                </tr>
                <tr>
                    <th scope="row">Créditos</th>
                    <td>{valorTemplate(valoresPendentes.receitas_total)}</td>
                    <td>{valorTemplate(valoresPendentes.receitas_conciliadas)}</td>
                    <td>{valorTemplate(valoresPendentes.receitas_nao_conciliadas)}</td>
                </tr>
                <tr>
                    <th scope="row">Despesas</th>
                    <td>{valorTemplate(valoresPendentes.despesas_total)}</td>
                    <td>{valorTemplate(valoresPendentes.despesas_conciliadas)}</td>
                    <td>{valorTemplate(valoresPendentes.despesas_nao_conciliadas)}</td>
                </tr>
                <tr>
                    <th scope="row">Saldo reprogramado</th>
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
