import React from "react";
import "./login.scss"
import logoSP from "../../assets/img/logoSP.svg"
import LogoPtrf from "../../assets/img/logo-ptrf.png"

export const Login = () => {
    return (
        <>
            <div className="login-bg d-none d-lg-block d-xl-block"/>
            <div className="right-half login-ptrf d-lg-flex">
                <div className="container my-auto">
                    <div className="logo-safi">
                        <img src={LogoPtrf} alt=""/>
                    </div>

                    <div>
                        <div className="w-100 my-5 d-flex justify-content-center">
                            <p>Processando...</p>
                        </div>

                    </div>

                    <div className="logo-prefeitura">
                        <img src={logoSP} alt=""/>
                    </div>
                </div>
            </div>

        </>
    )
}