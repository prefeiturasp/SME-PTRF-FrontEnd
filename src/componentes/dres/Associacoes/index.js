import React, {useEffect, useState} from "react";
import {NavLink } from "react-router-dom";
import {getTabelaAssociacoes, getAssociacoes} from "../../../services/dres/Associacoes.service";
import "./associacoes.scss"
import {TabelaAssociacoes} from "./TabelaAssociacoes";
import {FiltrosAssociacoes} from "./FiltrosAssociacoes";
import Loading from "../../../utils/Loading";

export const Associacoes = () =>{

    const rowsPerPage = 15;

    const [loading, setLoading] = useState(true);
    const [tabelaAssociacoes, setTabelaAssociacoes] = useState({});
    const [associacoes, setAssociacoes] = useState([]);

    useEffect(()=>{
        buscaTabelaAssociacoes();
    }, []);

    useEffect(()=>{
        buscaAssociacoes();
    }, []);

    const buscaTabelaAssociacoes = async ()=>{
        let tabela_associacoes = await getTabelaAssociacoes();
        setTabelaAssociacoes(tabela_associacoes);
        console.log("Tabela Associacoes ", tabela_associacoes);

    };

    const buscaAssociacoes = async ()=>{
        let associacoes = await getAssociacoes();
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

    const acoesTemplate = () =>{
        return (
            <div>
                <li className="nav-item dropdown link-acoes">
                    <a href="#" id="linkDropdownAcoes" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <button className="btn-acoes"><span className="btn-acoes-dots">...</span></button>
                    </a>

                    <div className="dropdown-menu" aria-labelledby="linkDropdownAcoes">
                        <NavLink
                            className="dropdown-item"
                            to="/faq"
                            activeStyle={{
                                fontWeight: "bold",
                                color: "red"
                            }}
                        >
                            Ver dados unidade
                        </NavLink>

                        <NavLink
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
                        </NavLink>
                    </div>
                </li>
            </div>
        )
    };

    return(
        <>
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
                        <FiltrosAssociacoes
                            tabelaAssociacoes={tabelaAssociacoes}
                        />

                        <TabelaAssociacoes
                            associacoes={associacoes}
                            rowsPerPage={rowsPerPage}
                            unidadeEscolarTemplate={unidadeEscolarTemplate}
                            statusRegularidadeTemplate={statusRegularidadeTemplate}
                            acoesTemplate={acoesTemplate}
                        />
                    </>
                ) : null
            }

        </>
    )
};