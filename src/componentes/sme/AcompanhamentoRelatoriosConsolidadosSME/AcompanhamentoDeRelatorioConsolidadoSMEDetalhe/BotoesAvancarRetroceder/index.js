import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDoubleLeft, faAngleDoubleRight} from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from "react-tooltip";

export const BotoesAvancarRetroceder = ({relatorioConsolidado, metodoAvancar, metodoRetroceder, disabledBtnAvancar, disabledBtnRetroceder, tooltipAvançar=null}) =>{
    return(
        <>
            {Object.entries(relatorioConsolidado).length > 0 &&
            <>
                <div className="d-flex bd-highlightcontainer-cabecalho">
                    <div className="flex-grow-1 mt-3 mb-3 bd-highlight">
                        {relatorioConsolidado && relatorioConsolidado.botoes_avancar_e_retroceder && relatorioConsolidado.botoes_avancar_e_retroceder && relatorioConsolidado.botoes_avancar_e_retroceder.texto_botao_retroceder &&
                            <button
                                onClick={() => metodoRetroceder(relatorioConsolidado)}
                                disabled={!relatorioConsolidado.botoes_avancar_e_retroceder.habilita_botao_retroceder || disabledBtnRetroceder }
                                className="btn btn-success ml-2"
                            >
                                <FontAwesomeIcon
                                    style={{marginRight: "5px", color: '#fff'}}
                                    icon={faAngleDoubleLeft}
                                />
                                {relatorioConsolidado.botoes_avancar_e_retroceder.texto_botao_retroceder}
                            </button>
                        }
                    </div>
                    {relatorioConsolidado && relatorioConsolidado.botoes_avancar_e_retroceder && relatorioConsolidado.botoes_avancar_e_retroceder && relatorioConsolidado.botoes_avancar_e_retroceder.texto_botao_avancar &&
                        <div className="p-2 bd-highlight">
                            <button
                                onClick={() => metodoAvancar(relatorioConsolidado)}
                                disabled={!relatorioConsolidado.botoes_avancar_e_retroceder.habilita_botao_avancar || disabledBtnAvancar }
                                className="btn btn-success ml-2"
                            >
                                <span data-tip={tooltipAvançar}>{relatorioConsolidado.botoes_avancar_e_retroceder.texto_botao_avancar} 
                                    <FontAwesomeIcon
                                        style={{marginLeft: "5px", color: '#fff'}}
                                        icon={faAngleDoubleRight}
                                    />    
                                </span>
                                {tooltipAvançar && <ReactTooltip place="left"/>}
                            </button>
                        </div>
                    }

                </div>
            </>
            }
        </>
    )
};