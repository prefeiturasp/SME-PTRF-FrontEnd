import React, {useEffect, useState} from "react";
import {RecuperarMinhaSenha} from "./RecuperarSenha";
import {RecuperacaoDeEmail} from "./RecuperacaoDeEmail";
import "./esqueci-minha-senha.scss"
import {YupSignupSchemaRecuperarSenha} from "../../utils/ValidacoesAdicionaisFormularios";
import {replace} from "formik";

export const EsqueciMinhaSenha = () =>{

    const [service, setService] = useState(false);
    const [recuperacaoDeEmail, setRecuperacaoDeEmail] = useState({});
    const [emailComMascara, setEmailComMascara] = useState({});
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
        });
        setEmailComMascara(mascaraExibicaoEmail(values.usuario));
        setService('recuperacao-de-email')
    };

    const mascaraExibicaoEmail = (email) =>{
        let pos_arroba = email.indexOf("@");
        let iniciais_email = email.substr(0,3);
        let conteudo_arroba = email.substr(3, pos_arroba -3 );
        let assinatura_email = email.substr(pos_arroba);
        let email_com_mascara = iniciais_email + conteudo_arroba.replace(/\w/gim, "*") + assinatura_email;
        return email_com_mascara
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
                    emailComMascara={emailComMascara}
                />
            }
        </div>
    );
};