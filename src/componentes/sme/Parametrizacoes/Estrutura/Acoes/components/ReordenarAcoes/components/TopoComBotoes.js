import React from "react";
import { useReordenarAcoesContext } from "../hooks/useReordenarAcoesContext";

export const TopoComBotoes = () => {
  const { handleSalvarOrdenacaoBtnVoltar } = useReordenarAcoesContext();

  return (
    <div className="page-content-inner d-flex justify-content-between align-items-center mb-2">
      <div>
        <h4 className="titulo-itens-painel mb-1"><b>Alterar ordenação</b></h4>
        <p className="mb-0">
          Arraste o ícone ao lado de cada ação para reorganizar a ordem. A ordenação
          será exibida em todas as listas de ações para as UEs vinculadas.
        </p>
      </div>

      <button className="btn btn-primary ml-3 text-nowrap" onClick={handleSalvarOrdenacaoBtnVoltar}>
          Voltar
      </button>
    </div>
  )
}