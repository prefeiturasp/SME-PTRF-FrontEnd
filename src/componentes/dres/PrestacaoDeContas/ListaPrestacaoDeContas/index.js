import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import {PaginasContainer} from "../../../../paginas/PaginasContainer";
import {getPeriodos} from "../../../../services/dres/Dashboard.service";
import {TopoSelectPeriodoBotaoVoltar} from "./TopoSelectPeriodoBotaoVoltar";
import {getPrestacoesDeContas, getQtdeUnidadesDre, getPrestacoesDeContasPorDrePeriodo} from "../../../../services/dres/PrestacaoDeContas.service";
import {BarraDeStatus} from "./BarraDeStatus";
import {FormFiltros} from "./FormFiltros";
import "../prestacao-de-contas.scss"
import {getTabelaAssociacoes} from "../../../../services/dres/Associacoes.service";

export const ListaPrestacaoDeContas= () => {

    let {periodo_uuid, status_prestacao} = useParams();

    const initialStateFiltros = {
        filtrar_por_termo: "",
        filtrar_por_tipo_de_unidade: "",
        filtrar_por_status: "",
    };

    const [periodos, setPeriodos] = useState(false);
    const [periodoEscolhido, setPeriodoEsolhido] = useState(false);
    const [statusPrestacao, setStatusPrestacao] = useState("");
    const [prestacaoDeContas, setPrestacaoDeContas] = useState(false);
    const [qtdeUnidadesDre, setQtdeUnidadesDre] = useState(false);
    const [tabelaAssociacoes, setTabelaAssociacoes] = useState({});
    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);

    useEffect(() => {
        carregaPeriodos();
        carregaStatus();
        carregaQtdeUnidadesDre();
        buscaTabelaAssociacoes();
    }, []);


    useEffect(() => {
        carregaPrestacoesDeContas();
    }, [periodoEscolhido]);

    useEffect(() => {
        carregaPrestacoesDeContas();
    }, [statusPrestacao]);


    const carregaPeriodos = async () => {
        let periodos = await getPeriodos();
        setPeriodos(periodos);
        if (periodo_uuid){
            setPeriodoEsolhido(periodo_uuid)
        }else if (periodos && periodos.length > 0){
            setPeriodoEsolhido(periodos[0].uuid)
        }
    };

    const carregaStatus = async  ()=>{
        if (status_prestacao !== undefined){
            setStatusPrestacao(status_prestacao)
            setStateFiltros({
                ...stateFiltros,
                filtrar_por_status: status_prestacao
            });
        }
    }

    const carregaPrestacoesDeContas = async ()=>{
        if (periodoEscolhido){
            let prestacoes_de_contas = await getPrestacoesDeContas(periodoEscolhido, stateFiltros.filtrar_por_termo, stateFiltros.filtrar_por_tipo_de_unidade, stateFiltros.filtrar_por_status);
            console.log("Prestacoes de contas ", prestacoes_de_contas);
            setPrestacaoDeContas(prestacoes_de_contas)
        }
    };

    const carregaPrestacoesDeContasPorDrePeriodo = async ()=>{
        let prestacoes_de_contas = await getPrestacoesDeContas(periodoEscolhido);
        setPrestacaoDeContas(prestacoes_de_contas)
    };

    const carregaQtdeUnidadesDre = async () =>{
        let qtde_unidades = await getQtdeUnidadesDre();
        //console.log("QTDE ", qtde_unidades.qtd-unidades)
        setQtdeUnidadesDre(85)
    };

    const buscaTabelaAssociacoes = async ()=>{
        let tabela_associacoes = await getTabelaAssociacoes();
        setTabelaAssociacoes(tabela_associacoes);
    };

    const exibeLabelStatus = ()=>{

        if (statusPrestacao === 'NAO_RECEBIDA'){
            return 'não recebidas'
        }else if (statusPrestacao === 'RECEBIDA'){
            return 'recebidas'
        }else if (statusPrestacao === 'EM_ANALISE'){
            return 'em análise'
        }else if (statusPrestacao === 'DEVOLVIDA'){
            return 'devolvidas para acerto'
        }else if (statusPrestacao === 'APROVADA'){
            return 'aprovadas'
        }else if (statusPrestacao === 'REPROVADA'){
            return 'reprovadas'
        }
    };


    const handleChangePeriodos = async (uuid_periodo) => {
        setPeriodoEsolhido(uuid_periodo)
    };

    const handleChangeFiltros = (name, value) => {
        setStateFiltros({
            ...stateFiltros,
            [name]: value
        });
    };

    const handleSubmitFiltros = async (event)=>{
        event.preventDefault();
        await carregaPrestacoesDeContas();
    };

    const limpaFiltros = async () => {
        await setStateFiltros(initialStateFiltros)
        await carregaPrestacoesDeContasPorDrePeriodo();
    };

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Acompanhamento das Prestações de Contas</h1>
            <div className="page-content-inner">
                <TopoSelectPeriodoBotaoVoltar
                    periodos={periodos}
                    periodoEscolhido={periodoEscolhido}
                    handleChangePeriodos={handleChangePeriodos}
                />
                <BarraDeStatus
                    qtdeUnidadesDre={qtdeUnidadesDre}
                    prestacaoDeContas={prestacaoDeContas}
                    statusDasPrestacoes={exibeLabelStatus(statusPrestacao)}
                />

                <p className='titulo-explicativo mt-4 mb-4'>Prestações de contas pendentes de análise e recebimento</p>

                <FormFiltros
                    stateFiltros={stateFiltros}
                    tabelaAssociacoes={tabelaAssociacoes}
                    handleChangeFiltros={handleChangeFiltros}
                    handleSubmitFiltros={handleSubmitFiltros}
                    limpaFiltros={limpaFiltros}
                />

            </div>
        </PaginasContainer>
    )
};