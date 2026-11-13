import React from "react";
import { fireEvent, render as rtlRender, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ProgramasPDDE } from "../index";
import { useProgramasPDDE } from "../hooks/useProgramasPDDE";
import { programasPDDE, programasPDDEVazio } from "../__fixtures__/mockData";

jest.mock("../../../../../../paginas/PaginasContainer", () => ({
    PaginasContainer: ({ children }) => <div data-testid="paginas-container">{children}</div>,
}));

jest.mock("../Filtros", () => ({
    Filtros: () => <div data-testid="filtros-component"></div>,
}));

jest.mock("../Tabela", () => ({
    __esModule: true,
    default: () => <div data-testid="tabela-component"></div>,
}));

jest.mock("../ModalForm", () => ({
    __esModule: true,
    default: () => <div data-testid="modal-form-programa"></div>,
}));

jest.mock("../hooks/useProgramasPDDE", () => {
    const original = jest.requireActual("../hooks/useProgramasPDDE");
    return {...original, useProgramasPDDE: jest.fn()};
});

const render = (ui) => rtlRender(<MemoryRouter initialEntries={["/parametro-programas-pdde"]}>{ui}</MemoryRouter>);

const mockHandleDelete = jest.fn();
const mockSetShowModalConfirmDelete = jest.fn();
const mockHandleOpenCreateModal = jest.fn();

const retornoHook = (sobrescrever = {}) => ({
    TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES: true,
    modalForm: { open: false, uuid: "uuid-programa" },
    stateFiltros: { filtrar_por_nome: "" },
    isLoading: false,
    programas: programasPDDE,
    firstPage: 0,
    setCurrentPage: jest.fn(),
    setFirstPage: jest.fn(),
    showModalConfirmDelete: false,
    setShowModalConfirmDelete: mockSetShowModalConfirmDelete,
    handleOpenCreateModal: mockHandleOpenCreateModal,
    handleOpenModalForm: jest.fn(),
    handleClose: jest.fn(),
    handleSubmitFormModal: jest.fn(),
    handleDelete: mockHandleDelete,
    handleSubmitFiltros: jest.fn(),
    limpaFiltros: jest.fn(),
    ...sobrescrever,
});

describe("ProgramasPDDE", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useProgramasPDDE.mockReturnValue(retornoHook());
    });

    it("deve renderizar título, abas, filtros, tabela e modal", () => {
        render(<ProgramasPDDE />);

        expect(screen.getByRole("heading", { name: "Ações PDDE" })).toBeInTheDocument();
        expect(screen.getByTestId("filtros-component")).toBeInTheDocument();
        expect(screen.getByTestId("tabela-component")).toBeInTheDocument();
        expect(screen.getByTestId("modal-form-programa")).toBeInTheDocument();
    });

    it("deve marcar a aba Programas como ativa", () => {
        render(<ProgramasPDDE />);

        expect(screen.getByRole("link", { name: "Programas" })).toHaveClass("active");
        expect(screen.getByRole("link", { name: "Ações PDDE" })).not.toHaveClass("active");
    });

    it("deve abrir o modal de criação ao clicar em Adicionar Programa", () => {
        render(<ProgramasPDDE />);

        fireEvent.click(screen.getByRole("button", { name: /Adicionar Programa/i }));
        expect(mockHandleOpenCreateModal).toHaveBeenCalled();
    });

    it("deve desabilitar o botão de adicionar sem permissão de edição", () => {
        useProgramasPDDE.mockReturnValue(retornoHook({ TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES: false }));
        render(<ProgramasPDDE />);

        expect(screen.getByRole("button", { name: /Adicionar Programa/i })).toBeDisabled();
    });

    it("deve exibir mensagem quando não houver programas", () => {
        useProgramasPDDE.mockReturnValue(retornoHook({ programas: programasPDDEVazio }));
        render(<ProgramasPDDE />);

        expect(screen.queryByTestId("tabela-component")).not.toBeInTheDocument();
        expect(screen.getByText("Nenhum resultado encontrado.")).toBeInTheDocument();
    });

    it("deve confirmar a exclusão chamando handleDelete com o uuid do programa", () => {
        useProgramasPDDE.mockReturnValue(retornoHook({ showModalConfirmDelete: true }));
        render(<ProgramasPDDE />);

        expect(screen.getByText("Tem certeza que deseja excluir esse Programa?")).toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", { name: "Excluir" }));
        expect(mockSetShowModalConfirmDelete).toHaveBeenCalledWith(false);
        expect(mockHandleDelete).toHaveBeenCalledWith("uuid-programa");
    });
});
