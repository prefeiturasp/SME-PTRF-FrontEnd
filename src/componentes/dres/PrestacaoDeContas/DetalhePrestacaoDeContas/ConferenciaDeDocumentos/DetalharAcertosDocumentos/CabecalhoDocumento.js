import React, {memo} from "react";

const CabecalhoDocumento = ({documentos}) =>{
    const documento = documentos && documentos[0] ? documentos[0] : ''
    return(
        <div className='row'>
            <div className='col-12'>
                <p className='mb-1'><strong>Nome do documento</strong></p>
                <p>{documento && documento.tipo_documento_prestacao_conta ? documento.tipo_documento_prestacao_conta.nome : "" }</p>
            </div>
        </div>
    )
}
export default memo(CabecalhoDocumento)