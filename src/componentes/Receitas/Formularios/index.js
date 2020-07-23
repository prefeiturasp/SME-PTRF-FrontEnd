import React, {useEffect, useState} from "react";
import HTTP_STATUS from "http-status-codes";
import {Formik} from 'formik';
import {DatePickerField} from '../../DatePickerField'
import CurrencyInput from 'react-currency-input';
import {
    criarReceita,
    atualizaReceita,
    deletarReceita,
    getReceita,
    getTabelasReceita,
    getRepasse
} from '../../../services/Receitas.service';
import {round, trataNumericos, periodoFechado} from "../../../utils/ValidacoesAdicionaisFormularios";
import {ReceitaSchema} from '../Schemas';
import moment from "moment";
import {useParams} from 'react-router-dom';
import {ASSOCIACAO_UUID} from '../../../services/auth.service';
import {DeletarModalReceitas, CancelarModalReceitas, PeriodoFechado, ErroGeral} from "../../../utils/Modais";
import Loading from "../../../utils/Loading";
import api from "../../../services/Api";
import {Login} from "../../../paginas/Login";

export const ReceitaForm = props => {

    let {origem} = useParams();
    let {uuid} = useParams();
    const [loading, setLoading] = useState(true)

    const tabelaInicial = {
        tipos_receita: [],
        acoes_associacao: [],
        contas_associacao: []
    };

    const initial = {
        tipo_receita: "",
        detalhe_tipo_receita: "",
        detalhe_outros: "",
        categoria_receita: "",
        acao_associacao: "",
        conta_associacao: "",
        data: "",
        valor: "",
        referencia_devolucao: "",

    };

    const [tabelas, setTabelas] = useState(tabelaInicial);
    const [show, setShow] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showPeriodoFechado, setShowPeriodoFechado] = useState(false);
    const [showErroGeral, setShowErroGeral] = useState(false);
    const [initialValue, setInitialValue] = useState(initial);
    const [receita, setReceita] = useState({});
    const [readOnlyValor, setReadOnlyValor] = useState(false);
    const [readOnlyClassificacaoReceita, setreadOnlyClassificacaoReceita] = useState(false);

    const [readOnlyBtnAcao, setReadOnlyBtnAcao] = useState(false);
    const [readOnlyCampos, setReadOnlyCampos] = useState(false);
    const [repasse, setRepasse] = useState({});

    const [idxTipoDespesa, setIdxTipoDespesa] = useState(0);

    useEffect(() => {
        const carregaTabelas = async () => {
            getTabelasReceita().then(response => {
                setTabelas(response.data);
            }).catch(error => {
                console.log(error);
            });
        };

        const buscaReceita = async () => {
            if (uuid) {
                getReceita(uuid).then(response => {
                    const resp = response.data;

                    console.log("Busca receita ", resp)
                    const init = {
                        tipo_receita: resp.tipo_receita.id,
                        detalhe_tipo_receita: resp.detalhe_tipo_receita,
                        detalhe_outros: resp.detalhe_outros,
                        categoria_receita: resp.categoria_receita,
                        acao_associacao: resp.acao_associacao.uuid,
                        conta_associacao: resp.conta_associacao.uuid,
                        referencia_devolucao: resp.referencia_devolucao,
                        data: resp.data,
                        valor: resp.valor ? new Number(resp.valor).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        }) : "",
                    }
                    setInitialValue(init);
                    setReceita(resp);
                    periodoFechado(resp.data, setReadOnlyBtnAcao, setShowPeriodoFechado, setReadOnlyCampos, onShowErroGeral)
                }).catch(error => {
                    console.log(error);
                });
            }
        };
        carregaTabelas();
        buscaReceita();
        setLoading(false);
    }, [])

    useEffect(() => {
        if (tabelas.tipos_receita.length > 0 && initialValue.tipo_receita !== undefined) {
            setaDetalhesTipoReceita(initialValue.tipo_receita);
        }
    }, [tabelas, initialValue.tipo_receita])


    const onSubmit = async (values) => {

        console.log("Onsubmit ", values)

        // Removendo e_devolucao{

        if (!verificaSeDevolucao(values.tipo_receita)){
            delete values.referencia_devolucao
        }else if (uuid){

            if (values.referencia_devolucao && values.referencia_devolucao.uuid){
                values.referencia_devolucao = values.referencia_devolucao.uuid
            }

        }
        values.valor = round(trataNumericos(values.valor), 2);
        values.data = moment(values.data).format("YYYY-MM-DD");
        const payload = {
            ...values,
            associacao: localStorage.getItem(ASSOCIACAO_UUID),
            detalhe_tipo_receita: values.detalhe_tipo_receita && values.detalhe_tipo_receita.id !== undefined ? values.detalhe_tipo_receita.id : values.detalhe_tipo_receita
        }
        setLoading(true);
        if (uuid) {
            await atualizar(uuid, payload);
        } else {
            await cadastrar(payload);
        }
        getPath();
        setLoading(false);
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
                console.log('UPDATE ==========>>>>>>', response)
            }
        } catch (error) {
            console.log(error)
        }
    };

    const onCancelarTrue = () => {
        setShow(false);
        getPath();
    }

    const onHandleClose = () => {
        setShow(false);
        setShowDelete(false);
        setShowPeriodoFechado(false);
        setShowErroGeral(false);
    }

    const onShowModal = () => {
        setShow(true);
    }

    const onShowDeleteModal = () => {
        setShowDelete(true);
    }

    const onDeletarTrue = () => {
        deletarReceita(uuid).then(response => {
            console.log("Crédito deletado com sucesso.");
            setShowDelete(false);
            getPath();
        }).catch(error => {
            console.log(error);
            alert("Um Problema Ocorreu. Entre em contato com a equipe para reportar o problema, obrigado.");
        });
    }

    const onShowErroGeral = () => {
        setShowErroGeral(true);
    }

    const getPath = () => {
        let path;
        if (origem === undefined) {
            path = `/lista-de-receitas`;
        } else {
            path = `/detalhe-das-prestacoes`;
        }
        window.location.assign(path)
    };

    const setaRepasse = async (values)=>{
        //debugger;

        let local_repasse;
        if (values && values.acao_associacao && values.data) {
            let data_receita = moment(new Date(values.data), "YYYY-MM-DD").format("DD/MM/YYYY");
            if (uuid) {
                try {
                    local_repasse = await getRepasse(values.acao_associacao, data_receita, uuid);
                    setRepasse(local_repasse)
                } catch (e) {
                    console.log("Erro ao obter o repasse ", e)
                }

            } else {
                try {
                    local_repasse = await getRepasse(values.acao_associacao, data_receita);
                    setRepasse(local_repasse)
                } catch (e) {
                    console.log("Erro ao obter o repasse ", e)
                }

            }
            return local_repasse;
        }
    };

    const getClassificacaoReceita = (id_tipo_receita, setFieldValue) => {

        let qtdeAceitaClassificacao = [];

        if (id_tipo_receita) {

            tabelas.categorias_receita.map((item, index) => {

                let id_categoria_receita_lower = item.id.toLowerCase();
                let aceitaClassificacao = eval('tabelas.tipos_receita.find(element => element.id === Number(id_tipo_receita)).aceita_' + id_categoria_receita_lower);

                qtdeAceitaClassificacao.push(aceitaClassificacao);

                if (aceitaClassificacao) {
                    setFieldValue("categoria_receita", item.id);
                    setreadOnlyClassificacaoReceita(true);
                }
            });

            let resultado = qtdeAceitaClassificacao.filter((value) => {
                return value === true;
            }).length;

            if (resultado > 1) {
                setFieldValue("categoria_receita", "");
                setreadOnlyClassificacaoReceita(false);
            }
        }
    }

    const setaDetalhesTipoReceita = (id_tipo_receita) => {
        if (id_tipo_receita) {
            tabelas.tipos_receita.map((item, index) => {
                if (item.id == id_tipo_receita && index != idxTipoDespesa) {
                    setIdxTipoDespesa(index)
                    const atuReceita = receita
                    atuReceita.detalhe_tipo_receita = null
                    setReceita(atuReceita)
                }
            })
        }
    }

    const getDisplayOptionClassificacaoReceita = (id_categoria_receita, id_tipo_receita) => {

        let id_categoria_receita_lower = id_categoria_receita.toLowerCase();
        let aceitaClassificacao = eval('tabelas.tipos_receita.find(element => element.id === Number(id_tipo_receita)).aceita_' + id_categoria_receita_lower);

        if (!aceitaClassificacao) {
            return "none"
        } else {
            return "block"
        }
    }

    const getOpcoesDetalhesTipoReceita = (values) => {
        if (tabelas.tipos_receita[idxTipoDespesa] !== undefined && tabelas.tipos_receita[idxTipoDespesa].detalhes_tipo_receita !== undefined && tabelas.tipos_receita[idxTipoDespesa].detalhes_tipo_receita.length > 0) {
            return tabelas.tipos_receita[idxTipoDespesa].detalhes_tipo_receita.map(item => {
                return (
                    <option key={item.id} value={item.id}>{item.nome}</option>
                )
            })
        }
    }

    const temOpcoesDetalhesTipoReceita = (values) => {
        if (tabelas.tipos_receita[idxTipoDespesa] !== undefined && tabelas.tipos_receita[idxTipoDespesa].detalhes_tipo_receita !== undefined) {
            return (tabelas.tipos_receita[idxTipoDespesa].detalhes_tipo_receita.length > 0)
        }
        return false
    }

    const retornaClassificacaoReceita = (values, setFieldValue) => {

        if (tabelas.categorias_receita !== undefined && tabelas.categorias_receita.length > 0 && values.acao_associacao && values.tipo_receita && Object.entries(repasse).length > 0) {

            return tabelas.categorias_receita.map((item, index) => {

                let id_categoria_receita_lower = item.id.toLowerCase();

                // Quando a flag e_repasse for true eu checo também se o valor da classificacao_receita é !== "0.00"
                if (tabelas.tipos_receita.find(element => element.id === Number(values.tipo_receita)).e_repasse) {

                    if (tabelas.tipos_receita && tabelas.tipos_receita.find(element => element.id === Number(values.tipo_receita)) && eval('repasse.valor_' + id_categoria_receita_lower) !== "0.00") {
                        return (
                            <option
                                style={{display: getDisplayOptionClassificacaoReceita(item.id, values.tipo_receita)}}
                                key={item.id}
                                value={item.id}
                            >
                                {item.nome}
                            </option>
                        );
                    }

                }else{
                    if ( tabelas.tipos_receita && tabelas.tipos_receita.find(element => element.id === Number(values.tipo_receita))){

                        return (
                            <option
                                style={{display: getDisplayOptionClassificacaoReceita(item.id, values.tipo_receita)}}
                                key={item.id}
                                value={item.id}
                            >
                                {item.nome}
                            </option>
                        );
                    }
                }
            })
        }else{
            if (tabelas.categorias_receita && tabelas.categorias_receita.length > 0){
                return tabelas.categorias_receita.map((item)=>{
                    return (
                        <option
                            key={item.id}
                            value={item.id}
                        >
                            {item.nome}
                        </option>
                    );
                })
            }
        }
    };

    const validateFormReceitas = async (values) => {
        const errors = {};


        // Verifica se é devolucao

        // if (verificaSeDevolucao(values.tipo_receita)  && !values.referencia_devolucao){
        //     errors.referencia_devolucao = "Campo périodo é obrigatório"
        // }

        // Verifica período fechado para a receita
        if (values.data) {
            await periodoFechado(values.data, setReadOnlyBtnAcao, setShowPeriodoFechado, setReadOnlyCampos, onShowErroGeral)
        }

        let e_repasse_tipo_receita = false;
        let e_repasse_acao = "Escolha uma ação";

        tabelas.tipos_receita.map((item) => {
            if (item.id === Number(values.tipo_receita)) {
                e_repasse_tipo_receita = item.e_repasse
            }
        })

        e_repasse_acao = values.acao_associacao;

        let hoje = moment(new Date());
        let data_digitada = moment(values.data);

        if (data_digitada > hoje){
            errors.data = "Data do crédito não pode ser maior que a data de hoje"
        }

        if (e_repasse_tipo_receita !== false && e_repasse_acao !== "" && e_repasse_acao !== "Escolha uma ação" && values.data) {

            try {

                let repasse = await setaRepasse(values)

                let data_digitada = moment(values.data);
                let data_inicio = moment(repasse.periodo.data_inicio_realizacao_despesas);
                let data_fim = repasse.periodo.data_fim_realizacao_despesas;

                if (data_fim === null) {
                    data_fim = moment(new Date());
                } else {
                    data_fim = moment(repasse.periodo.data_fim_realizacao_despesas);
                }

                if (data_digitada > data_fim || data_digitada < data_inicio) {
                    errors.data = `Data inválida. A data tem que ser entre ${data_inicio.format("DD/MM/YYYY")} e ${data_fim.format("DD/MM/YYYY")}`;
                }

                let id_categoria_receita_lower = values.categoria_receita.toLowerCase();

                let valor_da_receita = eval('repasse.valor_' + id_categoria_receita_lower);

                const init = {
                    ...initialValue,
                    tipo_receita: values.tipo_receita,
                    detalhe_tipo_receita: values.detalhe_tipo_receita,
                    detalhe_outros: values.detalhe_outros,
                    data: values.data,
                    valor: Number(valor_da_receita),
                    acao_associacao: values.acao_associacao,
                    conta_associacao: repasse.conta_associacao.uuid,
                    categoria_receita: values.categoria_receita,
                    referencia_devolucao: values.referencia_devolucao,

                }
                setInitialValue(init);
                setReadOnlyValor(true);
            } catch (e) {
                console.log("Erro: ", e)
                errors.acao_associacao = 'Não existem repasses pendentes para a Associação nesta ação';
            }
        } else {
            setReadOnlyValor(false)
        }

        return errors;
    };

    const verificaSeDevolucao = (tipoDeReceitaId) =>{

        console.log("tipoDeCredito ", tipoDeReceitaId);
        let e_devolucao = undefined;

        //debugger;

        if (tipoDeReceitaId){
            let e_devolucao = tabelas.tipos_receita.find(element=> element.id === Number(tipoDeReceitaId))
            console.log("e_devolucao ", e_devolucao);
            if (e_devolucao){
                return e_devolucao.e_devolucao
            }else {
                return e_devolucao
            }

        }else {
            return e_devolucao
        }
    };

    return (
        <>
            <Formik
                initialValues={initialValue}
                validationSchema={ReceitaSchema}
                enableReinitialize={true}
                validateOnBlur={true}
                onSubmit={onSubmit}
                validate={validateFormReceitas}
            >
                {props => {
                    const {
                        values,
                        setFieldValue,
                    } = props;
                    return (
                        <form method="POST" id="receitaForm" onSubmit={props.handleSubmit}>
                            <div className="form-row">
                                {/*Tipo de Receita */}
                                <div className="col-12 col-md-6 mt-4">
                                    <label htmlFor="tipo_receita">Tipo do crédito</label>
                                    <select
                                        id="tipo_receita"
                                        name="tipo_receita"
                                        disabled={readOnlyCampos}
                                        value={props.values.tipo_receita}
                                        onChange={(e) => {
                                            props.handleChange(e);
                                            //setaRepasse(values);
                                            getClassificacaoReceita(e.target.value, setFieldValue);
                                            setaDetalhesTipoReceita(e.target.value);
                                        }
                                        }
                                        onBlur={props.handleBlur}
                                        className="form-control"
                                    >
                                        {receita.tipo_receita
                                            ? null
                                            : <option value="">Selecione o tipo</option>}
                                        {tabelas.tipos_receita !== undefined && tabelas.tipos_receita.length > 0 ? (tabelas.tipos_receita.map(item => (
                                            <option key={item.id} value={item.id}>{item.nome}</option>
                                        ))) : null}
                                    </select>
                                    {props.touched.tipo_receita && props.errors.tipo_receita &&
                                    <span
                                        className="span_erro text-danger mt-1"> {props.errors.tipo_receita}</span>}
                                </div>
                                {/*Fim Tipo de Receita */}

                                {/*Detalhamento do Crédito */}
                                <div className="col-12 col-md-6 mt-4">
                                    <label htmlFor="tipo_receita">Detalhamento do crédito</label>
                                    {temOpcoesDetalhesTipoReceita(props.values) ?
                                        <select
                                            id="detalhe_tipo_receita"
                                            name="detalhe_tipo_receita"
                                            disabled={readOnlyCampos}
                                            value={props.values.detalhe_tipo_receita ? props.values.detalhe_tipo_receita.id : ""}
                                            onChange={(e) => {
                                                props.handleChange(e);
                                            }
                                            }
                                            onBlur={props.handleBlur}
                                            className="form-control"
                                        >
                                            {receita.detalhe_tipo_receita
                                                ? null
                                                : <option value="">Selecione o detalhamento</option>}
                                            {getOpcoesDetalhesTipoReceita(props.values)}

                                        </select>
                                        :
                                        <input
                                            value={props.values.detalhe_outros}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            name="detalhe_outros" id="detalhe_outros" type="text"
                                            className="form-control"
                                            placeholder="Digite o detalhamento"
                                            disabled={readOnlyCampos}
                                        />

                                    }
                                    {props.touched.detalhe_tipo_receita && props.errors.detalhe_tipo_receita &&
                                    <span
                                        className="span_erro text-danger mt-1"> {props.errors.detalhe_tipo_receita}</span>}
                                </div>
                                {/*Fim Detalhamento do Crédito */}

                                {/*Periodo Devolução */}

                                {verificaSeDevolucao(props.values.tipo_receita) &&
                                    <div className="col-12 col-md-6 mt-4">
                                        <label htmlFor="referencia_devolucao">Período de referência da devolução</label>
                                        <select
                                            id="referencia_devolucao"
                                            name="referencia_devolucao"
                                            value={props.values.referencia_devolucao  && props.values.referencia_devolucao.uuid ? props.values.referencia_devolucao.uuid : props.values.referencia_devolucao}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            className="form-control"
                                            disabled={readOnlyValor || readOnlyCampos}
                                        >
                                            {receita.referencia_devolucao
                                                ? null
                                                : <option value="">Selecione um período</option>}
                                            {tabelas.periodos !== undefined && tabelas.periodos.length > 0 ? (tabelas.periodos.map((item, key) => (
                                                <option key={key} value={item.uuid}>{item.referencia_por_extenso}</option>
                                            ))) : null}
                                        </select>
                                        {props.touched.referencia_devolucao && props.errors.referencia_devolucao && <span className="span_erro text-danger mt-1"> {props.errors.referencia_devolucao}</span>}
                                    </div>
                                }


                                {/*Periodo Devolução */}

                                {/*Data da Receita */}
                                <div className="col-12 col-md-6 mt-4">
                                    <label htmlFor="data">Data do crédito</label>
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
                                {/*Fim Data da Receita */}

                                {/*Tipo de Conta */}
                                <div className="col-12 col-md-6 mt-4">
                                    <label htmlFor="conta_associacao">Tipo de conta</label>
                                    <select
                                        id="conta_associacao"
                                        name="conta_associacao"
                                        value={props.values.conta_associacao}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        className="form-control"
                                        disabled={readOnlyValor || readOnlyCampos}
                                    >
                                        {receita.conta_associacao
                                            ? null
                                            : <option>Escolha uma conta</option>}
                                        {tabelas.contas_associacao !== undefined && tabelas.contas_associacao.length > 0 ? (tabelas.contas_associacao.map((item, key) => (
                                            <option key={key} value={item.uuid}>{item.nome}</option>
                                        ))) : null}
                                    </select>
                                    {props.touched.conta_associacao && props.errors.conta_associacao &&
                                    <span
                                        className="span_erro text-danger mt-1"> {props.errors.conta_associacao}</span>}
                                </div>
                                {/*Fim Tipo de Conta */}

                                {/*Ação*/}
                                <div className="col-12 col-md-6 mt-4">
                                    <label htmlFor="acao_associacao">Ação</label>
                                    <select
                                        disabled={readOnlyCampos}
                                        id="acao_associacao"
                                        name="acao_associacao"
                                        value={props.values.acao_associacao}
                                        onChange={(e) => {
                                            props.handleChange(e);
                                            setaRepasse(values)
                                        }
                                        }
                                        onBlur={props.handleBlur}
                                        className="form-control"
                                    >
                                        {receita.acao_associacao
                                            ? null
                                            : <option value="">Escolha uma ação</option>}
                                        {tabelas.acoes_associacao !== undefined && tabelas.acoes_associacao.length > 0 ? (tabelas.acoes_associacao.map((item, key) => (
                                            <option key={key} value={item.uuid}>{item.nome}</option>
                                        ))) : null}
                                    </select>
                                    {props.touched.acao_associacao && props.errors.acao_associacao &&
                                    <span
                                        className="span_erro text-danger mt-1"> {props.errors.acao_associacao}</span>}
                                </div>
                                {/*Fim Ação*/}

                                {/*Classificação do Crédito*/}
                                <div className="col-12 col-md-6 mt-4">
                                    <label htmlFor="categoria_receita">Classificação do crédito</label>

                                    <select
                                        id="categoria_receita"
                                        name="categoria_receita"
                                        value={props.values.categoria_receita}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        className="form-control"
                                        disabled={readOnlyClassificacaoReceita || readOnlyCampos}
                                    >
                                        {receita.categorias_receita ? null :
                                            <option key={0} value="">Escolha a classificação</option>}

                                        {retornaClassificacaoReceita(props.values, setFieldValue)}

                                    </select>

                                    {props.touched.categoria_receita && props.errors.categoria_receita && <span
                                        className="span_erro text-danger mt-1"> {props.errors.categoria_receita}</span>}
                                </div>
                                {/*Fim Classificação do Crédito*/}

                                {/*Valor Total do Crédito */}
                                <div className="col-12 col-md-6 mt-4">
                                    <label htmlFor="valor">Valor total do crédito</label>
                                    <CurrencyInput
                                        disabled={readOnlyCampos}
                                        allowNegative={false}
                                        prefix='R$'
                                        decimalSeparator=","
                                        thousandSeparator="."
                                        value={props.values.valor}
                                        name="valor"
                                        id="valor"
                                        className="form-control"
                                        onChangeEvent={props.handleChange}
                                        readOnly={readOnlyValor}
                                    />
                                    {props.touched.valor && props.errors.valor &&
                                    <span className="span_erro text-danger mt-1"> {props.errors.valor}</span>}
                                </div>
                                {/*Fim Valor Total do Crédito */}
                            </div>

                            {/*Botões*/}

                            <div className="d-flex justify-content-end pb-3" style={{marginTop: '60px'}}>
                                <button type="reset" onClick={onShowModal}
                                        className="btn btn btn-outline-success mt-2 mr-2">Voltar
                                </button>
                                {uuid
                                    ?
                                    <button disabled={readOnlyBtnAcao} type="reset" onClick={onShowDeleteModal}
                                            className="btn btn btn-danger mt-2 mr-2">Deletar</button> : null}
                                <button disabled={readOnlyBtnAcao} type="submit"
                                        className="btn btn-success mt-2">Salvar
                                </button>
                            </div>
                            {/*Fim Botões*/}

                        </form>
                    );
                }}
            </Formik>
            <section>
                <CancelarModalReceitas show={show} handleClose={onHandleClose} onCancelarTrue={onCancelarTrue}/>
            </section>
            {uuid
                ?
                <DeletarModalReceitas show={showDelete} handleClose={onHandleClose}
                                      onDeletarTrue={onDeletarTrue}/>
                : null
            }
            <section>
                <PeriodoFechado show={showPeriodoFechado} handleClose={onHandleClose}/>
            </section>
            <section>
                <ErroGeral show={showErroGeral} handleClose={onHandleClose}/>
            </section>
        </>
    );
}