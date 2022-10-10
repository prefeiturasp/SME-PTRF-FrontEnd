import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from "react-tooltip";

export const DashboardCard = ({itensDashboard, handleClickVerRelatorios, handleClickVerDRE}) => {
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
                                <div className="card-text card-qtde-associacoes  mb-0 pb-3 d-flex justify-content-between">
                                    <span>{card.quantidade_de_relatorios}</span>
                                    {card.quantidade_retornadas >= 1 &&
                                        <span data-tip={card.quantidade_retornadas > 1 ? '<p class="mb-0">Existem ' + card.quantidade_retornadas + ' relatórios</p> <p class="mb-0">retornadas das U.Es</p>' : '<p class="mb-0">Existe ' + card.quantidade_retornadas + ' relatório </p><p class="mb-0"> retornada das U.Es</p>' } data-html={true}>
                                            <FontAwesomeIcon
                                                style={{fontSize: '18px', marginLeft: "3px", color: '#C65D00'}}
                                                icon={faInfoCircle}
                                            />
                                            <ReactTooltip/>
                                        </span>
                                    }
                                    {card.quantidade_nao_recebida >= 1 &&
                                        <span data-tip={card.quantidade_nao_recebida > 1 ? '<p class="mb-0">'+ card.quantidade_nao_recebida + ' novas relatórios não recebidas</p>' : '<p class="mb-0">' + card.quantidade_nao_recebida + ' nova relatório não recebida</p>' } data-html={true}>
                                            <FontAwesomeIcon
                                                style={{fontSize: '18px', marginLeft: "3px", color: '#C65D00'}}
                                                icon={faInfoCircle}
                                            />
                                            <ReactTooltip/>
                                        </span>
                                    }
                                </div>

                                <p className="text-center">
                                    {
                                    card.status === 'NAO_GERADO' ?
                                    <button
                                    onClick={() => handleClickVerDRE()}
                                    className="btn btn-outline-success btn-ver-prestacoes">
                                    <FontAwesomeIcon
                                        style={{marginRight: "3px", color: '#2B7D83'}}
                                        icon={faEye}
                                    />
                                    Ver DREs
                                </button>
                                :
                                    <button
                                        onClick={() => handleClickVerRelatorios(card.status)}
                                        className="btn btn-outline-success btn-ver-prestacoes">
                                        <FontAwesomeIcon
                                            style={{marginRight: "3px", color: '#2B7D83'}}
                                            icon={faEye}
                                        />
                                        Ver documentação
                                    </button>
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
};