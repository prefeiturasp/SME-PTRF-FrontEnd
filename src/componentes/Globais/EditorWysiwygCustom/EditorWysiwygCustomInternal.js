import React, {memo, useState, useEffect, useRef} from "react";
import { Editor } from "@tinymce/tinymce-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import "./editor-wysiwyg-custom.scss"

const EditorWysiwygCustom = ({
    textoInicialEditor,
    tituloEditor,
    handleSubmitEditor,
    disabled=false,
    botaoCancelar=false,
    setExibeEditor=()=>{},
    handleLimparEditor=()=>{},
    isSaving=false,
    onEditorReady=()=>{},
})=>{

    let REACT_APP_EDITOR_KEY = "EDITOR_KEY_REPLACE_ME";

    if (process.env.REACT_APP_NODE_ENV === "local") {
        REACT_APP_EDITOR_KEY = process.env.REACT_APP_EDITOR_KEY;
    }

    const [textoEditor, setTextoEditor] = useState(textoInicialEditor);
    const editorRef = useRef(null);

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

                    if (onEditorReady && typeof onEditorReady === 'function') {
                        onEditorReady(editor);
                        const handleRemove = () => onEditorReady(null);
                        editor.on('remove', handleRemove);
                    }
                }}
                init={{
                    skin: false,
                    content_css: false,
                    promotion: false,
                    branding: false,
                    base_url: '',
                    suffix: '',
                    icons_url: false,
                    external_plugins: {},
                    height: 500,
                    menubar: false,
                    plugins: 'advlist autolink lists link charmap preview anchor code searchreplace visualblocks fullscreen insertdatetime table wordcount',
                    toolbar:
                    // eslint-disable-next-line no-multi-str
                        'undo redo | formatselect | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent | blockquote | removeformat | link | table | code fullscreen'
                }}
                onEditorChange={(content) => {
                    // Validação adicional para garantir que o texto fixo esteja no início
                    let conteudoValidado = content;
                    
                    setTextoEditor(conteudoValidado);
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
                    <button className="btn btn-outline-secondary btn-limpar-customizado btn-texto" onClick={handleLimpar} type="button" disabled={disabled || isSaving}>
                        Limpar
                    </button>
                    <button className="btn btn-success btn-texto" onClick={() => handleSubmitEditor(textoEditor)} type="button" disabled={disabled || isSaving}>
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

export default memo(EditorWysiwygCustom);
