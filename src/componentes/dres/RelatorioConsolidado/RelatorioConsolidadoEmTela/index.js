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
    const contaUuidParam = conta_uuid && conta_uuid !== 'null' ? conta_uuid : null;

    const initJustificativa = {
        uuid: '',
        dre: dre_uuid,
        periodo: periodo_uuid,
        tipo_conta: '',
        texto: ''
    };

    const [periodoNome, setPeriodoNome] = useState('');
    const [execucaoFinanceira, setExecucaoFinanceira] = useState(false);
    const [justificativasDiferenca, setJustificativasDiferenca] = useState(() => (
        contaUuidParam ? {
            [contaUuidParam]: {
                ...initJustificativa,
                tipo_conta: contaUuidParam
            }
        } : {}
    ));
    const [btnSalvarJustificativaDisablePorConta, setBtnSalvarJustificativaDisablePorConta] = useState(() => (
        contaUuidParam ? {[contaUuidParam]: true} : {}
    ));
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
            const justificativasPorConta = {};
            const btnDisablePorConta = {};

            execucao.por_tipo_de_conta.forEach((conta) => {
                justificativasPorConta[conta.tipo_conta_uuid] = {
                    uuid: conta.justificativa_uuid,
                    dre: dre_uuid,
                    periodo: periodo_uuid,
                    tipo_conta: conta.tipo_conta_uuid,
                    texto: conta.justificativa_texto,
                    eh_retificacao: conta.eh_retificacao
                };
                btnDisablePorConta[conta.tipo_conta_uuid] = true;
            });

            setJustificativasDiferenca(justificativasPorConta);
            setBtnSalvarJustificativaDisablePorConta(btnDisablePorConta);
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

    const onChangeJustificativaDiferenca = (justificativa_texto, tipo_conta_uuid) => {
        setBtnSalvarJustificativaDisablePorConta((prevState) => ({
            ...prevState,
            [tipo_conta_uuid]: false
        }));
        setJustificativasDiferenca((prevState) => ({
            ...prevState,
            [tipo_conta_uuid]: {
                ...(prevState[tipo_conta_uuid] || initJustificativa),
                tipo_conta: tipo_conta_uuid,
                texto: justificativa_texto
            }
        }));
    };

    const onSubmitJustificativaDiferenca = async (tipo_conta_uuid) => {
        const justificativaDiferenca = justificativasDiferenca[tipo_conta_uuid];
        await atualizaJustificativaDiferenca(justificativaDiferenca)
        setBtnSalvarJustificativaDisablePorConta((prevState) => ({
            ...prevState,
            [tipo_conta_uuid]: true
        }));
    }

    const atualizaJustificativaDiferenca = async (justificativaDiferenca) => {
        if (!justificativaDiferenca) {
            return;
        }
        if (justificativaDiferenca && justificativaDiferenca.uuid) {
            let payload = {
                texto: justificativaDiferenca.texto,
                eh_retificacao: consolidadoDre ? consolidadoDre.eh_retificacao : false
            };
            await patchJustificativa(justificativaDiferenca.uuid, payload)
            toastCustom.ToastCustomSuccess('Demonstrativo da Execução Físico-Financeira alterado com sucesso', 'Justificativa da diferença entre o valor previsto pela SME e o transferido pela DRE no período registrada com sucesso.')
        } else {
            const {uuid, ...payload} = justificativaDiferenca;
            await postJustificativa(payload)
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
                                const justificativaDiferencaConta = justificativasDiferenca[execucaoFinanceiraConta.tipo_conta_uuid] || {
                                    ...initJustificativa,
                                    tipo_conta: execucaoFinanceiraConta.tipo_conta_uuid
                                };
                                const btnSalvarJustificativaDisable = btnSalvarJustificativaDisablePorConta[execucaoFinanceiraConta.tipo_conta_uuid] ?? true;

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
                                        justificativaDiferenca={justificativaDiferencaConta}
                                        setJustificativaDiferenca={setJustificativasDiferenca}
                                        onChangeJustificativaDiferenca={onChangeJustificativaDiferenca}
                                        onSubmitJustificativaDiferenca={() => onSubmitJustificativaDiferenca(execucaoFinanceiraConta.tipo_conta_uuid)}
                                        btnSalvarJustificativaDisable={btnSalvarJustificativaDisable}
                                        setBtnSalvarJustificativaDisable={setBtnSalvarJustificativaDisablePorConta}
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