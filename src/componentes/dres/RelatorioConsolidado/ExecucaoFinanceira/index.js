import React from "react";
import Spinner from "../../../../assets/img/spinner.gif"

export const ExecucaoFinanceira =({statusRelatorio, textoBtnRelatorio, downloadPreviaRelatorio, downloadRelatorio}) =>{
    const emProcessamento = statusRelatorio.status_geracao === 'EM_PROCESSAMENTO'
    let classeMensagem = "documento-gerado";
    if (statusRelatorio.status_geracao === 'NAO_GERADO') {
        classeMensagem = "documento-pendente"
    }
    if (statusRelatorio.status_geracao === 'EM_PROCESSAMENTO') {
        classeMensagem = "documento-processando"
    }
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
                                    <p className={`fonte-12 mb-1 ${classeMensagem}`}>{statusRelatorio.status_arquivo ? statusRelatorio.status_arquivo : ''} {emProcessamento ? <img src={Spinner} style={{height: "22px"}}/> : ''}</p>
                                </div>
                                <div className="col-12 col-md-4 align-self-center text-right">
                                    {   statusRelatorio.status_geracao === 'NAO_GERADO' &&
                                        <button
                                            onClick={() => downloadPreviaRelatorio()}
                                            type="button"
                                            className="btn btn-outline-success mr-2"
                                            disabled={statusRelatorio.status_geracao !== 'NAO_GERADO'}
                                        >
                                            Prévia
                                        </button>
                                    }
                                    <button
                                        onClick={()=>downloadRelatorio()}
                                        type="button"
                                        className="btn btn-success"
                                        disabled={
                                            statusRelatorio.status_geracao === 'NAO_GERADO' ||
                                            statusRelatorio.status_geracao === 'EM_PROCESSAMENTO'
                                        }
                                    >
                                        {textoBtnRelatorio()}
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