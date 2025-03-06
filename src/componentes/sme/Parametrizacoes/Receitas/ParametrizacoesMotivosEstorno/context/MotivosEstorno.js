import React, { createContext, useMemo, useState } from 'react';

const rowsPerPage = 15;

const initialFilter = {
    motivo:''
};

const initialStateFormModal = {
    id: '',
    uuid: '',
    motivo: '',
    operacao: 'create',
};

export const MotivosEstornoContext = createContext({
    initialFilter: initialFilter,
    filter: initialFilter,
    setFilter: () => {},

    showModalForm: false,
    setShowModalForm: () => {},
    stateFormModal: initialStateFormModal,
    setStateFormModal: () => {},

    showModalConfirmacaoExclusao: false,
    setShowModalConfirmacaoExclusao: () => {},
})

export const MotivosEstornoProvider = ({children}) => {

    const [filter, setFilter] = useState(initialFilter);

    const [showModalForm, setShowModalForm] = useState(false);
    const [stateFormModal, setStateFormModal] = useState(initialStateFormModal);
    const [showModalConfirmacaoExclusao, setShowModalConfirmacaoExclusao] = useState(false);

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
            rowsPerPage
        };
    }, [filter, showModalForm, stateFormModal, showModalConfirmacaoExclusao]);

    return (
        <MotivosEstornoContext.Provider value={contextValue}>
            {children}
        </MotivosEstornoContext.Provider>
    )

}