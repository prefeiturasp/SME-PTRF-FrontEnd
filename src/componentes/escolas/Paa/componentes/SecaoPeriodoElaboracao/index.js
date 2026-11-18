import React, { memo } from "react";
import { BotaoElaboracaoPaa } from "../BotaoElaboracaoPaa";
import { MensagemElaboracaoPaa } from "../MensagemElaboracaoPaa";
import { formatarIntervalo } from "../../ElaboracaoPaa/utils/formatarPeriodo";
import { Tooltip } from "antd";

const ROTULO_VIGENCIA = {
  VIGENTE: "Vigente",
  PROXIMA_VIGENCIA: "Próxima vigência",
  ENCERRADO: "Período encerrado",
};

/** Um período da tela de elaboração: "Período X" com o seu botão ao lado e o aviso abaixo. */
export const SecaoPeriodoElaboracaoPaa = memo(({ secaoPeriodo, processando, onAcao }) => {
  const secaoPeriodoElaboracao = {
    ...secaoPeriodo,
    botao: {
      ...secaoPeriodo.botao,
      rotulo: `${secaoPeriodo.botao.rotulo} ${formatarIntervalo(secaoPeriodo.dataInicial, secaoPeriodo.dataFinal)}`,
    },

  };
  
  return (
  <>
    {secaoPeriodoElaboracao?.botao?.visivel &&
      <div className="mb-4" data-testid={`secaoPeriodo-${secaoPeriodoElaboracao.vigencia}`}>
        <div className="d-flex align-items-center justify-content-left">
          <span className="mr-2" data-testid="vigencia-elaboracao">
            {/* Período <strong>{secaoPeriodoElaboracao.referencia}</strong> */}
            PAA <strong>{ROTULO_VIGENCIA[secaoPeriodoElaboracao.vigencia]}</strong>
          </span>
          <BotaoElaboracaoPaa botao={secaoPeriodoElaboracao.botao} processando={processando} onClick={onAcao} />
        </div>
        {/* <p className="mb-0 text-center text-muted small" data-testid="detalhe-vigencia-elaboracao">
          {ROTULO_VIGENCIA[secaoPeriodoElaboracao.vigencia]} ({formatarIntervalo(secaoPeriodoElaboracao.dataInicial, secaoPeriodoElaboracao.dataFinal)})
        </p> 
        <MensagemElaboracaoPaa botao={secaoPeriodoElaboracao.botao} />
        */}
      </div>
    }
  </>
)});