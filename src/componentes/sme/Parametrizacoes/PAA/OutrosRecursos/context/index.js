import { createContext, useMemo, useState } from 'react';

const initialFilter = {
    nome: ''
};

const initialStateFormModal = {
    id: '',
    uuid: '',
    nome: '',
    aceita_capital: false,
    aceita_custeio: false,
    aceita_livre_aplicacao: false,
};

export const OutrosRecursosPaaContext = createContext({
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

export const OutrosRecursosPaaProvider = ({children}) => {

    const [filter, setFilter] = useState(initialFilter);

    const [currentPage, setCurrentPage] = useState(1);
    const [firstPage, setFirstPage] = useState(0);
    // eslint-disable-next-line
    const [rowsPerPage, setRowsPerPage] = useState(2);

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
        <OutrosRecursosPaaContext.Provider value={contextValue}>
            {children}
        </OutrosRecursosPaaContext.Provider>
    )

}