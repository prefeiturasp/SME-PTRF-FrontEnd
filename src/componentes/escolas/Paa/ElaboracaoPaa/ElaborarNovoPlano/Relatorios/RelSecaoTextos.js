import { useState, useEffect, useRef } from 'react';
import { Tooltip } from 'antd';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './styles.css';

import EditorWysiwygCustom from '../../../../../Globais/EditorWysiwygCustom';


export const RelSecaoTextos = ({
    secaoKey, config, textosPaa, paaVigente, handleSalvarTexto, isSaving}) => {

    const textoFixoId = `texto-automatico-${secaoKey}-paa`;
    const msgRef = useRef(null);
    
    const editorContainerRef = useRef(null);
    const tooltipIconRef = useRef(null);

    const tooltipOffsetTop = 10;
    
    const [editorInstance, setEditorInstance] = useState(null);

    const textosClassNameCampo1 = `textos-campo-1`;
    const textoClassName = `texto-campo-1`;

    // Função que recalcula o padding interno
    const ajustarPadding = () => {
        if (!editorInstance) return;
        const doc = editorInstance.getDoc();
        if (!doc) return;

        const height = `${(msgRef.current?.offsetHeight || 0) + 20}px`;

        // Ajusta o padding interno dinamicamente
        if (config.chave === 'introducao') {
            doc.body.style.paddingTop = height;
        }
        if (config.chave === 'conclusao') {
            doc.body.style.paddingBottom = height;
        }
    };
    
    useEffect(() => {
        ajustarPadding();
    }, [editorInstance]);

    const handleLimparComProtecao = (textoAtual) => {
        return '<p><br></p>';
    };

    const stylesFixedTexts = {
        position: "absolute",
        left: 0,
        right: 0,
        padding: 12,
        margin: 15,
        zIndex: 2,
        pointerEvents: "none",
        backgroundColor: '#f3f3f3',
        border: '1px solid #D9D9D9',
        color: '#42474A',
        fontSize: '14px',
        marginBottom: '16px',
        borderRadius: '2px',
        userSelect: 'none'
    }

    const styleFixedtextoSuperior = {
        ...stylesFixedTexts,
        top: '50px',
    }
    const styleFixedtextoInferior = {
        ...stylesFixedTexts,
        bottom: '90px',
    }

    const getStylesFixedTextos = () => {
        if (config.chave === 'introducao') {
            return styleFixedtextoSuperior
        } else if (config.chave === 'conclusao') {
            return styleFixedtextoInferior
        } else {
            return stylesFixedTexts
        }
    }

    return (
        <>
            <div className={textosClassNameCampo1}>
                {textosPaa[config?.textosPaa?.[0]] && (
                    <div className={textoClassName}
                        dangerouslySetInnerHTML={{ __html: textosPaa[config.textosPaa[0]] }}/>
                )}
            </div>

            <div className="editor-container" ref={editorContainerRef}>
                <div style={{ position: "relative", width: "100%", maxWidth: '100%', margin: "0 auto" }}>
                    {/* Mensagem no topo */}
                    <div ref={msgRef} style={{...getStylesFixedTextos()}}>
                        <div id={textoFixoId} dangerouslySetInnerHTML={{ __html: textosPaa[config.textosPaa[1]] || '' }}></div>
                        <Tooltip title="Texto padrão inserido automaticamente no documento" placement="top">
                            <span className="tooltip-icon-externo"
                                ref={tooltipIconRef}
                                style={{ top: tooltipOffsetTop }}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                            </span>
                        </Tooltip>
                    </div>
                    <EditorWysiwygCustom
                        textoInicialEditor={(() => {
                            const textoEditor = paaVigente?.[config.campoPaa] || '';
                            return textoEditor;
                        })()}
                        tituloEditor=""
                        handleSubmitEditor={(texto) => handleSalvarTexto(config.campoPaa, texto)}
                        handleLimparEditor={(textoAtual) => handleLimparComProtecao(textoAtual)}
                        botaoCancelar={false}
                        disabled={isSaving}
                        isSaving={isSaving}
                        onEditorReady={setEditorInstance}
                    />
                </div>
            </div>
        </>
    )
};