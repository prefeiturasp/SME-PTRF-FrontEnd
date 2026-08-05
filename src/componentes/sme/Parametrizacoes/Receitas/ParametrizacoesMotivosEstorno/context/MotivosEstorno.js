import React, { createContext, useEffect, useMemo, useState } from "react";
import { useAbasPorRecursoContext } from "../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext";

const rowsPerPage = 10;

const initialFilter = {
    motivo: "",
    recurso_uuid: "",
    is_required_recurso_uuid: true,
    page: 1,
    page_size: rowsPerPage,
};

const initialStateFormModal = {
    id: "",
    uuid: "",
    motivo: "",
    recurso_uuid: "",
    isOpen: false,
};

const initialStateModalConfirmacaoExclusao = {
    is_open: false,
    motivo_uuid: "",
};

export const MotivosEstornoContext = createContext({
    rowsPerPage,

    initialFilter: initialFilter,
    filter: initialFilter,
    setFilter: () => {},

    currentPage: 1,
    setCurrentPage: () => {},
    firstPage: 1,
    setFirstPage: () => {},

    stateFormModal: initialStateFormModal,
    setStateFormModal: () => {},

    handleOpenCreateModal: () => {},
    handleCloseModalForm: () => {},

    showModalConfirmacaoExclusao: false,
    setShowModalConfirmacaoExclusao: () => {},

    initialStateModalConfirmacaoExclusao: initialStateModalConfirmacaoExclusao,
    stateModalConfirmacaoExclusao: initialStateModalConfirmacaoExclusao,
    setStateModalConfirmacaoExclusao: () => {},
});

export const MotivosEstornoProvider = ({ children }) => {
    const { selectedRecurso } = useAbasPorRecursoContext();

    const [filter, setFilter] = useState(initialFilter);
    const [stateFormModal, setStateFormModal] = useState(initialStateFormModal);
    const [showModalConfirmacaoExclusao, setShowModalConfirmacaoExclusao] =
        useState(false);

    useEffect(() => {
        const initialFilterWithRecurso = {
            ...initialFilter,
            recurso_uuid: selectedRecurso?.uuid || "",
        };

        setFilter(initialFilterWithRecurso);
    }, [selectedRecurso?.uuid]);

    const handleOpenCreateModal = (recurso) => {
        setStateFormModal({
            ...initialStateFormModal,
            recurso_uuid: recurso?.uuid,
            isOpen: true,
        });
    };

    const handleCloseModalForm = () => {
        setStateFormModal(initialStateFormModal);
    };

    const handleOpenModalConfirmacaoExclusao = (motivoUuid) => {
        setShowModalConfirmacaoExclusao({
            is_open: true,
            motivo_uuid: motivoUuid,
        });
    };

    const handleCloseModalConfirmacaoExclusao = () => {
        setShowModalConfirmacaoExclusao({ is_open: false, motivo_uuid: "" });
    };

    const contextValue = useMemo(() => {
        return {
            rowsPerPage,
            initialFilter,
            filter,
            setFilter,
            initialStateFormModal,
            stateFormModal,
            setStateFormModal,
            handleOpenCreateModal,
            handleCloseModalForm,
            showModalConfirmacaoExclusao,
            handleOpenModalConfirmacaoExclusao,
            handleCloseModalConfirmacaoExclusao,
        };
    }, [filter, stateFormModal, showModalConfirmacaoExclusao]);

    return (
        <MotivosEstornoContext.Provider value={contextValue}>
            {children}
        </MotivosEstornoContext.Provider>
    );
};
