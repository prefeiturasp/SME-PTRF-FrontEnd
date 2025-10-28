import React, {memo, useState, useEffect, useRef} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Editor } from "@tinymce/tinymce-react";

import "./editor-wysiwyg.scss"

const EditorWysiwygInternal = ({textoInicialEditor, tituloEditor, handleSubmitEditor, disabled=false, botaoCancelar=false, setExibeEditor=()=>{}, handleLimparEditor=()=>{}, isSaving=false})=>{

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
        setTextoEditor('');
        if (editorRef.current) {
            editorRef.current.setContent('');
        }
        // Não chama handleLimparEditor automaticamente - apenas limpa visualmente
    };

    return(
        <>
            {tituloEditor &&
                <p className='titulo-editor-fique-de-olho'>{tituloEditor}</p>
            }
            <Editor
                apiKey={REACT_APP_EDITOR_KEY}
                value={textoEditor}
                onInit={(evt, editor) => editorRef.current = editor}
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
                onEditorChange={setTextoEditor}
                disabled={disabled}
            />
            <div className={`d-flex pb-3 mt-3 ${botaoCancelar ? 'justify-content-between' : 'justify-content-end'}`}>
                {botaoCancelar && (
                    <button className="btn btn-danger btn-textos" onClick={() => {
                        setExibeEditor(false);
                    }} type="button">
                        Cancelar
                    </button>
                )}
                <div className="d-flex" style={{ gap: '11px' }}>
                    <button className="btn btn-outline-secondary btn-limpar-customizado btn-textos" onClick={handleLimpar} type="button" disabled={disabled || isSaving}>
                        Limpar
                    </button>
                    <button className="btn btn-success btn-textos" onClick={() => handleSubmitEditor(textoEditor)} type="button" disabled={disabled || isSaving}>
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

export default memo(EditorWysiwygInternal)

