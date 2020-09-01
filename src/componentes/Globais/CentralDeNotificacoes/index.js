import React, {useState} from "react";
import "./central-de-notificacoes.scss"
import {BotoesCategoriasNotificacoes} from "./BotoesCategoriasNotificacoes";
import {CardNotificacoes} from "./CardNotificacoes";

export const CentralDeNotificacoes = () => {
    const [clickBtnNotificacoes, setClickBtnNotificacoes] = useState(false);

    const toggleBtnNotificacoes = (uuid) => {
        setClickBtnNotificacoes({
            [uuid]: !clickBtnNotificacoes[uuid]
        });
    };

    const handleClickBtnCategorias = (e) => {
        console.log("Cliquei handleClickBtnCategorias ", e.target.id)
    };

    const handleChangeMarcarComoLida = (e, uuid) => {
        console.log("Cliquei handleChangeMarcarComoLida e ", e.target.checked)
        console.log("Cliquei handleChangeMarcarComoLida uuid ", uuid)
    };

    return (
        <>
            <BotoesCategoriasNotificacoes
                handleClickBtnCategorias={handleClickBtnCategorias}
            />
            <CardNotificacoes
                toggleBtnNotificacoes={toggleBtnNotificacoes}
                clickBtnNotificacoes={clickBtnNotificacoes}
                handleChangeMarcarComoLida={handleChangeMarcarComoLida}
            />
        </>
    );
};