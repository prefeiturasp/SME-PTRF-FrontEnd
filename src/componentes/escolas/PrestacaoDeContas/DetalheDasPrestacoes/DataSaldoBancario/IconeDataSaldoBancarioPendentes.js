import React from "react";
import { Icon } from "../../../../Globais/UI/Icon";

export const IconeDataSaldoBancarioPendentes = () => {
  return (
    <Icon
      tooltipMessage="Há campos pendentes para preenchimento"
      icon="icone-exclamacao-vermelho"
      iconProps={{ className: "mb-1", ["data-testid"]: "icone-data-saldo-bancario-pendentes" }}
    />
  );
};
