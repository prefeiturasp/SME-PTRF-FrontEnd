import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons";

import {
    Card,
    CardBody,
    CardTitle,
    CardSubtitle,
    CardImg,
} from "reactstrap";
import {redirect} from "../../../utils/redirect";

const cardStyle = {
    cursor: "pointer",
    paddingTop: "16px"
};


const cardTitleStyle = {
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "15px",
    lineHeight: "18px",
    color: "#2B7D83",
    textAlign:"center"
};

const cardSubTitleStyle = {
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "15px",
    lineHeight: "18px",
    color: "#2B7D83",
    textAlign:"right"
};


const GrupoTituloStyle = {
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "20px",
    lineHeight: "23px",
    color: "#2B7D83",
};


const IconeSetaStyle = {
    fontStyle: "normal",
    fontWeight: "900",
    fontSize: "14px",
    lineHeight: "16px",
    color: "#42474A",
};

export const ParametrizacaoCard = ({itensParametrizacao, nomeGrupo}) => {
    return (
        <>
            <h4 style={GrupoTituloStyle}>{nomeGrupo}</h4>
            <div className="row mt-4">
                {itensParametrizacao && itensParametrizacao.length > 0 && itensParametrizacao.map((card, index) =>
                    <div key={index} className="col-sm-12 col-md-4 col-xl-3 mb-4 ">
                        <div className="card h-100 container-cards-dre-dashboard">

                            <Card
                                className="servico h-"
                                style={cardStyle}
                                onClick={() => redirect(card.url)}

                            >
                                <CardImg top width="100%" src={card.icone} alt="Icone de seleção" height="71"/>
                                <CardBody>
                                    <CardTitle style={cardTitleStyle}>{card.parametro}</CardTitle>
                                    <CardSubtitle style={cardSubTitleStyle}><FontAwesomeIcon style={IconeSetaStyle} icon={faArrowRight}/></CardSubtitle>
                                </CardBody>
                            </Card>

                        </div>
                    </div>
                )}
            </div>
        </>
    )
};