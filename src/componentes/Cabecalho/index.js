import React from "react";
import "./cabecalho.scss"
import LogoPtrf from "../../assets/img/logo-ptrf.png"

export const Cabecalho = () => {

    return (
        <div className="col-12 container-cabecalho">

                <div className="d-flex justify-content-between bd-highlight mb-3">
                    <div className="p-2 bd-highlight">
                        <img className="img-fluid logo-cabecalho ml-3" src={LogoPtrf} alt=""/>
                    </div>
                    <div className="p-2 bd-highlight">
                        <p><img className="img-fluid logo-cabecalho" src={LogoPtrf} alt=""/></p>
                        Sair
                    </div>
                </div>


        </div>

    );
}