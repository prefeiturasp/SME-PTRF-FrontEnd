import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {InfoAssociacoesEmAnalise} from "./InfoAssociacoesEmAnalise";
import {getItensDashboard, getExecucaoFinanceira, getDevolucoesContaPtrf, getJustificativa, postJustificativa, patchJustificativa, getDevolucoesAoTesouro, putCriarEditarDeletarObservacaoDevolucaoContaPtrf} from "../../../../services/dres/RelatorioConsolidado.service";
import {TopoComBotoes} from "./TopoComBotoes";
import {BoxConsultarDados} from "./BoxConsultarDados";
import {visoesService} from "../../../../services/visoes.service";
import {TabelaExecucaoFinanceira} from "./TabelaExecucaoFinanceira";
import {JustificativaDiferenca} from "./JustificativaDiferenca";
import {TabelaDevolucoesContaPtrf} from "./TabelaDevolucoesContaPtrf";
import {TabelaDevolucoesAoTesouro} from "./TabelaDevolucoesAoTesouro";
import {TabelaExecucaoFisica} from "./TabelaExecucaoFisica";
import {auxGetNomes} from "../auxGetNomes";
import {ModalComentariosRelatorioConsolidadoApuracao} from "../ModalComentariosRelatorioConsolidadoApuracao";

export const RelatorioConsolidadoApuracao = () =>{

    let {periodo_uuid, conta_uuid} = useParams();

    const dre_uuid = visoesService.getItemUsuarioLogado('associacao_selecionada.uuid');

    const initJustificativa = {
        uuid:'',
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
    const [devolucoesContaPtrf, setDevolucoesContaPtrf] = useState(false);
    const [devolucoesAoTesouro, setDevolucoesAoTesouro] = useState(false);

    const [observacao, setObservacao] = useState(false);
    const [showModalObservacao, setShowModalObservacao] = useState(false);

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

    const carregaItensDashboard = async () =>{
        if (periodo_uuid){
            let itens = await getItensDashboard(periodo_uuid);
            setItensDashboard(itens)
        }
    };

    const carregaNomePeriodo = async () => {
        if (periodo_uuid){
            let periodo_nome = await auxGetNomes.nomePeriodo(periodo_uuid);
            setPeriodoNome(periodo_nome);
        }
    };

    const carregaNomeConta = async () => {
        let conta_nome = await auxGetNomes.nomeConta(conta_uuid);
        setContaNome(conta_nome);
    };

    const carregaExecucaoFinanceira = async () =>{
        try {
            let execucao = await getExecucaoFinanceira(dre_uuid, periodo_uuid, conta_uuid);
            setExecucaoFinanceira(execucao);
        }catch (e) {
            console.log("Erro ao carregar execução financeira ", e)
        }
    };

    const carregaDevolucoesContaPtrf = async () =>{
        try {
            let devolucoes = await getDevolucoesContaPtrf(dre_uuid, periodo_uuid, conta_uuid);
            setDevolucoesContaPtrf(devolucoes);
            console.log("Devolucoes ", devolucoes)
        }catch (e) {
            console.log("Erro ao carregar Devolucoes a Conta Ptrf ", e);
        }
    };

    const carregaJustificativa = async ()=>{
        try {
            let justificativa = await getJustificativa(dre_uuid, periodo_uuid, conta_uuid);
            if (justificativa && justificativa.length > 0){
                setJustificativaDiferenca(justificativa[0])
            }
        }catch (e) {
            console.log("Erro ao carregar justificativa ", e)
        }
    };

    const carregaDevolucoesAoTesouro = async () =>{
        try {
            let devolucoes = await getDevolucoesAoTesouro(dre_uuid, periodo_uuid, conta_uuid);
            setDevolucoesAoTesouro(devolucoes)
        }catch (e) {
            console.log("Erro ao carregar Devolucoes ao Tesouro ", e);
        }
    };

    const retornaQtdeEmAnalise = () =>{
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

    const comparaValores = () =>{
        if (execucaoFinanceira){
            return execucaoFinanceira.repasses_previstos_sme_custeio !== execucaoFinanceira.repasses_no_periodo_custeio ||
                execucaoFinanceira.repasses_previstos_sme_capital !== execucaoFinanceira.repasses_no_periodo_capital ||
                execucaoFinanceira.repasses_previstos_sme_livre !== execucaoFinanceira.repasses_no_periodo_livre ||
                execucaoFinanceira.repasses_previstos_sme_total !== execucaoFinanceira.repasses_no_periodo_total;
        }
    };

    const onChangeJustificativaDiferenca = (justificativa_texto) =>{
        setJustificativaDiferenca({
            ...justificativaDiferenca,
            texto: justificativa_texto
        })
    };

    const onSubmitJustificativaDiferenca = async () =>{
        if (justificativaDiferenca && justificativaDiferenca.uuid){
            let payload = {
                texto: justificativaDiferenca.texto
            };
            await patchJustificativa(justificativaDiferenca.uuid, payload)
        }else {
            delete justificativaDiferenca.uuid;
            await postJustificativa(justificativaDiferenca)
        }
    };

    const retornaQtdePorStatus = (status) => {
        let item = itensDashboard.cards.find(element => element.status === status);
        return item.quantidade_prestacoes;
    };

    const retornaNaoApresentadas = () =>{
        return itensDashboard.total_associacoes_dre - retornaQtdePorStatus('EM_ANALISE') - retornaQtdePorStatus('APROVADA') - retornaQtdePorStatus('APROVADA_RESSALVA') - retornaQtdePorStatus('REPROVADA');
    };

    const onHandleClose = () => {
        setShowModalObservacao(false);
    };

    const onClickObservacao = (obj) =>{
        setShowModalObservacao(true)
        console.log("onClicAddObservacao ", obj)
        setObservacao(obj)
    };

    const onChangeObservacao = (valor) =>{
        setObservacao({
            ...observacao,
            observacao:valor,
        })
    };

    const onSalvarObservacao = async ()=>{
        setShowModalObservacao(false);
        const payload = {
            observacao: observacao.observacao,
        };
        try {
            await putCriarEditarDeletarObservacaoDevolucaoContaPtrf(dre_uuid, periodo_uuid, conta_uuid, observacao.tipo_uuid, payload);
            console.log("Observação salva com sucesso")
        }catch (e) {
            console.log("Erro ao salvar observação ", e)
        }
        await carregaDevolucoesContaPtrf();

    };

    const onDeletarObeservacao = async () =>{
        setShowModalObservacao(false);
        const payload = {
            observacao: '',
        };
        try {
            await putCriarEditarDeletarObservacaoDevolucaoContaPtrf(dre_uuid, periodo_uuid, conta_uuid, observacao.tipo_uuid, payload);
            console.log("Observação deletada com sucesso")
        }catch (e) {
            console.log("Erro ao salvar observação ", e)
        }
        await carregaDevolucoesContaPtrf();

    };

    return(
        <>
            <div className="col-12 container-visualizacao-da-ata mb-5">
                <div className="col-12 mt-5">
                    <TopoComBotoes
                        periodoNome={periodoNome}
                        contaNome={contaNome}
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
                    />
                    <TabelaDevolucoesContaPtrf
                        devolucoesContaPtrf={devolucoesContaPtrf}
                        valorTemplate={valorTemplate}
                        onClickObservacao={onClickObservacao}
                    />
                    <TabelaDevolucoesAoTesouro
                        devolucoesAoTesouro={devolucoesAoTesouro}
                        valorTemplate={valorTemplate}
                    />
                    <TabelaExecucaoFisica
                        itensDashboard={itensDashboard}
                        retornaQtdePorStatus={retornaQtdePorStatus}
                        retornaNaoApresentadas={retornaNaoApresentadas}
                    />
                </div>
                <section>
                    <ModalComentariosRelatorioConsolidadoApuracao
                        show={showModalObservacao}
                        handleClose={onHandleClose}
                        observacao={observacao}
                        onChangeObservacao={onChangeObservacao}
                        onSalvarObservacao={onSalvarObservacao}
                        onDeletarObeservacao={onDeletarObeservacao}
                        titulo="Edição de comentário"
                        primeiroBotaoTexto="Cancelar"
                        primeiroBotaoCss="outline-success"
                        segundoBotaoCss="success"
                        segundoBotaoTexto="Confirmar"
                    />
                </section>
            </div>
        </>
    )
};