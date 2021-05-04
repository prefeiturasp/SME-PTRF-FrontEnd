import React, {useCallback, useEffect, useState} from "react";
import {Redirect, useParams} from 'react-router-dom'
import {PaginasContainer} from "../../../paginas/PaginasContainer";
import {Field, Formik} from "formik";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {visoesService} from "../../../services/visoes.service";
import {YupSignupSchemaPerfis} from "./YupSignupSchemaPerfis";
import {
    getUsuario,
    getUsuarioStatus,
    getCodigoEolUnidade,
    getConsultarUsuario,
    getGrupos,
    postCriarUsuario,
    putEditarUsuario, deleteUsuario
} from "../../../services/GestaoDePerfis.service";
import {ModalUsuarioNaoCadastrado} from "./ModalUsuarioNaoCadastrado";
import {ModalUsuarioCadastradoVinculado} from "./ModalUsuarioCadastradoVinculado";
import {ModalConfirmDeletePerfil} from "./ModalConfirmDeletePerfil";
import {ModalInfo} from "./ModalInfo";
import {valida_cpf_cnpj} from "../../../utils/ValidacoesAdicionaisFormularios";

export const GestaoDePerfisForm = (props) =>{

    const visao_selecionada = visoesService.getItemUsuarioLogado('visao_selecionada.nome');

    const uuid_unidade = visoesService.getItemUsuarioLogado('unidade_selecionada.uuid');

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
    const [bloquearCampoEmail, setBloquearCampoEmail] = useState(false)



    const carregaCodigoEolUnidade = useCallback(async ()=>{
        if (visao_selecionada !== "SME"){
            let unidade = await getCodigoEolUnidade(uuid_unidade)
            console.log("Codigo Eol Unidade XXXX ", unidade.codigo_eol)
            setCodigoEolUnidade(unidade.codigo_eol)
        }

    }, [visao_selecionada, uuid_unidade])

    useEffect(()=>{
        carregaCodigoEolUnidade()
    }, [carregaCodigoEolUnidade])

    const exibeGrupos =  useCallback(async ()=>{
        let grupos = await getGrupos(visao_selecionada);
        console.log("GRUPOS ", grupos)
        setGrupos(grupos);
    }, [visao_selecionada]);

    useEffect(()=>{
        exibeGrupos()
    }, [exibeGrupos])

    const carregaDadosUsuario = useCallback(async ()=>{
        if (id_usuario){
            let dados_usuario = await getUsuario(id_usuario)
            console.log('carregaDadosUsuario ', dados_usuario)


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
        }

    }, [id_usuario, visao_selecionada, codigoEolUnidade])

    useEffect(()=>{
        carregaDadosUsuario()
    }, [carregaDadosUsuario])


    const [showModalUsuarioNaoCadastrado, setShowModalUsuarioNaoCadastrado] = useState(false)
    const [showModalUsuarioCadastradoVinculado, setShowModalUsuarioCadastradoVinculado] = useState(false)
    const [showModalDeletePerfil, setShowModalDeletePerfil] = useState(false);
    const [showModalInfo, setShowModalInfo] = useState(false);
    const [tituloModalInfo, setTituloModalInfo] = useState('');
    const [textoModalInfo, setTextoModalInfo] = useState('');

    const handleCloseUsuarioNaoCadastrado = () => {
        setShowModalUsuarioNaoCadastrado(false);
        setStatePerfisForm(initPerfisForm)
    };

    const handleCloseDeletePerfil = () => {
        setShowModalDeletePerfil(false);
    };

    const onDeletePerfilTrue = async () =>{
        setShowModalDeletePerfil(false);
        try {
            await deleteUsuario(statePerfisForm.id);
            console.log('Usuário deletado com sucesso');
            window.location.assign('/gestao-de-perfis/')
        }catch (e) {
            console.log('Erro ao deletar usuário ', e.response.data);
        }
    };

    // Validações adicionais
    const [formErrors, setFormErrors] = useState({});
    const [enviarFormulario, setEnviarFormulario] = useState(true);

    const serviceVisaoUe = useCallback(async ()=>{

    }, [])

    const validacoesPersonalizadas = useCallback(async (values, {setFieldValue}) => {

        let erros = {};

        if (values.e_servidor === 'False'){
            let cpf_cnpj_valido = !(!values.username || values.username.trim() === "" || !valida_cpf_cnpj(values.username));

            if (!cpf_cnpj_valido) {
                erros = {
                    username: "Digite um CPF ou um CNPJ válido"
                }
                setFormErrors({...erros})
                setEnviarFormulario(false)
            } else {
                setEnviarFormulario(true)
            }
        }

        try {

            let usuario_status;
            if (visao_selecionada !== 'SME'){
                usuario_status = await getUsuarioStatus(values.username, values.e_servidor, uuid_unidade);
            }else {
                usuario_status = await getUsuarioStatus(values.username, values.e_servidor);
            }

            console.log("validacoesPersonalizadas usuario_status ", usuario_status)
            if (!usuario_status.usuario_core_sso.info_core_sso && usuario_status.validacao_username.username_e_valido) {
                setShowModalUsuarioNaoCadastrado(true)
            }else if (
                usuario_status.validacao_username.username_e_valido &&
                usuario_status.usuario_core_sso.info_core_sso &&
                usuario_status.usuario_sig_escola.info_sig_escola &&
                usuario_status.usuario_sig_escola.info_sig_escola.visoes.find(element => element === visao_selecionada) &&
                usuario_status.usuario_sig_escola.info_sig_escola.unidades.find(element => element === codigoEolUnidade)
            ){
                setShowModalUsuarioCadastradoVinculado(true)
            }else if (usuario_status.usuario_core_sso.info_core_sso){
                setFieldValue('name', usuario_status.usuario_core_sso.info_core_sso.nome)
                setFieldValue('email', usuario_status.usuario_core_sso.info_core_sso.email)
            }
        }catch (e){
            erros = {
                username: "Erro ao buscar status usuário"
            }
            setFormErrors({...erros})
            console.log("Erro ao buscar status usuário")
        }

        return erros;
    }, [codigoEolUnidade, uuid_unidade, visao_selecionada])

    // const validacoesPersonalizadas = useCallback(async (values, {setFieldValue})=>{
    //
    //     debugger
    //     let erros = {};
    //
    //     let username_valido = !(!values.username || values.username.trim() === "" || !valida_cpf_cnpj(values.username));
    //
    //     if (!username_valido) {
    //         erros = {
    //             username: "Digite um CPF válido"
    //         }
    //         setEnviarFormulario(false)
    //     } else {
    //         setEnviarFormulario(true)
    //     }
    //
    //     try {
    //         let usuario_status = await getUsuarioStatus(values.username, values.e_servidor, uuid_unidade);
    //         console.log("validateFormPerfis usuario_status ", usuario_status)
    //
    //         if (!usuario_status.usuario_core_sso.info_core_sso && usuario_status.validacao_username.username_e_valido) {
    //             setShowModalUsuarioNaoCadastrado(true)
    //
    //         }else if (
    //             usuario_status.validacao_username.username_e_valido &&
    //             usuario_status.usuario_core_sso.info_core_sso &&
    //             usuario_status.usuario_sig_escola.info_sig_escola &&
    //             usuario_status.usuario_sig_escola.info_sig_escola.visoes.find(element => element === visao_selecionada) &&
    //             usuario_status.usuario_sig_escola.info_sig_escola.unidades.find(element => element === codigoEolUnidade)
    //         ){
    //             setShowModalUsuarioCadastradoVinculado(true)
    //
    //         }else if (usuario_status.usuario_core_sso.info_core_sso){
    //             setFieldValue('name', usuario_status.usuario_core_sso.info_core_sso.nome)
    //             setFieldValue('email', usuario_status.usuario_core_sso.info_core_sso.email)
    //         }
    //     }catch (e){
    //         console.log("Erro ao buscar status usuário")
    //     }
    //
    //     return erros;
    //
    // }, [codigoEolUnidade, uuid_unidade, visao_selecionada])

    const validateFormPerfis = async (values) => {
        const errors = {};

        if (values.username.trim()){
            try {
                let username = await getConsultarUsuario(visao_selecionada, values.username.trim());
                if (username.status === 200 || username.status === 201) {
                    const init = {
                        ...statePerfisForm,
                        e_servidor: values.e_servidor,
                        username: values.username,
                        name: username.data.nome,
                        email: username.data.email,
                    };
                    setStatePerfisForm(init);
                }
            }catch (e) {
                let data = e.response.data;
                if (data !== undefined && data.detail !== undefined) {
                    errors.username = data.detail
                } else {
                    errors.username = "Nome de usuário inválido"
                }
            }
        }
        return errors
    };


    const handleChangesPerfisForm = (name, value) => {
        setStatePerfisForm({
            ...statePerfisForm,
            [name]: value
        });
    };

    const handleSubmitPerfisForm = async (values, {setFieldValue})=>{

        setFormErrors(validacoesPersonalizadas(values, {setFieldValue}));
        let erros_personalizados = validacoesPersonalizadas(values, {setFieldValue})

        if (enviarFormulario && Object.keys(erros_personalizados).length === 0) {

            let payload = {
                e_servidor: values.e_servidor,
                username: values.username,
                name: values.name,
                email: values.email ? values.email : "",
                visao: visao_selecionada,
                groups: values.groups,
                unidade: visao_selecionada !== "SME" ? codigoEolUnidade : null
            };

            console.log("handleSubmitPerfisForm payload ", payload)

            if (values.id) {
                try {
                    await putEditarUsuario(values.id, payload);
                    console.log('Usuário editado com sucesso')
                    window.location.assign('/gestao-de-perfis/')
                } catch (e) {
                    console.log('Erro ao editar usuário ', e.response.data)
                    setTituloModalInfo('Erro ao atualizar o usuário')
                    if (e.response.data.username && e.response.data.username.length > 0) {
                        setTextoModalInfo(e.response.data.username[0])
                    } else {
                        setTextoModalInfo('<p>Não foi possível atualizar o usuário, por favor, tente novamente</p>')
                    }
                    setShowModalInfo(true)
                }

            } else {
                try {
                    await postCriarUsuario(payload);
                    console.log('Usuário criado com sucesso')
                    window.location.assign('/gestao-de-perfis/')
                } catch (e) {
                    console.log('Erro ao criar usuário ', e.response.data)
                    setTituloModalInfo('Erro ao criar usuário')
                    if (e.response.data.username && e.response.data.username.length > 0) {
                        setTextoModalInfo(e.response.data.username[0])
                    } else {
                        setTextoModalInfo('<p>Não foi possível criar o usuário, por favor, tente novamente</p>')
                    }
                    setShowModalInfo(true)

                }
            }
        }
    };

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Gestao de perfis</h1>
            <div className="page-content-inner">
                <>

                    <Formik
                        initialValues={statePerfisForm}
                        validationSchema={YupSignupSchemaPerfis}
                        //validate={validateFormPerfis}
                        enableReinitialize={true}
                        validateOnBlur={true}
                        onSubmit={handleSubmitPerfisForm}
                    >
                        {props => {
                            const {
                                setFieldValue,
                                values,
                                errors,
                            } = props;
                            return (
                                <form onSubmit={props.handleSubmit}>

                                    <p>Erros XXXXXX {JSON.stringify(enviarFormulario)}</p>

                                    <div className="d-flex bd-highlight mt-2">
                                        <div className="p-Y flex-grow-1 bd-highlight">
                                            <p className='titulo-gestao-de-perfis-form'>{!statePerfisForm.id ? 'Adicionar' : 'Editar'} usuário</p>
                                        </div>
                                        <div className="p-Y bd-highlight">
                                            {statePerfisForm.id &&
                                            <button onClick={() => setShowModalDeletePerfil(true)} type="button" className="btn btn btn-danger mt-2">
                                                <FontAwesomeIcon
                                                    style={{fontSize: '15px', marginRight: "5px", color:'#fff'}}
                                                    icon={faTrash}
                                                />
                                                Deletar usuário
                                            </button>
                                            }
                                        </div>
                                        <div className="p-Y bd-highlight">
                                            <button type="submit" className="btn btn-success mt-2 ml-2">{!statePerfisForm.id ? 'Adicionar' : 'Salvar'}</button>
                                        </div>
                                        <div className="p-Y bd-highlight">
                                            <button onClick={() => window.location.assign('/gestao-de-perfis/')} type="button" className="btn btn btn-outline-success mt-2 ml-2">voltar</button>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-12 col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="e_servidor">Tipo de usuário</label>
                                                <select
                                                    value={props.values.e_servidor}
                                                    onChange={(e) => {
                                                        props.handleChange(e);
                                                        handleChangesPerfisForm(e.target.name, e.target.value);
                                                    }
                                                    }
                                                    name="e_servidor"
                                                    className="form-control"
                                                    disabled={statePerfisForm.id}
                                                >
                                                    <option value="">Escolha o tipo de usuário</option>
                                                    <option value="True">Servidor</option>
                                                    <option value="False">Não Servidor</option>
                                                </select>
                                                {props.errors.e_servidor && <span className="span_erro text-danger mt-1"> {props.errors.e_servidor}</span>}
                                            </div>
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="username">ID do usuário</label>
                                                <input
                                                    type="text"
                                                    value={props.values.username ? props.values.username : ""}
                                                    onChange={(e) => {
                                                        props.handleChange(e);
                                                        handleChangesPerfisForm(e.target.name, e.target.value);
                                                    }}
                                                    onBlur={(e) => {
                                                        validacoesPersonalizadas(values, {setFieldValue});
                                                    }}
                                                    //onBlur={()=>validacoesPersonalizadas(values, {setFieldValue})}
                                                    onClick={() => {
                                                        setFormErrors({username: ""})
                                                    }}
                                                    name="username"
                                                    className="form-control"
                                                    placeholder='Insira o nome de usuário'
                                                    disabled={!props.values.e_servidor || statePerfisForm.id}
                                                />
                                                {/* Validações personalizadas */}
                                                {formErrors.username && <p className='mb-0'><span className="span_erro text-danger mt-1">{formErrors.username}</span></p>}
                                                {/*{props.errors.username && <span className="span_erro text-danger mt-1"> {props.errors.username}</span>}*/}
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <div className="form-group">
                                                <label htmlFor="name">Nome Completo</label>
                                                <input
                                                    type="text"
                                                    value={props.values.name ? props.values.name : ""}
                                                    onChange={(e) => {
                                                        props.handleChange(e);
                                                        handleChangesPerfisForm(e.target.name, e.target.value);
                                                    }
                                                    }
                                                    name="name"
                                                    className="form-control"
                                                    readOnly={bloquearCampoName}
                                                    maxLength='255'
                                                />
                                                {props.errors.name && <span className="span_erro text-danger mt-1"> {props.errors.name}</span>}
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <div className="form-group">
                                                <label htmlFor="email">Email</label>
                                                <input
                                                    type="text"
                                                    value={props.values.email ? props.values.email : ''}
                                                    onChange={(e) => {
                                                        props.handleChange(e);
                                                        handleChangesPerfisForm(e.target.name, e.target.value);
                                                    }
                                                    }
                                                    name="email"
                                                    className="form-control"
                                                    placeholder='Insira seu email se desejar'
                                                    readOnly={bloquearCampoEmail}
                                                    maxLength='254'
                                                />
                                                {props.errors.email && <span className="span_erro text-danger mt-1"> {props.errors.email}</span>}
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <div className="form-group">
                                                <label htmlFor="groups">Grupo de acesso</label>
                                                <Field
                                                    component="select"
                                                    name="groups"
                                                    className="form-control"
                                                    multiple={true}
                                                    value={props.values.groups ? props.values.groups : []}
                                                    onChange={evt =>
                                                        setFieldValue("groups", [].slice.call(evt.target.selectedOptions).map(option => option.value))
                                                    }
                                                >
                                                    {grupos && grupos.length > 0 && grupos.map((grupo, index) => (
                                                        <option key={index} value={grupo.id}>{grupo.nome}</option>
                                                    ))}
                                                </Field>
                                                {props.errors.groups && <span className="span_erro text-danger mt-1"> {props.errors.groups}</span>}
                                            </div>
                                        </div>
                                    </div>


                                </form>
                            );
                        }}
                    </Formik>
                </>
                <section>
                    <ModalUsuarioNaoCadastrado
                        show={showModalUsuarioNaoCadastrado}
                        handleClose={handleCloseUsuarioNaoCadastrado}
                        onCadastrarTrue={()=>{
                            setBloquearCampoName(false)
                            setBloquearCampoEmail(false)
                            setShowModalUsuarioNaoCadastrado(false)
                        }}
                        titulo="Usuário não cadastrado"
                        texto="<p>O usuário não existe no CoreSSO deseja criá-lo?</p>"
                        primeiroBotaoTexto="Cancelar"
                        primeiroBotaoCss="outline-success"
                        segundoBotaoCss="success"
                        segundoBotaoTexto="Cadastrar"
                    />
                </section>
                <section>
                    <ModalUsuarioCadastradoVinculado
                        show={showModalUsuarioCadastradoVinculado}
                        handleClose={()=> {
                            setShowModalUsuarioCadastradoVinculado(false);
                            setStatePerfisForm(initPerfisForm)
                        }}
                        titulo="Usuário já vinculado"
                        texto="<p>Este usuário já está vinculado</p>"
                        primeiroBotaoTexto="Fechar"
                        primeiroBotaoCss="success"
                    />
                </section>
                <section>
                    <ModalConfirmDeletePerfil
                        show={showModalDeletePerfil}
                        handleClose={handleCloseDeletePerfil}
                        onDeletePerfilTrue={onDeletePerfilTrue}
                        titulo="Excluir Perfil"
                        texto="<p>Deseja realmente excluir este perfil?</p>"
                        primeiroBotaoTexto="Cancelar"
                        primeiroBotaoCss="outline-success"
                        segundoBotaoCss="danger"
                        segundoBotaoTexto="Excluir"
                    />
                </section>
                <section>
                    <ModalInfo
                        show={showModalInfo}
                        handleClose={()=>setShowModalInfo(false)}
                        titulo={tituloModalInfo}
                        texto={textoModalInfo}
                        primeiroBotaoTexto="Fechar"
                        primeiroBotaoCss="success"
                    />
                </section>
            </div>
        </PaginasContainer>
    )

};