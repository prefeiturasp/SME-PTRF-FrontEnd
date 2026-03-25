import { useState, useEffect, useMemo } from 'react';
import BreadcrumbComponent from '../../../../Globais/Breadcrumb';
import TabSelector from '../../../../Globais/TabSelector';
import LevantamentoDePrioridades from './LevantamentoDePrioridades/LevantamentoPrioridades';
import ReceitasPrevistas from './ReceitasPrevistas/ReceitasPrevistas';
import Prioridades from './Prioridades';
import Relatorios from './Relatorios';
import BarraTopoTitulo from './BarraTopoTitulo';
import { useLocation } from 'react-router-dom';
import { iniciarAtaPaa } from '../../../../../services/escolas/AtasPaa.service';

export const ElaborarPaa = ({paa}) => {
  const location = useLocation();
  const itemsBreadCrumb = [
    { label: 'Plano Anual de Atividades', url: '/paa' },
    { label: 'Elaborar novo plano', active: true },
  ];

  
  // const getInitialTab = () => {
    //   const requestedTab = location.state?.activeTab;
    //   return tabs.some((tab) => tab.id === requestedTab) ? requestedTab : tabs[0].id;
    // };
    
    const [activeTab, setActiveTab] = useState('prioridades');
    // const [activeTab, setActiveTab] = useState(getInitialTab);
    const relatoriosInitialExpandedSections = location.state?.expandedSections;
    const fromPlanoAplicacao = Boolean(location.state?.fromPlanoAplicacao);
    const fromPlanoOrcamentario = Boolean(location.state?.fromPlanoOrcamentario);
    const receitasDestino = location.state?.receitasDestino || null;
    const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
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

    const tabs = [
      {
        id: 'prioridades', label: 'Levantamento de Prioridades', exibir: paa?.status_andamento !== 'EM_RETIFICACAO',
        component: <LevantamentoDePrioridades paa={paa} />
      },
      {
        id: 'receitas', label: 'Receitas previstas', exibir: true,
        component: <ReceitasPrevistas receitasDestino={receitasDestino} paa={paa} />
      },
      {
        id: 'prioridades-list', label: 'Prioridades', exibir: true,
        component: <Prioridades />
      },
      {
        id: 'relatorios', label: 'Relatórios', exibir: true,
        component: <Relatorios initialExpandedSections={relatoriosInitialExpandedSections} />
      },
    ].filter((tab) => tab.exibir);
    
    useEffect(() => {
      if (!paa.uuid) {
      return;
    }
    iniciarAtaPaa(paa.uuid).catch((error) => {
      console.error("Erro ao iniciar ata do PAA:", error);
    });
  }, [paa]);

  return (
    <>
      <BreadcrumbComponent items={itemsBreadCrumb}/>
      <h1 className="titulo-itens-painel mt-5">Plano Anual de Atividades</h1>
      <div className="page-content-inner">
        <BarraTopoTitulo origem={origemBarra} />

        <TabSelector tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        {tabs.map((tab) => (
          <span key={tab.id}>
            {activeTab === tab.id && tab.component}
          </span>  
        ))}
        
      </div>
    </>
  );
};
