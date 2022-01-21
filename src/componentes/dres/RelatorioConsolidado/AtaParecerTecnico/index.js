import React from "react";
import './ata-parecer-tecnico.scss';
import { exibeDateTimePT_BR_Ata } from "../../../../utils/ValidacoesAdicionaisFormularios";


export const AtaParecerTecnico = ({ataParecerTecnico, onClickVerAta, disablebtnVisualizarAta}) => {
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

    return (
        <>
            <div className="row mt-3">
                <div className="col-12">
                    <div className="row container-titulo-ata-parecer-tecnico ml-0 mr-0">
                        <div className="col-10 align-self-center">
                            <span className="titulo-ata-parecer-tecnico">Atas de Parecer Técnico Conclusivo</span>
                        </div>

                        <div className="col-2 p-2 align-self-center text-right">
                            <button
                                onClick={() => onClickVerAta(ataParecerTecnico.uuid)}
                                type="button"
                                className="btn btn-success"
                                disabled={disablebtnVisualizarAta}
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
                            </p>
                        </div>
                    </div>
                </div>

                

            </div>
        </>
    )
}