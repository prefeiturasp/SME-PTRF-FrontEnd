import React from "react";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationCircle} from "@fortawesome/free-solid-svg-icons";

export const BarraAvisoPreencerData = () => {
    return(
        <>
            <section className="row mt-2">
                <section className="col-12">
                        <div className="barra-aviso-preencher-data-reuniao">
                            <p className="pt-1 pb-1 ml-1 mb-0">
                                <FontAwesomeIcon
                                    className="icone-barra-aviso-preencher-data-reuniao"
                                    icon={faExclamationCircle}
                                />
                                Preencha a data da reunião para visualizar os membros.
                            </p>
                        </div>
                </section>
            </section> 
        </>  
    )
};