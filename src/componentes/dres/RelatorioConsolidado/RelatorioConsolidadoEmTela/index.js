import React, {useEffect, useState, useCallback} from "react";
import {useParams} from "react-router-dom";
import {
    getExecucaoFinanceira,
    postJustificativa,
    patchJustificativa,
} from "../../../../services/dres/RelatorioConsolidado.service";
import {TopoComBotoes} from "./TopoComBotoes";
import {visoesService} from "../../../../services/visoes.service";
import {TabelaExecucaoFinanceira} from "./TabelaExecucaoFinanceira";
import {JustificativaDiferenca} from "./JustificativaDiferenca";
import {auxGetNomes} from "../auxGetNomes";
import { haDiferencaPrevisaoExecucaoRepasse } from "../haDiferencaPrevisaoExecucaoRepasse";
import Loading from "../../../../utils/Loading";
import { getConsolidadoDrePorUuid } from "../../../../services/dres/RelatorioConsolidado.service";
import {toastCustom} from "../../../Globais/ToastCustom";

export const RelatorioConsolidadoEmTela = () => {

    let {periodo_uuid, conta_uuid, ja_publicado, consolidado_dre_uuid} = useParams();

    // Para bloquear as edições quando for de um Consolidado DRE incremental publicacoes_anteriores
    // eslint-disable-next-line no-eval
    const jaPublicado = eval(ja_publicado)

    const dre_uuid = visoesService.getItemUsuarioLogado('associacao_selecionada.uuid');

    const initJustificativa = {
        uuid: '',
        dre: dre_uuid,
        periodo: periodo_uuid,
        tipo_conta: conta_uuid,
        texto: ''
    };

    const [periodoNome, setPeriodoNome] = useState('');
    const [execucaoFinanceira, setExecucaoFinanceira] = useState(false);
    const [justificativaDiferencaCheque, setJustificativaDiferencaCheque] = useState(initJustificativa);
    const [justificativaDiferencaCartao, setJustificativaDiferencaCartao] = useState(initJustificativa);
    const [btnSalvarJustificativaDisableCheque, setBtnSalvarJustificativaDisableCheque] = useState(true);
    const [btnSalvarJustificativaDisableCartao, setBtnSalvarJustificativaDisableCartao] = useState(true);
    const [loading, setLoading] = useState(false);
    const [consolidadoDre, setConsolidadoDre] = useState({})

    const getConsolidadoDREUuid = useCallback(async () => {
        if(consolidado_dre_uuid !== "null"){
            let response = await getConsolidadoDrePorUuid(consolidado_dre_uuid);
            setConsolidadoDre(response)
        }

    }, [consolidado_dre_uuid]);
    
    useEffect(() => {
        getConsolidadoDREUuid()
    }, [getConsolidadoDREUuid])

    useEffect( () => {
        async function carregaInformacoes(){
            setLoading(true);
            await carregaNomePeriodo();
            await carregaExecucaoFinanceira();
            setLoading(false);
        }
        carregaInformacoes()
    }, []);

    const carregaNomePeriodo = async () => {
        if (periodo_uuid) {
            let periodo_nome = await auxGetNomes.nomePeriodo(periodo_uuid);
            setPeriodoNome(periodo_nome);
        }
    };

    const carregaExecucaoFinanceira = async () => {
        try {
            let execucao = await getExecucaoFinanceira(dre_uuid, periodo_uuid,  consolidado_dre_uuid !== 'null' ? consolidado_dre_uuid : '');
            setExecucaoFinanceira(execucao);
            carregaJustificativas(execucao)
        } catch (e) {
            console.log("Erro ao carregar execução financeira ", e)
        }
    };

    const carregaJustificativas = (execucao) => {
        if (execucao) {
            execucao.por_tipo_de_conta.map((conta) => {
                const justificativa = {
                    uuid: conta.justificativa_uuid,
                    dre: dre_uuid,
                    periodo: periodo_uuid,
                    tipo_conta: conta.tipo_conta_uuid,
                    texto: conta.justificativa_texto,
                    eh_retificacao: conta.eh_retificacao
                }
                if (conta.tipo_conta === 'Cheque'){
                    setJustificativaDiferencaCheque(justificativa)
                }
                else if (conta.tipo_conta === 'Cartão'){
                    setJustificativaDiferencaCartao(justificativa)
                }
            })
        }
    }

    const valorTemplate = (valor) => {
        let valor_formatado = Number(valor).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        valor_formatado = valor_formatado.replace(/R/, "").replace(/\$/, "");
        return valor_formatado
    };

    const comparaValores = (execucaoFinanceiraConta) => {
        if (execucaoFinanceiraConta) {
            return execucaoFinanceiraConta.repasses_previstos_sme_custeio !== execucaoFinanceiraConta.repasses_no_periodo_custeio ||
                execucaoFinanceiraConta.repasses_previstos_sme_capital !== execucaoFinanceiraConta.repasses_no_periodo_capital ||
                execucaoFinanceiraConta.repasses_previstos_sme_livre !== execucaoFinanceiraConta.repasses_no_periodo_livre ||
                execucaoFinanceiraConta.repasses_previstos_sme_total !== execucaoFinanceiraConta.repasses_no_periodo_total;
        }
    };

    const onChangeJustificativaDiferenca = (justificativa_texto, tipo_conta) => {
        if (tipo_conta === 'Cheque'){
            setBtnSalvarJustificativaDisableCheque(false)
            setJustificativaDiferencaCheque({...justificativaDiferencaCheque, texto:justificativa_texto})
        }
        else if (tipo_conta === 'Cartão'){
            setBtnSalvarJustificativaDisableCartao(false)
            setJustificativaDiferencaCartao({...justificativaDiferencaCartao, texto:justificativa_texto})
        }

    };

    const onSubmitJustificativaDiferencaCheque = async () => {
        await atualizaJustificativaDiferenca(justificativaDiferencaCheque)
        setBtnSalvarJustificativaDisableCheque(true)
    };

    const onSubmitJustificativaDiferencaCartao = async () => {
        await atualizaJustificativaDiferenca(justificativaDiferencaCartao)
        setBtnSalvarJustificativaDisableCartao(true)
    };

    const atualizaJustificativaDiferenca = async (justificativaDiferenca) => {
        if (justificativaDiferenca && justificativaDiferenca.uuid) {
            let payload = {
                texto: justificativaDiferenca.texto,
                eh_retificacao: consolidadoDre ? consolidadoDre.eh_retificacao : false
            };
            await patchJustificativa(justificativaDiferenca.uuid, payload)
            toastCustom.ToastCustomSuccess('Demonstrativo da Execução Físico-Financeira alterado com sucesso', 'Justificativa da diferença entre o valor previsto pela SME e o transferido pela DRE no período registrada com sucesso.')
        } else {
            delete justificativaDiferenca.uuid;
            await postJustificativa(justificativaDiferenca)
            toastCustom.ToastCustomSuccess('Demonstrativo da Execução Físico-Financeira alterado com sucesso', 'Justificativa da diferença entre o valor previsto pela SME e o transferido pela DRE no período registrada com sucesso.')
        }
    };

    return (
        <>

            <div className="col-12 container-visualizacao-da-ata mb-5">
                {loading ? (
                        <div className="mt-5">
                            <Loading
                                corGrafico="black"
                                corFonte="dark"
                                marginTop="0"
                                marginBottom="0"
                            />
                        </div>
                    ) :
                    <>
                        <div className="col-12 mt-5">
                            <TopoComBotoes
                                periodoNome={periodoNome}
                                ePrevia={!jaPublicado}
                                referencia={execucaoFinanceira.titulo_parcial}
                            />
                            {execucaoFinanceira && execucaoFinanceira.por_tipo_de_conta.map((execucaoFinanceiraConta) => {
                                return <div key={execucaoFinanceiraConta.tipo_conta}>
                                    <TabelaExecucaoFinanceira
                                        execucaoFinanceira={execucaoFinanceiraConta.valores}
                                        valorTemplate={valorTemplate}
                                        haDiferencaPrevisaoExecucaoRepasse={haDiferencaPrevisaoExecucaoRepasse}
                                        tipoConta={execucaoFinanceiraConta.tipo_conta}
                                    />
                                    <JustificativaDiferenca
                                        execucaoFinanceira={execucaoFinanceiraConta}
                                        haDiferencaPrevisaoExecucaoRepasse={haDiferencaPrevisaoExecucaoRepasse}
                                        justificativaDiferenca={execucaoFinanceiraConta.tipo_conta === 'Cheque' ? justificativaDiferencaCheque : justificativaDiferencaCartao}
                                        setJustificativaDiferenca={execucaoFinanceiraConta.tipo_conta === 'Cheque' ? setJustificativaDiferencaCheque : setJustificativaDiferencaCartao}
                                        onChangeJustificativaDiferenca={onChangeJustificativaDiferenca}
                                        onSubmitJustificativaDiferenca={execucaoFinanceiraConta.tipo_conta === 'Cheque' ? onSubmitJustificativaDiferencaCheque : onSubmitJustificativaDiferencaCartao}
                                        btnSalvarJustificativaDisable={execucaoFinanceiraConta.tipo_conta === 'Cheque' ? btnSalvarJustificativaDisableCheque : btnSalvarJustificativaDisableCartao}
                                        setBtnSalvarJustificativaDisable={execucaoFinanceiraConta.tipo_conta === 'Cheque' ? setBtnSalvarJustificativaDisableCheque : setBtnSalvarJustificativaDisableCartao}
                                        jaPublicado={jaPublicado}
                                    />
                                </div>
                            })}

                        </div>
                    </>

                }
            </div>
        </>
    )
};