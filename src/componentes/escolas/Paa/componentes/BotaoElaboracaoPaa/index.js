import React, { memo } from "react";

export const BotaoElaboracaoPaa = memo(({ botao, processando, onClick }) => {
  if (!botao?.visivel) return null;

  return (
    <button
      type="button"
      className="btn btn-success btn-sm"
      data-testid="elaborar-paa-button"
      onClick={() => onClick(botao)}
      disabled={!botao.habilitado || processando}
      title={botao.mensagem || undefined}
    >
      {botao.rotulo}
    </button>
  );
});
