import React from "react";
import "../../../assets/img/img-404.svg"
import "../../../paginas/404/pagina-404.scss"

export const MsgImgLadoDireito = (props) => {

    const {texto, img } = props

    return(
        <div className="row container-404">
            <div className="col-lg-6 col-sm-12 mb-lg-0 align-self-center">
                <p className="texto-404">
                    {texto}
                </p>
            </div>
            <div className="col-lg-6 col-sm-12">
                <img src={img} alt="" className="img-fluid"/>
            </div>
        </div>
    )

}