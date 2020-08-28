import React from "react";
import {DADOS_DA_ASSOCIACAO} from "../../../../../services/auth.service";
import {TopoComBotoes} from "./TopoComBotoes";
import {Redirect} from "react-router-dom";
export const SituacaoFinanceiraUnidadeEducacional = () =>{
    let dadosDaAssociacao = JSON.parse(localStorage.getItem(DADOS_DA_ASSOCIACAO));
    return(
        <>
            {dadosDaAssociacao ? (
                    <>
                        <TopoComBotoes
                            dadosDaAssociacao={dadosDaAssociacao}
                        />
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