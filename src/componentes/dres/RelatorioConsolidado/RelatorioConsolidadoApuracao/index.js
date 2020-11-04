import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {getItensDashboard, getPeriodos} from "../../../../services/dres/Dashboard.service";
import {InfoAssociacoesEmAnalise} from "./InfoAssociacoesEmAnalise";
import {exibeDataPT_BR} from "../../../../utils/ValidacoesAdicionaisFormularios";
import {getTiposConta, getExecucaoFinanceira, getDevolucoesContaPtrf} from "../../../../services/dres/RelatorioConsolidado.service";
import {TopoComBotoes} from "./TopoComBotoes";
import {BoxConsultarDados} from "./BoxConsultarDados";
import {visoesService} from "../../../../services/visoes.service";
import {TabelaExecucaoFinanceira} from "./TabelaExecucaoFinanceira";
import {JustificativaDiferenca} from "./JustificativaDiferenca";
import {DevolucoesContaPtrf} from "./DevolucoesContaPtrf";

export const RelatorioConsolidadoApuracao = () =>{

    let {periodo_uuid, conta_uuid} = useParams();

    const dre_uuid = visoesService.getItemUsuarioLogado('associacao_selecionada.uuid');

    const [itensDashboard, setItensDashboard] = useState(false);
    const [totalEmAnalise, setTotalEmAnalise] = useState(0);
    const [periodoNome, setPeriodoNome] = useState('');
    const [contaNome, setContaNome] = useState('');
    const [execucaoFinanceira, setExecucaoFinanceira] = useState(false);
    const [justificativaDiferenca, setJustificativaDiferenca] = useState('');
    const [devolucoesContaPtrf, setDevolucoesContaPtrf] = useState(false);

    useEffect(() => {
        carregaItensDashboard();
    }, []);

    useEffect(() => {
        carregaPeriodos();
        carregaContas();
        retornaQtdeEmAnalise();
        carregaExecucaoFinanceira();
        carregaDevolucoesContaPtrf();
    }, [itensDashboard]);

    const carregaItensDashboard = async () =>{
        if (periodo_uuid){
            let itens = await getItensDashboard(periodo_uuid);
            setItensDashboard(itens)
        }
    };

    const carregaPeriodos = async () => {
        if (periodo_uuid){
            let periodos = await getPeriodos();
            if (periodos.length > 0 ){
                let periodo_obj = periodos.find(element => element.uuid === periodo_uuid);
                let periodo_nome;
                periodo_nome = periodo_obj.referencia + " - ";
                periodo_nome += periodo_obj.data_inicio_realizacao_despesas ? exibeDataPT_BR(periodo_obj.data_inicio_realizacao_despesas) : "-";
                periodo_nome += " até ";
                periodo_nome += periodo_obj.data_fim_realizacao_despesas ? exibeDataPT_BR(periodo_obj.data_fim_realizacao_despesas) : "-";

                setPeriodoNome(periodo_nome);
            }
        }
    };

    const carregaContas = async () => {
        try {
            let tipo_contas = await getTiposConta();
            if (tipo_contas && tipo_contas.length > 0){
                let tipo_conta_obj = tipo_contas.find(element => element.uuid === conta_uuid);
                setContaNome(tipo_conta_obj.nome)
            }
        }catch (e) {
            console.log("Erro ao trazer os tipos de contas ", e);
        }
    };

    const carregaExecucaoFinanceira = async () =>{
        try {
            let execucao = await getExecucaoFinanceira(dre_uuid, periodo_uuid, conta_uuid);
            setExecucaoFinanceira(execucao);
            console.log("carregaExecucaoFinanceira ", execucao)
        }catch (e) {
            console.log("Erro ao carregar execução financeira ", e)
        }
    };

    const carregaDevolucoesContaPtrf = async () =>{
        try {
            let devolucoes = await getDevolucoesContaPtrf(dre_uuid, periodo_uuid, conta_uuid);
            console.log("Devoluções a conta PTRF ", devolucoes)

            let obj_fake = [
                {'detalhe_tipo_receita__nome': 'Devolução à conta tipo 1', 'ocorrencias': 999, 'valor': 3000.00},
                {'detalhe_tipo_receita__nome': 'Devolução à conta tipo 2', 'ocorrencias': 100, 'valor': 2000.00},
                {'detalhe_tipo_receita__nome': 'Devolução à conta tipo 3', 'ocorrencias': 200, 'valor': 1000.00},
            ]

            setDevolucoesContaPtrf(obj_fake)
        }catch (e) {
            console.log("Erro ao carregar Devolucoes a Conta Ptrf ", e)
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

    const onSubmitJustificativaDiferenca = () =>{
        console.log("onSubmitJustificativaDiferenca ", justificativaDiferenca)
    };

    //console.log("RelatorioConsolidadoApuracao items ", itensDashboard)
    //console.log("RelatorioConsolidadoApuracao Total ", totalEmAnalise)

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
                    <BoxConsultarDados/>
                    <TabelaExecucaoFinanceira
                        execucaoFinanceira={execucaoFinanceira}
                        valorTemplate={valorTemplate}
                        comparaValores={comparaValores}
                    />
                    <JustificativaDiferenca
                        comparaValores={comparaValores}
                        justificativaDiferenca={justificativaDiferenca}
                        setJustificativaDiferenca={setJustificativaDiferenca}
                        onSubmitJustificativaDiferenca={onSubmitJustificativaDiferenca}
                    />
                    <DevolucoesContaPtrf
                        devolucoesContaPtrf={devolucoesContaPtrf}
                        valorTemplate={valorTemplate}
                    />
                </div>
            </div>
        </>
    )
};