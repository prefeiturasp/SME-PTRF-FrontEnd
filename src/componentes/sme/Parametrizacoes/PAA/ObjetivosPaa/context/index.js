import { createContext, useMemo, useState } from 'react';

const initialFilter = {
    nome: ''
};

const initialStateFormModal = {
    id: '',
    uuid: '',
    nome: '',
    status: 1,
};

export const ObjetivosPaaContext = createContext({
    initialFilter: initialFilter,
    filter: initialFilter,
    setFilter: () => {},

    currentPage: 1,
    setCurrentPage: () => {},
    firstPage: 0,
    setFirstPage: () => {},

    showModalForm: false,
    setShowModalForm: () => {},
    stateFormModal: initialStateFormModal,
    setStateFormModal: () => {},

    showModalConfirmacaoExclusao: false,
    setShowModalConfirmacaoExclusao: () => {},

    bloquearBtnSalvarForm: '',
    setBloquearBtnSalvarForm: () => {},
})

export const ObjetivosPaaProvider = ({children}) => {

    const [filter, setFilter] = useState(initialFilter);

    const [currentPage, setCurrentPage] = useState(1);
    const [firstPage, setFirstPage] = useState(1);
    // eslint-disable-next-line
    const [rowsPerPage, setRowsPerPage] = useState(20);

    const [showModalForm, setShowModalForm] = useState(false);
    const [stateFormModal, setStateFormModal] = useState(initialStateFormModal);

    const [showModalConfirmacaoExclusao, setShowModalConfirmacaoExclusao] = useState(false);

    const [bloquearBtnSalvarForm, setBloquearBtnSalvarForm] = useState(false);

    const contextValue = useMemo(() => {
        return {
            rowsPerPage,
            initialFilter,
            filter,
            setFilter,
            currentPage,
            setCurrentPage,
            firstPage,
            setFirstPage,
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
    }, [filter, currentPage, firstPage, rowsPerPage, showModalForm, stateFormModal, showModalConfirmacaoExclusao, bloquearBtnSalvarForm]);

    return (
        <ObjetivosPaaContext.Provider value={contextValue}>
            {children}
        </ObjetivosPaaContext.Provider>
    )

}