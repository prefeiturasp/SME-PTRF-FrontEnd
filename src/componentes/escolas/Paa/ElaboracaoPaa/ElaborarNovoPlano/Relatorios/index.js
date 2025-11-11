import React, { useState } from 'react';
import './styles.css';

import chevronUp from '../../../../../../assets/img/icone-chevron-up.svg';
import chevronDown from '../../../../../../assets/img/icone-chevron-down.svg';

import { useGetTextosPaa } from './hooks/useGetTextosPaa';
import { useGetPaaVigente } from './hooks/useGetPaaVigente';
import { ASSOCIACAO_UUID } from '../../../../../../services/auth.service';
import { RenderSecao } from './RenderSecao';


const Relatorios = () => {
  const [expandedSections, setExpandedSections] = useState({
    planoAnual: false,
    introducao: false,
    conclusao: false,
    componentes: false,
  });

  const associacaoUuid = localStorage.getItem(ASSOCIACAO_UUID);
  const { textosPaa, isLoading, isError } = useGetTextosPaa();
  const { paaVigente, isLoading: isLoadingPaa } = useGetPaaVigente(associacaoUuid);

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const secoesConfig = {
    introducao: {
      titulo: "I. Introdução",
      chave: "introducao",
      campoPaa: "texto_introducao",
      textosPaa: ["introducao_do_paa_ue_1", "introducao_do_paa_ue_2"],
      temEditor: true,
    },
    objetivos: {
      titulo: "II. Objetivos",
      chave: "objetivos",
    },
    componentes: {
      titulo: "III. Componentes",
      chave: "componentes",
      temEditor: true,
    },
    conclusao: {
      titulo: "IV. Conclusão",
      chave: "conclusao",
      campoPaa: "texto_conclusao",
      textosPaa: ["conclusao_do_paa_ue_1", "conclusao_do_paa_ue_2"],
      temEditor: true,
    },
  };

  const renderSecao = (secaoKey, config) => {
    const isExpanded = expandedSections[secaoKey];
    
    return (
      <div className={`render-secao-${secaoKey}`}>
        <RenderSecao
          key={secaoKey}
          secaoKey={secaoKey}
          config={config}
          isExpanded={isExpanded}
          toggleSection={toggleSection}
          textosPaa={textosPaa}
          isLoading={isLoading}
          isError={isError}
          isLoadingPaa={isLoadingPaa}
          paaVigente={paaVigente}
        />
      </div>
    );
  };

  return (
    <div className="relatorios-container">
      <div className="documentos-card">
        {/* Header */}
        <div className="documentos-header">
          <h3 className="documentos-title">Documentos</h3>
          <div className="documentos-buttons">
            <button className="btn-previas">Prévias</button>
            <button className="btn-gerar">Gerar</button>
          </div>
        </div>

        {/* Documentos List */}
        <div className="documentos-list">
          {/* Plano anual */}
          <div className="documento-item">
            <div className="documento-info">
              <div className="documento-nome">Plano Anual</div>
              <div className="documento-status">Documento pendente de geração</div>
            </div>
            <div className="documento-actions">
              <button className="btn-dropdown" onClick={() => toggleSection('planoAnual')}>
                <img 
                  src={expandedSections.planoAnual ? chevronUp : chevronDown} 
                  alt={expandedSections.planoAnual ? 'Fechar' : 'Abrir'} 
                  className="chevron-icon"
                />
              </button>
            </div>
          </div>

          {/* Subseções do Plano anual */}
          {expandedSections.planoAnual && (
            <div className="plano-anual-subsecoes">
              {Object.entries(secoesConfig).map(([secaoKey, config]) => 
                renderSecao(secaoKey, config)
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Relatorios;
