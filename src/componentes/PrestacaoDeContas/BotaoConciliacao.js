import React from "react";
import {Link} from "react-router-dom";

export const BotaoConciliacao = ({statusPrestacaoConta, cssBotaoConciliacao, textoBotaoConciliacao, botaoConciliacaoReadonly, handleClickBotaoConciliacao}) => {
    return(
        <>
            {statusPrestacaoConta !== undefined && (
                <div className="col-12 col-md-4 text-right">
                    <button
                        disabled={botaoConciliacaoReadonly}
                        className={`btn ${cssBotaoConciliacao}`}
                        onClick={handleClickBotaoConciliacao}
                    >
                        <strong>{textoBotaoConciliacao}</strong>
                    </button>
                </div>
            )}
        </>
    )
}