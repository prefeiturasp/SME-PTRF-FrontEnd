import React from "react";
import "./Login/login.scss";
import logoSP from "../assets/img/logos/logo_PrefSP_sem_fundo_horizontal.png";
import LogoPtrf from "../assets/img/logo-ptrf-verde.png";

export const LoginContainer = ({ children }) => {
  return (
    <>
      <div className="login-bg d-none d-lg-block d-xl-block" />
      <div className="right-half login-ptrf d-lg-flex">
        <div className="container my-auto">
          <div className="logo-ptrf">
            <img className="img-fluid img-logo-ptrf" src={LogoPtrf} alt="" />
          </div>
          <div className="w-100 my-3 d-flex justify-content-center">
            {children}
          </div>
          <div className="logo-prefeitura">
            <img src={logoSP} alt="logo prefeitura de São Paulo colorida" />
          </div>
        </div>
      </div>
    </>
  );
};
