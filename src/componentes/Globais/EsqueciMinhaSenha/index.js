import React, {useEffect, useState} from "react";
import {RecuperarMinhaSenha} from "./RecuperarSenha";
import {RecuperacaoResposta} from "./RecuperacaoResposta";
import "./esqueci-minha-senha.scss"
import {YupSignupSchemaRecuperarSenha} from "../../../utils/ValidacoesAdicionaisFormularios";
import {esqueciMinhaSenha} from "../../../services/auth.service";
import Loading from "../../../utils/Loading";

export const EsqueciMinhaSenha = () => {

    const [service, setService] = useState('');
    const [recuperacaoResposta, setRecuperacaoResposta] = useState({});
    const [emailComMascara, setEmailComMascara] = useState({});
    const [loading, setLoading] = useState(true);
    const [respostaDeErro, setRspostaDeErro] = useState(false);

    useEffect(() => {
        setService('recuperar-minha-senha');
        setLoading(false);
    }, []);

    const initialValuesRecuperarSenha = {
        usuario: ""
    };

    const onSubmitReuperarSenha = async (values) => {
        setLoading(true);

        const payload = {
            username: values.usuario
        };

        try {
            let resposta = await esqueciMinhaSenha(payload, values.usuario);
            setRecuperacaoResposta({
                usuario: resposta.username,
                email: resposta.email,
            });
            setEmailComMascara(mascaraExibicaoEmail(resposta.email));
        } catch (e) {
            setRspostaDeErro(e.response.data.detail);
            console.log("Erro ao recuperar usuário ", e)
        }
        setService('recuperacao-resposta');
        setLoading(false);
    };

    const mascaraExibicaoEmail = (email) => {
        let pos_arroba = email.indexOf("@");
        let iniciais_email = email.substr(0, 3);
        let conteudo_arroba = email.substr(3, pos_arroba - 3);
        let assinatura_email = email.substr(pos_arroba);
        let email_com_mascara = iniciais_email + conteudo_arroba.replace(/\w/gim, "*") + assinatura_email;
        return email_com_mascara
    };

    return (
        <>
            {loading ? (
                    <Loading
                        corGrafico="black"
                        corFonte="dark"
                        marginTop="0"
                        marginBottom="0"
                    />
                ) :
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
                        respostaDeErro={respostaDeErro}
                    />
                    }
                </div>
            }
        </>
    );
};