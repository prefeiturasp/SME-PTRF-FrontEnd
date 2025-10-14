import React from "react";
import { PaginasContainer } from "../../../../../PaginasContainer";
import { TipoDeDespesaCusteioForm } from "../../../../../../componentes/sme/Parametrizacoes/Despesas/TiposDeCusteio/TipoDeDespesaCusteioForm";

export const EdicaoTipoDeDespesaCusteioPage = (props) => {
  return (
    <PaginasContainer>
      <h1 className="titulo-itens-painel mt-5">Edição tipo de despesa de custeio</h1>
      <div className="page-content-inner ">
        <TipoDeDespesaCusteioForm {...props} />
      </div>
    </PaginasContainer>
  );
};
