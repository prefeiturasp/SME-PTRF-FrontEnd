import React, {Component, Fragment, useEffect, useState} from "react";
import {Form, Formik, FieldArray} from "formik";
import {
    YupSignupSchemaCadastroDespesa,
    cpfMaskContitional,
    calculaValorRecursoAcoes,
    trataNumericos,
    convertToNumber, round,
} from "../../../utils/ValidacoesAdicionaisFormularios";
import MaskedInput from 'react-text-mask'
import {getDespesasTabelas, getEspecificacaoMaterialServico} from "../../../services/Despesas.service";
import {DatePickerField} from "../../DatePickerField";
import NumberFormat from "react-number-format";
import moment from "moment";
import {Button, Modal} from "react-bootstrap";
import {useHistory} from 'react-router-dom'
import {CadastroFormCusteio} from "./CadastroFormCusteio";
import {CadastroFormCapital} from "./CadastroFormCapital";

class CancelarModal extends Component {

    render() {
        return (
            <Fragment>
                <Modal centered show={this.props.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Deseja cancelar a inclusão de Despesa?</Modal.Title>
                    </Modal.Header>
                    {/* <Modal.Body>
                        <div > </div>
                    </Modal.Body> */}
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.props.onCancelarTrue}>
                            OK
                        </Button>
                        <Button variant="primary" onClick={this.props.handleClose}>
                            fechar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Fragment>
        )
    }
}


export const CadastroForm = () => {
    let history = useHistory();
    const [despesasTabelas, setDespesasTabelas] = useState([])
    const [show, setShow] = useState(false);
    const [aplicacao_recurso, set_aplicacao_recurso] = useState(undefined);
    const [tipo_custeio, set_tipo_custeio] = useState(undefined);
    const [especificaoes, set_especificaoes] = useState(undefined);
    const [especificaoes_disable, set_especificaoes_disable] = useState(true);

    useEffect(() => {
        const carregaTabelasDespesas = async () => {
            const resp = await getDespesasTabelas();
            console.log(resp)
            setDespesasTabelas(resp);
        };
        carregaTabelasDespesas();

    }, [])

    useEffect(()=> {
        if (aplicacao_recurso !== undefined) {
            const carregaEspecificacoes = async () => {
                const resp = await getEspecificacaoMaterialServico(aplicacao_recurso, tipo_custeio)
                set_especificaoes_disable(false)
                console.log(resp)
                set_especificaoes(resp);
            };
            carregaEspecificacoes();
            set_especificaoes_disable(true)
        }
    },[aplicacao_recurso, tipo_custeio])


    const initialValues = () => {
        const inital = {

            associacao: "52ad4766-3515-4de9-8ab6-3b12078f8f14",
            tipo_documento: "",
            tipo_transacao: "",
            numero_documento: "",
            data_documento: "",
            cpf_cnpj_fornecedor: "",
            nome_fornecedor: "",
            data_transacao: "",
            valor_total: "",
            valor_recursos_proprios: "",
            // Auxiliares
            mais_de_um_tipo_despesa: "",
            valor_recusos_acoes:0,
            valor_total_dos_rateios:0,
            // Fim Auxiliares
            rateios: [
                {
                    associacao: "52ad4766-3515-4de9-8ab6-3b12078f8f14",
                    conta_associacao: "",
                    acao_associacao: "",
                    aplicacao_recurso: "",
                    tipo_custeio: "",
                    especificacao_material_servico: "",
                    valor_rateio: "",
                    quantidade_itens_capital: "",
                    valor_item_capital: "",
                    numero_processo_incorporacao_capital: "",
                }
            ],
        }

        return inital
    }

    const onSubmit = (values, {resetForm}) => {
        values.tipo_documento = convertToNumber(values.tipo_documento);
        values.tipo_transacao = convertToNumber(values.tipo_transacao);
        values.valor_total = trataNumericos(values.valor_total);
        values.valor_recursos_proprios = trataNumericos(values.valor_recursos_proprios);
        values.valor_recusos_acoes = round((values.valor_recusos_acoes), 2)
        if (values.data_documento !== ""){
            values.data_documento = moment(values.data_documento).format("YYYY-MM-DD");
        }

        if (values.data_transacao !== ""){
            values.data_transacao = moment(values.data_transacao).format("YYYY-MM-DD");
        }

        values.rateios.map((rateio) => {
            rateio.tipo_custeio = convertToNumber(rateio.tipo_custeio)
            rateio.especificacao_material_servico = convertToNumber(rateio.especificacao_material_servico)
            rateio.valor_rateio = trataNumericos(rateio.valor_rateio)
            rateio.quantidade_itens_capital = convertToNumber(rateio.quantidade_itens_capital)
            rateio.valor_item_capital = trataNumericos(rateio.valor_item_capital)

            //values.valor_total_dos_rateios = values.valor_total_dos_rateios + rateio.valor_rateio
        })

        if (values.valor_total_dos_rateios !== values.valor_recusos_acoes ) {
            console.log("Valores diferentes")
        }else{
            console.log("Valores iguais")
        }

        console.log("onSubmit", values)

        resetForm({values: ""})



    }

    const handleReset = (props) => {

    }

    const handleOnBlur = (nome, valor) =>{
        if (nome === 'aplicacao_recurso'){
            console.log("Aplicacao Recurso ", aplicacao_recurso)
            set_aplicacao_recurso(valor)
        }else if(nome === 'tipo_custeio'){
            set_tipo_custeio(valor)
        }
    }

    const onCancelarTrue = () => {
        setShow(false);
        let path = `/lista-de-despesas`;
        history.push(path);
    }

    const onHandleClose = () => {
        setShow(false);
    }

    const onShowModal = () => {
        setShow(true);
    }

    const calculaValorTodosRateios = (array) => {

        let valor_total=0
        array.map((item)=> {
            valor_total = valor_total + (convertToNumber(item.quantidade_itens_capital) * trataNumericos(item.valor_item_capital))
        })

        return valor_total
    }

    return (
        <>
            <Formik
                initialValues={initialValues()}
                validationSchema={YupSignupSchemaCadastroDespesa}
                validateOnBlur={true}
                onSubmit={onSubmit}
                //enableReinitialize={true}
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
                                    {props.errors.cpf_cnpj_fornecedor && <span
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
                                        <option key={0} value={0}>Selecione o tipo</option>
                                        {despesasTabelas.tipos_documento && despesasTabelas.tipos_documento.map(item =>
                                            <option key={item.id} value={item.id}>{item.nome}</option>
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
                                        <option key={0} value={0}>Selecione o tipo</option>
                                        {despesasTabelas.tipos_transacao && despesasTabelas.tipos_transacao.map(item => (
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
                                        allowNegative={false}
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
                                        allowNegative={false}
                                        prefix={'R$'}
                                        name="valor_recursos_proprios"
                                        id="valor_recursos_proprios"
                                        className="form-control"
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                    />
                                    {props.errors.valor_recursos_proprios && <span className="span_erro text-danger mt-1"> {props.errors.valor_recursos_proprios}</span>}
                                </div>

                                <div className="col-12 col-md-3 mt-4">
                                    <label htmlFor="valor_recusos_acoes">Valor do recurso das ações</label>
                                    <NumberFormat
                                        value={calculaValorRecursoAcoes(props)}
                                        thousandSeparator={'.'}
                                        decimalSeparator={','}
                                        decimalScale={2}
                                        prefix={'R$ '}
                                        name="valor_recusos_acoes"
                                        id="valor_recusos_acoes"
                                        className="form-control"
                                        onChange={setFieldValue}
                                        //onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        readOnly={true}
                                    />
                                    {props.errors.valor_recusos_acoes && <span className="span_erro text-danger mt-1"> {props.errors.valor_recusos_acoes}</span>}
                                </div>
                            </div>

                            <hr/>
                            <h2 className="subtitulo-itens-painel">Dados do gasto</h2>
                            <p>Esse gasto se encaixa em mais de um tipo de despesa ou ação?</p>
                            <div className="form-row">
                                <div className="col-12 col-md-3 ">
                                    <select
                                        value={props.values.mais_de_um_tipo_despesa}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        name='mais_de_um_tipo_despesa'
                                        id='mais_de_um_tipo_despesa'
                                        className="form-control"
                                    >
                                        <option value="0">Selecione</option>
                                        <option value="nao">Não</option>
                                        <option value="sim">Sim</option>
                                    </select>
                                </div>
                            </div>


                            <FieldArray
                                name="rateios"
                                render={({insert, remove, push}) => (
                                    <>
                                        {values.rateios.length > 0 && values.rateios.map((rateio, index) => {
                                            return (

                                                <div key={index}>

                                                    <div className="form-row">

                                                        {props.values.mais_de_um_tipo_despesa === "sim" && index >=1 &&(
                                                            <div className="col-12 mt-4 ml-0">
                                                                <p className='mb-0'><strong>Despesa {index}</strong></p>
                                                                <hr className='mt-0 mb-1'/>
                                                            </div>
                                                        )}

                                                        <div className="col-12 col-md-6 mt-4">

                                                            <label htmlFor="aplicacao_recurso">Tipo de aplicação do recurso</label>
                                                            <select
                                                                value={rateio.aplicacao_recurso}
                                                                onChange={props.handleChange}
                                                                onBlur={(e)=>handleOnBlur("aplicacao_recurso", e.target.value)}
                                                                name={`rateios[${index}].aplicacao_recurso`}
                                                                id='aplicacao_recurso'
                                                                className="form-control"
                                                            >
                                                                <option key={0} value={0}>Escolha uma opção</option>
                                                                {despesasTabelas.tipos_aplicacao_recurso && despesasTabelas.tipos_aplicacao_recurso.map(item => (
                                                                    <option key={item.id} value={item.id}>{item.nome}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>

                                                    { rateio.aplicacao_recurso && rateio.aplicacao_recurso === 'CUSTEIO' ? (
                                                        <CadastroFormCusteio
                                                            formikProps={props}
                                                            rateio={rateio}
                                                            index={index}
                                                            handleOnBlur={handleOnBlur}
                                                            despesasTabelas={despesasTabelas}
                                                            especificaoes_disable={especificaoes_disable}
                                                            especificaoes={especificaoes}
                                                        />
                                                    ):
                                                        rateio.aplicacao_recurso && rateio.aplicacao_recurso === 'CAPITAL' ? (
                                                            <CadastroFormCapital
                                                                formikProps={props}
                                                                rateio={rateio}
                                                                index={index}
                                                                handleOnBlur={handleOnBlur}
                                                                despesasTabelas={despesasTabelas}
                                                                especificaoes_disable={especificaoes_disable}
                                                                especificaoes={especificaoes}
                                                            />

                                                            ): null}



                                                    {index >= 1 && props.values.mais_de_um_tipo_despesa === "sim" && (

                                                            <div className="d-flex  justify-content-start mt-3 mb-3">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn btn-outline-success mt-2 mr-2"
                                                                    onClick={() => remove(index )}
                                                                >
                                                                    - Remover Despesa
                                                                </button>
                                                            </div>

                                                    )}
                                                </div> /*div key*/
                                            )
                                        })}

                                        {props.values.mais_de_um_tipo_despesa === "sim" && aplicacao_recurso !== undefined && aplicacao_recurso!=="0" && aplicacao_recurso !== "" &&
                                        <div className="d-flex  justify-content-start mt-3 mb-3">

                                            <button
                                                type="button"
                                                className="btn btn btn-outline-success mt-2 mr-2"
                                                onClick={() => push(
                                                    {
                                                        associacao: "52ad4766-3515-4de9-8ab6-3b12078f8f14",
                                                        conta_associacao: "",
                                                        acao_associacao: "",
                                                        aplicacao_recurso: "",
                                                        tipo_custeio: "",
                                                        especificacao_material_servico: "",
                                                        valor_rateio: "",
                                                        quantidade_itens_capital: "",
                                                        valor_item_capital: "",
                                                        numero_processo_incorporacao_capital: ""
                                                    }
                                                )
                                                }
                                            >
                                                + Adicionar despesa parcial
                                            </button>
                                        </div>
                                        }
                                    </>

                                )}
                            />


                            <div className="d-flex  justify-content-end pb-3">
                                <button type="reset" onClick={onShowModal} className="btn btn btn-outline-success mt-2 mr-2">Cancelar </button>
                                <button onClick={() => {
                                    setFieldValue("valor_recusos_acoes", trataNumericos(props.values.valor_total) - trataNumericos(props.values.valor_recursos_proprios))

                                    setFieldValue("valor_total_dos_rateios", calculaValorTodosRateios(props.values.rateios) )

                                    /*setFieldValue("valor_total_dos_rateios", props.values.rateios.map((rateio)=>(
                                        rateio.valor_total_dos_rateios =  (trataNumericos(rateio.valor_rateio) + trataNumericos(rateio.valor_rateio)) / props.values.rateios.length
                                    )))*/

                                }} type="submit" className="btn btn-success mt-2">Acessar</button>


                                {/*<button onClick={() => {setFieldValue("valor_recusos_acoes", trataNumericos(props.values.valor_total) - trataNumericos(props.values.valor_recursos_proprios),
                                    "valor_total_dos_rateios", props.values.rateios.map((rateio)=>{
                                        trataNumericos(++rateio.valor_rateio)
                                })) }} type="submit" className="btn btn-success mt-2">Acessar</button>*/}

                            </div>
                        </Form>

                    ); /*Return metodo principal*/

                }}
            </Formik>
            <section>
                <CancelarModal show={show} handleClose={onHandleClose} onCancelarTrue={onCancelarTrue}/>
            </section>
        </>
    );
}