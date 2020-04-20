import React from "react";
import "./dashboard.scss"

export const DashboardCard = ({acoesAssociacao}) => {
    console.log("Ollyver ", acoesAssociacao)

    return (
        <>
            {acoesAssociacao.info_acoes && acoesAssociacao.info_acoes.length > 0 ? acoesAssociacao.info_acoes.map((acao, index) =>
                <div key={index} className="col mb-4 container-dashboard-card">
                    <div className="card h-100">
                        <div className="card-header bg-white">
                            <span><strong>{acao.acao_associacao_nome}</strong> </span>
                        </div>
                        <div className="card-body">
                            {/*<h5 className="card-title">Card title</h5>*/}
                            <div className='row'>
                                <div className="col-12 col-md-5">
                                    <div className="col-12 align-self-center container-lado-esquerdo">
                                        <p className="pt-1 mb-1" >Custeio: <strong>{acao.saldo_atual_custeio}</strong></p>
                                        <p className="pt-1 mb-1">Capital: <strong>{acao.saldo_atual_capital}</strong></p>
                                        <p className="pt-1 pb-1 mb-0">Capital: <strong>{acao.saldo_atual_capital}</strong></p>
                                    </div>

                                </div>

                                <div className="col-12 col-md-7 align-self-center ">
                                    <p className="card-text">This is a longer card with supporting.</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            ) : null}

        </>
    );
}