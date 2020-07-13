import React from "react";

export const RecuperarMinhaSenha = () =>{
    return(
        <div className='w-75'>
        <h1>Componente Recuperar Senha</h1>
        <button type="button" onClick={()=>window.location.assign('/esqueci-minha-senha/recuperacao-de-email')} className="btn btn-link">Esqueci minha senha</button>
        </div>
    );
};