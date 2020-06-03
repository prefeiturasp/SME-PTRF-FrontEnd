import React from "react";
import "../geracao-da-ata.scss"

export const BoxPrestacaoDeContasPorPeriodo = () => {
    return (
        <div className="row mt-5">
            <div className="col-12">
                <h1 className="titulo-box-prestacao-de-contas-por-periodo">Ata de apresentação da prestação de contas por período</h1>
                <div className="col-12">

                    <div className="row mt-3 border">
                        <div className="col-12 col-md-8">
                            <p>Ata de apresentação da prestação de contas</p>
                            <p>Ata de apresentação da prestação de contas</p>
                        </div>
                        <div className="col-12 col-md-4 float-right align-self-center">
                            <button type="button" className="btn btn btn-outline-success float-right">Cadastrar despesa</button>
                        </div>
                    </div>

                </div>


            </div>
        </div>
    )
}