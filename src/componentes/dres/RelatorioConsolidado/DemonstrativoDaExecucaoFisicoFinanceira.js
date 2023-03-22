import React, {memo, useMemo} from "react";
import {
    getDownloadRelatorio,
} from "../../../services/dres/RelatorioConsolidado.service";
import {haDiferencaPrevisaoExecucaoRepasse} from "./haDiferencaPrevisaoExecucaoRepasse"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload} from "@fortawesome/free-solid-svg-icons";

const DemonstrativoDaExecucaoFisicoFinanceira = ({consolidadoDre, periodoEscolhido, execucaoFinanceira, podeAcessarInfoConsolidado}) => {
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

    const isDiferencaValores = (relatorio) => {
        if(execucaoFinanceira){
            return execucaoFinanceira?.por_tipo_de_conta?.some((execucaoFinanceiraConta) => {
                if(relatorio && relatorio.status_geracao === 'GERADO_TOTAL') {
                    return false;
                }
                return haDiferencaPrevisaoExecucaoRepasse(execucaoFinanceiraConta.valores);
            })
        }
    }

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
                                    {'Consultar resumo'}
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
                        <span data-html={true} data-tip={!podeAcessarInfoConsolidado(consolidadoDre) ? "Não é possível consultar/preencher o resumo. A análise da(s) prestação(ões) de contas em retificação ainda não foi concluída." : ""}>
                            <button
                                onClick={() => onClickPreencherRelatorio()}
                                type="button"
                                className="btn btn-outline-success btn-sm"
                                disabled={!podeAcessarInfoConsolidado(consolidadoDre)}
                            >
                                {isDiferencaValores() ? 'Preencher resumo' : 'Consultar resumo'}
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