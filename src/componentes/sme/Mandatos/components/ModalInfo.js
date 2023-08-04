import React, {useContext} from "react";
import {ModalBootstrap} from "../../../Globais/ModalBootstrap";
import {MandatosContext} from "../context/Mandatos";

export const ModalInfo = () => {

    const {showModalInfo,tituloModalInfo, textoModalInfo, setShowModalInfo} = useContext(MandatosContext)

    return(
        <ModalBootstrap
            show={showModalInfo}
            onHide={setShowModalInfo}
            titulo={tituloModalInfo}
            bodyText={textoModalInfo}
            primeiroBotaoOnclick={()=>setShowModalInfo(false)}
            primeiroBotaoTexto={'Fechar'}
            primeiroBotaoCss={'success'}
        />
    )

}