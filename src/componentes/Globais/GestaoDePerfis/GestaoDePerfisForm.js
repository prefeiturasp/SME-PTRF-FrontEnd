import React, {useCallback, useEffect, useState} from "react";
import {useParams} from 'react-router-dom'
import {PaginasContainer} from "../../../paginas/PaginasContainer";
import {visoesService} from "../../../services/visoes.service";
import {getUsuario, getUsuarioStatus, getCodigoEolUnidade, getGrupos, getVisoes, getUsuarioUnidadesVinculadas, getUnidadesPorTipo, getUnidadePorUuid, getMembroAssociacao, postVincularUnidadeUsuario, postCriarUsuario, putEditarUsuario, deleteDesvincularUnidadeUsuario, deleteUsuario} from "../../../services/GestaoDePerfis.service";
import {valida_cpf_cnpj} from "../../../utils/ValidacoesAdicionaisFormularios";
import Loading from "../../../utils/Loading";
import {GestaoDePerfisFormFormik} from "./GestaoDePerfisFormFormik";
import {getTabelaAssociacoes} from "../../../services/dres/Associacoes.service";

export const GestaoDePerfisForm = () =>{

    const visao_selecionada = visoesService.getItemUsuarioLogado('visao_selecionada.nome');
    const uuid_unidade = visoesService.getItemUsuarioLogado('unidade_selecionada.uuid');
    const uuid_associacao = visoesService.getItemUsuarioLogado('associacao_selecionada.uuid');

    let {id_usuario} = useParams();

    const initPerfisForm = {
        e_servidor: "",
        username: "",
        name: "",
        email: '',
        visao: visao_selecionada,
        groups: [],
        visoes: [],
        unidade: "",
        unidades_vinculadas: [],
    };

    const [statePerfisForm, setStatePerfisForm] = useState(initPerfisForm);
    const [grupos, setGrupos] = useState([]);
    const [codigoEolUnidade, setCodigoEolUnidade] = useState('');
    const [bloquearCampoName, setBloquearCampoName] = useState(true)
    const [loading, setLoading] = useState(false);
    const [visoes, setVisoes] = useState([]);
    const [gruposJaVinculados, setGruposJaVinculados] = useState([]);
    const [tabelaAssociacoes, setTabelaAssociacoes] = useState({});
    const [unidadesPorTipo, setUnidadesPorTipo] = useState([]);
    const [unidadeVisaoUE, setUnidadeVisaoUE] = useState({});

    const carregaCodigoEolUnidade = useCallback(async ()=>{
        if (visao_selecionada !== "SME"){
            let unidade = await getCodigoEolUnidade(uuid_unidade)
            setCodigoEolUnidade(unidade.codigo_eol)
            return unidade.codigo_eol
        }
    }, [visao_selecionada, uuid_unidade])

    useEffect(()=>{
        carregaCodigoEolUnidade()
    }, [carregaCodigoEolUnidade])


    const exibeGrupos =  useCallback(async (visao_selecionada_parametro='')=>{

        let get_visoes = await getVisoes()
        let grupos

        setGrupos([])

        if (visao_selecionada_parametro instanceof Array && visao_selecionada_parametro.length > 0){

            visao_selecionada_parametro && visao_selecionada_parametro.length > 0 && visao_selecionada_parametro.map(async (visao_id)=>{
                let nome = get_visoes.filter(element => parseInt(element.id) === parseInt(visao_id))
                grupos = await getGrupos(nome[0].nome);
                setGrupos(prevState => [...prevState, ...grupos]);
            })
        }else {
            grupos = await getGrupos(visao_selecionada);
            setGrupos(grupos);
        }

        return grupos
    }, [visao_selecionada]);

    useEffect(()=>{
        exibeGrupos()
    }, [exibeGrupos])

    const removeItensArray = (itens_remover, array_contendo_itens)=>{
        // Clonando o array_contendo_itens para não remover do original
        let array = [...array_contendo_itens]
        let index;
        itens_remover.forEach(item=> {
            index = array.indexOf(item)
            if ( index > -1) {
                array.splice(index, 1);
            }
        })
        return array
    }

    const carregaUnidadesVinculadas = useCallback( async ()=>{
        let unidades_vinculadas = [];
        if (id_usuario){
            if (visao_selecionada !== "SME"){
                unidades_vinculadas = await getUsuarioUnidadesVinculadas(id_usuario, visao_selecionada, uuid_unidade)
            }else if (visao_selecionada === "SME"){
                unidades_vinculadas = await getUsuarioUnidadesVinculadas(id_usuario, visao_selecionada)
            }
        }

        return unidades_vinculadas
    }, [id_usuario, visao_selecionada, uuid_unidade])

    const serviceTemUnidadeDre = useCallback((unidades_vinculadas)=>{
        return unidades_vinculadas.find(element => element.tipo_unidade === "DRE")
    }, [])

    const serviceTemUnidadeUE = useCallback((unidades_vinculadas)=>{
        return unidades_vinculadas.find(element => element.tipo_unidade && element.tipo_unidade !== "SME" && element.tipo_unidade !== "DRE")
    }, [])


    const exibeVisoes = useCallback(async ()=>{
        let _visoes;
        let unidades_vinculadas = await carregaUnidadesVinculadas()

        let get_visoes = await getVisoes()

        let tem_unidade_dre = serviceTemUnidadeDre(unidades_vinculadas)
        let tem_unidade_ue = serviceTemUnidadeUE(unidades_vinculadas)

        if (visao_selecionada === "SME"){
            _visoes = [
                {nome: "SME", id: parseInt(get_visoes.find(element => element.nome === "SME").id),  editavel: true},
                {nome: "DRE", id: parseInt(get_visoes.find(element => element.nome === "DRE").id),  editavel: !tem_unidade_dre},
                {nome: "UE",  id: parseInt(get_visoes.find(element => element.nome === "UE").id),   editavel: !tem_unidade_ue},
            ]
        }else if (visao_selecionada === "DRE"){
            _visoes = [
                {nome: "SME", id: parseInt(get_visoes.find(element => element.nome === "SME").id), editavel: false},
                {nome: "DRE", id: parseInt(get_visoes.find(element => element.nome === "DRE").id), editavel: !tem_unidade_dre},
                {nome: "UE",  id: parseInt(get_visoes.find(element => element.nome === "UE").id),  editavel: !tem_unidade_ue},
            ]
        }else if (visao_selecionada === "UE"){
            _visoes = [
                {nome: "SME", id: parseInt(get_visoes.find(element => element.nome === "SME").id), editavel: false},
                {nome: "DRE", id: parseInt(get_visoes.find(element => element.nome === "DRE").id),  editavel: false},
                {nome: "UE",  id: parseInt(get_visoes.find(element => element.nome === "UE").id),   editavel: !tem_unidade_ue},
            ]
        }
        setVisoes(_visoes)
    }, [visao_selecionada, carregaUnidadesVinculadas, serviceTemUnidadeDre, serviceTemUnidadeUE])

    useEffect(()=>{
        exibeVisoes()
    }, [exibeVisoes])

    const exibePermissaoExibicaoVisoes = useCallback( ()=>{

        let _visoes;

        if (visao_selecionada === "SME"){
            _visoes = [
                {nome: "SME", editavel: true},
                {nome: "DRE", editavel: true},
                {nome: "UE",  editavel: true},
            ]
        }else if (visao_selecionada === "DRE"){
            _visoes = [
                {nome: "SME", editavel: false},
                {nome: "DRE", editavel: true},
                {nome: "UE",  editavel: true},
            ]
        }else if (visao_selecionada === "UE"){
            _visoes = [
                {nome: "SME", editavel: false},
                {nome: "DRE",  editavel: false},
                {nome: "UE",   editavel: true},
            ]
        }

        return _visoes

    }, [visao_selecionada])

    const buscaTabelaAssociacoes = useCallback(async ()=>{
        let tabela_associacoes = await getTabelaAssociacoes();
        setTabelaAssociacoes(tabela_associacoes);
    }, []);

    useEffect(()=>{
        buscaTabelaAssociacoes()
    }, [buscaTabelaAssociacoes])

    const buscaTipoUnidadeVisaoUE = useCallback( async ()=>{
        let unidade={
            tipo_unidade:""
        }
        if (uuid_unidade && visao_selecionada && visao_selecionada === "UE"){
            try {
                unidade = await getUnidadePorUuid(uuid_unidade)
            }catch (e) {
                console.log("Erro ao buscar unidade, método: buscaTipoUnidadeVisaoUE ", e.response.data)
            }
        }
        setUnidadeVisaoUE(unidade)

    },[uuid_unidade, visao_selecionada])

    useEffect(()=>{
        buscaTipoUnidadeVisaoUE()
    }, [buscaTipoUnidadeVisaoUE])

    const carregaDadosUsuario = useCallback(async (id_usuario_passado="")=>{
        if (id_usuario || id_usuario_passado){
            let dados_usuario;
            if (id_usuario_passado){
                dados_usuario = await getUsuario(id_usuario_passado)
            }else {
                dados_usuario = await getUsuario(id_usuario)
            }

            let grupos = await exibeGrupos()
            let unidades_vinculadas = await carregaUnidadesVinculadas()

            let ids_grupos =[];
            if (dados_usuario.groups && dados_usuario.groups.length > 0){
                dados_usuario.groups.map((grupo)=>
                    ids_grupos.push(grupo.id.toString())
                );
            }

            let ids_grupos_que_tem_direito = []
            if (grupos && grupos.length > 0){
                grupos.map((grupo)=>
                    ids_grupos_que_tem_direito.push(grupo.id)
                )
            }
            //setGruposJaVinculados(removeItensArray(ids_grupos_que_tem_direito, ids_grupos))

            let ids_visoes = [];
            if (dados_usuario.visoes && dados_usuario.visoes.length > 0){
                dados_usuario.visoes.map((visao)=>
                    ids_visoes.push(visao.id)
                );
            }

            await exibeGrupos(ids_visoes)

            const initPerfisForm = {
                id: dados_usuario.id,
                e_servidor: dados_usuario.e_servidor ? "True" : "False",
                username: dados_usuario.username,
                name: dados_usuario.name,
                email: dados_usuario.email,
                visao: visao_selecionada,
                groups: ids_grupos,
                visoes: ids_visoes,
                unidade: codigoEolUnidade ? codigoEolUnidade : "",
                unidades_vinculadas: unidades_vinculadas,
            };
            setStatePerfisForm(initPerfisForm)
        }
    }, [carregaUnidadesVinculadas, exibeGrupos, id_usuario, visao_selecionada, codigoEolUnidade])

    useEffect(()=>{
        carregaDadosUsuario()
    }, [carregaDadosUsuario])

    const handleCloseUsuarioNaoCadastrado = ({resetForm}) => {
        resetForm()
        setShowModalUsuarioNaoCadastrado(false);
        setStatePerfisForm(initPerfisForm)
    };

    const handleCloseDeletePerfil = () => {
        setShowModalDeletePerfil(false);
    };

    const onDeletePerfilTrue = async () =>{
        setShowModalDeletePerfil(false);
        setLoading(true)
        try {
            await deleteUsuario(statePerfisForm.id);
            console.log('Usuário deletado com sucesso');
            window.location.assign('/gestao-de-perfis/')
        }catch (e) {
            console.log('Erro ao deletar usuário ', e.response.data);
            setLoading(false)
        }
    };

    // Validações adicionais
    const [showModalUsuarioNaoCadastrado, setShowModalUsuarioNaoCadastrado] = useState(false)
    const [showModalUsuarioCadastradoVinculado, setShowModalUsuarioCadastradoVinculado] = useState(false)
    const [showModalDeletePerfil, setShowModalDeletePerfil] = useState(false);
    const [showModalInfo, setShowModalInfo] = useState(false);
    const [tituloModalInfo, setTituloModalInfo] = useState('');
    const [textoModalInfo, setTextoModalInfo] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [enviarFormulario, setEnviarFormulario] = useState(true);
    const [usuariosStatus, setUsuariosStatus] = useState({});
    const [btnAdicionarDisabled, setBtnAdicionarDisabled] = useState(false);
    const [visoesChecked, setVisoesChecked] = useState([]);

    const idUsuarioCondicionalMask = useCallback((e_servidor) => {
        let mask;
        if (e_servidor === "True"){
            mask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]
        }else {
            mask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]
        }
        return mask
    }, [])

    const  formataCPF = (cpf) => {
        let cpfAtualizado;
        cpfAtualizado = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/,
            function( regex, argumento1, argumento2, argumento3, argumento4 ) {
                return argumento1 + '.' + argumento2 + '.' + argumento3 + '-' + argumento4;
            })
        return cpfAtualizado
    }

    const serviceUsuarioCadastradoVinculado = useCallback((usuario_status, {resetForm}, _codigoEolUnidade="")=>{
        let usuario_cadastrado_e_vinculado
        if (_codigoEolUnidade){
            usuario_cadastrado_e_vinculado = usuario_status.validacao_username.username_e_valido && usuario_status.usuario_core_sso.info_core_sso && usuario_status.usuario_sig_escola.info_sig_escola && usuario_status.usuario_sig_escola.info_sig_escola.visoes.find(element => element === visao_selecionada) && usuario_status.usuario_sig_escola.info_sig_escola.unidades.find(element => element === _codigoEolUnidade)
        }else {
            // Visão SME não recebe o codigo da unidade
            usuario_cadastrado_e_vinculado = usuario_status.validacao_username.username_e_valido && usuario_status.usuario_core_sso.info_core_sso && usuario_status.usuario_sig_escola.info_sig_escola && usuario_status.usuario_sig_escola.info_sig_escola.visoes.find(element => element === visao_selecionada)
        }
        if (usuario_cadastrado_e_vinculado){
            setStatePerfisForm(initPerfisForm);
            resetForm();
            setShowModalUsuarioCadastradoVinculado(true);
        }
        return usuario_cadastrado_e_vinculado
    }, [initPerfisForm, visao_selecionada])

    const serviceUsuarioNaoCadastrado = useCallback(async (usuario_status, {resetForm}, values="")=>{
        let usuario_nao_cadastrado_membro_associacao = false
        if (values.username){
            let cpf_mascara = formataCPF(values.username)
            usuario_nao_cadastrado_membro_associacao = await getMembroAssociacao(uuid_associacao, cpf_mascara)
        }
        let usuario_nao_cadastrado = !usuario_status.usuario_core_sso.info_core_sso && !usuario_nao_cadastrado_membro_associacao && usuario_status.usuario_core_sso.mensagem !== "Erro ao buscar usuário no CoreSSO!" && usuario_status.validacao_username.username_e_valido

        if (usuario_status.usuario_core_sso.mensagem === "Erro ao buscar usuário no CoreSSO!"){
            setStatePerfisForm(initPerfisForm);
            resetForm();
            setTituloModalInfo("Erro ao criar o usuário");
            setTextoModalInfo(usuario_status.mensagem);
            setShowModalInfo(true);
        }else if (usuario_nao_cadastrado){
            setShowModalUsuarioNaoCadastrado(true)
        }
        return usuario_nao_cadastrado
    }, [uuid_associacao, initPerfisForm])

    const serviceUsuarioCadastrado = useCallback(async (usuario_status, {setFieldValue}, values="")=>{
        let usuario_cadastrado_core_sso = usuario_status.usuario_core_sso.info_core_sso
        if (usuario_cadastrado_core_sso){
            setFieldValue('name', usuario_status.usuario_core_sso.info_core_sso.nome)
            setFieldValue('email', usuario_status.usuario_core_sso.info_core_sso.email)
            return usuario_cadastrado_core_sso
        }else {
            if (values.username){
                let cpf_mascara = formataCPF(values.username)
                let usuario_cadastrado_membro_associacao = await getMembroAssociacao(uuid_associacao, cpf_mascara)
                if (usuario_cadastrado_membro_associacao){
                    setFieldValue('name', usuario_cadastrado_membro_associacao[0].nome)
                    setFieldValue('email', usuario_cadastrado_membro_associacao[0].email)
                    return usuario_cadastrado_membro_associacao
                }
            }
        }
    }, [uuid_associacao])

    const serviceServidorEscola = useCallback((usuario_status, {resetForm})=>{
        let e_servidor_da_escola = usuario_status.e_servidor_na_unidade
        if (!e_servidor_da_escola) {
            setStatePerfisForm(initPerfisForm);
            resetForm();
            setTituloModalInfo("Erro ao criar o usuário");
            setTextoModalInfo("<p>O usuário precisa ser um servidor da unidade</p>");
            setShowModalInfo(true);
        }
        return e_servidor_da_escola

    }, [initPerfisForm])

    const serviceUsuarioMembro = useCallback((usuario_status, {resetForm})=>{
        let e_membro = usuario_status.usuario_sig_escola.associacoes_que_e_membro.find(element => element === uuid_associacao)
        if (!e_membro){
            setStatePerfisForm(initPerfisForm)
            resetForm()
            setTituloModalInfo("Erro ao criar o usuário")
            setTextoModalInfo("<p>Usuários não servidores só podem ser adicionados à unidade educacional que sejam membros atuais da Associação e cadastrado nos dados da Associação</p>")
            setShowModalInfo(true)
        }
        return e_membro
    }, [initPerfisForm, uuid_associacao])

    const serviceVisaoUE = useCallback(async (values, usuario_status, {setFieldValue, resetForm})=>{

        if (values.e_servidor === "True"){

            if (!serviceServidorEscola(usuario_status, {resetForm})){
            }else {
                if (serviceUsuarioCadastradoVinculado(usuario_status, {resetForm}, codigoEolUnidade)){
                }else {
                    setShowModalInfo(false)
                    await serviceUsuarioCadastrado(usuario_status, {setFieldValue}, values)
                }
            }
        }else {
            if (!serviceUsuarioMembro(usuario_status, {resetForm})){
            }else{
                if (serviceUsuarioCadastradoVinculado(usuario_status, {resetForm}, codigoEolUnidade)) {
                }else {
                    if (await serviceUsuarioNaoCadastrado(usuario_status, {resetForm}, values)){
                    }else if (await serviceUsuarioCadastrado(usuario_status, {setFieldValue}, values)){}
                }
            }
        }
    }, [codigoEolUnidade, serviceUsuarioCadastradoVinculado, serviceUsuarioCadastrado, serviceUsuarioNaoCadastrado, serviceServidorEscola, serviceUsuarioMembro]);

    const serviceVisaoDre = useCallback(async (usuario_status, {setFieldValue, resetForm})=>{
        const codigoEolUnidade = await carregaCodigoEolUnidade()
        if (await serviceUsuarioNaoCadastrado(usuario_status, {resetForm})) {}
        else if (serviceUsuarioCadastradoVinculado(usuario_status, {resetForm}, codigoEolUnidade)){}
        else if (await serviceUsuarioCadastrado(usuario_status, {setFieldValue})){}

    }, [carregaCodigoEolUnidade, serviceUsuarioCadastradoVinculado, serviceUsuarioNaoCadastrado, serviceUsuarioCadastrado]) ;

    const serviceVisaoSme = useCallback(async (usuario_status, {setFieldValue, resetForm})=>{
        if (await serviceUsuarioNaoCadastrado(usuario_status, {resetForm})){}
        else if (serviceUsuarioCadastradoVinculado(usuario_status, {resetForm})){}
        else if (await serviceUsuarioCadastrado(usuario_status, {setFieldValue})){}
    }, [serviceUsuarioNaoCadastrado, serviceUsuarioCadastradoVinculado, serviceUsuarioCadastrado]) ;

    const validacoesPersonalizadas = useCallback(async (values, {setFieldValue, resetForm}) => {

        let erros = {};

        if (!values.username){
            erros = {
                ...erros,
                username: "ID de Usuário é um campo obrigatório"
            }
            setFormErrors({...erros})
            setEnviarFormulario(false)
        } else {
            setEnviarFormulario(true)
        }

        if (values.e_servidor === 'False'){
            let cpf_cnpj_valido = !(!values.username || values.username.trim() === "" || !valida_cpf_cnpj(values.username));
            if (!cpf_cnpj_valido) {
                erros = {
                    ...erros,
                    username: "Digite um CPF válido (apenas dígitos)"
                }
                setFormErrors({...erros})
                setEnviarFormulario(false)
            } else {
                setEnviarFormulario(true)
            }
        }

        if (Object.keys(erros).length === 0){
            try {
                let usuario_status;
                if (visao_selecionada !== 'SME'){
                    usuario_status = await getUsuarioStatus(values.username, values.e_servidor, uuid_unidade);
                    setUsuariosStatus(usuario_status)
                    // TODO Refatorar, criar método que checa se usuario já tem ID ou fazer esse controle nos métodos já existentes serviceVisaoDre, serviceVisaoUE, serviceVisaoSme
                    let id_usuario;
                    if (usuario_status && usuario_status.usuario_sig_escola && usuario_status.usuario_sig_escola.info_sig_escola && usuario_status.usuario_sig_escola.info_sig_escola.user_id){
                        id_usuario = usuario_status.usuario_sig_escola.info_sig_escola.user_id
                        console.log("USUARIO ID USUARIO ", id_usuario)
                        window.location.assign(`/gestao-de-perfis-form/${id_usuario}`)
                    }
                    if (visao_selecionada === "DRE"){
                        await serviceVisaoDre(usuario_status, {setFieldValue, resetForm})
                    }else if (visao_selecionada === "UE"){
                        await serviceVisaoUE(values, usuario_status, {setFieldValue, resetForm})
                    }
                }else {
                    usuario_status = await getUsuarioStatus(values.username, values.e_servidor);
                    setUsuariosStatus(usuario_status)
                    let id_usuario;
                    if (usuario_status && usuario_status.usuario_sig_escola && usuario_status.usuario_sig_escola.info_sig_escola && usuario_status.usuario_sig_escola.info_sig_escola.user_id){
                        id_usuario = usuario_status.usuario_sig_escola.info_sig_escola.user_id
                        console.log("USUARIO ID USUARIO ", id_usuario)
                        window.location.assign(`/gestao-de-perfis-form/${id_usuario}`)
                    }
                    await serviceVisaoSme(usuario_status, {setFieldValue, resetForm})
                }
            }catch (e){
                console.log("Erro ao buscar usuário ", e)
                setEnviarFormulario(false)
                erros = {
                    username: "Erro ao buscar usuário, tente novamente"
                }
                setFormErrors({...erros})
            }
        }
        return erros;
    }, [uuid_unidade, visao_selecionada, serviceVisaoDre, serviceVisaoUE, serviceVisaoSme])

    const handleSubmitPerfisForm = async (values, {resetForm})=>{

        if (enviarFormulario) {

            setLoading(true)

            // Concatenando os grupos que ele já tinha vinculado com os grupos que ele escolheu
            let grupos_concatenados = values.groups.concat(gruposJaVinculados)

            // Removendo itens duplicados
            let grupos_concatenados_sem_repeticao = [...new Set(grupos_concatenados)]

            let payload = {
                e_servidor: values.e_servidor,
                username: values.username,
                name: values.name,
                email: values.email ? values.email : "",
                //visao: visao_selecionada,
                //groups: values.groups,
                groups: grupos_concatenados_sem_repeticao,
                //unidade: visao_selecionada !== "SME" ? codigoEolUnidade : null,
                unidade: null,
                visoes: values.visoes,
            };

            if (values.id || (usuariosStatus.usuario_sig_escola.info_sig_escola && usuariosStatus.usuario_sig_escola.info_sig_escola.user_id)) {

                let id_do_usuario;
                if (values.id){
                    id_do_usuario = values.id
                }else {
                    id_do_usuario = usuariosStatus.usuario_sig_escola.info_sig_escola.user_id
                }

                try {
                    let ret = await putEditarUsuario(id_do_usuario, payload);
                    console.log('Usuário editado com sucesso ', ret)
                    window.location.assign('/gestao-de-perfis/')
                } catch (e) {
                    setLoading(false)
                    console.log('Erro ao editar usuário ', e.response.data)
                    setTituloModalInfo('Erro ao atualizar o usuário')
                    if (e.response.data.username && e.response.data.username.length > 0) {
                        setTextoModalInfo(e.response.data.username[0])
                    } else {
                        setTextoModalInfo('<p>Não foi possível atualizar o usuário, por favor, tente novamente</p>')
                    }
                    resetForm()
                    setShowModalUsuarioNaoCadastrado(false)
                    setShowModalUsuarioCadastradoVinculado(false)
                    setShowModalInfo(true)
                }
            } else {
                try {
                    let ret = await postCriarUsuario(payload);
                    console.log('Usuário criado com sucesso ', ret)
                    window.location.assign(`/gestao-de-perfis-form/${ret.id}`)
                } catch (e) {
                    setLoading(false)
                    console.log('Erro ao criar usuário ', e.response.data)
                    setTituloModalInfo('Erro ao criar usuário')
                    if (e.response.data.username && e.response.data.username.length > 0) {
                        setTextoModalInfo(e.response.data.username[0])
                    } else {
                        setTextoModalInfo('<p>Não foi possível criar o usuário, por favor, tente novamente</p>')
                    }
                    resetForm()
                    setShowModalUsuarioNaoCadastrado(false)
                    setShowModalUsuarioCadastradoVinculado(false)
                    setShowModalInfo(true)
                }
            }
        }
    };

    const serviceRemoveVinculoDuplicadoUnidades = (unidades_por_tipo, values) =>{
        let uuid_unidades_por_tipo = [];
        let _unidades_por_tipo = [...unidades_por_tipo]
        if (_unidades_por_tipo && _unidades_por_tipo.length > 0){
            _unidades_por_tipo.forEach(item=>{
                uuid_unidades_por_tipo.push(item.uuid)
            })
        }
        let index;
        values.unidades_vinculadas.forEach(item=> {
            index = uuid_unidades_por_tipo.indexOf(item.uuid)
            if ( index > -1) {
                _unidades_por_tipo.splice(index, 1);
                uuid_unidades_por_tipo.splice(index, 1);
            }
        })
        return _unidades_por_tipo
    }

    const serviceUnidadesPorTipoVisaoDRE = useCallback(async (tipo_unidade, values)=>{
        let unidades_por_tipo = []
        if(tipo_unidade === "DRE") {
            let dre = await getUnidadePorUuid(uuid_unidade)
            unidades_por_tipo.push(dre)
        }else {
            unidades_por_tipo = await getUnidadesPorTipo(tipo_unidade, uuid_unidade)
        }
        return serviceRemoveVinculoDuplicadoUnidades(unidades_por_tipo, values)
    }, [uuid_unidade])

    const serviceUnidadesPorTipoVisaoSME = useCallback(async (tipo_unidade, values) =>{
        let unidades = await getUnidadesPorTipo(tipo_unidade)
        let unidades_por_tipo = [...unidades]
        return serviceRemoveVinculoDuplicadoUnidades(unidades_por_tipo, values)
    }, [])

    const serviceUnidadesPorTipoVisaoUE = useCallback(async (tipo_unidade, values)=>{
        let unidades_por_tipo = []
        let ue = await getUnidadePorUuid(uuid_unidade)
        unidades_por_tipo.push(ue)
        return serviceRemoveVinculoDuplicadoUnidades(unidades_por_tipo, values)
    }, [uuid_unidade])

    const handleChangeTipoUnidade = useCallback(async (tipo_unidade, values)=>{
        setBtnAdicionarDisabled(true)
        if (tipo_unidade){
            if (visao_selecionada === "DRE"){
                setUnidadesPorTipo(await serviceUnidadesPorTipoVisaoDRE(tipo_unidade, values))
            }else if(visao_selecionada === "SME"){
                setUnidadesPorTipo(await serviceUnidadesPorTipoVisaoSME(tipo_unidade, values))
            }else if (visao_selecionada === "UE"){
                setUnidadesPorTipo(await serviceUnidadesPorTipoVisaoUE(tipo_unidade, values))
            }
        }
    }, [visao_selecionada, serviceUnidadesPorTipoVisaoDRE, serviceUnidadesPorTipoVisaoSME, serviceUnidadesPorTipoVisaoUE])

    const vinculaUnidadeUsuario = async (selectAcao, {setFieldValue}) => {
        setBtnAdicionarDisabled(true)
        let payload = {
            codigo_eol: selectAcao.codigo_eol
        }
        if (selectAcao && id_usuario) {
            try {
                await postVincularUnidadeUsuario(id_usuario, payload)
                console.log("Unidade vinculada com sucesso")
                let ret = await carregaUnidadesVinculadas()
                setFieldValue('unidades_vinculadas', ret)
                await exibeVisoes()
                setBtnAdicionarDisabled(false)
            }catch (e){
                console.log("Erro ao vincular unidade ao usuario ", e.response.data)
                await exibeVisoes()
                setBtnAdicionarDisabled(false)
            }
        }
    };

    const desvinculaUnidadeUsuario = async (unidade)=>{
        setBtnAdicionarDisabled(false)
        if (unidade && unidade.uuid){
            try {
                await deleteDesvincularUnidadeUsuario(id_usuario, unidade.codigo_eol)
                await carregaUnidadesVinculadas()
                await exibeVisoes()
                console.log("Unidade excluída com sucesso")
            }catch (e) {
                console.log("Erro ao excluir unidade ao usuario ", e.response.data)
                await exibeVisoes()
            }
        }
    }

    const handleChangeVisao = (e, setFieldValue, values) => {
        let _visoes
        const { checked, value } = e.target;
        if (checked) {
            setFieldValue("visoes", [...values.visoes, parseInt(value)]);
            _visoes = [...values.visoes, parseInt(value)]
        } else {
            setFieldValue("visoes", values.visoes.filter((v) => v !== parseInt(value)));
            _visoes = values.visoes.filter((v) => v !== parseInt(value))
        }
        exibeGrupos(_visoes)
    };

    const getEstadoInicialVisoesChecked = useCallback(()=>{
        let check = document.getElementsByName("visoes");
        let arrayVisoes = [];
        for (let i=0; i<check.length; i++){

            let { checked, id } = check[i];
            arrayVisoes.push({
                nome: id,
                checked: checked,
            })
        }
        setVisoesChecked(arrayVisoes)

        return arrayVisoes
    }, [])

    useEffect(()=>{
        getEstadoInicialVisoesChecked()
    }, [getEstadoInicialVisoesChecked])

    const acessoCadastrarUnidade = (tipo_unidade) => {
        if (visoesChecked && visoesChecked.length > 0) {
            let ret = visoesChecked.find(element => element.nome === tipo_unidade)
            return ret.checked
        }
    }

    const pesquisaVisao = useCallback((nome_visao)=>{
        let ret = visoes.find(element => element.nome === nome_visao)

        if (ret && ret.id){
            return ret
        }else {
            return true
        }
    }, [visoes])

    const pesquisaPermissaoExibicaoVisao = useCallback((nome_visao)=>{
        let ret = exibePermissaoExibicaoVisoes()
        let editavel
        if (ret){
            editavel = ret.filter((element => element.nome === nome_visao))
            editavel = editavel[0].editavel
        }
        return editavel
    }, [exibePermissaoExibicaoVisoes])

    return (
        <PaginasContainer>

            {loading ? (
                    <div className="mt-5">
                        <Loading
                            corGrafico="black"
                            corFonte="dark"
                            marginTop="0"
                            marginBottom="0"
                        />
                    </div>
                ) :
                <>
                    <h1 className="titulo-itens-painel mt-5">Gestão de perfis</h1>
                    <div className="page-content-inner">
                        <GestaoDePerfisFormFormik
                            initPerfisForm={initPerfisForm}
                            setStatePerfisForm={setStatePerfisForm}
                            statePerfisForm={statePerfisForm}
                            handleSubmitPerfisForm={handleSubmitPerfisForm}
                            setShowModalDeletePerfil={setShowModalDeletePerfil}
                            validacoesPersonalizadas={validacoesPersonalizadas}
                            setFormErrors={setFormErrors}
                            formErrors={formErrors}
                            idUsuarioCondicionalMask={idUsuarioCondicionalMask}
                            setBloquearCampoName={setBloquearCampoName}
                            bloquearCampoName={bloquearCampoName}
                            grupos={grupos}
                            visoes={visoes}
                            showModalUsuarioNaoCadastrado={showModalUsuarioNaoCadastrado}
                            handleCloseUsuarioNaoCadastrado={handleCloseUsuarioNaoCadastrado}
                            showModalUsuarioCadastradoVinculado={showModalUsuarioCadastradoVinculado}
                            setShowModalUsuarioNaoCadastrado={setShowModalUsuarioNaoCadastrado}
                            setShowModalUsuarioCadastradoVinculado={setShowModalUsuarioCadastradoVinculado}
                            showModalDeletePerfil={showModalDeletePerfil}
                            handleCloseDeletePerfil={handleCloseDeletePerfil}
                            onDeletePerfilTrue={onDeletePerfilTrue}
                            showModalInfo={showModalInfo}
                            setShowModalInfo={setShowModalInfo}
                            tituloModalInfo={tituloModalInfo}
                            textoModalInfo={textoModalInfo}
                            tabelaAssociacoes={tabelaAssociacoes}
                            handleChangeTipoUnidade={handleChangeTipoUnidade}
                            unidadesPorTipo={unidadesPorTipo}
                            vinculaUnidadeUsuario={vinculaUnidadeUsuario}
                            desvinculaUnidadeUsuario={desvinculaUnidadeUsuario}
                            btnAdicionarDisabled={btnAdicionarDisabled}
                            handleChangeVisao={handleChangeVisao}
                            getEstadoInicialVisoesChecked={getEstadoInicialVisoesChecked}
                            acessoCadastrarUnidade={acessoCadastrarUnidade}
                            unidadeVisaoUE={unidadeVisaoUE}
                            serviceTemUnidadeDre={serviceTemUnidadeDre}
                            serviceTemUnidadeUE={serviceTemUnidadeUE}
                            pesquisaVisao={pesquisaVisao}
                            pesquisaPermissaoExibicaoVisao={pesquisaPermissaoExibicaoVisao}
                            exibeGrupos={exibeGrupos}
                        />
                    </div>
                </>
            }
        </PaginasContainer>
    )
};