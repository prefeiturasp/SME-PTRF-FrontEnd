import React from "react";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationCircle} from "@fortawesome/free-solid-svg-icons";

export const BarraAvisoErroProcessamentoPC = ({registroFalhaGeracaoPc}) => {
    return(
        <>
            <section className="row mt-2">
                <section className="col-12">
                        <div className="barra-aviso-erro-conclusao-pc">
                            <p className="pt-1 pb-1 ml-1 mb-0">
                                <FontAwesomeIcon
                                    className="icone-barra-aviso-erro-conclusao-pc"
                                    icon={faExclamationCircle}
                                />
                                {registroFalhaGeracaoPc.excede_tentativas ? "Já foram feitas diversas tentativas para a conclusão do período. Entre em contato com a DRE para que a geração da PC possa ser concluída." : "Erro no processamento da conclusão do período, conclua o período novamente. " }
                            </p>
                        </div>
                </section>
            </section> 
        </>  
    )
};