import React from "react";
import { PaginasContainer } from "../../../../../../paginas/PaginasContainer";
import { AssociacaoFormularioProvider } from "../context/AssociacaoFormulario";

import { Title } from "./Title";
import { Form } from "./Form";

export const FormualarioAssociacao = () => {
    return (
        <PaginasContainer>
            <AssociacaoFormularioProvider>
                <Title />

            <div className="page-content-inner ">
                <Form />
            </div>
            </AssociacaoFormularioProvider>
        </PaginasContainer>
    )
};
