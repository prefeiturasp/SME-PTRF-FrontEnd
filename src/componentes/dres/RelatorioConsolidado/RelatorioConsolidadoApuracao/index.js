import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {getItensDashboard, getPeriodos} from "../../../../services/dres/Dashboard.service";
import {InfoAssociacoesEmAnalise} from "./InfoAssociacoesEmAnalise";
import {exibeDataPT_BR} from "../../../../utils/ValidacoesAdicionaisFormularios";
import {getTiposConta, getExecucaoFinanceira} from "../../../../services/dres/RelatorioConsolidado.service";
import {TopoComBotoes} from "./TopoComBotoes";
import {BoxConsultarDados} from "./BoxConsultarDados";
import {visoesService} from "../../../../services/visoes.service";
import {TabelaExecucaoFinanceira} from "./TabelaExecucaoFinanceira";

export const RelatorioConsolidadoApuracao = () =>{

    let {periodo_uuid, conta_uuid} = useParams();

    const dre_uuid = visoesService.getItemUsuarioLogado('associacao_selecionada.uuid');

    const [itensDashboard, setItensDashboard] = useState(false);
    const [totalEmAnalise, setTotalEmAnalise] = useState(0);
    const [periodoNome, setPeriodoNome] = useState('');
    const [contaNome, setContaNome] = useState('');
    const [execucaoFinanceira, setExecucaoFinanceira] = useState(false);

    useEffect(() => {
        carregaItensDashboard();
    }, []);

    useEffect(() => {
        carregaPeriodos();
        carregaContas();
        retornaQtdeEmAnalise();
        carregaExecucaoFinanceira();
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
            setExecucaoFinanceira(execucao)
            console.log("carregaExecucaoFinanceira ", execucao)
        }catch (e) {
            console.log("Erro ao carregar execução financeira ", e)
        }

    };

    const retornaQtdeEmAnalise = () =>{
        if (itensDashboard) {
            let total = itensDashboard.cards.filter(elemtent => elemtent.status === 'RECEBIDA' || elemtent.status === 'DEVOLVIDA' || elemtent.status === 'EM_ANALISE').reduce((total, valor) => total + valor.quantidade_prestacoes, 0);
            setTotalEmAnalise(total)
        }
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
                    <TabelaExecucaoFinanceira/>
                </div>
            </div>
        </>
    )
};