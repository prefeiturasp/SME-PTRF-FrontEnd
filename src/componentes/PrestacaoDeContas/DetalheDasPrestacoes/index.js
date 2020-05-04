import React from "react";

export const DetalheDasPrestacoes = () => {
    return(
        <div className="col-12 detalhe-das-prestacoes-container" >
            <div className="row">
                <div className='col-12 col-md-6'>
                    <p className='detalhe-das-prestacoes-titulo'>Demonstrativo financeiro da conta cheque</p>
                </div>

                <div className='col-12 col-md-6 text-right'>
                    <button type="button" className="btn btn-outline-success mr-2">prévia</button>
                    <button disabled="" type="button" className="btn btn-success btn-readonly">documento final </button>
                </div>
            </div>
        </div>
    )
}