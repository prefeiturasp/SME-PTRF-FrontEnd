import React, {useCallback, useEffect, useState} from "react";
import HTTP_STATUS from "http-status-codes";
import {Formik} from 'formik';
import {DatePickerField} from '../../../Globais/DatePickerField'
import CurrencyInput from 'react-currency-input';
import {
    criarReceita,
    atualizaReceita,
    deletarReceita,
    getReceita,
    getTabelasReceitaReceita,
    getRepasses
} from '../../../../services/escolas/Receitas.service';
import {deleteDespesa, getDespesa} from "../../../../services/escolas/Despesas.service";
import {round, trataNumericos, periodoFechado, comparaObjetos} from "../../../../utils/ValidacoesAdicionaisFormularios";
import {ReceitaSchema} from '../Schemas';
import moment from "moment";
import {useParams} from 'react-router-dom';
import {ASSOCIACAO_UUID} from '../../../../services/auth.service';
import {PeriodoFechado, ErroGeral, SalvarReceita, AvisoTipoReceita} from "../../../../utils/Modais";
import {ModalDeletarReceita} from "../ModalDeletarReceita";
import {CancelarModalReceitas} from "../CancelarModalReceitas";
import {ModalReceitaConferida} from "../ModalReceitaJaConferida";
import {ModalSelecionaRepasse} from "../ModalSelecionaRepasse";
import {visoesService} from "../../../../services/visoes.service";
import "../receitas.scss"


export const ReceitaForm = () => {

    let {origem} = useParams();
    let {uuid} = useParams();
    const [loading, setLoading] = useState(true);

    const [redirectTo, setRedirectTo] = useState('');
    const [uuid_receita, setUuidReceita] = useState(null);

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
        saida_do_recurso: "",
    };

    const [tabelas, setTabelas] = useState(tabelaInicial);
    const [show, setShow] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showPeriodoFechado, setShowPeriodoFechado] = useState(false);
    const [showErroGeral, setShowErroGeral] = useState(false);
    const [showCadastrarSaida, setShowCadastrarSaida] = useState(false);
    const [showEditarSaida, setShowEditarSaida] = useState(false);
    const [showAvisoTipoReceita, setShowAvisoTipoReceita] = useState(false);
    const [showSalvarReceita, setShowSalvarReceita] = useState(false);
    const [initialValue, setInitialValue] = useState(initial);
    const [objetoParaComparacao, setObjetoParaComparacao] = useState({});
    const [receita, setReceita] = useState({});
    const [readOnlyValor, setReadOnlyValor] = useState(false);
    const [readOnlyClassificacaoReceita, setreadOnlyClassificacaoReceita] = useState(false);
    const [readOnlyAcaoAssociacaoReceita, setreadOnlyAcaoAssociacaoReceita] = useState(false);
    const [readOnlyContaAssociacaoReceita, setreadOnlyContaAssociacaoReceita] = useState(false);
    const [readOnlyTipoReceita, setreadOnlyTipoReceita] = useState(false);

    const [readOnlyBtnAcao, setReadOnlyBtnAcao] = useState(false);
    const [readOnlyCampos, setReadOnlyCampos] = useState(false);
    const [repasse, setRepasse] = useState({});

    const [idxTipoDespesa, setIdxTipoDespesa] = useState(0);

    const [showReceitaConferida, setShowReceitaConferida] = useState(false);

    const [repasses, setRepasses] = useState([]);
    const [showSelecionaRepasse, setShowSelecionaRepasse] = useState(false);

    const [msgDeletarReceita, setmsgDeletarReceita] = useState('<p>Tem certeza que deseja excluir este crédito? A ação não poderá ser desfeita.</p>')
    const [msgAvisoTipoReceita, setMsgAvisoTipoReceita] = useState('');

    const [exibeModalSalvoComSucesso, setExibeModalSalvoComSucesso] = useState(true)

    const [uuid_despesa, setUuidDespesa] = useState('')

    const carregaTabelas = useCallback(async ()=>{
        let tabelas_receitas = await getTabelasReceitaReceita()
        setTabelas(tabelas_receitas)
    }, [])

    useEffect(()=>{
        carregaTabelas()
    }, [carregaTabelas]);

    const showBotaoCadastrarSaida = useCallback((uuid_acao_associacao, values) => {
        if (tabelas.acoes_associacao !== undefined && tabelas.acoes_associacao.length > 0 && uuid_acao_associacao && values && values.tipo_receita) {
            let e_recurso_proprio = tabelas.tipos_receita.find(element => element.id === Number(values.tipo_receita)).e_recursos_proprios
            let acao = tabelas.acoes_associacao.find(item => item.uuid === uuid_acao_associacao)
            if (acao && acao.e_recursos_proprios && e_recurso_proprio && !values.saida_do_recurso) {
                setShowCadastrarSaida(true);
            }
            return acao;
        } else {
            setShowCadastrarSaida(false);
            return false
        }
    }, [tabelas])

    const buscaReceita = useCallback(async ()=>{
        if (uuid) {
            getReceita(uuid).then(async response => {
                const resp = response.data;

                if (resp && resp.saida_do_recurso && resp.saida_do_recurso.uuid){
                    setShowEditarSaida(true)
                    setShowCadastrarSaida(false)
                    setUuidDespesa(resp.saida_do_recurso.uuid)
                }

                const init = {
                    tipo_receita: resp.tipo_receita.id,
                    detalhe_tipo_receita: resp.detalhe_tipo_receita,
                    detalhe_outros: resp.detalhe_outros,
                    categoria_receita: resp.categoria_receita,
                    conferido: resp.conferido,
                    acao_associacao: resp.acao_associacao.uuid,
                    conta_associacao: resp.conta_associacao.uuid,
                    referencia_devolucao: resp.referencia_devolucao,
                    data: resp.data,
                    valor: resp.valor ? Number(resp.valor).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }) : "",
                };
                setObjetoParaComparacao(init);
                setInitialValue(init);
                setReceita(resp);
                if (resp && resp.acao_associacao && resp.acao_associacao.uuid){
                    setUuidReceita(uuid)
                    showBotaoCadastrarSaida(resp.acao_associacao.uuid, init)
                }
                periodoFechado(resp.data, setReadOnlyBtnAcao, setShowPeriodoFechado, setReadOnlyCampos, onShowErroGeral)
                getAvisoTipoReceita(resp.tipo_receita.id);
                if (resp.repasse !== null) {
                    setRepasse(resp.repasse);
                    setReadOnlyValor(true);
                    setreadOnlyClassificacaoReceita(true);
                    setreadOnlyTipoReceita(true);
                }
            }).catch(error => {
                console.log(error);
            });
        }
    }, [uuid, showBotaoCadastrarSaida]);

    useEffect(()=>{
        buscaReceita()
    }, [buscaReceita])

    useEffect(() => {
        if (tabelas.tipos_receita.length > 0 && initialValue.tipo_receita !== undefined) {
            setaDetalhesTipoReceita(initialValue.tipo_receita);
        }
    }, [tabelas, initialValue.tipo_receita]);

    const servicoDeVerificacoes = (e, values, errors) =>{
        // Validando se receita é conferida
        if (Object.entries(errors).length === 0 ) {
            if (values.conferido) {
                e.preventDefault();
                setShowReceitaConferida(true)
            }
        }
    };

    const onSubmit = async (values) => {
        // Validando e ou removendo e_devolucao
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
            detalhe_tipo_receita: values.detalhe_tipo_receita && values.detalhe_tipo_receita.id !== undefined ? values.detalhe_tipo_receita.id : values.detalhe_tipo_receita,
        };

        if (Object.keys(repasse).length !== 0) {
            payload['repasse'] = repasse.uuid;
        }

        setLoading(true);

        if (uuid) {
            await atualizar(uuid, payload).then(response => {
                if (exibeModalSalvoComSucesso){
                    setShowSalvarReceita(true);
                }else {
                    getPath()
                }
            });
        } else {
            cadastrar(payload).then(response => {
                if (exibeModalSalvoComSucesso){
                    setShowSalvarReceita(true);
                    setUuidReceita(response);
                }else {
                    setUuidReceita(response);
                    getPath(response)
                }
            });
        }
        setLoading(false);
    };

    const cadastrar = async (payload) => {
        try {
            const response = await criarReceita(payload);
            if (response.status === HTTP_STATUS.CREATED) {
                console.log("Operação realizada com sucesso!");
                return response.data.uuid;
            } else {
                console.log(response)
            }
        } catch (error) {
            console.log(error)
        }
    };

    const atualizar = async (uuid, payload) => {
        try {
            const response = await atualizaReceita(uuid, payload);
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
        setRedirectTo('');
        getPath();
    };

    const onHandleClose = () => {
        setShow(false);
        setShowDelete(false);
        setShowPeriodoFechado(false);
        setShowErroGeral(false);
        setShowAvisoTipoReceita(false);
        
    };

    const fecharSalvarCredito = () => {
        setShowSalvarReceita(false);
        getPath();
    }

    const onShowModal = () => {
        setShow(true);
    };

    const onShowDeleteModal = () => {

        if (receita && receita.saida_do_recurso && receita.saida_do_recurso.uuid){
            setmsgDeletarReceita('<p>Ao excluir este crédito você excluirá também a saída do recurso vinculada. Tem certeza que deseja excluir ambos? A ação não poderá ser desfeita.</p>')
        }
        setShowDelete(true);
    };

    const onDeletarTrue = async () => {

        if (receita && receita.saida_do_recurso && receita.saida_do_recurso.uuid){
            try {
                await deleteDespesa(receita.saida_do_recurso.uuid)
                console.log("Despesa deletada com sucesso.");
            }catch (e) {
                console.log("Erro ao excluir despesa ", e);
            }
        }

        try {
            await deletarReceita(uuid)
            console.log("Receita deletada com sucesso.");
            setShowDelete(false);
            getPath();
        }catch (e) {
            console.log("Erro ao excluir receita ", e);
            alert("Um Problema Ocorreu. Entre em contato com a equipe para reportar o problema, obrigado.");
        }
    };

    const onShowErroGeral = () => {
        setShowErroGeral(true);
    };

    const getPath = (uuid_receita_passado='') => {
        let path;
        if (redirectTo !== '') {
            path = `${redirectTo}/${uuid_receita_passado ? uuid_receita_passado : uuid_receita}${uuid_despesa ? '/'+uuid_despesa : ''}`;
        } else if (origem === undefined) {
            path = `/lista-de-receitas`;
        } else {
            path = `/detalhe-das-prestacoes`;
        }
        window.location.assign(path);
    };

    const setaRepasse = async (value)=>{
        if (value) {
            setRepasse(value);
        }
    };

    const consultaRepasses = async (value) => {
        if (value) {
            let tipo_receita = tabelas.tipos_receita.find(item => item.id == value);
            if (tipo_receita.e_repasse === true) {
                try {
                    let listaRepasses = await getRepasses();
                    setRepasses(listaRepasses);
                    setShowSelecionaRepasse(true);
                } catch (e) {
                    console.log("Erro ao obter a listagem de repasses", e);
                }
                
            } else {
                setaRepasse({});
                setreadOnlyAcaoAssociacaoReceita(false);
                setreadOnlyContaAssociacaoReceita(false);
                setReadOnlyValor(false);
            }
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
    };

    const setaDetalhesTipoReceita = (id_tipo_receita) => {
        if (id_tipo_receita) {
            tabelas.tipos_receita.map((item, index) => {
                if (item.id == id_tipo_receita && index != idxTipoDespesa) {
                    setIdxTipoDespesa(index);
                    const atuReceita = receita;
                    atuReceita.detalhe_tipo_receita = null;
                    setReceita(atuReceita);
                }
            })
        }
    };

    const getAvisoTipoReceita = (id_tipo_receita) => {
        if(id_tipo_receita){
            tabelas.tipos_receita.map((item, index) => {
                if (item.id == id_tipo_receita){
                    if(item.mensagem_usuario != ""){
                        setMsgAvisoTipoReceita(item.mensagem_usuario);
                        setShowAvisoTipoReceita(true);
                    }
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
    };

    const getOpcoesDetalhesTipoReceita = (values) => {
        if (tabelas.tipos_receita[idxTipoDespesa] !== undefined && tabelas.tipos_receita[idxTipoDespesa].detalhes_tipo_receita !== undefined && tabelas.tipos_receita[idxTipoDespesa].detalhes_tipo_receita.length > 0) {
            return tabelas.tipos_receita[idxTipoDespesa].detalhes_tipo_receita.map(item => {
                return (
                    <option key={item.id} value={item.id}>{item.nome}</option>
                )
            })
        }
    };

    const temOpcoesDetalhesTipoReceita = (values) => {
        if (tabelas.tipos_receita[idxTipoDespesa] !== undefined && tabelas.tipos_receita[idxTipoDespesa].detalhes_tipo_receita !== undefined) {
            return (tabelas.tipos_receita[idxTipoDespesa].detalhes_tipo_receita.length > 0)
        }
        return false
    };

    const e_repasse = (values) => {
        return tabelas.tipos_receita.find(element => element.id === Number(values.tipo_receita)).e_repasse
    }

    const retornaAcoes = (values) => {
        if (tabelas.acoes_associacao !== undefined && tabelas.acoes_associacao.length > 0 && values.tipo_receita && e_repasse(values) && Object.keys(repasse).length !== 0) {
            let acao_associacao = tabelas.acoes_associacao.find(item => item.uuid == repasse.acao_associacao.uuid);
            setreadOnlyAcaoAssociacaoReceita(true);
            return (
                <option key={acao_associacao.uuid} value={acao_associacao.uuid}>{acao_associacao.nome}</option>
            )
        } else if (tabelas.acoes_associacao !== undefined && tabelas.acoes_associacao.length > 0 && values.tipo_receita) {
            let e_recurso_proprio = tabelas.tipos_receita.find(element => element.id === Number(values.tipo_receita)).e_recursos_proprios

            return (tabelas.acoes_associacao.filter(item => item.e_recursos_proprios == e_recurso_proprio).map((item, key) => (
                <option key={item.uuid} value={item.uuid}>{item.nome}</option>
            )))
        }

        return tabelas.acoes_associacao !== undefined && tabelas.acoes_associacao.length > 0 ?(tabelas.acoes_associacao.map((item, key) => (
            <option key={item.uuid} value={item.uuid}>{item.nome}</option>
        ))): null
    }



    const retornaClassificacaoReceita = (values, setFieldValue) => {
        if (tabelas.categorias_receita !== undefined && tabelas.categorias_receita.length > 0 && values !== undefined && values.acao_associacao && values.tipo_receita && Object.entries(repasse).length > 0 && uuid === undefined) {
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
            if (tabelas.categorias_receita && tabelas.categorias_receita.length > 0 && values.tipo_receita){
                return tabelas.categorias_receita.map((item)=>{
                    return (
                        <option
                            style={{display: getDisplayOptionClassificacaoReceita(item.id, values.tipo_receita)}}
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


    const retornaTiposDeContas = (values) => {
        if (tabelas.contas_associacao !== undefined && tabelas.contas_associacao.length > 0  && values.tipo_receita && e_repasse(values) && Object.keys(repasse).length !== 0) {
            let conta_associacao = tabelas.contas_associacao.find(conta => (repasse.conta_associacao.nome.includes(conta.nome)));
            setreadOnlyContaAssociacaoReceita(true);
            return (
                    <option key={conta_associacao.uuid} value={conta_associacao.uuid}>{conta_associacao.nome}</option>
            )
        } else if (tabelas.contas_associacao !== undefined && tabelas.contas_associacao.length > 0  && values.tipo_receita) {
            
            const tipoReceita = tabelas.tipos_receita.find(element => element.id === Number(values.tipo_receita));
            
            // Lista dos nomes dos tipos de conta que são aceitos pelo tipo de receita selecionado.
            const tipos_conta = tipoReceita.tipos_conta.map(item => item.nome);

            // Filtra as contas pelos tipos aceitos
            return (
                tabelas.contas_associacao.filter(conta => (tipos_conta.includes(conta.nome))).map((item, key) => (
                    <option key={item.uuid} value={item.uuid}>{item.nome}</option>)
            ))
        }
    };

    const validateFormReceitas = async (values) => {
        const errors = {};

        // Verifica se é devolucao e setando erro caso referencia devolucao vazio
        if (verificaSeDevolucao(values.tipo_receita)  && !values.referencia_devolucao){
            errors.referencia_devolucao = "Campo período é obrigatório"
        }

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
        });

        e_repasse_acao = values.acao_associacao;

        let hoje = moment(new Date());
        let data_digitada = moment(values.data);

        if (data_digitada > hoje){
            errors.data = "Data do crédito não pode ser maior que a data de hoje"
        }

        if (tabelas.tipos_receita !== undefined && tabelas.tipos_receita.length > 0 && values.tipo_receita && e_repasse(values) && Object.keys(repasse).length !== 0) {
            setReadOnlyValor(true);
        } else {
            setReadOnlyValor(false)
        }

        return errors;
    };

    const verificaSeDevolucao = (tipoDeReceitaId) =>{
        let e_devolucao = undefined;
        if (tipoDeReceitaId){
            let e_devolucao = tabelas.tipos_receita.find(element=> element.id === Number(tipoDeReceitaId));
            if (e_devolucao){
                return e_devolucao.e_devolucao
            }else {
                return e_devolucao
            }
        }else {
            return e_devolucao
        }
    };


    const trataRepasse = async (repasse_row, setFieldValue, valor, nome_classificacao) => {
        await setaRepasse(repasse_row);
        setFieldValue('acao_associacao', repasse_row.acao_associacao.uuid);
        setFieldValue('conta_associacao', repasse_row.conta_associacao.uuid);
        setFieldValue('valor', valor);
        setFieldValue('categoria_receita', retornaIdClassificacao(nome_classificacao))
        setReadOnlyValor(true);
        setShowSelecionaRepasse(false);
    }

    const retornaIdClassificacao = (classificacao_nome)=>{
        let id_classificacao = ""
        if (classificacao_nome === 'valor_custeio'){
            id_classificacao = "CUSTEIO"
        }else if (classificacao_nome === 'valor_capital'){
            id_classificacao = "CAPITAL"
        }else {
            id_classificacao = "LIVRE"
        }
        return id_classificacao
    }

    const atualizaValorRepasse = (value, setFieldValue) => {
        if (Object.keys(repasse).length !== 0) {
            let valor_formatado = Number(repasse[`valor_${value.toLowerCase()}`]).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });

            setFieldValue('valor', valor_formatado);
        }
    }

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
                        errors,
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
                                        disabled={readOnlyCampos || readOnlyTipoReceita || ![['add_receita'], ['change_receita']].some(visoesService.getPermissoes)}
                                        value={props.values.tipo_receita}
                                        onChange={(e) => {
                                            props.handleChange(e);
                                            consultaRepasses(e.target.value);
                                            getClassificacaoReceita(e.target.value, setFieldValue);
                                            setaDetalhesTipoReceita(e.target.value);
                                            getAvisoTipoReceita(e.target.value);
                                            if (e.target.value !== "" && !tabelas.tipos_receita.find(element => element.id === Number(e.target.value)).e_recursos_proprios) {
                                                setShowCadastrarSaida(false);
                                            } else if (e.target.value !== "" && tabelas.tipos_receita.find(element => element.id === Number(e.target.value)).e_recursos_proprios) {
                                                let acao = tabelas.acoes_associacao.find(item => item.uuid == props.values.acao_associacao)
                                                if (acao && acao.e_recursos_proprios) {
                                                    setShowCadastrarSaida(true);
                                                } 
                                            }
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
                                    <label htmlFor="detalhe_tipo_receita">Detalhamento do crédito</label>
                                    {temOpcoesDetalhesTipoReceita(props.values) ?
                                        <select
                                            id="detalhe_tipo_receita"
                                            name="detalhe_tipo_receita"
                                            disabled={readOnlyCampos || ![['add_receita'], ['change_receita']].some(visoesService.getPermissoes)}
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
                                            disabled={readOnlyCampos || ![['add_receita'], ['change_receita']].some(visoesService.getPermissoes)}
                                        />
                                    }
                                    {props.touched.detalhe_tipo_receita && props.errors.detalhe_tipo_receita && <span className="span_erro text-danger mt-1"> {props.errors.detalhe_tipo_receita}</span>}
                                </div>
                                {/*Fim Detalhamento do Crédito */}

                                {/*Periodo Devolução */}
                                {verificaSeDevolucao(props.values.tipo_receita) &&
                                    <div className="col-12 col-md-6 mt-4">
                                        <label htmlFor="referencia_devolucao">Período de referência da devolução</label>
                                        <select
                                            id="referencia_devolucao"
                                            name="referencia_devolucao"
                                            value={props.values.referencia_devolucao  && props.values.referencia_devolucao.uuid ? props.values.referencia_devolucao.uuid : props.values.referencia_devolucao ? props.values.referencia_devolucao : ""}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            className="form-control"
                                            disabled={readOnlyValor || readOnlyCampos || ![['add_receita'], ['change_receita']].some(visoesService.getPermissoes)}
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
                                        disabled={![['add_receita'], ['change_receita']].some(visoesService.getPermissoes)}
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
                                        disabled={readOnlyValor || readOnlyCampos || readOnlyContaAssociacaoReceita || ![['add_receita'], ['change_receita']].some(visoesService.getPermissoes)}
                                    >
                                        {receita.conta_associacao
                                            ? null
                                            : <option key="" value="">Escolha uma conta</option>}

                                        {retornaTiposDeContas(props.values)}
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
                                        disabled={readOnlyCampos || readOnlyAcaoAssociacaoReceita || ![['add_receita'], ['change_receita']].some(visoesService.getPermissoes)}
                                        id="acao_associacao"
                                        name="acao_associacao"
                                        value={props.values.acao_associacao}
                                        onChange={(e) => {
                                            props.handleChange(e);
                                            showBotaoCadastrarSaida(e.target.value, props.values);
                                        }
                                        }
                                        onBlur={props.handleBlur}
                                        className="form-control"
                                    >
                                        {receita.acao_associacao
                                            ? null
                                            : <option key={0} value="">Escolha uma ação</option>}
                                        {retornaAcoes(props.values)}
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
                                        onChange={ (e) => {
                                            props.handleChange(e);
                                            atualizaValorRepasse(e.target.value, setFieldValue);
                                            }
                                        }
                                        onBlur={props.handleBlur}
                                        className="form-control"
                                        disabled={readOnlyClassificacaoReceita || readOnlyCampos || readOnlyValor || ![['add_receita'], ['change_receita']].some(visoesService.getPermissoes)}

                                    >
                                        {receita.categorias_receita ? null :
                                            <option key={0} value="">Escolha a classificação</option>}

                                        {retornaClassificacaoReceita(props.values, setFieldValue)}
                                    </select>

                                    {props.touched.categoria_receita && props.errors.categoria_receita && <span className="span_erro text-danger mt-1"> {props.errors.categoria_receita}</span>}
                                </div>
                                {/*Fim Classificação do Crédito*/}

                                {/*Valor Total do Crédito */}
                                <div className="col-12 col-md-6 mt-4">
                                    <label htmlFor="valor">Valor total do crédito</label>
                                    <CurrencyInput
                                        disabled={readOnlyCampos || ![['add_receita'], ['change_receita']].some(visoesService.getPermissoes)}
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
                                {showEditarSaida &&
                                    <button
                                        type="submit"
                                        onClick={() => {
                                            setExibeModalSalvoComSucesso(false)
                                            setRedirectTo('/cadastro-de-despesa-recurso-proprio')
                                        }}
                                        className="btn btn btn-outline-success mt-2 mr-2"
                                    >
                                        Editar saída
                                    </button>
                                }
                                {showCadastrarSaida && !showEditarSaida ?
                                    <button
                                        type="submit"
                                        onClick={() => {
                                            setExibeModalSalvoComSucesso(false)
                                            setRedirectTo('/cadastro-de-despesa-recurso-proprio')
                                        }}
                                        className="btn btn btn-outline-success mt-2 mr-2"
                                    >
                                        Cadastrar saída
                                    </button> : null
                                }
                                <button
                                    type="reset"
                                    onClick={comparaObjetos(values,objetoParaComparacao) ? onCancelarTrue : onShowModal}
                                    className="btn btn btn-outline-success mt-2 mr-2"
                                >
                                    Voltar
                                </button>
                                {uuid ?
                                    <button disabled={readOnlyBtnAcao || !visoesService.getPermissoes(['delete_receita'])} type="reset" onClick={onShowDeleteModal} className="btn btn btn-danger mt-2 mr-2">Deletar</button> : null
                                }
                                <button
                                    onClick={(e)=>servicoDeVerificacoes(e, values, errors)}
                                    disabled={readOnlyBtnAcao || ![['add_receita'], ['change_receita']].some(visoesService.getPermissoes)}
                                    type="submit"
                                    className="btn btn-success mt-2"
                                >
                                    Salvar
                                </button>

                            </div>
                            {/*Fim Botões*/}
                            <section>
                                <ModalReceitaConferida
                                    show={showReceitaConferida}
                                    handleClose={()=>setShowReceitaConferida(false)}
                                    onSalvarReceitaConferida={ () => onSubmit(values) }
                                    titulo="Receita já demonstrada"
                                    texto="<p>Atenção. Esse crédito já foi demonstrado, caso a alteração seja gravada ele voltará a ser não demonstrado. Confirma a gravação?</p>"
                                />
                            </section>
                            <section>
                                <ModalSelecionaRepasse
                                    show={showSelecionaRepasse}
                                    cancelar={() => {
                                        setShowSelecionaRepasse(false); 
                                        setFieldValue('tipo_receita', '');
                                        setFieldValue('valor', '0,00');
                                    }}
                                    repasses={repasses}
                                    trataRepasse={trataRepasse}
                                    setFieldValue={setFieldValue}
                                    titulo="Selecione o repasse"
                                    bodyText="<p>Atenção. Esse crédito já foi demonstrado, caso a alteração seja gravada ele voltará a ser não demonstrado. Confirma a gravação?</p>"
                                />
                            </section>
                        </form>
                    );
                }}
            </Formik>
            <section>
                <CancelarModalReceitas
                    show={show}
                    handleClose={onHandleClose}
                    onCancelarTrue={onCancelarTrue}
                    uuid={uuid}
                />
            </section>
            {uuid
                ?
                <ModalDeletarReceita
                    show={showDelete}
                    handleClose={onHandleClose}
                    onDeletarTrue={onDeletarTrue}
                    texto={msgDeletarReceita}
                />
                : null
            }
            <section>
                <PeriodoFechado show={showPeriodoFechado} handleClose={onHandleClose}/>
            </section>
            <section>
                <ErroGeral show={showErroGeral} handleClose={onHandleClose}/>
            </section>
            <section>
                <AvisoTipoReceita 
                    show={showAvisoTipoReceita} 
                    handleClose={onHandleClose}
                    texto={msgAvisoTipoReceita}
                />
            </section>
            <section>
                <SalvarReceita show={showSalvarReceita} handleClose={fecharSalvarCredito}/>
            </section>
        </>
    );
};