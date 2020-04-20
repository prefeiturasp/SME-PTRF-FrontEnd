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
                            <div className='row'>
                                <div className="col-12 col-md-5 align-self-center">
                                    <div className="col-12 container-lado-esquerdo pt-1 pb-1">

                                        <p className="pt-1 mb-1" >Custeio: <strong>{acao.saldo_atual_custeio}</strong></p>
                                        <p className="pt-1 mb-1">Capital: <strong>{acao.saldo_atual_capital}</strong></p>
                                        <p className="pt-1 pb-1 mb-0">Total: <strong>{acao.saldo_atual_total}</strong></p>
                                    </div>

                                </div>

                                <div className="col-12 col-md-7 container-lado-direito align-self-center ">
                                    <p className="pt-1 mb-1" >Saldo reprogramado: <strong>{acao.saldo_reprogramado}</strong></p>
                                    <p className="pt-1 mb-1">Repasses no período: <strong>{acao.repasses_no_periodo}</strong></p>
                                    <p className="pt-1 pb-1 mb-0">Despesa declarada: <strong>{acao.despesas_no_periodo}</strong></p>
                                    {acao.acao_associacao_nome === "PTRF" ? (
                                        <p className="pt-1 pb-1 mb-0">Próx. repasse a partir de: <strong>{acoesAssociacao.data_prevista_repasse}</strong></p>
                                    ) : null}

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            ) : null}

        </>
    );
}