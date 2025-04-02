import React from "react";
import { fireEvent, render, screen, renderHook } from "@testing-library/react";
import { AcoesPDDE } from "../index"; 
import { useAcoesPDDE } from "../hooks/useAcoesPDDE";
import { acoesPDDE as mockAcoesPDDE, categoriasPDDE as mockCategoriasPDDE} from "../__fixtures__/mockData";

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
  
jest.mock("../ModalForm", () => ({
    __esModule: true,
    default: () => <div data-testid="modal-form-acoes-pdde"></div>,
}));

const mockSetShowModalConfirmDelete = jest.fn();
const mockSetShowModalInfoExclusaoNaoPermitida = jest.fn();
const mockHandleDelete = jest.fn();

jest.mock("../hooks/useAcoesPDDE", () => ({
  useAcoesPDDE: () => ({
    modalForm: { open: true, uuid: "123" },
    setModalForm: jest.fn(),
    showModalConfirmDelete: true,
    showModalInfoExclusaoNaoPermitida: true,
    erroExclusaoNaoPermitida: "Não é possível excluir esta Ação PDDE.",
    stateFiltros: {},
    initialStateFiltros: {},
    isLoading: false,
    count: 3,
    categorias: mockCategoriasPDDE,
    acoes: mockAcoesPDDE,
    currentPage: 1,
    firstPage: 1,
    setCurrentPage: jest.fn(),
    setFirstPage: jest.fn(),
    TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES: true,
    handleOpenCreateModal: jest.fn(),
    handleClose: jest.fn(),
    handleOpenModalForm: jest.fn(),
    handleDelete: mockHandleDelete,
    handleSubmitFormModal: jest.fn(),
    handleSubmitFiltros: jest.fn(),
    limpaFiltros: jest.fn(),
    setShowModalConfirmDelete: mockSetShowModalConfirmDelete,
    setShowModalInfoExclusaoNaoPermitida: mockSetShowModalInfoExclusaoNaoPermitida,
    setErroDatasAtendemRegras: jest.fn(),
  }),
}));

describe("Ações PDDE", () => {
  it("deve renderizar o título e os componentes principais", () => {
    render(<AcoesPDDE />);
    
    expect(screen.getByTestId("paginas-container")).toBeInTheDocument();
    expect(screen.getByText("Ações PDDE")).toBeInTheDocument();
    expect(screen.getByTestId("filtros-component")).toBeInTheDocument();
    expect(screen.getByTestId("tabela-component")).toBeInTheDocument();
    expect(screen.getByTestId("modal-form-acoes-pdde")).toBeInTheDocument();
  });

  describe("Ações PDDE", () => {
    it("deve exibir os modais de exclusão quando os estados estiverem ativos", () => {
      render(<AcoesPDDE />);
  
      // Verifica se o modal de confirmação de exclusão está no documento
      expect(screen.getByText("Excluir Ação PDDE")).toBeInTheDocument();
      expect(screen.getByText("Tem certeza que deseja excluir essa Ação PDDE?")).toBeInTheDocument();
      expect(screen.getByText("Cancelar")).toBeInTheDocument();
      expect(screen.getByText("Excluir")).toBeInTheDocument();
  
      // Verifica se o modal de exclusão não permitida está no documento
      expect(screen.getByText("Exclusão não permitida")).toBeInTheDocument();
      expect(screen.getByText("Não é possível excluir esta Ação PDDE.")).toBeInTheDocument();
      expect(screen.getByText("Fechar")).toBeInTheDocument();
    });
  
    it("deve fechar o modal de confirmação de exclusão ao clicar em 'Cancelar'", () => {
        render(<AcoesPDDE />);
    
        const cancelButton = screen.getByText("Cancelar");
        fireEvent.click(cancelButton);
    
        expect(mockSetShowModalConfirmDelete).toHaveBeenCalledWith(false);
      });
  
    it("deve chamar a função de exclusão ao clicar em 'Excluir'", () => {
      render(<AcoesPDDE />);
      const excluirButton = screen.getByText("Excluir");
      fireEvent.click(excluirButton);
  
      expect(mockHandleDelete).toHaveBeenCalledWith("123");
      expect(mockSetShowModalConfirmDelete).toHaveBeenCalledWith(false);
    });
  
    it("deve fechar o modal de exclusão não permitida ao clicar em 'Fechar'", () => {
      render(<AcoesPDDE />);
      const fecharButton = screen.getByText("Fechar");
      fireEvent.click(fecharButton);
  
      expect(mockSetShowModalInfoExclusaoNaoPermitida).toHaveBeenCalledWith(false);
    });
  });
  
});
