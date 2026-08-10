import React, { createContext, useMemo, useState, useEffect } from 'react';
import { useAbasPorRecursoContext } from '../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext';
import { useGetFiqueDeOlho } from '../hooks/useGetFiqueDeOlho';
import { usePostFiqueDeOlho } from '../hooks/usePostFiqueDeOlho';
import { usePatchFiqueDeOlho } from '../hooks/usePatchFiqueDeOlho';
import { useGetTabelaFiqueDeOlho } from '../hooks/useGetTabelaFiqueDeOlho';

const initialFilter = {
    recurso_uuid: '',
    page: 1,
    page_size: 10,
    is_required_recurso_uuid: true,
    tipo_texto: ''
};

const initialStateFormModal = {
    id: '',
    uuid: '',
    tipo_texto: '',
    recurso: '',
    isOpen: false,
    texto: '',
};

export const FiqueDeOlhoContext = createContext({
    initialFilter: initialFilter,
    filter: initialFilter,
    setFilter: () => {},

    showModalForm: false,
    setShowModalForm: () => {},
    stateFormModal: initialStateFormModal,
    setStateFormModal: () => {},

    bloquearBtnSalvarForm: '',
    setBloquearBtnSalvarForm: () => {},
})

export const FiqueDeOlhoProvider = ({children}) => {

    const { selectedRecurso } = useAbasPorRecursoContext();

    const [draftFilter, setDraftFilter] = useState(initialFilter);
    const [filter, setFilter] = useState(initialFilter);

    const [showModalForm, setShowModalForm] = useState(false);
    const [stateFormModal, setStateFormModal] = useState(initialStateFormModal);

    const [bloquearBtnSalvarForm, setBloquearBtnSalvarForm] = useState(false);

    const handleCloseModalForm = () => {
        setStateFormModal({
            ...initialStateFormModal,
            isOpen: false,
        });
    }

    const { isLoading: isLoadingTabelaFiqueDeOlho, data: dataTabelaFiqueDeOlho } = useGetTabelaFiqueDeOlho()
    const { isLoading: isLoadingFiqueDeOlho, data: dataFiqueDeOlho, count: countFiqueDeOlho } = useGetFiqueDeOlho({ filters: filter })
    const { mutationPost } = usePostFiqueDeOlho({ handleCloseModalForm, setBloquearBtnSalvarForm })
    const { mutationPatch } = usePatchFiqueDeOlho({ handleCloseModalForm, setBloquearBtnSalvarForm })

    const handleOpenCreateModal = () => {
        setStateFormModal({
            ...initialStateFormModal,
            isOpen: true,
            recurso_uuid: selectedRecurso?.uuid || ''
        });
    }

    useEffect(() => {
        const initialFilterWithRecurso = {
            ...initialFilter,
            recurso_uuid: selectedRecurso?.uuid || '',
        };

        setDraftFilter(initialFilterWithRecurso);
        setFilter(initialFilterWithRecurso);
    }, [selectedRecurso]);

    const contextValue = useMemo(() => {
        return {
            initialFilter,
            filter,
            setFilter,
            showModalForm,
            setShowModalForm,
            initialStateFormModal,
            stateFormModal,
            setStateFormModal,
            bloquearBtnSalvarForm,
            setBloquearBtnSalvarForm,
            draftFilter,
            setDraftFilter,
            isLoadingFiqueDeOlho,
            dataFiqueDeOlho,
            countFiqueDeOlho,
            mutationPost,
            mutationPatch,
            handleOpenCreateModal,
            isLoadingTabelaFiqueDeOlho,
            dataTabelaFiqueDeOlho,
            handleCloseModalForm,
        };
    }, [filter, showModalForm, stateFormModal, bloquearBtnSalvarForm, isLoadingFiqueDeOlho, dataFiqueDeOlho, countFiqueDeOlho, isLoadingTabelaFiqueDeOlho, dataTabelaFiqueDeOlho]);

    return (
        <FiqueDeOlhoContext.Provider value={contextValue}>
            {children}
        </FiqueDeOlhoContext.Provider>
    )

}
