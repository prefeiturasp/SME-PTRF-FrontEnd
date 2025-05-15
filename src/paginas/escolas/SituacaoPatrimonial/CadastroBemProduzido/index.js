import React from "react";
import { PaginasContainer } from "../../../PaginasContainer";
import { FormularioBemProduzido } from "../../../../componentes/escolas/SituacaoPatrimonial/FormularioBemProduzido";

export const CadastroBemProduzidoPage = (props) => {
  return (
    <PaginasContainer>
      <h1 className="titulo-itens-painel mt-5">Adicionar bem produzido</h1>
      <div className="page-content-inner ">
        <FormularioBemProduzido />
      </div>
    </PaginasContainer>
  );
};
