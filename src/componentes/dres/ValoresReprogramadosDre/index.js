import React, {useEffect, useState} from "react";
import "./valoresReprogramadosDre.scss"
import { Cabecalho } from "./Cabecalho";
import { Filtros } from "./Filtros";
import { TabelaValoresReprogramados } from "./TabelaValoresReprogramados";
import { 
    getListaValoresReprogramados,
    filtrosListaValoresReprogramados,
    getTabelaValoresReprogramados
} from "../../../services/dres/ValoresReprogramadosDre.service";
import {
    getTabelaAssociacoes,
} from "../../../services/dres/Associacoes.service";
import { getUnidade } from "../../../services/dres/Unidades.service";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import Loading from "../../../utils/Loading";
import Img404 from "../../../assets/img/img-404.svg";
import {MsgImgCentralizada} from "../../Globais/Mensagens/MsgImgCentralizada";
import {MsgImgLadoDireito} from "../../Globais/Mensagens/MsgImgLadoDireito";


export const ValoresReprogramadosDre = () =>{
    // Tabela Valores Reprogramados
    const rowsPerPage = 10;
    // Filtros

    // O critério da história pede que venha por padrão filtrado pelos status:
    const statusPadrao = ["NAO_FINALIZADO", "EM_CONFERENCIA_DRE", "EM_CORRECAO_UE"]

    const initialStateFiltros = {
        filtro_search: "",
        filtro_tipo_unidade: "",
        filtro_status: statusPadrao,
    };

    const [listaDeValoresReprogramados, setListaDeValoresReprogramados] = useState([]);
    const [dadosDiretoria, setDadosDiretoria] = useState(null);
    const [loading, setLoading] = useState(true);
    const [buscaUtilizandoFiltros, setBuscaUtilizandoFiltros] = useState(false);
    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);
    const [tabelaAssociacoes, setTabelaAssociacoes] = useState({});
    const [tabelaValoresReprogramados, setTabelaValoresReprogramados] = useState({});

    // Consultas a API
    useEffect(()=>{
        buscaTabelaAssociacoes();
    }, []);

    useEffect(()=>{
        buscaTabelaValoresReprogramados();
    }, []);

    useEffect(() => {
        buscaDiretoria();
    }, []);

    useEffect(() => {
        buscaListaDeValoresReprogramados();
    }, [dadosDiretoria]);

    
    const buscaDiretoria = async () => {
        let diretoria = await getUnidade();
        setDadosDiretoria(diretoria);
        setLoading(false);
    };

    const buscaListaDeValoresReprogramados = async () => {
        try{
            if(dadosDiretoria && dadosDiretoria.uuid){
                let valoresReprogramados = await getListaValoresReprogramados(dadosDiretoria.uuid, statusPadrao);
                setListaDeValoresReprogramados(valoresReprogramados);
            }
        }catch (e){
            console.log("Erro ao buscar valores reprogramados ", e);
        }

        setLoading(false);
    }

    const buscaTabelaAssociacoes = async () =>{
        let tabela_associacoes = await getTabelaAssociacoes();
        setTabelaAssociacoes(tabela_associacoes);
    };

    const buscaTabelaValoresReprogramados = async () => {
        let tabela_valores_reprogramados = await getTabelaValoresReprogramados();
        setTabelaValoresReprogramados(tabela_valores_reprogramados);
    }

    // Filtros
    const handleChangeFiltros = (name, value) => {
        setStateFiltros({
            ...stateFiltros,
            [name]: value
        });
    };

    const handleOnChangeMultipleSelectStatus =  async (value) => {
        let name = "filtro_status"

        setStateFiltros({
            ...stateFiltros,
            [name]: value
        });
    }

    const handleSubmitFiltros = async (event)=>{
        setLoading(true);
        setBuscaUtilizandoFiltros(true);
        event.preventDefault();
        let resultado_filtros = await filtrosListaValoresReprogramados(
            dadosDiretoria.uuid, stateFiltros.filtro_search, 
            stateFiltros.filtro_tipo_unidade, stateFiltros.filtro_status
        );
        setListaDeValoresReprogramados(resultado_filtros);
        setLoading(false);
    };

    const limpaFiltros = async () => {
        setLoading(true);
        setStateFiltros(initialStateFiltros);
        await buscaListaDeValoresReprogramados();
        setLoading(false);
    };

    // Templates tabela
    const valorTemplateCheque = (rowData) => {
        const valorFormatado = rowData['total_conta_cheque']
            ? Number(rowData['total_conta_cheque']).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })
            : '-';
        return (<span>{valorFormatado}</span>)
    };

    const valorTemplateCartao = (rowData) => {
        const valorFormatado = rowData['total_conta_cartao']
            ? Number(rowData['total_conta_cartao']).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })
            : '-';
        return (<span>{valorFormatado}</span>)
    };

    const statusTemplate = (rowData) => {
        let status = rowData["associacao"]['status_valores_reprogramados']

        if(status === "NAO_FINALIZADO"){
            return "Não finalizado"
        }
        else if(status === "EM_CONFERENCIA_DRE"){
            return "Em conferência DRE"
        }
        else if(status === "EM_CORRECAO_UE"){
            return "Em correção UE"
        }
        else if(status === "VALORES_CORRETOS"){
            return "Valores corretos"
        }
        else{
            return ""
        }
    }
    
    const acoesTemplate = (rowData) => {
        return (
            <div>
                <button className="btn-editar-membro">
                    <FontAwesomeIcon
                        style={{fontSize: '20px', marginRight: "0", color: "#00585E"}}
                        icon={faEdit}
                    />
                </button>
            </div>
        )
    }


    return(
        <>
            <Cabecalho/>

            <Filtros
                stateFiltros={stateFiltros}
                handleChangeFiltros={handleChangeFiltros}
                handleOnChangeMultipleSelectStatus={handleOnChangeMultipleSelectStatus}
                handleSubmitFiltros={handleSubmitFiltros}
                limpaFiltros={limpaFiltros}
                tabelaAssociacoes={tabelaAssociacoes}
                tabelaValoresReprogramados={tabelaValoresReprogramados}
            />

            {loading ? (
                    <Loading
                        corGrafico="black"
                        corFonte="dark"
                        marginTop="0"
                        marginBottom="0"
                    />
                ) :
                listaDeValoresReprogramados && listaDeValoresReprogramados.length > 0 ? (
                
                    <TabelaValoresReprogramados
                        listaDeValoresReprogramados={listaDeValoresReprogramados}
                        rowsPerPage={rowsPerPage}
                        valorTemplateCheque={valorTemplateCheque}
                        valorTemplateCartao={valorTemplateCartao}
                        statusTemplate={statusTemplate}
                        acoesTemplate={acoesTemplate}
                    />
                ) :
                buscaUtilizandoFiltros ?
                    <MsgImgCentralizada
                        texto='Não encontramos resultados, verifique os filtros e tente novamente.'
                        img={Img404}
                    />
                :
                    <MsgImgLadoDireito
                        texto='Não encontramos nenhum valor reprogramado com este perfil, tente novamente'
                        img={Img404}
                    />      
            }
            
        </>
    )
}