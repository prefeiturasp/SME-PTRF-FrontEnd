import React, {useContext} from "react";
import { useHistory } from "react-router-dom";
import {PaginasContainer} from "../PaginasContainer";

export const Pagina404 = () => {
    let history = useHistory();
    return (
        <PaginasContainer>
            <h1>Página não encontrada</h1>
            <button className="btn btn-primary" onClick={() => history.push("/")}>Voltar</button>
        </PaginasContainer>
    );
};

