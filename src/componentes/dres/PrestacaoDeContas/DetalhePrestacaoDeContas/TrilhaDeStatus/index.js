import React from "react";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {TrilhaDeStatusBotoes} from "./TrilhaDeStatusBotoes";

export const TrilhaDeStatus = ({prestacaoDeContas}) => {
    console.log('TrilhaDeStatus XXXXX ', prestacaoDeContas);
    return (
        <>
            {Object.entries(prestacaoDeContas).length > 0 &&
            <>
                <TrilhaDeStatusBotoes
                    prestacaoDeContas={prestacaoDeContas}
                />

            </>
            }
        </>
    )
};