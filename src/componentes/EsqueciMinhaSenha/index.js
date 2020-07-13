import React from "react";
import {useParams} from "react-router-dom";
import {RecuperarMinhaSenha} from "./RecuperarSenha";
import {RecuperacaoDeEmail} from "./RecuperacaoDeEmail";
import "./esqueci-minha-senha.scss"

export const EsqueciMinhaSenha = () =>{
    const {service} = useParams();

    console.log("Rota ", service)

    return(
        <div className='container-esqueci-minha-senha'>
            {service === 'recuperar-minha-senha' &&
                <RecuperarMinhaSenha/>
            }
            {service === 'recuperacao-de-email' &&
                <RecuperacaoDeEmail/>
            }
        </div>
    );
};