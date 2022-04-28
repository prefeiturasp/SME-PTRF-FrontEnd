import React, {memo, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import {useLocation, useHistory} from "react-router-dom";
import {ASSOCIACAO_UUID} from "../../../../../services/auth.service";
import {visoesService} from "../../../../../services/visoes.service";
import {TopoComBotoes} from "./TopoComBotoes";
import {FormCadastroDeMembrosDaAssociacao} from "./FormCadastroDeMembrosDaAssociacao";
import {
    consultarCodEol,
    consultarCpfResponsavel,
    consultarRF, consultarListaCargos, criarMembroAssociacao, editarMembroAssociacao, getStatusPresidenteAssociacao,
    getUsuarioPeloUsername,
    getCargosDaDiretoriaExecutiva,
    patchStatusPresidenteAssociacao,
} from "../../../../../services/escolas/Associacao.service";
import {valida_cpf_cnpj} from "../../../../../utils/ValidacoesAdicionaisFormularios";
import Loading from "../../../../../utils/Loading";
import {toastCustom} from "../../../../Globais/ToastCustom";

const CadastroDeMembrosDaAssociacao = () => {

    let uuid_associacao = localStorage.getItem(ASSOCIACAO_UUID);
    const parametros = useLocation();
    const formRef = useRef();
    const history = useHistory();

    const initFormMembro = {
        cargo: "",
        cargo_exibe_form: "",
        id: "",
        uuid: "",
        nome: "",
        cargo_associacao: "",
        cargo_educacao: "",
        representacao: "",
        codigo_identificacao: "",
        email: "",
        cpf: "",
        usuario: "",
        telefone: "",
        cep: "",
        bairro: "",
        endereco: "",
    };

    const [stateFormEditarMembro, setStateFormEditarMembro] = useState(initFormMembro);
    const [switchStatusPresidente, setSwitchStatusPresidente] = useState(false);
    const [responsavelPelasAtribuicoes, setResponsavelPelasAtribuicoes] = useState('');
    const [btnSalvarReadOnly, setBtnSalvarReadOnly] = useState(false);
    const [cpfJaUsado, setCpfJaUsado] = useState(false)

    const [cargosDaDiretoriaExecutiva, setCargosDaDiretoriaExecutiva] = useState([])
    const [loading, setLoading] = useState(true);

    const carregaDadosMembro = useCallback(async () => {
        let mounted = true;
        let init;
        let usuario_existente;

        let infoMembroSelecionado = parametros.state

        if (infoMembroSelecionado && infoMembroSelecionado.infos) {

            if (infoMembroSelecionado.infos.representacao === 'SERVIDOR' || infoMembroSelecionado.infos.representacao === 'ESTUDANTE') {
                usuario_existente = await getUsuarioPeloUsername(infoMembroSelecionado.infos.codigo_identificacao.trim());
            } else {
                usuario_existente = await getUsuarioPeloUsername(infoMembroSelecionado.infos.cpf.trim());
            }
            init = {
                cargo: infoMembroSelecionado.cargo,
                cargo_exibe_form: infoMembroSelecionado.cargo_exibe_form,
                id: infoMembroSelecionado.id,
                uuid: infoMembroSelecionado.infos.uuid ? infoMembroSelecionado.infos.uuid : "",
                nome: infoMembroSelecionado.infos.nome ? infoMembroSelecionado.infos.nome : "",
                cargo_associacao: infoMembroSelecionado.cargo_exibe_form ? infoMembroSelecionado.cargo_exibe_form : "",
                cargo_educacao: infoMembroSelecionado.infos.cargo_educacao ? infoMembroSelecionado.infos.cargo_educacao : "",
                representacao: infoMembroSelecionado.infos.representacao ? infoMembroSelecionado.infos.representacao : "",
                lista_cargos: infoMembroSelecionado.infos.representacao === "SERVIDOR" ? await listaDeCargosInit(infoMembroSelecionado.infos.codigo_identificacao) : [],
                codigo_identificacao: infoMembroSelecionado.infos.codigo_identificacao ? infoMembroSelecionado.infos.codigo_identificacao : "",
                email: infoMembroSelecionado.infos.email ? infoMembroSelecionado.infos.email : "",
                cpf: infoMembroSelecionado.infos.cpf ? infoMembroSelecionado.infos.cpf : "",
                usuario: usuario_existente && usuario_existente.length > 0 ? usuario_existente[0].username : 'Não é usuário do sistema',
                telefone: infoMembroSelecionado.infos.telefone ? infoMembroSelecionado.infos.telefone : "",
                cep: infoMembroSelecionado.infos.cep ? infoMembroSelecionado.infos.cep : "",
                bairro: infoMembroSelecionado.infos.bairro ? infoMembroSelecionado.infos.bairro : "",
                endereco: infoMembroSelecionado.infos.endereco ? infoMembroSelecionado.infos.endereco : "",
            };
        } else {
            init = {
                cargo: infoMembroSelecionado.cargo,
                cargo_exibe_form: infoMembroSelecionado.cargo_exibe_form,
                id: infoMembroSelecionado.id,
                uuid: "",
                nome: "",
                cargo_associacao: infoMembroSelecionado.cargo_exibe_form ? infoMembroSelecionado.cargo_exibe_form : "",
                cargo_educacao: "",
                representacao: "",
                codigo_identificacao: "",
                email: "",
                cpf: "",
                usuario: "",
                telefone: "",
                cep: "",
                bairro: "",
                endereco: ""
            };
        }

        if (mounted){
            setStateFormEditarMembro(init);
            setLoading(false)
        }

        return () =>{
            mounted = false;
        }

    }, [parametros])

    useEffect(() => {
        carregaDadosMembro()
    }, [carregaDadosMembro])

    const carregaStatusPresidenteAssociacao = useCallback(async () => {
        let mounted = true;
        let status = await getStatusPresidenteAssociacao()

        if (mounted){
            setSwitchStatusPresidente(!!(status && status.status_presidente === 'PRESENTE'))
            setResponsavelPelasAtribuicoes(status.cargo_substituto_presidente_ausente ? status.cargo_substituto_presidente_ausente : "")
        }
        return () =>{
            mounted = false;
        }
    }, [])

    useEffect(() => {
        carregaStatusPresidenteAssociacao()
    }, [carregaStatusPresidenteAssociacao])

    const carregaCargosDaDiretoriaExecutiva = useCallback(async () => {
        let mounted = true;
        let cargos = await getCargosDaDiretoriaExecutiva()
        if (mounted){
            setCargosDaDiretoriaExecutiva(cargos)
        }
        return () =>{
            mounted = false;
        }
    }, [])

    useEffect(() => {
        carregaCargosDaDiretoriaExecutiva()
    }, [carregaCargosDaDiretoriaExecutiva])

    const telefoneMaskContitional = (value) => {
        let telefone = value.replace(/[^\d]+/g, "");
        let mask;
        if (telefone.length <= 10) {
            mask = ['(', /\d/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
        } else {
            mask = ['(', /\d/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
        }
        return mask
    }

    const handleChangeEditarMembro = async (name, value) => {
        setStateFormEditarMembro({
            ...stateFormEditarMembro,
            [name]: value
        });
    };

    const handleChangeSwitchStatusPresidente = () => {
        setSwitchStatusPresidente(!switchStatusPresidente)
    }

    const handleChangeResponsavelPelaAtribuicao = (value) => {
        console.log("handleChangeResponsavelPelaAtribuicao ", value)
        setResponsavelPelasAtribuicoes(value)
    }

    const ePresidente = (infoMembro) => {
        return (infoMembro && infoMembro.id === "PRESIDENTE_DIRETORIA_EXECUTIVA")
    };

    const redirectListaDeMembrosDaAssociacao = () => {
        let path = `/membros-da-associacao`;
        history.push(path);
    };

    const listaDeCargos = (dados) => {
        let cargos = [];
        for(let cargo = 0; cargo <= dados.length-1; cargo ++){
            cargos.push(dados[cargo].cargo)
        }

        return cargos;
    }

    const listaDeCargosInit = async (rf) => {
        let servidor = await consultarListaCargos(rf.trim());
        let cargos = listaDeCargos(servidor.data);

        return cargos;
    }

    const possuiMaisDeUmCargoEducacao = (lista) => {
        if(lista && lista.length <= 1){
            return false;
        }

        return true;
    }

    const cod_identificacao_rf = useMemo(() => stateFormEditarMembro.codigo_identificacao, [stateFormEditarMembro.codigo_identificacao]);
    const cod_identificacao_eol = useMemo(() => stateFormEditarMembro.codigo_identificacao, [stateFormEditarMembro.codigo_identificacao]);
    const cod_identificacao_cpf = useMemo(() => stateFormEditarMembro.cpf, [stateFormEditarMembro.cpf]);

    const validateFormMembros = async (values) => {
        const errors = {};
        if (values.representacao === "SERVIDOR") {
            try {
                if (cod_identificacao_rf !== values.codigo_identificacao.trim()) {
                    values.cargo_educacao = "";
                    let rf = await consultarRF(values.codigo_identificacao.trim());
                    let usuario_existente = await getUsuarioPeloUsername(values.codigo_identificacao.trim());
                    if (rf.status === 200 || rf.status === 201) {
                        const init = {
                            ...stateFormEditarMembro,
                            nome: rf.data[0].nm_pessoa,
                            codigo_identificacao: values.codigo_identificacao,
                            cargo_associacao: values.cargo_associacao,
                            cargo_educacao: listaDeCargos(rf.data).length <= 1 ? rf.data[0].cargo : "",
                            lista_cargos: listaDeCargos(rf.data),
                            representacao: values.representacao,
                            email: values.email,
                            cpf: values.cpf,
                            usuario: usuario_existente && usuario_existente.length > 0 ? usuario_existente[0].username : 'Não é usuário do sistema',
                            telefone: values.telefone,
                            cep: values.cep,
                            bairro: values.bairro,
                            endereco: values.endereco,
                        };
                        setStateFormEditarMembro(init);
                    }
                }
                if(values.cargo_educacao === ""){
                    setBtnSalvarReadOnly(true);
                }
                else{
                    setBtnSalvarReadOnly(false);
                }
            } catch (e) {
                setBtnSalvarReadOnly(true);
                let data = e.response.data;
                if (data !== undefined && data.detail !== undefined) {
                    errors.codigo_identificacao = data.detail
                } else {
                    errors.codigo_identificacao = "RF inválido"
                }
            }
        } else if (values.representacao === "ESTUDANTE") {

            if (cod_identificacao_cpf !== values.cpf.trim()) {
                try {
                    if (!(!values.cpf || values.cpf.trim() === "" || !valida_cpf_cnpj(values.cpf))) {
                        await consultarCpfResponsavel(values.cpf);
                    }
                    setCpfJaUsado(false)
                    setBtnSalvarReadOnly(false);
                } catch (e) {
                    let data = e.response.data;
                    if (data !== undefined && data.detail !== undefined) {
                        errors.cpf = 'CPF já cadastrado'
                    }
                    setBtnSalvarReadOnly(true);
                    setCpfJaUsado(true)
                }
            }
            if (cod_identificacao_eol !== values.codigo_identificacao) {

                if (values.codigo_identificacao.trim().length >= 7) {
                    try {
                        let cod_eol = await consultarCodEol(values.codigo_identificacao.trim());
                        let usuario_existente = await getUsuarioPeloUsername(values.codigo_identificacao.trim());
                        if (cod_eol.status === 200 || cod_eol.status === 201) {
                            const init = {
                                ...stateFormEditarMembro,
                                nome: cod_eol.data.nomeAluno,
                                codigo_identificacao: values.codigo_identificacao,
                                cargo_associacao: values.cargo_associacao,
                                cargo_educacao: "",
                                representacao: values.representacao,
                                email: values.email,
                                cpf: values.cpf,
                                usuario: usuario_existente && usuario_existente.length > 0 ? usuario_existente[0].username : 'Não é usuário do sistema',
                                telefone: values.telefone,
                                cep: values.cep,
                                bairro: values.bairro,
                                endereco: values.endereco,
                            };
                            setStateFormEditarMembro(init);
                        }
                        setBtnSalvarReadOnly(false);
                    } catch (e) {
                        setBtnSalvarReadOnly(true);
                        let data = e.response.data;
                        if (data !== undefined && data.detail !== undefined) {
                            errors.codigo_identificacao = data.detail
                        } else {
                            errors.codigo_identificacao = "Código Eol inválido"
                        }
                    }
                } else {
                    setStateFormEditarMembro({
                        ...stateFormEditarMembro,
                        nome: '',
                        codigo_identificacao: values.codigo_identificacao
                    })
                }

            }
        } else if (values.representacao === "PAI_RESPONSAVEL") {
            if (cod_identificacao_cpf !== values.cpf.trim()) {
                setBtnSalvarReadOnly(false);
                try {
                    if (!(!values.cpf || values.cpf.trim() === "" || !valida_cpf_cnpj(values.cpf))) {
                        await consultarCpfResponsavel(values.cpf);
                        let usuario_existente = await getUsuarioPeloUsername(values.cpf.trim());
                        const init = {
                            ...stateFormEditarMembro,
                            cargo_associacao: values.cargo_associacao,
                            cargo_educacao: "",
                            representacao: values.representacao,
                            email: values.email,
                            cpf: values.cpf,
                            usuario: usuario_existente && usuario_existente.length > 0 ? usuario_existente[0].username : 'Não é usuário do sistema',
                            telefone: values.telefone,
                            cep: values.cep,
                            bairro: values.bairro,
                            endereco: values.endereco,
                        };
                        setStateFormEditarMembro(init);
                        setBtnSalvarReadOnly(false);
                    }
                } catch (e) {
                    let data = e.response.data;
                    if (data !== undefined && data.detail !== undefined) {
                        errors.cpf = 'CPF já cadastrado'
                    }
                    setBtnSalvarReadOnly(true);
                }
            }
        } else {
            setBtnSalvarReadOnly(false)
        }
        return errors
    };

    const onSubmitEditarMembro = async () => {
        let enviar_formulario = true
        let erros = {};
        const regex_email = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

        let values = {...formRef.current.values}

        if (values.representacao === "PAI_RESPONSAVEL" || values.representacao === "ESTUDANTE") {
            enviar_formulario = !(!values.cpf || values.cpf.trim() === "" || !valida_cpf_cnpj(values.cpf));
            if (!enviar_formulario) {
                erros = {
                    cpf: "Digite um CPF válido"
                }
                formRef.current.setErrors({...erros})
                return
            }
        }

        if (values.email && !regex_email.test(values.email)) {
            erros = {
                ...erros,
                email: "Digite um email válido"
            }
            formRef.current.setErrors({...erros})
            return
        }

        if (!values.nome.trim()) {
            erros = {
                ...erros,
                nome: 'Nome é obrigatório'
            }
            formRef.current.setErrors({...erros})
            return
        }

        if (values.representacao === "SERVIDOR") {
            if(!values.cargo_educacao.trim()){
                erros = {
                    ...erros,
                    cargo_educacao: 'É obrigatório e não pode ultrapassar 45 caracteres'
                }
                formRef.current.setErrors({...erros})
                return
            }
        }

        if (!switchStatusPresidente && !responsavelPelasAtribuicoes){
            erros = {
                responsavel_pelas_atribuicoes: "Responsável pelas atribuições é obrigatório"
            }
            formRef.current.setErrors({...erros})
            return
        }

        if (enviar_formulario) {
            setLoading(true);
            let payload = {};
            let usuario;

            if (typeof stateFormEditarMembro.usuario === "object" && stateFormEditarMembro.usuario !== null) {
                usuario = stateFormEditarMembro.usuario.id
            } else {
                usuario = stateFormEditarMembro.usuario
            }

            if (stateFormEditarMembro && stateFormEditarMembro.representacao === "SERVIDOR") {
                payload = {
                    'nome': stateFormEditarMembro.nome,
                    'associacao': localStorage.getItem(ASSOCIACAO_UUID),
                    'cargo_associacao': stateFormEditarMembro.id,
                    'cargo_educacao': stateFormEditarMembro.cargo_educacao ? stateFormEditarMembro.cargo_educacao : "",
                    'representacao': stateFormEditarMembro.representacao ? stateFormEditarMembro.representacao : "",
                    'codigo_identificacao': stateFormEditarMembro.codigo_identificacao ? stateFormEditarMembro.codigo_identificacao : "",
                    'email': stateFormEditarMembro.email ? stateFormEditarMembro.email : "",
                    'cpf': "",
                    'usuario': usuario,
                    'telefone': stateFormEditarMembro.telefone ? stateFormEditarMembro.telefone : "",
                    'cep': stateFormEditarMembro.cep ? stateFormEditarMembro.cep : "",
                    'bairro': stateFormEditarMembro.bairro ? stateFormEditarMembro.bairro : "",
                    'endereco': stateFormEditarMembro.endereco ? stateFormEditarMembro.endereco : "",
                };
            } else if (stateFormEditarMembro && stateFormEditarMembro.representacao === "ESTUDANTE") {
                payload = {
                    'nome': stateFormEditarMembro.nome,
                    'associacao': localStorage.getItem(ASSOCIACAO_UUID),
                    'cargo_associacao': stateFormEditarMembro.id,
                    'cargo_educacao': "",
                    'representacao': stateFormEditarMembro.representacao ? stateFormEditarMembro.representacao : "",
                    'codigo_identificacao': stateFormEditarMembro.codigo_identificacao ? stateFormEditarMembro.codigo_identificacao : "",
                    'email': stateFormEditarMembro.email ? stateFormEditarMembro.email : "",
                    'cpf': stateFormEditarMembro.cpf ? stateFormEditarMembro.cpf : "",
                    'usuario': usuario,
                    'telefone': stateFormEditarMembro.telefone ? stateFormEditarMembro.telefone : "",
                    'cep': stateFormEditarMembro.cep ? stateFormEditarMembro.cep : "",
                    'bairro': stateFormEditarMembro.bairro ? stateFormEditarMembro.bairro : "",
                    'endereco': stateFormEditarMembro.endereco ? stateFormEditarMembro.endereco : "",
                };
            } else if (stateFormEditarMembro && stateFormEditarMembro.representacao === "PAI_RESPONSAVEL") {
                payload = {
                    'nome': stateFormEditarMembro.nome,
                    'associacao': localStorage.getItem(ASSOCIACAO_UUID),
                    'cargo_associacao': stateFormEditarMembro.id,
                    'cargo_educacao': "",
                    'representacao': stateFormEditarMembro.representacao ? stateFormEditarMembro.representacao : "",
                    'codigo_identificacao': "",
                    'email': stateFormEditarMembro.email ? stateFormEditarMembro.email : "",
                    'cpf': stateFormEditarMembro.cpf ? stateFormEditarMembro.cpf : "",
                    'usuario': usuario,
                    'telefone': stateFormEditarMembro.telefone ? stateFormEditarMembro.telefone : "",
                    'cep': stateFormEditarMembro.cep ? stateFormEditarMembro.cep : "",
                    'bairro': stateFormEditarMembro.bairro ? stateFormEditarMembro.bairro : "",
                    'endereco': stateFormEditarMembro.endereco ? stateFormEditarMembro.endereco : "",
                };
            }

            let payloadStatusPresidente;

            if (switchStatusPresidente){
                payloadStatusPresidente = {
                    status_presidente: "PRESENTE",
                    cargo_substituto_presidente_ausente: null
                }
            }else {
                payloadStatusPresidente = {
                    status_presidente: "AUSENTE",
                    cargo_substituto_presidente_ausente: responsavelPelasAtribuicoes
                }
            }

            if (stateFormEditarMembro.uuid) {
                try {
                    const response = await editarMembroAssociacao(payload, stateFormEditarMembro.uuid);
                    if (response.status === 200 || response.status === 201) {
                        console.log("Membro editado com sucesso!");
                        await patchStatusPresidenteAssociacao(uuid_associacao, payloadStatusPresidente)
                        toastCustom.ToastCustomSuccess('Membro salvo com sucesso', 'As edições das informações do membro foram salvas com sucesso.')
                        console.log("Status do Presidente editado com sucesso!");
                        redirectListaDeMembrosDaAssociacao()
                    } else {
                        console.log("Erro ao editar Membro")
                    }
                } catch (error) {
                    console.log(error)
                }
            } else {
                try {
                    const response = await criarMembroAssociacao(payload);
                    if (response.status === 200 || response.status === 201) {
                        console.log("Membro criado com sucesso");
                        await patchStatusPresidenteAssociacao(uuid_associacao, payloadStatusPresidente)
                        toastCustom.ToastCustomSuccess('Membro salvo com sucesso', 'As edições das informações do membro foram salvas com sucesso.')
                        console.log("Status do Presidente editado com sucesso!");
                        redirectListaDeMembrosDaAssociacao()
                    } else {
                        console.log("Erro ao criar Membro")
                    }
                } catch (error) {
                    console.log(error)
                }
            }
            setLoading(false)
        }
    }

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Dados da Associação</h1>
            <div className="page-content-inner">
                {loading ? (
                        <Loading
                            corGrafico="black"
                            corFonte="dark"
                            marginTop="0"
                            marginBottom="0"
                        />
                    ) :
                    <>
                        <TopoComBotoes
                            onSubmitEditarMembro={onSubmitEditarMembro}
                            redirectListaDeMembrosDaAssociacao={redirectListaDeMembrosDaAssociacao}
                            visoesService={visoesService}
                            btnSalvarReadOnly={btnSalvarReadOnly}
                            cpfJaUsado={cpfJaUsado}
                        />
                        <FormCadastroDeMembrosDaAssociacao
                            visoesService={visoesService}
                            stateFormEditarMembro={stateFormEditarMembro}
                            validateFormMembros={validateFormMembros}
                            handleChangeEditarMembro={handleChangeEditarMembro}
                            onSubmitEditarMembro={onSubmitEditarMembro}
                            ePresidente={ePresidente}
                            formRef={formRef}
                            telefoneMaskContitional={telefoneMaskContitional}
                            switchStatusPresidente={switchStatusPresidente}
                            handleChangeSwitchStatusPresidente={handleChangeSwitchStatusPresidente}
                            responsavelPelasAtribuicoes={responsavelPelasAtribuicoes}
                            handleChangeResponsavelPelaAtribuicao={handleChangeResponsavelPelaAtribuicao}
                            cargosDaDiretoriaExecutiva={cargosDaDiretoriaExecutiva}
                            possuiMaisDeUmCargoEducacao={possuiMaisDeUmCargoEducacao}
                        />
                    </>
                }
            </div>
        </PaginasContainer>
    )
}

export default memo(CadastroDeMembrosDaAssociacao)