import { React, useState, useMemo, useEffect } from "react";
import { PaginasContainer } from "../../../../paginas/PaginasContainer";
import BreadcrumbComponent from "../../../Globais/Breadcrumb";
import TabSelector from "../../../Globais/TabSelector";
import ReceitasPrevistas from "../componentes/ReceitasPrevistas";
import { useGetPaa } from "../componentes/hooks/useGetPaa";
import Prioridades from "../ElaboracaoPaa/ElaborarNovoPlano/Prioridades";
import Relatorios from "../ElaboracaoPaa/ElaborarNovoPlano/Relatorios";
import BarraTopoTitulo from "../ElaboracaoPaa/ElaborarNovoPlano/BarraTopoTitulo";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "../../../../utils/Loading";

export const RetificacaoPaa = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { isLoading: carregandoPaa, paaDados } = useGetPaa();

  const itemsBreadCrumb = [
    { label: "Plano Anual de Atividades", url: "/paa-retificacao" },
    { label: "Elaboração e histórico", active: false },
    { label: "PAA Vigente e Anteriores", active: true },
  ];

  const tabs = [
    { id: "receitas", label: "Receitas previstas" },
    { id: "prioridades-list", label: "Prioridades" },
    { id: "relatorios", label: "Relatórios" },
  ];

  const getInitialTab = () => {
    const requestedTab = location.state?.activeTab;
    return tabs.some((tab) => tab.id === requestedTab)
      ? requestedTab
      : tabs[0].id;
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
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

  useEffect(() => {
    return () => {
      localStorage.setItem("PAA", "");
      localStorage.setItem("DADOS_PAA", null);
    };
  }, []);
  return (
    <PaginasContainer>
      <BreadcrumbComponent items={itemsBreadCrumb} />

      <h1 className="titulo-itens-painel mt-5">Plano Anual de Atividades</h1>

      {carregandoPaa ? (
        <div style={{ minHeight: "100%" }}>
          <Loading
            corGrafico="black"
            corFonte="dark"
            marginTop="0"
            marginBottom="0"
          />
        </div>
      ) : !paaDados ? (
        <span>Não foi possível carregar o PAA solicitado.</span>
      ) : (
        <>
          <div className="page-content-inner">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <BarraTopoTitulo origem={origemBarra} />

              <button
                className="btn btn-success d-flex align-items-center"
                onClick={() => {
                  navigate("/paa-vigente-e-anteriores");
                }}
                style={{ minWidth: "180px", justifyContent: "center" }}
              >
                Cancelar Retificação
              </button>
            </div>

            <TabSelector
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            {activeTab === "receitas" && (
              <ReceitasPrevistas receitasDestino={receitasDestino} />
            )}

            {activeTab === "prioridades-list" && <Prioridades />}

            {activeTab === "relatorios" && (
              <Relatorios
                initialExpandedSections={relatoriosInitialExpandedSections}
              />
            )}
          </div>
        </>
      )}
    </PaginasContainer>
  );
};
