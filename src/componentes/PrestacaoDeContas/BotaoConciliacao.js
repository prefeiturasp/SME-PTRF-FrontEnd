import React from "react";
import {Link} from "react-router-dom";

export const BotaoConciliacao = ({statusPrestacaoConta}) => {
    return(
        <>
            {statusPrestacaoConta !== undefined && (
                <div className='row mt-5'>

                    <div className="col-12 col-md-8">
                        <p><strong>Última conciliação feita em 22/03/2020 10:45</strong></p>
                    </div>

                    <div className="col-12 col-md-4 text-right">
                        <Link
                            to="/detalhe-das-prestacoes"
                            className="btn btn btn-success"
                        >
                            <strong>Iniciar a prestação de contas</strong>
                        </Link>
                    </div>
                </div>
            )}
        </>
    )
}