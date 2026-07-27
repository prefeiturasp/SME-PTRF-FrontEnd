import React from "react";
import { renderHook } from "@testing-library/react";
import { MotivosEstornoContext } from "../context/MotivosEstorno";
import { useMotivosEstornoContext } from "../hooks/useMotivosEstornoContext";

describe("useMotivosEstornoContext", () => {
    it("deve retornar o valor informado pelo provider", () => {
        const value = {
            rowsPerPage: 10,
            initialFilter: {
                motivo: "",
                recurso_uuid: "",
                is_required_recurso_uuid: true,
                page: 1,
                page_size: 10,
            },
            filter: {
                motivo: "Motivo teste",
                recurso_uuid: "recurso-1",
                is_required_recurso_uuid: true,
                page: 1,
                page_size: 10,
            },
            setFilter: jest.fn(),
            stateFormModal: {
                id: "",
                uuid: "",
                motivo: "",
                recurso_uuid: "",
                isOpen: false,
            },
            setStateFormModal: jest.fn(),
            handleOpenCreateModal: jest.fn(),
            handleCloseModalForm: jest.fn(),
            showModalConfirmacaoExclusao: {
                is_open: false,
                motivo_uuid: "",
            },
            handleOpenModalConfirmacaoExclusao: jest.fn(),
            handleCloseModalConfirmacaoExclusao: jest.fn(),
        };

        const wrapper = ({ children }) => (
            <MotivosEstornoContext.Provider value={value}>
                {children}
            </MotivosEstornoContext.Provider>
        );

        const { result } = renderHook(() => useMotivosEstornoContext(), {
            wrapper,
        });

        expect(result.current).toBe(value);
    });

    it("deve retornar o contexto default quando usado sem provider", () => {
        const { result } = renderHook(() => useMotivosEstornoContext());

        expect(result.current.rowsPerPage).toBe(10);
        expect(result.current.initialFilter).toEqual({
            motivo: "",
            recurso_uuid: "",
            is_required_recurso_uuid: true,
            page: 1,
            page_size: 10,
        });
        expect(result.current.filter).toEqual(result.current.initialFilter);
        expect(result.current.stateFormModal).toEqual({
            id: "",
            uuid: "",
            motivo: "",
            recurso_uuid: "",
            isOpen: false,
        });
        expect(result.current.handleOpenCreateModal).toEqual(expect.any(Function));
        expect(result.current.handleCloseModalForm).toEqual(expect.any(Function));
    });
});
