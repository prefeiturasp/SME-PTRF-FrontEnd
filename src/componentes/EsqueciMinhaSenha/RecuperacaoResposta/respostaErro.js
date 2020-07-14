import React from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTimesCircle} from '@fortawesome/free-solid-svg-icons'

export const RespostaErro = () =>{

    return(
        <>
            <FontAwesomeIcon
                style={{fontSize: '80px', marginRight: "0", color:"red"}}
                icon={faTimesCircle}
            />
            <p className='mt-3'>
                Um erro ocorreu. Não encontramos o usuário solicitado, tente novamente
            </p>
            <button onClick={()=>window.location.assign("/esqueci-minha-senha/")} className="btn btn-success btn-block">Continuar</button>
        </>
    );
};