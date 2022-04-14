import React from "react";


export const RetemImposto = ({formikProps, eh_despesa_com_retencao_imposto, disabled, mostraModalExcluirImposto}) => {
    return(
        <div className="form-row align-items-center box-escolha-retencao-imposto">
            <div className="col-auto">
                <p className='mb-0 mr-4 font-weight-normal'>Este serviço teve/terá retenção de imposto por parte da Associação?</p>
            </div>
            <div className="col-auto">
                <div className="form-check form-check-inline">
                    <input
                        name="retem_imposto"
                        onChange={(e) => {
                            formikProps.handleChange(e);
                            formikProps.setFieldValue("retem_imposto", true)
                        }}
                        onBlur={formikProps.handleBlur}
                        className={`form-check-input`}
                        type="radio"
                        id="retem_imposto_sim"
                        disabled={disabled}
                        checked={eh_despesa_com_retencao_imposto(formikProps.values)}
                        value={eh_despesa_com_retencao_imposto(formikProps.values)}
                    />
                    <label className="form-check-label" htmlFor="retem_imposto_sim">Sim</label>
                </div>

                <div className="form-check form-check-inline">
                    <input
                        name="retem_imposto"
                        onChange={(e) => {
                            formikProps.handleChange(e);
                            formikProps.setFieldValue("retem_imposto", false)
                            mostraModalExcluirImposto();
                        }}
                        onBlur={formikProps.handleBlur}
                        className={`form-check-input`}
                        type="radio"
                        id="retem_imposto_nao"
                        disabled={disabled}
                        checked={!eh_despesa_com_retencao_imposto(formikProps.values)}
                        value={!eh_despesa_com_retencao_imposto(formikProps.values)}
                    />
                    <label className="form-check-label" htmlFor="retem_imposto_nao">Não</label>
                </div>
            </div>
        </div>
    )
}