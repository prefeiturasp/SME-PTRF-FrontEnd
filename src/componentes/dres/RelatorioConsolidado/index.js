import React, {useEffect, useState} from "react";
import {getFiqueDeOlho} from "../../../services/dres/RelatorioConsolidado.service";
import {getItensDashboard, getPeriodos} from "../../../services/dres/Dashboard.service";
import {SelectPeriodo} from "./SelectPeriodo";
import {MsgImgCentralizada} from "../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../assets/img/img-404.svg";
import {TrilhaDeStatus} from "./TrilhaDeStatus";

export const RelatorioConsolidado = () => {
    const [fiqueDeOlho, setFiqueDeOlho] = useState("");
    const [periodos, setPeriodos] = useState(false);
    const [periodoEscolhido, setPeriodoEsolhido] = useState(false);
    const [itensDashboard, setItensDashboard] = useState(false);

    useEffect(() => {
        buscaFiqueDeOlho();
    }, []);

    useEffect(() => {
        carregaPeriodos();
    }, []);

    useEffect(() => {
        carregaItensDashboard();
    }, [periodoEscolhido]);

    const carregaPeriodos = async () => {
        let periodos = await getPeriodos();
        setPeriodos(periodos);
        if (periodos && periodos.length > 0){
            setPeriodoEsolhido(periodos[0].uuid)
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

    console.log('itensDashboard ', itensDashboard)

    return (
        <>
            <div className="col-12 container-texto-introdutorio mb-4 mt-3">
                <div dangerouslySetInnerHTML={{__html: fiqueDeOlho}}/>
            </div>

            <div className="page-content-inner">
                <SelectPeriodo
                    periodos={periodos}
                    periodoEscolhido={periodoEscolhido}
                    handleChangePeriodos={handleChangePeriodos}
                />

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