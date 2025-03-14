import { React, useState } from 'react';
import { PaginasContainer } from '../../../../../paginas/PaginasContainer';
import BreadcrumbComponent from '../../../../Globais/Breadcrumb';
import TabSelector from '../../../../Globais/TabSelector';
import LevantamentoDePrioridades from './LevantamentoDePrioridades';
import ReceitasPrevistas from './ReceitasPrevistas';
import Prioridades from './Prioridades';
import Relatorios from './Relatorios';
import BarraTopoTitulo from './BarraTopoTitulo';

export const ElaborarNovoPlano = () => {
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

  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <PaginasContainer>
      <BreadcrumbComponent items={itemsBreadCrumb} />
      <h1 className="titulo-itens-painel mt-5">Plano Anual de Atividades</h1>
      <div className="page-content-inner">
        <BarraTopoTitulo />

        <TabSelector tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 'prioridades' && (
          <LevantamentoDePrioridades />
        )}

        {activeTab === 'receitas' && (
          <ReceitasPrevistas />
        )}

        {activeTab === 'prioridades-list' && (
          <Prioridades />
        )}

        {activeTab === 'relatorios' && (
          <Relatorios />
        )}
      </div>
    </PaginasContainer>
  );
};