import React from "react";
import "../../../../assets/img/img-404.svg"
import "../../../../paginas/404/pagina-404.scss"
import Img404 from "../../../../assets/img/img-404.svg";

export const MensagemLadoDireito = (props) => {

    const {texto}=props

    return(
        <div className="row container-404">
            <div className="col-lg-6 col-sm-12 mb-lg-0 align-self-center">
                <p className="texto-404">
                    {texto}
                </p>
            </div>
            <div className="col-lg-6 col-sm-12">
                <img src={Img404} alt="" className="img-fluid"/>
            </div>
        </div>
    )

}