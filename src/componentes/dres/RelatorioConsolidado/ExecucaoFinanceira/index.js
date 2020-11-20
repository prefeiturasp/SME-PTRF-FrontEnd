import React from "react";

export const ExecucaoFinanceira =({statusRelatorio}) =>{
    console.log("Execucao Financeira ", statusRelatorio)
    return(
        <>
            {statusRelatorio &&
                <div className="row mt-3">
                    <div className="col-12">
                        <h4>Execução Financeira</h4>
                        <div className="col-12">
                            <div className="row mt-3 container-box-prestacao-de-contas-por-periodo pt-4 pb-4">
                                <div className="col-12 col-md-8">
                                    <p className='fonte-14 mb-1'><strong>Demonstrativo da Execução Físico-Financeira</strong></p>
                                    <p className={`fonte-12 mb-1 ${statusRelatorio.status_arquivo === 'Documento pendente de geração' ? 'span-status-NAO_RECEBIDA' : 'span-status-RECEBIDA'}`}>{statusRelatorio.status_arquivo ? statusRelatorio.status_arquivo : ''}</p>
                                </div>
                                <div className="col-12 col-md-4 align-self-center text-right">
                                    <button
                                        type="button"
                                        className="btn btn-outline-success mr-2"
                                        disabled={statusRelatorio.status_geracao !== 'NAO_GERADO'}
                                    >
                                        Previa
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-success"
                                        disabled={statusRelatorio.status_geracao === 'NAO_GERADO'}
                                    >
                                        Visualizar ata
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }

        </>
    )
};