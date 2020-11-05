import React from "react";

export const TabelaExecucaoFisica = ({itensDashboard, retornaQtdePorStatus, retornaNaoApresentadas}) => {
    console.log("TabelaExecucaoFisica ", itensDashboard)
    return(
        <>
            {itensDashboard &&
            <div className='row mt-2'>
                <div className='col-12'>
                    <p className='titulo-execucao-fisica pt-3 border-top'>Execução Física</p>
                    <p className='sub-titulo-execucao-fisica'>Prestação de contas das Associações</p>

                    <table className="table table-bordered tabela-execucao-fisica">
                        <thead>
                        <tr className='tr-titulo'>
                            <th scope="col">Aprovadas</th>
                            <th scope="col">Aprovadas com ressalvas</th>
                            <th scope="col">Em análise</th>
                            <th scope="col">Não apresentadas</th>
                            <th scope="col">Não aprovadas</th>
                            <th scope="col">Devidas <small>(Não apresentadas + não aprovadas)</small></th>
                            <th scope="col">Total</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{retornaQtdePorStatus('APROVADA')}</td>
                            <td>{retornaQtdePorStatus('APROVADA_RESSALVA')}</td>
                            <td>{retornaQtdePorStatus('EM_ANALISE')}</td>
                            <td>{retornaNaoApresentadas()}</td>
                            <td>{retornaQtdePorStatus('REPROVADA')}</td>
                            <td>{retornaNaoApresentadas() + retornaQtdePorStatus('REPROVADA')}</td>
                            <td>{itensDashboard.total_associacoes_dre}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            }
        </>
    )
};