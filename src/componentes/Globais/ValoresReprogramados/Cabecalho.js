import React from "react";

export const Cabecalho = ({valoresReprogramados, textoPeriodo}) => {
    return (
        <div className="row">
            <div className="col-12">
                <p className="mb-0 titulo-associacao">{valoresReprogramados.associacao.nome}</p>
                <p className="mb-0 subtitulo-associacao"><strong>Código Eol: {valoresReprogramados.associacao.codigo_eol}</strong></p>
                <p className="mb-0 subtitulo-associacao"><strong>Período: {textoPeriodo()}</strong></p>
            </div>
        </div>
    )
}