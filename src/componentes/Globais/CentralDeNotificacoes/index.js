import React, {useState} from "react";
import "./central-de-notificacoes.scss"
import {BotoesCategoriasNotificacoes} from "./BotoesCategoriasNotificacoes";
import {CardNotificacoes} from "./CardNotificacoes";

export const CentralDeNotificacoes = () => {
    const [clickBtnNotificacoes, setClickBtnNotificacoes] = useState(false);

    const toggleBtnNotificacoes = (id) => {
        setClickBtnNotificacoes({
            [id]: !clickBtnNotificacoes[id]
        });
    };

    const handleClickBtnCategorias = (e) => {
        console.log("Cliquei ", e.target.id)
    };

    return (
        <>
            <BotoesCategoriasNotificacoes
                handleClickBtnCategorias={handleClickBtnCategorias}
            />
            <CardNotificacoes
                toggleBtnNotificacoes={toggleBtnNotificacoes}
                clickBtnNotificacoes={clickBtnNotificacoes}
            />
        </>
    );
};