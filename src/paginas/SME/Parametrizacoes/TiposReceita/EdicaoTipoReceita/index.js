import React from "react";
import { PaginasContainer } from "../../../../PaginasContainer";
import { TipoReceitaForm } from "../../../../../componentes/sme/Parametrizacoes/Receitas/TiposReceita/TipoReceitaForm";

export const EdicaoTipoReceitaPage = (props) => {
  return (
    <PaginasContainer>
      <h1 className="titulo-itens-painel mt-5">Edição tipo de crédito</h1>
      <div className="page-content-inner ">
        <TipoReceitaForm {...props} />
      </div>
    </PaginasContainer>
  );
};
