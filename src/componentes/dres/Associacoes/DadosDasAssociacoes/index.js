import React from "react";
import {Link, useLocation, Redirect} from "react-router-dom";

export const DadosDasAssociacoes = () =>{

    const {props} = useLocation()

    console.log("Props", props);
    return (
      <>
          {props ? (
              <>
                  <div className="d-flex bd-highlight">
                      <div className="p-2 flex-grow-1 bd-highlight">
                          <h1 className="titulo-itens-painel mt-5">{props.nome}</h1>
                      </div>
                      <div className="p-2 bd-highlight mt-5">
                          <button type="button" className="btn btn-outline-success">Ver situação financeira</button>
                      </div>
                      <div className="p-2 bd-highlight mt-5">
                          <button type="button" className="btn btn btn-outline-success">Ver regularidade</button>
                      </div>
                      <div className="p-2 bd-highlight mt-5">
                          <Link to="/dre-associacoes" className="btn btn btn-success">Voltar</Link>
                      </div>
                  </div>

                  <div className="page-content-inner">
                      <h1>Dados das associacoes Componente</h1>
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