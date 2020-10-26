import React, {useState} from "react";
import "./gestao-de-perfis.scss"
import {AccordionInfo} from "./AccordionInfo";
import {FormFiltros} from "./FormFiltros";

export const GestaoDePerfis = () => {

    const initialStateFiltros = {
        filtrar_por_nome: "",
        filtrar_por_grupo: "",
    };

    const [clickBtnInfo, setClickBtnInfo] = useState(false);
    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);

    const handleChangeFiltros = (name, value) => {
        setStateFiltros({
            ...stateFiltros,
            [name]: value
        });
    };

    const limpaFiltros = async () => {
        await setStateFiltros(initialStateFiltros);
    };


    const handleSubmitFiltros = async (event) => {
        event.preventDefault();
        console.log("handleSubmitFiltros ", stateFiltros)
    };

    return (
        <>
            <p>Faça a gestão dos seus usuários e determine seus perfis atrelando-os aos grupos de acesso.</p>
            <AccordionInfo
                clickBtnInfo={clickBtnInfo}
                setClickBtnInfo={setClickBtnInfo}
            />
            <FormFiltros
                handleChangeFiltros={handleChangeFiltros}
                limpaFiltros={limpaFiltros}
                handleSubmitFiltros={handleSubmitFiltros}
                stateFiltros={stateFiltros}
            />



        </>
    );
};