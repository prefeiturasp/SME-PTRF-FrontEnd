import React from "react";
import "./comprovacaoFiscal.scss"

export const ComprovacaoFiscal = ({formikProps, eh_despesa_com_comprovacao_fiscal, disabled, eh_despesa_reconhecida, limpa_campos_sem_comprovacao_fiscal, setFormErrors}) => {
    return(
        <div className="container-comprovacao-fiscal mt-2">
            <div className="form-row align-items-center box-escolha-comprovacao-fiscal">
                <div className="col-auto">
                    <p className='mb-0 mr-4 font-weight-normal'>Essa despesa tem comprovação fiscal?</p>
                </div>
                <div className="col-auto">
                    <div className="form-check form-check-inline">
                        <input
                            name="eh_despesa_sem_comprovacao_fiscal"
                            onChange={(e) => {
                                formikProps.handleChange(e);
                                formikProps.setFieldValue(`eh_despesa_sem_comprovacao_fiscal`, false)
                                formikProps.setFieldValue(`eh_despesa_reconhecida_pela_associacao`, true)
                                formikProps.setFieldValue(`nome_fornecedor`, "")
                                formikProps.setFieldValue("numero_boletim_de_ocorrencia", "")
                            }}
                            onBlur={formikProps.handleBlur}
                            className={`form-check-input`}
                            type="radio"
                            id="comprovacao_fiscal_sim"
                            disabled={disabled}
                            checked={eh_despesa_com_comprovacao_fiscal(formikProps.values)}
                        />
                        <label className="form-check-label" htmlFor="comprovacao_fiscal_sim">Sim</label>
                    </div>

                    <div className="form-check form-check-inline">
                        <input
                            name="eh_despesa_sem_comprovacao_fiscal"
                            onChange={(e) => {
                                formikProps.handleChange(e);
                                formikProps.setFieldValue(`eh_despesa_sem_comprovacao_fiscal`, true)
                                limpa_campos_sem_comprovacao_fiscal(formikProps.values, formikProps.setFieldValue)
                                formikProps.setFieldValue(`nome_fornecedor`, "Despesa sem comprovação fiscal")
                                setFormErrors({cpf_cnpj_fornecedor: ""})
                            }}
                            onBlur={formikProps.handleBlur}
                            className={`form-check-input`}
                            type="radio"
                            id="comprovacao_fiscal_nao"
                            disabled={disabled}
                            checked={!eh_despesa_com_comprovacao_fiscal(formikProps.values)}
                        />
                        <label className="form-check-label" htmlFor="comprovacao_fiscal_nao">Não</label>
                    </div>
                </div>
            </div>

            {!eh_despesa_com_comprovacao_fiscal(formikProps.values) &&
                <div className="form-row align-items-center box-escolha-reconhecida-pela-associacao">
                    <div className="col-auto">
                        <p className='mb-0 mr-4 font-weight-normal'>Essa despesa é reconhecida pela Associação?</p>
                    </div>
                    <div className="col-auto">
                        <div className="form-check form-check-inline">
                            <input
                                name="eh_despesa_reconhecida_pela_associacao"
                                onChange={(e) => {
                                    formikProps.handleChange(e);
                                    formikProps.setFieldValue(`eh_despesa_reconhecida_pela_associacao`, true)
                                    formikProps.setFieldValue(`nome_fornecedor`, "Despesa sem comprovação fiscal")
                                    formikProps.setFieldValue("numero_boletim_de_ocorrencia", "")
                                }}
                                className={`form-check-input`}
                                type="radio"
                                id="reconhecido_associacao_sim"
                                value={true}
                                disabled={disabled}
                                checked={eh_despesa_reconhecida(formikProps.values)}
                            />
                            <label className="form-check-label" htmlFor="reconhecido_associacao_sim">Sim</label>
                        </div>

                        <div className="form-check form-check-inline">
                            <input
                                name="eh_despesa_reconhecida_pela_associacao"
                                onChange={(e) => {
                                    formikProps.handleChange(e);
                                    formikProps.setFieldValue(`eh_despesa_reconhecida_pela_associacao`, false)
                                    formikProps.setFieldValue(`nome_fornecedor`, "Despesa sem comprovação fiscal não reconhecida pela Associação")
                                }}
                                className={`form-check-input`}
                                type="radio"
                                id="reconhecido_associacao_nao"
                                value={false}
                                disabled={disabled}
                                checked={!eh_despesa_reconhecida(formikProps.values)}
                            />
                            <label className="form-check-label" htmlFor="reconhecido_associacao_nao">Não</label>
                        </div>
                    </div>
                </div>
            }

        </div>
    )
}