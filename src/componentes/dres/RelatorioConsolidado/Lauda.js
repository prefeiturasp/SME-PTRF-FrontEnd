import React, {memo} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload} from "@fortawesome/free-solid-svg-icons";
import {exibeDateTimePT_BR_Ata} from "../../../utils/ValidacoesAdicionaisFormularios";
import {postGerarLauda} from "../../../services/dres/RelatorioConsolidado.service";

const Lauda = ({dre_uuid, periodoEscolhido, disablebtnGerarLauda, lauda={}}) => {

    const mensagem = (lauda) => {
        if(!lauda || lauda.uuid === undefined){
            return "Documento pendente de geração";
        }
        else if(lauda.uuid && lauda.alterado_em){
            return "Último preenchimento em " + exibeDateTimePT_BR_Ata(lauda.alterado_em);
        }
        else if(lauda.uuid && lauda.alterado_em === null){
            return "Lauda não preenchida";
        }
    }

    const classeMensagem = (lauda) => {
        if(!lauda || lauda.uuid === undefined || lauda.alterado_em === null){
            return "documento-pendente"
        }
        else if(lauda.uuid && lauda.alterado_em){
            return "documento-gerado"
        }
    }

    const gerarLauda = async () => {
        alert("Método ainda não implementado!!")
        return
        const payload = {
            dre_uuid: dre_uuid,
            periodo_uuid: periodoEscolhido,
        };

        try{
            await postGerarLauda(payload);
            console.log('Solicitação de lauda enviada com sucesso.');
        }catch(e){
            console.log('Erro ao gerar lauda ', e.response.data);
        }
    }


    return(
        <div className="rounded-bottom border">
            <div className='row px-2'>
                <div className="col-12 col-md-8">
                    <div className='mt-2 mb-3'>
                        <p className='fonte-14 mb-1'><strong>Lauda</strong></p>
                        <p className={`fonte-12 mb-2 ${classeMensagem(lauda)}`}>
                            <span>{mensagem(lauda)}</span>
                            {lauda && lauda.uuid &&
                                <button onClick={null} className='btn-editar-membro' type='button'>
                                    <FontAwesomeIcon
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
                        onClick={gerarLauda}
                        type="button"
                        className="btn btn-success btn-sm mr-2"
                        disabled={disablebtnGerarLauda}
                    >
                        Gerar lauda
                    </button>

                </div>
            </div>
        </div>
    )

}
export default memo(Lauda)