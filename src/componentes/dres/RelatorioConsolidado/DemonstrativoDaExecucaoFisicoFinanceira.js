import React, {memo, useEffect, useMemo, useState, useCallback} from "react";
import {
    getDownloadRelatorio,
    getTiposConta
} from "../../../services/dres/RelatorioConsolidado.service";
import {haDiferencaPrevisaoExecucaoRepasse} from "./haDiferencaPrevisaoExecucaoRepasse"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload} from "@fortawesome/free-solid-svg-icons";
import {visoesService} from "../../../services/visoes.service";
import { getExecucaoFinanceira } from "../../../services/dres/RelatorioConsolidado.service";

const DemonstrativoDaExecucaoFisicoFinanceira = ({consolidadoDre, periodoEscolhido, podeGerarPreviaRetificacao, execucaoFinanceira}) => {
    const [contas, setContas] = useState(false);
    const [execucaoFinanceiraRetificacao, setExecucaoFinanceiraRetificacao] = useState({});

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

    const carregaExecucaoFinanceiraRetificacao = useCallback(async () => {
        const dre_uuid = visoesService.getItemUsuarioLogado('associacao_selecionada.uuid');

        if(periodoEscolhido && consolidadoDre && consolidadoDre.eh_retificacao){
            try {
                let execucao = await getExecucaoFinanceira(dre_uuid, periodoEscolhido, consolidadoDre.uuid);
                setExecucaoFinanceiraRetificacao(execucao)
            } catch (e) {
                console.log("Erro ao carregar execução financeira ", e)
            }
        }

    }, [periodoEscolhido, consolidadoDre])

    useEffect(() => {
        carregaExecucaoFinanceiraRetificacao()
    }, [carregaExecucaoFinanceiraRetificacao])

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

    const onClickPreencherRelatorio = () =>{
        let consolidado_dre_uuid = consolidadoDre.uuid
        window.location.assign(`/dre-relatorio-consolidado-em-tela/${periodoEscolhido}/${consolidadoDre.ja_publicado}/${consolidado_dre_uuid}`)
    };

    const isDiferencaValores = useMemo(() => {
        if(execucaoFinanceira){
            return execucaoFinanceira?.por_tipo_de_conta?.some((execucaoFinanceiraConta) => {
                return haDiferencaPrevisaoExecucaoRepasse(execucaoFinanceiraConta.valores)
            })
        }
        else if(execucaoFinanceiraRetificacao){
            return execucaoFinanceiraRetificacao?.por_tipo_de_conta?.some((execucaoFinanceiraConta) => {
                return haDiferencaPrevisaoExecucaoRepasse(execucaoFinanceiraConta.valores)
            })
        }

    }, [execucaoFinanceira, execucaoFinanceiraRetificacao])

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
                            {!consolidadoDre.eh_consolidado_de_publicacoes_parciais &&
                            <div className="col-12 col-md-4 align-self-center text-right">
                                <button
                                    onClick={() => onClickPreencherRelatorio()}
                                    type="button"
                                    className="btn btn-outline-success btn-sm"
                                >
                                    {isDiferencaValores ? 'Preencher resumo' : 'Consultar resumo'}
                                </button>
                            </div>
                            }
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
                    {!consolidadoDre.eh_consolidado_de_publicacoes_parciais &&
                    <div className="col-12 col-md-4 align-self-center text-right">
                        <span data-html={true} data-tip={podeGerarPreviaRetificacao ? "Não é possível consultar/preencher o resumo. A análise da(s) prestação(ões) de contas em retificação ainda não foi concluída." : ""}>
                            <button
                                onClick={() => onClickPreencherRelatorio()}
                                type="button"
                                className="btn btn-outline-success btn-sm"
                                disabled={podeGerarPreviaRetificacao}
                            >
                                {isDiferencaValores ? 'Preencher resumo' : 'Consultar resumo'}
                            </button>
                        </span>
                    </div>
                    }
                </div>
            }
        </div>
    )
}
export default memo(DemonstrativoDaExecucaoFisicoFinanceira)