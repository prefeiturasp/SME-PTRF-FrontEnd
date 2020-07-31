import React, {useEffect, useState} from "react";
import {NavLink } from "react-router-dom";
import {getAssociacoes} from "../../../services/dres/Associacoes.service";
import "./associacoes.scss"
import {TabelaAssociacoes} from "./TabelaAssociacoes";

export const Associacoes = () =>{

    const rowsPerPage = 15;

    const [associacoes, setAssociacoes] = useState([]);

    useEffect(()=>{
        buscaAssociacoes();
    }, []);

    const buscaAssociacoes = async ()=>{
        let associacoes = await getAssociacoes();
        setAssociacoes(associacoes);
        console.log("buscaAssociacoes ", associacoes)
    };

    const unidadeEscolarTemplate = (rowData, column) =>{
        return (
            <div>
                {rowData['nome'] ? <strong>{rowData['nome']}</strong> : ''}
            </div>
        )
    };

    const statusRegularidadeTemplate = (rowData, column) =>{
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

    const acoesTemplate = (rowData, column) =>{
        return (
            <div>
                {/*<button className="btn-acoes"><span className="btn-acoes-dots">...</span></button>*/}
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

            <TabelaAssociacoes
                associacoes={associacoes}
                rowsPerPage={rowsPerPage}
                unidadeEscolarTemplate={unidadeEscolarTemplate}
                statusRegularidadeTemplate={statusRegularidadeTemplate}
                acoesTemplate={acoesTemplate}
            />

        </>
    )
};