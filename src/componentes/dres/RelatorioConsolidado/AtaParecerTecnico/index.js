import React from "react";
import './ata-parecer-tecnico.scss';
import { exibeDateTimePT_BR_Ata } from "../../../../utils/ValidacoesAdicionaisFormularios";


export const AtaParecerTecnico = ({ataParecerTecnico, onClickVerAta}) => {
    let classeMensagem = ataParecerTecnico.alterado_em === null ? "ata-nao-preenchida" : "ata-preenchida";
    let mensagem = ataParecerTecnico.alterado_em === null ? "Ata não preenchida" : "Último preenchimento em " + exibeDateTimePT_BR_Ata(ataParecerTecnico.alterado_em);

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
                            >
                                Visualizar ata
                            </button>
                        </div>
                    </div>

                    <div className="row container-corpo-ata-parecer-tecnico ml-0 mr-0">
                        <div className="col-12 pt-2 pl-2 pr-2 pb-0">
                            <p className='fonte-14 mb-1'><strong>Ata de apresentação de Parecer Técnico Conclusivo</strong></p>
                            <p className={`fonte-12 mb-2 ${classeMensagem}`}>
                                <span>
                                    {mensagem}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                

            </div>
        </>
    )
}