import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import {PaginasContainer} from "../../../../paginas/PaginasContainer";
import {getPeriodos} from "../../../../services/dres/Dashboard.service";
import {TopoSelectPeriodoBotaoVoltar} from "./TopoSelectPeriodoBotaoVoltar";
import {getPrestacoesDeContas, getQtdeUnidadesDre} from "../../../../services/dres/PrestacaoDeContas.service";
import {BarraDeStatus} from "./BarraDeStatus";

export const ListaPrestacaoDeContas= () => {

    let {periodo_uuid, status_prestacao} = useParams();

    const [periodos, setPeriodos] = useState(false);
    const [periodoEscolhido, setPeriodoEsolhido] = useState(false);
    const [statusPrestacao, setStatusPrestacao] = useState("");
    const [prestacaoDeContas, setPrestacaoDeContas] = useState(false);
    const [qtdeUnidadesDre, setQtdeUnidadesDre] = useState(false);

    useEffect(() => {
        carregaPeriodos();
        carregaQtdeUnidadesDre();
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
        if (status_prestacao){
            setStatusPrestacao(status_prestacao)
        }
    };

    const carregaPrestacoesDeContas = async ()=>{
        if (periodoEscolhido){
            let prestacoes_de_contas = await getPrestacoesDeContas(periodoEscolhido, statusPrestacao);
            console.log("Prestacoes de contas ", prestacoes_de_contas);
            setPrestacaoDeContas(prestacoes_de_contas)
        }
    };

    const carregaQtdeUnidadesDre = async () =>{
        let qtde_unidades = await getQtdeUnidadesDre();
        //console.log("QTDE ", qtde_unidades.qtd-unidades)
        setQtdeUnidadesDre(85)
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
            </div>
        </PaginasContainer>
    )
};