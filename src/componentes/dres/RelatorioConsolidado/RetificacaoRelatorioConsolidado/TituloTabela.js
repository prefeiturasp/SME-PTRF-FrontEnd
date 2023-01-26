import React from "react";


export const TituloTabela = ({titulo}) => {
    return (
        <div className="row mt-5">
            <div className="col-12">
                <strong><p className="titulo-tabelas">{titulo}</p></strong>
            </div>
        </div>
    )
}