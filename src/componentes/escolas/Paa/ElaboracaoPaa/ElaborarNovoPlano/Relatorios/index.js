import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Tooltip } from 'antd';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toastCustom } from '../../../../../Globais/ToastCustom';
import './styles.css';

import EditorWysiwygCustom from '../../../../../Globais/EditorWysiwygCustom';

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
  const [introducaoEditorInstance, setIntroducaoEditorInstance] = useState(null);
  const introducaoEditorContainerRef = useRef(null);
  const tooltipIconRef = useRef(null);
  const [tooltipOffsetTop, setTooltipOffsetTop] = useState(55);

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

  const handleLimparComProtecao = (textoAtual) => {
    const textoFixoId = 'texto-automatico-introducao-paa';
    const textoFixo = `<div id="${textoFixoId}" contenteditable="false" style="background-color: #f3f3f3; border: 1px solid #D9D9D9; padding: 12px; color: #42474A; font-size: 14px; margin-bottom: 16px; border-radius: 2px; user-select: none;">${textosPaa['introducao_do_paa_ue_2'] || ''}</div>`;
    
    // Sempre retorna apenas o texto fixo com um parágrafo vazio para edição
    return textoFixo + '<p><br></p>';
  };

  const handleMudancaEditorComProtecao = (novoTexto) => {
    const textoFixoId = 'texto-automatico-introducao-paa';
    const textoFixo = `<div id="${textoFixoId}" contenteditable="false" style="background-color: #f3f3f3; border: 1px solid #D9D9D9; padding: 12px; color: #42474A; font-size: 14px; margin-bottom: 16px; border-radius: 2px; user-select: none;">${textosPaa['introducao_do_paa_ue_2'] || ''}</div>`;
    
    // Se o novo texto não contém o texto fixo, adiciona ele no início
    if (!novoTexto || !novoTexto.includes(`id="${textoFixoId}"`)) {
      return textoFixo + '<p><br></p>' + (novoTexto || '');
    }
    
    // Regex para encontrar o texto fixo completo
    const textoFixoRegex = new RegExp(`<div id="${textoFixoId}"[^>]*>.*?</div>`, 'g');
    const textoFixoEncontrado = novoTexto.match(textoFixoRegex);
    
    if (textoFixoEncontrado) {
      // Remove TODAS as ocorrências do texto fixo do conteúdo
      const textoSemFixo = novoTexto.replace(textoFixoRegex, '');
      
      // Remove qualquer conteúdo que possa ter sido inserido antes (limpa espaços, tags vazias, etc.)
      const textoSemFixoLimpo = textoSemFixo.trim();
      
      // Se não há conteúdo válido após o texto fixo, retorna apenas o texto fixo com um parágrafo vazio
      if (!textoSemFixoLimpo || textoSemFixoLimpo === '<p><br></p>' || textoSemFixoLimpo === '<br>' || textoSemFixoLimpo === '<p></p>') {
        return textoFixo + '<p><br></p>';
      }
      
      // Remove tags vazias ou inválidas do início
      const textoSemTagsVazias = textoSemFixoLimpo.replace(/^(<p><br><\/p>|<br>|<p><\/p>)+/, '');
      
      // Retorna o texto fixo no início seguido do conteúdo limpo
      return textoFixo + (textoSemTagsVazias || '<p><br></p>');
    }
    
    return novoTexto;
  };

  const atualizarPosicaoTooltipIntroducao = useCallback(() => {
    if (!introducaoEditorInstance || !introducaoEditorContainerRef.current) {
      return;
    }

    const textoFixo = introducaoEditorInstance.getBody()?.querySelector('#texto-automatico-introducao-paa');
    const iframeElement = introducaoEditorInstance.iframeElement || introducaoEditorInstance.getContentAreaContainer()?.querySelector('iframe');

    if (!textoFixo || !iframeElement) {
      return;
    }

    const textoRect = textoFixo.getBoundingClientRect();
    const iframeRect = iframeElement.getBoundingClientRect();
    const containerRect = introducaoEditorContainerRef.current.getBoundingClientRect();

    const novoTop = textoRect.top + iframeRect.top - containerRect.top;
    if (!Number.isFinite(novoTop)) {
      return;
    }

    const iconHeight = tooltipIconRef.current?.offsetHeight || 24;
    const maxTop = Math.max(0, containerRect.height - iconHeight);
    const clampedTop = Math.min(Math.max(novoTop, 0), maxTop);

    setTooltipOffsetTop(prev => (Math.abs(prev - clampedTop) > 0.5 ? clampedTop : prev));
  }, [introducaoEditorInstance]);

  useEffect(() => {
    if (!introducaoEditorInstance) {
      setTooltipOffsetTop(55);
      return;
    }

    const handler = () => atualizarPosicaoTooltipIntroducao();

    introducaoEditorInstance.on('ScrollContent', handler);
    introducaoEditorInstance.on('NodeChange', handler);
    introducaoEditorInstance.on('SetContent', handler);
    window.addEventListener('resize', handler);

    handler();

    return () => {
      introducaoEditorInstance.off('ScrollContent', handler);
      introducaoEditorInstance.off('NodeChange', handler);
      introducaoEditorInstance.off('SetContent', handler);
      window.removeEventListener('resize', handler);
    };
  }, [introducaoEditorInstance, atualizarPosicaoTooltipIntroducao]);

  useEffect(() => {
    atualizarPosicaoTooltipIntroducao();
  }, [paaVigente, textosPaa, atualizarPosicaoTooltipIntroducao]);

  const renderSecao = (secaoKey, config) => {
    const isExpanded = expandedSections[secaoKey];
    
    return (
      <div key={secaoKey} className={`subsecao-item ${isExpanded ? 'subsecao-item-open' : ''}`}>
        <div className="subsecao-info">
          <div className="subsecao-header">
            <div className="subsecao-titulo">{config.titulo}</div>
            <button className="btn-dropdown" onClick={() => toggleSection(secaoKey)}>
              <img 
                src={isExpanded ? chevronUp : chevronDown} 
                alt={isExpanded ? 'Fechar' : 'Abrir'} 
                className="chevron-icon"
              />
            </button>
          </div>
          {/* Textos de introdução dentro do header */}
          {isExpanded && (
            <div className="introducao-content">
              {isLoading ? (
                <div className="texto-loading">Carregando...</div>
              ) : isError ? (
                <div className="texto-error">Erro ao carregar textos do PAA</div>
              ) : (
                <div className="textos-introducao">
                  {textosPaa['introducao_do_paa_ue_1'] && (
                    <div
                      className="texto-introducao"
                      dangerouslySetInnerHTML={{ __html: textosPaa['introducao_do_paa_ue_1'] }}
                    />
                  )}
                </div>
              )}
            
                  {config.temEditor && !isLoadingPaa && (
                    <div
                      className="editor-container"
                      ref={config.chave === 'introducao' ? introducaoEditorContainerRef : undefined}
                    >
                      {config.chave === 'introducao' && (
                        <Tooltip title="Texto padrão inserido automaticamente no documento" placement="top">
                          <span
                            className="tooltip-icon-externo"
                            ref={tooltipIconRef}
                            style={{ top: tooltipOffsetTop }}
                          >
                            <FontAwesomeIcon icon={faInfoCircle} />
                          </span>
                        </Tooltip>
                      )}
                  <EditorWysiwygCustom
                    textoInicialEditor={(() => {
                      const textoFixoId = 'texto-automatico-introducao-paa';
                      const textoFixo = `<div id="${textoFixoId}" contenteditable="false" style="background-color: #f3f3f3; border: 1px solid #D9D9D9; padding: 12px; color: #42474A; font-size: 14px; margin-bottom: 16px; border-radius: 2px; user-select: none;">${textosPaa[config.textosPaa[1]] || ''}</div>`;
                      const textoEditor = paaVigente?.[config.campoPaa] || '';
                      
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
                    handleLimparEditor={(textoAtual) => handleLimparComProtecao(textoAtual)}
                    handleMudancaEditor={(novoTexto) => config.chave === 'introducao' ? handleMudancaEditorComProtecao(novoTexto) : novoTexto}
                    botaoCancelar={false}
                    disabled={isSaving}
                    isSaving={isSaving}
                    onEditorReady={config.chave === 'introducao' ? setIntroducaoEditorInstance : undefined}
                  />
                </div>
              )}
              {config.temEditor && isLoadingPaa && (
                <div className="texto-loading">Carregando PAA vigente...</div>
              )}
            </div>
          )}
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
