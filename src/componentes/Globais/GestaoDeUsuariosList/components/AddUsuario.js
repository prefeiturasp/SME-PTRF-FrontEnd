import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {useHistory} from "react-router-dom";
export const AddUsuario = () => {
    let history = useHistory();
    return (
        <button onClick={() => {
            history.push('/gestao-de-usuarios-form')
        }
        } type="button" className="btn btn-success mt-2">
            <FontAwesomeIcon
                style={{fontSize: '15px', marginRight: "5", color: "#fff"}}
                icon={faPlus}
            />
            Adicionar
        </button>
    )
}