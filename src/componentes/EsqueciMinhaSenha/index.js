import React, {useEffect, useState} from "react";
import {RecuperarMinhaSenha} from "./RecuperarSenha";
import {RecuperacaoResposta} from "./RecuperacaoResposta";
import "./esqueci-minha-senha.scss"
import {YupSignupSchemaRecuperarSenha} from "../../utils/ValidacoesAdicionaisFormularios";
import {esqueciMinhaSenha} from "../../services/auth.service";

export const EsqueciMinhaSenha = () =>{

    const [service, setService] = useState('');
    const [recuperacaoResposta, setRecuperacaoResposta] = useState({});
    const [emailComMascara, setEmailComMascara] = useState({});

    useEffect(()=>{
        setService('recuperar-minha-senha')
    }, []);

    const initialValuesRecuperarSenha = {
            usuario: ""
        };

    const onSubmitReuperarSenha = async (values) =>{

        const payload = {
            username: values.usuario
        };

        try {
            let resposta = await esqueciMinhaSenha(payload, values.usuario);
            console.log("onSubmitReuperarSenha ", resposta)
            setRecuperacaoResposta({
                usuario:resposta.username,
                email:resposta.email,
            });
            setEmailComMascara(mascaraExibicaoEmail(resposta.email));
        }catch (e) {
            console.log("Erro ao recuperar usuário")
        }
        setService('recuperacao-resposta')
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

            {service === 'recuperacao-resposta' &&
                <RecuperacaoResposta
                    recuperacaoResposta={recuperacaoResposta}
                    emailComMascara={emailComMascara}
                />
            }
        </div>
    );
};