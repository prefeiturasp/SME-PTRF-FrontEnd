import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
export const AddUsuario = () => {
    return (
        <button onClick={() => {
            console.log("Adicionar Usuário")
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