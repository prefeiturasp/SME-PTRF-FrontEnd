import React, {memo, useState} from "react";
import { Editor } from "@tinymce/tinymce-react";
import "./editor-wysiwyg.scss"

const EditorWysiwyg = ({textoInicialEditor, tituloEditor, handleSubmitEditor})=>{

    const [textoEditor, setTextoEditor] = useState(textoInicialEditor);

    return(
        <>
            {tituloEditor &&
                <p className='titulo-editor-fique-de-olho'>{tituloEditor}</p>
            }
            <Editor
                apiKey={process.env.REACT_APP_EDITOR_KEY}
                initialValue={textoInicialEditor ? textoInicialEditor : '<p> </p>'}
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
                onEditorChange={setTextoEditor}
            />
            <div className="d-flex  justify-content-end pb-3 mt-3">
                <button className='btn btn-success' onClick={()=>handleSubmitEditor(textoEditor)} type='button'>Salvar</button>
            </div>
        </>
    )
};

export default memo(EditorWysiwyg)