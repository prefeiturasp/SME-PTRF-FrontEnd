import React from "react";
import { Link } from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCheckCircle} from '@fortawesome/free-solid-svg-icons'

export const RespostaSucesso = ({emailComMascara}) =>{

    return(
        <>
            <FontAwesomeIcon
                style={{fontSize: '80px', marginRight: "0"}}
                icon={faCheckCircle}
            />
            <p className='mt-3'>
                Seu link de recuperação de senha foi enviado para: <br/>{emailComMascara}
            </p>
            <p className="mb-5">Verifique sua caixa de entrada!</p>
            <Link
                to={{
                    pathname: "/login",
                    redefinicaoDeSenha: {
                        msg: "Senha redefinida com sucesso",
                        alertCss: "alert alert-success"
                    }
                }}
                className="btn btn-success btn-block"
            >
                Continuar
            </Link>
        </>
    );
};