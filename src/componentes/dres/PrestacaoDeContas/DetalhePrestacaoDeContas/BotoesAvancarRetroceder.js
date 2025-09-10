import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleLeft, faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { RetornaSeFlagAtiva } from "../DetalhePrestacaoDeContasNaoApresentada/RetornaSeFlagAtiva";

export const BotoesAvancarRetroceder = ({
  prestacaoDeContas,
  textoBtnAvancar,
  textoBtnRetroceder,
  metodoAvancar,
  metodoRetroceder,
  disabledBtnAvancar,
  disabledBtnRetroceder,
  esconderBotaoRetroceder = false,
  esconderBotaoAvancar,
  tooltipRetroceder = null,
  tooltipAvancar = null,
  setShowModalConcluirPcNaoApresentada = null,
}) => {
  const FLAG_ATIVA = RetornaSeFlagAtiva();
  console.log(tooltipAvancar);
  return (
    <>
      {Object.entries(prestacaoDeContas).length > 0 && (
        <>
          <div className="d-flex bd-highlight mt-3 mb-3 container-cabecalho">
            <div className="flex-grow-1 bd-highlight">
              {!esconderBotaoRetroceder && (
                <>
                  <button
                    data-qa="botao-retroceder-acompanhamento-pc"
                    id="btn-retroceder"
                    onClick={metodoRetroceder}
                    disabled={disabledBtnRetroceder}
                    className="btn btn-success ml-2"
                  >
                    <FontAwesomeIcon style={{ marginRight: "5px", color: "#fff" }} icon={faAngleDoubleLeft} />
                    <span
                      data-tooltip-content={tooltipRetroceder}
                      data-tooltip-id={`tooltip-id-${prestacaoDeContas.uuid}`}
                    >
                      {textoBtnRetroceder}
                    </span>
                  </button>
                  {tooltipRetroceder && (
                    <ReactTooltip place="right" id={`tooltip-id-${prestacaoDeContas.uuid}`} html={true} />
                  )}
                </>
              )}
            </div>
            {!esconderBotaoAvancar && (
              <>
                {FLAG_ATIVA && prestacaoDeContas && prestacaoDeContas.status === "NAO_APRESENTADA" && (
                  <div className="pt-2 bd-highlight">
                    <button
                      data-qa="botao-avancar-acompanhamento-pc"
                      id="btn-avancar"
                      onClick={() =>
                        setShowModalConcluirPcNaoApresentada(true) ? setShowModalConcluirPcNaoApresentada : null
                      }
                      className="btn btn-outline-success ml-2"
                    >
                      Concluir como reprovada
                    </button>
                  </div>
                )}
                <div className="p-2 bd-highlight">
                  <button
                    data-qa="botao-avancar-acompanhamento-pc"
                    id="btn-avancar"
                    onClick={metodoAvancar}
                    disabled={disabledBtnAvancar}
                    className="btn btn-success ml-2"
                  >
                    <span
                      data-tooltip-content={tooltipAvancar}
                      data-tooltip-id={`tooltip-avancar-id-${prestacaoDeContas.uuid}`}
                    >
                      {textoBtnAvancar}
                    </span>
                    <FontAwesomeIcon style={{ marginLeft: "5px", color: "#fff" }} icon={faAngleDoubleRight} />
                  </button>
                  {tooltipAvancar && <ReactTooltip place="right" id={`tooltip-avancar-id-${prestacaoDeContas.uuid}`} />}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};
