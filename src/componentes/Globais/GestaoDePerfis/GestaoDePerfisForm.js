import React, {useCallback, useEffect, useState} from "react";
import {useParams} from 'react-router-dom'
import {PaginasContainer} from "../../../paginas/PaginasContainer";
import {visoesService} from "../../../services/visoes.service";
import {getUsuario, getUsuarioStatus, getCodigoEolUnidade, getGrupos, getUsuarioUnidadesVinculadas, postCriarUsuario, putEditarUsuario, deleteUsuario} from "../../../services/GestaoDePerfis.service";
import {valida_cpf_cnpj} from "../../../utils/ValidacoesAdicionaisFormularios";
import Loading from "../../../utils/Loading";
import {GestaoDePerfisFormFormik} from "./GestaoDePerfisFormFormik";

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
    };

    const [statePerfisForm, setStatePerfisForm] = useState(initPerfisForm);
    const [grupos, setGrupos] = useState([]);
    const [codigoEolUnidade, setCodigoEolUnidade] = useState('');
    const [bloquearCampoName, setBloquearCampoName] = useState(true)
    const [bloquearCampoEmail, setBloquearCampoEmail] = useState(true)
    const [loading, setLoading] = useState(false);
    const [visoes, setVisoes] = useState([]);
    const [gruposJaVinculados, setGruposJaVinculados] = useState([]);

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

    const exibeGrupos =  useCallback(async ()=>{
        let grupos = await getGrupos(visao_selecionada);
        setGrupos(grupos);
        return grupos
    }, [visao_selecionada]);

    useEffect(()=>{
        exibeGrupos()
    }, [exibeGrupos])

    const exibeVisoes = useCallback(()=>{
        let _visoes;

        if (visao_selecionada === "SME"){
            _visoes = [
                {nome: "SME", id: 3,editavel: true},
                {nome: "DRE", id: 2, editavel: true},
                {nome: "UE", id: 1, editavel: true},
            ]
        }else if (visao_selecionada === "DRE"){
            _visoes = [
                {nome: "SME", id: 3,editavel: false},
                {nome: "DRE", id: 2, editavel: true},
                {nome: "UE", id: 1, editavel: true},
            ]
        }else if (visao_selecionada === "UE"){
            _visoes = [
                {nome: "SME", id: 3,editavel: false},
                {nome: "DRE", id: 2, editavel: false},
                {nome: "UE", id: 1, editavel: true},
            ]
        }
        setVisoes(_visoes)
    }, [visao_selecionada])

    useEffect(()=>{
        exibeVisoes()
    }, [exibeVisoes])


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

    const carregaDadosUsuario = useCallback(async ()=>{
        if (id_usuario){
            let dados_usuario = await getUsuario(id_usuario)
            let grupos = await exibeGrupos()

            console.log("carregaDadosUsuario ", dados_usuario)

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

            //console.log("ids_grupos_ja_inseridos ", ids_grupos)
            //console.log("ids_grupos_que_tem_direito ", ids_grupos_que_tem_direito)
            //console.log("FINAL ", removeItensArray(ids_grupos_que_tem_direito, ids_grupos))

            setGruposJaVinculados(removeItensArray(ids_grupos_que_tem_direito, ids_grupos))

            let ids_visoes = [];
            if (dados_usuario.visoes && dados_usuario.visoes.length > 0){
                dados_usuario.visoes.map((visao)=>
                    ids_visoes.push(visao.id)
                );
            }

            const initPerfisForm = {
                id: dados_usuario.id,
                e_servidor: dados_usuario.e_servidor ? "True" : "False",
                username: dados_usuario.username,
                name: dados_usuario.name,
                email: dados_usuario.email,
                visao: visao_selecionada,
                groups: ids_grupos,
                visoes: ids_visoes,
                unidade: codigoEolUnidade ? codigoEolUnidade : ""
            };
            setStatePerfisForm(initPerfisForm)
            setBloquearCampoEmail(false)
        }
    }, [exibeGrupos, id_usuario, visao_selecionada, codigoEolUnidade])

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

    const idUsuarioCondicionalMask = useCallback((e_servidor) => {
        let mask;
        if (e_servidor === "True"){
            mask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]
        }else {
            mask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]
        }
        return mask
    }, [])

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

    const serviceUsuarioNaoCadastrado = useCallback((usuario_status, {resetForm})=>{
        let usuario_nao_cadastrado = !usuario_status.usuario_core_sso.info_core_sso && usuario_status.usuario_core_sso.mensagem !== "Erro ao buscar usuário no CoreSSO!" && usuario_status.validacao_username.username_e_valido

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
    }, [initPerfisForm])

    const serviceUsuarioCadastrado = useCallback((usuario_status, {setFieldValue})=>{

        // TODO refatorar esse método para exibir nome e email do info_core_sso ou quando estiver retornando do info_sig_escola

        let usuario_cadastrado = usuario_status.usuario_core_sso.info_core_sso
        if (usuario_cadastrado){
            setBloquearCampoEmail(false);
            setFieldValue('name', usuario_status.usuario_core_sso.info_core_sso.nome)
            setFieldValue('email', usuario_status.usuario_core_sso.info_core_sso.email)
        }
        return usuario_cadastrado
    }, [])

    const serviceServidorEscola = useCallback((usuario_status, {resetForm})=>{
        let e_servidor_da_escola = usuario_status.e_servidor_na_unidade
        if (!e_servidor_da_escola) {
            setStatePerfisForm(initPerfisForm);
            resetForm();
            setTituloModalInfo("Erro ao criar o usuário");
            setTextoModalInfo("<p>O usuário precisa ser um servidor da escola</p>");
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
                    serviceUsuarioCadastrado(usuario_status, {setFieldValue})
                }
            }
        }else {
            if (!serviceUsuarioMembro(usuario_status, {resetForm})){
            }else{
                if (serviceUsuarioCadastradoVinculado(usuario_status, {resetForm}, codigoEolUnidade)) {
                }else {
                    if (serviceUsuarioNaoCadastrado(usuario_status, {resetForm})){}
                    else if (serviceUsuarioCadastrado(usuario_status, {setFieldValue})){}
                }
            }
        }
    }, [codigoEolUnidade, serviceUsuarioCadastradoVinculado, serviceUsuarioCadastrado, serviceUsuarioNaoCadastrado, serviceServidorEscola, serviceUsuarioMembro]);

    const serviceVisaoDre = useCallback(async (usuario_status, {setFieldValue, resetForm})=>{
        const codigoEolUnidade = await carregaCodigoEolUnidade()
        if (serviceUsuarioNaoCadastrado(usuario_status, {resetForm})) {}
        else if (serviceUsuarioCadastradoVinculado(usuario_status, {resetForm}, codigoEolUnidade)){}
        else if (serviceUsuarioCadastrado(usuario_status, {setFieldValue})){}

    }, [carregaCodigoEolUnidade, serviceUsuarioCadastradoVinculado, serviceUsuarioNaoCadastrado, serviceUsuarioCadastrado]) ;

    const serviceVisaoSme = useCallback(async (usuario_status, {setFieldValue, resetForm})=>{
        if (serviceUsuarioNaoCadastrado(usuario_status, {resetForm})){}
        else if (serviceUsuarioCadastradoVinculado(usuario_status, {resetForm})){}
        else if (serviceUsuarioCadastrado(usuario_status, {setFieldValue})){}
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

                    console.log("USUARIO STATUS Não SME ", usuario_status)

                    setUsuariosStatus(usuario_status)
                    if (visao_selecionada === "DRE"){
                        await serviceVisaoDre(usuario_status, {setFieldValue, resetForm})
                    }else if (visao_selecionada === "UE"){
                        await serviceVisaoUE(values, usuario_status, {setFieldValue, resetForm})
                    }
                }else {
                    usuario_status = await getUsuarioStatus(values.username, values.e_servidor);
                    console.log("USUARIO STATUS SME ", usuario_status)
                    setUsuariosStatus(usuario_status)
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

            //setLoading(true)

            let grupos_concatenados = values.groups.concat(gruposJaVinculados)
            // Removendo itens duplicados
            let grupos_concatenados_sem_repeticao = [...new Set(grupos_concatenados)]

            console.log("Grupos Já vinculados ", gruposJaVinculados)
            console.log("Values.groups ", values.groups)
            console.log("Grupos Concatenados ", grupos_concatenados_sem_repeticao)

            let payload = {
                e_servidor: values.e_servidor,
                username: values.username,
                name: values.name,
                email: values.email ? values.email : "",
                visao: visao_selecionada,
                groups: grupos_concatenados_sem_repeticao,
                unidade: visao_selecionada !== "SME" ? codigoEolUnidade : null,
                visoes: values.visoes,
            };

            console.log("PAYLOAD ", payload)

            // if (values.id || (usuariosStatus.usuario_sig_escola.info_sig_escola && usuariosStatus.usuario_sig_escola.info_sig_escola.user_id)) {
            //
            //     let id_do_usuario;
            //     if (values.id){
            //         id_do_usuario = values.id
            //     }else {
            //         id_do_usuario = usuariosStatus.usuario_sig_escola.info_sig_escola.user_id
            //     }
            //
            //     try {
            //         await putEditarUsuario(id_do_usuario, payload);
            //         console.log('Usuário editado com sucesso')
            //         window.location.assign('/gestao-de-perfis/')
            //     } catch (e) {
            //         setLoading(false)
            //         console.log('Erro ao editar usuário ', e.response.data)
            //         setTituloModalInfo('Erro ao atualizar o usuário')
            //         if (e.response.data.username && e.response.data.username.length > 0) {
            //             setTextoModalInfo(e.response.data.username[0])
            //         } else {
            //             setTextoModalInfo('<p>Não foi possível atualizar o usuário, por favor, tente novamente</p>')
            //         }
            //         resetForm()
            //         setShowModalUsuarioNaoCadastrado(false)
            //         setShowModalUsuarioCadastradoVinculado(false)
            //         setShowModalInfo(true)
            //     }
            //
            // } else {
            //     try {
            //         await postCriarUsuario(payload);
            //         console.log('Usuário criado com sucesso')
            //         window.location.assign('/gestao-de-perfis/')
            //     } catch (e) {
            //         setLoading(false)
            //         console.log('Erro ao criar usuário ', e.response.data)
            //         setTituloModalInfo('Erro ao criar usuário')
            //         if (e.response.data.username && e.response.data.username.length > 0) {
            //             setTextoModalInfo(e.response.data.username[0])
            //         } else {
            //             setTextoModalInfo('<p>Não foi possível criar o usuário, por favor, tente novamente</p>')
            //         }
            //         resetForm()
            //         setShowModalUsuarioNaoCadastrado(false)
            //         setShowModalUsuarioCadastradoVinculado(false)
            //         setShowModalInfo(true)
            //     }
            // }
        }
    };

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
                                setBloquearCampoEmail={setBloquearCampoEmail}
                                bloquearCampoEmail={bloquearCampoEmail}
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
                            />
                    </div>
                </>
            }
        </PaginasContainer>
    )
};