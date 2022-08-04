import React, {memo, useCallback, useEffect, useState} from "react";
import { SplitButton } from 'primereact/splitbutton';
import {
    getDownloadRelatorio,
    getTiposConta
} from "../../../services/dres/RelatorioConsolidado.service";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload} from "@fortawesome/free-solid-svg-icons";

const DemonstrativoDaExecucaoFisicoFinanceira = ({consolidadoDre, periodoEscolhido}) => {
    const [contas, setContas] = useState(false);
    const [itensSplitButton, setItensSplitButton] = useState([])

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
        let consolidado_dre_uuid = consolidadoDre.uuid
        window.location.assign(`/dre-relatorio-consolidado-apuracao/${periodoEscolhido}/${contaEscolhida}/${consolidadoDre.ja_publicado}/${consolidado_dre_uuid}`)
    };

    const geraItensSplitButton = useCallback( () => {

        if (contas && contas.length > 0){
            contas.map((conta) => (
                setItensSplitButton(prevState => [...prevState, {
                    label: `Conta ${conta.nome}`,
                    command: ()=> onClickPreencherRelatorio(conta.uuid)
                }])
            ))
        }

    }, [contas])

    useEffect(()=>{
        geraItensSplitButton()
    }, [geraItensSplitButton])

    return (
        <div className="border">
            {consolidadoDre.relatorios_fisico_financeiros && consolidadoDre.relatorios_fisico_financeiros.length > 0 ? (
                <>
                    {consolidadoDre.relatorios_fisico_financeiros.map((relatorio) =>
                        <div className='row px-2' key={relatorio.uuid}>
                            <div className="col-12 col-md-8">
                                <div className='mt-2 mb-3' >
                                    <p className='fonte-14 mb-1'><strong>Demonstrativo da Execução Físico-Financeira {relatorio.tipo_conta ? "- Conta " + relatorio.tipo_conta : ""}</strong></p>
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
                                {!relatorio.tipo_conta ? (
                                    <SplitButton
                                        className="btn-consultar-relatorio"
                                        label={consolidadoDre.ja_publicado ? "Consultar relatório" : "Preencher relatório"}
                                        model={itensSplitButton}
                                        menuStyle={{textAlign: "left"}}
                                    >
                                    </SplitButton>
                                ):
                                    <button
                                        onClick={()=> onClickPreencherRelatorio(relatorio.tipo_conta_uuid)}
                                        type="button"
                                        className="btn btn-outline-success btn-sm"
                                    >
                                        {consolidadoDre.ja_publicado ? "Consultar" : "Preencher"} relatório
                                    </button>
                                }
                            </div>
                        </div>
                    )}
                </>
                ) :
                <div className='row px-2'>
                    <div className="col-12 col-md-8">
                        <div className='mt-2 mb-3' >
                            <p className='fonte-14 mb-1'><strong>Demonstrativo da Execução Físico-Financeira</strong></p>
                            <p className={`fonte-12 mb-0 documento-pendente`}>
                                <span>Documento pendente de geração</span>
                            </p>
                        </div>
                    </div>
                    <div className="col-12 col-md-4 align-self-center text-right">
                        <SplitButton
                            className="btn-consultar-relatorio"
                            label={consolidadoDre.ja_publicado ? "Consultar relatório" : "Preencher relatório"}
                            model={itensSplitButton}
                            menuStyle={{textAlign: "left"}}
                        >
                        </SplitButton>
                    </div>
                </div>
            }
        </div>
    )
}
export default memo(DemonstrativoDaExecucaoFisicoFinanceira)