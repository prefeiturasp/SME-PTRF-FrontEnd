import React from "react";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationCircle} from "@fortawesome/free-solid-svg-icons";
import "./index.scss";

export const BarraAvisoValorTotalBemProduzido = () => {
    return(
        <>
            <section className="row mt-2">
                <section className="col-12">
                        <div className="barra-aviso-valor-total-bem-produzido">
                            <p className="pt-1 pb-1 ml-1 mb-0">
                                <FontAwesomeIcon
                                    className="icone-barra-aviso-valor-total-bem-produzido"
                                    icon={faExclamationCircle}
                                />
                                Ao classificar os itens produzidos, certifique-se de que a soma dos valores corresponda ao valor total do bem produzido. Isso garante que o cadastro seja concluído corretamente.
                            </p>
                        </div>
                </section>
            </section> 
        </>  
    )
};