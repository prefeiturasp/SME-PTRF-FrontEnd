import React, {memo, useState} from "react";
import { Editor } from "@tinymce/tinymce-react";

const EditorWysiwyg = ({textoInicial, handleSubmitEditor})=>{

    const [textoEditor, setTextoEditor] = useState(textoInicial.textoSelecionado);

    return(
        <>
            <h1>{textoInicial.titulo}</h1>
            <Editor
                apiKey={process.env.REACT_APP_EDITOR_KEY}
                initialValue={textoInicial.textoSelecionado}
                init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar:
                    // eslint-disable-next-line no-multi-str
                        'undo redo | formatselect | bold italic backcolor | \
                        alignleft aligncenter alignright alignjustify | \
                        bullist numlist outdent indent | removeformat | link | table | help '
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