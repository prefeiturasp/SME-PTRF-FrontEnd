import React from "react";
import {DADOS_DA_ASSOCIACAO} from "../../../../../services/auth.service";
import {TopoComBotoes} from "../TopoComBotoes";
import {Redirect} from "react-router-dom";
import {Dashboard} from "../../../../Globais/Dashborard";

export const SituacaoFinanceiraUnidadeEducacional = () =>{
    let dadosDaAssociacao = JSON.parse(localStorage.getItem(DADOS_DA_ASSOCIACAO));
    return(
        <>
            {dadosDaAssociacao ? (
                    <>
                        <TopoComBotoes
                            dadosDaAssociacao={dadosDaAssociacao}
                        />
                        <div className="page-content-inner">
                            <h5 className="mb-3">Dados Financeiros do PTRF</h5>
                            <Dashboard/>
                        </div>
                    </>
                ) :
                <Redirect
                    to={{
                        pathname: "/dre-associacoes",
                    }}
                />
            }
        </>
    );
};