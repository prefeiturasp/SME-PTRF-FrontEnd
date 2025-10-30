import { useRef } from 'react';
import { Tooltip } from 'antd';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './styles.css';

import EditorWysiwygCustom from '../../../../../Globais/EditorWysiwygCustom';


export const RelSecaoTextos = ({
    secaoKey, config, textosPaa, paaVigente, handleSalvarTexto, isSaving}) => {

    const editorContainerRef = useRef(null);
    const tooltipIconRef = useRef(null);

    const tooltipOffsetTop = 10;

    const handleLimparComProtecao = (textoAtual) => {
        return '<p><br></p>';
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
        return (
            <div style={stylesFixedTexts} className='mb-3'>
                <div id={textoFixoId} dangerouslySetInnerHTML={{ __html: msg }}></div>
                <Tooltip title="Texto padrão inserido automaticamente no documento" placement="top">
                    <span className="tooltip-icon-externo"
                        ref={tooltipIconRef}
                        style={{ top: tooltipOffsetTop }}
                        >
                        <FontAwesomeIcon icon={faInfoCircle} />
                    </span>
                </Tooltip>
            </div>
        )
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
                    handleSubmitEditor={(texto) => handleSalvarTexto(config.campoPaa, texto)}
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