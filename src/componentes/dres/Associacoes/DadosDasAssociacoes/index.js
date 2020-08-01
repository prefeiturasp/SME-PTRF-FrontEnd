import React from "react";
import {NavLink, Link, useLocation } from "react-router-dom";

export const DadosDasAssociacoes = (state) =>{

    let location = useLocation();
    console.log("Location", location);

    console.log("Props ", state)
    return (
      <>
          <h1 className="titulo-itens-painel mt-5">Dados da Associação</h1>
          <div className="page-content-inner">
              <h1>Dados das associacoes page</h1>
          </div>
      </>
    );
};