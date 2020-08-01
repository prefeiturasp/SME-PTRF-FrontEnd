import React from "react";
import {useLocation, Redirect} from "react-router-dom";
import {TopoComBotoes} from "./TopoComBotoes";
import {MenuInterno} from "../../../Globais/MenuInterno";
import {UrlsMenuInterno} from "../UrlsMenuInterno";

export const DadosDasAssociacoes = () =>{

    let dados_da_associacao = JSON.parse(localStorage.getItem("DADOS_DA_ASSOCIACAO"));

    const {props} = useLocation();

    console.log("Props", props);
    return (
      <>
          {dados_da_associacao ? (
              <>
                  <TopoComBotoes
                      dados_da_associacao={dados_da_associacao}
                  />
                  <div className="page-content-inner">
                      <MenuInterno
                          caminhos_menu_interno = {UrlsMenuInterno}
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