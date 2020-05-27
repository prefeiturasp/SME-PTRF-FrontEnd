import React from "react";
import "./soma-das-depesas.scss"

export const SomaDasDespesas = ({somaDosTotais}) => {
    return (
        <div className="row">
            <div className="col-12 mt-5">
                <h6 className="mb-3">Soma das Despesas</h6>
                <table className="table table-bordered tabela-soma-das-despesas">
                    <thead>
                    <tr>
                        <th scope="col">Sem filtros aplicados</th>
                        <th scope="col">Filtros aplicados</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{somaDosTotais.total_despesas_sem_filtro && somaDosTotais.total_despesas_sem_filtro.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        })}</td>
                        <td>{somaDosTotais.total_despesas_com_filtro && somaDosTotais.total_despesas_com_filtro.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        })}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}