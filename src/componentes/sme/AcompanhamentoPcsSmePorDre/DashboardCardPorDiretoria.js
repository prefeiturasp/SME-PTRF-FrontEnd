import React from "react";

export const DashboardCardPorDiretoria = ({itensDashboard, statusPeriodo}) => {
    const cardQuantidadeStyleByStatus = {
        1: {
            fontFamily: "Roboto",
            fontStyle: "normal",
            fontWeight: "700",
            fontSize: "32px",
            lineHeight: "37.5px",
            color: "#D06D12",
            textAlign: "left"
        },
        2: {
            fontFamily: "Roboto",
            fontStyle: "normal",
            fontWeight: "700",
            fontSize: "32px",
            lineHeight: "37.5px",
            color: "#42474A",
            textAlign: "left"
        },
        'TOTAL': {
            fontFamily: "Roboto",
            fontStyle: "normal",
            fontWeight: "700",
            fontSize: "32px",
            lineHeight: "37.5px",
            color: "#FFFFFF",
            textAlign: "left"
        }
    };

    const cardTotalStyle = {
        fontFamily: "Roboto",
        fontStyle: "normal",
        fontWeight: "700",
        fontSize: "32px",
        lineHeight: "37.5px",
        color: "#FFFFFF",
        textAlign: "left",
        backgroundColor:"#2B7D83",
    };

    const idxStyle = statusPeriodo ? statusPeriodo.cor_idx : 1;

    return (
        <>
        <div className="row mt-4">
            {
            statusPeriodo.status_txt === "Período concluído." ?
            itensDashboard && itensDashboard?.cards?.slice(-3)?.map((card, index) =>
                <div key={index} className="col-sm-12 col-md-4 col-xl-3 mb-4 ">
                    <div className="card h-100 container-cards-dre-dashboard" style={card.status === 'TOTAL_UNIDADES' ? cardTotalStyle : {}}>
                        <div className="card-header">
                            {card.titulo}
                        </div>
                        <hr className="mt-0 mb-0 ml-3 mr-3"/>
                        <div className="card-body">
                            <p className="card-text card-qtde-associacoes  mb-0 pb-3"
                            style={card.status !== 'TOTAL_UNIDADES' ? cardQuantidadeStyleByStatus[idxStyle] : cardQuantidadeStyleByStatus['TOTAL']}>{card.quantidade_prestacoes}</p>
                        </div>
                    </div>
                </div>
            ) :
                itensDashboard && itensDashboard?.cards?.map((card, index) => 
                    <div key={index} className="col-sm-12 col-md-4 col-xl-3 mb-4 ">
                        <div className="card h-100 container-cards-dre-dashboard" style={card.status === 'TOTAL_UNIDADES' ? cardTotalStyle : {}}>
                            <div className="card-header">
                                {card.titulo}
                            </div>
                            <hr className="mt-0 mb-0 ml-3 mr-3"/>
                            <div className="card-body">
                                <p className="card-text card-qtde-associacoes  mb-0 pb-3"
                                style={card.status !== 'TOTAL_UNIDADES' ? cardQuantidadeStyleByStatus[idxStyle] : cardQuantidadeStyleByStatus['TOTAL']}>{card.quantidade_prestacoes}</p>
                            </div>
                        </div>
                    </div>
                )}
        </div>
        </>
    )
};