import moment from "moment";
import React from "react";

const useDataTemplate = () =>{

    const retornaDataFormatada = (rowData = '', column = '', data_passada = null) =>{
        if (rowData && column) {
            return (
                <div className='p-2'>
                    {rowData[column.field] ? moment(rowData[column.field]).format('DD/MM/YYYY') : '-'}
                </div>
            )
        } else if (data_passada) {
            return (
                data_passada ? moment(data_passada).format('DD/MM/YYYY') : '-'
            )
        }
    }

    return retornaDataFormatada
}

export default useDataTemplate