import React from "react";
import './ata-parecer-tecnico.scss';
import { exibeDateTimePT_BR_Ata } from "../../../../utils/ValidacoesAdicionaisFormularios";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faDownload} from '@fortawesome/free-solid-svg-icons'
import {getDownloadAtaParecerTecnico} from "../../../../services/dres/AtasParecerTecnico.service";

export const AtaParecerTecnico = ({ataParecerTecnico, publicado}) => {
    const onClickVerAta = (uuid_ata) =>{
        window.location.assign(`/visualizacao-da-ata-parecer-tecnico/${uuid_ata}/`)
    };

    const downloadAtaParecerTecnico = async () =>{
        await getDownloadAtaParecerTecnico(ataParecerTecnico.uuid);
    };

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

    const textoBtnAta = () => {
        if(publicado()){
            return "Consultar ata";
        }
        else{
            return "Preencher ata"
        }
    }

    return (
        <>
            <div className="rounded-bottom border">
                <div className='row px-2'>
                    <div className="col-12 col-md-8">
                        <div className='mt-2 mb-3'>
                            <p className='fonte-14 mb-1'><strong>Ata de apresentação do Parecer Técnico Conclusivo</strong></p>
                            <p className={`fonte-12 mb-2 ${classeMensagem(ataParecerTecnico)}`}>
                                <span>{mensagem(ataParecerTecnico)}</span>
                                {ataParecerTecnico.arquivo_pdf &&
                                    <button className='btn-editar-membro' type='button'>
                                        <FontAwesomeIcon
                                            onClick={() => downloadAtaParecerTecnico()}
                                            style={{fontSize: '18px'}}
                                            icon={faDownload}
                                        />
                                    </button>
                                }
                            </p>
                        </div>
                    </div>
                    <div className="col-12 col-md-4 align-self-center text-right">
                        <button
                            onClick={() => onClickVerAta(ataParecerTecnico.uuid)}
                            type="button"
                            className="btn btn-outline-success btn-sm"
                        >
                            {textoBtnAta()}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}