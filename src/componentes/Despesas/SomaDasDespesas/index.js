import React from "react";
import "./soma-das-depesas.scss"

export const SomaDasDespesas = () => {

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
                        <td>1</td>
                        <td>Mark</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}