import React, {useContext} from "react";
import {DadosDoGastoContext} from "../../../context/DadosDoGasto";
import {Form, Formik} from "formik";
import MaskedInput from 'react-text-mask'
import {
    YupSignupSchemaCadastroDespesa,
    cpfMaskContitional,
    calculaValorRecursoAcoes,
    payloadFormDespesaPrincipal
} from "../../../utils/ValidacoesAdicionaisFormularios";
import NumberFormat from 'react-number-format';
import {DatePickerField} from "../../DatePickerField";
import {DadosDoGastoEscolha} from "./DadosDoGastoEsolha";
import {GetDadosApiDespesaContext} from "../../../context/GetDadosApiDespesa";
import axios from "axios"

export const DespesaForm = () => {

    const dadosDoGastoContext = useContext(DadosDoGastoContext);
    const dadosApiContext = useContext(GetDadosApiDespesaContext);

    const initialValues = () => {
        return dadosDoGastoContext.initialValues
    }


    const onSubmit = (values, {resetForm}) => {

        let validaPayloadFormPrincipal = payloadFormDespesaPrincipal(values, dadosDoGastoContext.dadosDoGasto.tipo_aplicacao_recurso, dadosDoGastoContext.idAssociacao)
        console.log("Ollyver validaPayloadFormPrincipal", validaPayloadFormPrincipal)

        // Send a POST request
        axios({
            headers: {
                "Content-type": "application/json",
                Accept: "application/json",
            },
            //method: "POST",
            method: "PUT",
            //url: `https://dev-sig.escola.sme.prefeitura.sp.gov.br/api/despesas/`,
            url: `https://dev-sig.escola.sme.prefeitura.sp.gov.br/api/despesas/a1173fcc-7fcf-4782-956a-6285ecbd927d`,
            //url: 'https://dev-sig.escola.sme.prefeitura.sp.gov.br/api/despesas/9ff017ad-d8b5-4454-8121-566b6bd0e182',
            data: validaPayloadFormPrincipal,
        });

        resetForm({values: ""})
        dadosDoGastoContext.limpaFormulario();
    }

    const handleReset = () => {
        dadosDoGastoContext.limpaFormulario();
    }

    return (
        <>
            <Formik
                initialValues={initialValues()}
                validationSchema={YupSignupSchemaCadastroDespesa}
                validateOnBlur={true}
                onSubmit={onSubmit}
                enableReinitialize={true}
                onReset={(props) => handleReset(props)}
            >
                {props => {
                    const {
                        values,
                        setFieldValue,

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
                                    {props.errors.cpf_cnpj_fornecedor &&
                                    <span
                                        className="span_erro text-danger mt-1"> {props.errors.cpf_cnpj_fornecedor}</span>}
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

                            <div className="form-row">
                                <div className="col-12 col-md-3 mt-4">
                                    <label htmlFor="tipo_documento">Tipo de documento</label>

                                    <select
                                        value={props.values.tipo_documento.id}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        name='tipo_documento'
                                        id='tipo_documento'
                                        className="form-control">
                                        <option value={0}>Selecione o tipo</option>
                                        {dadosApiContext.despesastabelas.tipos_documento && dadosApiContext.despesastabelas.tipos_documento.map(item => (
                                                <option key={item.id} value={item.id}>{item.nome}</option>
                                            )
                                        )
                                        }
                                    </select>
                                </div>

                                <div className="col-12 col-md-3 mt-4">
                                    <label htmlFor="numero_documento">Número do documento</label>
                                    <input
                                        value={props.values.numero_documento}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        name="numero_documento" id="numero_documento" type="text"
                                        className="form-control" placeholder="Digite o número"/>
                                </div>

                                <div className="col-12 col-md-3 mt-4">
                                    <label htmlFor="data_documento">Data do documento</label>
                                    <DatePickerField
                                        name="data_documento"
                                        id="data_documento"
                                        value={values.data_documento}
                                        onChange={setFieldValue}
                                    />
                                    {props.errors.data_documento &&
                                    <span className="span_erro text-danger mt-1"> {props.errors.data_documento}</span>}
                                </div>

                                <div className="col-12 col-md-3 mt-4">
                                    <label htmlFor="tipo_transacao">Tipo de transação</label>
                                    <select
                                        value={props.values.tipo_transacao.id}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        name='tipo_transacao'
                                        id='tipo_transacao'
                                        className="form-control"
                                    >
                                        <option value={0}>Selecione o tipo</option>
                                        {dadosApiContext.despesastabelas.tipos_transacao && dadosApiContext.despesastabelas.tipos_transacao.map(item => (
                                            <option key={item.id} value={item.id}>{item.nome}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="col-12 col-md-3 mt-4">
                                    <label htmlFor="data_transacao">Data da transação</label>
                                    <DatePickerField
                                        name="data_transacao"
                                        id="data_transacao"
                                        value={values.data_transacao}
                                        onChange={setFieldValue}
                                    />
                                    {props.errors.data_transacao &&
                                    <span className="span_erro text-danger mt-1"> {props.errors.data_transacao}</span>}

                                </div>
                                <div className="col-12 col-md-3 mt-4">
                                    <label htmlFor="valor_total">Valor total</label>
                                    <NumberFormat
                                        value={props.values.valor_total}
                                        thousandSeparator={'.'}
                                        decimalSeparator={','}
                                        decimalScale={2}
                                        prefix={'R$'}
                                        name="valor_total"
                                        id="valor_total"
                                        className="form-control"
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                    />
                                    {props.errors.valor_total &&
                                    <span className="span_erro text-danger mt-1"> {props.errors.valor_total}</span>}

                                </div>
                                <div className="col-12 col-md-3 mt-4">
                                    <label htmlFor="valor_recursos_proprios">Valor do recurso próprio</label>
                                    <NumberFormat
                                        value={props.values.valor_recursos_proprios}
                                        thousandSeparator={'.'}
                                        decimalSeparator={','}
                                        decimalScale={2}
                                        prefix={'R$'}
                                        name="valor_recursos_proprios"
                                        id="valor_recursos_proprios"
                                        className="form-control"
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                    />
                                    {props.errors.valor_recursos_proprios && <span
                                        className="span_erro text-danger mt-1"> {props.errors.valor_recursos_proprios}</span>}
                                </div>
                                <div className="col-12 col-md-3 mt-4">
                                    <label htmlFor="valorRecursoAcoes">Valor do recurso das ações</label>
                                    <NumberFormat
                                        value={calculaValorRecursoAcoes(props)}
                                        thousandSeparator={'.'}
                                        decimalSeparator={','}
                                        decimalScale={2}
                                        prefix={'R$ '}
                                        name="valorRecursoAcoes"
                                        id="valorRecursoAcoes"
                                        className="form-control"
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        readOnly={true}
                                    />
                                    {props.errors.valorRecursoAcoes && <span
                                        className="span_erro text-danger mt-1"> {props.errors.valorRecursoAcoes}</span>}
                                </div>
                            </div>
                            <hr/>
                            <h2 className="subtitulo-itens-painel">Dados do gasto</h2>
                            <p>Esse gasto se encaixa em mais de um tipo de despesa ou ação?</p>
                            <div className="form-row">
                                <div className="col-12 col-md-3 ">
                                    <select
                                        value={props.values.dadosDoGasto}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        name='dadosDoGasto'
                                        id='dadosDoGasto'
                                        className="form-control"
                                    >
                                        <option value="0">Selecione</option>
                                        <option value="nao">Não</option>
                                        <option value="sim">Sim</option>
                                    </select>
                                </div>
                            </div>
                            {
                                props.values.dadosDoGasto === "sim" ? (
                                    <DadosDoGastoEscolha
                                        dadosDoGastoContext={dadosDoGastoContext}
                                        gastoEmMaisDeUmaDespesa={1}
                                        formikProps={props}

                                    />
                                ) : props.values.dadosDoGasto === "nao" ? (
                                    <DadosDoGastoEscolha
                                        dadosDoGastoContext={dadosDoGastoContext}
                                        gastoEmMaisDeUmaDespesa={0}
                                        formikProps={props}

                                    />
                                ) : null
                            }

                            <div className="d-flex  justify-content-end pb-3">
                                <button type="reset" onClick={props.handleReset}
                                        className="btn btn btn-outline-success mt-2 mr-2">Cancelar
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