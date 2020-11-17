import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {visoesService} from "../../../../services/visoes.service";
import {auxGetNomes} from "../auxGetNomes";
import {TopoComBotoes} from "./TopoComBotoes";

export const RelatorioConsolidadoDadosDasUes = () => {

    let {periodo_uuid, conta_uuid} = useParams();

    const dre_uuid = visoesService.getItemUsuarioLogado('associacao_selecionada.uuid');

    const [periodoNome, setPeriodoNome] = useState('');
    const [contaNome, setContaNome] = useState('');

    useEffect(()=>{
        carregaNomePeriodo();
        carregaNomeConta();
    });

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


    return (
        <>
            <div className="col-12 container-visualizacao-da-ata mb-5">
                <div className="col-12 mt-5">
                    <TopoComBotoes
                        periodoNome={periodoNome}
                        contaNome={contaNome}
                        periodo_uuid={periodo_uuid}
                        conta_uuid={conta_uuid}
                    />
                </div>
            </div>
        </>
    )
};