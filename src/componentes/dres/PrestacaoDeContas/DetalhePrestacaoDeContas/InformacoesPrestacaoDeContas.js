import React from "react";
import {DatePickerField} from "../../../Globais/DatePickerField";
import MaskedInput from "react-text-mask";
import { processoSeiMask } from "../../../../utils/ProcessoSeiMask";

export const InformacoesPrestacaoDeContas = ({handleChangeFormInformacoesPrestacaoDeContas, informacoesPrestacaoDeContas, editavel}) =>{

    const isValid = (value) => {
        if(value !== '' &&
           value !== null && 
           value !== undefined){
            return true
        } else {
            return false
        }
    };

    return(
        <>
            <hr className='mt-4 mb-3'/>
            <h4 className='mb-4'>Informativos da prestação de contas</h4>
            <form method="post">
                <div className="row mt-3">
                    <div className="col">
                        <label htmlFor="processo_sei">Processo SEI *</label>
                        <MaskedInput
                            mask={(valor) => processoSeiMask(valor)}
                            onChange={(e) => handleChangeFormInformacoesPrestacaoDeContas(e.target.name, e.target.value)}
                            name="processo_sei"
                            className={`form-control ${isValid(informacoesPrestacaoDeContas.processo_sei) ? '' : 'is_invalid'}`}
                            value={informacoesPrestacaoDeContas.processo_sei ? informacoesPrestacaoDeContas.processo_sei : ''}
                            id="processo_regularidade"
                            disabled={!editavel}
                        />
                    </div>
                    <div className="col">
                        <label htmlFor="ultima_analise">Última análise</label>
                        <DatePickerField
                            name="ultima_analise"
                            id="ultima_analise"
                            value={informacoesPrestacaoDeContas.ultima_analise ? informacoesPrestacaoDeContas.ultima_analise : ''}
                            onChange={handleChangeFormInformacoesPrestacaoDeContas}
                            disabled={true}
                            placeholderText=''
                        />
                    </div>
                </div>
            </form>
        </>
    )
};