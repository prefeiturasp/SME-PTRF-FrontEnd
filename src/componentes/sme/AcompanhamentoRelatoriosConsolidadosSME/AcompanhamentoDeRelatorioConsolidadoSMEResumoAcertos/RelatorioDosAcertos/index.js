import React, {useState, useEffect, useCallback} from "react";
import Spinner from "../../../../../assets/img/spinner.gif"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload} from "@fortawesome/free-solid-svg-icons";
import Loading from "../../../../../utils/Loading";
import { 
    gerarPreviaRelatorioDevolucaoAcertosSme ,
    verificarStatusGeracaoDevolucaoAcertosSme,
    downloadDocumentPdfDevolucaoAcertos
} from "../../../../../services/sme/AcompanhamentoSME.service";

export const RelatorioDosAcertos = ({analiseSequenciaVisualizacao, relatorioConsolidado, podeGerarPrevia}) => {
    const [mensagem, setMensagem] = useState("");
    const [status, setStatus] = useState("");
    const [previaEmAndamento, setPreviaEmAndamento] = useState(false);
    const [disableBtnPrevia, setDisableBtnPrevia] = useState(false);
    const [disableBtnDownload, setDisableBtnDownload] = useState(false);
    const [analiseAtual, setAnaliseAtual] = useState(null);

    useEffect(() => {
        if(relatorioConsolidado){
            if(podeGerarPrevia){
                let analise_atual = relatorioConsolidado?.analise_atual?.uuid
                setAnaliseAtual(analise_atual);
            }
            else{
                let analise_atual = analiseSequenciaVisualizacao?.sequenciaConferencia?.uuid;
                setAnaliseAtual(analise_atual);
            }
        }
        
    }, [podeGerarPrevia, relatorioConsolidado, analiseSequenciaVisualizacao]);

    const relatorioDevolucaoAcertosInfo = useCallback(async () => {
        if(analiseAtual){
            let statusInfo = await verificarStatusGeracaoDevolucaoAcertosSme(analiseAtual);
            setMensagem(statusInfo);

            if(statusInfo.includes('Relatório sendo gerado...')){
                setStatus("EM_PROCESSAMENTO")
                setPreviaEmAndamento(true);
                setDisableBtnPrevia(true);
                setDisableBtnDownload(true);
            }
            else if (statusInfo.includes('Nenhuma') || statusInfo.includes('Nenhum')) {
                setStatus("PENDENTE");
                setDisableBtnDownload(true);
                setDisableBtnPrevia(false);
            }
            else if(statusInfo.includes('gerada em') || statusInfo.includes('gerado em')) {
                setStatus("CONCLUIDO");
                setPreviaEmAndamento(false);
                setDisableBtnDownload(false);
                setDisableBtnPrevia(false);
            }   
        }
        
    }, [analiseAtual])

    const gerarPrevia = async () => {
        setStatus("EM_PROCESSAMENTO");
        setMensagem("Relatório sendo gerado...");
        setPreviaEmAndamento(true);
        
        setDisableBtnPrevia(true);
        setDisableBtnDownload(true);

        if(analiseAtual){
            await gerarPreviaRelatorioDevolucaoAcertosSme(analiseAtual);
        }
    }

    const downloadDocumentoPrevia = async () => {
        if(analiseAtual){
            await downloadDocumentPdfDevolucaoAcertos(analiseAtual);
            await relatorioDevolucaoAcertosInfo();
        }
    };

    useEffect(() => {
        if (status && status  === 'EM_PROCESSAMENTO' ){
            const timer = setInterval(() => {
                relatorioDevolucaoAcertosInfo();               
            }, 5000);
             // clearing interval
            return () => clearInterval(timer);
        }

        relatorioDevolucaoAcertosInfo();

    }, [status, relatorioDevolucaoAcertosInfo]);

    const exibeLoading = status === 'EM_PROCESSAMENTO' || previaEmAndamento;

    let classeMensagem = "documento-gerado";
    if (mensagem.includes('Nenhuma') || mensagem.includes('Nenhum')) {
        classeMensagem = "documento-pendente"
    }
    if (mensagem.includes('Relatório sendo gerado...')) {
        classeMensagem = "documento-processando"
    }

    return (
        false ? (
            <Loading
                corGrafico="black"
                corFonte="dark"
                marginTop="0"
                marginBottom="0"
            />
        ) :
            <div className="relacao-bens-container mt-5">
                <p className="relacao-bens-title">Análise SME</p>

                <article>
                    <div className="info">
                        {podeGerarPrevia
                            ?
                                <p className="fonte-14 mb-1"><strong>Relatório de devoluções para acertos da DRE</strong></p>
                            :
                                <p className="fonte-14 mb-1"><strong>{analiseSequenciaVisualizacao?.versao_numero}º Relatório de devoluções para acertos da DRE</strong></p>
                        }

                        <p className={`fonte-12 mb-1 ${classeMensagem}`}>
                            {mensagem}
                            {!disableBtnDownload &&
                                <button 
                                    onClick={() => downloadDocumentoPrevia()}
                                    disabled={disableBtnDownload} type="button" title="Download"
                                    className="btn-editar-membro"
                                >
                                    <FontAwesomeIcon
                                        style={{fontSize: '15px', marginRight: "0", color: "#00585E"}}
                                        icon={faDownload}
                                    />
                                </button>
                            }
                            {exibeLoading ? <img alt="" src={Spinner} style={{height: "22px"}}/> : ''}
                        </p>
                    </div>

                    <div className="actions">
                        {podeGerarPrevia
                            ? 
                                <button onClick={(e) => gerarPrevia()} type="button" disabled={disableBtnPrevia} className="btn btn-outline-success mr-2">Gerar prévia</button>
                            : 
                                null
                        }
                    </div>
                    
                </article>
            </div>  
    )
};