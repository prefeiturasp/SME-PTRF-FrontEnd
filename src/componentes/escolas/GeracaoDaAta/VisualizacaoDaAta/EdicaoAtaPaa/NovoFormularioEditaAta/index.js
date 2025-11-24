import React, {useState, useEffect, useRef} from "react";
import {DatePickerField} from "../../../../../Globais/DatePickerField";
import {toastCustom} from "../../../../../Globais/ToastCustom";
import {visoesService} from "../../../../../../services/visoes.service";
import {FieldArray, Formik} from "formik";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimesCircle, faCheckCircle, faEdit} from "@fortawesome/free-solid-svg-icons";
import {
    getListaPresentesPadraoPaa,
    getMembroPorIdentificadorPaa,
    getParticipantesOrdenadosPorCargoPaa,
    getProfessorGremioInfo
} from "../../../../../../services/escolas/PresentesAtaPaa.service";
import {YupSignupSchemaAta} from "./YupSignupSchemaAta";
import {valida_cpf_exportado} from "../../../../../../utils/ValidacoesAdicionaisFormularios";
import TabelaRepassesPendentes from "../../TabelaRepassesPendentes";
import { Switch } from 'antd';
import { BarraAvisoPreencerData } from "../../../BarraAvisoPreencerData";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import { Tooltip as ReactTooltip } from "react-tooltip";
import {ASSOCIACAO_UUID} from "../../../../../../services/auth.service";
import {
    getCargosComposicaoData
} from "../../../../../../services/Mandatos.service";
import { ModalAntDesignConfirmacao } from "../../../../../Globais/ModalAntDesign";
import {ModalNotificarRegeracaoAta} from "./ModalNotificarRegeracaoAta";
import {getParecerSelecionado, isParecerReprovado} from "../utils";

const adicionaProfessorGremioNaLista = (lista = [], ataUuid, professorDefaults = {}) => {
    const existeProfessor = lista.some(participante => participante.professor_gremio);
    if (existeProfessor) {
        return lista.map(participante => participante.professor_gremio ? ({
            ...participante,
            id: participante.id || participante.uuid || 'professor-gremio',
            professor_gremio: true,
            presente: participante.presente ?? true,
        }) : participante);
    }

    return [
        ...lista,
        {
            id: ataUuid ? `${ataUuid}-professor-gremio` : 'professor-gremio',
            ata: ataUuid || "",
            cargo: professorDefaults.cargo || "",
            identificacao: professorDefaults.identificacao || "",
            nome: professorDefaults.nome || "",
            editavel: true,
            membro: false,
            adicao: false,
            presente: professorDefaults.presente ?? true,
            presidente_da_reuniao: false,
            secretario_da_reuniao: false,
            professor_gremio: true,
        },
    ];
};

const listaPossuiParticipantesAssociacao = (lista = []) => {
    return lista.some(participante => !participante.professor_gremio);
};

const extraiProfessorDefaults = (lista = []) => {
    const professor = lista.find(participante => participante.professor_gremio);
    if (!professor) {
        return null;
    }

    return {
        nome: professor.nome || '',
        cargo: professor.cargo || '',
        identificacao: professor.identificacao || '',
        presente: professor.presente ?? true,
    };
};

const constroiMapaDeMembrosAssociacao = (listaPadrao = []) => {
    return new Set(
        (listaPadrao || [])
            .filter(participante => participante && participante.membro)
            .map(participante => participante.identificacao)
            .filter(identificacao => Boolean(identificacao))
    );
};

const marcaParticipantesComoMembrosDaAssociacao = (listaParticipantes = [], listaPadrao = []) => {
    const identificadoresMembros = constroiMapaDeMembrosAssociacao(listaPadrao);
    return (listaParticipantes || []).map(participante => {
        const ehMembro = Boolean(participante?.membro) || identificadoresMembros.has(participante?.identificacao);
        return {
            ...participante,
            membro: ehMembro
        };
    });
};

export const NovoFormularioEditaAta = ({
                                       stateFormEditarAta,
                                       tabelas,
                                       formRef,
                                       onSubmitFormEdicaoAta,
                                       uuid_ata,
                                       setDisableBtnSalvar,
                                       repassesPendentes,
                                       erros,
                                       showModalAvisoRegeracaoAta,
                                       setShowModalAvisoRegeracaoAta
                                   }) => {

    const podeEditarAta = [['change_ata_prestacao_contas']].some(visoesService.getPermissoes)
    const [dadosForm, setDadosForm] = useState({});
    const [disableBtnAdicionarPresente, setDisableBtnAdicionarPresente] = useState(false);
    const [disableBtnEditarPresente, setDisableBtnEditarPresente] = useState(false);
    const [disableBtnApagarPresente, setDisableBtnApagarPresente] = useState(false);
    const [disableBtnConfirmarEdicao, setDisableConfirmarEdicao] = useState(false);
    const [disableBtnCancelarEdicao, setDisableCancelarEdicao] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [ehAdicaoPresente, setEhAdicaoPresente] = useState(false);
    const [ehEdicaoPresente, setEhEdicaoPresente] = useState([]);
    const [linhaEditada, setLinhaEditada] = useState({})
    const professorLookupTimeouts = useRef({});
    const notificarErroComposicaoPorData = (error) => {
        const mensagemErro = error?.response?.data?.erro || "Não foi possível carregar a composição por data.";
        toastCustom.ToastCustomError("Erro ao carregar participantes", mensagemErro);
    };

    const [listaParticipantes, setListaParticipantes] = useState([]);
    const [professorDefaults, setProfessorDefaults] = useState({
        nome: '',
        cargo: '',
        identificacao: '',
        presente: true
    });
    const [dataModalApagarParticipantesAta, setDataModalApagarParticipantesAta] = useState({
        show: false,
        name: null,
        value: null,
        setFieldValue: null
    });
    
    const associacaoUuid = localStorage.getItem(ASSOCIACAO_UUID);
    const sincronizaListaParticipantes = (novaLista, { atualizarInitialValues = true } = {}) => {
        const professorInfo = extraiProfessorDefaults(novaLista);
        if (professorInfo) {
            setProfessorDefaults(professorInfo);
        }
        if (formRef && formRef.current && typeof formRef.current.setFieldValue === "function") {
            formRef.current.setFieldValue("listaParticipantes", novaLista, false);
        }
        if (atualizarInitialValues) {
            setDadosForm((prevState) => ({
                ...prevState,
                listaParticipantes: novaLista,
            }));
        }
    };
    useEffect(() => {
        return () => {
            Object.values(professorLookupTimeouts.current || {}).forEach((timeoutId) => {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
            });
            professorLookupTimeouts.current = {};
        };
    }, []);

    useEffect(() => {
        const carregarComposicao = async () => {
            try {
                const lista_cargos_composicao = await getCargosComposicaoData(stateFormEditarAta.data_reuniao, associacaoUuid);
                const composicao_formatada = formatarListaCargoComposicaoParaFormatoDaListaParticipantes(lista_cargos_composicao);
                const listaComProfessor = adicionaProfessorGremioNaLista(composicao_formatada, uuid_ata, professorDefaults);
                setListaParticipantes(listaComProfessor);
                sincronizaListaParticipantes(listaComProfessor);
            } catch (error) {
                notificarErroComposicaoPorData(error);
            }
        };

        const precisaCarregarComposicao = (
            !listaParticipantes ||
            listaParticipantes.length === 0 ||
            !listaPossuiParticipantesAssociacao(listaParticipantes)
        );

        if (precisaCarregarComposicao && stateFormEditarAta && stateFormEditarAta.data_reuniao && isValidDateString(stateFormEditarAta.data_reuniao)) {
            carregarComposicao();
        }
    }, [associacaoUuid, listaParticipantes, stateFormEditarAta, uuid_ata, professorDefaults]);

    useEffect(() => {
        setDadosForm((prevState) => ({
            ...prevState,
            stateFormEditarAta: stateFormEditarAta,
        }));
    }, [stateFormEditarAta]);

    useEffect(() => {
        if (!uuid_ata) return;
        const fetchData = async () => {
            try {
                const [listaPresentesAtaResponse, listaPadraoResponse] = await Promise.all([
                    getParticipantesOrdenadosPorCargoPaa(uuid_ata),
                    getListaPresentesPadraoPaa(uuid_ata).catch(() => []),
                ]);
                const listaPresentesAta = marcaParticipantesComoMembrosDaAssociacao(
                    listaPresentesAtaResponse,
                    listaPadraoResponse
                );
                const professorInfo = extraiProfessorDefaults(listaPresentesAta);
                if (professorInfo) {
                    setProfessorDefaults(professorInfo);
                }
                const listaComProfessor = adicionaProfessorGremioNaLista(listaPresentesAta, uuid_ata, professorInfo || professorDefaults);
                setListaParticipantes(listaComProfessor);
                sincronizaListaParticipantes(listaComProfessor);
            } catch (error) {
                console.error("Erro ao carregar participantes da ata PAA", error);
            }
        }
        fetchData();
    }, [uuid_ata]);

    const onClickCancelarAdicao = (remove, lista) => {
        if(lista.length > 0){
            let index = lista.length - 1;    
            setEhAdicaoPresente(false);
            setDisableBtnAdicionarPresente(false);
            setDisableBtnSalvar(false);
            setDisableBtnApagarPresente(false);
            setDisableBtnEditarPresente(false);
            remove(index)
        }
    }

    const onClickEditar = (index, values, membro, presente) => {
        setLinhaEditada(presente);
        
        // bloqueando botoes de apagar e editar das demais linhas
        // bloqueando botões de adicionar presente e salvar alterações durante edição
        setDisableBtnEditarPresente(true);
        setDisableBtnAdicionarPresente(true);
        setDisableBtnApagarPresente(true);
        setDisableBtnSalvar(true);

        // iniciando modo edição do index
        setEhEdicaoPresente(prevState => ({...prevState, [index]: true}))

        let identificador = values.listaParticipantes[index].identificacao;

        if(membro){
            // Na edição, em caso de participante membro da associação, apenas o identificador pode ser alterado. 
            // O nome e o cargo devem ser trazidos do cadastro de membros da Associação
            document.getElementById(`listaParticipantes.nome_[${index}]`).disabled = true;
            document.getElementById(`listaParticipantes.cargo_[${index}]`).disabled = true;
            document.getElementById(`listaParticipantes.identificacao_[${index}]`).disabled = false;
        }
        else{
            // Quando não for membro da associação
            if (identificador.length === 7 && isNumber(identificador)){
                // identificador é de servidor = editar somente identificador
                document.getElementById(`listaParticipantes.nome_[${index}]`).disabled = true;
                document.getElementById(`listaParticipantes.cargo_[${index}]`).disabled = true;
                document.getElementById(`listaParticipantes.identificacao_[${index}]`).disabled = false;
            }
            else{
                // Não é servidor, todos os campos editaveis
                document.getElementById(`listaParticipantes.nome_[${index}]`).disabled = false;
                document.getElementById(`listaParticipantes.cargo_[${index}]`).disabled = false;
                document.getElementById(`listaParticipantes.identificacao_[${index}]`).disabled = false;
            }
        }
        
    }

    const onClickConfirmar = (index, values, setFieldValue) => {
        const participanteAtual = values.listaParticipantes ? values.listaParticipantes[index] : null;
        if(ehEdicaoPresente[index]){
            let presentes = values.listaParticipantes
            let nome = presentes[index].nome
            let podeCadastrar = true;

            for (let i = 0; i <= presentes.length - 1; i++) {
                if (i !== index) {
                    if (nome === presentes[i].nome) {
                        podeCadastrar = false;
                        break;
                    }
                }
            }


            if(podeCadastrar) {
                setFieldValue(`listaParticipantes[${index}].editavel`, false);

                // liberando botoes de apagar e editar das demais linhas
                // liberando botões de adicionar presente e salvar alterações após edição
                setDisableBtnEditarPresente(false);
                setDisableBtnAdicionarPresente(false);
                setDisableBtnApagarPresente(false);
                setDisableBtnSalvar(false);

                // retirando o index do modo edição
                setEhEdicaoPresente(prevState => ({...prevState, [index]: false}))
                document.getElementById(`listaParticipantes.nome_[${index}]`).disabled = true;
                document.getElementById(`listaParticipantes.cargo_[${index}]`).disabled = true;
                document.getElementById(`listaParticipantes.identificacao_[${index}]`).disabled = true;

                erros = {
                    ...erros,
                    [index]: null
                }
                setFormErrors(erros);

                setFieldValue(`listaParticipantes[${index}].adicao`, false)
                setEhAdicaoPresente(false);
            }
            else{
                setFieldValue(`listaParticipantes[${index}].editavel`, true)
                erros = {
                    ...erros,
                    [index]: "Esta pessoa já está na lista de presentes"
                }
                setFormErrors(erros);
            }
        }
        else{
            let presentes = values.listaParticipantes
            let nome = presentes[index].nome
            let podeCadastrar = true;

            for (let i = 0; i <= presentes.length - 1; i++) {
                if (i !== index) {
                    if (nome === presentes[i].nome) {
                        podeCadastrar = false;
                        break;
                    }
                }
            }

            if (podeCadastrar) {
                setFieldValue(`listaParticipantes[${index}].editavel`, false);

                // liberando botoes de apagar e editar das demais linhas
                // liberando botões de adicionar presente e salvar alterações após edição
                setDisableBtnEditarPresente(false);
                setDisableBtnAdicionarPresente(false);
                setDisableBtnApagarPresente(false);
                setDisableBtnSalvar(false);

                erros = {
                    ...erros,
                    [index]: null
                }
                setFormErrors(erros);
                setFieldValue(`listaParticipantes[${index}].adicao`, false)
                setEhAdicaoPresente(false);
                if (participanteAtual && participanteAtual.adicao) {
                    toastCustom.ToastCustomSuccess("Participante inserido com sucesso");
                }
            } else {
                setFieldValue(`listaParticipantes[${index}].editavel`, true)
                setDisableBtnSalvar(true);
                erros = {
                    ...erros,
                    [index]: "Esta pessoa já está na lista de presentes"
                }
                setFormErrors(erros);
            }
        }
    }

    const onClickCancelarEdicao = (index, setFieldValue) => {
        setFieldValue(`listaParticipantes[${index}].editavel`, false)
        setFieldValue(`listaParticipantes[${index}].identificacao`, linhaEditada.identificacao ? linhaEditada.identificacao : '')
        setFieldValue(`listaParticipantes[${index}].nome`, linhaEditada.nome ? linhaEditada.nome : '')
        setFieldValue(`listaParticipantes[${index}].cargo`, linhaEditada.cargo ? linhaEditada.cargo : '')
        setFieldValue(`listaParticipantes[${index}].membro`, linhaEditada.membro ? linhaEditada.membro : false)


        // retirando o index do modo edição
        setEhEdicaoPresente(prevState => ({...prevState, [index]: false}))
        document.getElementById(`listaParticipantes.nome_[${index}]`).disabled = true;
        document.getElementById(`listaParticipantes.cargo_[${index}]`).disabled = true;
        document.getElementById(`listaParticipantes.identificacao_[${index}]`).disabled = true;

        erros = {
            ...erros,
            [index]: null
        }
        setFormErrors(erros);


        setDisableBtnEditarPresente(false);
        setDisableBtnAdicionarPresente(false);
        setDisableBtnApagarPresente(false);
        setDisableBtnSalvar(false);
    }

    const onClickRemoverAdicionar = async (remove, index, editavel, values, setFieldValue) => {
        let erros = {};

        if (editavel) {
            let presentes = values.listaParticipantes
            let nome = presentes[index].nome
            let podeCadastrar = true;

            for (let i = 0; i <= presentes.length - 1; i++) {
                if (i !== index) {
                    if (nome === presentes[i].nome) {
                        podeCadastrar = false;
                        break;
                    }
                }
            }

            if (podeCadastrar) {
                setFieldValue(`listaParticipantes[${index}].editavel`, false)
                setDisableBtnAdicionarPresente(false);
                setDisableBtnSalvar(false);
                erros = {
                    ...erros,
                    [index]: null
                }
                setFormErrors(erros);
                setFieldValue(`listaParticipantes[${index}].adicao`, false)
                setEhAdicaoPresente(false);

            } else {
                setFieldValue(`listaParticipantes[${index}].editavel`, true)
                setDisableBtnSalvar(true);
                erros = {
                    ...erros,
                    [index]: "Esta pessoa já está na lista de presentes"
                }
                setFormErrors(erros);
            }
        } else {
            remove(index)
        }
    }

    const obterParticipanteAtual = (index) => {
        if (!formRef.current || !formRef.current.values || !formRef.current.values.listaParticipantes) {
            return null;
        }
        return formRef.current.values.listaParticipantes[index];
    }

    const atualizarCamposProfessorGremio = (index, setFieldValue, nome = '', cargo = '', bloquearCampos = false, identificacao) => {
        setFieldValue(`listaParticipantes[${index}].nome`, nome);
        setFieldValue(`listaParticipantes[${index}].cargo`, cargo);
        setFieldValue(`listaParticipantes[${index}].membro`, false);
        setFieldValue(`listaParticipantes[${index}].editavel`, false);
        setFieldValue(`listaParticipantes[${index}].professor_gremio`, true);
        if (identificacao !== undefined) {
            setFieldValue(`listaParticipantes[${index}].identificacao`, identificacao);
        }

        setDadosForm((prevState) => {
            if (!prevState || !prevState.listaParticipantes) return prevState;
            const novaLista = [...prevState.listaParticipantes];
            if (novaLista[index]) {
                novaLista[index] = {
                    ...novaLista[index],
                    nome,
                    cargo,
                    identificacao: identificacao !== undefined ? identificacao : novaLista[index].identificacao,
                    membro: false,
                    editavel: false,
                    professor_gremio: true,
                    presente: true,
                };
            }
            return {
                ...prevState,
                listaParticipantes: novaLista
            };
        });
        setProfessorDefaults({
            nome,
            cargo,
            identificacao: identificacao || '',
            presente: true
        });

        const campoNome = document.getElementById(`listaParticipantes.nome_[${index}]`);
        const campoCargo = document.getElementById(`listaParticipantes.cargo_[${index}]`);
        if (campoNome) campoNome.disabled = true;
        if (campoCargo) campoCargo.disabled = true;
    };

    const debouncedBuscarProfessorGremio = (identificador, index, setFieldValue) => {
        if (professorLookupTimeouts.current[index]) {
            clearTimeout(professorLookupTimeouts.current[index]);
        }

        if (!identificador || identificador.length !== 7 || !isNumber(identificador)) {
            atualizarCamposProfessorGremio(index, setFieldValue, '', '', false, identificador);
            return;
        }

        professorLookupTimeouts.current[index] = setTimeout(async () => {
            try {
                const professor = await getProfessorGremioInfo(identificador);
                if (professor && professor.mensagem !== "servidor-nao-encontrado") {
                    atualizarCamposProfessorGremio(index, setFieldValue, professor.nome || '', professor.cargo || '', true, identificador);
                } else {
                    atualizarCamposProfessorGremio(index, setFieldValue, professor?.nome || '', professor?.cargo || '', false, identificador);
                }
            } catch (error) {
                console.error("Erro ao buscar professor do grêmio", error);
                atualizarCamposProfessorGremio(index, setFieldValue, '', '', false, identificador);
            }
        }, 500);
    };

    const handleChangeIdentificador = async (e, setFieldValue, index) => {
        const participanteAtual = obterParticipanteAtual(index);
        const ehProfessorGremio = participanteAtual && participanteAtual.professor_gremio;

        if (ehProfessorGremio) {
            debouncedBuscarProfessorGremio(e.target.value, index, setFieldValue);
            return;
        }

        setFieldValue(`listaParticipantes[${index}].nome`, '')
        setFieldValue(`listaParticipantes[${index}].cargo`, '')

        document.getElementById(`listaParticipantes.nome_[${index}]`).disabled = false;
        document.getElementById(`listaParticipantes.cargo_[${index}]`).disabled = false;
    }

    const isNumber = (n) => {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    const handleBlurIdentificador = async (e, setFieldValue, index) => {
        let identificador = e.target.value
        let data_reuniao = null
        if(dadosForm && dadosForm.stateFormEditarAta && dadosForm.stateFormEditarAta.data_reuniao) {
            data_reuniao = dadosForm.stateFormEditarAta.data_reuniao
        }
        const participanteAtual = formRef && formRef.current && formRef.current.values && formRef.current.values.listaParticipantes
            ? formRef.current.values.listaParticipantes[index]
            : null;
        const ehProfessorGremio = participanteAtual && participanteAtual.professor_gremio;

        if (ehProfessorGremio) {
            if (identificador.length === 7 && isNumber(identificador)) {
                try {
                    const professor = await getProfessorGremioInfo(identificador);
                    const encontrou = professor && professor.mensagem !== "servidor-nao-encontrado";
                    atualizarCamposProfessorGremio(index, setFieldValue, professor && professor.nome ? professor.nome : '', professor && professor.cargo ? professor.cargo : '', !!encontrou, identificador);
                    if (encontrou) {
                        toastCustom.ToastCustomSuccess("Participante inserido com sucesso");
                    }
                } catch (error) {
                    console.error("Erro ao buscar professor do grêmio", error);
                    atualizarCamposProfessorGremio(index, setFieldValue, '', '', false, identificador);
                }
            } else {
                atualizarCamposProfessorGremio(index, setFieldValue, '', '', false, identificador);
            }
            return;
        }

        const dataFormatada = formatDate(data_reuniao);

        if (identificador.length === 7 && isNumber(identificador)) {
            let membro = await getMembroPorIdentificadorPaa(uuid_ata, identificador, dataFormatada)

            if (membro.mensagem === "membro-encontrado") {
                setFieldValue(`listaParticipantes[${index}].nome`, membro.nome ? membro.nome : '')
                setFieldValue(`listaParticipantes[${index}].cargo`, membro.cargo ? membro.cargo : '')
                setFieldValue(`listaParticipantes[${index}].membro`, true)
            } else {
                setFieldValue(`listaParticipantes[${index}].nome`, membro.nome ? membro.nome : '')
                setFieldValue(`listaParticipantes[${index}].cargo`, membro.cargo ? membro.cargo : '')
                setFieldValue(`listaParticipantes[${index}].membro`, false)
            }

            document.getElementById(`listaParticipantes.nome_[${index}]`).disabled = true;
            document.getElementById(`listaParticipantes.cargo_[${index}]`).disabled = true;
        } else if (identificador.length === 5 && isNumber(identificador)) {
            let membro = await getMembroPorIdentificadorPaa(uuid_ata, identificador, dataFormatada)

            if (membro.mensagem === "membro-encontrado") {
                setFieldValue(`listaParticipantes[${index}].nome`, membro.nome ? membro.nome : '')
                setFieldValue(`listaParticipantes[${index}].cargo`, membro.cargo ? membro.cargo : '')
                setFieldValue(`listaParticipantes[${index}].membro`, true)
            } else {
                setFieldValue(`listaParticipantes[${index}].nome`, membro.nome ? membro.nome : '')
                setFieldValue(`listaParticipantes[${index}].cargo`, membro.cargo ? membro.cargo : '')
                setFieldValue(`listaParticipantes[${index}].membro`, false)
            }

            document.getElementById(`listaParticipantes.nome_[${index}]`).disabled = true;
            document.getElementById(`listaParticipantes.cargo_[${index}]`).disabled = true;
        } else if (identificador.length === 14 && valida_cpf_exportado(identificador)) {
            let membro = await getMembroPorIdentificadorPaa(uuid_ata, identificador, dataFormatada)

            if (membro.mensagem === "membro-encontrado") {
                setFieldValue(`listaParticipantes[${index}].nome`, membro.nome ? membro.nome : '')
                setFieldValue(`listaParticipantes[${index}].cargo`, membro.cargo ? membro.cargo : '')
                setFieldValue(`listaParticipantes[${index}].membro`, true)
            } else {
                setFieldValue(`listaParticipantes[${index}].nome`, membro.nome ? membro.nome : '')
                setFieldValue(`listaParticipantes[${index}].cargo`, membro.cargo ? membro.cargo : '')
                setFieldValue(`listaParticipantes[${index}].membro`, false)
            }

            document.getElementById(`listaParticipantes.nome_[${index}]`).disabled = true;
            document.getElementById(`listaParticipantes.cargo_[${index}]`).disabled = true;
        } else {
            setFieldValue(`listaParticipantes[${index}].nome`, '')
            setFieldValue(`listaParticipantes[${index}].cargo`, '')
            setFieldValue(`listaParticipantes[${index}].membro`, false)

            document.getElementById(`listaParticipantes.nome_[${index}]`).disabled = false;
            document.getElementById(`listaParticipantes.cargo_[${index}]`).disabled = false;
        }
    };


    const nomeCampoIdentificador = (identificador) => {
        if (identificador && identificador.length === 7 && isNumber(identificador)) {
            return "RF"
        } else if (identificador && identificador.length === 5 && isNumber(identificador)) {
            return "Código EOL do aluno"
        } else if (identificador && identificador.length === 14 && valida_cpf_exportado(identificador)) {
            return "CPF"
        } else {
            return "Identificador (opcional)"
        }
    }

    const nomeCampoCargo = (identificador, professor=false) => {
        if (professor) {
            return "Cargo";
        }
        if (identificador && identificador.length === 7 && isNumber(identificador)) {
            return "Cargo"
        } else if (identificador && identificador.length === 5 && isNumber(identificador)) {
            return "Cargo"
        } else if (identificador && identificador.length === 14 && valida_cpf_exportado(identificador)) {
            return "Cargo"
        } else {
            return "Cargo (opcional)"
        }
    }

    const isValidDate = (date) => {
        return date instanceof Date && !isNaN(date);
    };

    const isValidDateString = (dateString) => {
        var parsedDate = new Date(dateString);
        return !isNaN(parsedDate.getTime()) && parsedDate.toISOString().slice(0,10) === dateString;
    };

    const isValidDateOrDateString = (value) => {
        return isValidDate(value) || isValidDateString(value);
    };

    const normalizaParaData = (valor) => {
        if (valor instanceof Date) {
            return valor;
        }
        const data = new Date(valor);
        return isNaN(data.getTime()) ? null : data;
    }

    const formatDate = (date) => {
        const dataNormalizada = normalizaParaData(date);
        if (!dataNormalizada) {
            return null;
        }
        const ano = dataNormalizada.getFullYear();
        const mes = String(dataNormalizada.getMonth() + 1).padStart(2, '0');
        const dia = String(dataNormalizada.getDate()).padStart(2, '0');
        return `${ano}-${mes}-${dia}`;
    }

    const formatarListaCargoComposicaoParaFormatoDaListaParticipantes = (lista_cargos_composicao) => {
        let lista_formatada = [];

        if(lista_cargos_composicao && lista_cargos_composicao.diretoria_executiva) {
            lista_cargos_composicao.diretoria_executiva.forEach(membro => {
                lista_formatada.push({
                    id: membro.id,
                    cargo: membro.cargo,
                    identificacao: membro.identificacao,
                    membro: true,
                    nome: membro.nome,
                    presente: true,
                    presidente_da_reuniao: false,
                    secretario_da_reuniao: false,
                    professor_gremio: false,
                });
            });
        }

        if(lista_cargos_composicao && lista_cargos_composicao.conselho_fiscal) {
            lista_cargos_composicao.conselho_fiscal.forEach(membro => {
                lista_formatada.push({
                    id: membro.id,
                    cargo: membro.cargo,
                    identificacao: membro.identificacao,
                    membro: true,
                    nome: membro.nome,
                    presente: true,
                    presidente_da_reuniao: false,
                    secretario_da_reuniao: false,
                    professor_gremio: false,
                });
            });
        }
        
        return lista_formatada;
    }

    const handleChangeDate = async (value, name, setFieldValue) => {
        if(isValidDate(value)) {
            setFieldValue(name, value);
            const data_formatada = formatDate(value)
            try {
                const lista_cargos_composicao = await getCargosComposicaoData(data_formatada, associacaoUuid)
                const listaFormatada = formatarListaCargoComposicaoParaFormatoDaListaParticipantes(lista_cargos_composicao);
                const listaComProfessor = adicionaProfessorGremioNaLista(listaFormatada, uuid_ata, professorDefaults);
                setListaParticipantes(listaComProfessor);
                sincronizaListaParticipantes(listaComProfessor);
            } catch (error) {
                notificarErroComposicaoPorData(error);
            }
            setDadosForm((prevState) => ({
                ...prevState,
                stateFormEditarAta: {
                    ...formRef.current.values.stateFormEditarAta,
                    data_reuniao: value
                }
            }));
            return;
        }
        
        return setDataModalApagarParticipantesAta({
            show: true,
            value: value,
            name: name,
            setFieldValue: setFieldValue
        });
    };

    const handleCancelarRemocaoParticipantes = () => {
        return setDataModalApagarParticipantesAta({
            show: false,
            name: null,
            value: null,
            setFieldValue: null
        });
    }

    const handleConfirmarRemocaoParticipantes = () => {
        const {name, value, setFieldValue} = dataModalApagarParticipantesAta;
        setFieldValue(name, value);
        const listaComProfessor = adicionaProfessorGremioNaLista([], uuid_ata, professorDefaults);
        setListaParticipantes(listaComProfessor);
        sincronizaListaParticipantes(listaComProfessor);

        setDadosForm((prevState) => ({
            ...prevState,
            stateFormEditarAta: {
                ...formRef.current.values.stateFormEditarAta,
                data_reuniao: value
            }
        }));

        return setDataModalApagarParticipantesAta({
            show: false,
            name: null,
            value: null,
            setFieldValue: null
        });
    }

    const editaStatusDePresencaParticipante = (index, listaAtual) => {
        let copiaListaParticipantes = listaAtual.map(participante => ({...participante}));

        const participanteSelecionado = copiaListaParticipantes[index];

        if (participanteSelecionado) {
            participanteSelecionado.presidente_da_reuniao = false;
            participanteSelecionado.secretario_da_reuniao = false;
            participanteSelecionado.presente = !participanteSelecionado.presente;
            if (participanteSelecionado.professor_gremio) {
                setProfessorDefaults(prev => ({
                    ...prev,
                    presente: participanteSelecionado.presente
                }));
            }
        }

        sincronizaListaParticipantes(copiaListaParticipantes, { atualizarInitialValues: false });
    }

    const editaStatusDePresidenteDaReuniao = (index, listaAtual) => {
        const copiaListaParticipantes = listaAtual.map(participante => ({...participante}));
        const participanteSelecionado = copiaListaParticipantes[index];
    
        if (participanteSelecionado) {
            const novoValor = !participanteSelecionado.presidente_da_reuniao;
            copiaListaParticipantes.forEach((membro, idx) => {
                membro.presidente_da_reuniao = idx === index ? novoValor : false;
            });
        }

        sincronizaListaParticipantes(copiaListaParticipantes, { atualizarInitialValues: false });
    }

    const editaStatusDeSecretarioDaReuniao = (index, listaAtual) => {
        const copiaListaParticipantes = listaAtual.map(participante => ({...participante}));
        const participanteSelecionado = copiaListaParticipantes[index];
    
        if (participanteSelecionado) {
            const novoValor = !participanteSelecionado.secretario_da_reuniao;
            copiaListaParticipantes.forEach((membro, idx) => {
                membro.secretario_da_reuniao = idx === index ? novoValor : false;
            });
        }

        sincronizaListaParticipantes(copiaListaParticipantes, { atualizarInitialValues: false });
    }

    return (

        <div>
            {dadosForm && dadosForm.stateFormEditarAta
                ?
                <Formik
                    initialValues={dadosForm}
                    enableReinitialize={true}
                    validateOnBlur={true}
                    validateOnChange={true}
                    validationSchema={YupSignupSchemaAta}
                    onSubmit={onSubmitFormEdicaoAta}
                    innerRef={formRef}

                >
                    {props => {
                        const {
                            values,
                            errors,
                            setFieldValue
                        } = props;
                        const listaValores = values.listaParticipantes || [];
                        const todosIndices = listaValores.map((_, idx) => idx);
                        const indiceProfessorGremio = listaValores.findIndex(participante => participante.professor_gremio);
                        const indicesOrdenados = indiceProfessorGremio >= 0
                            ? [...todosIndices.filter(idx => idx !== indiceProfessorGremio), indiceProfessorGremio]
                            : todosIndices;
                        const parecerSelecionado = getParecerSelecionado(tabelas?.pareceres, values.stateFormEditarAta.parecer_conselho);
                        const deveExibirCampoMotivo = isParecerReprovado(parecerSelecionado);

                        return (
                            <>
                                <form onSubmit={props.handleSubmit}>
                                    <p className="titulo"><strong>Informações da reunião</strong></p>
                                    <div className="form-row mt-4">
                                        <div className="col-3">
                                            <label htmlFor="stateFormEditarAta.tipo_reuniao">Tipo de Reunião</label>
                                            <select
                                                value={values.stateFormEditarAta.tipo_reuniao}
                                                onChange={props.handleChange}
                                                name="stateFormEditarAta.tipo_reuniao"
                                                className="form-control"
                                                disabled={!podeEditarAta}
                                            >
                                                {tabelas && tabelas.tipos_reuniao && tabelas.tipos_reuniao.map((tipo) =>
                                                    <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-row mt-4">
                                        <div className="col">
                                            <label htmlFor="stateFormEditarAta.data_reuniao">Data
                                                <span className='font-weight-normal' data-tooltip-content={"Preencha a data da reunião para visualização dos participantes."} data-html={true}>
                                                    <FontAwesomeIcon
                                                        style={{marginLeft: "4px"}}
                                                        icon={faInfoCircle}
                                                    />
                                                    <ReactTooltip/>
                                                </span>
                                            </label>
                                            <DatePickerField
                                                id="stateFormEditarAta.data_reuniao"
                                                name="stateFormEditarAta.data_reuniao"
                                                value={values.stateFormEditarAta.data_reuniao}
                                                onChange={(name, value) => {
                                                    handleChangeDate(value, name, setFieldValue)
                                                }}
                                                disabled={!podeEditarAta}
                                            />
                                        </div>

                                        <div className="col">
                                            <label htmlFor="stateFormEditarAta.hora_reuniao">Hora</label>
                                            <input
                                                value={values.stateFormEditarAta.hora_reuniao}
                                                onChange={props.handleChange}
                                                name="stateFormEditarAta.hora_reuniao"
                                                className="form-control"
                                                disabled={!podeEditarAta}
                                                type="time"
                                            />
                                        </div>

                                        <div className="col">
                                            <label htmlFor="stateFormEditarAta.local_reuniao">Local da reunião</label>
                                            <input
                                                value={values.stateFormEditarAta.local_reuniao}
                                                onChange={props.handleChange}
                                                name="stateFormEditarAta.local_reuniao"
                                                className="form-control"
                                                disabled={!podeEditarAta}
                                            />
                                        </div>

                                        <div className="col">
                                            <label htmlFor="stateFormEditarAta.convocacao">Abertura da reunião</label>
                                            <select
                                                value={values.stateFormEditarAta.convocacao}
                                                onChange={props.handleChange}
                                                name="stateFormEditarAta.convocacao"
                                                className="form-control"
                                                disabled={!podeEditarAta}
                                            >
                                                {tabelas && tabelas.convocacoes && tabelas.convocacoes.map((tipo) =>
                                                    <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
                                                )}
                                            </select>
                                        </div>
                                    </div>

                                    {repassesPendentes && repassesPendentes.length > 0 &&
                                        <>
                                            <div className='row'>
                                                <div className="col">
                                                    <p className="titulo mt-4"><strong>Valores repassados pendentes de crédito</strong></p>
                                                    <TabelaRepassesPendentes
                                                        repassesPendentes={repassesPendentes}
                                                    />
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className="col">
                                                    <label htmlFor="stateFormEditarAta.cargo_secretaria_reuniao" className="mt-3">Justificativa</label>
                                                    <textarea
                                                        value={values.stateFormEditarAta.justificativa_repasses_pendentes}
                                                        onChange={props.handleChange}
                                                        name="stateFormEditarAta.justificativa_repasses_pendentes"
                                                        className="form-control"
                                                    />
                                                    {erros && erros.justificativa_repasses_pendentes &&
                                                        <span className='text-danger'>{erros.justificativa_repasses_pendentes}</span>
                                                    }
                                                </div>
                                            </div>
                                        </>
                                    }

                                    <p className="titulo mt-4"><strong>Participantes</strong></p>

                                    {values.listaParticipantes && values.listaParticipantes.length > 0 && values.stateFormEditarAta && values.stateFormEditarAta.data_reuniao && isValidDateOrDateString(values.stateFormEditarAta.data_reuniao) ? 
                                            <FieldArray
                                                name={"listaParticipantes"}
                                                render={({remove, push}) => (
                                                    <>
                                    {listaValores && listaValores.length > 0 && indicesOrdenados.map((index) => {
                                                            const membro = listaValores[index];
                                                            const isProfessorGremio = Boolean(membro.professor_gremio);
                                                            const estaEmModoEdicao = Boolean(ehEdicaoPresente[index]);
                                                            const estaEmModoAdicao = Boolean(membro.adicao);
                                                            const estaEditavel = Boolean(membro.editavel);
                                                            const linhaPersistida = !estaEmModoAdicao && !estaEditavel;
                                                            const possuiIdentificadorPersistencia = Boolean(membro?.id || membro?.uuid || membro?.participante_uuid);
                                                            const registroSincronizado = linhaPersistida && possuiIdentificadorPersistencia;
                                                            const deveMostrarAcoesEdicao = !estaEmModoEdicao && !isProfessorGremio && !membro.membro && !registroSincronizado;
                                                            const deveMostrarControlesPresenca = !estaEmModoEdicao && (membro.membro || isProfessorGremio || registroSincronizado);
                                                            const ehParticipanteManualPersistido = registroSincronizado && !membro.membro && !isProfessorGremio;
                                                            return (
                                                                <div key={index}>
                                                                    <div className={`form-row ${membro.adicao ? 'adicao-presente' : ''}`}>
                                                                        <div className="col-3">
                                                                            <label
                                                                                htmlFor={`listaParticipantes.identificacao_[${index}]`}
                                                                                className="mt-3">{isProfessorGremio ? "RF Professor Orientador do Grêmio" : nomeCampoIdentificador(membro.identificacao)}</label>
                                                                            <input
                                                                                name={`listaParticipantes[${index}].identificacao`}
                                                                                id={`listaParticipantes.identificacao_[${index}]`}
                                                                                className="form-control"
                                                                                value={membro.identificacao}
                                                                                onChange={(e) => {
                                                                                    props.handleChange(e);
                                                                                    handleChangeIdentificador(e, setFieldValue, index)
                                                                                }}
                                                                                onBlur={(e) => {
                                                                                    handleBlurIdentificador(e, setFieldValue, index)
                                                                                }}
                                                                                disabled={!membro.editavel && !isProfessorGremio}
                                                                            />
                                                                        </div>
    
                                                                        <div className="col-3">
                                                                            <label
                                                                                htmlFor={`listaParticipantes.nome_[${index}]`}
                                                                                className="mt-3">Nome</label>
                                                                            <input
                                                                                name={`listaParticipantes[${index}].nome`}
                                                                                id={`listaParticipantes.nome_[${index}]`}
                                                                                className="form-control"
                                                                                value={membro.nome}
                                                                                onChange={(e) => {
                                                                                    props.handleChange(e);
                                                                                }}
                                                                                disabled={isProfessorGremio ? true : !membro.editavel}
                                                                            />
                                                                            <p className='mt-1 mb-0'><span
                                                                                className="text-danger">{errors && errors.listaParticipantes && errors.listaParticipantes[index] && errors.listaParticipantes[index].nome ? errors.listaParticipantes[index].nome : ''}</span>
                                                                            </p>
                                                                            <p className='mt-1 mb-0'><span
                                                                                className="text-danger">{formErrors && formErrors[index] ? formErrors[index] : null}</span>
                                                                            </p>
    
                                                                        </div>
    
                                                                        <div className="col-3">
                                                                            <label
                                                                                htmlFor={`listaParticipantes.cargo_[${index}]`}
                                                                                className="mt-3">{nomeCampoCargo(membro.identificacao, isProfessorGremio)}</label>
                                                                            <input
                                                                                name={`listaParticipantes[${index}].cargo`}
                                                                                id={`listaParticipantes.cargo_[${index}]`}
                                                                                className="form-control"
                                                                                value={isProfessorGremio ? (membro.cargo ? `${membro.cargo} / Professor Orientador` : 'Professor Orientador') : (membro.cargo ? membro.cargo : '')}
                                                                                onChange={(e) => {
                                                                                    props.handleChange(e);
                                                                                }}
                                                                                disabled={isProfessorGremio ? true : !membro.editavel}
                                                                            />
                                                                        </div>
    
                                                                        <div className="col-3">
                                                                            {ehAdicaoPresente && membro.editavel &&
                                                                                <button
                                                                                    id={`listaParticipantes.btn_[${index}]`}
                                                                                    type="button"
                                                                                    className={`btn btn-outline-success btn-confirmar mt-5`}
                                                                                    
                                                                                    disabled={errors && errors.listaParticipantes && errors.listaParticipantes[index] && errors.listaParticipantes[index].nome ? errors.listaParticipantes[index].nome : ''}
                                                                                    onClick={() => {
                                                                                        
                                                                                        onClickConfirmar(index, values, setFieldValue);
                                                                                    }}
                                                                                >
                                                                                    <strong>
                                                                                        <FontAwesomeIcon
                                                                                            style={{
                                                                                                fontSize: '12px',
                                                                                                marginRight: "4px",
                                                                                                color: "#00585E"
                                                                                            }}
                                                                                            icon={faCheckCircle}
                                                                                        />
                                                                                        Confirmar
                                                                                    </strong>
                                                                                </button>
                                                                            }
    
                                                                            {deveMostrarAcoesEdicao &&
                                                                                <>     
                                                                                    <div className="row">
                                                                                        <div className="col-6 mt-5 d-flex justify-content-end">
                                                                                            <button
                                                                                                id={`listaParticipantes.btn_[${index}]`}
                                                                                                type="button"
                                                                                                className="btn btn-outline-danger btn-base-vermelho-outline"
                                                                                                disabled={(errors && errors.listaParticipantes && errors.listaParticipantes[index] && errors.listaParticipantes[index].nome ? errors.listaParticipantes[index].nome : '') || disableBtnApagarPresente}
                                                                                                hidden={disableBtnApagarPresente}
                                                                                                onClick={() => {
                                                                                                    onClickRemoverAdicionar(remove, index, membro.editavel, values, setFieldValue)
                                                                                                }}
                                                                                            >
                                                                                                <FontAwesomeIcon
                                                                                                    className="icon-btn-base-vermelho-outline"
                                                                                                    icon={faTimesCircle}
                                                                                                />
                                                                                                <strong className="text-btn-base-vermelho-outline">
                                                                                                Remover
                                                                                                </strong>
                                                                                            </button>
                                                                                        </div>
                                                                                        <div className="col-6 mt-5 d-flex justify-content-start">
                                                                                            <button
                                                                                                id={`listaParticipantes.btn_[${index}]`}
                                                                                                type="button"
                                                                                                className="btn btn-outline-success btn-base-verde-outline"
                                                                                                disabled={(errors && errors.listaParticipantes && errors.listaParticipantes[index] && errors.listaParticipantes[index].nome ? errors.listaParticipantes[index].nome : '') || disableBtnEditarPresente}
                                                                                                hidden={disableBtnEditarPresente}
                                                                                                onClick={() => {
                                                                                                    onClickEditar(index, values, membro.membro, membro)
                                                                                                }}
                                                                                            >
                                                                                                <FontAwesomeIcon
                                                                                                    className="icon-btn-base-verde-outline"
                                                                                                    icon={faEdit}
                                                                                                />
                                                                                                <strong className="text-btn-base-verde-outline">
                                                                                                Editar
                                                                                                </strong>
                                                                                            </button>
                                                                                        </div>    
                                                                                    </div>                                                                   
                                                                                </>
                                                                            }
    
                                                                            {deveMostrarControlesPresenca &&
                                                                                <>
                                                                                <div className="row">
                                                                                   <div className='col-3 mt-4 ml-4' style={{ opacity: `${ehAdicaoPresente || !podeEditarAta ? "30%" : '100%'}` }}>
                                                                                       <div className="row">
                                                                                           <span className='mr-3' style={{whiteSpace: 'nowrap'}}>Membro estava: </span>
                                                                                        </div>
                                                                                        <div className="row">
                                                                                            <Switch
                                                                                                style={{width: '100%'}}
                                                                                                onChange={() => editaStatusDePresencaParticipante(index, values.listaParticipantes)}
                                                                                                checked={membro.presente}
                                                                                                name="statusPresencaSwitch"
                                                                                                checkedChildren="Presente"
                                                                                                unCheckedChildren="Ausente"
                                                                                                className={`mt-2 switch-status-presidente ${membro.presente ? "switch-status-presidente-checked" : ""}`}
                                                                                                disabled={ehAdicaoPresente || !podeEditarAta}
                                                                                            />
                                                                                        </div>
                                                                                    </div>

                                                                                    {!ehParticipanteManualPersistido && (
                                                                                        <div className='col-3 mt-4 ml-4' style={{ opacity: `${ehAdicaoPresente || !podeEditarAta ? "30%" : '100%'}` }}>
                                                                                            <div className="row">
                                                                                                <span className='mr-2'>Presidente: </span>
                                                                                            </div>
                                                                                            <div className="row">
                                                                                                <Switch
                                                                                                    style={{width: '100%'}}
                                                                                                    onChange={() => editaStatusDePresidenteDaReuniao(index, values.listaParticipantes)}
                                                                                                    checked={membro.presidente_da_reuniao}
                                                                                                    name="statusPresidenteSwitch"
                                                                                                    className={`mt-2 switch-status-presidente ${membro.presidente_da_reuniao ? "switch-status-presidente-checked" : ""}`}
                                                                                                    disabled={ehAdicaoPresente || membro.secretario_da_reuniao || !podeEditarAta || !membro.presente}
                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                    )}

                                                                                    {!ehParticipanteManualPersistido && (
                                                                                        <div className='col-3 mt-4 ml-3' style={{ opacity: `${ehAdicaoPresente || !podeEditarAta ? "30%" : '100%'}` }}>
                                                                                            <div className="row">
                                                                                                <span className='mr-2'>Secretário: </span>
                                                                                            </div>
                                                                                            <div className="row">
                                                                                                <Switch
                                                                                                    style={{width: '100%'}}
                                                                                                    onChange={() => editaStatusDeSecretarioDaReuniao(index, values.listaParticipantes)}
                                                                                                    checked={membro.secretario_da_reuniao}
                                                                                                    name="statusSecretarioSwitch"
                                                                                                    className={`mt-2 switch-status-presidente ${membro.secretario_da_reuniao ? "switch-status-presidente-checked" : ""}`}
                                                                                                    disabled={ehAdicaoPresente || membro.presidente_da_reuniao || !podeEditarAta || !membro.presente}
                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                                </>
                                                                            }
    
                                                                            {ehEdicaoPresente[index] &&
                                                                                <>
                                                                                    <button
                                                                                        id={`listaParticipantes.btn_[${index}]`}
                                                                                        type="button"
                                                                                        className="link-btn-ata btn-cancelar-edicao pb-0 mb-0"
                                                                                        disabled={disableBtnCancelarEdicao}
                                                                                        onClick={() => {
                                                                                            onClickCancelarEdicao(index, setFieldValue)
                                                                                        }}
                                                                                    >
                                                                                        <strong>
                                                                                            <FontAwesomeIcon
                                                                                                style={{
                                                                                                    fontSize: '12px',
                                                                                                    marginRight: "4px",
                                                                                                    color: "#B40C02"
                                                                                                }}
                                                                                                icon={faTimesCircle}
                                                                                            />
                                                                                            Cancelar
                                                                                        </strong>
                                                                                    </button>
                                                                                    <br/>
                                                                                    <button
                                                                                        id={`listaParticipantes.btn_[${index}]`}
                                                                                        type="button"
                                                                                        className="link-btn-ata btn-confirmar-edicao-presente mt-0 pt-0"
                                                                                        disabled={(errors && errors.listaParticipantes && errors.listaParticipantes[index] && errors.listaParticipantes[index].nome ? errors.listaParticipantes[index].nome : '') || disableBtnConfirmarEdicao}
                                                                                        onClick={() => {
                                                                                            onClickConfirmar(index, values, setFieldValue);
                                                                                        }}
                                                                                    >
                                                                                        <strong>
                                                                                            <FontAwesomeIcon
                                                                                                style={{
                                                                                                    fontSize: '12px',
                                                                                                    marginRight: "4px",
                                                                                                    color: "#00585E"
                                                                                                }}
                                                                                                icon={faCheckCircle}
                                                                                            />
                                                                                            Confirmar
                                                                                        </strong>
                                                                                    </button>
                                                                                </>
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
    
                                                        <div className={`form-row ${ehAdicaoPresente ? 'adicao-presente' : ''}`}>
                                                            <div className="col-12">
                                                                <div className={`d-flex  justify-content-start mt-3 mb-3`}>
                                                                    <button
                                                                        disabled={disableBtnAdicionarPresente || !podeEditarAta}
                                                                        type="button"
                                                                        className="btn btn-outline-success mt-1 mr-2"
                                                                        onClick={() => {
                                                                            setDisableBtnAdicionarPresente(true)
                                                                            setDisableBtnSalvar(true)
                                                                            setEhAdicaoPresente(true)
                                                                            setDisableBtnApagarPresente(true);
                                                                            setDisableBtnEditarPresente(true);
                                                                            push({
                                                                                ata: uuid_ata,
                                                                                cargo: '',
                                                                                identificacao: '',
                                                                                editavel: true,
                                                                                nome: '',
                                                                                membro: false,
                                                                                adicao: true,
                                                                                professor_gremio: false
                                                                            });
                                                                        }}
                                                                    >
                                                                        + Adicionar presente
                                                                    </button>
    
                                                                    {ehAdicaoPresente &&
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn btn-outline-success mt-1 mr-2"
                                                                            onClick={() => {
                                                                                onClickCancelarAdicao(remove, values.listaParticipantes)
                                                                            }}
                                                                        >
                                                                            Cancelar
                                                                        </button>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            >
                                            </FieldArray>
                                        : <BarraAvisoPreencerData/>
                                    }

                                    {/*So exibe o campo retificações em atas de retificação*/}
                                    {stateFormEditarAta && stateFormEditarAta.tipo_ata === 'RETIFICACAO' &&
                                        <div>
                                            <p className="titulo mt-4"><strong>Retificações</strong></p>
                                            <div className="form-row">
                                                <div className="col-12">
                                                    <label htmlFor="stateFormEditarAta.retificacoes"
                                                           className="mb-0">Utilize
                                                        esse campo para registrar as retificações da Prestação
                                                        de Contas.</label>
                                                    <textarea
                                                        rows="3"
                                                        placeholder="Escreva seu texto aqui"
                                                        value={values.stateFormEditarAta.retificacoes}
                                                        onChange={props.handleChange}
                                                        name="stateFormEditarAta.retificacoes"
                                                        className="form-control mt-2"
                                                        disabled={!podeEditarAta}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    }

                                    <p className="titulo mt-4"><strong>Manifestações, Comentários e Justificativas</strong></p>
                                    <div className="form-row">
                                        <div className="col-12">
                                            <label htmlFor="stateFormEditarAta.comentarios" className="mb-0">Utilize o campo abaixo para registro de manifestações, comentários e justificativas que eventualmente ocorram durante a reunião</label>
                                            <textarea
                                                rows="3"
                                                placeholder="Escreva seu texto aqui"
                                                value={values.stateFormEditarAta.comentarios}
                                                onChange={props.handleChange}
                                                name="stateFormEditarAta.comentarios"
                                                className="form-control mt-2"
                                                disabled={!podeEditarAta}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row mt-4">
                                        <div className="col-12">
                                            <p className="titulo mb-2"><strong>Como os presentes se posicionam ao PAA apresentado?</strong></p>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <select
                                                value={values.stateFormEditarAta.parecer_conselho}
                                                onChange={(event) => {
                                                    setFieldValue("stateFormEditarAta.parecer_conselho", event.target.value);
                                                    const selecionado = getParecerSelecionado(tabelas?.pareceres, event.target.value);
                                                    if (!isParecerReprovado(selecionado)) {
                                                        setFieldValue("stateFormEditarAta.justificativa", "");
                                                    }
                                                }}
                                                name="stateFormEditarAta.parecer_conselho"
                                                className="form-control"
                                                disabled={!podeEditarAta}
                                            >
                                                {tabelas && tabelas.pareceres && tabelas.pareceres.map((tipo) =>
                                                    <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
                                                )}
                                            </select>
                                        </div>
                                        {deveExibirCampoMotivo && (
                                            <div className="col-12 mt-3">
                                                <textarea
                                                    rows="3"
                                                    placeholder="Insira o motivo da reprovação"
                                                    value={values.stateFormEditarAta.justificativa}
                                                    onChange={props.handleChange}
                                                    name="stateFormEditarAta.justificativa"
                                                    className="form-control mt-2"
                                                    disabled={!podeEditarAta}
                                                />
                                            </div>
                                        )}
                                    </div>

                                </form>

                                <section>
                                    <ModalAntDesignConfirmacao
                                        handleShow={dataModalApagarParticipantesAta.show}
                                        titulo={"Confirmar exclusão de participantes"}
                                        bodyText={"Ao remover a data da ata de apresentação os participantes atuais serão removidos da ata."}
                                        handleOk={() => handleConfirmarRemocaoParticipantes()}
                                        okText="Confirmar"
                                        handleCancel={() => handleCancelarRemocaoParticipantes()}
                                        cancelText="Cancelar"
                                    />
                                </section>
                                <section>
                                    <ModalNotificarRegeracaoAta
                                        handleShow={showModalAvisoRegeracaoAta}
                                        titulo={"Edição da ata"}
                                        bodyText={"A ata foi editada e é necessário gerar novo documento de ata."}
                                        handleOk={() => setShowModalAvisoRegeracaoAta(false)}
                                        handleCancel={() => setShowModalAvisoRegeracaoAta(false)}
                                        okText="OK"
                                        cancelButtonProps={{ style: { display: 'none' } }}
                                    />
                                </section>
                            </>
                        )
                    }}

                </Formik>

                :
                null
            }

        </div>
    )
};
