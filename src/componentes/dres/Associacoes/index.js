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
            console.log("Associacoes ", associacoes);
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
            console.log("Contas ", contas);

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
                {rowData['nome'] ? <strong>{rowData['nome']}</strong> : ''}
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
            <div>
                <li className="nav-item dropdown link-acoes">
                    <a href="#" id="linkDropdownAcoes" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <button className="btn-acoes"><span className="btn-acoes-dots">...</span></button>
                    </a>

                    <div className="dropdown-menu dropdown-menu-opcoes " aria-labelledby="linkDropdownAcoes">
                        <button onClick={()=>buscaAssociacao(rowData.uuid, "/dre-dados-da-unidade-educacional")} className="btn btn-link dropdown-item" type="button">Ver dados unidade</button>
                        <button onClick={()=>buscaAssociacao(rowData.uuid, "/dre-regularidade-unidade-educacional")} className="btn btn-link dropdown-item" type="button">Ver regularidade</button>
                        <button onClick={()=>buscaAssociacao(rowData.uuid, "/cadastro-de-despesa")} className="btn btn-link dropdown-item" type="button">Ver situação financeira</button>
                        {urlRedirect &&
                            <Redirect
                                to={{
                                    pathname: urlRedirect,
                                }}
                            />
                        }
                    </div>
                </li>
            </div>
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