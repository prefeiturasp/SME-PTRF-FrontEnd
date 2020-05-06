import React from "react";
import {Link} from "react-router-dom";

export const BotaoConciliacao = ({statusPrestacaoConta, cssBotaoConciliacao, textoBotaoConciliacao}) => {
    return(
        <>
            {statusPrestacaoConta !== undefined && (
                <div className="col-12 col-md-4 text-right">
                    <Link
                        to="/detalhe-das-prestacoes"
                        className={`btn ${cssBotaoConciliacao}`}
                    >
                        <strong>{textoBotaoConciliacao}</strong>
                    </Link>
                </div>
            )}
        </>
    )
}