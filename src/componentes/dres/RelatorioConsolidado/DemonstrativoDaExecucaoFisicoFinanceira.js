import React, {memo, useEffect, useState} from "react";
import {
    getDownloadRelatorio,
    getTiposConta
} from "../../../services/dres/RelatorioConsolidado.service";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload} from "@fortawesome/free-solid-svg-icons";

const DemonstrativoDaExecucaoFisicoFinanceira = ({consolidadoDre, periodoEscolhido}) => {
    const [contas, setContas] = useState(false);

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
        window.location.assign(`/dre-relatorio-consolidado-apuracao/${periodoEscolhido}/${contaEscolhida}/${consolidadoDre.ja_publicado}`)
    };

    return (
        <div className="border">
            {consolidadoDre.relatorios_fisico_financeiros && consolidadoDre.relatorios_fisico_financeiros.length > 0 ? (
                <>
                    {consolidadoDre.relatorios_fisico_financeiros.map((relatorio) =>
                        <div className='row px-2' key={relatorio.uuid}>
                            <div className="col-12 col-md-8">
                                <div className='mt-2 mb-3' >
                                    <p className='fonte-14 mb-1'><strong>Demonstrativo da Execução Físico-Financeira - {relatorio.tipo_conta ? "Conta " + relatorio.tipo_conta : ""}</strong></p>
                                    <p className={`fonte-12 mb-0 ${retornaClasseMensagem(relatorio.status_geracao)}`}>
                                        <span>{relatorio.status_geracao_arquivo}</span>
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
                                <button onClick={()=> onClickPreencherRelatorio(relatorio.tipo_conta_uuid)} type="button" className="btn btn-outline-success btn-sm">{consolidadoDre.ja_publicado ? "Consultar" : "Preencher"} relatório</button>
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
                                    <p className={`fonte-12 mb-0 documento-pendente`}>
                                        <span>Documento pendente de geração</span>
                                    </p>
                                </div>
                            </div>
                            <div className="col-12 col-md-4 align-self-center text-right">
                                <button onClick={()=> onClickPreencherRelatorio(conta.uuid)} type="button" className="btn btn-outline-success btn-sm">Preencher relatório</button>
                            </div>
                        </div>
                    )}
        </div>
    )
}
export default memo(DemonstrativoDaExecucaoFisicoFinanceira)