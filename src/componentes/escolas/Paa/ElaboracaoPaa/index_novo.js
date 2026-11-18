import { useEffect, useState } from "react";
import { PaginasContainer } from "../../../../paginas/PaginasContainer";
import Loading from "../../../../utils/Loading";
import { getTextosPaaUe } from "../../../../services/escolas/Paa.service";
import BreadcrumbComponent from "../../../Globais/Breadcrumb";
import { ASSOCIACAO_UUID } from "../../../../services/auth.service";

import { EstruturaCompletaModeloPaa } from "./EstruturaCompletaModeloPaa";
import { useEstadoElaboracao } from "./hooks/useEstadoElaboracao";
import { useAcaoElaboracaoPaa } from "./hooks/useAcaoElaboracaoPaa";
import { SecoesPeriodoElaboracaoPaa } from "../componentes/SecoesPeriodoElaboracaoPaa";

export const ElaboracaoPaaNovo = () => {
  const associacaoUuid = localStorage.getItem(ASSOCIACAO_UUID);

  const [loading, setLoading] = useState(true);
  const [textoPaa, setTextoPaa] = useState("");
  
  const { estado, isLoading: carregandoEstado } = useEstadoElaboracao(associacaoUuid);
  const { executarAcao, processando } = useAcaoElaboracaoPaa({ associacaoUuid });

  const itemsBreadCrumb = [
    { label: "Plano Anual de Atividades", active: true },
  ];

  useEffect(() => {
    getTextosPaaUe()
      .then((response) => {
        setTextoPaa(response.texto_pagina_paa_ue);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  }, []);

  return (
    <PaginasContainer>
      <BreadcrumbComponent items={itemsBreadCrumb} />
      <h1 className="titulo-itens-painel mt-5">Plano Anual de Atividades</h1>
      {loading || carregandoEstado ? (
        <Loading
          corGrafico="black"
          corFonte="dark"
          marginTop="50"
          marginBottom="0"
        />
      ) : (
        <div className="page-content-inner">
          <div className="col-12 mb-4 mt-3">
            <div dangerouslySetInnerHTML={{ __html: textoPaa }} />
          </div>

          <EstruturaCompletaModeloPaa />

          <SecoesPeriodoElaboracaoPaa estado={estado} processando={processando} onAcao={executarAcao} />
        </div>
      )}
    </PaginasContainer>
  );
};
