import React from "react";
import {Redirect} from "react-router-dom";
import {TopoComBotoes} from "../TopoComBotoes";
import {MenuInterno} from "../../../../Globais/MenuInterno";
import {UrlsMenuInterno} from "../UrlsMenuInterno";
import {InfosUnidadeEducacional} from "../DadosDaUnidadeEducacional/InfosUnidadeEducacional";

export const DadosDaAssociacao = () =>{
    let dadosDaAssociacao = JSON.parse(localStorage.getItem("DADOS_DA_ASSOCIACAO"));

    return (
        <>
            <h1>Estou Dados da Associacao dentro de DRE</h1>
            {dadosDaAssociacao ? (
                    <>
                        <TopoComBotoes
                            dadosDaAssociacao={dadosDaAssociacao}
                        />
                        <div className="page-content-inner">
                            <MenuInterno
                                caminhos_menu_interno = {UrlsMenuInterno}
                            />
                            <InfosUnidadeEducacional
                                dadosDaAssociacao={dadosDaAssociacao}
                            />
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