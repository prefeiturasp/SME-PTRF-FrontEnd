import React, {useState} from "react";
import {useParams} from 'react-router-dom';
import {redefinirMinhaSenha} from "../../../services/auth.service";
import {medidorForcaSenha} from "../../../utils/MedidorForcaSenha";
import {FormRedefinirSenha} from "../FormRedefinirSenha";

export const RedefinirSenha = () => {

    let {uuid} = useParams();

    const initialValues = {
        senha: "",
        confirmacao_senha: "",
    };

    const [btnOnsubmitReadOnly, setBtnOnsubmitReadOnly] = useState(true);
    const [senhaRedefinida, setSenhaRedefinida] = useState(false);
    const [msgErro, setMsgErro] = useState(false);

    const onSubmit = async (values) =>{
        const payload ={
            "hash_redefinicao":uuid,
            "password": values.senha,
            "password2": values.confirmacao_senha
        };
        try {
            await redefinirMinhaSenha(payload);
            setSenhaRedefinida(true);
            setMsgErro(false)
        }catch (e) {
            console.log("Erro ao redefinir senha ", e);
            setMsgErro(true)
        }
    };

    const validateFormRedefinirSenha = async (values ) => {
        medidorForcaSenha(values, setBtnOnsubmitReadOnly)
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
                        initialValues={initialValues}
                        onSubmit={onSubmit}
                        validateFormRedefinirSenha={validateFormRedefinirSenha}
                        senhaRedefinida={senhaRedefinida}
                        btnOnsubmitReadOnly={btnOnsubmitReadOnly}
                    />

                    {msgErro &&
                        <div className="alert alert-danger alert-dismissible fade show text-center" role="alert">
                            Erro ao redefinir a senha, tente novamente
                            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    }
                </div>
            </div>
        </>
    );
};