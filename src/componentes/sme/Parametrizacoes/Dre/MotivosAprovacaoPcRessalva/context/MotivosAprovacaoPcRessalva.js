import React, { createContext, useMemo, useState, useEffect } from 'react';
import { useAbasPorRecursoContext } from '../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext';

const initialFilter = {
    motivo: '',
    recurso: '',
    page: 1,
    page_size: 10,
    is_required_recurso_uuid: true,
};

const initialStateFormModal = {
    id: '',
    uuid: '',
    motivo: '',
    recurso: '',
};

export const MotivosAprovacaoPcRessalvaContext = createContext({
    initialFilter: initialFilter,
    filter: initialFilter,
    setFilter: () => {},

    showModalForm: false,
    setShowModalForm: () => {},
    stateFormModal: initialStateFormModal,
    setStateFormModal: () => {},

    showModalConfirmacaoExclusao: { open: false, uuid: '' },
    setShowModalConfirmacaoExclusao: () => {},

    bloquearBtnSalvarForm: '',
    setBloquearBtnSalvarForm: () => {},
})

export const MotivosAprovacaoPcRessalvaProvider = ({children}) => {

    const { selectedRecurso } = useAbasPorRecursoContext();

    const [filter, setFilter] = useState(initialFilter);

    const [showModalForm, setShowModalForm] = useState(false);
    const [stateFormModal, setStateFormModal] = useState(initialStateFormModal);

    const [showModalConfirmacaoExclusao, setShowModalConfirmacaoExclusao] = useState({ open: false, uuid: '' });

    const [bloquearBtnSalvarForm, setBloquearBtnSalvarForm] = useState(false);

    // Monitora mudanças no recurso selecionado e atualiza o filtro
    useEffect(() => {
        setFilter({
            ...initialFilter,
            recurso: selectedRecurso ? selectedRecurso.uuid : ''
        });
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
            showModalConfirmacaoExclusao,
            setShowModalConfirmacaoExclusao,
            bloquearBtnSalvarForm,
            setBloquearBtnSalvarForm,
        };
    }, [filter, showModalForm, stateFormModal, showModalConfirmacaoExclusao, bloquearBtnSalvarForm]);

    return (
        <MotivosAprovacaoPcRessalvaContext.Provider value={contextValue}>
            {children}
        </MotivosAprovacaoPcRessalvaContext.Provider>
    )

}