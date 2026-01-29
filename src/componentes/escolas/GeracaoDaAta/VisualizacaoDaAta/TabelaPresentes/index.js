import React from "react";

export const TabelaPresentes = ({titulo, listaPresentes}) => {
    return (
        <>
            {titulo &&
                <p className='titulo-tabela-acoes mt-3'>{titulo}</p>
            }
            <table className="table table-bordered tabela-acoes">
                <thead>
                    <tr className="tr-titulo-presentes">
                        <th scope="col">Nome e cargo</th>
                        <th scope="col">Assinatura</th>
                    </tr>
                </thead>

                <tbody>
                    {listaPresentes && listaPresentes.length > 0
                        ?
                            listaPresentes.map((presente, index) => {
                                const cargoComProfessor = presente.professor_gremio 
                                    ? (presente.cargo ? `${presente.cargo} / Professor Orientador` : '')
                                    : presente.cargo;
                                return (
                                    <tr key={`tr-presente-${index}`}>
                                        <td><strong>{presente.nome}</strong> {cargoComProfessor && <><br></br> {cargoComProfessor}</>}</td>
                                        <td>{!presente.presente && presente.membro ? "Ausente" : ""}</td>
                                    </tr>
                                );
                            })
                        :
                            <tr>
                                <td><strong></strong> <br></br></td>
                                <td></td>
                            </tr>
                    }
                </tbody>
            </table>
        </>
    )
};