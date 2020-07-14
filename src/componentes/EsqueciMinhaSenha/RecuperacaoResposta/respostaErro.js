import React, {useState} from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTimesCircle} from '@fortawesome/free-solid-svg-icons'
import Loading from "../../../utils/Loading";

export const RespostaErro = () => {

    const [btnDisabled, setBtnDisabled] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleClick = () => {
        setLoading(true);
        setBtnDisabled(true);
        window.location.assign('/esqueci-minha-senha/');
    };

    return (
        <>
        {loading ? (
            <Loading
                corGrafico="black"
                corFonte="dark"
                marginTop="0"
                marginBottom="0"
            />
            ) :
            <>
            <FontAwesomeIcon
                style={{fontSize: '80px', marginRight: "0", color: "red"}}
                icon={faTimesCircle}
            />
            <p className='mt-3'>
                Um erro ocorreu. Não encontramos o usuário solicitado, tente novamente
            </p>
            <button type="button" disabled={btnDisabled} onClick={() => {handleClick()}} className="btn btn-success btn-block">Continuar</button>
            </>
        }
        </>
    );
};