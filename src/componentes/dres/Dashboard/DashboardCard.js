import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye} from "@fortawesome/free-solid-svg-icons";

export const DashboardCard = ({itensDashboard, handleClickVerPrestacaoes}) => {
    return (
        <>
            <div className="row mt-4">
                {itensDashboard && itensDashboard.cards && itensDashboard.cards.length > 0 && itensDashboard.cards.map((card, index) =>
                    <div key={index} className="col-sm-12 col-md-4 col-xl-3 mb-4 ">
                        <div className="card h-100 container-cards-dre-dashboard">
                            <div className="card-header">
                                {card.titulo}
                            </div>
                            <hr className="mt-0 mb-0 ml-3 mr-3"/>
                            <div className="card-body">
                                <p className="card-text card-qtde-associacoes  mb-0 pb-3">{card.quantidade_prestacoes}</p>
                                <p className="text-center">
                                    <button
                                        onClick={() => handleClickVerPrestacaoes(card.status)}
                                        className="btn btn-outline-success btn-ver-prestacoes">
                                        <FontAwesomeIcon
                                            style={{marginRight: "3px", color: '#2B7D83'}}
                                            icon={faEye}
                                        />
                                        Ver as prestações
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
};