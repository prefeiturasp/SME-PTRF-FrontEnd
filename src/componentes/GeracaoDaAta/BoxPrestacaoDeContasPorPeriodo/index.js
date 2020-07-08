import React from "react";
import "../geracao-da-ata.scss"

export const BoxPrestacaoDeContasPorPeriodo = ({corBoxPrestacaoDeContasPorPeriodo, textoBoxPrestacaoDeContasPorPeriodo, dataBoxPrestacaoDeContasPorPeriodo, setLoading}) => {

    const onClickVisualizarAta = () =>{
        setLoading(true)
        window.location.assign('/visualizacao-da-ata')
    }

    return (
        <div className="row mt-5">
            <div className="col-12">
                <h1 className="titulo-box-prestacao-de-contas-por-periodo">Ata de apresentação da prestação de contas</h1>
                <div className="col-12">
                    <div className="row mt-3 container-box-prestacao-de-contas-por-periodo pt-4 pb-4">
                        <div className="col-12 col-md-8">
                            <p className='fonte-14 mb-1'><strong>{textoBoxPrestacaoDeContasPorPeriodo}</strong></p>
                            <p className={`fonte-12 mb-1 status-data-${corBoxPrestacaoDeContasPorPeriodo}`}>{dataBoxPrestacaoDeContasPorPeriodo}</p>
                        </div>
                        <div className="col-12 col-md-4 align-self-center">
                            <button onClick={onClickVisualizarAta}  type="button" className="btn btn-success float-right">Visualizar ata</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};