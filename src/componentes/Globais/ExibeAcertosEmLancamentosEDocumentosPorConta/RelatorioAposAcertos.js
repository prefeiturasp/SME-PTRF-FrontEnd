import React, {useState, useEffect} from "react";
import Spinner from "../../../assets/img/spinner.gif"
import {gerarPreviaRelatorioAposAcertos, verificarStatusGeracaoAposAcertos, downloadDocumentPdfAposAcertos} from '../../../services/escolas/PrestacaoDeContas.service'
import { getAnalisePrestacaoConta, getAnalisesDePcDevolvidas } from "../../../services/dres/PrestacaoDeContas.service";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload} from "@fortawesome/free-solid-svg-icons";
import Loading from "../../../utils/Loading";

export const RelatorioAposAcertos = ({prestacaoDeContasUuid, analiseAtualUuid, podeGerarPrevia}) => {
    const [mensagem, setMensagem] = useState("");
    const [status, setStatus] = useState("")
    const [previaEmAndamento, setPreviaEmAndamento] = useState(false)
    const [disableBtnPrevia, setDisableBtnPrevia] = useState(false)
    const [disableBtnDownload, setDisableBtnDownload] = useState(false);
    const [analisesDevolvidas, setAnalisesDevolvidas] = useState([]);
    const [numeroDevolucao, setNumeroDevolucao] = useState("");
    const [versaoRascunho, setVersaoRascunho] = useState(true);
    const [loadingRelatorioAposAcertos, setLoadingRelatorioAposAcertos] = useState(true)

    useEffect(() => {
        analisesDePcDevolvidas();
    }, []);

    useEffect(() => {
        getAnalise();
    }, [analiseAtualUuid]);

    useEffect(() => {
        if (status && status  === 'EM_PROCESSAMENTO' ){
            const timer = setInterval(() => {
                relatorioAposAcertosInfo();               
            }, 5000);
             // clearing interval
            return () => clearInterval(timer);
        }

        relatorioAposAcertosInfo();

    }, [status, analiseAtualUuid]);

    useEffect(() => {
        getNumeroDaDevolucao();
    }, [analiseAtualUuid, analisesDevolvidas]);


    const relatorioAposAcertosInfo = async () => {
        if(analiseAtualUuid){
            let statusInfo = await verificarStatusGeracaoAposAcertos(analiseAtualUuid)
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
    }

    const gerarPrevia = async () => {
        setStatus("EM_PROCESSAMENTO");
        setMensagem("Relatório sendo gerado...");
        setPreviaEmAndamento(true);
        setDisableBtnPrevia(true);
        setDisableBtnDownload(true);

        await gerarPreviaRelatorioAposAcertos(analiseAtualUuid);
    }

    const downloadDocumentoPrevia = async () => {
        await downloadDocumentPdfAposAcertos(analiseAtualUuid);
        await relatorioAposAcertosInfo();
    };

    const analisesDePcDevolvidas = async () => {
        let analises_pc_devolvidas = await getAnalisesDePcDevolvidas(prestacaoDeContasUuid);
        setAnalisesDevolvidas(analises_pc_devolvidas);
    }

    const getNumeroDaDevolucao = async () => {
        if(analisesDevolvidas.length > 0){
            for(let i=0; i<=analisesDevolvidas.length-1; i++){
                if(analisesDevolvidas[i].uuid === analiseAtualUuid){
                    let numeroDaDevolucao = i + 1
                    setNumeroDevolucao(numeroDaDevolucao)
                    break;
                }
            } 
        }
    }

    const getAnalise = async () => {
        setLoadingRelatorioAposAcertos(true);
        if(analiseAtualUuid){
            let analises_pc = await getAnalisePrestacaoConta(analiseAtualUuid);
            if(analises_pc){
                if(analises_pc.versao === "FINAL" || analises_pc.status === "DEVOLVIDA"){
                    setVersaoRascunho(false);
                }
                else if(analises_pc.versao === "RASCUNHO"){
                    setVersaoRascunho(true);
                }
            }
            setLoadingRelatorioAposAcertos(false);
        }
    }

    
    const exibeLoading = status === 'EM_PROCESSAMENTO' || previaEmAndamento;

    let classeMensagem = "documento-gerado";
    if (mensagem.includes('Nenhuma') || mensagem.includes('Nenhum')) {
        classeMensagem = "documento-pendente"
    }
    if (mensagem.includes('Relatório sendo gerado...')) {
        classeMensagem = "documento-processando"
    }

    return (
        loadingRelatorioAposAcertos ? (
            <Loading
                corGrafico="black"
                corFonte="dark"
                marginTop="0"
                marginBottom="0"
            />
        ) :
            <div className="relacao-bens-container mt-5">
                <p className="relacao-bens-title">Relatório de apresentação após acertos</p>

                <article>
                    <div className="info">
                        {podeGerarPrevia
                            ?
                                <p className="fonte-14 mb-1"><strong>Relatório de devoluções para acertos</strong></p>
                            :
                                <p className="fonte-14 mb-1"><strong>{numeroDevolucao}º Relatório de devoluções para acertos</strong></p>
                        }

                        <p className={`fonte-12 mb-1 ${classeMensagem}`}>
                            {mensagem}
                            {!disableBtnDownload &&
                            <button onClick={() => downloadDocumentoPrevia()} 
                            disabled={disableBtnDownload} type="button"
                            className="btn-editar-membro">
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