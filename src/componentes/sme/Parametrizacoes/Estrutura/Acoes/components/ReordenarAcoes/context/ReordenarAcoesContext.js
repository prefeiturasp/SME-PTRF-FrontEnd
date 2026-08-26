import { createContext, useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAbasPorRecursoContext } from '../../../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext';
import { useGetAcoesOrdenadas } from '../hooks/useGetAcoesOrdenadas';
import { usePostReordenarAcoes } from '../hooks/usePostReordenarAcoes';
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from '../../../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes';

export const ReordenarAcoesContext = createContext({
    isLoading: true,
    TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES: false,

    // para ordenação de ações
    showModalSalvarOrdenacao: false,
    setShowModalSalvarOrdenacao: () => {},
    handleOpenModalSalvarOrdenacao: () => {},
    handleCloseModalSalvarOrdenacao: () => {},

    showModalAlteracoesNaoSalvas: false,
    setShowModalAlteracoesNaoSalvas: () => {},
    handleOpenModalAlteracoesNaoSalvas: () => {},
    handleCloseModalAlteracoesNaoSalvas: () => {},
});

export const ReordenarAcoesContextProvider = ({ children, recursoUuid }) => {
    const navigate = useNavigate();

    const { selectedRecurso } = useAbasPorRecursoContext();
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes();

    const [uuidsOrdenados, setUuidsOrdenados] = useState([]);
    const [tempResults, setTempResults] = useState([]);

    // Usa o recursoUuid passado como prop, ou o selectedRecurso do contexto
    const recursoAtivo = recursoUuid || selectedRecurso?.uuid;

    const [showModalSalvarOrdenacao, setShowModalSalvarOrdenacao] = useState(false);
    const [showModalAlteracoesNaoSalvas, setShowModalAlteracoesNaoSalvas] = useState(false);

    const { mutationPost } = usePostReordenarAcoes(setShowModalSalvarOrdenacao, recursoAtivo);
    const { isLoading, data: results } = useGetAcoesOrdenadas({ filters: { recurso_uuid: recursoAtivo } });

    const [onConfirmModalSalvarOrdenacao, setOnConfirmModalSalvarOrdenacao] = useState(null);
    const [onConfirmModalAlteracoesNaoSalvas, setOnConfirmModalAlteracoesNaoSalvas] = useState(null);

    const existemDiferencas = useCallback(() => {
        if (!results || !tempResults || results.length !== tempResults.length) return false;
        
        const uuids_originais = results.map((acao) => acao.uuid);
        const uuids_ordenados = tempResults.map((acao) => acao.uuid);
    
        return !uuids_originais.every((uuid, index) => uuid === uuids_ordenados[index]);
    }, [results, tempResults]);

    const handleOpenModalSalvarOrdenacao = useCallback(() => {
        setShowModalSalvarOrdenacao(true);
    }, []);

    const submitForm = useCallback(async (values) => {
        console.log("recurso value", values);
        mutationPost.mutate(values);
    }, [mutationPost]);

    const handleCloseModalAlteracoesNaoSalvas = useCallback(() => {
        setShowModalAlteracoesNaoSalvas(false);
        navigate('/parametro-acoes', {
            state: { recurso_uuid: recursoAtivo },
            replace: true
        });
    }, [navigate, recursoAtivo]);

    const handleSalvarOrdenacaoBtnSalvar = useCallback(() => {
        handleOpenModalSalvarOrdenacao();

        setOnConfirmModalSalvarOrdenacao(() => async () => {
            const payload = {
                uuids_ordenados: uuidsOrdenados,
            };

            await submitForm(payload);
        });
    }, [handleOpenModalSalvarOrdenacao, submitForm, uuidsOrdenados]);

    const handleOpenModalAlteracoesNaoSalvas = useCallback(() => {
        setShowModalAlteracoesNaoSalvas(true);
    }, []);

    const handleSalvarOrdenacaoBtnVoltar = useCallback(() => {
        if (existemDiferencas()) {
            handleOpenModalAlteracoesNaoSalvas();
        } else {
            handleCloseModalAlteracoesNaoSalvas();
        }

        setOnConfirmModalAlteracoesNaoSalvas(() => async () => {
            const payload = {
                uuids_ordenados: uuidsOrdenados,
            };

            await submitForm(payload);
        });
    }, [existemDiferencas, handleOpenModalAlteracoesNaoSalvas, handleCloseModalAlteracoesNaoSalvas, submitForm, uuidsOrdenados]);

    const handleCloseModalSalvarOrdenacao = useCallback(() => {
        setShowModalSalvarOrdenacao(false);
    }, []);

    const handleConfirmModalSalvarOrdenacao = useCallback(async () => {
        if (typeof onConfirmModalSalvarOrdenacao === 'function') {
            await onConfirmModalSalvarOrdenacao();
        }
        handleCloseModalSalvarOrdenacao();
    }, [onConfirmModalSalvarOrdenacao, handleCloseModalSalvarOrdenacao]);

    const handleConfirmModalAlteracoesNaoSalvas = useCallback(async () => {
        if (typeof onConfirmModalAlteracoesNaoSalvas === 'function') {
            await onConfirmModalAlteracoesNaoSalvas();
        }
        handleCloseModalAlteracoesNaoSalvas();
    }, [onConfirmModalAlteracoesNaoSalvas, handleCloseModalAlteracoesNaoSalvas]);

    const contextValue = useMemo(() => ({
        isLoading,
        results,
        TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES,
        uuidsOrdenados,
        setUuidsOrdenados,
        tempResults,
        setTempResults,
        existemDiferencas,
        handleSalvarOrdenacaoBtnSalvar,
        handleSalvarOrdenacaoBtnVoltar,
        showModalSalvarOrdenacao,
        setShowModalSalvarOrdenacao,
        handleOpenModalSalvarOrdenacao,
        handleCloseModalSalvarOrdenacao,
        showModalAlteracoesNaoSalvas,
        setShowModalAlteracoesNaoSalvas,
        handleOpenModalAlteracoesNaoSalvas,
        handleCloseModalAlteracoesNaoSalvas,
        submitForm,
        handleConfirmModalSalvarOrdenacao,
        setOnConfirmModalSalvarOrdenacao,
        handleConfirmModalAlteracoesNaoSalvas,
        setOnConfirmModalAlteracoesNaoSalvas,
        recursoAtivo
    }), [
        isLoading,
        results,
        TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES,
        uuidsOrdenados,
        setUuidsOrdenados,
        tempResults,
        setTempResults,
        existemDiferencas,
        handleSalvarOrdenacaoBtnSalvar,
        handleSalvarOrdenacaoBtnVoltar,
        showModalSalvarOrdenacao,
        setShowModalSalvarOrdenacao,
        handleOpenModalSalvarOrdenacao,
        handleCloseModalSalvarOrdenacao,
        showModalAlteracoesNaoSalvas,
        setShowModalAlteracoesNaoSalvas,
        handleOpenModalAlteracoesNaoSalvas,
        handleCloseModalAlteracoesNaoSalvas,
        submitForm,
        handleConfirmModalSalvarOrdenacao,
        setOnConfirmModalSalvarOrdenacao,
        handleConfirmModalAlteracoesNaoSalvas,
        setOnConfirmModalAlteracoesNaoSalvas,
        recursoAtivo
    ]);

    useEffect(() => {
        setTempResults(results);
        setUuidsOrdenados(results.map((acao) => acao.uuid));
    }, [results]);

    return <ReordenarAcoesContext.Provider value={contextValue}>
      {children}
    </ReordenarAcoesContext.Provider>;
};
