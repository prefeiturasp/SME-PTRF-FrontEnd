import React, {useContext, useEffect, useState} from "react";
import MaskedInput from "react-text-mask";
import {Formik} from "formik";
import * as yup from "yup";

import {GestaoDeUsuariosFormContext} from "../context/GestaoDeUsuariosFormProvider";
import {valida_cpf_cnpj} from "../../../../utils/ValidacoesAdicionaisFormularios";
import {ModalConfirmacao} from "./ModalConfirmacao";
import {useHistory} from "react-router-dom";
import {useUsuarioStatus} from "../hooks/useUsuarioStatus";
import {useCreateUsuario} from "../hooks/useCreateUsuario";
import {useUpdateUsuario} from "../hooks/useUpdateUsuario";
import {ModalValidacao} from "./ModalValidacao";
import {toastCustom} from "../../ToastCustom";
import Loading from "../../../../utils/Loading";
import {removerAcessosUnidadeBase} from "../../../../services/GestaoDeUsuarios.service";
import {useRemoveAcessosUsuario} from "../../GestaoDeUsuarios/hooks/useRemoveAcessosUsuario";
import {
    showMensagemErroAoRemoverAcesso,
    showMensagemSucessoAoRemoverAcesso
} from "../../GestaoDeUsuarios/utils/mensagens-remover-acesso";
import {ModalConfirmacaoRemoverAcesso} from "../../GestaoDeUsuarios/components/ModalConfirmacaoRemoverAcesso";


export const FormUsuario = ({usuario}) => {
    const { modo, Modos, uuidUnidadeBase, visaoBase} = useContext(GestaoDeUsuariosFormContext)
    const { mutate: createUsuario, isLoading: isLoadingCreate, error: errorOnCreate, data: resultPost } = useCreateUsuario();
    const { mutate: updateUsuario, isLoading: isLoadingUpdate, error: errorOnUpdate, data: resultPut } = useUpdateUsuario();
    const { mutate: removeAcessos, isLoading: isLoadingRemoveAcessos, error: errorOnRemoveAcessos, data: resultRemoveAcessos } = useRemoveAcessosUsuario(showMensagemSucessoAoRemoverAcesso, showMensagemErroAoRemoverAcesso, visaoBase)

    const history = useHistory();
    const [formErrors, setFormErrors] = useState({});
    const [bloquearCampoName, setBloquearCampoName] = useState(true)

    const [username, setUsername] = useState('');
    const [e_servidor, setE_servidor] = useState('');
    const { data: usuarioStatus, isLoading } = useUsuarioStatus(username, e_servidor, uuidUnidadeBase);

    const emptyValues = {
      e_servidor: '',
      username: '',
      name: '',
      email: '',
    };

    const [formValues, setFormValues] = useState(emptyValues);
    const [enviarFormulario, setEnviarFormulario] = useState(true);

    const [showModalUsuarioNaoCadastradoCoreSso, setShowModalUsuarioNaoCadastradoCoreSso] = useState(false)
    const [cadastramentoNoCoreSsoConfirmado, setCadastramentoNoCoreSsoConfirmado] = useState(false)

    // Modal de validação de acesso
    const [showModalValidacaoAcesso, setShowModalValidacaoAcesso] = useState(false)
    const [mensagemModalValidacaoAcesso, setMensagemModalValidacaoAcesso] = useState('')
    const handleFecharModalValidacaoAcesso = ({resetForm}) => {
        setFormValues(emptyValues)
        resetForm()
        setShowModalValidacaoAcesso(false);
    };

    // Modal de confirmação de remoção de acesso
    const [showModalConfirmaRemoverAcesso, setShowModalConfirmaRemoverAcesso] = useState(false)
    const handleCloseModalConfirmaRemoverAcesso = () => {
        setShowModalConfirmaRemoverAcesso(false);
    };

    const handleConfirmaRemoverAcesso = () => {
        setShowModalConfirmaRemoverAcesso(false);
        if (usuario?.id) {
            removeAcessos({id:usuario.id, uuidUnidadeBase})
        }
    };

    useEffect(()=>{
        const usuarioToFormValues = (usuario) => {
            if (!usuario) return;

            const usuarioValues = {
                id: usuario.id,
                e_servidor: usuario.e_servidor ? "True" : "False",
                username: usuario.username,
                name: usuario.name,
                email: usuario.email,
            };
            setFormValues(usuarioValues)
        };
        usuarioToFormValues(usuario)
    }, [usuario])

    useEffect(() => {
        if (modo === Modos.INSERT && resultPost?.id){
            history.push(`/gestao-de-usuarios-form/${resultPost.id}`)
        }
    }, [resultPost, modo, Modos, history])

    // Ações executadas quando a API retorna as informações de status do usuário
    useEffect(() => {
        const usuarioPodeAcessarUnidade = () => {
            return !!usuarioStatus?.pode_acessar_unidade?.pode_acessar
        }
        const abreModalDeAvisoSeNaoPuderAcessarUnidade = () => {
            setMensagemModalValidacaoAcesso(usuarioStatus.pode_acessar_unidade?.mensagem)
            setShowModalValidacaoAcesso(!usuarioPodeAcessarUnidade())
        }

        if (usuarioStatus) {
            const usuarioCadastradoNoCoreSSO = !!usuarioStatus.usuario_core_sso?.info_core_sso?.nome

            if (!usuarioCadastradoNoCoreSSO) {

                if (usuarioStatus?.info_membro_nao_servidor?.nome){
                    setFormValues(prevFormValues => ({
                        ...prevFormValues,
                        username: username,
                        e_servidor: e_servidor,
                        name: usuarioStatus?.info_membro_nao_servidor?.nome,
                        email: usuarioStatus?.info_membro_nao_servidor?.email
                    }));
                }

                // Mensagens de validação de acesso tem prioridade sobre o cadastramento no CoreSSO
                if (!usuarioPodeAcessarUnidade()){
                    abreModalDeAvisoSeNaoPuderAcessarUnidade()
                    return
                }

                if (!cadastramentoNoCoreSsoConfirmado) {
                    setShowModalUsuarioNaoCadastradoCoreSso(!cadastramentoNoCoreSsoConfirmado);
                }
                return
            } else {
                setBloquearCampoName(true)
            }

            setShowModalUsuarioNaoCadastradoCoreSso(false);

            const usuarioCadastradoNoSigEscola = !!usuarioStatus.usuario_sig_escola?.info_sig_escola?.user_id
            if (!usuarioCadastradoNoSigEscola) {
                setFormValues(prevFormValues => ({
                    ...prevFormValues,
                    username: username,
                    e_servidor: e_servidor,
                    name: usuarioStatus.usuario_core_sso.info_core_sso.nome,
                    email: usuarioStatus.usuario_core_sso.info_core_sso.email
                }));

                abreModalDeAvisoSeNaoPuderAcessarUnidade()

            } else {
                if (!usuarioPodeAcessarUnidade()){
                    setFormValues(prevFormValues => ({
                        ...prevFormValues,
                        username: username,
                        e_servidor: e_servidor,
                        name: usuarioStatus.usuario_core_sso.info_core_sso.nome,
                        email: usuarioStatus.usuario_core_sso.info_core_sso.email
                    }));

                    abreModalDeAvisoSeNaoPuderAcessarUnidade()
                    return
                }
                history.push(`/gestao-de-usuarios-form/${usuarioStatus.usuario_sig_escola.info_sig_escola.user_id}`)
            }

        }

    }, [usuarioStatus, cadastramentoNoCoreSsoConfirmado]);

    const handleSubmitUsuarioForm = async (values, {setSubmitting}) => {
        if (!enviarFormulario) return;

        console.log('handleSubmitPerfisForm: ', values)

        const payload = {
            e_servidor: values.e_servidor,
            username: values.username,
            name: values.name,
            email: values.email ? values.email : "",
            unidade: uuidUnidadeBase,
            visao: visaoBase
        };

        if (modo === Modos.INSERT) {
            console.log('Incluindo usuario: ', payload)
            createUsuario(payload)
        }

        if (modo === Modos.EDIT){
            console.log('Alterando usuario: ', payload)
            updateUsuario({id:usuario.id, payload})
        }

        exibeMsgSalvoComSucesso()

        setSubmitting(false)

    }

    const idUsuarioCondicionalMask = (e_servidor) => {
        let mask;
        if (e_servidor === "True"){
            mask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]
        }else {
            mask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]
        }
        return mask
    }

    const validacoesPersonalizadas = async (values, {setFieldValue, resetForm}) => {
        let erros = {};

        setUsername(values.username)
        setE_servidor(values.e_servidor)

        if (!values.username){
            erros = {
                ...erros,
                username: "ID de Usuário é um campo obrigatório"
            }
            setFormErrors({...erros})
            setEnviarFormulario(false)
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
            }
        }

        if (Object.keys(erros).length === 0){
            setFormErrors({})
            setEnviarFormulario(true)
        }

        return erros;
    }

    const handleCloseUsuarioNaoCadastradoCoreSSo = ({resetForm}) => {
        resetForm()
        setShowModalUsuarioNaoCadastradoCoreSso(false);
    };

    const handleConfirmaCadastramentoNoCoreSSo = () => {
        setBloquearCampoName(false)
        setShowModalUsuarioNaoCadastradoCoreSso(false)
        setCadastramentoNoCoreSsoConfirmado(true)
    };

    const exibeMsgSalvoComSucesso = () =>{

        const msg_salvo_com_sucesso = {
            titulo: modo === Modos.INSERT ? "Inclusão efetuada com sucesso." : "Alteração efetuada com sucesso.",
            mensagem: modo === Modos.INSERT ? "Usuário adicionado com sucesso" : "Usuário alterado com sucesso"
        }

        toastCustom.ToastCustomSuccess(
            msg_salvo_com_sucesso.titulo,
            msg_salvo_com_sucesso.mensagem,
            'success',
            'top-right',
            true)
    }


    return (
        <Formik
            initialValues={formValues}
            validationSchema={validationSchema}
            enableReinitialize={true}
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={handleSubmitUsuarioForm}
        >
            {props => {
                const {
                    setFieldValue,
                    resetForm,
                    values,
                    errors
                } = props;

                return (
                    <form onSubmit={props.handleSubmit}>
                        <div className="row">
                            <div className="col-12 col-md-6">
                                <div className="form-group">
                                    <label htmlFor="e_servidor">Tipo de usuário</label>
                                    <select
                                        value={values.e_servidor}
                                        onChange={(e) => {
                                            props.handleChange(e);
                                        }}
                                        name="e_servidor"
                                        className="form-control"
                                        disabled={modo !== Modos.INSERT}
                                        onBlur={() => {
                                            validacoesPersonalizadas(values, {
                                                setFieldValue,
                                                resetForm
                                            });
                                        }}
                                        onClick={() => {
                                            setFormErrors({e_servidor: ""})
                                        }}
                                    >
                                        <option value="">Escolha o tipo de usuário</option>
                                        <option value="True">Servidor</option>
                                        <option value="False">Não Servidor</option>
                                    </select>
                                    {errors.e_servidor && <span className="span_erro text-danger mt-1"> {errors.e_servidor}</span>}
                                </div>
                            </div>

                            <div className="col-12 col-md-6">
                                <div className="form-group">
                                    <label htmlFor="username">{values.e_servidor === "False" ? "CPF" : "RF"}</label>
                                    <MaskedInput
                                        mask={idUsuarioCondicionalMask(values.e_servidor)}
                                        showMask={false}
                                        guide={false}
                                        value={values.username ? values.username : ""}
                                        onChange={(e) => {
                                            props.handleChange(e);
                                        }}
                                        name="username"
                                        className="form-control"
                                        placeholder={values.e_servidor === "False" ? "Insira o CPF do usuário, sem ponto nem traço" : "Insira o RF do servidor, sem ponto nem traço"}
                                        disabled={!values.e_servidor || modo !== Modos.INSERT}
                                        onBlur={() => {
                                            validacoesPersonalizadas(values, {
                                                setFieldValue,
                                                resetForm
                                            });
                                        }}
                                        onClick={() => {
                                            setFormErrors({username: ""})
                                        }}
                                    />
                                    {formErrors.username && <p className='mb-0'><span className="span_erro text-danger mt-1">{formErrors.username}</span></p>}
                                </div>
                            </div>

                            {isLoading &&
                                <div className="col-12" style={{ alignItems: "center"  }}>
                                <Loading
                                    corGrafico="black"
                                    corFonte="dark"
                                    marginTop="0"
                                    marginBottom="0"
                                />
                                </div>
                            }

                            {!isLoading &&
                            <div className="col-12 col-md-6">
                                <div className="form-group">
                                    <label htmlFor="name">Nome Completo</label>
                                    <input
                                        type="text"
                                        value={props.values.name ? props.values.name : ""}
                                        onChange={(e) => {
                                            props.handleChange(e);
                                        }}
                                        name="name"
                                        className="form-control"
                                        readOnly={bloquearCampoName}
                                        maxLength='255'
                                        onBlur={() => {
                                            validacoesPersonalizadas(props.values, {
                                                setFieldValue,
                                                resetForm
                                            });
                                        }}
                                        onClick={() => {
                                            setFormErrors({name: ""})
                                        }}
                                    />
                                    {props.errors.name && <span className="span_erro text-danger mt-1"> {props.errors.name}</span>}
                                </div>
                            </div>
                            }

                            {!isLoading &&
                            <div className="col-12 col-md-6">
                                <div className="form-group">
                                    <label htmlFor="email">E-mail</label>
                                    <input
                                        type="text"
                                        value={props.values.email ? props.values.email : ''}
                                        onChange={(e) => {
                                            props.handleChange(e);
                                        }}
                                        name="email"
                                        className="form-control"
                                        placeholder='Insira o email'
                                        maxLength='254'
                                        disabled={!values.e_servidor || !values.username}
                                    />
                                    {props.errors.email && <span className="span_erro text-danger mt-1"> {props.errors.email}</span>}
                                </div>
                            </div>
                            }

                        </div>

                        {!isLoading &&
                        <div className={"barra-botoes-form-user d-flex justify-content-end mt-n2"}>
                            {modo === Modos.EDIT &&
                            <button
                                type="button"
                                onClick={() => {
                                    setShowModalConfirmaRemoverAcesso(true)
                                }}
                                className="btn btn btn-danger mt-2 mr-2"
                            >
                                Remover acesso
                            </button>
                            }
                            <button type="submit" className="btn btn-success mt-2 ml-2">Salvar</button>
                        </div>
                        }

                        <section>
                            <ModalConfirmacao
                                show={showModalUsuarioNaoCadastradoCoreSso}
                                titulo="Usuário não cadastrado"
                                texto="<p>O usuário não existe no CoreSSO deseja criá-lo?</p>"
                                botaoCancelarTexto="Cancelar"
                                botaoCancelarHandle={() => handleCloseUsuarioNaoCadastradoCoreSSo({resetForm})}
                                botaoConfirmarTexto="Cadastrar"
                                botaoConfirmarHandle={() => handleConfirmaCadastramentoNoCoreSSo()}
                            />
                        </section>
                        <section>
                            <ModalValidacao
                                show={showModalValidacaoAcesso}
                                titulo="Usuário não autorizado na unidade"
                                texto={mensagemModalValidacaoAcesso}
                                botaoFecharHandle={() => handleFecharModalValidacaoAcesso({resetForm})}
                            />
                        </section>
                        <section>
                            <ModalConfirmacaoRemoverAcesso
                                show={showModalConfirmaRemoverAcesso}
                                botaoCancelarHandle={() => handleCloseModalConfirmaRemoverAcesso()}
                                botaoConfirmarHandle={() => handleConfirmaRemoverAcesso()}
                                visao={visaoBase}
                            />
                        </section>
                    </form>

                );
            }}
        </Formik>
    )
}

const validationSchema = yup.object().shape(
    {
        e_servidor: yup.string().required("Tipo de usuário é obrigatório"),
        name: yup.string().required("Nome de usuário é obrigatório"),
        email: yup.string().email("Digite um email válido").nullable(),
    }
);
