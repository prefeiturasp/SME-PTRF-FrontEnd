import React from "react";
import { useHistory } from "react-router-dom";

export const Pagina404 = () => {
    let history = useHistory();
    return (
        <div className="col-12 col-md-8">
            <h1>Página não encontrada</h1>
            <button className="btn btn-primary" onClick={() => history.push("/")}>Voltar</button>
        </div>
    );
};

