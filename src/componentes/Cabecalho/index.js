import React from "react";
import "./cabecalho.scss"
import LogoPtrf from "../../assets/img/logo-ptrf.png"
import IconeSair from "../../assets/img/sair.svg"

export const Cabecalho = () => {

    return (

        <nav className="cabecalho navbar navbar-expand-lg fixed-top pb-0">
            <a className="navbar-brand" href="#"><img className="img-fluid logo-cabecalho ml-3" src={LogoPtrf} alt=""/></a>
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item text-center">
                        <button className="btn-sair"><img className="img-fluid icone-sair" src={IconeSair} alt=""/></button>
                        <p className="mb-">Sair</p>
                    </li>

                </ul>


        </nav>
    );
}