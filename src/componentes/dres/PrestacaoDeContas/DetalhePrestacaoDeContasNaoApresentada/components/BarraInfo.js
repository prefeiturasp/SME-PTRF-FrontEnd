import React from "react";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationCircle} from "@fortawesome/free-solid-svg-icons";

export const BarraInfo = () => {
    return(
        <>
            <section className="row mt-2">
                <section className="col-12">
                    <div className="barra-info">
                        <p className="pt-1 pb-1 ml-1 mb-0">
                            <FontAwesomeIcon
                                className="icone-barra-info"
                                icon={faExclamationCircle}
                            />
                            Prestação de contas não apresentada, você pode concluí-la como reprovada.
                        </p>
                    </div>
                </section>
            </section>
        </>
    )
};