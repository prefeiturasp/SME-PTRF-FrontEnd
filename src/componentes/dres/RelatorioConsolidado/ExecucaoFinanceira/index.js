import React from "react";
import Spinner from "../../../../assets/img/spinner.gif"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faDownload} from '@fortawesome/free-solid-svg-icons'

export const ExecucaoFinanceira =({statusRelatorio, textoBtnRelatorio, gerarPrevia, downloadPreviaRelatorio, downloadRelatorio}) =>{
    const emProcessamento = statusRelatorio.status_geracao === 'EM_PROCESSAMENTO'
    let classeMensagem = "documento-gerado";
    if (statusRelatorio.status_geracao === 'NAO_GERADO') {
        classeMensagem = "documento-pendente"
    }
    if (statusRelatorio.status_geracao === 'EM_PROCESSAMENTO') {
        classeMensagem = "documento-processando"
    }

    const relatorioGerado = (status) => {
        if(status === "GERADO_PARCIAL" || status === "GERADO_TOTAL"){
            return true;
        }

        return false;
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
                                    <p className={`fonte-12 mb-1 ${classeMensagem}`}>
                                        <span>
                                            {statusRelatorio.status_arquivo ? statusRelatorio.status_arquivo : ''} {emProcessamento ? <img src={Spinner} style={{height: "22px"}}/> : ''}
                                        </span>

                                        {relatorioGerado(statusRelatorio.status_geracao) &&  statusRelatorio.versao === "PREVIA" ?
                                            <button className='btn-editar-membro'
                                                type='button'
                                                
                                                >
                                                <FontAwesomeIcon
                                                    onClick={() => downloadPreviaRelatorio()}
                                                    style={{fontSize: '18px'}}
                                                    icon={faDownload}
                                                />
                                            </button>
                                        :
                                            null
                                        } 

                                        
                                    </p>

                                    
                                </div>
                                <div className="col-12 col-md-4 align-self-center text-right">
                                    {statusRelatorio.versao !== "FINAL" &&
                                        <button
                                            onClick={() => gerarPrevia()}
                                            type="button"
                                            className="btn btn-outline-success mr-2"
                                            disabled={
                                                statusRelatorio.status_geracao === 'EM_PROCESSAMENTO'
                                            }
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
                                            statusRelatorio.status_geracao === 'EM_PROCESSAMENTO' ||
                                            statusRelatorio.versao === 'PREVIA'
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