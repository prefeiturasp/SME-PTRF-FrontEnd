import React from "react";
import { useSearchParams } from "react-router-dom";
import { PaginasContainer } from "../../../../../../../paginas/PaginasContainer";
import {TopoComBotoes} from "./components/TopoComBotoes";
import { TabelaOrdenarAcoes } from "./components/TabelaOrdenarAcoes";
import { ModalAlteracoesNaoSalvas } from "./components/ModalAlteracoesNaoSalvas";
import { ModalSalvarOrdenacao } from "./components/ModalSalvarOrdenacao";
import { ReordenarAcoesContextProvider } from "./context/ReordenarAcoesContext";

export const ReordenarAcoes = () => {
  const [searchParams] = useSearchParams();
  const recursoUuid = searchParams.get("recurso_uuid");

  return (
    <ReordenarAcoesContextProvider recursoUuid={recursoUuid}>
      <PaginasContainer>
        <h1 className="titulo-itens-painel mt-5">Ações</h1>
        <div className="page-content-inner">
          <TopoComBotoes />

          <TabelaOrdenarAcoes />

          <ModalAlteracoesNaoSalvas />
          <ModalSalvarOrdenacao />
        </div>
      </PaginasContainer>
    </ReordenarAcoesContextProvider>
  )
}