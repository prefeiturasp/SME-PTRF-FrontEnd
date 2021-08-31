import React from "react";

function useNumeroDocumentoTemplate (){

    function retornaNumeroDocumentoTemplate (rowData, column) {
        return (
            <div className='p-2 text-wrap-conferencia-de-lancamentos'>
                {rowData[column.field] ? rowData[column.field] : '-'}
            </div>
        )
    }

    return retornaNumeroDocumentoTemplate


}
export default useNumeroDocumentoTemplate