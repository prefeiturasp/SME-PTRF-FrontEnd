import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";

export const AccordionInfo = ({clickBtnInfo, setClickBtnInfo, grupos}) =>{
    return(
        <>
            {grupos && grupos.length > 0 &&
                <>
                    <div className="accordion mt-1" id="accordionFaq">

                        <div className="card">
                            <div className="card-header" id="headingOne">
                                <h2 className="mb-0">
                                    <div className="row">
                                        <div className="col-11">
                                            <button
                                                onClick={() => setClickBtnInfo(!clickBtnInfo)}
                                                className="btn btn-link btn-block text-left btn-container-pergunta pl-0"
                                                type="button" data-toggle="collapse"
                                                data-target={`#collapse1`} aria-expanded="true"
                                                aria-controls={`collapse1`}
                                            >
                                                Confira os grupos de acesso existentes
                                            </button>
                                        </div>
                                        <div className="col-1">
                                            <button
                                                onClick={() => setClickBtnInfo(!clickBtnInfo)}
                                                className="btn btn-link btn-block text-left" type="button"
                                                data-toggle="collapse" data-target={`#collapse1`}
                                                aria-expanded="true" aria-controls={`collapse1`}
                                            >
                                            <span className='span-icone-toogle'>
                                                <FontAwesomeIcon
                                                    style={{marginRight: "0", color: 'black'}}
                                                    icon={clickBtnInfo ? faChevronUp : faChevronDown}
                                                />
                                            </span>
                                            </button>
                                        </div>
                                    </div>

                                </h2>
                            </div>
                            <div id={`collapse1`} className="collapse" aria-labelledby="headingOne"  data-parent="#accordionFaq">
                                <div className="card-body container-info-permissoes">
                                    {grupos.map((grupo, index)=>
                                        <p className='mb-1' key={index}>Grupo: <span className='grupo-nome'>"{grupo.nome}" </span>: {grupo.descricao}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </>
            }

        </>
    )
};