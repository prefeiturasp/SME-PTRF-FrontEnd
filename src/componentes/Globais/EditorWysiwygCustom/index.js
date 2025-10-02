import React, {memo, useState, useEffect, useRef} from "react";
import { Editor } from "@tinymce/tinymce-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import "./editor-wysiwyg-custom.scss"

const TEXT_NODE = 3;
const ELEMENT_NODE = 1;

const EditorWysiwygCustom = ({
    textoInicialEditor,
    tituloEditor,
    handleSubmitEditor,
    disabled=false,
    botaoCancelar=false,
    setExibeEditor=()=>{},
    handleLimparEditor=()=>{},
    handleMudancaEditor=null,
    isSaving=false,
    onEditorReady=()=>{}
})=>{

    let REACT_APP_EDITOR_KEY = "EDITOR_KEY_REPLACE_ME";

    if (process.env.REACT_APP_NODE_ENV === "local") {
        REACT_APP_EDITOR_KEY = process.env.REACT_APP_EDITOR_KEY;
    }

    const [textoEditor, setTextoEditor] = useState(textoInicialEditor);
    const editorRef = useRef(null);

    const posicionarCursorAposTextoProtegido = () => {
        if (!editorRef.current) {
            return;
        }

        const editor = editorRef.current;
        const textoFixoId = 'texto-automatico-introducao-paa';
        const body = editor.getBody();
        const elementoFixo = body.querySelector(`#${textoFixoId}`);

        if (!elementoFixo) {
            return;
        }

        // Remove nós de texto vazios imediatamente após o texto fixo
        let proximoNo = elementoFixo.nextSibling;
        while (proximoNo && proximoNo.nodeType === TEXT_NODE && !proximoNo.nodeValue.trim()) {
            const noParaRemover = proximoNo;
            proximoNo = proximoNo.nextSibling;
            body.removeChild(noParaRemover);
        }

        // Garante que exista um bloco editável logo após o texto fixo
        if (!proximoNo || proximoNo.nodeType !== ELEMENT_NODE) {
            proximoNo = editor.dom.create('p', {}, '<br>');
            body.insertBefore(proximoNo, elementoFixo.nextSibling);
        }

        editor.selection.setCursorLocation(proximoNo, 0);
    };

    // Atualizar o editor quando textoInicialEditor mudar
    useEffect(() => {
        setTextoEditor(textoInicialEditor);
    }, [textoInicialEditor]);

    const handleLimpar = () => {
        if (handleLimparEditor && typeof handleLimparEditor === 'function') {
            // Se há uma função personalizada de limpeza, usa ela
            const novoTexto = handleLimparEditor(textoEditor);
            setTextoEditor(novoTexto);
            if (editorRef.current) {
                editorRef.current.setContent(novoTexto);
            }
        } else {
            // Comportamento padrão de limpeza
            setTextoEditor('');
            if (editorRef.current) {
                editorRef.current.setContent('');
            }
        }
    };

    return(
        <>
            {tituloEditor &&
                <p className='titulo-editor-fique-de-olho'>{tituloEditor}</p>
            }
            <Editor
                apiKey={REACT_APP_EDITOR_KEY}
                value={textoEditor}
                onInit={(evt, editor) => {
                    editorRef.current = editor;
                    const textoFixoId = 'texto-automatico-introducao-paa';
                    const isBrowserEnvironment = typeof window !== 'undefined' && window.Node;

                    if (onEditorReady && typeof onEditorReady === 'function') {
                        onEditorReady(editor);
                        const handleRemove = () => onEditorReady(null);
                        editor.on('remove', handleRemove);
                    }

                    const obterElementoFixo = () => editor.getBody().querySelector(`#${textoFixoId}`);

                    const isWhitespaceTextNode = (node) => node && node.nodeType === TEXT_NODE && !node.nodeValue.trim();

                    const removerNosDeTextoVazios = (noBase) => {
                        if (!noBase) {
                            return;
                        }

                        let noParaVerificar = noBase.nextSibling;
                        const body = editor.getBody();

                        while (noParaVerificar && noParaVerificar.nodeType === TEXT_NODE && !noParaVerificar.nodeValue.trim()) {
                            const noParaRemover = noParaVerificar;
                            noParaVerificar = noParaVerificar.nextSibling;
                            body.removeChild(noParaRemover);
                        }

                        return noParaVerificar;
                    };

                    const garantirBlocoEditavelAposTextoFixo = () => {
                        const elementoFixo = obterElementoFixo();

                        if (!elementoFixo) {
                            return null;
                        }

                        const body = editor.getBody();
                        let proximoNo = removerNosDeTextoVazios(elementoFixo) || elementoFixo.nextSibling;

                        if (!proximoNo || proximoNo.nodeType !== ELEMENT_NODE) {
                            proximoNo = editor.dom.create('p', {}, '<br>');
                            body.insertBefore(proximoNo, elementoFixo.nextSibling);
                        }

                        return proximoNo;
                    };

                    const posicionarCursorSegurandoProtecao = () => {
                        const blocoEditavel = garantirBlocoEditavelAposTextoFixo();
                        if (blocoEditavel) {
                            editor.selection.setCursorLocation(blocoEditavel, 0);
                        }
                    };

                    const selecaoAntesDoTextoFixo = () => {
                        if (!isBrowserEnvironment) {
                            return false;
                        }

                        const elementoFixo = obterElementoFixo();
                        if (!elementoFixo) {
                            return false;
                        }

                        const selection = editor.selection;
                        if (!selection) {
                            return false;
                        }

                        const range = selection.getRng();
                        if (!range) {
                            return false;
                        }

                        let container = range.startContainer;
                        const { startOffset } = range;
                        const { DOCUMENT_POSITION_PRECEDING } = window.Node;

                        if (elementoFixo.contains(container)) {
                            return false;
                        }

                        const body = editor.getBody();

                        if (container === body) {
                            const childNode = body.childNodes[startOffset] || body.childNodes[0];

                            if (!childNode) {
                                return false;
                            }

                            if (childNode === elementoFixo) {
                                return true;
                            }

                            return Boolean(elementoFixo.compareDocumentPosition(childNode) & DOCUMENT_POSITION_PRECEDING);
                        }

                        if (container.nodeType === TEXT_NODE && container.parentNode) {
                            if (container.parentNode === elementoFixo) {
                                return false;
                            }

                            if (startOffset === 0) {
                                container = container.parentNode;
                            }
                        }

                        if (container === elementoFixo || elementoFixo.contains(container)) {
                            return false;
                        }

                        return Boolean(elementoFixo.compareDocumentPosition(container) & DOCUMENT_POSITION_PRECEDING);
                    };

                    const selecionarConteudoUsuario = () => {
                        const elementoFixo = obterElementoFixo();

                        if (!elementoFixo) {
                            editor.execCommand('SelectAll');
                            return;
                        }

                        const body = editor.getBody();
                        const nodes = Array.from(body.childNodes);
                        if (!nodes.length) {
                            return;
                        }

                        let startIndex = nodes.indexOf(elementoFixo);
                        if (startIndex === -1) {
                            editor.execCommand('SelectAll');
                            return;
                        }

                        startIndex += 1;

                        while (startIndex < nodes.length && isWhitespaceTextNode(nodes[startIndex])) {
                            startIndex += 1;
                        }

                        if (startIndex >= nodes.length) {
                            posicionarCursorSegurandoProtecao();
                            return;
                        }

                        let endIndex = nodes.length - 1;
                        while (endIndex >= startIndex && isWhitespaceTextNode(nodes[endIndex])) {
                            endIndex -= 1;
                        }

                        if (endIndex < startIndex) {
                            posicionarCursorSegurandoProtecao();
                            return;
                        }

                        editor.focus();
                        const range = editor.dom.createRng();
                        range.setStart(body, startIndex);
                        range.setEnd(body, endIndex + 1);
                        editor.selection.setRng(range);
                    };
                    
                    // Adiciona evento para interceptar cliques
                    editor.on('click', (e) => {
                        const elementoFixo = obterElementoFixo();

                        if (elementoFixo) {
                            const range = editor.selection.getRng();
                            const clickedElement = range.startContainer;

                            const clicouDentroDoTextoFixo = elementoFixo.contains(clickedElement);
                            const clicouAntesDoTextoFixo = selecaoAntesDoTextoFixo();

                            if (clicouDentroDoTextoFixo || clicouAntesDoTextoFixo) {
                                posicionarCursorSegurandoProtecao();
                                e.preventDefault();
                            }
                        }
                    });
                    
                    // Adiciona evento para interceptar tentativas de digitação antes do texto fixo
                    editor.on('keydown', (e) => {
                        const elementoFixo = obterElementoFixo();

                        const isSelectAll = (e.ctrlKey || e.metaKey) && (e.key === 'a' || e.key === 'A');
                        if (isSelectAll) {
                            e.preventDefault();
                            e.stopPropagation();
                            selecionarConteudoUsuario();
                            return false;
                        }

                        if (!elementoFixo) {
                            return;
                        }

                        if (editor.selection && editor.selection.isCollapsed() && selecaoAntesDoTextoFixo()) {
                            e.preventDefault();
                            e.stopPropagation();
                            posicionarCursorSegurandoProtecao();
                            return false;
                        }

                        if (elementoFixo.contains(editor.selection.getNode())) {
                            e.preventDefault();
                            e.stopPropagation();
                            posicionarCursorSegurandoProtecao();
                            return false;
                        }
                    });
                    
                    // Adiciona evento para interceptar inserção de conteúdo antes do texto fixo
                    editor.on('BeforeSetContent', (e) => {
                        // Ignora alterações que afetam apenas a seleção (ex.: bold, italic, listas)
                        if (e.selection) {
                            return;
                        }

                        const textoFixoId = 'texto-automatico-introducao-paa';
                        const elementoFixo = editor.getBody().querySelector(`#${textoFixoId}`);

                        if (elementoFixo && e.content) {
                            // Se o conteúdo não contém o texto fixo, adiciona ele no início
                            if (!e.content.includes(`id="${textoFixoId}"`)) {
                                const textoFixo = elementoFixo.outerHTML;
                                e.content = textoFixo + e.content;
                            }
                        }
                    });
                    
                    // Adiciona evento para interceptar mudanças no conteúdo
                    editor.on('NodeChange', () => {
                        const body = editor.getBody();
                        const elementoFixo = obterElementoFixo();

                        if (elementoFixo) {
                            // Remove nós (inclusive textos vazios) que apareçam antes do texto fixo
                            let nodeAnterior = elementoFixo.previousSibling;
                            while (nodeAnterior) {
                                const nodeParaRemover = nodeAnterior;
                                nodeAnterior = nodeAnterior.previousSibling;
                                body.removeChild(nodeParaRemover);
                            }

                            // Garante que o texto fixo seja efetivamente o primeiro nó do body
                            if (body.firstChild !== elementoFixo) {
                                body.insertBefore(elementoFixo, body.firstChild);
                            }

                            if (editor.selection && editor.selection.isCollapsed() && selecaoAntesDoTextoFixo()) {
                                posicionarCursorSegurandoProtecao();
                            }
                        }
                    });

                    editor.on('SelectionChange', () => {
                        if (!editor.selection || !editor.selection.isCollapsed()) {
                            return;
                        }

                        if (selecaoAntesDoTextoFixo()) {
                            posicionarCursorSegurandoProtecao();
                        }
                    });

                    editor.on('focus', () => {
                        posicionarCursorSegurandoProtecao();
                    });
                    
                    // Posiciona o cursor após o texto protegido quando o editor é inicializado
                    setTimeout(() => {
                        posicionarCursorSegurandoProtecao();
                    }, 100);
                }}
                init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                        'advlist autolink lists link image charmap print preview anchor code',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar:
                    // eslint-disable-next-line no-multi-str
                        'undo redo | formatselect | bold italic backcolor | \
                        alignleft aligncenter alignright alignjustify | \
                        bullist numlist outdent indent | removeformat | link | table | code | help '
                }}
                onEditorChange={(content) => {
                    // Validação adicional para garantir que o texto fixo esteja no início
                    const textoFixoId = 'texto-automatico-introducao-paa';
                    let conteudoValidado = content;
                    
                    if (content && content.includes(`id="${textoFixoId}"`)) {
                        // Encontra a posição do texto fixo
                        const regex = new RegExp(`<div id="${textoFixoId}"[^>]*>.*?</div>`, 'g');
                        const textoFixoEncontrado = content.match(regex);
                        
                        if (textoFixoEncontrado) {
                            // Remove qualquer conteúdo antes do texto fixo
                            const posicaoTextoFixo = content.indexOf(textoFixoEncontrado[0]);
                            const conteudoAposFixo = content.substring(posicaoTextoFixo);
                            
                            // Remove o texto fixo do conteúdo restante
                            const conteudoSemFixo = conteudoAposFixo.replace(regex, '');
                            
                            // Reconstrói o conteúdo com o texto fixo no início
                            conteudoValidado = textoFixoEncontrado[0] + conteudoSemFixo;
                        }
                    }
                    
                    if (handleMudancaEditor && typeof handleMudancaEditor === 'function') {
                        const novoTexto = handleMudancaEditor(conteudoValidado);
                        setTextoEditor(novoTexto);
                    } else {
                        setTextoEditor(conteudoValidado);
                    }
                }}
                disabled={disabled}
            />
            <div className={`d-flex pb-3 mt-3 ${botaoCancelar ? 'justify-content-between' : 'justify-content-end'}`}>
                {botaoCancelar && (
                    <button className="btn btn-danger" onClick={() => {
                        setExibeEditor(false);
                    }} type="button">
                        Cancelar
                    </button>
                )}
                <div className="d-flex" style={{ gap: '11px' }}>
                    <button className="btn btn-outline-secondary btn-limpar-customizado" onClick={handleLimpar} type="button" disabled={disabled || isSaving}>
                        Limpar
                    </button>
                    <button className="btn btn-success" onClick={() => handleSubmitEditor(textoEditor)} type="button" disabled={disabled || isSaving}>
                        {isSaving ? (
                            <>
                                <FontAwesomeIcon 
                                    icon={faSpinner} 
                                    spin 
                                    style={{ marginRight: "8px" }} 
                                />
                                Salvando...
                            </>
                        ) : (
                            "Salvar"
                        )}
                    </button>
                </div>
            </div>

        </>
    )
};

export default memo(EditorWysiwygCustom)
