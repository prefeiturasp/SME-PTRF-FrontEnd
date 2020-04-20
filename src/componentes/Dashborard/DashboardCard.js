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
                            <span><strong>{acao.acao_associacao_nome}</strong></span>
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">Card title</h5>
                            <p className="card-text">This is a longer card with supporting text below as a natural
                                lead-in
                                to additional content. This content is a little bit longer.
                                This is a longer card with supporting text below as a natural lead-in to additional
                                content.
                                This content is a little bit longer.
                            </p>
                        </div>
                    </div>
                </div>
            ) : null}

        </>
    );
}