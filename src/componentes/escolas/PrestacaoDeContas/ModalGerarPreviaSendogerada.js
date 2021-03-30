import React from "react";
import {ModalBootstrap} from "../../Globais/ModalBootstrap";


export const ModalPreviaSendoGerada = (propriedades) => {
    return (
        <ModalBootstrap
            show={propriedades.show}
            onHide={propriedades.handleClose}
            titulo="Documento prévio sendo gerado"
            bodyText="<p>O documento está sendo gerado, enquanto isso você pode continuar a usar o sistema. Quando a geração for concluída, um botão de download ficará disponível.</p>"
            primeiroBotaoOnclick={propriedades.primeiroBotaoOnClick}
            primeiroBotaoTexto="Fechar"
        />
    )
}
