import React from "react";

export const TextoValidacaoSenha = () =>{
    return(
        <div className='form-group'>
            <p className='requisitos-seguranca-senha requisitos-seguranca-senha-validado'><strong>Requisitos de seguranca da senha:</strong></p>
            <p className='requisitos-seguranca-senha'><span id='letra_minuscula' className='pr-4'>Uma letra minúscula</span></p>
            <p className='requisitos-seguranca-senha'><span id='letra_maiuscula' className='pr-4'>Uma letra maiúscula</span></p>
            <p className='requisitos-seguranca-senha'><span id='senhas_iguais' className='pr-4'>As senhas devem ser iguais</span></p>
            <p className='requisitos-seguranca-senha'><span id='espaco_em_branco' className='pr-4'>Não pode conter espaço em branco</span></p>
            <p className='requisitos-seguranca-senha'><span id='caracteres_acentuados' className='pr-4'>Não podem conter caracteres acentuados</span></p>
            <p className='requisitos-seguranca-senha'><span id='numero_ou_caracter_especial' className='pr-4'>Um número ou símbolo (caracter especial)</span></p>
            <p className='requisitos-seguranca-senha'><span id='entre_oito_ate_doze' className='pr-4'>Deve ter no mínimo 8 e no máximo 12 caracteres</span></p>

            {localStorage.getItem("medidorSenha") < 7 &&
                <p className="forca-senha-msg mt-3 p-2 text-center">Sua nova senha deve conter letras maiúsculas, minúsculas, números e símbolos. Por favor, digite outra senha</p>
            }
        </div>
    )
}