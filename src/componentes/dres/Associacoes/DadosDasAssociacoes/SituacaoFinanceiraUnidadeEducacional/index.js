import React from "react";
import {DADOS_DA_ASSOCIACAO} from "../../../../../services/auth.service";
import {TopoComBotoes} from "../TopoComBotoes";
import {Redirect} from "react-router-dom";
import {Dashboard} from "../../../../Globais/Dashborard";

export const SituacaoFinanceiraUnidadeEducacional = ({dadosDaAssociacao}) =>{
    return(
        <>     
            <div className="row">
                <div className="d-flex bd-highlight">
                    <div className="flex-grow-1 bd-highlight">
                        <p className="mb-1 ml-2 mb-3 titulo-explicativo-dre-detalhes">Situação financeira da associação</p>
                    </div>
                
                </div>
            </div>
            <Dashboard/>  
        </>
    );
};