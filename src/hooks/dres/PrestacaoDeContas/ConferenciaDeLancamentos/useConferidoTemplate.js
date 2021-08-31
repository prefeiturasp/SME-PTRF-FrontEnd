import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle} from "@fortawesome/free-solid-svg-icons";

function useConferidoTemplate (){

    function retornaConferidoTemplate (rowData=null, column=null) {
        if (rowData[column.field] && rowData[column.field]['resultado'] && rowData[column.field]['resultado'] === 'CORRETO') {
            return (
                <div className='p-2'>
                    <FontAwesomeIcon
                        style={{marginRight: "3px", color: '#297805'}}
                        icon={faCheckCircle}
                    />
                </div>
            )
        } else if (rowData[column.field] && rowData[column.field]['resultado'] && rowData[column.field]['resultado'] === 'AJUSTE') {
            return (
                <div className='p-2'>
                    <FontAwesomeIcon
                        style={{marginRight: "3px", color: '#B40C02'}}
                        icon={faCheckCircle}
                    />
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