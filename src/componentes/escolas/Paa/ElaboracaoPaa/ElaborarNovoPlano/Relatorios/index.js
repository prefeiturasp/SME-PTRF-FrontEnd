import React, { useState } from 'react';
import { Tooltip } from 'antd';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toastCustom } from '../../../../../Globais/ToastCustom';
import './styles.css';

import EditorWysiwyg from '../../../../../Globais/EditorWysiwyg';

import chevronUp from '../../../../../../assets/img/icone-chevron-up.svg';
import chevronDown from '../../../../../../assets/img/icone-chevron-down.svg';

import { useGetTextosPaa } from './hooks/useGetTextosPaa';
import { useGetPaaVigente } from './hooks/useGetPaaVigente';
import { usePatchPaa } from './hooks/usePatchPaa';
import { ASSOCIACAO_UUID } from '../../../../../../services/auth.service';

const Relatorios = () => {
  const [expandedSections, setExpandedSections] = useState({
    planoAnual: false,
    introducao: false,
  });
  const [isSaving, setIsSaving] = useState(false);

  const associacaoUuid = localStorage.getItem(ASSOCIACAO_UUID);
  const { textosPaa, isLoading, isError } = useGetTextosPaa();
  const { paaVigente, isLoading: isLoadingPaa } = useGetPaaVigente(associacaoUuid);
  const { patchPaa } = usePatchPaa();

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
  };

  const handleSalvarTexto = async (campoPaa, texto) => {
    if (paaVigente?.uuid) {
      setIsSaving(true);
      try {
        const payload = { [campoPaa]: texto !== '' ? texto : "Comece a digitar aqui..." };
        await patchPaa({ uuid: paaVigente.uuid, payload });
        toastCustom.ToastCustomSuccess("Sucesso!", "Item salvo com sucesso!");
      } catch (error) {
        console.error('Erro ao salvar:', error);
        toastCustom.ToastCustomError("Erro!", "Ops! Houve um erro ao tentar salvar.");
      } finally {
        setIsSaving(false);
      }
    } else {
      console.log('PAA vigente não encontrado');
      toastCustom.ToastCustomError("Erro!", "PAA vigente não encontrado.");
    }
  };

  const renderSecao = (secaoKey, config) => {
    const isExpanded = expandedSections[secaoKey];
    
    return (
      <div key={secaoKey} className={`subsecao-item ${isExpanded ? 'subsecao-item-open' : ''}`}>
        <div className="subsecao-info">
          <div className="subsecao-titulo">{config.titulo}</div>
          {/* Textos de introdução dentro do header */}
          {isExpanded && (
            <div className="introducao-content">
              {isLoading ? (
                <div className="texto-loading">Carregando...</div>
              ) : isError ? (
                <div className="texto-error">Erro ao carregar textos do PAA</div>
              ) : (
                <div className="textos-introducao">
                  {config.textosPaa.map((textoKey, index) => 
                    textosPaa[textoKey] && (
                      <div 
                        key={index}
                        className="texto-introducao"
                        dangerouslySetInnerHTML={{ __html: textosPaa[textoKey] }}
                      />
                    )
                  )}
                </div>
              )}
            
                  {config.temEditor && !isLoadingPaa && (
                    <div className="editor-container">
                      {config.chave === 'introducao' && (() => {
                        const textoEditor = paaVigente?.[config.campoPaa] || textosPaa[config.textosPaa[0]] || '';
                        const textoFixoId = 'texto-automatico-introducao-paa';
                        const temTextoAutomatico = textoEditor && textoEditor.includes(`id="${textoFixoId}"`);
                        
                        return !temTextoAutomatico && (
                          <Tooltip title="Texto padrão inserido automaticamente no documento" placement="top">
                            <span className="tooltip-icon-externo">
                              <FontAwesomeIcon icon={faInfoCircle} />
                            </span>
                          </Tooltip>
                        );
                      })()}
                  <EditorWysiwyg
                    textoInicialEditor={(() => {
                      const textoFixoId = 'texto-automatico-introducao-paa';
                      const textoFixo = `<div id="${textoFixoId}" style="background-color: #f3f3f3; border: 1px solid #D9D9D9; padding: 12px; color: #42474A; font-size: 14px; margin-bottom: 16px; border-radius: 2px;">O Plano Anual de Atividades previsto nos artigos 10 e 32, da Portaria SME nº 3.539 de 06/04/2017, contém Atividades Previstas, Plano de Aplicação de Recursos e Plano Orçamentário, e está elaborado em consonância com o Projeto Pedagógico da "CEMEI - JARDIM IPORANGA", e a ele se integra.</div>`;
                      const textoEditor = paaVigente?.[config.campoPaa] || textosPaa[config.textosPaa[0]] || '';
                      
                      if (config.chave === 'introducao') {
                        // Verificar se o ID do texto fixo já existe no texto_introducao
                        if (textoEditor && textoEditor.includes(`id="${textoFixoId}"`)) {
                          return textoEditor;
                        }
                        
                        // Se não contém e há texto existente, adiciona o texto fixo no início
                        if (textoEditor && textoEditor.trim() !== '') {
                          return textoFixo + textoEditor;
                        }
                        
                        // Se não há texto existente, retorna apenas o texto fixo
                        return textoFixo;
                      }
                      return textoEditor;
                    })()}
                    tituloEditor=""
                    handleSubmitEditor={(texto) => handleSalvarTexto(config.campoPaa, texto)}
                    // handleLimparEditor={handleLimparTexto}
                    botaoCancelar={false}
                    disabled={isSaving}
                    isSaving={isSaving}
                  />
                </div>
              )}
              {config.temEditor && isLoadingPaa && (
                <div className="texto-loading">Carregando PAA vigente...</div>
              )}
            </div>
          )}
        </div>
        <div className="subsecao-actions">
          <button className="btn-dropdown" onClick={() => toggleSection(secaoKey)}>
            <img 
              src={isExpanded ? chevronUp : chevronDown} 
              alt={isExpanded ? 'Fechar' : 'Abrir'} 
              className="chevron-icon"
            />
          </button>
        </div>
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