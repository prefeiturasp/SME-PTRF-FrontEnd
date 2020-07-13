import React, {useEffect, useState} from "react";
import {RecuperarMinhaSenha} from "./RecuperarSenha";
import {RecuperacaoDeEmail} from "./RecuperacaoDeEmail";
import "./esqueci-minha-senha.scss"
import {YupSignupSchemaRecuperarSenha} from "../../utils/ValidacoesAdicionaisFormularios";

export const EsqueciMinhaSenha = () =>{

    const [service, setService] = useState(false);
    const [recuperacaoDeEmail, setRecuperacaoDeEmail] = useState({});
    useEffect(()=>{
        setService('recuperar-minha-senha')
    }, []);

    const initialValuesRecuperarSenha = {
            usuario: ""
        };

    const onSubmitReuperarSenha = async (values) =>{
        console.log("onSubmitReuperarSenha ", values);
        setRecuperacaoDeEmail({
            usuario:values.usuario,
            encontrado:true,
        })
        setService('recuperacao-de-email')
    };

    return(
        <div className='container-esqueci-minha-senha'>
            {service === 'recuperar-minha-senha' &&
                <RecuperarMinhaSenha
                    initialValuesRecuperarSenha={initialValuesRecuperarSenha}
                    onSubmitReuperarSenha={onSubmitReuperarSenha}
                    YupSignupSchemaRecuperarSenha={YupSignupSchemaRecuperarSenha}
                />
            }

            {service === 'recuperacao-de-email' &&
                <RecuperacaoDeEmail
                    recuperacaoDeEmail={recuperacaoDeEmail}
                />
            }

        </div>
    );
};