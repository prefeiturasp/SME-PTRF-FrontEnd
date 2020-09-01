import React from "react";
import "./central-de-notificacoes.scss"
import {BotoesCategoriasNotificacoes} from "./BotoesCategoriasNotificacoes";

export const CentralDeNotificacoes = () => {

    const handleClickBtnCategorias = (e) => {
        console.log("Cliquei ", e.target.id)
    };

    return (
        <>
            <BotoesCategoriasNotificacoes
                handleClickBtnCategorias={handleClickBtnCategorias}
            />
        </>
    );
};