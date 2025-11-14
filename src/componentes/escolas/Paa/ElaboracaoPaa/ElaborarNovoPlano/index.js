import { React, useState, useEffect } from 'react';
import { PaginasContainer } from '../../../../../paginas/PaginasContainer';
import BreadcrumbComponent from '../../../../Globais/Breadcrumb';
import TabSelector from '../../../../Globais/TabSelector';
import LevantamentoDePrioridades from './LevantamentoDePrioridades';
import ReceitasPrevistas from './ReceitasPrevistas';
import Prioridades from './Prioridades';
import Relatorios from './Relatorios';
import BarraTopoTitulo from './BarraTopoTitulo';
import { useLocation } from 'react-router-dom';
import { iniciarAtaPaa } from '../../../../../services/escolas/AtasPaa.service';

export const ElaborarNovoPlano = () => {
  const location = useLocation();
  const itemsBreadCrumb = [
    { label: 'Plano Anual de Atividades', url: '/paa' },
    { label: 'Elaborar novo plano', active: true },
  ];

  const tabs = [
    { id: 'prioridades', label: 'Levantamento de Prioridades' },
    { id: 'receitas', label: 'Receitas previstas' },
    { id: 'prioridades-list', label: 'Prioridades' },
    { id: 'relatorios', label: 'Relatórios' },
  ];

  const getInitialTab = () => {
    const requestedTab = location.state?.activeTab;
    return tabs.some((tab) => tab.id === requestedTab) ? requestedTab : tabs[0].id;
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const relatoriosInitialExpandedSections = location.state?.expandedSections;
  const fromPlanoAplicacao = Boolean(location.state?.fromPlanoAplicacao);
  const fromPlanoOrcamentario = Boolean(location.state?.fromPlanoOrcamentario);
  const receitasDestino = location.state?.receitasDestino || null;

  useEffect(() => {
    const paaUuid = localStorage.getItem("PAA");
    if (!paaUuid) {
      return;
    }
    iniciarAtaPaa(paaUuid).catch((error) => {
      console.error("Erro ao iniciar ata do PAA:", error);
    });
  }, []);

  return (
    <PaginasContainer>
      <BreadcrumbComponent items={itemsBreadCrumb}/>
      <h1 className="titulo-itens-painel mt-5">Plano Anual de Atividades</h1>
      <div className="page-content-inner">
        <BarraTopoTitulo
          origem={
            fromPlanoAplicacao
              ? "plano-aplicacao"
              : fromPlanoOrcamentario
              ? "plano-orcamentario"
              : null
          }
        />

        <TabSelector tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 'prioridades' && (
          <LevantamentoDePrioridades />
        )}

        {activeTab === 'receitas' && (
          <ReceitasPrevistas receitasDestino={receitasDestino} />
        )}

        {activeTab === 'prioridades-list' && (
          <Prioridades />
        )}

        {activeTab === 'relatorios' && (
          <Relatorios initialExpandedSections={relatoriosInitialExpandedSections} />
        )}
      </div>
    </PaginasContainer>
  );
};
