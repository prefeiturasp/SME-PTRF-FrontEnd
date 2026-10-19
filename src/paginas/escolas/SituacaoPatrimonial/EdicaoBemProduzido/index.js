import React from "react";
import { useParams } from "react-router-dom";
import { PaginasContainer } from "../../../PaginasContainer";
import { FormularioBemProduzido } from "../../../../componentes/escolas/SituacaoPatrimonial/FormularioBemProduzido";
import { useGetModoVisualizacaoBemProduzido } from "../../../../componentes/escolas/SituacaoPatrimonial/FormularioBemProduzido/hooks/useGetModoVisualizacaoBemProduzido";
import { visoesService } from "../../../../services/visoes.service";

export const EdicaoBemProduzidoPage = () => {
  const { uuid } = useParams();
  const flagSituacaoPatrimonial = visoesService.featureFlagAtiva("situacao-patrimonial");
  const { data } = useGetModoVisualizacaoBemProduzido(flagSituacaoPatrimonial ? uuid : undefined);
  const titulo = flagSituacaoPatrimonial && data?.modo_visualizacao
    ? "Visualizar bem produzido"
    : "Editar bem produzido";

  return (
    <PaginasContainer>
      <h1 className="titulo-itens-painel mt-5">{titulo}</h1>
      <div className="page-content-inner ">
        <FormularioBemProduzido />
      </div>
    </PaginasContainer>
  );
};
