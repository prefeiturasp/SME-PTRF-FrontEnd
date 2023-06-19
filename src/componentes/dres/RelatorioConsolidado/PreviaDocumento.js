import React from "react";
import {visoesService} from "../../../services/visoes.service";

const PreviaDocumentos = ({gerarPreviaConsolidadoDre}) => {
    return(
        <button
            onClick={() => gerarPreviaConsolidadoDre()}
            className="btn btn-outline-success"
            disabled={!visoesService.getPermissoes(['gerar_relatorio_consolidado_dre'])}
        >
            Prévias
        </button>   
    )
}
export default PreviaDocumentos