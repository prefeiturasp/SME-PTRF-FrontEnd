import React, {memo} from "react";

const JustificativaDeFaltaDeAjustes = ({prestacaoDeContas}) =>{
    return(
        <>
            {prestacaoDeContas && prestacaoDeContas.justificativa_pendencia_realizacao &&
                <div className='mt-3 mb-3'>
                    <p className='mb-2 fonte-16'><strong>Justificativa de falta de ajustes da Associação:</strong></p>
                    <p className='mb-0'>{prestacaoDeContas.justificativa_pendencia_realizacao}</p>
                </div>
            }
        </>
    )
}

export default memo(JustificativaDeFaltaDeAjustes)
