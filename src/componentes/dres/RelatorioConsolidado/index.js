import React, {useEffect, useState} from "react";
import {getFiqueDeOlho, getConsultarStatus, getTiposConta} from "../../../services/dres/RelatorioConsolidado.service";
import {getItensDashboard, getPeriodos} from "../../../services/dres/Dashboard.service";
import {SelectPeriodo} from "./SelectPeriodo";
import {SelectConta} from "./SelectConta";
import {MsgImgCentralizada} from "../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../assets/img/img-404.svg";
import {TrilhaDeStatus} from "./TrilhaDeStatus";
import {visoesService} from "../../../services/visoes.service";
import {BarraDeStatus} from "./BarraDeStatus";
import './relatorio-consolidado.scss'

export const RelatorioConsolidado = () => {

    const dre_uuid = visoesService.getItemUsuarioLogado('associacao_selecionada.uuid');

    const [fiqueDeOlho, setFiqueDeOlho] = useState("");
    const [periodos, setPeriodos] = useState(false);
    const [periodoEscolhido, setPeriodoEsolhido] = useState(false);
    const [itensDashboard, setItensDashboard] = useState(false);
    const [contas, setContas] = useState(false);
    const [contaEscolhida, setContaEscolhida] = useState(false);
    const [statusRelatorio, setStatusRelatorio] = useState(false);

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

    const carregaPeriodos = async () => {
        let periodos = await getPeriodos();
        setPeriodos(periodos);
        if (periodos && periodos.length > 0){
            setPeriodoEsolhido(periodos[0].uuid)
        }
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
        let fique_de_olho = await getFiqueDeOlho();
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

    const consultarStatus = async () =>{
        if (dre_uuid && periodoEscolhido && contaEscolhida){
            let status = await getConsultarStatus(dre_uuid, periodoEscolhido, contaEscolhida);
            setStatusRelatorio(status);
        }
    };

    const onClickVerRelatorio = () =>{
        window.location.assign(`/dre-relatorio-consolidado-apuracao/${periodoEscolhido}/${contaEscolhida}/`)
    };

    return (
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
                    />
                }
                {periodoEscolhido && itensDashboard ? (
                    <TrilhaDeStatus
                        retornaQtdeStatus={retornaQtdeStatus}
                        retornaQtdeStatusTotal={retornaQtdeStatusTotal}
                    />
                ):
                    <MsgImgCentralizada
                        texto='Selecione um período acima para visualizar as ações'
                        img={Img404}
                    />
                }
            </div>
        </>
    )
};