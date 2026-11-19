import React, { memo } from "react";
import { SecaoPeriodoElaboracaoPaa } from "../SecaoPeriodoElaboracao";
import { Divider } from "antd";

export const SecoesPeriodoElaboracaoPaa = memo(({ estado, processando, onAcao }) => {
  if (!estado) return null;

  if (!estado.secoesPeriodos.length) {
    return <p className="text-center text-muted" data-testid="sem-periodo-elaboracao">{estado.mensagem}</p>;
  }

  return (
    <div className="d-flex flex-column align-items-left">
      <Divider className="my-3" />
      {estado.secoesPeriodos.map((secaoPeriodo) => (
        <SecaoPeriodoElaboracaoPaa key={secaoPeriodo.periodoUuid} secaoPeriodo={secaoPeriodo} processando={processando} onAcao={onAcao} />
      ))}
    </div>
  );
});