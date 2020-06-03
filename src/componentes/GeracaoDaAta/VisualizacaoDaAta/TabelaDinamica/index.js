import React from "react";

export const TabelaDinamica = ()=> {
    return(
        <>
            <p className='titulo-tabela-acoes mt-5'>
                PTRF Básico
            </p>
            <table className="table table-bordered tabela-acoes">
                <thead>
                <tr className="tr-titulo">
                    <th scope="col"></th>
                    <th scope="col">First</th>
                    <th scope="col">Last</th>
                    <th scope="col">Handle</th>
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
                    <td colSpan="2">Larry the Bird</td>
                    <td>@twitter</td>
                </tr>
                </tbody>
            </table>
        </>
    )
}