import React from "react";
import './ata-parecer-tecnico.scss';
import { exibeDateTimePT_BR_Ata } from "../../../../utils/ValidacoesAdicionaisFormularios";
import Spinner from "../../../../assets/img/spinner.gif"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faDownload} from '@fortawesome/free-solid-svg-icons'


export const AtaParecerTecnico = ({ataParecerTecnico, onClickVerAta, disablebtnVisualizarAta, downloadAtaParecerTecnico, handleClickGerarAta, disablebtnGerarAta}) => {
    const mensagem = (ata) => {
        if(ata.uuid === undefined){
            return "Documento pendente de geração";        
        }
        else if(ata.uuid && ata.alterado_em){
            return "Último preenchimento em " + exibeDateTimePT_BR_Ata(ata.alterado_em);
        }
        else if(ata.uuid && ata.alterado_em === null){
            return "Ata não preenchida";
        }
    }

    const classeMensagem = (ata) => {
        if(ata.uuid === undefined || ata.alterado_em === null){
            return "ata-nao-preenchida"       
        }
        else if(ata.uuid && ata.alterado_em){
            return "ata-preenchida"
        }
    }

    const emProcessamento = (ata) => {
        if(ata && ata.status_geracao_pdf && ata.status_geracao_pdf === "EM_PROCESSAMENTO"){
            return true;
        }

        return false;
    }

    const mensagemGeracao = (ata) => {
        if(ata.status_geracao_pdf === "EM_PROCESSAMENTO"){
            return (
                <span className="ml-2 documento-processando">
                    Gerando ata em PDF. Aguarde <img src={Spinner} style={{height: "22px"}} alt=""/>  
                </span>
            )
        }
    }

    return (
        <>
            <div className="row mt-3">
                <div className="col-12">
                    <div className="row container-titulo-ata-parecer-tecnico ml-0 mr-0">
                        <div className="col-8 align-self-center">
                            <span className="titulo-ata-parecer-tecnico">Atas de Parecer Técnico Conclusivo</span>
                        </div>

                        <div className="col-4 p-2 align-self-center text-right">
                            {ataParecerTecnico && ataParecerTecnico.alterado_em &&
                                <button
                                    onClick={handleClickGerarAta} 
                                    type="button"
                                    className="btn btn-success mr-2"
                                    disabled={disablebtnGerarAta || emProcessamento(ataParecerTecnico)}
                                >
                                    Gerar Ata
                                </button>
                            }

                            <button
                                onClick={() => onClickVerAta(ataParecerTecnico.uuid)}
                                type="button"
                                className="btn btn-success"
                                disabled={disablebtnVisualizarAta || emProcessamento(ataParecerTecnico)}
                            >
                                Visualizar ata
                            </button>
                        </div>
                    </div>

                    <div className="row container-corpo-ata-parecer-tecnico ml-0 mr-0">
                        <div className="col-12 pt-2 pl-2 pr-2 pb-0">
                            <p className='fonte-14 mb-1'><strong>Ata de apresentação de Parecer Técnico Conclusivo</strong></p>
                            <p className={`fonte-12 mb-2 ${classeMensagem(ataParecerTecnico)}`}>
                                <span>
                                    {mensagem(ataParecerTecnico)} 
                                </span>

                                <>
                                    {emProcessamento(ataParecerTecnico)
                                        ?
                                            mensagemGeracao(ataParecerTecnico)
                                        :
                                            ataParecerTecnico.arquivo_pdf && 
                                                <button className='btn-editar-membro'
                                                    type='button'
                                                >
                                                    <FontAwesomeIcon
                                                        onClick={() => downloadAtaParecerTecnico()}
                                                        style={{fontSize: '18px'}}
                                                        icon={faDownload}
                                                    />
                                                </button>       
                                    }
                                </>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}