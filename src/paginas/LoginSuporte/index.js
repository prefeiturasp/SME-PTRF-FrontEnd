import React from "react";
import { LoginSuporteForm } from "./form";
import logoSP from "../../assets/img/logos/logo_PrefSP_sem_fundo_horizontal.png";
import LogoPtrf from "../../assets/img/logo-ptrf-verde.png";
import "./login-suporte.scss";

export const LoginSuporte = (props) => {
  return (
    <div className="login-suporte-container">
      <div className="login-suporte-card">
        <div className="login-suporte-card-header">
          <h6 className="text-center">
            Acesso exclusivo as unidades de suporte
          </h6>
        </div>
        <div className="text-center my-3">
          <img className="img-fluid" src={LogoPtrf} alt="logo-ptrf" />
        </div>
        <div className="login-suporte-card-form">
          <LoginSuporteForm
            redefinicaoDeSenha={props.location.redefinicaoDeSenha}
          />
        </div>
        <div className="text-center my-3">
          <img src={logoSP} alt="logo prefeitura de São Paulo" />
        </div>
      </div>
    </div>
  );
};
