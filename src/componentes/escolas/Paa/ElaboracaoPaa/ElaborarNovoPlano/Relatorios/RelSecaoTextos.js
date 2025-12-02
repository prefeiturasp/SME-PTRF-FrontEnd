import { useRef, useState } from 'react';
import { Tooltip } from 'antd';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './styles.css';

import EditorWysiwygCustom from '../../../../../Globais/EditorWysiwygCustom';


export const RelSecaoTextos = ({
    secaoKey, config, textosPaa, paaVigente, handleSalvarTexto, isSaving}) => {

    const editorContainerRef = useRef(null);
    const tooltipIconRef = useRef(null);

    const handleLimparComProtecao = () => {
        return "<p></p>";
    };

    const mensagemFixa = (msg) => {
        const textoFixoId = `texto-automatico-${secaoKey}-paa`;
        const stylesFixedTexts = {
            position: 'relative',
            padding: 12,
            margin: '15px 0px',
            backgroundColor: '#f3f3f3',
            border: '1px solid #D9D9D9',
            color: '#42474A',
            fontSize: '14px',
            borderRadius: '2px',
            userSelect: 'none'
        }

        const tooltipMsg = () => {
            const s = secaoKey === 'introducao' ? 'no início do' :
                        (secaoKey === 'conclusao' ? 'ao final do' : 'no');
            return `Texto padrão inserido automaticamente ${s} documento`;
        }
        return (
            <div style={stylesFixedTexts} className='mb-3'>
                <div
                    style={{paddingRight: 20}}
                    id={textoFixoId}
                    dangerouslySetInnerHTML={{ __html: msg }}></div>
                <Tooltip title={tooltipMsg()} placement="topRight">
                    <span className="tooltip-icon-externo"
                        ref={tooltipIconRef}
                        style={{ top: 10, right: 10 }}
                        >
                        <FontAwesomeIcon icon={faInfoCircle} />
                    </span>
                </Tooltip>
            </div>
        )
    }
    const validaHandleSalvar = (campo, texto) => {
        if (!(texto||"").trim()) {
            texto = handleLimparComProtecao()
        }

        handleSalvarTexto(campo, texto)
    }

    return (
        <>
            <div className="textos-campo-1">
                {textosPaa[config?.textosPaa?.[0]] && (
                    <div className="texto-campo-1"
                        dangerouslySetInnerHTML={{ __html: textosPaa[config.textosPaa[0]] }}/>
                )}
            </div>

            <div className="editor-container" ref={editorContainerRef}>
                <EditorWysiwygCustom
                    textoInicialEditor={(() => {
                        const textoEditor = paaVigente?.[config.campoPaa] || '';
                        return textoEditor;
                    })()}
                    tituloEditor=""
                    handleSubmitEditor={(texto) => validaHandleSalvar(config.campoPaa, texto)}
                    handleLimparEditor={(textoAtual) => handleLimparComProtecao(textoAtual)}
                    botaoCancelar={false}
                    disabled={isSaving}
                    isSaving={isSaving}
                    topExtraContent={secaoKey === "introducao" && mensagemFixa(textosPaa[config.textosPaa[1]])}
                    bottomExtraContent={secaoKey === "conclusao" && mensagemFixa(textosPaa[config.textosPaa[1]])}
                />
            </div>
        </>
    )
};