import React from "react";
import { Icon } from "../../../componentes/Globais/UI/Icon";

export const IconeDadosDaAssociacaoPendentes = () => {
  return (
    <Icon
      tooltipMessage="Há campos pendentes para preenchimento"
      icon="icone-exclamacao-vermelho"
      iconProps={{ className: "mb-1" }}
    />
  );
};
