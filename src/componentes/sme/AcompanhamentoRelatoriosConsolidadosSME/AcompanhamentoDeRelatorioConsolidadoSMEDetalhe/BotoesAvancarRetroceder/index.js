import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDoubleLeft, faAngleDoubleRight} from "@fortawesome/free-solid-svg-icons";

export const BotoesAvancarRetroceder = ({relatorios, textoBtnAvancar, textoBtnRetroceder, metodoAvancar, metodoRetroceder, disabledBtnAvancar, disabledBtnRetroceder, esconderBotaoRetroceder=false, esconderBotaoAvancar}) =>{
    return(
        <>
            {Object.entries(relatorios).length > 0 &&
            <>
                <div className="d-flex bd-highlightcontainer-cabecalho">
                    <div className="flex-grow-1 mt-2 bd-highlight">
                        {!esconderBotaoRetroceder &&
                            <button
                                onClick={metodoRetroceder}
                                disabled={disabledBtnRetroceder}
                                className="btn btn-success ml-2"
                            >
                                <FontAwesomeIcon
                                    style={{marginRight: "5px", color: '#fff'}}
                                    icon={faAngleDoubleLeft}
                                />
                                {textoBtnRetroceder}
                            </button>
                        }
                    </div>
                    {!esconderBotaoAvancar &&
                        <div className="p-2 bd-highlight">
                            <button
                                onClick={metodoAvancar}
                                disabled={disabledBtnAvancar}
                                className="btn btn-success ml-2"
                            >
                                {textoBtnAvancar}
                                <FontAwesomeIcon
                                    style={{marginLeft: "5px", color: '#fff'}}
                                    icon={faAngleDoubleRight}
                                />
                            </button>
                        </div>
                    }

                </div>
            </>
            }
        </>
    )
};