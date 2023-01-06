import React, {memo} from "react";
import {DatePickerField} from "../../../../Globais/DatePickerField";
import {RetornaSeTemPermissaoEdicaoAcompanhamentoDePc} from "../../RetornaSeTemPermissaoEdicaoAcompanhamentoDePc";

const DevolverParaAcertos = ({dataLimiteDevolucao, handleChangeDataLimiteDevolucao, editavel}) =>{

    const TEMPERMISSAOEDICAOACOMPANHAMENTOPC = RetornaSeTemPermissaoEdicaoAcompanhamentoDePc()

    return(
        <div className='mt-4'>
            <span className='mr-2'>Prazo para reenvio:</span>
            <DatePickerField
                value={dataLimiteDevolucao}
                onChange={handleChangeDataLimiteDevolucao}
                name='data_limite_devolucao'
                type="date"
                className="form-control datepicker-devolucao-para-acertos"
                wrapperClassName="container-datepicker-devolucao-para-acertos"
                disabled={!editavel || !TEMPERMISSAOEDICAOACOMPANHAMENTOPC}
            />
        </div>
    )
}

export default memo(DevolverParaAcertos)