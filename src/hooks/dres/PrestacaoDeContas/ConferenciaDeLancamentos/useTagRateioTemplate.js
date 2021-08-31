import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle} from "@fortawesome/free-solid-svg-icons";

function useTagRateioTemplate (){

    function retornaTagRateioTemplate (rateio) {
        if (rateio && rateio.tag && rateio.tag.nome) {
            return (
                <span
                    className='span-rateio-tag-conferencia-de-lancamentos text-wrap-conferencia-de-lancamentos'>{rateio.tag.nome}</span>
            )
        } else {
            return (
                <span> - </span>
            )
        }

    }

    return retornaTagRateioTemplate


}
export default useTagRateioTemplate