import React, {useState, useEffect, useCallback} from "react";

import Spinner from "../../../../../assets/img/spinner.gif"
import { getRelatorioAcertosInfo, gerarPreviaRelatorioAcertos, downloadDocumentoPreviaPdf } from "../../../../../services/dres/PrestacaoDeContas.service";
// Hooks Personalizados
import { useCarregaPrestacaoDeContasPorUuid } from "../../../../../hooks/dres/PrestacaoDeContas/useCarregaPrestacaoDeContasPorUuid";
import { getContasDaAssociacao } from "../../../../../services/dres/PrestacaoDeContas.service";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload} from "@fortawesome/free-solid-svg-icons";




export const RelatorioDosAcertos = ({prestacaoDeContasUuid, analiseAtualUuid, podeGerarPrevia}) => {
    const [mensagem, setMensagem] = useState("");
    const [documentoPrevio, setDocumentoPrevio] = useState(false);
    const [status, setStatus] = useState("")
    const [previaEmAndamento, setPreviaEmAndamento] = useState(false)
    const [contasAssociacao, setContasAssociacao] = useState([])
    const [contaCheque, setContaCheque] = useState("");
    const [contaCartao, setContaCartao] = useState("");
    const [disableBtnPrevia, setDisableBtnPrevia] = useState(true)
    const [disableBtnDownload, setDisableBtnDownload] = useState(true);


    const prestacaoDeContas = useCarregaPrestacaoDeContasPorUuid(prestacaoDeContasUuid)

    const carregaDadosDasContasDaAssociacao = useCallback(async () =>{
        if (prestacaoDeContas && prestacaoDeContas.associacao && prestacaoDeContas.associacao.uuid){
            let contas = await getContasDaAssociacao(prestacaoDeContas.associacao.uuid);
            setContasAssociacao(contas);

            let cheque = "";
            let cartao = "";

            for(let i=0; i<=contas.length-1; i++){
                if(contas[i].tipo_conta.nome === "Cheque"){
                    cheque = contas[i].uuid;
                }
                else if(contas[i].tipo_conta.nome === "Cartão"){
                    cartao = contas[i].uuid;
                }
            }

            setContaCheque(cheque);
            setContaCartao(cartao);

            if (status === "CONCLUIDO" && previaEmAndamento === false){
                setDisableBtnPrevia(false);
            }

            if (status === "PENDENTE" && previaEmAndamento === false){
                setDisableBtnPrevia(false);
            }
            
        }
    }, [prestacaoDeContas]);

    useEffect(()=>{
        carregaDadosDasContasDaAssociacao()
    }, [carregaDadosDasContasDaAssociacao, analiseAtualUuid])


    useEffect(() => {
        if (status && status  === 'EM_PROCESSAMENTO' ){
            const timer = setInterval(() => {
                relatorioAcertosInfo();               
            }, 5000);
            // clearing interval
            return () => clearInterval(timer);
        }

        relatorioAcertosInfo();

    }, [status]);


    const relatorioAcertosInfo = async () => {
        let statusInfo = await getRelatorioAcertosInfo(analiseAtualUuid)
        setMensagem(statusInfo);
 
        if(statusInfo.indexOf("Prévia") > 0) {
            setDocumentoPrevio(true);
        }
        else{
            setDocumentoPrevio(false);
        }

        if(statusInfo.includes('Relatório sendo gerado...')){
            setStatus("EM_PROCESSAMENTO")
            setPreviaEmAndamento(true);
            setDisableBtnPrevia(true);
            setDisableBtnDownload(true);

        }
        else if (statusInfo.includes('Nenhuma') || statusInfo.includes('Nenhum')) {
            setStatus("PENDENTE");
            setDisableBtnDownload(true);
        }
        else if(statusInfo.includes('gerada em') || statusInfo.includes('gerado em')) {
            setStatus("CONCLUIDO");
            setPreviaEmAndamento(false);
            setDisableBtnDownload(false);

            if (prestacaoDeContas && prestacaoDeContas.associacao && prestacaoDeContas.associacao.uuid){
                
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

        await gerarPreviaRelatorioAcertos(analiseAtualUuid, contaCheque, contaCartao);
    }

    const downloadDocumentoPrevia = async () => {
        await downloadDocumentoPreviaPdf(analiseAtualUuid);
        await relatorioAcertosInfo();
    };
   
    
    const exibeLoading = status === 'EM_PROCESSAMENTO' || previaEmAndamento;

    let classeMensagem = "documento-gerado";
    if (mensagem.includes('Nenhuma') || mensagem.includes('Nenhum')) {
        classeMensagem = "documento-pendente"
    }
    if (mensagem.includes('Relatório sendo gerado...')) {
        classeMensagem = "documento-processando"
    }

    return (
        <div className="relacao-bens-container mt-5">
            <p className="relacao-bens-title">Relatório dos acertos {podeGerarPrevia ? `(Prévia)` : null}</p>

            <article>
                <div className="info">
                    <p className="fonte-14 mb-1"><strong>Relatório de devoluções para acertos {podeGerarPrevia ? `- Rascunho` : null}</strong></p>

                    <p className={`fonte-12 mb-1 ${classeMensagem}`}>
                        {mensagem}
                        {exibeLoading ? <img src={Spinner} style={{height: "22px"}}/> : ''}
                    </p>

                    
                </div>

                <div className="actions">
                    {podeGerarPrevia 
                        ? 
                            <button onClick={(e) => gerarPrevia()} type="button" disabled={disableBtnPrevia} className="btn btn-outline-success mr-2">Gerar prévia</button>
                        : 
                            null
                    }

                    <button onClick={(e) => downloadDocumentoPrevia()} disabled={disableBtnDownload} type="button" className="btn btn-success mr-2">
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