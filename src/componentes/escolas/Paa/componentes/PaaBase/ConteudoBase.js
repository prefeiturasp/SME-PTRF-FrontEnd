import { useState, useEffect, useMemo } from "react";
import BreadcrumbComponent from "../../../../Globais/Breadcrumb";
import TabSelector from "../../../../Globais/TabSelector";

import LevantamentoDePrioridades from "../../ElaboracaoPaa/ElaborarNovoPlano/LevantamentoDePrioridades";
import ReceitasPrevistas from "../ReceitasPrevistas";
import Prioridades from "../../ElaboracaoPaa/ElaborarNovoPlano/Prioridades";
import Relatorios from "../../ElaboracaoPaa/ElaborarNovoPlano/Relatorios";
import BarraTopoTitulo from "../BarraTopoTitulo";
import { useLocation, useNavigate } from "react-router-dom";
import { iniciarAtaPaa } from "../../../../../services/escolas/AtasPaa.service";
import { visoesService } from "../../../../../services/visoes.service";

const ConteudoBase = ({ paa, itemsBreadCrumb }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("prioridades");
  const relatoriosInitialExpandedSections = location.state?.expandedSections;
  const fromPlanoAplicacao = Boolean(location.state?.fromPlanoAplicacao);
  const fromPlanoOrcamentario = Boolean(location.state?.fromPlanoOrcamentario);
  const receitasDestino = location.state?.receitasDestino || null;
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const fromAtividadesPrevistas = useMemo(() => {
    const value = searchParams.get("fromAtividadesPrevistas");
    return value === "1" || value === "true";
  }, [searchParams]);

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
          component: <LevantamentoDePrioridades paa={paa} />,
        },
        {
          id: "receitas",
          label: "Receitas previstas",
          exibir: true,
          component: (
            <ReceitasPrevistas receitasDestino={receitasDestino} paa={paa} />
          ),
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
    [paa],
  );

  useEffect(() => {
    if (paa?.status === "EM_RETIFICACAO") {
      navigate(`/retificacao-paa/${paa?.uuid}`);
    }
  }, [paa]);

  useEffect(() => {
    const obterAbaInicial = () => {
      const requestedTab = location.state?.activeTab;
      return tabs.some((tab) => tab.id === requestedTab)
        ? requestedTab
        : tabs[0].id;
    };
    setActiveTab(obterAbaInicial());
  }, []);

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

    if (paa.status === "EM_RETIFICACAO") {
      setActiveTab("receitas");
    }
  }, [paa, navigate]);

  return (
    <>
      <BreadcrumbComponent items={itemsBreadCrumb} />
      <h1 className="titulo-itens-painel mt-5">Plano Anual de Atividades</h1>
      <div className="page-content-inner">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <BarraTopoTitulo origem={origemBarra} paa={paa} />

          {paa?.status === "EM_RETIFICACAO" && (
            <button
              className="btn btn-success d-flex align-items-center"
              onClick={() => {
                navigate("/paa-vigente-e-anteriores");
              }}
              style={{ minWidth: "180px", justifyContent: "center" }}
            >
              Cancelar Retificação
            </button>
          )}
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
