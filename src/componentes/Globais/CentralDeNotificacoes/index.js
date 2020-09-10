import React, {useEffect, useState} from "react";
import "./central-de-notificacoes.scss"
import {BotoesCategoriasNotificacoes} from "./BotoesCategoriasNotificacoes";
import {CardNotificacoes} from "./CardNotificacoes";
import {getNotificacoes} from "../../../services/Notificacoes.service";

export const CentralDeNotificacoes = () => {
    const [clickBtnNotificacoes, setClickBtnNotificacoes] = useState(false);
    const [notificacoes, setNotificacoes] = useState(false);

    useEffect(()=> {
        trazerNotificacoes();
    }, []);


    const trazerNotificacoes = async () =>{
        let notificacoes = await getNotificacoes();
        setNotificacoes(notificacoes);
        console.log("Notificacoes ", notificacoes)

    };

    const toggleBtnNotificacoes = (uuid) => {
        setClickBtnNotificacoes({
            [uuid]: !clickBtnNotificacoes[uuid]
        });
    };

    const handleClickBtnCategorias = (e) => {
        console.log("Cliquei handleClickBtnCategorias ", e.target.id);
    };

    const handleChangeMarcarComoLida = (e, uuid) => {
        console.log("Cliquei handleChangeMarcarComoLida e ", e.target.checked);
        console.log("Cliquei handleChangeMarcarComoLida uuid ", uuid)
    };

    return (
        <>
            <BotoesCategoriasNotificacoes
                handleClickBtnCategorias={handleClickBtnCategorias}
            />
            <CardNotificacoes
                notificacoes={notificacoes}
                toggleBtnNotificacoes={toggleBtnNotificacoes}
                clickBtnNotificacoes={clickBtnNotificacoes}
                handleChangeMarcarComoLida={handleChangeMarcarComoLida}
            />
        </>
    );
};