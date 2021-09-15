import React, {useEffect, useState} from "react";
import {Redirect} from "react-router-dom";
import {getTabelaAssociacoes, getAssociacoesPorUnidade, filtrosAssociacoes, getAssociacao, getContasAssociacao} from "../../../services/dres/Associacoes.service";
import "./associacoes.scss"
import {TabelaAssociacoes} from "./TabelaAssociacoes";
import {FiltrosAssociacoes} from "./FiltrosAssociacoes";
import Loading from "../../../utils/Loading";
import Img404 from "../../../assets/img/img-404.svg";
import {MsgImgCentralizada} from "../../Globais/Mensagens/MsgImgCentralizada";
import {MsgImgLadoDireito} from "../../Globais/Mensagens/MsgImgLadoDireito";
import {DADOS_DA_ASSOCIACAO} from "../../../services/auth.service";
import {visoesService} from "../../../services/visoes.service";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye} from "@fortawesome/free-solid-svg-icons";

export const Associacoes = () =>{

    const rowsPerPage = 15;

    const initialStateFiltros = {
        unidade_escolar_ou_associacao: "",
        regularidade: "",
        tipo_de_unidade: "",
    };

    const [loading, setLoading] = useState(true);
    const [tabelaAssociacoes, setTabelaAssociacoes] = useState({});
    const [associacoes, setAssociacoes] = useState([]);
    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);
    const [buscaUtilizandoFiltros, setBuscaUtilizandoFiltros] = useState(false);
    const [urlRedirect, setRrlRedirect] = useState('');

    useEffect(()=>{
        buscaTabelaAssociacoes();
    }, []);

    useEffect(()=>{
        buscaAssociacoesPorUnidade();
    }, []);

    const buscaTabelaAssociacoes = async ()=>{
        let tabela_associacoes = await getTabelaAssociacoes();
        setTabelaAssociacoes(tabela_associacoes);
    };

    const buscaAssociacoesPorUnidade = async ()=>{
        try {
            let associacoes = await getAssociacoesPorUnidade();
            setAssociacoes(associacoes);
        }catch (e) {
            console.log("Erro ao buscar associacoes ", e)
        }
        setLoading(false)
    };

    const buscaAssociacao = async (uuid_associacao, url_redirect)=>{
        setLoading(true);
        try {
            let associacao = await getAssociacao(uuid_associacao);
            let contas = await getContasAssociacao(uuid_associacao);

            let dados_da_associacao = {
                dados_da_associacao:{
                    ...associacao,
                    contas
                }
            };
            localStorage.setItem(DADOS_DA_ASSOCIACAO, JSON.stringify(dados_da_associacao ));
            setRrlRedirect(url_redirect)
        }catch (e) {
            console.log("Erro ao buscar associacoes ", e)
        }
        setLoading(false);
    };

    const unidadeEscolarTemplate = (rowData) =>{
        return (
            <div>
                {rowData['unidade']['nome_com_tipo'] ? <strong>{rowData['unidade']['nome_com_tipo']}</strong> : ''}
            </div>
        )
    };

    const statusRegularidadeTemplate = (rowData) =>{
        let label_status_reguralidade;
        if (rowData['status_regularidade'] === "PENDENTE"){
            label_status_reguralidade = "Pendente"
        }else if (rowData['status_regularidade'] === "REGULAR"){
            label_status_reguralidade = "Regular"
        }
        return (
            <div className={`status-regularidade-${rowData['status_regularidade'].toLowerCase()}`}>
                {rowData['status_regularidade'] ? <strong>{label_status_reguralidade}</strong> : ''}
            </div>
        )
    };

    const acoesTemplate = (rowData) =>{
        return (
                <>

                    <button
                        onClick={()=>buscaAssociacao(rowData.uuid, "/dre-detalhes-associacao")}
                        className="btn btn-link"
                        disabled={
                            visoesService.getPermissoes(["access_dados_unidade_dre"])       || 
                            visoesService.getPermissoes(["access_regularidade_dre"])        || 
                            visoesService.getPermissoes(["access_situacao_financeira_dre"]) ||
                            visoesService.getPermissoes(['access_processo_sei'])? false : true
                        }
                    >
                        <FontAwesomeIcon
                            style={{marginRight: "0", color: '#00585E'}}
                            icon={faEye}
                        />

                        {urlRedirect &&
                            <Redirect
                                to={{
                                    pathname: urlRedirect,
                                }}
                            />
                        }
                    </button>
                
                </>
        )
    };

    const handleChangeFiltrosAssociacao = (name, value) => {
        setStateFiltros({
            ...stateFiltros,
            [name]: value
        });
    };

    const handleSubmitFiltrosAssociacao = async (event)=>{
        setLoading(true);
        setBuscaUtilizandoFiltros(true);
        event.preventDefault();
        let resultado_filtros = await filtrosAssociacoes(stateFiltros.unidade_escolar_ou_associacao, stateFiltros.regularidade, stateFiltros.tipo_de_unidade);
        setAssociacoes(resultado_filtros);
        setLoading(false)
    };

    const limpaFiltros = async () => {
        setLoading(true);
        setStateFiltros(initialStateFiltros);
        await buscaAssociacoesPorUnidade();
        setLoading(false)
    };

    return(
        <>
            <FiltrosAssociacoes
                tabelaAssociacoes={tabelaAssociacoes}
                stateFiltros={stateFiltros}
                handleChangeFiltrosAssociacao={handleChangeFiltrosAssociacao}
                handleSubmitFiltrosAssociacao={handleSubmitFiltrosAssociacao}
                limpaFiltros={limpaFiltros}
            />
            {loading ? (
                    <Loading
                        corGrafico="black"
                        corFonte="dark"
                        marginTop="0"
                        marginBottom="0"
                    />
                ) :
                associacoes && associacoes.length > 0 ? (
                <>
                    <TabelaAssociacoes
                        associacoes={associacoes}
                        rowsPerPage={rowsPerPage}
                        unidadeEscolarTemplate={unidadeEscolarTemplate}
                        statusRegularidadeTemplate={statusRegularidadeTemplate}
                        acoesTemplate={acoesTemplate}
                    />
                </>
                ) :
                buscaUtilizandoFiltros ?
                    <MsgImgCentralizada
                        texto='Não encontramos resultados, verifique os filtros e tente novamente.'
                        img={Img404}
                    />
                :
                    <MsgImgLadoDireito
                        texto='Não encontramos nenhuma Associação com este perfil, tente novamente'
                        img={Img404}
                    />
            }

        </>
    )
};