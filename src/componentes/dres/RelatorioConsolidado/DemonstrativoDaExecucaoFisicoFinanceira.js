import React, {memo, useCallback, useEffect, useState} from "react";
import {getDocumentosConsolidadoDre, getDownloadRelatorio} from "../../../services/dres/RelatorioConsolidado.service";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload} from "@fortawesome/free-solid-svg-icons";

const DemonstrativoDaExecucaoFisicoFinanceira = ({consolidadoDre, statusConsolidadoDre, periodoEscolhido}) => {

    const [relatoriosFisicoFinanceiros, setRelatoriosFisicoFinanceiros] = useState([]);

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
                                <button onClick={()=> onClickPreencherRelatorio(relatorio.tipo_conta.uuid)} type="button" className="btn btn-outline-success btn-sm">Preencher relatório</button>
                            </div>
                        </div>
                    )}
                </>
                ) :
                <div className="col-12 pl-2">
                    <p className='fonte-14 mt-3 mb-3 pl-0'><strong>Documentos não gerados</strong></p>
                </div>
            }
        </div>
    )
}
export default memo(DemonstrativoDaExecucaoFisicoFinanceira)