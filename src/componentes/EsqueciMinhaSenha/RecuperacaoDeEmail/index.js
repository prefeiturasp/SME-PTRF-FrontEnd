import React from "react";

export const RecuperacaoDeEmail = ({recuperacaoDeEmail, emailComMascara}) =>{
    console.log("RecuperacaoDeEmail ", recuperacaoDeEmail);
    return (
        <>
            <div className="esqueci-minha-senha-inner-texto">
                <h1 className="titulo-services">Recuperação de Senha</h1>
                {recuperacaoDeEmail.encontrado ? (
                    <>
                    <p>
                        Seu link de recuperação de senha foi enviado para: <br/>{emailComMascara}
                    </p>
                    <p className="mb-5">Verifique sua caixa de entrada!</p>
                    <button onClick={()=>window.location.assign("/login")} className="btn btn-success btn-block">Continuar</button>
                    </>
                ): <p>Seu email é NÃO FOI ENCONTRADO</p>}
            </div>
        </>
    )
};