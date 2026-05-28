import React from "react";
import { fireEvent, render, screen, renderHook } from "@testing-library/react";
import { Periodos } from "../index"; 
import { usePeriodos } from "../hooks/usePeriodos";
import { AbasPorRecursoContext } from "../../../componentes/AbasPorRecurso/context/Recursos";

jest.mock("../../../../../../paginas/PaginasContainer", () => ({
    PaginasContainer: (({ children }) => <div data-testid="paginas-container">{children}</div>)
}));

jest.mock("../Filtros", () => ({
  Filtros: () => <div data-testid="filtros-component"></div>,
}));

jest.mock("../Tabela", () => ({
    __esModule: true,
    default: () => <div data-testid="tabela-component"></div>,
}));
  
jest.mock("../ModalFormPeriodos", () => ({
    __esModule: true,
    default: () => <div data-testid="modal-form-periodos"></div>,
}));

jest.mock("../../../componentes/AbasPorRecurso", () => ({
    AbasPorRecurso: () => <div data-testid="abas-por-recurso"></div>,
}));

  
const mockSetShowModalConfirmDeletePeriodo = jest.fn();
const mockHandleDelete = jest.fn();
const mockSetShowModalInfoExclusaoNaoPermitida = jest.fn();
const mockHandleCloseModalConfirmDeletePeriodo = jest.fn();

jest.mock("../hooks/usePeriodos", () => ({
  usePeriodos: () => ({
    modalForm: { open: true, uuid: "123" },
    showModalConfirmDeletePeriodo: { open: true, periodo_uuid: "12345-uuid" },
    showModalInfoExclusaoNaoPermitida: true,
    erroDatasAtendemRegras: false,
    erroExclusaoNaoPermitida: "Não é possível excluir este período.",
    stateFiltros: {},
    isLoading: false,
    results: [],
    count: 0,
    TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES: true,
    handleOpenCreateModal: jest.fn(),
    handleClose: jest.fn(),
    handleOpenModalForm: jest.fn(),
    handleDelete: mockHandleDelete,
    handleSubmitFormModal: jest.fn(),
    handleChangeFiltros: jest.fn(),
    handleSubmitFiltros: jest.fn(),
    limpaFiltros: jest.fn(),
    setShowModalConfirmDeletePeriodo: mockSetShowModalConfirmDeletePeriodo,
    setShowModalInfoExclusaoNaoPermitida: mockSetShowModalInfoExclusaoNaoPermitida,
    setErroDatasAtendemRegras: jest.fn(),
    handleCloseModalConfirmDeletePeriodo: mockHandleCloseModalConfirmDeletePeriodo
  }),
}));

describe("Periodos", () => {

  const defaultContextValue = {
        selectedRecurso: {
            nome: "Programa de Transferência de Recursos Financeiros (PTRF) - Básico",
            nome_exibicao: "PTRF Básico",
        },
        setSelectedRecurso: jest.fn(),
        clickBtnEscolheOpcao: {},
        setClickBtnEscolheOpcao: jest.fn(),
    };

    const renderComponent = () => {
        return render(
            <AbasPorRecursoContext.Provider value={defaultContextValue}>
                <Periodos />
            </AbasPorRecursoContext.Provider>
        );
    };
    
  it("deve renderizar o título e os componentes principais", () => {
    renderComponent();
    
    expect(screen.getByTestId("paginas-container")).toBeInTheDocument();
    expect(screen.getByText("Períodos")).toBeInTheDocument();
    expect(screen.getByTestId("filtros-component")).toBeInTheDocument();
    expect(screen.getByTestId("tabela-component")).toBeInTheDocument();
    expect(screen.getByTestId("modal-form-periodos")).toBeInTheDocument();
  });

  describe("Periodos", () => {
    it("deve exibir os modais de exclusão quando os estados estiverem ativos", () => {
      renderComponent();
  
      // Verifica se o modal de confirmação de exclusão está no documento
      expect(screen.getByText("Excluir Período")).toBeInTheDocument();
      expect(screen.getByText("Deseja realmente excluir este período?")).toBeInTheDocument();
      expect(screen.getByText("Cancelar")).toBeInTheDocument();
      expect(screen.getByText("Excluir")).toBeInTheDocument();
    });
  
    it("deve fechar o modal de confirmação de exclusão ao clicar em 'Cancelar'", () => {
        renderComponent();
    
        const cancelButton = screen.getByText("Cancelar");
        fireEvent.click(cancelButton);
    
        expect(mockHandleCloseModalConfirmDeletePeriodo).toHaveBeenCalled();
      });
  
    it("deve chamar a função de exclusão ao clicar em 'Excluir'", () => {
      renderComponent();
      const excluirButton = screen.getByText("Excluir");
      fireEvent.click(excluirButton);
  
      expect(mockHandleDelete).toHaveBeenCalledWith("12345-uuid");
      expect(mockHandleCloseModalConfirmDeletePeriodo).toHaveBeenCalled();
    });
  });
  
});
