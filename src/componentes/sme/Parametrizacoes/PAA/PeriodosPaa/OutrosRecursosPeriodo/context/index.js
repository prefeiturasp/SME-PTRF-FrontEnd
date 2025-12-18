import { createContext, useMemo, useState } from 'react';

const initialFilter = {
    nome: '',
    outro_recurso_uuid: '',
    periodo_paa_uuid: '',
};

const initialStateFormModal = {
    id: '',
    uuid: '',
    periodo_paa: '',
    outro_recurso: '',
    ativo: false,
};



export const OutrosRecursosPeriodosPaaContext = createContext({
    initialFilter: initialFilter,
    filter: initialFilter,
    setFilter: () => {},
    
    currentPage: 1,
    setCurrentPage: () => {},
    firstPage: 0,
    setFirstPage: () => {},

    stateFormModal: initialStateFormModal,
    setStateFormModal: () => {},

    showModalImportarUEs: false,
    setShowModalImportarUEs: () => {},

})

export const OutrosRecursosPeriodosPaaProvider = ({children}) => {

    const [filter, setFilter] = useState(initialFilter);

    const [currentPage, setCurrentPage] = useState(1);
    const [firstPage, setFirstPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [stateFormModal, setStateFormModal] = useState(initialStateFormModal);

    const [showModalImportarUEs, setShowModalImportarUEs] = useState(false);
    
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
            stateFormModal,
            setStateFormModal,

            showModalImportarUEs, 
            setShowModalImportarUEs,
        };
    }, [filter, currentPage, firstPage, rowsPerPage, stateFormModal, showModalImportarUEs]);

    return (
        <OutrosRecursosPeriodosPaaContext.Provider value={contextValue}>
            {children}
        </OutrosRecursosPeriodosPaaContext.Provider>
    )

}