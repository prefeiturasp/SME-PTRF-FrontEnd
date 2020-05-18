import React, {useEffect, useState} from "react";
import "./login.scss"
import logoSP from "../../assets/img/logoSP.svg"
import LogoPtrf from "../../assets/img/logo-ptrf.png"
import {LoginForm} from "./LoginForm"

export const Login = () => {
    const [reload, setReload] = useState(0)
    useEffect(()=>{
        setReload(1)

    }, []);

    return (
        <>
            <div className="login-bg d-none d-lg-block d-xl-block"/>
            <div className="right-half login-ptrf d-lg-flex">
                <div className="container my-auto">
                    <div className="logo-ptrf">
                        <img className="img-fluid" src={LogoPtrf} alt=""/>
                    </div>

                    <div className="w-100 my-3 d-flex justify-content-center">
                        <LoginForm/>
                    </div>

                    <div className="logo-prefeitura">
                        <img src={logoSP} alt=""/>
                    </div>
                </div>
            </div>

        </>
    )
}