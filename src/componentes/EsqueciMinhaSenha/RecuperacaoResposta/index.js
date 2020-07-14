import React from "react";
import {RespostaSucesso} from "./respostaSucesso";
import {RespostaErro} from "./respostaErro";

export const RecuperacaoResposta = ({recuperacaoResposta, emailComMascara}) =>{
    console.log("RecuperacaoResposta ", recuperacaoResposta);
    return (
        <>
            <div className="esqueci-minha-senha-inner-texto">
                <h1 className="titulo-services mb-3">Recuperação de Senha</h1>
                {recuperacaoResposta && recuperacaoResposta.email ? (
                    <RespostaSucesso
                        emailComMascara={emailComMascara}
                    />
                ):
                    <RespostaErro/>
                }
            </div>
        </>
    )
};