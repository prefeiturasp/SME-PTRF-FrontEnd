import React from "react";
import { LoginSuporteForm } from "./form"
import logoSP from "../../assets/img/logoSP.svg"
import LogoPtrf from "../../assets/img/logo-ptrf-verde.png"
import './login-suporte.scss'
import { useLocation } from "react-router-dom";

export const LoginSuporte = () => {
    const location = useLocation();
    return (
    <div className="login-suporte-container">
        <div className="login-suporte-card">
            <div className="login-suporte-card-header">
                <h6 className="text-center">Acesso exclusivo as unidades de suporte</h6>
            </div>
            <div className="text-center my-3">
                <img className="img-fluid" src={LogoPtrf} alt="logo-ptrf"/>
            </div>
            <div className="login-suporte-card-form">
                <LoginSuporteForm redefinicaoDeSenha={location.state?.redefinicaoDeSenha} />
            </div>
            <div className="text-center my-3">
                <img src={logoSP} alt="logo-prefeitura-sp"/>
            </div>
        </div>
    </div>
    )
}