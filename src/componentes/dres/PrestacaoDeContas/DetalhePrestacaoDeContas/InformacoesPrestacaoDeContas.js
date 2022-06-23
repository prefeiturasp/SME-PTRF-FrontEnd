import React from "react";
import {DatePickerField} from "../../../Globais/DatePickerField";

export const InformacoesPrestacaoDeContas = ({handleChangeFormInformacoesPrestacaoDeContas, informacoesPrestacaoDeContas, editavel}) =>{
    return(
        <>
            <hr className='mt-4 mb-3'/>
            <h4 className='mb-4'>Informativos da prestação de contas</h4>
            <form method="post">
                <div className="row mt-3">
                    <div className="col">
                        <label htmlFor="processo_sei">Processo SEI</label>
                        <input
                            value={informacoesPrestacaoDeContas.processo_sei ? informacoesPrestacaoDeContas.processo_sei : ''}
                            onChange={(e) => handleChangeFormInformacoesPrestacaoDeContas(e.target.name, e.target.value)}
                            name='processo_sei'
                            type="text"
                            className="form-control"
                            disabled={true}
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