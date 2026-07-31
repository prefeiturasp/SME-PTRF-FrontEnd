import React from "react";
import { useNavigate } from "react-router-dom";
import "./sobre.scss";
import LogoPtrf from "../../assets/img/logo-ptrf-verde.png";
import { LogoSPHorizontalColorida } from "../../componentes/Globais/UI/LogoSP";

const pjson = require("../../../package.json");

export const Sobre = () => {
  const navigate = useNavigate();

  return (
    <div className="sobre-bg d-flex align-items-center justify-content-center">
      <div className="sobre-card card shadow-sm text-center">
        <img className="sobre-logo img-fluid" src={LogoPtrf} alt="" />

        <h1 className="sobre-nome-sistema">Sig Escola - {pjson.name.toUpperCase()}</h1>

        <span className="sobre-versao-label">Versão</span>
        <span className="sobre-versao-valor">{pjson.version}</span>

        <button
          type="button"
          className="btn btn-primary sobre-btn-inicio"
          onClick={() => navigate("/")}
        >
          Página inicial
        </button>

        <hr className="sobre-divisor" />

        <div className="sobre-rodape">
          <LogoSPHorizontalColorida />
        </div>
      </div>
    </div>
  );
};
