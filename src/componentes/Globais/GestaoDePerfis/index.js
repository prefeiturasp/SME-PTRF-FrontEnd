import React, {useState} from "react";
import "./gestao-de-perfis.scss"
import {AccordionInfo} from "./AccordionInfo";

export const GestaoDePerfis = () => {
    const [clickBtnInfo, setClickBtnInfo] = useState(false);

    return (
        <>
            <p>Faça a gestão dos seus usuários e determine seus perfis atrelando-os aos grupos de acesso.</p>
            <AccordionInfo
                clickBtnInfo={clickBtnInfo}
                setClickBtnInfo={setClickBtnInfo}
            />

        </>
    );
};