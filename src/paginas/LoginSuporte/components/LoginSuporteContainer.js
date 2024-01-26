import React from "react";
import '../style/login-style.scss'
import logoSP from "../../../assets/img/logoSP.svg"
import LogoPtrf from "../../../assets/img/logo-ptrf-verde.png"

export const LoginSuporteContainer = ({children}) => {
    return (
        <>
            <div className="login-bg-suporte d-none d-lg-block d-xl-block"/>
            <div className="tela-direita-login-suporte login-ptrf d-lg-flex">
                <div className="container my-auto">
                    <div className='text-center'>
                        <div className="suporte-label">Acesso exclusivo as unidades de suporte</div>
                    </div>
                    <div className="logo-ptrf">
                        <img className="img-fluid img-logo-ptrf" src={LogoPtrf} alt=""/>
                    </div>
                    <div className="w-100 my-3 d-flex justify-content-center">
                        {children}
                    </div>
                    <div className="logo-prefeitura">
                        <img src={logoSP} alt=""/>
                    </div>
                </div>
            </div>
        </>
    )
};