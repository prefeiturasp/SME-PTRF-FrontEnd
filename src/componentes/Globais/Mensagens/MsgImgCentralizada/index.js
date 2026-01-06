import React from "react";
import "../../../../assets/img/img-404.svg"
import "../../../../paginas/escolas/404/pagina-404.scss"

export const MsgImgCentralizada = (props) => {
    const {texto, img, dataQa='', width } = props
    return(
        <div className="row justify-content-center container-404 mt-5">
            <div className="col-md-auto col-lg-7">
                <p className="texto-404 text-center" data-qa={`p-msg-img-centralizada-${dataQa}`}>
                    {texto}
                </p>
            </div>

            <div className="col-md-auto col-lg-12">
                <div className="text-center">
                    <img src={img} alt="" className="img-fluid" width={width}/>
                </div>
            </div>
        </div>

    )

}