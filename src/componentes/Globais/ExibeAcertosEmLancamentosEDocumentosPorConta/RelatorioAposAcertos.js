import React, {useState, useEffect} from "react";
import Spinner from "../../../assets/img/spinner.gif"
import {gerarPreviaRelatorioAposAcertos} from '../../../services/escolas/PrestacaoDeContas.service'
import { getRelatorioAcertosInfo, gerarPreviaRelatorioAcertos, downloadDocumentoPreviaPdf, getAnalisePrestacaoConta } from "../../../services/dres/PrestacaoDeContas.service";
import {getAnalisesDePcDevolvidas}  from "../../../services/dres/PrestacaoDeContas.service"
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
        let statusInfo = await getRelatorioAcertosInfo(analiseAtualUuid)
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

    const gerarPrevia = async () => {
        setStatus("EM_PROCESSAMENTO");
        setMensagem("Relatório sendo gerado...");
        setPreviaEmAndamento(true);
        setDisableBtnPrevia(true);
        setDisableBtnDownload(true);

        let teste = await gerarPreviaRelatorioAposAcertos(analiseAtualUuid);
        console.log("teste", teste)
    }

    const downloadDocumentoPrevia = async () => {
        await downloadDocumentoPreviaPdf(analiseAtualUuid);
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

    
    // const exibeLoading = status === 'EM_PROCESSAMENTO' || previaEmAndamento;

    // let classeMensagem = "documento-gerado";
    // if (mensagem.includes('Nenhuma') || mensagem.includes('Nenhum')) {
    //     classeMensagem = "documento-pendente"
    // }
    // if (mensagem.includes('Relatório sendo gerado...')) {
    //     classeMensagem = "documento-processando"
    // }

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
                <p className="relacao-bens-title">Relatório de apresentação após acertos {podeGerarPrevia ? `(Prévia)` : null}</p>

                <article>
                    <div className="info">
                        {podeGerarPrevia
                            ?
                                <p className="fonte-14 mb-1"><strong>Relatório de devoluções para acertos - Rascunho</strong></p>
                            :
                                <p className="fonte-14 mb-1"><strong>{1}º Relatório de devoluções para acertos</strong></p>
                        }

                        <p className={`fonte-12 mb-1 ${1}`}>
                            {/* {mensagem} */}
                            <img alt="" src={Spinner} style={{height: "22px"}}/>
                        </p>
                    </div>

                    <div className="actions">
                        {podeGerarPrevia && versaoRascunho
                            ? 
                                <button onClick={(e) => gerarPrevia()} type="button" disabled={disableBtnPrevia} className="btn btn-outline-success mr-2">Gerar prévia</button>
                            : 
                                null
                        }

                        <button onClick={(e) => console.log('downloadDocumentoPrevia')} disabled={disableBtnDownload} type="button" className="btn btn-success mr-2">
                            <FontAwesomeIcon
                                style={{color: "#FFFFFF", fontSize: '15px', marginRight: "5px"}}
                                icon={faDownload}
                            />
                            baixar PDF 
                        </button>
                    </div>
                    
                </article>
            </div>  
    )
};