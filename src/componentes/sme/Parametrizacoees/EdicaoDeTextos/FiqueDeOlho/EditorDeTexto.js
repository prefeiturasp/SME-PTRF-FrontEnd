import React, {memo} from "react";

const EditorDeTexto = ({textoSelecionado})=>{
    return(
        <>
            <h1>Editor de Texto</h1>
            <div dangerouslySetInnerHTML={{ __html: textoSelecionado }} />

        </>
    )
};

export default memo(EditorDeTexto)