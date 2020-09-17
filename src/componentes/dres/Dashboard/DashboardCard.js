import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronUp, faEye} from "@fortawesome/free-solid-svg-icons";

export const DashboardCard = ({ObjetoDashboard}) => {
    return (
        <>
            <div className="row row-cols-1 row-cols-md-4 mt-3">
            {ObjetoDashboard && ObjetoDashboard.cards && ObjetoDashboard.cards.length > 0 && ObjetoDashboard.cards.map((card, index)=>
                <div key={index} className="col-12 col-md-3 mb-4 ">
                    <div className="card h-100 container-cards-dre-dashboard">
                        <div className="card-header">{card.titulo}</div>
                        <div className="card-body">
                            <p className="card-text card-qtde-associacoes  mb-0 pb-2">{card.gtdeAssociacoes}</p>
                            <p className="text-center">
                                <a href="#" className="btn btn-outline-success btn-ver-prestacoes">
                                    <FontAwesomeIcon
                                        style={{marginRight: "3px", color: '#2B7D83'}}
                                        icon={faEye}
                                    />
                                    Ver as prestações
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </>
    )
};