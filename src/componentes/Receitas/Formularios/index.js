import React, {useEffect, useState, Component, Fragment} from "react";
import { Button, Modal } from 'react-bootstrap';
import HTTP_STATUS from "http-status-codes";
import { Formik } from 'formik';
import { DatePickerField } from '../../DatePickerField'
import CurrencyInput from 'react-currency-input';
import { criarReceita, atualizaReceita, deletarReceita, getReceita, getTabelasReceita } from '../../../services/Receitas.service';
import { trataNumericos } from "../../../utils/ValidacoesAdicionaisFormularios";
import { ReceitaSchema } from '../Schemas';
import moment from "moment";
import { useParams } from 'react-router-dom';
import { ASSOCIACAO_UUID } from '../../../services/auth.service';
import {DeletarModalReceitas, CancelarModalReceitas} from "../../../utils/Modais";

export const ReceitaForm = props => {

    let {uuid} = useParams();

    const tabelaInicial = {
        tipos_receita: [],
        acoes_associacao: [],
        contas_associacao: []
    };

    const initial = {
        tipo_receita: "",
        acao_associacao: "",
        conta_associacao: "",
        data: "",
        valor: "",
        descricao: "",
    };

    const [tabelas, setTabelas] = useState(tabelaInicial);
    const [show, setShow] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [initialValue, setInitialValue] = useState(initial);
    const [receita, setReceita] = useState({});

    useEffect(() => {
        const carregaTabelas = async () => {
            getTabelasReceita()
            .then(response => {
                setTabelas(response.data);
            })
            .catch(error => {
                console.log(error);
            });

        };

        const buscaReceita = async () => {
            if (uuid) {
                getReceita(uuid)
                .then(response => {
                    const resp = response.data;
                    const init = {
                        tipo_receita: resp.tipo_receita.id,
                        acao_associacao: resp.acao_associacao.uuid,
                        conta_associacao: resp.conta_associacao.uuid,
                        data: resp.data,
                        valor: resp.valor ? new Number(resp.valor).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        }) : "",
                        descricao: resp.descricao,
                    }
                    setInitialValue(init);
                    setReceita(resp);
                })
                .catch(error => {
                    console.log(error);
                });
            }

        };
        carregaTabelas();
        buscaReceita();
    }, [])

    const onSubmit = async (values) => {
        values.valor = trataNumericos(values.valor);
        values.data = moment(values.data).format("YYYY-MM-DD");
        const payload = {
            ...values,
            associacao: localStorage.getItem(ASSOCIACAO_UUID)
        }

        if(uuid){
            await atualizar(uuid, payload);
        } else {
            await cadastrar(payload);
        }

        let path = `/lista-de-receitas`
        props.history.push(path)
    }

    const cadastrar = async (payload) => {
        try {
            const response = await criarReceita(payload)
            if (response.status === HTTP_STATUS.CREATED) {
                console.log("Operação realizada com sucesso!");
            } else {
                console.log(response)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const atualizar = async (uid, payload) => {
        try {
            const response = await atualizaReceita(uuid, payload)
            if (response.status === HTTP_STATUS.CREATED) {
                console.log("Operação realizada com sucesso!");
            } else {
                console.log(response)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const onCancelarTrue = () => {
        setShow(false);
        let path = `/lista-de-receitas`;
        props.history.push(path);
    }

    const onHandleClose = () => {
        setShow(false);
        setShowDelete(false);
    }

    const onShowModal = () => {
        setShow(true);
    }

    const onShowDeleteModal = () => {
        setShowDelete(true);
    }

    const onDeletarTrue = () => {
        deletarReceita(uuid)
        .then(response => {
            console.log("Receita deletada com sucesso.");
            setShowDelete(false);
            let path = `/lista-de-receitas`;
            props.history.push(path);
        })
        .catch(error => {
            console.log(error);
            alert("Um Problema Ocorreu. Entre em contato com a equipe para reportar o problema, obrigado.");
        });
    }

    return (
        <>
            <Formik
                initialValues={initialValue}
                validationSchema={ReceitaSchema}
                enableReinitialize={true}
                onSubmit={onSubmit}
            >
                {props => {
                    const {
                        values,
                        setFieldValue,
                    } = props;
                    return (
                        <form method="POST" id="receitaForm" onSubmit={props.handleSubmit}>
                            <div className="form-row">
                                <div className="col-12 col-md-6 mt-4">
                                    <label htmlFor="tipo_receita">Tipo de receita</label>
                                    <select
                                        id="tipo_receita"
                                        name="tipo_receita"
                                        value={props.values.tipo_receita}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        className="form-control"
                                    >
                                        {receita.tipo_receita
                                            ? null
                                            : <option>Selecione o tipo</option>}
                                        {tabelas.tipos_receita !== undefined && tabelas.tipos_receita.length > 0 ? (tabelas.tipos_receita.map(item => (
                                            <option key={item.id} value={item.id}>{item.nome}</option>
                                        ))): null}
                                    </select>
                                    {props.touched.tipo_receita && props.errors.tipo_receita &&
                                    <span className="span_erro text-danger mt-1"> {props.errors.tipo_receita}</span>}
                                </div>

                                <div className="col-12 col-md-3 mt-4">
                                    <label htmlFor="data">Data da receita</label>
                                    <DatePickerField
                                        name="data"
                                        id="data"
                                        value={values.data}
                                        onChange={setFieldValue}
                                        onBlur={props.handleBlur}
                                    />
                                    {props.touched.data && props.errors.data &&
                                    <span className="span_erro text-danger mt-1"> {props.errors.data}</span>}
                                </div>

                                <div className="col-12 col-md-3 mt-4">
                                    <label htmlFor="valor">Valor da receita</label>
                                    <CurrencyInput
                                        allowNegative={false}
                                        prefix='R$'
                                        decimalSeparator=","
                                        thousandSeparator="."
                                        value={props.values.valor}
                                        name="valor"
                                        id="valor"
                                        className="form-control"
                                        onChangeEvent={props.handleChange}/>
                                    {props.touched.valor && props.errors.valor &&
                                    <span className="span_erro text-danger mt-1"> {props.errors.valor}</span>}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="col-12 col-md-6 mt-4">
                                    <label htmlFor="descricao_receita">Descrição da receita</label>
                                    <textarea
                                        value={props.values.descricao}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        name="descricao"
                                        id="descricao"
                                        type="text"
                                        rows="4"
                                        cols="50"
                                        className="form-control"
                                        placeholder="Escreva a descrição da receita"/>
                                    {props.touched.descricao && props.errors.descricao &&
                                    <span className="span_erro text-danger mt-1"> {props.errors.descricao}</span>}
                                </div>
                                <div className="col-12 col-md-6 mt-4">

                                    <div className="row">
                                        <div className="col-12">

                                            <label htmlFor="acao_associacao">Ação</label>
                                            <select
                                                id="acao_associacao"
                                                name="acao_associacao"
                                                value={props.values.acao_associacao}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                className="form-control"
                                            >
                                                {receita.acao_associacao
                                                    ? null
                                                    : <option>Escolha uma ação</option>}
                                                {tabelas.acoes_associacao !== undefined && tabelas.acoes_associacao.length > 0 ? (tabelas.acoes_associacao.map((item, key) => (
                                                    <option key={key} value={item.uuid}>{item.nome}</option>
                                                ))): null}
                                            </select>
                                            {props.touched.acao_associacao && props.errors.acao_associacao &&
                                            <span className="span_erro text-danger mt-1"> {props.errors.acao_associacao}</span>}
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-12">
                                            <label htmlFor="conta_associacao">Tipo de conta</label>
                                            <select
                                                id="conta_associacao"
                                                name="conta_associacao"
                                                value={props.values.conta_associacao}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                className="form-control"
                                            >
                                                {receita.conta_associacao
                                                    ? null
                                                    : <option>Escolha uma conta</option>}
                                                {tabelas.contas_associacao !== undefined && tabelas.contas_associacao.length > 0 ? (tabelas.contas_associacao.map((item, key) => (
                                                    <option key={key} value={item.uuid}>{item.nome}</option>
                                                ))): null}
                                            </select>
                                            {props.touched.conta_associacao && props.errors.conta_associacao &&
                                            <span className="span_erro text-danger mt-1"> {props.errors.conta_associacao}</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-end pb-3" style={{marginTop: '60px'}}>
                                <button type="reset" onClick={onShowModal} className="btn btn btn-outline-success mt-2 mr-2">Cancelar</button>
                                {uuid
                                    ? <button type="reset" onClick={onShowDeleteModal} className="btn btn btn-danger mt-2 mr-2">Deletar</button> : null}
                                <button type="submit" className="btn btn-success mt-2">Salvar</button>
                            </div>
                        </form>
                    );
                }}
            </Formik>
            <section>
                <CancelarModalReceitas show={show}  handleClose={onHandleClose} onCancelarTrue={onCancelarTrue}/>
            </section>
            {uuid
                ?
                <DeletarModalReceitas show={showDelete} handleClose={onHandleClose} onDeletarTrue={onDeletarTrue}/>
                : null
            }
        </>
    );
}