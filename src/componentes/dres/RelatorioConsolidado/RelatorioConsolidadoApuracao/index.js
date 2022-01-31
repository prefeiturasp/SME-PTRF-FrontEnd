import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {InfoAssociacoesEmAnalise} from "./InfoAssociacoesEmAnalise";
import {
    getItensDashboard,
    getExecucaoFinanceira,
    getDevolucoesContaPtrf,
    getJustificativa,
    postJustificativa,
    patchJustificativa,
    getDevolucoesAoTesouro,
    putCriarEditarDeletarObservacaoDevolucaoContaPtrf,
    putCriarEditarDeletarObservacaoDevolucaoTesouro,
    postGerarRelatorio, getConsultarStatus,
} from "../../../../services/dres/RelatorioConsolidado.service";
import {TopoComBotoes} from "./TopoComBotoes";
import {BoxConsultarDados} from "./BoxConsultarDados";
import {visoesService} from "../../../../services/visoes.service";
import {TabelaExecucaoFinanceira} from "./TabelaExecucaoFinanceira";
import {JustificativaDiferenca} from "./JustificativaDiferenca";
import {TabelaDevolucoesContaPtrf} from "./TabelaDevolucoesContaPtrf";
import {TabelaDevolucoesAoTesouro} from "./TabelaDevolucoesAoTesouro";
import {TabelaExecucaoFisica} from "./TabelaExecucaoFisica";
import {auxGetNomes} from "../auxGetNomes";
import {ModalObservacoesRelatorioConsolidadoApuracao} from "../ModalObservacoesRelatorioConsolidadoApuracao";
import {ModalAssociacoesEmAnalise} from "../ModalAssociacoesEmAnalise";
import {ModalMsgGeracaoRelatorio} from "../ModalMsgGeracaoRelatorio";
import {ModalSalvarJustificativa} from "../ModalSalvarJustificativa";
import Loading from "../../../../utils/Loading";

export const RelatorioConsolidadoApuracao = () => {

    let {periodo_uuid, conta_uuid} = useParams();

    const dre_uuid = visoesService.getItemUsuarioLogado('associacao_selecionada.uuid');

    const initJustificativa = {
        uuid: '',
        dre: dre_uuid,
        periodo: periodo_uuid,
        tipo_conta: conta_uuid,
        texto: ''
    };

    const [itensDashboard, setItensDashboard] = useState(false);
    const [totalEmAnalise, setTotalEmAnalise] = useState(0);
    const [periodoNome, setPeriodoNome] = useState('');
    const [contaNome, setContaNome] = useState('');
    const [execucaoFinanceira, setExecucaoFinanceira] = useState(false);
    const [justificativaDiferenca, setJustificativaDiferenca] = useState(initJustificativa);
    const [btnSalvarJustificativaDisable, setBtnSalvarJustificativaDisable] = useState(true);
    const [showSalvarJustificativa, setShowSalvarJustificativa] = useState(false);
    const [devolucoesContaPtrf, setDevolucoesContaPtrf] = useState(false);
    const [devolucoesAoTesouro, setDevolucoesAoTesouro] = useState(false);

    const [observacao, setObservacao] = useState(false);
    const [showModalObservacao, setShowModalObservacao] = useState(false);
    const [showModalAssociacoesEmAnalise, setShowModalAssociacoesEmAnalise] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showModalMsgGeracaoRelatorio, setShowModalMsgGeracaoRelatorio] = useState(false);
    const [msgGeracaoRelatorio, setMsgGeracaoRelatorio] = useState('');

    const [statusRelatorio, setStatusRelatorio] = useState(false);

    useEffect(() => {
        if (statusRelatorio && statusRelatorio.status_geracao && statusRelatorio.status_geracao === "EM_PROCESSAMENTO") {
            const timer = setInterval(() => {
                consultarStatus();
            }, 5000);
            // clearing interval
            return () => clearInterval(timer);
        }
    });

    useEffect(() => {
        consultarStatus();
    }, [periodo_uuid, conta_uuid]);

    useEffect(() => {
        carregaItensDashboard();
    }, []);

    useEffect(() => {
        carregaNomePeriodo();
        carregaNomeConta();
        retornaQtdeEmAnalise();
        carregaExecucaoFinanceira();
        carregaDevolucoesContaPtrf();
        carregaJustificativa();
        carregaDevolucoesAoTesouro();
    }, [itensDashboard]);

    const consultarStatus = async () => {
        console.log("Consultar status...")
        if (dre_uuid && periodo_uuid && conta_uuid) {
            let status = await getConsultarStatus(dre_uuid, periodo_uuid, conta_uuid);
            setStatusRelatorio(status);
        }
    };

    const setaStatusComoProcessando = () => {
        const statusProcessando = {
            pcs_em_analise: false,
            status_geracao: "EM_PROCESSAMENTO",
            status_txt: "Análise de prestações de contas das associações completa. Relatório em processamento.",
            cor_idx: 3,
            status_arquivo: "Relatório sendo gerado. Aguarde."
        }
        setStatusRelatorio(statusProcessando);
    };

    const textoBtnRelatorio = () =>{
        if (statusRelatorio.status_geracao === 'EM_PROCESSAMENTO'){
            return 'Relatório sendo gerado...'
        } else{
            return 'Gerar relatório'
        }
    };

    const carregaItensDashboard = async () => {
        if (periodo_uuid) {
            let itens = await getItensDashboard(periodo_uuid);
            setItensDashboard(itens)
        }
    };

    const carregaNomePeriodo = async () => {
        if (periodo_uuid) {
            let periodo_nome = await auxGetNomes.nomePeriodo(periodo_uuid);
            setPeriodoNome(periodo_nome);
        }
    };

    const carregaNomeConta = async () => {
        let conta_nome = await auxGetNomes.nomeConta(conta_uuid);
        setContaNome(conta_nome);
    };

    const carregaExecucaoFinanceira = async () => {
        try {
            let execucao = await getExecucaoFinanceira(dre_uuid, periodo_uuid, conta_uuid);
            setExecucaoFinanceira(execucao);
        } catch (e) {
            console.log("Erro ao carregar execução financeira ", e)
        }
    };

    const carregaDevolucoesContaPtrf = async () => {
        try {
            let devolucoes = await getDevolucoesContaPtrf(dre_uuid, periodo_uuid, conta_uuid);
            setDevolucoesContaPtrf(devolucoes);
        } catch (e) {
            console.log("Erro ao carregar Devolucoes a Conta Ptrf ", e);
        }
    };

    const carregaDevolucoesAoTesouro = async () => {
        try {
            let devolucoes = await getDevolucoesAoTesouro(dre_uuid, periodo_uuid, conta_uuid);
            setDevolucoesAoTesouro(devolucoes)
        } catch (e) {
            console.log("Erro ao carregar Devolucoes ao Tesouro ", e);
        }
    };

    const carregaJustificativa = async () => {
        try {
            let justificativa = await getJustificativa(dre_uuid, periodo_uuid, conta_uuid);
            if (justificativa && justificativa.length > 0) {
                setJustificativaDiferenca(justificativa[0])
            }
        } catch (e) {
            console.log("Erro ao carregar justificativa ", e)
        }
    };


    const retornaQtdeEmAnalise = () => {
        if (itensDashboard) {
            let total = itensDashboard.cards.filter(elemtent => elemtent.status === 'RECEBIDA' || elemtent.status === 'DEVOLVIDA' || elemtent.status === 'EM_ANALISE').reduce((total, valor) => total + valor.quantidade_prestacoes, 0);
            setTotalEmAnalise(total)
        }
    };

    const valorTemplate = (valor) => {
        let valor_formatado = Number(valor).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        valor_formatado = valor_formatado.replace(/R/, "").replace(/\$/, "");
        return valor_formatado
    };

    const comparaValores = () => {
        if (execucaoFinanceira) {
            return execucaoFinanceira.repasses_previstos_sme_custeio !== execucaoFinanceira.repasses_no_periodo_custeio ||
                execucaoFinanceira.repasses_previstos_sme_capital !== execucaoFinanceira.repasses_no_periodo_capital ||
                execucaoFinanceira.repasses_previstos_sme_livre !== execucaoFinanceira.repasses_no_periodo_livre ||
                execucaoFinanceira.repasses_previstos_sme_total !== execucaoFinanceira.repasses_no_periodo_total;
        }
    };

    const onChangeJustificativaDiferenca = (justificativa_texto) => {
        setBtnSalvarJustificativaDisable(false);
        setJustificativaDiferenca({
            ...justificativaDiferenca,
            texto: justificativa_texto
        })
    };

    const onSubmitJustificativaDiferenca = async () => {
        if (justificativaDiferenca && justificativaDiferenca.uuid) {
            let payload = {
                texto: justificativaDiferenca.texto
            };
            await patchJustificativa(justificativaDiferenca.uuid, payload)
            setShowSalvarJustificativa(true);
            setBtnSalvarJustificativaDisable(true);
        } else {
            delete justificativaDiferenca.uuid;
            await postJustificativa(justificativaDiferenca)
            setShowSalvarJustificativa(true);
            setBtnSalvarJustificativaDisable(true);
        }
    };

    const retornaQtdePorStatus = (status) => {
        let item = itensDashboard.cards.find(element => element.status === status);
        return item.quantidade_prestacoes;
    };

    const retornaNaoApresentadas = () => {
        return itensDashboard.total_associacoes_dre - retornaQtdePorStatus('EM_ANALISE') - retornaQtdePorStatus('APROVADA') - retornaQtdePorStatus('APROVADA_RESSALVA') - retornaQtdePorStatus('REPROVADA');
    };

    const onHandleClose = () => {
        setShowModalObservacao(false);
        setShowModalAssociacoesEmAnalise(false);
        setShowModalMsgGeracaoRelatorio(false);
    };

    const onHandleCloseSalvarJustificativa = () => {
        setShowSalvarJustificativa(false);
    }


    // Observações
    // Os métodos onClickObservacao, onChangeObservacao e serviceObservacao, servem tanto para devoluções a conta PTRF quanto devoluções ao tesouro
    // É passado ao clicar nas respectivas tabelas os parâmetros tipo_devolucao:'devolucao_conta', tipo_devolucao:'devolucao_tesouro' e operacao:'salvar' e operacao:'deletar'

    const onClickObservacao = (devolucao) => {
        setShowModalObservacao(true);
        setObservacao(devolucao)
    };

    const onChangeObservacao = (valor) => {
        setObservacao({
            ...observacao,
            observacao: valor,
        })
    };

    const serviceObservacao = async (operacao) => {
        setShowModalObservacao(false);
        setLoading(true);
        let payload;

        if (operacao.operacao === 'salvar') {
            payload = {
                observacao: observacao.observacao,
            };
        } else if (operacao.operacao === 'deletar') {
            payload = {
                observacao: '',
            };
        }

        if (observacao.tipo_devolucao === 'devolucao_conta') {
            try {
                await putCriarEditarDeletarObservacaoDevolucaoContaPtrf(dre_uuid, periodo_uuid, conta_uuid, observacao.tipo_uuid, payload);
                await carregaDevolucoesContaPtrf();
                console.log("Operação de ", operacao.operacao, " Observação devolução a conta PTRF realizada com sucesso")
            } catch (e) {
                console.log("Erro ao ", operacao.operacao, "observação devolução a conta PTRF", e)
            }
        } else if (observacao.tipo_devolucao === 'devolucao_tesouro') {
            try {
                await putCriarEditarDeletarObservacaoDevolucaoTesouro(dre_uuid, periodo_uuid, conta_uuid, observacao.tipo_uuid, payload);
                await carregaDevolucoesAoTesouro();
                console.log("Operação de ", operacao.operacao, " Observação devolução ao tesouro realizada com sucesso")
            } catch (e) {
                console.log("Erro ao ", operacao.operacao, "observação devolução ao Tesouro ", e)
            }
        }
        setLoading(false);
    };

    const onClickGerarRelatorio = async () => {
        if (totalEmAnalise > 0) {
            setShowModalAssociacoesEmAnalise(true)
        } else {
            await onGerarRelatorio();
        }
    };

    const onGerarRelatorio = async () => {

        let parcial = totalEmAnalise > 0;

        const payload = {
            dre_uuid: dre_uuid,
            periodo_uuid: periodo_uuid,
            tipo_conta_uuid: conta_uuid,
            parcial: parcial
        };
        try {
            setLoading(true);
            await postGerarRelatorio(payload);
            console.log('Solicitação de relatório enviada com sucesso.');
            setShowModalAssociacoesEmAnalise(false);
            setLoading(false);
            setMsgGeracaoRelatorio('O relatório está sendo gerado, enquanto isso você pode continuar a usar o sistema. Consulte na tela anterior o status de geração do relatório.');
            setShowModalMsgGeracaoRelatorio(true)
            setaStatusComoProcessando()
        } catch (e) {
            setShowModalAssociacoesEmAnalise(false);
            setLoading(false);
            setMsgGeracaoRelatorio('Erro ao gerar relatório');
            setShowModalMsgGeracaoRelatorio(true);
            console.log('Erro ao gerar relatório ', e.response.data);
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
                                contaNome={contaNome}
                                onClickGerarRelatorio={onClickGerarRelatorio}
                                textoBtnRelatorio={textoBtnRelatorio}
                            />
                            <InfoAssociacoesEmAnalise
                                totalEmAnalise={totalEmAnalise}
                                periodoUuid={periodo_uuid}
                            />
                            <BoxConsultarDados
                                periodo_uuid={periodo_uuid}
                                conta_uuid={conta_uuid}
                            />
                            <TabelaExecucaoFinanceira
                                execucaoFinanceira={execucaoFinanceira}
                                valorTemplate={valorTemplate}
                                comparaValores={comparaValores}
                            />
                            <JustificativaDiferenca
                                comparaValores={comparaValores}
                                justificativaDiferenca={justificativaDiferenca}
                                setJustificativaDiferenca={setJustificativaDiferenca}
                                onChangeJustificativaDiferenca={onChangeJustificativaDiferenca}
                                onSubmitJustificativaDiferenca={onSubmitJustificativaDiferenca}
                                btnSalvarJustificativaDisable={btnSalvarJustificativaDisable}
                                setBtnSalvarJustificativaDisable={setBtnSalvarJustificativaDisable}
                            />
                            <TabelaDevolucoesContaPtrf
                                devolucoesContaPtrf={devolucoesContaPtrf}
                                valorTemplate={valorTemplate}
                                onClickObservacao={onClickObservacao}
                            />
                            <TabelaDevolucoesAoTesouro
                                devolucoesAoTesouro={devolucoesAoTesouro}
                                valorTemplate={valorTemplate}
                                onClickObservacao={onClickObservacao}
                            />
                            <TabelaExecucaoFisica
                                itensDashboard={itensDashboard}
                                retornaQtdePorStatus={retornaQtdePorStatus}
                                retornaNaoApresentadas={retornaNaoApresentadas}
                            />
                        </div>
                        <section>
                            <ModalObservacoesRelatorioConsolidadoApuracao
                                show={showModalObservacao}
                                handleClose={onHandleClose}
                                observacao={observacao}
                                onChangeObservacao={onChangeObservacao}
                                serviceObservacao={serviceObservacao}
                                titulo="Observação sobre devolução"
                            />
                        </section>
                        <section>
                            <ModalAssociacoesEmAnalise
                                show={showModalAssociacoesEmAnalise}
                                handleClose={onHandleClose}
                                titulo='Associações em análise'
                                texto={`Ainda constam ${totalEmAnalise} Associações com prestação de contas "Em análise". Deseja ainda assim gerar um relatório parcial?`}
                                onGerarRelatorio={onGerarRelatorio}
                            />
                        </section>

                        <section>
                            <ModalSalvarJustificativa
                                show={showSalvarJustificativa}
                                handleClose={onHandleCloseSalvarJustificativa}
                            />
                        </section>

                        {msgGeracaoRelatorio &&
                            <section>
                                <ModalMsgGeracaoRelatorio
                                    show={showModalMsgGeracaoRelatorio}
                                    handleClose={onHandleClose}
                                    titulo='Geração do relatório'
                                    texto={msgGeracaoRelatorio}
                                    onGerarRelatorio={onGerarRelatorio}
                                />
                            </section>
                        }

                    </>

                }

            </div>


        </>
    )
};