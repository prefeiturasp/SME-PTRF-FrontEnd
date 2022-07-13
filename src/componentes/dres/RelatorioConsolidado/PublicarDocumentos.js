import React, {memo} from "react";

const PublicarDocumentos = ({podeGerarPrevia, publicado, setShowPublicarRelatorioConsolidado, children}) => {
    return(
        <div className="d-flex bd-highlight align-items-center container-publicar-cabecalho text-dark rounded-top border font-weight-bold">
            <div className="p-2 flex-grow-1 bd-highlight fonte-16">Relatórios</div>

            {podeGerarPrevia() &&
                <div className="p-2 bd-highlight">
                    {children}
                </div>
            }

            {!publicado() &&
                <div className="p-2 bd-highlight">
                    <button onClick={() => setShowPublicarRelatorioConsolidado(true)} className="btn btn-success">Publicar</button>
                </div>
            }
        </div>
    )
}
export default memo(PublicarDocumentos)