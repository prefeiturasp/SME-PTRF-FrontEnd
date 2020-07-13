import React from "react";
import {useParams} from "react-router-dom";
import {RecuperarMinhaSenha} from "./RecuperarSenha";
import {RecuperacaoDeEmail} from "./RecuperacaoDeEmail";
import "./esqueci-minha-senha.scss"

export const EsqueciMinhaSenha = () =>{
    const {service} = useParams();

    console.log("Rota ", service)

    const initialValuesRecuperarSenha = {
            usuario: ""
        };

    const onSubmitReuperarSenha = async (values) =>{
        console.log("onSubmitReuperarSenha ", values)
    };



    return(
        <div className='container-esqueci-minha-senha'>
            {service === 'recuperar-minha-senha' &&
                <RecuperarMinhaSenha
                    initialValuesRecuperarSenha={initialValuesRecuperarSenha}
                    onSubmitReuperarSenha={onSubmitReuperarSenha}
                />
            }
            {service === 'recuperacao-de-email' &&
                <RecuperacaoDeEmail/>
            }
        </div>
    );
};