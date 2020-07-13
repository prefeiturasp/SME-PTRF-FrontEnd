import React from "react";

export const RecuperacaoDeEmail = ({recuperacaoDeEmail}) =>{
    console.log("RecuperacaoDeEmail ", recuperacaoDeEmail)
    return (
        <>
            <div className="esqueci-minha-senha-inner-texto">
                <h1 className="titulo-services">Recuperação de Senha</h1>
                {recuperacaoDeEmail.encontrado ? (
                    <p>Seu email é: {recuperacaoDeEmail.usuario}</p>
                ): <p>Seu email é NÃO FOI ENCONTRADO</p>}
            </div>
        </>
    )
};