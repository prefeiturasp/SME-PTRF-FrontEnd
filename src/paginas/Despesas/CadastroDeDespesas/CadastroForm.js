import React from "react";
import {Form, Formik} from "formik";
import {YupSignupSchemaCadastroDespesa, cpfMaskContitional} from "../../../utils/ValidacoesAdicionaisFormularios";
import MaskedInput from 'react-text-mask'

export const CadastroForm = () => {

    const initialValues = () => {
        const inital = {
            associacao: "52ad4766-3515-4de9-8ab6-3b12078f8f14",
            cpf_cnpj_fornecedor: "",
            nome_fornecedor: "",
            tipo_documento: "",
            numero_documento: "",
            data_documento: "",
            tipo_transacao: "",
            data_transacao: "",
            valor_total: "",
            valor_recursos_proprios: "",
            valorRecursoAcoes: "",
            dadosDoGasto: "",
            rateios: [{
                associacao: "52ad4766-3515-4de9-8ab6-3b12078f8f14",
                aplicacao_recurso: "",
                tipo_aplicacao_recurso: "",
                tipo_custeio: 1,
                especificacao_material_servico: "",
                conta_associacao: "",
                acao_associacao: "",
                valor_rateio: "",
                quantidade_itens_capital: "",
                valor_item_capital: "",
                numero_processo_incorporacao_capital: "",
            }]
        }

        return inital
    }

    const onSubmit = () => {
        
    }

    const handleReset =(props)=> {

    }

    return(
        <>
            <h1>Cadastro de Despesas</h1>
            <Formik
                initialValues={initialValues()}
                validationSchema={YupSignupSchemaCadastroDespesa}
                onSubmit={onSubmit}
                onReset={(props)=>handleReset(props)}
                >
                {props => {
                    const {
                        values,
                        setFieldValue
                    } = props;

                    return (
                        <Form onSubmit={props.handleSubmit}>
                            <div className="form-row">
                                <div className="col-12 col-md-6 mt-4">
                                    <label htmlFor="cpf_cnpj_fornecedor">CNPJ ou CPF do fornecedor</label>
                                    <MaskedInput
                                        mask={(valor) => cpfMaskContitional(valor)}
                                        value={props.values.cpf_cnpj_fornecedor}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        name="cpf_cnpj_fornecedor" id="cpf_cnpj_fornecedor" type="text"
                                        className="form-control"
                                        placeholder="Digite o número do documento"
                                    />
                                    {props.errors.cpf_cnpj_fornecedor && <span className="span_erro text-danger mt-1"> {props.errors.cpf_cnpj_fornecedor}</span>}
                                </div>

                                <div className="col-12 col-md-6  mt-4">
                                    <label htmlFor="nome_fornecedor">Razão social do fornecedor</label>
                                    <input
                                        value={props.values.nome_fornecedor}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        name="nome_fornecedor" id="nome_fornecedor" type="text" className="form-control"
                                        placeholder="Digite o nome"/>
                                </div>

                            </div>

                            <div className="d-flex  justify-content-end pb-3">
                                <button type="reset" onClick={props.handleReset} className="btn btn btn-outline-success mt-2 mr-2">Cancelar
                                </button>
                                <button type="submit" className="btn btn-success mt-2">Acessar</button>
                            </div>

                        </Form>
                    );

                }}

            </Formik>
        </>
    );
}