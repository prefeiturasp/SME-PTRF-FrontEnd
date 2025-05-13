import React from "react";
import { PaginasContainer } from "../../PaginasContainer";
import { ListaSituacaoPatrimonial } from "../../../componentes/escolas/SituacaoPatrimonial/ListaSituacaoPatrimonial";

export const SituacaoPatrimonialPage = (props) => {
  return (
    <PaginasContainer>
      <h1 className="titulo-itens-painel mt-5">Situação Patrimonial</h1>
      <div className="page-content-inner ">
        <ListaSituacaoPatrimonial />
      </div>
    </PaginasContainer>
  );
};
