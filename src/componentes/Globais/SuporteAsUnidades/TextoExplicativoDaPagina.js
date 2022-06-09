import React, {useState, useEffect} from "react";
import "./suporte-as-unidades.scss"

import {geTextoExplicativoSuporteUnidades} from "../../../services/SuporteAsUnidades.service"

export const TextoExplicativo = (props) => {
    const {visao} = props

    const [textoExplicativo, setTextoExplicativo] = useState("");

    useEffect(() => {
        buscaTextoExplicativo();
    }, []);

    const buscaTextoExplicativo = async () => {
        await geTextoExplicativoSuporteUnidades(visao).then((response) => {
            setTextoExplicativo(response.detail);
        }).catch((error) => {
            console.log(error);
        })
    };

    return(
        <div className="col-12 container-texto-explicativo mb-4">
            <div dangerouslySetInnerHTML={{ __html: textoExplicativo }} />
        </div>
    )
};