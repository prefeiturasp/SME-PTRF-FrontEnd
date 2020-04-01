import React, {useEffect, useState} from "react";
import HTTP_STATUS from "http-status-codes";
import { Formik } from 'formik';
import { DatePickerField } from '../../DatePickerField'
import NumberFormat from 'react-number-format';
import { getTabelasReceita, criarReceita } from '../../../services/Receitas.service';
import { trataNumericos } from "../../../utils/ValidacoesAdicionaisFormularios";
import { ReceitaSchema } from '../Schemas';
import moment from "moment";


export const ReceitaForm = props => {
    const tabelaInicial = {
        tipos_receita: [],
        acoes_associacao: [],
        contas_associacao: []
    };

    const [tabelas, setTabelas] = useState(tabelaInicial);

    useEffect(() => {
        const carregaTabelas = async () => {
            const resp = await getTabelasReceita();
            console.log(resp)
            setTabelas(resp);
        };
        carregaTabelas();
    }, [])

    const getInitialValues = () => {
        const initial = {
            tipo_receita: "",
            acao_associacao: "",
            conta_associacao: "",
            data: "",
            valor: "",
            descricao: "",
        }
        return initial
    }

    const onSubmit = async (values) => {
        values.valor = trataNumericos(values.valor);
        values.data = moment(values.data).format("YYYY-MM-DD");
        const payload = {
            ...values,
            // Modificar quando o login estiver pronto
            // Usando a associacao que está no ambiente de dev
            associacao: "52ad4766-3515-4de9-8ab6-3b12078f8f14"
        }

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
        let path = `/dashboard`
        props.history.push(path)
    }

    return (
        <>  
            <Formik
                initialValues={getInitialValues()}
                validationSchema={ReceitaSchema}
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
                                        <option>Selecione o tipo</option>
                                        {tabelas.tipos_receita.length > 0 ? (tabelas.tipos_receita.map(item => (
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
                                    <NumberFormat
                                        value={props.values.valor}
                                        thousandSeparator={'.'}
                                        decimalSeparator={','}
                                        decimalScale={2}
                                        prefix={'R$'}
                                        allowNegative={false}
                                        name="valor"
                                        id="valor"
                                        className="form-control"
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                    />
                                    {props.touched.valor && props.errors.valor &&
                                    <span className="span_erro text-danger mt-1"> {props.errors.valor}</span>}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="col-12 col-md-6 mt-4">
                                    <label htmlFor="descricao_receita">Descrição da receita</label>
                                    <textarea
                                        value={props.values.descricao_receita}
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
                                    <div className="form-row">
                                        <label htmlFor="acao_associacao">Ação</label>
                                        <select
                                                id="acao_associacao"
                                                name="acao_associacao"
                                                value={props.values.acao_associacao}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                className="form-control"
                                            >
                                                <option>Escolha uma ação</option>
                                                {tabelas.acoes_associacao.length > 0 ? (tabelas.acoes_associacao.map((item, key) => (
                                                    <option key={key} value={item.uuid}>{item.nome}</option>
                                                ))): null}
                                        </select>
                                        {props.touched.acao_associacao && props.errors.acao_associacao &&
                                        <span className="span_erro text-danger mt-1"> {props.errors.acao_associacao}</span>}
                                    </div>
                                    <div className="form-row">
                                        <label htmlFor="conta_associacao">Tipo de conta</label>
                                        <select
                                                id="conta_associacao"
                                                name="conta_associacao"
                                                value={props.values.conta_associacao}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                className="form-control"
                                            >
                                                <option>Escolha uma conta</option>
                                                {tabelas.contas_associacao.length > 0 ? (tabelas.contas_associacao.map((item, key) => (
                                                    <option key={key} value={item.uuid}>{item.nome}</option>
                                                ))): null}
                                        </select>
                                        {props.touched.conta_associacao && props.errors.conta_associacao &&
                                        <span className="span_erro text-danger mt-1"> {props.errors.conta_associacao}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-end pb-3" style={{marginTop: '60px'}}>
                                <button type="reset" onClick={props.handleReset} className="btn btn btn-outline-success mt-2 mr-2">Cancelar</button>
                                <button type="submit" className="btn btn-success mt-2">Salvar</button>
                            </div>
                        </form>
                    );
                }}
            </Formik>
        </>
        );
}