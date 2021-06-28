import React, {useCallback, useContext, useEffect, useState} from "react";
import {Formik} from "formik";
import {YupSignupSchemaCadastroDespesaSaida, validaPayloadDespesas, cpfMaskContitional, valida_cpf_cnpj,} from "../../../../utils/ValidacoesAdicionaisFormularios";
import MaskedInput from 'react-text-mask';
import {getDespesasTabelas, criarDespesa, patchAtrelarSaidoDoRecurso} from "../../../../services/escolas/Despesas.service";
import {DatePickerField} from "../../../Globais/DatePickerField";
import {useParams} from 'react-router-dom';
import {DespesaContext} from "../../../../context/Despesa";
import "./cadastro-de-despesas.scss";
import {metodosAuxiliares} from "../metodosAuxiliares";
import {trataNumericos} from "../../../../utils/ValidacoesAdicionaisFormularios";
import Loading from "../../../../utils/Loading";
import CurrencyInput from "react-currency-input";
import HTTP_STATUS from "http-status-codes";
import {getReceita} from '../../../../services/escolas/Receitas.service';


export const CadastroSaidaForm = () => {
    const aux = metodosAuxiliares;

    let {uuid} = useParams();
    const despesaContext = useContext(DespesaContext);
    const [cssEscondeDocumentoTransacao, setCssEscondeDocumentoTransacao] = useState('escondeItem');
    const [labelDocumentoTransacao, setLabelDocumentoTransacao] = useState('');
    const [despesasTabelas, setDespesasTabelas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [receita, setReceita] = useState(true);


    useEffect(() => {
        const carregaTabelasDespesas = async () => {
            const resp = await getDespesasTabelas();
            setDespesasTabelas(resp);
        };

        const buscaReceita = async () => {
            if (uuid) {
                getReceita(uuid).then(response => {
                    const resp = response.data;
                    setReceita(resp);
                }).catch(error => {
                    console.log(error);
                });
            }
        };
        buscaReceita();
        carregaTabelasDespesas();
        setLoading(false);
    }, [uuid])

    const initialValues = () => {
        return despesaContext.initialValues;
    };

    // Validações adicionais
    const [formErrors, setFormErrors] = useState({});
    const [enviarFormulario, setEnviarFormulario] = useState(true);
    const [numeroDocumentoReadOnly, setNumeroDocumentoReadOnly] = useState(false);

    const validacoesPersonalizadas = useCallback((values) => {

        let erros = {};
        let cpf_cnpj_valido = !(!values.cpf_cnpj_fornecedor || values.cpf_cnpj_fornecedor.trim() === "" || !valida_cpf_cnpj(values.cpf_cnpj_fornecedor));

        if (!cpf_cnpj_valido) {
            erros = {
                cpf_cnpj_fornecedor: "Digite um CPF ou um CNPJ válido"
            }
            setEnviarFormulario(false)
        } else {
            setEnviarFormulario(true)
        }

        // Validando se tipo de documento aceita apenas numéricos e se exibe campo Número do Documento
        if (values.tipo_documento) {
            //debugger
            let exibe_campo_numero_documento;
            let so_numeros;
            // verificando se despesasTabelas já está preenchido
            if (despesasTabelas && despesasTabelas.tipos_documento) {
                if (values.tipo_documento.id) {
                    so_numeros = despesasTabelas.tipos_documento.find(element => element.id === Number(values.tipo_documento.id));
                } else {
                    so_numeros = despesasTabelas.tipos_documento.find(element => element.id === Number(values.tipo_documento));
                }
            }

            // Verificando se exibe campo Número do Documento
            exibe_campo_numero_documento = so_numeros;
            if (exibe_campo_numero_documento && !exibe_campo_numero_documento.numero_documento_digitado) {
                values.numero_documento = "";
                setNumeroDocumentoReadOnly(true)
            } else {
                setNumeroDocumentoReadOnly(false)
            }

            if (exibe_campo_numero_documento && exibe_campo_numero_documento.numero_documento_digitado && !values.numero_documento) {
                erros = {
                    ...erros,
                    numero_documento: "Número do documento é obrigatório"
                }
                setEnviarFormulario(false)
            } else {
                setEnviarFormulario(true)
            }

            if (so_numeros && so_numeros.apenas_digitos && values.numero_documento) {
                if (isNaN(values.numero_documento)) {
                    erros = {
                        ...erros,
                        numero_documento: "Este campo deve conter apenas algarismos numéricos."
                    }
                    setEnviarFormulario(false)
                }
            }
        }


        return erros;
    }, [despesasTabelas])

    const onSubmit = async (values) => {

        setFormErrors(validacoesPersonalizadas(values));
        let erros_personalizados = validacoesPersonalizadas(values)

        if (enviarFormulario && Object.keys(erros_personalizados).length === 0) {
            setLoading(true);
            validaPayloadDespesas(values, despesasTabelas);

            values.rateios[0].acao_associacao = receita.acao_associacao.uuid;
            values.rateios[0].conta_associacao = receita.conta_associacao.uuid;
            values.rateios[0].valor_original = values.valor_original
            values.rateios[0].valor_rateio = values.valor_original

            try {
                const response = await criarDespesa(values);
                if (response.status === HTTP_STATUS.CREATED) {
                    console.log("Despesa criada com sucesso!");
                    try {
                        await patchAtrelarSaidoDoRecurso(uuid, response.data.uuid)
                        console.log("Saída recurso atrelada com sucesso")
                        aux.getPath()
                    }catch (e) {
                        console.log("Erro ao atrelar saída recurso ", e.response.data)
                    }
                } else {
                    setLoading(false);
                }
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        }
    };

    const onCancelarTrue = () => {
        aux.getPath();
    };

    return (
        <>
            {loading ?
                <Loading
                    corGrafico="black"
                    corFonte="dark"
                    marginTop="50"
                    marginBottom="0"
                />
                :
                <Formik
                    initialValues={initialValues()}
                    validationSchema={YupSignupSchemaCadastroDespesaSaida}
                    validateOnChange={false}
                    validateOnBlur={false}
                    enableReinitialize={true}
                    onSubmit={onSubmit}
                >
                    {props => {
                        const {
                            values,
                            setFieldValue,
                            setErrors,
                            errors,
                        } = props;

                        return (
                            <>
                                <form method="POST" onSubmit={props.handleSubmit}>
                                    <div className="form-row">
                                        <div className="col-12 col-md-6 mt-4">
                                            <label htmlFor="cpf_cnpj_fornecedor">CNPJ ou CPF do fornecedor</label>
                                            <MaskedInput
                                                mask={(valor) => cpfMaskContitional(valor)}
                                                value={props.values.cpf_cnpj_fornecedor}
                                                onChange={(e) => {
                                                    props.handleChange(e);
                                                }}
                                                onBlur={(e) => {
                                                    setFormErrors(validacoesPersonalizadas(values));
                                                    aux.get_nome_razao_social(e.target.value, setFieldValue);
                                                }}
                                                onClick={() => {
                                                    setFormErrors({cpf_cnpj_fornecedor: ""})
                                                }}
                                                name="cpf_cnpj_fornecedor" id="cpf_cnpj_fornecedor" type="text"
                                                className={`${!props.values.cpf_cnpj_fornecedor && despesaContext.verboHttp === "PUT" && "is_invalid "} form-control`}
                                                placeholder="Digite o número do CNPJ ou CPF (apenas algarismos)"
                                            />
                                            {/* Validações personalizadas */}
                                            {formErrors.cpf_cnpj_fornecedor && <p className='mb-0'><span className="span_erro text-danger mt-1">{formErrors.cpf_cnpj_fornecedor}</span></p>}
                                        </div>
                                        <div className="col-12 col-md-6  mt-4">
                                            <label htmlFor="nome_fornecedor">Razão social do fornecedor</label>
                                            <input
                                                value={props.values.nome_fornecedor}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                name="nome_fornecedor" id="nome_fornecedor" type="text"
                                                className={`${!props.values.nome_fornecedor && despesaContext.verboHttp === "PUT" && "is_invalid "} form-control`}
                                                placeholder="Digite o nome"
                                                onClick={()=>{
                                                    setErrors({...errors, nome_fornecedor:""})
                                                }}
                                            />
                                            {props.errors.nome_fornecedor && <span className="span_erro text-danger mt-1"> {props.errors.nome_fornecedor}</span>}
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="col-12 col-md-3 mt-4">
                                            <label htmlFor="tipo_documento">Tipo de documento</label>
                                            <select
                                                value={
                                                    props.values.tipo_documento !== null ? (
                                                        props.values.tipo_documento === "object" ? props.values.tipo_documento.id : props.values.tipo_documento.id
                                                    ) : ""
                                                }
                                                onChange={props.handleChange}
                                                onBlur={(e) => {
                                                    setFormErrors(validacoesPersonalizadas(values));
                                                }}
                                                name='tipo_documento'
                                                id='tipo_documento'
                                                className={`${!props.values.tipo_documento && despesaContext.verboHttp === "PUT" && "is_invalid "} form-control`}
                                                onClick={()=>{
                                                    setErrors({...errors, tipo_documento:""})
                                                }}
                                            >
                                                <option key={0} value="">Selecione o tipo</option>
                                                {despesasTabelas.tipos_documento && despesasTabelas.tipos_documento.map(item =>
                                                    <option key={item.id} value={item.id}>{item.nome}</option>
                                                )}
                                            </select>
                                            {props.errors.tipo_documento && <span
                                                className="span_erro text-danger mt-1"> {props.errors.tipo_documento}</span>}
                                        </div>

                                        <div className="col-12 col-md-3 mt-4">
                                            <label htmlFor="data_documento">Data do documento</label>
                                            <DatePickerField
                                                name="data_documento"
                                                id="data_documento"
                                                value={values.data_documento != null ? values.data_documento : ""}
                                                onChange={setFieldValue}
                                                about={despesaContext.verboHttp}
                                                onCalendarOpen={()=>{
                                                    setErrors({...errors, data_documento:""})
                                                }}
                                            />
                                            {props.errors.data_documento && <span
                                                className="span_erro text-danger mt-1"> {props.errors.data_documento}</span>}
                                        </div>

                                        <div className="col-12 col-md-6 mt-4">
                                            <label htmlFor="numero_documento">Número do documento</label>
                                            <input
                                                value={props.values.numero_documento}
                                                onChange={props.handleChange}
                                                onBlur={(e) => {
                                                    setFormErrors(validacoesPersonalizadas(values));
                                                }}
                                                name="numero_documento"
                                                id="numero_documento" type="text"
                                                className={`${!props.values.numero_documento && despesaContext.verboHttp === "PUT" ? "is_invalid " : ""} form-control`}
                                                placeholder={numeroDocumentoReadOnly ? "" : "Digite o número"}
                                                disabled={numeroDocumentoReadOnly}
                                                onClick={()=>{
                                                    setErrors({...errors, numero_documento:""})
                                                }}
                                            />
                                            {props.errors.numero_documento && <span className="span_erro text-danger mt-1"> {props.errors.numero_documento}</span>}
                                            {!props.errors.numero_documento && formErrors.numero_documento && <p className='mb-0'><span className="span_erro text-danger mt-1">{formErrors.numero_documento}</span></p>}
                                        </div>

                                        <div className="col-12 col-md-6 mt-4">
                                            <label htmlFor="tipo_transacao">Tipo de transação</label>
                                            <select
                                                value={
                                                    props.values.tipo_transacao !== null ? (
                                                        props.values.tipo_transacao === "object" ? props.values.tipo_transacao.id : props.values.tipo_transacao.id
                                                    ) : ""
                                                }
                                                onChange={(e) => {
                                                    props.handleChange(e);
                                                    aux.exibeDocumentoTransacao(e.target.value, setCssEscondeDocumentoTransacao, setLabelDocumentoTransacao, despesasTabelas)
                                                }}
                                                onClick={()=>{
                                                    setErrors({...errors, tipo_transacao:""})
                                                }}
                                                onBlur={props.handleBlur}
                                                name='tipo_transacao'
                                                id='tipo_transacao'
                                                className={`${!props.values.tipo_transacao && despesaContext.verboHttp === "PUT" && "is_invalid "} form-control`}
                                            >
                                                <option key={0} value="">Selecione o tipo</option>
                                                {despesasTabelas.tipos_transacao && despesasTabelas.tipos_transacao.map(item => (
                                                    <option key={item.id} value={item.id}>{item.nome}</option>
                                                ))}
                                            </select>
                                            {props.errors.tipo_transacao && <span className="span_erro text-danger mt-1"> {props.errors.tipo_transacao}</span>}
                                        </div>

                                        <div className="col-12 col-md-3 mt-4">
                                            <label htmlFor="data_transacao">Data da transação</label>
                                            <DatePickerField
                                                name="data_transacao"
                                                id="data_transacao"
                                                value={values.data_transacao != null ? values.data_transacao : ""}
                                                onChange={setFieldValue}
                                                about={despesaContext.verboHttp}
                                                onCalendarOpen={()=>{
                                                    setErrors({...errors, data_transacao:""})
                                                }}
                                            />
                                            {props.errors.data_transacao &&
                                            <span
                                                className="span_erro text-danger mt-1"> {props.errors.data_transacao}</span>}
                                        </div>

                                        <div className="col-12 col-md-3 mt-4">
                                            <div className={cssEscondeDocumentoTransacao}>
                                                <label htmlFor="documento_transacao">Número do {labelDocumentoTransacao}</label>
                                                <input
                                                    value={props.values.documento_transacao}
                                                    onChange={props.handleChange}
                                                    onBlur={props.handleBlur}
                                                    name="documento_transacao"
                                                    id="documento_transacao"
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Digite o número do documento"
                                                    onClick={()=>{
                                                        setErrors({...errors, documento_transacao:""})
                                                    }}
                                                />
                                                {props.errors.documento_transacao && <span
                                                    className="span_erro text-danger mt-1"> {props.errors.documento_transacao}</span>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="col-12 col-md-3 mt-4">
                                            <label htmlFor="valor_original">Valor total do documento</label>
                                            <CurrencyInput
                                                allowNegative={false}
                                                prefix='R$'
                                                decimalSeparator=","
                                                thousandSeparator="."
                                                value={props.values.valor_original}
                                                name="valor_original"
                                                id="valor_original"
                                                className={`${trataNumericos(props.values.valor_total) === 0 && despesaContext.verboHttp === "PUT" && "is_invalid "} form-control`}
                                                selectAllOnFocus={true}
                                                onChangeEvent={(e) => {
                                                    props.handleChange(e);
                                                    aux.setValorRealizado(setFieldValue, e.target.value);
                                                    setErrors({
                                                        ...errors,
                                                        valor_original:"",
                                                        valor_total:"",
                                                    })
                                                }}
                                            />
                                            {/*Alteração de exibição de label feita pela PO em Review da Sprint 19*/}
                                            {/*{props.errors.valor_original && exibeMsgErroValorOriginal && <span className="span_erro text-danger mt-1"> A soma dos valores originais do rateio não está correspondendo ao valor total original utilizado com recursos do Programa.</span>}*/}
                                            {props.errors.valor_total && <span className="span_erro text-danger mt-1"> {props.errors.valor_total}</span>}
                                        </div>

                                        <div className="col-12 col-md-3 mt-4">
                                            <label htmlFor="valor_total" className="label-valor-realizado">Valor realizado</label>
                                            <CurrencyInput
                                                allowNegative={false}
                                                prefix='R$'
                                                decimalSeparator=","
                                                thousandSeparator="."
                                                value={values.valor_total}
                                                name="valor_total"
                                                id="valor_total"
                                                className={`${trataNumericos(props.values.valor_total) === 0 && despesaContext.verboHttp === "PUT" && "is_invalid "} form-control ${trataNumericos(props.values.valor_total) === 0 ? " input-valor-realizado-vazio" : " input-valor-realizado-preenchido"}`}
                                                selectAllOnFocus={true}
                                                onChangeEvent={(e) => {
                                                    props.handleChange(e);
                                                }}
                                            />

                                        </div>
                                    </div>
                                    <div className="d-flex  justify-content-end pb-3 mt-3">
                                        <button type="reset" onClick={onCancelarTrue} className="btn btn btn-outline-success mt-2 mr-2">Cancelar</button>
                                        <button type="submit" className="btn btn-success mt-2">Salvar</button>
                                    </div>
                                </form>
                            </>
                        )
                    }}
                </Formik>}
        </>
    )
}