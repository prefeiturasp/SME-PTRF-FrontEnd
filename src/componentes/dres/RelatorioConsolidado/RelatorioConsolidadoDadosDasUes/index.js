import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useParams} from "react-router-dom";
import {visoesService} from "../../../../services/visoes.service";
import {auxGetNomes} from "../auxGetNomes";
import {TopoComBotoes} from "./TopoComBotoes";
import {getListaPrestacaoDeContasDaDre, getTiposDeUnidade, getStatusPc} from "../../../../services/dres/RelatorioConsolidado.service";
import TabelaListaPrestacoesDaDre from "./TabelaListaPrestacoesDaDre";
import {FormFiltros} from "./FormFiltros";

export const RelatorioConsolidadoDadosDasUes = () => {

    let {periodo_uuid, conta_uuid} = useParams();

    const dre_uuid = visoesService.getItemUsuarioLogado('associacao_selecionada.uuid');

    const initialStateFiltros = {
        filtrar_por_ue: "",
        filtrar_por_tipo_unidade: "",
        filtrar_por_status_pc: "",
    };

    const [periodoNome, setPeriodoNome] = useState('');
    const [contaNome, setContaNome] = useState('');
    const [listaPrestacoes, setListaPrestacoes] = useState([]);
    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);
    const [tiposDeUnidade, setTiposDeUnidade] = useState([]);
    const [statusPc, setStatusPc] = useState([]);

    const carregaListaPrestacaoDeContasDaDre = useCallback(async ()=>{
        let lista_de_prestacoes = await getListaPrestacaoDeContasDaDre(dre_uuid, periodo_uuid, conta_uuid);
        setListaPrestacoes(lista_de_prestacoes)
    }, [dre_uuid, periodo_uuid, conta_uuid]);

    const carregaTiposDeUnidade = useCallback(async () => {
        let tipos = await getTiposDeUnidade();
        setTiposDeUnidade(tipos.tipos_unidade)
    }, []);

    const carregaStatusPc = useCallback(async () => {
        let status = await getStatusPc();
        console.log("STATUS ", status.status)
        setStatusPc(status.status)
    }, []);

    useEffect(()=>{
        carregaNomePeriodo();
        carregaNomeConta();
        //carregaTiposDeUnidade();
    });

    useEffect(()=>{
        carregaListaPrestacaoDeContasDaDre()
    }, [carregaListaPrestacaoDeContasDaDre]);

    useEffect(()=>{
        carregaTiposDeUnidade()
    }, [carregaTiposDeUnidade]);

    useEffect(()=>{
        carregaStatusPc()
    }, [carregaStatusPc]);


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



    const valorTemplate = (valor) => {
        let valor_formatado = Number(valor).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        valor_formatado = valor_formatado.replace(/R/, "").replace(/\$/, "");
        return valor_formatado
    };

    const handleChangeFiltros = (name, value) => {
        setStateFiltros({
            ...stateFiltros,
            [name]: value
        });
    };

    const limpaFiltros = async () => {
        await setStateFiltros(initialStateFiltros);
    };

    const handleSubmitFiltros = async (event) => {
        console.log("handleSubmitFiltros ", stateFiltros)
        event.preventDefault();
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
                    <FormFiltros
                        handleChangeFiltros={handleChangeFiltros}
                        limpaFiltros={limpaFiltros}
                        handleSubmitFiltros={handleSubmitFiltros}
                        stateFiltros={stateFiltros}
                        tiposDeUnidade={tiposDeUnidade}
                        statusPc={statusPc}
                    />
                    <TabelaListaPrestacoesDaDre
                        listaPrestacoes={listaPrestacoes}
                        valorTemplate={valorTemplate}
                    />
                </div>
            </div>
        </>
    )
};