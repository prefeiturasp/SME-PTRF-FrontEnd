import React from "react";
import "./Login/login.scss";
import LogoPtrf from "../assets/img/logo-ptrf-verde.png";
import { LogoSPHorizontalColorida } from "../componentes/Globais/UI/LogoSP";

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
            <LogoSPHorizontalColorida />
          </div>
        </div>
      </div>
    </>
  );
};
