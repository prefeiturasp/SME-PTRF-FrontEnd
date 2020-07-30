import React from "react";
import "./cabecalho.scss"
import LogoPtrf from "../../../assets/img/logo-ptrf-verde.png"
import IconeSair from "../../../assets/img/sair.svg"

import { authService } from '../../../services/auth.service';
import {DADOS_USUARIO_LOGADO, visoesService} from "../../../services/visoes.service";

export const Cabecalho = () => {

    const logout = () => {
        authService.logout()
    };

    let dados_usuario_logado = localStorage.getItem(DADOS_USUARIO_LOGADO) ? JSON.parse(localStorage.getItem(DADOS_USUARIO_LOGADO)) : null;

    return (
        <nav className="cabecalho navbar navbar-expand-lg fixed-top pb-0">
            <img className="img-fluid logo-cabecalho ml-3" src={LogoPtrf} alt=""/>

                <ul className="navbar-nav ml-auto">

                   {/* <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Visões
                        </a>
                        {dados_usuario_logado && dados_usuario_logado.visoes.length > 0 &&
                            <li className="dropdown-menu" aria-labelledby="navbarDropdown">
                                {dados_usuario_logado.visoes.map((visao)=>
                                    <button onClick={()=>visoesService.alternaVisoes(visao.tipo)} className="dropdown-item">{visao.label}</button>
                                )}

                            </li>
                        }

                    </li>*/}
                    <li className="nav-item text-center">
                        <button className="btn-sair" onClick={logout}><img className="img-fluid icone-sair" src={IconeSair} alt=""/></button>
                        <p className="mb-">Sair</p>
                    </li>
                </ul>
        </nav>
    );
}