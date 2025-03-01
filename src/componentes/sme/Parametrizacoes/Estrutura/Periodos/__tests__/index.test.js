import React from "react";
import { fireEvent, render, screen, renderHook } from "@testing-library/react";
import { Periodos } from "../index"; 
import { usePeriodos } from "../hooks/usePeriodos";

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

  
const mockSetShowModalConfirmDeletePeriodo = jest.fn();
const mockHandleDelete = jest.fn();
const mockSetShowModalInfoExclusaoNaoPermitida = jest.fn();

jest.mock("../hooks/usePeriodos", () => ({
  usePeriodos: () => ({
    modalForm: { open: true, uuid: "123" },
    showModalConfirmDeletePeriodo: true,
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
  }),
}));

describe("Periodos", () => {
  it("deve renderizar o título e os componentes principais", () => {
    render(<Periodos />);
    
    expect(screen.getByTestId("paginas-container")).toBeInTheDocument();
    expect(screen.getByText("Períodos")).toBeInTheDocument();
    expect(screen.getByTestId("filtros-component")).toBeInTheDocument();
    expect(screen.getByTestId("tabela-component")).toBeInTheDocument();
    expect(screen.getByTestId("modal-form-periodos")).toBeInTheDocument();
  });

  describe("Periodos", () => {
    it("deve exibir os modais de exclusão quando os estados estiverem ativos", () => {
      render(<Periodos />);
  
      // Verifica se o modal de confirmação de exclusão está no documento
      expect(screen.getByText("Excluir Período")).toBeInTheDocument();
      expect(screen.getByText("Deseja realmente excluir este período?")).toBeInTheDocument();
      expect(screen.getByText("Cancelar")).toBeInTheDocument();
      expect(screen.getByText("Excluir")).toBeInTheDocument();
  
      // Verifica se o modal de exclusão não permitida está no documento
      expect(screen.getByText("Exclusão não permitida")).toBeInTheDocument();
      expect(screen.getByText("Não é possível excluir este período.")).toBeInTheDocument();
      expect(screen.getByText("Fechar")).toBeInTheDocument();
    });
  
    it("deve fechar o modal de confirmação de exclusão ao clicar em 'Cancelar'", () => {
        render(<Periodos />);
    
        const cancelButton = screen.getByText("Cancelar");
        fireEvent.click(cancelButton);
    
        expect(mockSetShowModalConfirmDeletePeriodo).toHaveBeenCalledWith(false);
      });
  
    it("deve chamar a função de exclusão ao clicar em 'Excluir'", () => {
      render(<Periodos />);
      const excluirButton = screen.getByText("Excluir");
      fireEvent.click(excluirButton);
  
      expect(mockHandleDelete).toHaveBeenCalledWith("123");
      expect(mockSetShowModalConfirmDeletePeriodo).toHaveBeenCalledWith(false);
    });
  
    it("deve fechar o modal de exclusão não permitida ao clicar em 'Fechar'", () => {
      render(<Periodos />);
      const fecharButton = screen.getByText("Fechar");
      fireEvent.click(fecharButton);
  
      expect(mockSetShowModalInfoExclusaoNaoPermitida).toHaveBeenCalledWith(false);
    });
  });
  
});
