import React from "react";
import { Link } from "react-router-dom";
import {PaginasContainer} from "../../PaginasContainer";
import "./pagina-404.scss"
import Img404 from "../../../assets/img/img-404.svg"

export const Pagina404 = () => {

    const clickToLogin = () =>{
        return window.location.assign('/login')
    }

    return (
        <PaginasContainer>
            <div className="row container-404">
                <div className="col-lg-6 col-sm-12 mb-lg-0 align-self-center">
                    <p className="texto-404">Não encontramos a página, clique no link abaixo e seja direcionado para a página inicial</p>
                    <button
                        onClick={()=>clickToLogin()}
                        className="link-404"
                    >
                        Ir para a tela de login
                    </button>
                </div>

                <div className="col-lg-6 col-sm-12">
                    <img
                        src={Img404}
                        alt=""
                        className="img-fluid"
                    />
                </div>
            </div>

        </PaginasContainer>
    );
};

