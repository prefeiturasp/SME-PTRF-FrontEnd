import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";

export const TabsAccordionSinteseRealizacaoDaDespesa = ({infoAta, ...componentes}) =>{

    const [clickBtnInfoSinteseRealizacaoPorAcao, setClickBtnInfoSinteseRealizacaoPorAcao] = useState(false);

    console.log("XXXXXXXXXXXXXX Componentes ",componentes)

    return(
        <div className="accordion mt-1" id="accordionSinteseRealizacaoDeDespesa">

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
                                    data-target={`#collapseSinteseRealizacaoDeDespesa`}
                                    aria-expanded="true"
                                    aria-controls={`collapseSinteseRealizacaoDeDespesa`}
                                >
                                    Síntese do período de realização da despesa
                                </button>
                            </div>
                            <div className="col-1">
                                <button
                                    onClick={() => setClickBtnInfoSinteseRealizacaoPorAcao(!clickBtnInfoSinteseRealizacaoPorAcao)}
                                    className="btn btn-link btn-block text-left" type="button"
                                    data-toggle="collapse" data-target={`#collapseSinteseRealizacaoDeDespesa`}
                                    aria-expanded="true" aria-controls={`collapseSinteseRealizacaoDeDespesa`}
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
                <div id={`collapseSinteseRealizacaoDeDespesa`} className="collapse" aria-labelledby="headingOne"  data-parent="#accordionSinteseRealizacaoDeDespesa">
                    <div className="card-body">
                        {infoAta && componentes.AnalisesDeContaDaPrestacao &&
                            <componentes.AnalisesDeContaDaPrestacao
                                infoAta={infoAta}
                                analisesDeContaDaPrestacao={componentes.analisesDeContaDaPrestacao}
                                handleChangeAnalisesDeContaDaPrestacao={componentes.handleChangeAnalisesDeContaDaPrestacao}
                                getObjetoIndexAnalise={componentes.getObjetoIndexAnalise}
                                editavel={componentes.editavel}
                            />
                        }
                        {componentes.ResumoFinanceiroTabelaTotais &&
                            <componentes.ResumoFinanceiroTabelaTotais
                                infoAta={infoAta}
                                valorTemplate={componentes.valorTemplate}
                            />
                        }
                    </div>
                </div>
            </div>

        </div>
    )
}