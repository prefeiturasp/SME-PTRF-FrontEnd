import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";

export const TabsArquivosDeReferenciaAccordion = (children) => {

    const [clickBtnInfoArquivosDeReferencia, setClickBtnInfoArquivosDeReferencia] = useState(false);

    const toggleBtnArquivosDeReferencia = (name) => {
        setClickBtnInfoArquivosDeReferencia({
            [name]: !clickBtnInfoArquivosDeReferencia[name]
        });
    };
    return (
        <div className="accordion mt-1" id={`accordion_${children.name}`}>
            <div className="card">
                <div className="card-header" id="headingOne">
                    <h2 className="mb-0">
                        <div className="row">
                            <div className="col-11">
                                <button
                                    onClick={() => toggleBtnArquivosDeReferencia(children.name)}
                                    className="btn btn-link btn-block text-left btn-container-titulo-acoes pl-0"
                                    type="button"
                                    data-toggle="collapse"
                                    data-target={`#collapse_${children.name}`}
                                    aria-expanded="true"
                                    aria-controls={`collapse_${children.name}`}
                                >
                                    {children.titulo}
                                </button>
                            </div>
                            <div className="col-1">
                                <button
                                    onClick={() => toggleBtnArquivosDeReferencia(children.name)}
                                    className="btn btn-link btn-block text-left"
                                    type="button"
                                    data-toggle="collapse"
                                    data-target={`#collapse_${children.name}`}
                                    aria-expanded="true"
                                    aria-controls={`collapse_${children.name}`}
                                >
                                    <span className='span-icone-toogle'>
                                        <FontAwesomeIcon
                                            style={{marginRight: "0", color: 'black'}}
                                            icon={clickBtnInfoArquivosDeReferencia[children.name] ? faChevronUp : faChevronDown}
                                        />
                                    </span>
                                </button>
                            </div>
                        </div>
                    </h2>
                </div>
                <div
                    id={`collapse_${children.name}`}
                    className='collapse'
                    aria-labelledby="headingOne"
                    data-parent={`#accordion_${children.name}`}
                >
                    <div className="card-body pl-2 pr-2">
                        {children.children}
                    </div>
                </div>
            </div>
        </div>
    )
}