import React from "react";

export const TextoExplicativo = ({textoExplicativo}) => {
    return (
        <div className="col-12 container-texto-explicativo mb-4">
            <div dangerouslySetInnerHTML={{ __html: textoExplicativo }} />
        </div>
    )
}