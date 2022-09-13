import React from "react";

const PreviaDocumentos = ({gerarPreviaConsolidadoDre}) => {
    return(
        <button onClick={() => gerarPreviaConsolidadoDre()} className="btn btn-outline-success">
            Prévias
        </button>   
    )
}
export default PreviaDocumentos