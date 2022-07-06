import React, {memo, useCallback, useEffect, useState} from "react";
import {
    getDocumentosConsolidadoDre,
    getDownloadRelatorio,
    getTiposConta
} from "../../../services/dres/RelatorioConsolidado.service";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload} from "@fortawesome/free-solid-svg-icons";

const DemonstrativoDaExecucaoFisicoFinanceira = ({consolidadoDre, statusConsolidadoDre, periodoEscolhido, publicado}) => {

    const [relatoriosFisicoFinanceiros, setRelatoriosFisicoFinanceiros] = useState([]);
    const [contas, setContas] = useState(false);

    const retornaRelatoriosFisicoFinanceiros = useCallback(async () => {
        if (consolidadoDre && consolidadoDre.uuid) {
            try {
                let documentos = await getDocumentosConsolidadoDre(consolidadoDre.uuid)
                setRelatoriosFisicoFinanceiros(documentos.relatorios_consolidados_dre_do_consolidado_dre)
            } catch (e) {
                console.log("Erro ao buscar Relatórios Físico Financeiros ", e)
            }
        } else {
            setRelatoriosFisicoFinanceiros(false)
        }
    }, [consolidadoDre])

    useEffect(() => {
        retornaRelatoriosFisicoFinanceiros()
    }, [retornaRelatoriosFisicoFinanceiros])

    useEffect(()=>{
        let mounted = true
        const carregaContas = async () => {
            try {
                let tipo_contas = await getTiposConta();
                if (mounted){
                    setContas(tipo_contas);
                }
            }catch (e) {
                console.log("Erro ao trazer os tipos de contas ", e);
            }
        };
        carregaContas()
        return () =>{
            mounted = false
        }
    }, [])

    const retornaClasseMensagem = (texto) => {
        let classeMensagem = "documento-gerado";
        if (texto === 'NAO_GERADOS') {
            classeMensagem = "documento-pendente"
        }
        if (texto === 'EM_PROCESSAMENTO') {
            classeMensagem = "documento-processando"
        }
        return classeMensagem
    }

    const downloadRelatorio = async (relatorio_uuid, relatorio_versao) =>{
        await getDownloadRelatorio(relatorio_uuid, relatorio_versao);
    };

    const onClickPreencherRelatorio = (contaEscolhida) =>{
        window.location.assign(`/dre-relatorio-consolidado-apuracao/${periodoEscolhido}/${contaEscolhida}/`)
    };

    const textoBtnRelatorio = () => {
        if(publicado()){
            return "Consultar relatório";
        }
        else{
            return "Preencher relatório";
        }
    }

    return (
        <div className="border">
            {relatoriosFisicoFinanceiros && relatoriosFisicoFinanceiros.length > 0 ? (
                <>
                    {relatoriosFisicoFinanceiros.map((relatorio) =>
                        <div className='row px-2' key={relatorio.uuid}>
                            <div className="col-12 col-md-8">
                                <div className='mt-2 mb-3' >
                                    <p className='fonte-14 mb-1'><strong>Demonstrativo da Execução Físico-Financeira - {relatorio.tipo_conta && relatorio.tipo_conta.nome ? "Conta " + relatorio.tipo_conta.nome : ""}</strong></p>
                                    <p className={`fonte-12 mb-0 ${retornaClasseMensagem(statusConsolidadoDre.status_geracao)}`}>
                                        <span>{statusConsolidadoDre.status_arquivo}</span>
                                        <button className='btn-editar-membro' type='button'>
                                            <FontAwesomeIcon
                                                onClick={() => downloadRelatorio(relatorio.uuid, relatorio.versao)}
                                                style={{fontSize: '18px'}}
                                                icon={faDownload}
                                            />
                                        </button>
                                    </p>
                                </div>
                            </div>
                            <div className="col-12 col-md-4 align-self-center text-right">
                                <button onClick={()=> onClickPreencherRelatorio(relatorio.tipo_conta.uuid)} type="button" className="btn btn-outline-success btn-sm">{textoBtnRelatorio()}</button>
                            </div>
                        </div>
                    )}
                </>
                ) :
                contas && contas.length > 0 && contas.map((conta) =>
                        <div className='row px-2' key={conta.uuid}>
                            <div className="col-12 col-md-8">
                                <div className='mt-2 mb-3' >
                                    <p className='fonte-14 mb-1'><strong>Demonstrativo da Execução Físico-Financeira - {conta && conta.nome ? "Conta " + conta.nome : ""}</strong></p>
                                    <p className={`fonte-12 mb-0 ${retornaClasseMensagem(statusConsolidadoDre.status_geracao)}`}>
                                        <span>Documento pendente de geração</span>
                                    </p>
                                </div>
                            </div>
                            <div className="col-12 col-md-4 align-self-center text-right">
                                <button onClick={()=> onClickPreencherRelatorio(conta.uuid)} type="button" className="btn btn-outline-success btn-sm">{textoBtnRelatorio()}</button>
                            </div>
                        </div>
                    )}
        </div>
    )
}
export default memo(DemonstrativoDaExecucaoFisicoFinanceira)