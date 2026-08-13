import React, { createContext, useMemo, useState, useEffect, useCallback } from 'react';
import { useGetByUUIDAssociacaoFormulario } from '../hooks/useGetByUUIDAssociacaoFormulario';
import { useGetStatusValoresReprogramadosAssociacaoFormulario } from '../hooks/useGetStatusValoresReprogramadosAssociacaoFormulario';
import { usePostAssociacao } from '../hooks/usePostAssociacao';
import { usePatchAssociacao } from '../hooks/usePatchAssociacao';
import { useDeleteAssociacao } from '../hooks/useDeleteAssociacao';
import { useNavigate, useParams } from 'react-router-dom';
import { getUnidadePeloCodigoEol, patchUpdateAssociacao, postCriarAssociacao, validarDataDeEncerramento, verifyCNPJexistente } from '../../../../../../services/sme/Parametrizacoes.service';
import { validarDAC11A } from "../../../../../../utils/validators";
import { useRecursoSelecionadoContext } from "../../../../../../context/RecursoSelecionado"
import { toastCustom } from '../../../../../Globais/ToastCustom';

const initialItemPeriodoInicial = {
    uuid: '',
    recurso: '',
    periodo_inicial: '',
    status_valores_reprogramados: '',
    periodos_disponiveis: [],
}

const initialStateForm = {
    nome: '',
    uuid_unidade: '',
    codigo_eol_unidade: '',
    observacao: '',
    tipo_unidade: '',
    nome_unidade: '',
    nome_dre: '',
    cnpj: '',
    ccm: '',
    email: '',
    status_regularidade: '',
    processo_regularidade: '',
    uuid: '',
    id: '',
    operacao: 'create',
    data_de_encerramento: null,
    pode_editar_periodo_inicial: false,
    pode_editar_dados_associacao_encerrada: false,
    periodos_iniciais: [{...initialItemPeriodoInicial}],
};

export const AssociacaoFormularioContext = createContext({
    uuid: '',
    initialItemPeriodoInicial: initialItemPeriodoInicial,

    stateForm: {},
    setStateForm: () => {},

    errosPeriodosIniciais: {},
    errosCodigoEol: '',
    setErrosCodigoEol: () => {},

    carregaUnidadePeloCodigoEol: () => {},
    handleSubmitModalFormAssociacoes: () => {},
    getRecursosParaSelectFormulario: () => {},
    handleConfirmDelete: () => {},

    isLoadingAssociacaoByUUID: false,
    dataAssociacaoByUUID: {},
    countAssociacaoByUUID: 0,

    isLoadingStatusValoresReprogramados: false,
    dataStatusValoresReprogramados: {},

    showModalConfirmUpdateObservacao: false,
    setShowModalConfirmUpdateObservacao: () => {},

    handleUpdateObservacao: () => {},
})

export const AssociacaoFormularioProvider = ({children}) => {
    const { uuid } = useParams();
    const { recursos } = useRecursoSelecionadoContext();
    const navigate = useNavigate();

    const [stateForm, setStateForm] = useState({});
    const [errosCodigoEol, setErrosCodigoEol] = useState('');
    const [errosPeriodosIniciais, setErrosPeriodosIniciais] = useState({});
    const [showModalConfirmUpdateObservacao, setShowModalConfirmUpdateObservacao] = useState(false);

    const formatDataAssociacaoListagem = (data) => {
        if (!data) return {...initialStateForm};

        const nome_dre = data.nome_dre?.replace(/DIRETORIA REGIONAL DE EDUCACAO\s*/i, '').trim()

        return {
            ...initialStateForm,
            nome: data.nome,
            uuid_unidade: data.unidade.uuid,
            codigo_eol_unidade: data.unidade.codigo_eol,
            observacao: data.unidade.observacao,
            tipo_unidade: data.unidade.tipo_unidade,
            nome_unidade: data.unidade.nome,
            nome_dre: nome_dre,
            cnpj: data.cnpj,
            ccm: data.ccm ? data.ccm : "",
            email: data.email ? data.email : "",
            status_regularidade: data.status_regularidade,
            processo_regularidade: data.processo_regularidade ? data.processo_regularidade : "-",
            uuid: data.uuid,
            id: data.id,
            operacao: 'edit',
            data_de_encerramento: data.data_de_encerramento?.data?.split('T')[0] || null,
            pode_editar_periodo_inicial: data.pode_editar_periodo_inicial ? data.pode_editar_periodo_inicial.pode_editar_periodo_inicial : false,
            pode_editar_dados_associacao_encerrada: data.data_de_encerramento.pode_editar_dados_associacao_encerrada ? data.data_de_encerramento.pode_editar_dados_associacao_encerrada : false,
            periodos_iniciais: data.periodos_iniciais
        }
    }

    const initializerStateForm = (data) => {
        if (uuid) {
            const formattedData = formatDataAssociacaoListagem(data);
            setStateForm(formattedData);
        } else {
            setStateForm({...initialStateForm});
        }
    };

    const goToPageListagemAssociacoes = () => {
        navigate('/parametro-associacoes')
    }

    const { isLoading: isLoadingStatusValoresReprogramados, data: dataStatusValoresReprogramados } = useGetStatusValoresReprogramadosAssociacaoFormulario()
    const { isLoading: isLoadingAssociacaoByUUID, data: dataAssociacaoByUUID, count: countAssociacaoByUUID } = useGetByUUIDAssociacaoFormulario({ uuid, initializerStateForm })
    const { mutationPost } = usePostAssociacao({
        goToPageListagemAssociacoes,
    })
    const { mutationPatch } = usePatchAssociacao({
        goToPageListagemAssociacoes,
    })
    const { mutationDelete } = useDeleteAssociacao({
        goToPageListagemAssociacoes,
    })

    const validatePeriodosIniciais = (periodos_iniciais) => {
        const errors = {};

        periodos_iniciais.forEach((periodo, index) => {
            if (!periodo.recurso) {
                errors[index] = { recurso: 'O campo de recurso é obrigatório.' };
            }

            if (!periodo.periodo_inicial) {
                errors[index] = { ...errors[index], periodo_inicial: 'O campo de período inicial é obrigatório.' };
            }

            if (!periodo.status_valores_reprogramados) {
                errors[index] = { ...errors[index], status_valores_reprogramados: 'O campo de status dos valores reprogramados é obrigatório.' };
            }
        });

        setErrosPeriodosIniciais(errors);
        return Object.keys(errors).length === 0;
    }

    const carregaUnidadePeloCodigoEol = async (codigo_eol_unidade, setFieldValue) =>{
        try {
            let unidade = await getUnidadePeloCodigoEol(codigo_eol_unidade);

            if (unidade && Object.entries(unidade).length > 0) {
                setFieldValue('tipo_unidade', unidade.tipo_unidade.trim());
                setFieldValue('nome_unidade', unidade.nome.trim());

                if (unidade.nome_dre) {
                    setFieldValue('nome_dre', unidade.nome_dre.trim());
                }

                setErrosCodigoEol('');
            }else {
                setErrosCodigoEol('Unidade não encontrada.');
            }
        }catch (e) {
            if (e.response.data?.mensagem){
                setErrosCodigoEol(e.response.data.mensagem);
            }
        }
    };

    const verificaExisteAssociacaoCNPJ = async (cnpj) =>{
        try {
            await verifyCNPJexistente(cnpj);

            return false
        }catch {
            return true
        }
    };

    const getRecursosParaSelectFormulario = (select_number, periodos_iniciais) => {
        const recursos_uuid_selecionados = periodos_iniciais.reduce((acc, periodo_inicial, index) => {
            if (index !== select_number && periodo_inicial.recurso) {
                acc.push(periodo_inicial.recurso);
            }
            return acc;
        }, []);

        return recursos.filter((recurso) => !recursos_uuid_selecionados.includes(recurso.uuid));
    };

    const handleConfirmDelete = () => {
        mutationDelete.mutate(uuid);
    }

    const formatPayload = (values, type_payload) => {
        if (type_payload === 'create') {
            return {
                nome: values.nome,
                cnpj: values.cnpj,
                ccm: values.ccm,
                email: values.email,
                status_regularidade: values.status_regularidade,
                processo_regularidade: values.processo_regularidade,
                unidade: {
                    codigo_eol: values.codigo_eol_unidade,
                    nome: values.nome_unidade,
                    nome_dre: values.nome_dre,
                    tipo_unidade: values.tipo_unidade,
                    email: '',
                    telefone: '',
                    numero: '',
                    tipo_logradouro: '',
                    logradouro: '',
                    bairro: '',
                    cep: ''
                },
                observacao: values.observacao,
                data_de_encerramento: values.data_de_encerramento,
                periodos_iniciais: values.periodos_iniciais.map((periodo_inicial) => ({
                    recurso: periodo_inicial.recurso,
                    periodo_inicial: periodo_inicial.periodo_inicial,
                    status_valores_reprogramados: periodo_inicial.status_valores_reprogramados,
                }))
            }
        } else if (type_payload === 'edit') {
            return {
                nome: values.nome,
                cnpj: values.cnpj,
                ccm: values.ccm,
                email: values.email,
                status_regularidade: values.status_regularidade,
                processo_regularidade: values.processo_regularidade,
                unidade: values.uuid_unidade,
                observacao: values.observacao,
                data_de_encerramento: values.data_de_encerramento,
                periodos_iniciais: values.periodos_iniciais
            }
        }
    }

    const verifica_alteracao_cnpj =  useMemo(() => stateForm.cnpj, [stateForm.cnpj]);

    const handleSubmitModalFormAssociacoes = useCallback(async (values,{setErrors})=>{
        const digits = values.ccm.replace(/\D/g, '');
        if (digits.length > 8 && !validarDAC11A(values.ccm)) {
            setErrors({ ccm: 'CCM inválido. Verifique os 12 dígitos.' });
            return;
        }

        let cnpj_existente=false;

        if (verifica_alteracao_cnpj !== values.cnpj.trim() || !values.cnpj.trim()){
            cnpj_existente = await verificaExisteAssociacaoCNPJ(values.cnpj.trim());
        }

        if (cnpj_existente){
            setErrors({ cnpj: 'Associação com este CNPJ já existe.' });
        }else {
            const valido = validatePeriodosIniciais(values.periodos_iniciais);

            if (!valido) return;

            let payload;

            if (!errosCodigoEol){
                if (values.operacao === 'create'){
                    payload = formatPayload(values, 'create');

                    try {
                        if(values.data_de_encerramento) {
                            await validarDataDeEncerramento(values.uuid, values.data_de_encerramento, values.periodo_inicial)
                        }
                    }catch {
                        return toastCustom.ToastCustomError('Erro ao criar associação', `Não foi possível criar a associação`)
                    }

                    mutationPost.mutate(payload);

                }else {
                    payload = formatPayload(values, 'edit');

                    try {
                        if(values.data_de_encerramento) {
                            await validarDataDeEncerramento(values.uuid, values.data_de_encerramento, values.periodo_inicial)
                        }

                        if(values.pode_editar_dados_associacao_encerrada){
                            mutationPatch.mutate({ uuid: values.uuid, data: payload });
                        }
                        else{
                            setShowModalConfirmUpdateObservacao(true);
                        }
                    }catch (e) {
                        if(e.response.data?.erro === 'data_invalida') {
                            setErrors({ data_de_encerramento: e.response.data.mensagem.replace('data_fim_realizacao_despesas', 'a data do fim da realização das despesas') });
                        }
                        toastCustom.ToastCustomError('Erro ao atualizar associação', `Não foi possível atualizar a associação`)
                    }
                }
            }
        }
    }, [errosCodigoEol, verifica_alteracao_cnpj]);

    const handleUpdateObservacao = () => {
        let payload = {
            observacao: stateForm.observacao,
        };

        mutationPatch.mutate({ uuid, data: payload });
    };

    const contextValue = useMemo(() => {
        return {
            uuid,
            initialItemPeriodoInicial,

            stateForm,
            setStateForm,

            errosPeriodosIniciais,
            errosCodigoEol,
            carregaUnidadePeloCodigoEol,
            handleSubmitModalFormAssociacoes,
            getRecursosParaSelectFormulario,
            handleConfirmDelete,

            isLoadingAssociacaoByUUID,
            dataAssociacaoByUUID,
            countAssociacaoByUUID,

            isLoadingStatusValoresReprogramados,
            dataStatusValoresReprogramados,

            showModalConfirmUpdateObservacao,
            setShowModalConfirmUpdateObservacao,

            handleUpdateObservacao,
        };
    }, [
        uuid,
        stateForm,
        errosPeriodosIniciais,
        errosCodigoEol,
        isLoadingAssociacaoByUUID,
        dataAssociacaoByUUID,
        countAssociacaoByUUID,
        isLoadingStatusValoresReprogramados,
        dataStatusValoresReprogramados,
        showModalConfirmUpdateObservacao,
    ]);

    return (
        <AssociacaoFormularioContext.Provider value={contextValue}>
            {children}
        </AssociacaoFormularioContext.Provider>
    )

}
