import React from "react";
import "../geracao-da-ata.scss"

export const BoxPrestacaoDeContasPorPeriodo = () => {
    return (
        <div className="row mt-5">
            <div className="col-12">
                <h1 className="titulo-box-prestacao-de-contas-por-periodo">Ata de apresentação da prestação de contas por período</h1>
                <div className="col-12">
                    <div className="row mt-3 border pt-4 pb-4">
                        <div className="col-12 col-md-8">
                            <p className='fonte-14 mb-1'><strong>Ata de apresentação da prestação de contas</strong></p>
                            <p className="fonte-12 mb-1 status-preenchido">Último preenchimento em 10/05/2020 10:50</p>
                        </div>
                        <div className="col-12 col-md-4 align-self-center">
                            <button type="button" className="btn btn-success float-right">Visualizar ata</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};