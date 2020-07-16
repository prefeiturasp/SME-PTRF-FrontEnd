import React, {useState} from "react";
import {useParams} from 'react-router-dom';
import {redefinirMinhaSenha} from "../../../services/auth.service";
import {FormRedefinirSenha} from "../../../utils/FormRedefinirSenha";

export const RedefinirSenha = () => {

    let {uuid} = useParams();

    const [senhaRedefinida, setSenhaRedefinida] = useState(false);
    const [msgErro, setMsgErro] = useState(false);

    const onSubmit = async (values) =>{
        const payload ={
            "hash_redefinicao":uuid,
            "password": values.senha,
            "password2": values.confirmacao_senha
        };
        try {
            let texto = await redefinirMinhaSenha(payload);
            console.log("OnSubmit ", texto)
            setSenhaRedefinida(true);
            setMsgErro(false)
        }catch (e) {
            console.log("Erro ao redefinir senha ", e);
            setMsgErro(true)
        }
    };

    return (
        <>
            <div className='container-esqueci-minha-senha'>
                <div className="esqueci-minha-senha-inner-texto">
                    <h1 className="titulo-services mb-3">Nova Senha</h1>
                    <p className='mt-3'>Identificamos que você ainda não definiu uma senha pessoal para acesso ao PTRF. Este passo é obrigatório para que você tenha acesso ao sistema</p>
                </div>

                <div className='col-12'>
                    <FormRedefinirSenha
                        onSubmit={onSubmit}
                        senhaRedefinida={senhaRedefinida}
                        textoValidacaoDentroDoForm={true}
                        msgErro={msgErro}
                    />
                </div>
            </div>
        </>
    );
};