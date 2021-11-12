import React from "react";

export const TabelaPresentes = ({titulo, listaPresentes}) => {
    return (
        <>
            <p className='titulo-tabela-acoes mt-3'>
                {titulo}
            </p>

            <table className="table table-bordered tabela-acoes">
                <thead>
                    <tr className="tr-titulo-presentes">
                        <th scope="col">Nome e cargo</th>
                        <th scope="col">Assinatura</th>
                    </tr>
                </thead>

                <tbody>

                    {listaPresentes && listaPresentes.length > 0 && listaPresentes.map((presente, index) => 
                        <tr key={`tr-presente-${index}`}>
                            <td><strong>{presente.nome}</strong> <br></br> {presente.cargo}</td>
                            <td></td>
                        </tr>
                    )}
                    
                    
                </tbody>
            </table>
        </>
    )
};