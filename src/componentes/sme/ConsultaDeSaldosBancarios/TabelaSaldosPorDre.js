import React from "react";

export const TabelaSaldosPorDre = ({saldosPorDre, valorTemplate})=>{

    return(
        <>
            {saldosPorDre && saldosPorDre.length > 0 ? (
                    <table className="table table-bordered mt-4">
                        <thead>
                        <tr className='linha-cinza'>
                            <th scope="col">Diretoria</th>
                            <th scope="col">Nº de unidades</th>
                            <th scope="col">Nº de unidades informadas</th>
                            <th scope="col">Saldo bancário informado</th>
                        </tr>
                        </thead>
                        <tbody>
                        {saldosPorDre && saldosPorDre.length > 0 && saldosPorDre.map((item, index)=>(
                            <tr key={index}>
                                <td>{item.nome_dre}</td>
                                <td>{item.total_unidades} unidades</td>
                                <td>{item.qtde_dre_informadas} unidades</td>
                                <td><strong>{item.saldo_bancario_informado ? valorTemplate(item.saldo_bancario_informado) : 0}</strong></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
            ):
                <p className='mt-4'><strong>Não foram encontrados resultados, tente novamente</strong></p>
            }
        </>
    )
};