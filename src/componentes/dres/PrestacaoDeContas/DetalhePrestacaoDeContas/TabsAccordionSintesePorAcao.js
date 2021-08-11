import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";

export const TabsAccordionSintesePorAcao = ({infoAta, ...componentes}) =>{

    const [clickBtnInfoSinteseRealizacaoPorAcao, setClickBtnInfoSinteseRealizacaoPorAcao] = useState(false);

    return(
        <div className="accordion mt-1" id="accordionSinteseRealizacaoPorAcao">

            <div className="card">
                <div className="card-header" id="headingOne">
                    <h2 className="mb-0">
                        <div className="row">
                            <div className="col-11">
                                <button
                                    onClick={() => setClickBtnInfoSinteseRealizacaoPorAcao(!clickBtnInfoSinteseRealizacaoPorAcao)}
                                    className="btn btn-link btn-block text-left btn-container-titulo-acoes pl-0"
                                    type="button"
                                    data-toggle="collapse"
                                    data-target={`#collapseSinteseRealizacaoPorAcao`}
                                    aria-expanded="true"
                                    aria-controls={`collapseSinteseRealizacaoPorAcao`}
                                >
                                    Síntese do período por ação
                                </button>
                            </div>
                            <div className="col-1">
                                <button
                                    onClick={() => setClickBtnInfoSinteseRealizacaoPorAcao(!clickBtnInfoSinteseRealizacaoPorAcao)}
                                    className="btn btn-link btn-block text-left" type="button"
                                    data-toggle="collapse" data-target={`#collapseSinteseRealizacaoPorAcao`}
                                    aria-expanded="true" aria-controls={`collapseSinteseRealizacaoPorAcao`}
                                >
                                    <span className='span-icone-toogle'>
                                        <FontAwesomeIcon
                                            style={{marginRight: "0", color: 'black'}}
                                            icon={clickBtnInfoSinteseRealizacaoPorAcao ? faChevronUp : faChevronDown}
                                        />
                                    </span>
                                </button>
                            </div>
                        </div>

                    </h2>
                </div>
                <div id={`collapseSinteseRealizacaoPorAcao`} className="collapse" aria-labelledby="headingOne"  data-parent="#accordionSinteseRealizacaoPorAcao">
                    <div className="card-body">
                        {infoAta && componentes.ResumoFinanceiroTabelaAcoes &&
                            <componentes.ResumoFinanceiroTabelaAcoes
                                infoAta={infoAta}
                                valorTemplate={componentes.valorTemplate}
                                toggleBtnTabelaAcoes={componentes.toggleBtnTabelaAcoes}
                                clickBtnTabelaAcoes={componentes.clickBtnTabelaAcoes}
                            />
                        }
                    </div>
                </div>
            </div>

        </div>
    )
}