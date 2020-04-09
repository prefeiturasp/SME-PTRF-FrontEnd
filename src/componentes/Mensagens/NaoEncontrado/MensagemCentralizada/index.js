import React from "react";
import "../../../../assets/img/img-404.svg"
import "../../../../paginas/404/pagina-404.scss"
import Img404 from "../../../../assets/img/img-404.svg";

export const MensagemCentralizada = (props) => {

    const {texto}=props

    return(
        <div className="row justify-content-center container-404 mt-5">
            <div className="col-md-auto col-lg-7">
                <p className="texto-404 text-center">
                    {texto}
                </p>
            </div>

            <div className="col-md-auto col-lg-12">
                <div className="text-center">
                    <img src={Img404} alt="" className="img-fluid"/>
                </div>
            </div>
        </div>

    )

}