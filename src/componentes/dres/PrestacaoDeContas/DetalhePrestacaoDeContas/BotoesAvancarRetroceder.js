import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDoubleLeft, faAngleDoubleRight} from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from "react-tooltip";

export const BotoesAvancarRetroceder = ({prestacaoDeContas, textoBtnAvancar, textoBtnRetroceder, metodoAvancar, metodoRetroceder, disabledBtnAvancar, disabledBtnRetroceder, esconderBotaoRetroceder=false, esconderBotaoAvancar, tooltipRetroceder=null, tooltipAvancar=null}) =>{
    return(
        <>
            {Object.entries(prestacaoDeContas).length > 0 &&
            <>
                <div className="d-flex bd-highlight mt-3 mb-3 container-cabecalho">
                    <div className="flex-grow-1 bd-highlight">
                        {!esconderBotaoRetroceder &&
                            <>
                            <button
                                data-qa="botao-retroceder-acompanhamento-pc"
                                id="btn-retroceder"
                                onClick={metodoRetroceder}
                                disabled={disabledBtnRetroceder}
                                className="btn btn-success ml-2"
                            >
                                <FontAwesomeIcon
                                    style={{marginRight: "5px", color: '#fff'}}
                                    icon={faAngleDoubleLeft}
                                />
                                <span data-tip={tooltipRetroceder} data-for={`tooltip-id-${prestacaoDeContas.uuid}`}>{textoBtnRetroceder}</span>
                                {tooltipRetroceder && <ReactTooltip  place="right" id={`tooltip-id-${prestacaoDeContas.uuid}`} html={true}/>}
                            </button>
                            </>
                        }
                    </div>
                    {!esconderBotaoAvancar &&
                        <div className="p-2 bd-highlight">
                            <span data-tip={tooltipAvancar} data-for={`tooltip-avancar-id-${prestacaoDeContas.uuid}`}>
                            <button
                                data-qa="botao-avancar-acompanhamento-pc"
                                id="btn-avancar"
                                onClick={metodoAvancar}
                                disabled={disabledBtnAvancar}
                                className="btn btn-success ml-2"
                            >
                                {textoBtnAvancar}
                                {tooltipAvancar && <ReactTooltip  place="right" id={`tooltip-avancar-id-${prestacaoDeContas.uuid}`} html={true}/>}
                                <FontAwesomeIcon
                                    style={{marginLeft: "5px", color: '#fff'}}
                                    icon={faAngleDoubleRight}
                                />
                            </button>
                            </span>
                        </div>
                    }

                </div>
            </>
            }
        </>
    )
};