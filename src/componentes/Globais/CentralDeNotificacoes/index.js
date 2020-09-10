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
        setClickBtnNotificacoes(false);
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
        setClickBtnNotificacoes(false);
        let checado = e.target.checked;
        const payload = {
            "uuid": uuid,
            "lido": checado
        };
        await getNotificacaoMarcarDesmarcarLida(payload);
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