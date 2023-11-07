import React, { createContext, useMemo, useState } from 'react';

const initialFilter = {
    referencia: '',
};
const initialStateFormModal = {
    referencia: '',
    data_inicial: '',
    data_final: '',
    editavel: false,
    data_inicial_proximo_mandato: null,
    uuid:"",
    id:"",
};

export const MandatosContext = createContext({
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
    showModalInfo: false,
    setShowModalInfo: () => {},
    tituloModalInfo: '',
    setTituloModalInfo: () => {},
    textoModalInfo: '',
    setTextoModalInfo: () => {},
    bloquearBtnSalvarForm: false,
    setBloquearBtnSalvarForm: () => {},
})

export const MandatosProvider = ({children}) => {

    const [filter, setFilter] = useState(initialFilter);
    const [currentPage, setCurrentPage] = useState(1);
    const [firstPage, setFirstPage] = useState(1);
    const [showModalForm, setShowModalForm] = useState(false);
    const [stateFormModal, setStateFormModal] = useState(initialStateFormModal);
    const [showModalInfo, setShowModalInfo] = useState(false);
    const [textoModalInfo, setTextoModalInfo] = useState('');
    const [tituloModalInfo, setTituloModalInfo] = useState('');
    const [bloquearBtnSalvarForm, setBloquearBtnSalvarForm] = useState(false)

    const contextValue = useMemo(() => {
        return {
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
            showModalInfo,
            setShowModalInfo,
            textoModalInfo,
            setTextoModalInfo,
            tituloModalInfo,
            setTituloModalInfo,
            bloquearBtnSalvarForm,
            setBloquearBtnSalvarForm,
        };
    }, [filter, currentPage, firstPage, showModalForm, stateFormModal, textoModalInfo, showModalInfo, tituloModalInfo, bloquearBtnSalvarForm]);

    return (
        <MandatosContext.Provider value={contextValue}>
            {children}
        </MandatosContext.Provider>
    )

}