import React, {useContext} from "react";
import {DadosDoGastoNaoContext} from "../../../context/DadosDoGastoNao";
import {Formik} from "formik";
import MaskedInput from 'react-text-mask'
import {YupSignupSchemaCadastroDespesa, cpfMaskContitional, calculaValorRecursoAcoes, payloadFormDespesaPrincipal, payloadFormDespesaContext } from "../../../utils/ValidacoesAdicionaisFormularios";
import NumberFormat from 'react-number-format';
import {DatePickerField} from "../../DatePickerField";
import {DadosDoGastoNao} from "./DadosDoGastoNao";
import {GetTiposDeDocumentoApi, GetTipoTransacaoApi} from "../../../services/GetDadosApiDespesa";

export const DespesaForm = () => {

    const dadosDoGastoNaoContext = useContext(DadosDoGastoNaoContext);

    const initialValues = () => (
        {
            associacao: "07ac1e8f-de2f-4e71-8e7a-cc6074cf6a69",
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
        }
    )

    const onSubmit = (values, {resetForm}) => {
        let validaPayloadFormPrincipal = payloadFormDespesaPrincipal(values)
        let validaPayloadContext = payloadFormDespesaContext(dadosDoGastoNaoContext.dadosDoGastoNao)
        const payload = {
            ...validaPayloadFormPrincipal,
            rateios: [validaPayloadContext],
        };
        resetForm({values: ""})
        dadosDoGastoNaoContext.limpaFormulario();
        console.log("Ollyver Payload", payload)
    }

    const handleCancelar = ({resetForm})=> {

    }
    return (
        <>
            <Formik
                initialValues={initialValues()}
                validationSchema={YupSignupSchemaCadastroDespesa}
                validateOnBlur={true}
                onSubmit={onSubmit}
                enableReinitialize={true}
            >
                {props => {
                    const {
                        values,
                        setFieldValue,
                        resetForm
                    } = props;
                    return (
                        <form method="POST" id="despesaForm" onSubmit={props.handleSubmit}>
                            <div className="form-row">
                                <div className="col-12 col-md-6 mt-4">
                                    <label htmlFor="cpf_cnpj_fornecedor">CNPJ ou CPF do fornecedor</label>
                                    <MaskedInput
                                        mask={(valor) => cpfMaskContitional(valor)}
                                        value={props.values.cpf_cnpj_fornecedor}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        name="cpf_cnpj_fornecedor" id="cpf_cnpj_fornecedor" type="text" className="form-control"
                                        placeholder="Digite o número do documento"
                                    />
                                    {props.errors.cpf_cnpj_fornecedor &&
                                    <span className="span_erro text-danger mt-1"> {props.errors.cpf_cnpj_fornecedor}</span>}
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
                                        value={props.values.tipo_documento}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        name='tipo_documento'
                                        id='tipo_documento'
                                        className="form-control">
                                        <option value="">Selecione o tipo</option>
                                        {GetTiposDeDocumentoApi() && GetTiposDeDocumentoApi().map(item => (
                                            <option key={item.id} value={item.id}>{item.nome}</option>
                                        ))}
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
                                        value={props.values.tipo_transacao}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        name='tipo_transacao'
                                        id='tipo_transacao'
                                        className="form-control"
                                    >
                                        <option value="">Selecione o tipo</option>
                                        {GetTipoTransacaoApi() && GetTipoTransacaoApi().map(item => (
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
                                        <h1>Sim</h1>
                                ) : props.values.dadosDoGasto === "nao" ? (
                                    <DadosDoGastoNao
                                        dadosDoGastoNaoContext = {dadosDoGastoNaoContext}
                                    />
                                ) : null
                            }

                            <div className="d-flex  justify-content-end mt-5">
                                <button type="reset" onClick={resetForm} className="btn btn btn-outline-success mt-2 mr-2">Cancelar</button>
                                <button type="submit" className="btn btn-success mt-2">Acessar</button>
                            </div>

                        </form>
                    );
                }}
            </Formik>
        </>
    );
}