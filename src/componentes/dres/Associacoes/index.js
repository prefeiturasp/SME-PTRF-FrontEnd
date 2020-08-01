import React, {useEffect, useState} from "react";
import {NavLink, Link } from "react-router-dom";
import {getTabelaAssociacoes, getAssociacoes, filtrosAssociacoes} from "../../../services/dres/Associacoes.service";
import "./associacoes.scss"
import {TabelaAssociacoes} from "./TabelaAssociacoes";
import {FiltrosAssociacoes} from "./FiltrosAssociacoes";
import Loading from "../../../utils/Loading";
import Img404 from "../../../assets/img/img-404.svg";
import {MsgImgCentralizada} from "../../Globais/Mensagens/MsgImgCentralizada";
import {MsgImgLadoDireito} from "../../Globais/Mensagens/MsgImgLadoDireito";
import {UrlsMenuInterno} from "./UrlsMenuInterno";

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

    useEffect(()=>{
        buscaTabelaAssociacoes();
    }, []);

    useEffect(()=>{
        buscaAssociacoes();
    }, []);

    const buscaTabelaAssociacoes = async ()=>{
        let tabela_associacoes = await getTabelaAssociacoes();
        setTabelaAssociacoes(tabela_associacoes);
    };

    const buscaAssociacoes = async ()=>{
        let associacoes = await getAssociacoes();
        //console.log("Associacoes ", associacoes)
        setAssociacoes(associacoes);
        setLoading(false)
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
        console.log("Acoes Template", rowData.uuid)
        return (
            <div>
                <li className="nav-item dropdown link-acoes">
                    <a href="#" id="linkDropdownAcoes" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <button className="btn-acoes"><span className="btn-acoes-dots">...</span></button>
                    </a>

                    <div className="dropdown-menu dropdown-menu-opcoes " aria-labelledby="linkDropdownAcoes">
                        {UrlsMenuInterno && UrlsMenuInterno.length > 0 && UrlsMenuInterno.map((url, index)=>
                            <Link
                                key={index}
                                className="dropdown-item"
                                to={{
                                    pathname: url.url,
                                    propriedades: {
                                        uuid: rowData.uuid,
                                        nome: rowData.nome,
                                    }
                                }}
                            >
                                {url.label}
                            </Link>
                        )}


                        {/*<NavLink
                            className="dropdown-item"
                            to="/faq"
                            activeStyle={{
                                fontWeight: "bold",
                                color: "red"
                            }}
                        >
                            Ver regularidade
                        </NavLink>

                        <NavLink
                            className="dropdown-item"
                            to="/faq"
                            activeStyle={{
                                fontWeight: "bold",
                                color: "red"
                            }}
                        >
                            Ver situação financeira
                        </NavLink>*/}
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
        await buscaAssociacoes();
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