import React, {useEffect, useState} from "react";
import "./central-de-notificacoes.scss"
import {BotoesCategoriasNotificacoes} from "./BotoesCategoriasNotificacoes";
import {CardNotificacoes} from "./CardNotificacoes";
import {getNotificacoes, getNotificacoesLidasNaoLidas, getNotificacaoMarcarDesmarcarLida} from "../../../services/Notificacoes.service";

export const CentralDeNotificacoes = () => {
    const [clickBtnNotificacoes, setClickBtnNotificacoes] = useState(false);
    const [notificacoes, setNotificacoes] = useState(false);

    useEffect(()=> {
        trazerNotificacoes();
    }, []);


    const trazerNotificacoes = async () =>{
        let notificacoes = await getNotificacoes();
        setNotificacoes(notificacoes);
    };

    const trazerNotificacoesLidasNaoLidas = async (lidas) =>{
        let notificacoes = await getNotificacoesLidasNaoLidas(lidas);
        setNotificacoes(notificacoes);
    };

    const toggleBtnNotificacoes = (uuid) => {
        setClickBtnNotificacoes({
            [uuid]: !clickBtnNotificacoes[uuid]
        });
    };

    const handleClickBtnCategorias = async (e) => {
        let lidas = e.target.id;
        if (lidas === 'nao_lidas'){
            await trazerNotificacoesLidasNaoLidas("False")
        }else if (lidas === "lidas"){
            await trazerNotificacoesLidasNaoLidas("True")
        }else if (lidas === 'todas'){
            await trazerNotificacoes();
        }
    };

    const handleChangeMarcarComoLida = async (e, uuid) => {
        console.log("Cliquei handleChangeMarcarComoLida e ", e.target.checked);
        console.log("Cliquei handleChangeMarcarComoLida uuid ", uuid)

        const payload = {
            "uuid": uuid,
            "lido": e.target.checked
        }

        let marcar_desmarcar = await getNotificacaoMarcarDesmarcarLida(payload);

        console.log("Marcar / Desmarcar ", marcar_desmarcar)


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