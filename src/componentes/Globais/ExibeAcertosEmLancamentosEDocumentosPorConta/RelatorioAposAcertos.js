import React, {useState, useEffect} from "react";
import Spinner from "../../../assets/img/spinner.gif"
import {gerarPreviaRelatorioAposAcertos, verificarStatusGeracaoAposAcertos, downloadDocumentPdfAposAcertos, regerarRelatorioAposAcertos, regerarPreviaRelatorioAposAcertos} from '../../../services/escolas/PrestacaoDeContas.service'
import { getAnalisePrestacaoConta, getAnalisesDePcDevolvidas } from "../../../services/dres/PrestacaoDeContas.service";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload} from "@fortawesome/free-solid-svg-icons";
import Loading from "../../../utils/Loading";
import {visoesService} from "../../../services/visoes.service"

export const RelatorioAposAcertos = ({prestacaoDeContasUuid, prestacaoDeContas, analiseAtualUuid, podeGerarPrevia}) => {
    const [mensagem, setMensagem] = useState("");
    const [status, setStatus] = useState("")
    const [previaEmAndamento, setPreviaEmAndamento] = useState(false)
    const [disableBtnPrevia, setDisableBtnPrevia] = useState(false)
    const [disableBtnRegerar, setDisableBtnRegerar] = useState(false)
    const [disableBtnDownload, setDisableBtnDownload] = useState(false);
    const [analisesDevolvidas, setAnalisesDevolvidas] = useState([]);
    const [numeroDevolucao, setNumeroDevolucao] = useState("");
    const [podeReprocessar, setPodeReprocessar] = useState(false);
    const [versaoRascunho, setVersaoRascunho] = useState(true);
    const [loadingRelatorioAposAcertos, setLoadingRelatorioAposAcertos] = useState(true)
    const temPermissao = visoesService.getPermissoes(["change_analise_dre"])
    const btGerarHabilitado =
        podeGerarPrevia &&
        prestacaoDeContas.status === 'DEVOLVIDA' &&
        temPermissao &&
        !disableBtnPrevia

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
                setDisableBtnRegerar(true);
                setDisableBtnDownload(true);
            }
            else if (statusInfo.includes('Nenhuma') || statusInfo.includes('Nenhum')) {
                setStatus("PENDENTE");
                setDisableBtnDownload(true);
                setDisableBtnPrevia(false);
            }
            else if (statusInfo.includes('Erro')) {
                setStatus("PENDENTE");
                setDisableBtnDownload(true);
                setDisableBtnPrevia(true);
                setDisableBtnRegerar(false);
                setPodeReprocessar(true);
            }
            else if(statusInfo.includes('gerada em') || statusInfo.includes('gerado em')) {
                setStatus("CONCLUIDO");
                setPreviaEmAndamento(false);
                setDisableBtnDownload(false);
                setDisableBtnPrevia(false);
                setDisableBtnRegerar(true);
                setPodeReprocessar(false);
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

    const regerarDocumento = async () => {
        setStatus("EM_PROCESSAMENTO");
        setMensagem("Relatório sendo gerado...");
        setDisableBtnRegerar(true);
        setDisableBtnDownload(true);
        if (prestacaoDeContas.status === 'DEVOLVIDA'){
            await regerarPreviaRelatorioAposAcertos(analiseAtualUuid);
        } else {
            await regerarRelatorioAposAcertos(analiseAtualUuid);

        }
    }

    const downloadDocumentoPrevia = async () => {
        await downloadDocumentPdfAposAcertos(analiseAtualUuid);
        await relatorioAposAcertosInfo();
    };

    const analisesDePcDevolvidas = async () => {
        if(prestacaoDeContasUuid){
            let analises_pc_devolvidas = await getAnalisesDePcDevolvidas(prestacaoDeContasUuid);
            setAnalisesDevolvidas(analises_pc_devolvidas);
        }
    }

    const getNumeroDaDevolucao = () => {
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
                setPodeReprocessar(analises_pc.pode_reprocessar_relatorio_apos_acertos)
            }
            setLoadingRelatorioAposAcertos(false);
        }
    }

    
    const exibeLoading = status === 'EM_PROCESSAMENTO' || previaEmAndamento;

    let classeMensagem = "documento-gerado";
    if (mensagem.includes('Nenhuma') || mensagem.includes('Nenhum') || mensagem.includes("Erro")) {
        classeMensagem = "documento-pendente"
    }
    if (mensagem.includes('Relatório sendo gerado...')) {
        classeMensagem = "documento-processando"
    }

    const documentoFinalGerado = () => {
        if(mensagem.includes('Documento gerado')){
            return true;
        }

        return false;
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
                {podeGerarPrevia 
                    ?
                        <p className="relacao-bens-title">Relatório de apresentação após acertos</p>
                    :
                        <p className="relacao-bens-title">Associação - Relatório de apresentação após acertos</p>
                }

                <article>
                    <div className="info">
                        {podeGerarPrevia
                            ?
                                <p className="fonte-14 mb-1"><strong>Relatório de apresentação após acertos</strong></p>
                            :
                                <p className="fonte-14 mb-1"><strong>{numeroDevolucao}º Relatório de apresentação após acertos</strong></p>
                        }

                        <p className={`fonte-12 mb-1 ${classeMensagem}`}>
                            {mensagem}
                            {!disableBtnDownload &&
                            <button onClick={() => downloadDocumentoPrevia()} 
                            disabled={disableBtnDownload} type="button" title="Download"
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
                        <button onClick={(e) => gerarPrevia()} type="button" disabled={!btGerarHabilitado && !documentoFinalGerado()} className="btn btn-outline-success mr-2">Gerar prévia</button>
                        {podeReprocessar &&
                            <button onClick={(e) => regerarDocumento()} type="button" disabled={disableBtnRegerar} className="btn btn-outline-success mr-2">Regerar</button>
                        }
                    </div>
                    
                </article>
            </div>  
    )
};