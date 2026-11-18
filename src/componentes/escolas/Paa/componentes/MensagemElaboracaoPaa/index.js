import React, { memo } from "react";
import { Link } from "react-router-dom";

export const MensagemElaboracaoPaa = memo(({ botao }) => {
  if (!botao || botao.habilitado || !botao.mensagem) return null;

  return (
    <div className="mt-2 mb-0 text-muted" data-testid="mensagem-bloqueio-elaboracao">
      <p className="mb-1">{botao.mensagem}</p>
      {/* {botao.acaoSecundaria && (
        <Link to={botao.acaoSecundaria.rota} data-testid="acao-secundaria-elaboracao">
          {botao.acaoSecundaria.rotulo}
        </Link>
      )} */}
    </div>
  );
});