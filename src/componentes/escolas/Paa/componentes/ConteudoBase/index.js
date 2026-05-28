import { useState, useEffect, useMemo, useRef } from "react";
import BreadcrumbComponent from "../../../../Globais/Breadcrumb";
import TabSelector from "../../../../Globais/TabSelector";

import LevantamentoDePrioridades from "../../ElaboracaoPaa/ElaborarNovoPlano/LevantamentoDePrioridades";
import ReceitasPrevistas from "../ReceitasPrevistas";
import Prioridades from "../../ElaboracaoPaa/ElaborarNovoPlano/Prioridades";
import Relatorios from "../../ElaboracaoPaa/ElaborarNovoPlano/Relatorios";
import BarraTopoTitulo from "../BarraTopoTitulo";
import CancelarRetificacao from "../CancelarRetificacao";
import { useLocation, useNavigate } from "react-router-dom";
import { iniciarAtaPaa } from "../../../../../services/escolas/AtasPaa.service";
import { visoesService } from "../../../../../services/visoes.service";
import { usePaaContext } from "../PaaContext";

const ConteudoBase = ({ itemsBreadCrumb }) => {
  const navigate = useNavigate();
  const { paa } = usePaaContext();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("prioridades");
  const hasInitializedTab = useRef(false);
  const initialStateRef = useRef(location.state);
  const relatoriosInitialExpandedSections =
    initialStateRef.current?.expandedSections;

  const fromPlanoAplicacao = Boolean(
    initialStateRef.current?.fromPlanoAplicacao,
  );
  const fromPlanoOrcamentario = Boolean(
    initialStateRef.current?.fromPlanoOrcamentario,
  );
  const fromAtividadesPrevistas = Boolean(
    initialStateRef.current?.fromAtividadesPrevistas,
  );
  const receitasDestino = initialStateRef.current?.receitasDestino || null;

  const origemBarra = fromAtividadesPrevistas
    ? "atividades-previstas"
    : fromPlanoAplicacao
      ? "plano-aplicacao"
      : fromPlanoOrcamentario
        ? "plano-orcamentario"
        : null;

  const tabs = useMemo(
    () =>
      [
        {
          id: "prioridades",
          label: "Levantamento de Prioridades",
          exibir: paa?.status !== "EM_RETIFICACAO",
          component: <LevantamentoDePrioridades />,
        },
        {
          id: "receitas",
          label: "Receitas previstas",
          exibir: true,
          component: <ReceitasPrevistas receitasDestino={receitasDestino} />,
        },
        {
          id: "prioridades-list",
          label: "Prioridades",
          exibir: true,
          component: <Prioridades />,
        },
        {
          id: "relatorios",
          label: "Relatórios",
          exibir: true,
          component: (
            <Relatorios
              initialExpandedSections={relatoriosInitialExpandedSections}
            />
          ),
        },
      ].filter((tab) => tab.exibir),
    [paa, receitasDestino, relatoriosInitialExpandedSections],
  );

  useEffect(() => {
    if (paa?.status === "EM_RETIFICACAO") {
      navigate(`/retificacao-paa/${paa?.uuid}`);
    }
  }, [paa, navigate]);

  useEffect(() => {
    if (hasInitializedTab.current || tabs.length === 0) return;
    hasInitializedTab.current = true;
    const requestedTab = initialStateRef.current?.activeTab;
    setActiveTab(
      tabs.some((tab) => tab.id === requestedTab) ? requestedTab : tabs[0].id,
    );
  }, [tabs]);

  useEffect(() => {
    const temPermissaoIniciar = Boolean(
      visoesService.getPermissoes(["custom_change_paa"]),
    );
    const temPaaEmAndamento = Boolean(localStorage.getItem("PAA"));
    if (!temPermissaoIniciar && !temPaaEmAndamento) {
      navigate("/paa", { replace: true });
      return;
    }

    if (!paa.uuid) {
      return;
    }
    iniciarAtaPaa(paa.uuid).catch((error) => {
      console.error("Erro ao iniciar ata do PAA:", error);
    });

  }, [paa, navigate]);

  return (
    <>
      <BreadcrumbComponent items={itemsBreadCrumb} />
      <h1 className="titulo-itens-painel mt-5">Plano Anual de Atividades</h1>
      <div className="page-content-inner">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <BarraTopoTitulo origem={origemBarra} paa={paa} />

          {/* Cancelar retifição */}
          <CancelarRetificacao paa={paa} />
        </div>

        <TabSelector
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {tabs.map((tab) => (
          <span key={tab.id}>{activeTab === tab.id && tab.component}</span>
        ))}
      </div>
    </>
  );
};

export default ConteudoBase;
