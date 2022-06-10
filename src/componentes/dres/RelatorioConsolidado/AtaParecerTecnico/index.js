import React, {useCallback, useEffect, useState} from "react";
import './ata-parecer-tecnico.scss';
import { exibeDateTimePT_BR_Ata } from "../../../../utils/ValidacoesAdicionaisFormularios";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faDownload} from '@fortawesome/free-solid-svg-icons'
import {getStatusAta} from "../../../../services/dres/RelatorioConsolidado.service";
import {getDownloadAtaParecerTecnico, getGerarAta} from "../../../../services/dres/AtasParecerTecnico.service";
import {toastCustom} from "../../../Globais/ToastCustom";

export const AtaParecerTecnico = ({dre_uuid, periodoEscolhido, statusConsolidadoDre, statusProcessamentoConsolidadoDre, setDisablebtnGerarLauda}) => {

    const [ataParecerTecnico, setAtaParecerTecnico] = useState({});
    const [disablebtnVisualizarAta, setDisablebtnVisualizarAta] = useState(true);
    const [disablebtnGerarAta, setDisablebtnGerarAta] = useState(true);

    const consultarStatusAta = useCallback(async () => {
        if(dre_uuid && periodoEscolhido && statusConsolidadoDre.status_geracao === "GERADOS_TOTAIS"){
            try{
                let ata = await getStatusAta(dre_uuid, periodoEscolhido);
                setAtaParecerTecnico(ata)
                setDisablebtnVisualizarAta(false);
                setDisablebtnGerarAta(false);

                if(ata.alterado_em && statusProcessamentoConsolidadoDre !== "EM_PROCESSAMENTO"){
                    setDisablebtnGerarLauda(false);
                }
                else{
                    setDisablebtnGerarLauda(true);
                }
            }
            catch{
                setAtaParecerTecnico({})
                console.log("Ata não encontrada")
                setDisablebtnVisualizarAta(true);
                setDisablebtnGerarAta(true);
                setDisablebtnGerarLauda(true);
            }
        }
    }, [dre_uuid, periodoEscolhido, statusConsolidadoDre, statusProcessamentoConsolidadoDre, setDisablebtnGerarLauda])

    useEffect(() => {
        consultarStatusAta();
    }, [consultarStatusAta]);

    useEffect(() => {
        if (ataParecerTecnico && ataParecerTecnico.status_geracao_pdf && ataParecerTecnico.status_geracao_pdf === "EM_PROCESSAMENTO") {
            const timer = setInterval(() => {
                consultarStatusAta();
            }, 5000);
            // clearing interval
            return () => clearInterval(timer);
        }
    });

    const onClickVerAta = (uuid_ata) =>{
        window.location.assign(`/visualizacao-da-ata-parecer-tecnico/${uuid_ata}/`)
    };

    const downloadAtaParecerTecnico = async () =>{
        await getDownloadAtaParecerTecnico(ataParecerTecnico.uuid);
    };

    const handleClickGerarAta = async () => {
        try {
            await getGerarAta(ataParecerTecnico.uuid, dre_uuid, periodoEscolhido);
            let mensagem_parte_1 = "Quando a geração for concluída um botão para download ficará"
            let mensagem_parte_2 = "disponível na área da Ata."
            toastCustom.ToastCustomInfo('Ata sendo gerada', <span>{mensagem_parte_1} <br/> {mensagem_parte_2}</span>)
            setAtaParecerTecnico({
                ...ataParecerTecnico,
                status_geracao_pdf: "EM_PROCESSAMENTO"
            })
        }
        catch (e) {
            console.log('Erro ao gerar ata ', e.response.data);
        }
    }

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
        return !!(ata && ata.status_geracao_pdf && ata.status_geracao_pdf === "EM_PROCESSAMENTO");
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
                        {ataParecerTecnico && ataParecerTecnico.alterado_em &&
                            <button
                                onClick={handleClickGerarAta}
                                type="button"
                                className="btn btn-success btn-sm mr-2"
                                disabled={disablebtnGerarAta || emProcessamento(ataParecerTecnico)}
                            >
                                Gerar Ata
                            </button>
                        }
                        <button
                            onClick={() => onClickVerAta(ataParecerTecnico.uuid)}
                            type="button"
                            className="btn btn-outline-success btn-sm"
                            disabled={disablebtnVisualizarAta || emProcessamento(ataParecerTecnico)}
                        >
                            Preencher ata
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}