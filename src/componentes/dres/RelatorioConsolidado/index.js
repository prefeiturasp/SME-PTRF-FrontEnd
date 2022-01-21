import React, {useEffect, useState} from "react";
import {getFiqueDeOlhoRelatoriosConsolidados, getConsultarStatus, getTiposConta, getDownloadRelatorio, postGerarPreviaRelatorio, postGerarLauda, getStatusAta} from "../../../services/dres/RelatorioConsolidado.service";
import {getItensDashboard, getPeriodos} from "../../../services/dres/Dashboard.service";
import {SelectPeriodo} from "./SelectPeriodo";
import {SelectConta} from "./SelectConta";
import {MsgImgCentralizada} from "../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../assets/img/img-404.svg";
import {TrilhaDeStatus} from "./TrilhaDeStatus";
import {visoesService} from "../../../services/visoes.service";
import {BarraDeStatus} from "./BarraDeStatus";
import {ExecucaoFinanceira} from "./ExecucaoFinanceira";
import { AtaParecerTecnico } from "./AtaParecerTecnico";
import './relatorio-consolidado.scss'
import Loading from "../../../utils/Loading";
import { ModalMsgGeracaoRelatorio, ModalMsgGeracaoLauda } from "./ModalMsgGeracaoRelatorio";

export const RelatorioConsolidado = () => {

    const dre_uuid = visoesService.getItemUsuarioLogado('associacao_selecionada.uuid');

    const [fiqueDeOlho, setFiqueDeOlho] = useState("");
    const [periodos, setPeriodos] = useState(false);
    const [periodoEscolhido, setPeriodoEsolhido] = useState(false);
    const [itensDashboard, setItensDashboard] = useState(false);
    const [contas, setContas] = useState(false);
    const [contaEscolhida, setContaEscolhida] = useState(false);
    const [statusRelatorio, setStatusRelatorio] = useState(false);
    const [totalEmAnalise, setTotalEmAnalise] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showModalMsgGeracaoRelatorio, setShowModalMsgGeracaoRelatorio] = useState(false);
    const [showModalMsgGeracaoLauda, setShowModalMsgGeracaoLauda] = useState(false);
    const [msgGeracaoRelatorio, setMsgGeracaoRelatorio] = useState('');
    const [msgGeracaoLauda, setMsgGeracaoLauda] = useState('');
    const [ataParecerTecnico, setAtaParecerTecnico] = useState({});

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
        buscaFiqueDeOlho();
    }, []);

    useEffect(() => {
        carregaPeriodos();
    }, []);

    useEffect(() => {
        carregaContas();
    }, []);

    useEffect(() => {
        carregaItensDashboard();
    }, [periodoEscolhido]);

    useEffect(() => {
        consultarStatus();
    }, [periodoEscolhido, contaEscolhida]);

    useEffect(() => {
        retornaQtdeEmAnalise();
    }, [itensDashboard]);

    useEffect(() => {
        consultarStatusAta();
    }, [periodoEscolhido]);

    const carregaPeriodos = async () => {
        let periodos = await getPeriodos();
        setPeriodos(periodos);
        if (periodos && periodos.length > 0){
            setPeriodoEsolhido(periodos[0].uuid)
        }
    };

    const setaStatusComoProcessando = () => {
        const statusProcessando = {
            pcs_em_analise: false,
            status_geracao: "EM_PROCESSAMENTO",
            status_txt: "Análise de prestações de contas das associações completa. Relatório em processamento.",
            cor_idx: 3,
            status_arquivo: "Previa do relatório sendo gerada. Aguarde."
        }
        setStatusRelatorio(statusProcessando);
    };

    const carregaContas = async () => {
        try {
            let tipo_contas = await getTiposConta();
            setContas(tipo_contas);
            if (tipo_contas && tipo_contas.length > 0){
                setContaEscolhida(tipo_contas[0].uuid)
            }
        }catch (e) {
            console.log("Erro ao trazer os tipos de contas ", e);
        }
    };

    const carregaItensDashboard = async () =>{
        if (periodoEscolhido){
            let itens = await getItensDashboard(periodoEscolhido);
            setItensDashboard(itens)
        }
    };

    const buscaFiqueDeOlho = async () => {
        let fique_de_olho = await getFiqueDeOlhoRelatoriosConsolidados();
        setFiqueDeOlho(fique_de_olho.detail);
    };

    const handleChangePeriodos = async (uuid_periodo) => {
        setPeriodoEsolhido(uuid_periodo)
    };

    const handleChangeContas = async (uuid_conta) => {
        setContaEscolhida(uuid_conta)
    };

    const retornaQtdeStatus = (status) => {
        let item = itensDashboard.cards.find(element => element.status === status);
        let qtde_itens = item.quantidade_prestacoes;
        if (qtde_itens <= 9){
            return '0' + qtde_itens;
        }else {
            return qtde_itens.toString();
        }
    };

    const retornaQtdeStatusTotal = () =>{
        if (itensDashboard) {
            let total = itensDashboard.cards.filter(elemtent => elemtent.status === 'APROVADA' || elemtent.status === 'REPROVADA').reduce((total, valor) => total + valor.quantidade_prestacoes, 0);
            if (total <= 9){
                return '0' + total;
            }else {
                return total.toString();
            }
        }
    };

    const retornaQtdeEmAnalise = () => {
        if (itensDashboard) {
            let total = itensDashboard.cards.filter(elemtent => elemtent.status === 'RECEBIDA' || elemtent.status === 'DEVOLVIDA' || elemtent.status === 'EM_ANALISE').reduce((total, valor) => total + valor.quantidade_prestacoes, 0);
            setTotalEmAnalise(total)
        }
    };

    const consultarStatus = async () =>{
        if (dre_uuid && periodoEscolhido && contaEscolhida){
            let status = await getConsultarStatus(dre_uuid, periodoEscolhido, contaEscolhida);
            setStatusRelatorio(status);
        }
    };

    const consultarStatusAta = async() => {
        if(dre_uuid && periodoEscolhido){
            let ata = await getStatusAta(dre_uuid, periodoEscolhido);
            setAtaParecerTecnico(ata)
        }
    }

    const onClickVerRelatorio = () =>{
        window.location.assign(`/dre-relatorio-consolidado-apuracao/${periodoEscolhido}/${contaEscolhida}/`)
    };

    const onClickVerAta = (uuid_ata) =>{
        window.location.assign(`/visualizacao-da-ata-parecer-tecnico/${uuid_ata}/`)
    };

    const textoBtnRelatorio = () =>{
        if(statusRelatorio.versao === "FINAL"){
            if (statusRelatorio.status_geracao === 'GERADO_TOTAL'){
                return 'Documento gerado'
            }else if (statusRelatorio.status_geracao === 'GERADO_PARCIAL'){
                return 'Documento parcial gerado'
            }else if (statusRelatorio.status_geracao === 'NAO_GERADO'){
                return 'Documento não gerado'
            }else if (statusRelatorio.status_geracao === "EM_PROCESSAMENTO"){
                return 'Relatório sendo gerado...'
            }
        }

        return 'Documento não gerado'        
    };

    const gerarPrevia = async () => {
        let parcial = totalEmAnalise > 0;
        const payload = {
            dre_uuid: dre_uuid,
            periodo_uuid: periodoEscolhido,
            tipo_conta_uuid: contaEscolhida,
            parcial: parcial
        };

        try{
            await postGerarPreviaRelatorio(payload);
            console.log('Solicitação de previa do relatório enviada com sucesso.');
            setMsgGeracaoRelatorio('O relatório está sendo gerado, enquanto isso você pode continuar a usar o sistema. Quando a geração for concluída um botão para download ficará disponível.');
            setShowModalMsgGeracaoRelatorio(true);
            setaStatusComoProcessando();
        }catch(e){
            setMsgGeracaoRelatorio('Erro ao gerar relatório');
            setShowModalMsgGeracaoRelatorio(true);
            console.log('Erro ao gerar relatório ', e.response.data);
        }

    }

    const gerarLauda = async () => {
        let parcial = totalEmAnalise > 0;
        const payload = {
            dre_uuid: dre_uuid,
            periodo_uuid: periodoEscolhido,
            tipo_conta_uuid: contaEscolhida,
            parcial: parcial
        };

        try{
            await postGerarLauda(payload);
            console.log('Solicitação de lauda enviada com sucesso.');
            setMsgGeracaoLauda('A lauda está sendo gerada e será enviada para a central de downloads.')
            setShowModalMsgGeracaoLauda(true);
        }catch(e){
            setMsgGeracaoLauda('Erro ao gerar lauda.')
            setShowModalMsgGeracaoLauda(true);
            console.log('Erro ao gerar lauda ', e.response.data);
        }
    }

    const downloadRelatorio = async () =>{
        await getDownloadRelatorio(dre_uuid, periodoEscolhido, contaEscolhida, statusRelatorio.versao);
    };

    const downloadPreviaRelatorio = async () =>{
        await getDownloadRelatorio(dre_uuid, periodoEscolhido, contaEscolhida, statusRelatorio.versao);
    };

    const onHandleClose = () => {
        setShowModalMsgGeracaoRelatorio(false);
    };

    const onHandleCloseModalMsgLauda = () => {
        setShowModalMsgGeracaoLauda(false);
    };

    return (
        <>
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
                    <div className="col-12 container-texto-introdutorio mb-4 mt-3">
                        <div dangerouslySetInnerHTML={{__html: fiqueDeOlho}}/>
                    </div>
                    <div className="page-content-inner pt-0">
                        {statusRelatorio &&
                        <BarraDeStatus
                            statusRelatorio={statusRelatorio}
                        />
                        }
                        <SelectPeriodo
                            periodos={periodos}
                            periodoEscolhido={periodoEscolhido}
                            handleChangePeriodos={handleChangePeriodos}
                        />
                        {periodoEscolhido &&
                        <SelectConta
                            contas={contas}
                            contaEscolhida={contaEscolhida}
                            handleChangeContas={handleChangeContas}
                            onClickVerRelatorio={onClickVerRelatorio}
                            gerarLauda={gerarLauda}
                        />
                        }
                        {periodoEscolhido && itensDashboard ? (
                                <>
                                    <TrilhaDeStatus
                                        retornaQtdeStatus={retornaQtdeStatus}
                                        retornaQtdeStatusTotal={retornaQtdeStatusTotal}
                                    />
                                    <ExecucaoFinanceira
                                        statusRelatorio={statusRelatorio}
                                        textoBtnRelatorio={textoBtnRelatorio}
                                        downloadRelatorio={downloadRelatorio}
                                        gerarPrevia={gerarPrevia}
                                        downloadPreviaRelatorio={downloadPreviaRelatorio}
                                    />
                                    
                                    {statusRelatorio.versao === "FINAL" && ataParecerTecnico &&
                                        <AtaParecerTecnico
                                            statusRelatorio={statusRelatorio}
                                            ataParecerTecnico={ataParecerTecnico}
                                            onClickVerAta={onClickVerAta}
                                        />
                                    }
                                </>

                            ) :
                            <MsgImgCentralizada
                                texto='Selecione um período acima para visualizar as ações'
                                img={Img404}
                            />
                        }

                        <section>
                            <ModalMsgGeracaoRelatorio
                                show={showModalMsgGeracaoRelatorio}
                                handleClose={onHandleClose}
                                titulo='Geração do relatório'
                                texto={msgGeracaoRelatorio}
                            />
                        </section>

                        <section>
                            <ModalMsgGeracaoLauda
                                show={showModalMsgGeracaoLauda}
                                handleClose={onHandleCloseModalMsgLauda}
                                titulo='Geração da lauda'
                                texto={msgGeracaoLauda}
                            />
                        </section>

                    </div>
                </>
            }
        </>
    )
};