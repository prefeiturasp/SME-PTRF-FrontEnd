import { useState } from 'react';
import { toastCustom } from '../../../../../Globais/ToastCustom';
import './styles.css';

import chevronUp from '../../../../../../assets/img/icone-chevron-up.svg';
import chevronDown from '../../../../../../assets/img/icone-chevron-down.svg';

import { usePatchPaa } from './hooks/usePatchPaa';

import { RelSecaoTextos as RelIntroducaoPaa } from './RelSecaoTextos';
import { RelSecaoTextos as RelConclusaoPaa } from './RelSecaoTextos';
import { RelSecaoComponentes } from './RelSecaoComponentes';

export const RenderSecao = ({
    secaoKey,
    config,
    isExpanded,
    toggleSection = () => {},
    textosPaa,
    isLoading,
    isError,
    isLoadingPaa,
    paaVigente}) => {

    const [isSaving, setIsSaving] = useState(false);
    
    const { patchPaa } = usePatchPaa();

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
          toastCustom.ToastCustomError("Erro!", "PAA vigente não encontrado.");
        }
    };

    const contentClassName = `expanded-item-content`;

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
                <div className={contentClassName}>
                    {isLoading && <div className="texto-loading">Carregando...</div>}

                    {isError && <div className="texto-error">Erro ao carregar textos do PAA</div>}
                    
                    {isLoadingPaa && <div className="texto-loading">Carregando PAA vigente...</div>}

                    {!isLoading && !isError && !isLoadingPaa && (
                        <>
                            {config.temEditor && (
                                <>
                                {config.chave === 'introducao' && 
                                    <RelIntroducaoPaa
                                        secaoKey={secaoKey}
                                        config={config}
                                        textosPaa={textosPaa}
                                        paaVigente={paaVigente}
                                        handleSalvarTexto={handleSalvarTexto}
                                        isSaving={isSaving}
                                    />}

                                {config.chave === 'conclusao' && 
                                    <RelConclusaoPaa
                                        secaoKey={secaoKey}
                                        config={config}
                                        textosPaa={textosPaa}
                                        paaVigente={paaVigente}
                                        handleSalvarTexto={handleSalvarTexto}
                                        isSaving={isSaving}
                                    />}
                                </>
                            )}
                            {config.chave === 'componentes' && <RelSecaoComponentes />}
                        </>
                    )}
                </div>
            )}
            </div>
        </div>
    )
}