import React, {memo} from "react";

const ExibeMotivosPagamentoAntecipadoNoForm = ({values}) => {

    const exibeMotivos = () =>{
        let data_transacao = values.data_transacao
        let data_documento = values.data_documento

        if (data_transacao && data_documento) {
            if (data_transacao < data_documento && (values.motivos_pagamento_antecipado.length > 0 || values.outros_motivos_pagamento_antecipado)) {
                return(
                    <div className="form-row mt-3">
                        <div className='col-12'>
                            <p>Justificativa(s) de pagamento antecipado</p>
                        </div>
                        <div className="col-12 border">
                            {values.motivos_pagamento_antecipado.map((motivo)=>(
                                    <p key={motivo.id} className='mt-2 mb-2 fonte-16 pl-3'>{motivo.motivo}</p>
                                )
                            )}
                            <p className='mt-2 mb-1 fonte-16 pl-3'>{values.outros_motivos_pagamento_antecipado}</p>

                        </div>
                    </div>
                )
            }
        }
    }

  return(
      exibeMotivos()
  )
}

export default memo(ExibeMotivosPagamentoAntecipadoNoForm)

