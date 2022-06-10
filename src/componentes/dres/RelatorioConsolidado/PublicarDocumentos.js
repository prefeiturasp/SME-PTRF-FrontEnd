import React, {memo} from "react";

const PublicarDocumentos = ({publicarConsolidadoDre}) => {

    return(
        <div className="d-flex bd-highlight align-items-center container-publicar-cabecalho text-dark rounded-top border font-weight-bold">
            <div className="p-2 flex-grow-1 bd-highlight fonte-16">Relatórios</div>
            <div className="p-2 bd-highlight">
                <button onClick={() => publicarConsolidadoDre()} className="btn btn btn btn-success">Publicar</button>
            </div>
        </div>
    )
}
export default memo(PublicarDocumentos)