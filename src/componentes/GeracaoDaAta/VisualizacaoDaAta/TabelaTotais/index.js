import React from "react";

export const TabelaTotais = ()=>{
    return(
        <>
            <p className='titulo-tabela-acoes mt-5'>
                Totais
            </p>
            <table className="table table-bordered tabela-totais">
                <thead>
                <tr className="tr-titulo">
                    <th scope="col"></th>
                    <th scope="col">Custeio (R$)</th>
                    <th scope="col">Capital (R$)</th>
                    <th scope="col">Total (R$)</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>1</td>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                </tr>
                <tr>
                    <td>3</td>
                    <td>Larry the Bird</td>
                    <td>@twitter</td>
                    <td>Thornton</td>
                </tr>
                </tbody>
            </table>
        </>
    )
}