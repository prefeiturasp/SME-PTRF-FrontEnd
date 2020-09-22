import React, {useState} from "react";
import { useHistory } from "react-router-dom";
import {PaginasContainer} from "../../../../paginas/PaginasContainer";

export const ListaPrestacaoDeContas= () => {
    let history = useHistory();

    const [props, setProps] = useState(history.location.propriedades);

    console.log("Use history ", history)

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Acompanhamento das Prestações de Contas</h1>
            <div className="page-content-inner">
                <h1>Lista Prestação de contas Componente</h1>
            </div>
        </PaginasContainer>
    )
};