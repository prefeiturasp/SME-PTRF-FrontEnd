import React from "react";

export const TabelaSaldosPorUeDre = ({saldosPorUeDre, valorTemplate, retornaTituloCelulasTabelaSaldosPorUeDre, acoesTemplate})=>{

    return(
        <>
            {saldosPorUeDre && saldosPorUeDre.length > 0 ? (
                <div className="table-responsive">
                    <table className="table table-bordered mt-4">
                        <thead>
                        <tr className='linha-cinza'>
                            {retornaTituloCelulasTabelaSaldosPorUeDre()}
                        </tr>
                        </thead>
                        <tbody>
                        {saldosPorUeDre && saldosPorUeDre.length > 0 && saldosPorUeDre.map((item, index)=>(
                            <tr key={index}>
                                <td><strong>{item.sigla_dre}</strong></td>
                                {item.associacoes.map((associacao)=>(
                                    <td key={associacao.associacao}>{associacao.saldo_total ? valorTemplate(associacao.saldo_total) : '-'}</td>
                                ))}
                                <td><strong>{acoesTemplate(item.uuid_dre)}</strong></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ):
                <p className='mt-4'><strong>Não foram encontrados resultados, tente novamente</strong></p>
            }
        </>
    )
};