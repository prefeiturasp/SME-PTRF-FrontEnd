import React from "react";
import "../../../assets/img/img-404.svg"
import "../../../paginas/404/pagina-404.scss"

export const MsgImgCentralizada = (props) => {
    const {texto, img } = props
    return(
        <div className="row justify-content-center container-404 mt-5">
            <div className="col-md-auto col-lg-7">
                <p className="texto-404 text-center">
                    {texto}
                </p>
            </div>

            <div className="col-md-auto col-lg-12">
                <div className="text-center">
                    <img src={img} alt="" className="img-fluid"/>
                </div>
            </div>
        </div>

    )

}