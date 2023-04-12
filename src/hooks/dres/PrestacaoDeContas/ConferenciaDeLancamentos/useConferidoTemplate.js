import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle} from "@fortawesome/free-solid-svg-icons";
import IconeConferidoAutomaticamente from "../../../../assets/img/icone-conferido-automaticame.svg";

const iconeConferidoAutomaticamente = <img
    src={IconeConferidoAutomaticamente}
    alt="Conferido automaticamente"
/>
function useConferidoTemplate (){

    function retornaConferidoTemplate (rowData=null, column=null) {
        if (rowData[column.field] && rowData[column.field]['resultado'] && rowData[column.field]['resultado'] === 'CORRETO') {
            return (
                <div className='p-2'>
                    <FontAwesomeIcon
                        style={{marginRight: "3px", color: '#297805'}}
                        icon={faCheckCircle}
                    />
                    {rowData[column.field]['houve_considerados_corretos_automaticamente'] === true && iconeConferidoAutomaticamente}
                </div>
            )
        } else if (rowData[column.field] && rowData[column.field]['resultado'] && rowData[column.field]['resultado'] === 'AJUSTE') {
            return (
                <div className='p-2'>
                    <FontAwesomeIcon
                        style={{marginRight: "3px", color: '#B40C02'}}
                        icon={faCheckCircle}
                    />
                    {rowData[column.field]['houve_considerados_corretos_automaticamente'] === true && iconeConferidoAutomaticamente}
                </div>
            )
        } else {
            return (
                <div className='p-2'>-</div>
            )
        }

    }

    return retornaConferidoTemplate


}
export default useConferidoTemplate