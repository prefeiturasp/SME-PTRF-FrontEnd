import React from "react";
import { PaginasContainer } from "../../PaginasContainer";
import { ListaBemProduzido } from "../../../componentes/escolas/SituacaoPatrimonial/ListaBemProduzido";

export const SituacaoPatrimonialPage = (props) => {
  return (
    <PaginasContainer>
      <h1 className="titulo-itens-painel mt-5">Situação Patrimonial</h1>
      <div className="page-content-inner ">
        <ListaBemProduzido />
      </div>
    </PaginasContainer>
  );
};
