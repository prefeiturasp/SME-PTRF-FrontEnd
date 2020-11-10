import React, {useState} from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCheckCircle} from '@fortawesome/free-solid-svg-icons'
import Loading from "../../../../utils/Loading";

export const RespostaSucesso = ({emailComMascara}) =>{

    const [btnDisabled, setBtnDisabled] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleClick = () => {
        setLoading(true);
        setBtnDisabled(true);
        window.location.assign('/login');
    };

    return(
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
                        style={{fontSize: '80px', marginRight: "0"}}
                        icon={faCheckCircle}
                    />
                    <p className='mt-3'>
                        Seu link de recuperação de senha foi enviado para: <br/>{emailComMascara}
                    </p>
                    <p className="mb-5">Verifique sua caixa de entrada!</p>
                    <button type="button" disabled={btnDisabled} onClick={() => {handleClick()}} className="btn btn-success btn-block">Continuar</button>
                </>
            }
        </>
    );
};