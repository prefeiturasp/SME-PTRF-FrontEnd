import React from "react";

export const DashboardCard = ({ObjetoDashboard}) => {
    return (
        <>
            <div className="row row-cols-1 row-cols-md-4">
            {ObjetoDashboard && ObjetoDashboard.cards && ObjetoDashboard.cards.length > 0 && ObjetoDashboard.cards.map((card, index)=>
                <div key={index} className="col-12 col-md-3 mb-4 pr-0">
                    <div className="card h-100 container-cards-dre-dashboard">
                        <div className="card-body">
                            <h5 className="card-title borda-bottom ">{card.titulo}</h5>
                            <p className="card-text card-qtde-associacoes">{card.gtdeAssociacoes}</p>
                            <p className="card-text">{card.gtdeAssociacoes}</p>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </>
    )
};