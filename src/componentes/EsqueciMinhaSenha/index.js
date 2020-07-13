import React from "react";
import {useParams} from "react-router-dom";
import {RecuperarMinhaSenha} from "./RecuperarSenha";
import {RecuperacaoDeEmail} from "./RecuperacaoDeEmail";

export const EsqueciMinhaSenha = () =>{
    const {service} = useParams();

    console.log("Rota ", service)

    return(
        <>
            {service === 'recuperar-minha-senha' &&
                <RecuperarMinhaSenha/>
            }
            {service === 'recuperacao-de-email' &&
                <RecuperacaoDeEmail/>
            }
        </>
    );
};