import React from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload, faTrash, faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import "./central-de-downloads.scss"
import ReactTooltip from "react-tooltip";
import moment from "moment";


export const TabelaDownloads = ({listaArquivos, downloadArquivo, excluirArquivo, marcarDesmarcarLido}) => {

    const opcoesStatus = (status) => {
        if(status == "ERRO"){
            return "Erro"
        }
        else if(status == "EM_PROCESSAMENTO"){
            return "Em processamento"
        }
        else if(status == "CONCLUIDO"){
            return "Concluído"
        }
    }

    const vistoTemplate = (rowData) => {
        return (
            <div className="align-middle text-center">
                {rowData.status == 'EM_PROCESSAMENTO' ? (
                    
                    <span style={{fontSize: "16pt"}}>-</span>

                ):
                    
                    <input
                        checked={rowData.lido}
                        type="checkbox"
                        onChange={(e) => marcarDesmarcarLido(e, rowData.uuid)}
                        name="checkConferido"
                        id="checkConferido"
                    />
                }
                
            </div>
        )
    };

    const acoesTemplate = (rowData) => {
        return (
            <div className="align-middle text-center">
                {rowData.status == 'EM_PROCESSAMENTO' ? (
                     <span style={{fontSize: "16pt"}}>-</span>
                ):
                    <>

                        {rowData.status != 'ERRO' ? (
                            <button className="btn btn-link" onClick={(e)=> {downloadArquivo(rowData.identificador, rowData.uuid)}}>
                                <FontAwesomeIcon
                                    style={{marginRight: "0", color: '#00585E'}}
                                    icon={faDownload}
                                />
                            </button>
                            ): null
                        }
                        

                        <button className="btn btn-link" onClick={(e) => {excluirArquivo(rowData.uuid)}} >
                            <FontAwesomeIcon
                                style={{marginRight: "0", color: '#B40C02'}}
                                icon={faTrash}
                            />
                        </button>
                    </>
                }

                
            </div>
        )
    }

    const ultimaAtualizacaoTemplate = (rowData) => {
        return (
            <div className="align-middle text-center">
                {rowData.status == 'EM_PROCESSAMENTO' ? (
                     <span style={{fontSize: "16pt"}}>-</span>
                ):
                    
                    
                    <span>{moment(rowData.alterado_em).format('DD/MM/YYYY [às] HH:mm')}</span>
                    
                    
                }
            </div>
        )
    }

    const statusTemplate = (rowData) => {
        return (
            <div className="align-middle text-center">
                
                {rowData.status == 'ERRO' ? (
                    
                    <div data-tip={rowData.msg_erro} data-html={true}>
                        <span>
                            
                            {opcoesStatus(rowData.status)}
                        </span>
                        <FontAwesomeIcon
                            style={{fontSize: '18px', marginLeft: "3px", color:'#B40C02'}}
                            icon={faInfoCircle}
                        />
                        <ReactTooltip/>
                    </div>
                    
                ):
                    <>
                        {opcoesStatus(rowData.status)}
                    </>
                    
                }
            </div>
        )
    }

    const rowClassName = (rowData) => {
        if (rowData.lido){
            return {'marcado-como-lido': true}
        }
    }


    return (
        <div className="row mt-4">
            <div className="col-12">
                <p className="quantidade-arquivos">Exibindo <strong>{listaArquivos.length}</strong> cargas de arquivos</p>
            </div>
            <div className="col-12">
                <div className="datatable-responsive-demo">
                <DataTable
                        value={listaArquivos}
                        className='p-datatable-responsive-demo teste2'
                        rowClassName={rowClassName}
                    >
                        
                        <Column 
                            field="identificador" 
                            header="Identificador"
                            style={{width: '20em'}}
                            className="align-middle text-center borda-coluna"
                        />
                        <Column 
                            field="status" 
                            header="Status"
                            body={statusTemplate}
                            className="align-middle text-center borda-coluna"
                            style={{width: '10em'}}
                        />
                        <Column 
                            field="ultima_atualizacao" 
                            header="Ultima atualização"
                            body={ultimaAtualizacaoTemplate}
                            style={{width: '15em'}}
                            className="align-middle text-center borda-coluna"
                        />
                        <Column
                            field="visto" 
                            header="Visto"
                            className='align-middle text-center borda-coluna'
                            body={vistoTemplate}
                            style={{width: '5em'}}
                            
                            
                        />
                        <Column 
                            field="acoes" 
                            header="Ações"
                            body={acoesTemplate}
                            style={{width: '8em'}}
                            className="align-middle text-center borda-coluna"
                        />

                    
                    </DataTable>
                </div>
            </div>
        </div>
        
    )
}