import React from "react";

export const DataUltimaConciliacao = ({statusPrestacaoConta, dataUltimaConciliacao}) => {
    return (
        <>
            {statusPrestacaoConta !== undefined && (
                <div className="col-12 col-md-8">
                    <p><strong>Última conciliação feita em {dataUltimaConciliacao}</strong></p>
                </div>
            )}
        </>
    )
}