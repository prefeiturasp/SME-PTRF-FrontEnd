import React from "react";

export const RecuperarMinhaSenha = () => {
    return (
        <>
        <div className="esqueci-minha-senha-inner-texto">
            <h1 className="titulo-services">Recuperação de Senha</h1>
            <p>Caso você tenha cadastrado um endereço de e-mail, informe seu usuário ou RF e ao continuar você receberá um e-mail com as orientações para redefinição da sua senha.</p>
            <p>Se você não tem um e-mail cadastrado ou não tem mais acessoa ao endereço de e-mail cadastrado, procure o responsável pelo SGP na sua unidade</p>
        </div>
            <div className='col-12'>
                <button type="button" onClick={() => window.location.assign('/esqueci-minha-senha/recuperacao-de-email/')} className="btn btn-link">Esqueci minha senha</button>
            </div>
        </>
    );
};