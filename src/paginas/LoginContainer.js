import React from "react";
import './Login/login.scss'
import logoSP from "../assets/img/logoSP.svg"
import LogoPtrf from "../assets/img/logo-ptrf-verde.png"

export const LoginContainer = ({children, linkAdicional}) => {
    return (
        <>
            <div className="login-bg d-none d-lg-block d-xl-block"/>
            <div className="right-half login-ptrf d-lg-flex">
                <div className="container my-auto">
                    <div className="logo-ptrf">
                        <img className="img-fluid img-logo-ptrf" src={LogoPtrf} alt=""/>
                    </div>

                    <div className="w-100 my-3 d-flex justify-content-center">
                        {children}
                    </div>

                    {linkAdicional &&
                    <div className="w-100 my-3 d-flex justify-content-center">
                        {linkAdicional}
                    </div>
                    }

                    <div className="logo-prefeitura">
                        <img src={logoSP} alt=""/>
                    </div>
                </div>
            </div>

        </>
    )
};