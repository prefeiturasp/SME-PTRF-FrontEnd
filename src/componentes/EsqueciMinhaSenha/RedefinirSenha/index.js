import React from "react";
import {FormRedefinirSenha} from "../../../utils/FormRedefinirSenha";

export const RedefinirSenha = () => {

    return (
        <>
            <div className='container-esqueci-minha-senha'>
                <div className="esqueci-minha-senha-inner-texto">
                    <h1 className="titulo-services mb-3">Nova Senha</h1>
                    <p className='mt-3'>Identificamos que você ainda não definiu uma senha pessoal para acesso ao PTRF. Este passo é obrigatório para que você tenha acesso ao sistema</p>
                </div>

                <div className='col-12'>
                    <FormRedefinirSenha
                        textoValidacaoDentroDoForm={true}
                    />
                </div>
            </div>
        </>
    );
};