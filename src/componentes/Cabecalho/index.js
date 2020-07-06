import React from "react";
import "./cabecalho.scss"
import LogoPtrf from "../../assets/img/logo-ptrf-verde.png"
import IconeSair from "../../assets/img/sair.svg"

import { authService } from '../../services/auth.service';

export const Cabecalho = () => {

    const logout = () => {
        authService.logout()
    }

    return (
        <nav className="cabecalho navbar navbar-expand-lg fixed-top pb-0">
            <img className="img-fluid logo-cabecalho ml-3" src={LogoPtrf} alt=""/>
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item text-center">
                        <button className="btn-sair" onClick={logout}><img className="img-fluid icone-sair" src={IconeSair} alt=""/></button>
                        <p className="mb-">Sair</p>
                    </li>
                </ul>
        </nav>
    );
}