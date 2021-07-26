import React from "react";
import "./soma-dos-creditos.scss"

export const SomaDosCreditos = ({somaDosTotais}) => {
    return (
        <div className="row">
            <div className="col-12 mt-5">
                <h6 className="mb-3">Soma dos Créditos</h6>
                <table className="table table-bordered tabela-soma-dos-creditos">
                    <thead>
                        <tr>
                            <th scope="col">Sem filtros aplicados</th>
                            <th scope="col">Filtros aplicados</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>{somaDosTotais.total_receitas_sem_filtro && somaDosTotais.total_receitas_sem_filtro.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            })}</td>
                            <td>{somaDosTotais.total_receitas_com_filtro && somaDosTotais.total_receitas_com_filtro.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            })}</td>
                        </tr>
                    </tbody>

                </table>
            </div>
        </div>
    )
};