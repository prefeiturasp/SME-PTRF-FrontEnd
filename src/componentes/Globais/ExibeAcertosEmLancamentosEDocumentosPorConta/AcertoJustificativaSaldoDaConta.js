import React from "react";

export const AcertoJustificativaSaldoDaConta = ({extratosBancariosAjustes}) => {
    if (!extratosBancariosAjustes?.solicitar_correcao_de_justificativa_de_conciliacao) {
        return null;
    }

    return (
        <div className="row">
            <div className="col-12">
                <p className="text-saldo-reprogramado" id="p_solicitar_inclusao_justificativa">
                    <strong>Incluir justificativa</strong>
                </p>
            </div>
        </div>
    );
};
