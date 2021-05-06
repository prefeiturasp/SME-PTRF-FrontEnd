import React, {useCallback, useEffect, useState} from "react";
import {useParams} from 'react-router-dom'
import {PaginasContainer} from "../../../paginas/PaginasContainer";
import {visoesService} from "../../../services/visoes.service";
import {getUsuario, getUsuarioStatus, getCodigoEolUnidade, getGrupos, postCriarUsuario, putEditarUsuario, deleteUsuario} from "../../../services/GestaoDePerfis.service";
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
        unidade: ""
    };

    const [statePerfisForm, setStatePerfisForm] = useState(initPerfisForm);
    const [grupos, setGrupos] = useState([]);
    const [codigoEolUnidade, setCodigoEolUnidade] = useState('');
    const [bloquearCampoName, setBloquearCampoName] = useState(true)
    const [bloquearCampoEmail, setBloquearCampoEmail] = useState(true)
    const [loading, setLoading] = useState(false);

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
    }, [visao_selecionada]);

    useEffect(()=>{
        exibeGrupos()
    }, [exibeGrupos])

    const carregaDadosUsuario = useCallback(async ()=>{
        if (id_usuario){
            let dados_usuario = await getUsuario(id_usuario)
            let ids_grupos =[];
            if (dados_usuario.groups && dados_usuario.groups.length > 0){
                dados_usuario.groups.map((grupo)=>
                    ids_grupos.push(grupo.id)
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
                unidade: codigoEolUnidade ? codigoEolUnidade : ""
            };
            setStatePerfisForm(initPerfisForm)
            setBloquearCampoEmail(false)
        }
    }, [id_usuario, visao_selecionada, codigoEolUnidade])

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
            mask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]
        }else {
            mask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]
        }
        return mask
    }, [])

    const serviceVisaoDre = useCallback(async (usuario_status, {setFieldValue, resetForm})=>{

        const codigoEolUnidade = await carregaCodigoEolUnidade()

        if (!usuario_status.usuario_core_sso.info_core_sso && usuario_status.validacao_username.username_e_valido) {
            setShowModalUsuarioNaoCadastrado(true)
        }else if (usuario_status.validacao_username.username_e_valido && usuario_status.usuario_core_sso.info_core_sso && usuario_status.usuario_sig_escola.info_sig_escola && usuario_status.usuario_sig_escola.info_sig_escola.visoes.find(element => element === visao_selecionada) && usuario_status.usuario_sig_escola.info_sig_escola.unidades.find(element => element === codigoEolUnidade)){
            setStatePerfisForm(initPerfisForm)
            resetForm()
            setShowModalUsuarioCadastradoVinculado(true)
        }else if (usuario_status.usuario_core_sso.info_core_sso){
            setBloquearCampoEmail(false);
            setFieldValue('name', usuario_status.usuario_core_sso.info_core_sso.nome)
            setFieldValue('email', usuario_status.usuario_core_sso.info_core_sso.email)
        }
    }, [carregaCodigoEolUnidade, visao_selecionada, initPerfisForm]) ;

    const serviceVisaoUE = useCallback(async (values, usuario_status, {setFieldValue, resetForm})=>{

        if (values.e_servidor === "True"){
            if (!usuario_status.e_servidor_na_unidade){
                setStatePerfisForm(initPerfisForm);
                resetForm();
                setTituloModalInfo("Erro ao criar o usuário");
                setTextoModalInfo("<p>O usuário precisa ser um servidor da escola</p>");
                setShowModalInfo(true);
            }else {
                if (usuario_status.validacao_username.username_e_valido && usuario_status.usuario_core_sso.info_core_sso && usuario_status.usuario_sig_escola.info_sig_escola && usuario_status.usuario_sig_escola.info_sig_escola.visoes.find(element => element === visao_selecionada) && usuario_status.usuario_sig_escola.info_sig_escola.unidades.find(element => element === codigoEolUnidade)) {
                    setStatePerfisForm(initPerfisForm);
                    resetForm();
                    setShowModalUsuarioCadastradoVinculado(true);
                }else {
                    setShowModalInfo(false)
                    setBloquearCampoEmail(false);
                    setFieldValue('name', usuario_status.usuario_core_sso.info_core_sso.nome)
                    setFieldValue('email', usuario_status.usuario_core_sso.info_core_sso.email)
                }
            }
        }else {
            if (!usuario_status.usuario_sig_escola.associacoes_que_e_membro.find(element => element === uuid_associacao)){
                setStatePerfisForm(initPerfisForm)
                resetForm()
                setTituloModalInfo("Erro ao criar o usuário")
                setTextoModalInfo("<p>Usuários não servidores só podem ser adicionados à unidade educacional que sejam membros atuais da Associação e cadastrado nos dados da Associação</p>")
                setShowModalInfo(true)
            }else{

                if (usuario_status.validacao_username.username_e_valido && usuario_status.usuario_core_sso.info_core_sso && usuario_status.usuario_sig_escola.info_sig_escola && usuario_status.usuario_sig_escola.info_sig_escola.visoes.find(element => element === visao_selecionada) && usuario_status.usuario_sig_escola.info_sig_escola.unidades.find(element => element === codigoEolUnidade)) {
                    setStatePerfisForm(initPerfisForm);
                    resetForm();
                    setShowModalUsuarioCadastradoVinculado(true);
                }else {
                    if (!usuario_status.usuario_core_sso.info_core_sso && usuario_status.validacao_username.username_e_valido) {
                        setShowModalUsuarioNaoCadastrado(true)
                    }else if (usuario_status.usuario_core_sso.info_core_sso){
                        setBloquearCampoEmail(false);
                        setFieldValue('name', usuario_status.usuario_core_sso.info_core_sso.nome)
                        setFieldValue('email', usuario_status.usuario_core_sso.info_core_sso.email)
                    }
                }
            }
        }
    }, [initPerfisForm, uuid_associacao, codigoEolUnidade, visao_selecionada]);

    const serviceVisaoSme = useCallback(async (usuario_status, {setFieldValue, resetForm})=>{
        if (!usuario_status.usuario_core_sso.info_core_sso && usuario_status.validacao_username.username_e_valido) {
            setShowModalUsuarioNaoCadastrado(true)
        }else if (usuario_status.validacao_username.username_e_valido && usuario_status.usuario_core_sso.info_core_sso && usuario_status.usuario_sig_escola.info_sig_escola && usuario_status.usuario_sig_escola.info_sig_escola.visoes.find(element => element === visao_selecionada)){
            setStatePerfisForm(initPerfisForm)
            resetForm()
            setShowModalUsuarioCadastradoVinculado(true)
        }else if (usuario_status.usuario_core_sso.info_core_sso){
            setFieldValue('name', usuario_status.usuario_core_sso.info_core_sso.nome)
            setFieldValue('email', usuario_status.usuario_core_sso.info_core_sso.email)
        }
    }, [visao_selecionada, initPerfisForm]) ;

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
                    if (visao_selecionada === "DRE"){
                        await serviceVisaoDre(usuario_status, {setFieldValue, resetForm})
                    }else if (visao_selecionada === "UE"){
                        await serviceVisaoUE(values, usuario_status, {setFieldValue, resetForm})
                    }
                }else {
                    usuario_status = await getUsuarioStatus(values.username, values.e_servidor);
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

            setLoading(true)

            let payload = {
                e_servidor: values.e_servidor,
                username: values.username,
                name: values.name,
                email: values.email ? values.email : "",
                visao: visao_selecionada,
                groups: values.groups,
                unidade: visao_selecionada !== "SME" ? codigoEolUnidade : null
            };

            if (values.id || (usuariosStatus.usuario_sig_escola.info_sig_escola && usuariosStatus.usuario_sig_escola.info_sig_escola.user_id)) {

                let id_do_usuario;
                if (values.id){
                    id_do_usuario = values.id
                }else {
                    id_do_usuario = usuariosStatus.usuario_sig_escola.info_sig_escola.user_id
                }

                try {
                    await putEditarUsuario(id_do_usuario, payload);
                    console.log('Usuário editado com sucesso')
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
                    await postCriarUsuario(payload);
                    console.log('Usuário criado com sucesso')
                    window.location.assign('/gestao-de-perfis/')
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
                    <h1 className="titulo-itens-painel mt-5">Gestao de perfis</h1>
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