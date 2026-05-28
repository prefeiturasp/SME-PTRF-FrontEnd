import React from "react";
import { render } from "@testing-library/react";

jest.mock("../hooks/useDetalhesTiposCreditoContext", () => ({
  useDetalhesTiposCreditoContext: jest.fn()
}));
jest.mock("../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext", () => ({
  useAbasPorRecursoContext: jest.fn()
}));
jest.mock("../hooks/useGetDetalhesTiposCredito", () => ({
  useGetDetalhesTiposCredito: jest.fn()
}));
jest.mock("../hooks/usePostDetalhesTiposCredito", () => ({
  usePostDetalhesTiposCredito: jest.fn()
}));
jest.mock("../hooks/usePatchDetalhesTiposCredito", () => ({
  usePatchDetalhesTiposCredito: jest.fn()
}));
jest.mock("../hooks/useDeleteDetalhesTiposCredito", () => ({
  useDeleteDetalhesTiposCredito: jest.fn()
}));
jest.mock("primereact/datatable", () => ({ DataTable: () => <div data-testid="datatable">Table</div> }));
jest.mock("primereact/column", () => ({ Column: () => null }));
jest.mock("../../../../../../utils/Loading", () => ({ __esModule: true, default: () => <div data-testid="loading">Loading</div> }));
jest.mock("../components/ModalForm", () => ({ ModalForm: () => <div data-testid="modal">Modal</div> }));
jest.mock("../../../../../Globais/ModalAntDesign/ModalConfirmarExclusao", () => ({ ModalConfirmarExclusao: () => <div /> }));
jest.mock("../../../../../Globais/Mensagens/MsgImgCentralizada", () => ({ MsgImgCentralizada: () => <div /> }));
jest.mock("../../../../../Globais/UI/Button", () => ({ EditIconButton: () => <button>Editar</button> }));
jest.mock("../../../../../Globais/ToastCustom", () => ({ toastCustom: { ToastCustomError: jest.fn() } }));
jest.mock("../components/Paginacao", () => ({ Paginacao: () => <div data-testid="paginacao" /> }));

describe("Lista", () => {
  let mockSetStateFormModal, mockSetBloquearBtnSalvarForm, mockHandleCloseModalConfirmacaoExclusao;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSetStateFormModal = jest.fn();
    mockSetBloquearBtnSalvarForm = jest.fn();
    mockHandleCloseModalConfirmacaoExclusao = jest.fn();

    require("../hooks/useDetalhesTiposCreditoContext").useDetalhesTiposCreditoContext.mockReturnValue({
      stateFormModal: { uuid: "", nome: "" },
      setStateFormModal: mockSetStateFormModal,
      setBloquearBtnSalvarForm: mockSetBloquearBtnSalvarForm,
      showModalConfirmacaoExclusao: { is_open: false },
      handleCloseModalConfirmacaoExclusao: mockHandleCloseModalConfirmacaoExclusao
    });

    require("../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext").useAbasPorRecursoContext.mockReturnValue({
      selectedRecurso: { uuid: "rec-1", nome: "Recurso" }
    });

    require("../hooks/useGetDetalhesTiposCredito").useGetDetalhesTiposCredito.mockReturnValue({
      isLoading: false,
      data: { results: [] },
      total: 0,
      count: 0
    });

    require("../hooks/usePostDetalhesTiposCredito").usePostDetalhesTiposCredito.mockReturnValue({
      mutationPost: { mutate: jest.fn() }
    });

    require("../hooks/usePatchDetalhesTiposCredito").usePatchDetalhesTiposCredito.mockReturnValue({
      mutationPatch: { mutate: jest.fn() }
    });

    require("../hooks/useDeleteDetalhesTiposCredito").useDeleteDetalhesTiposCredito.mockReturnValue({
      mutationDelete: { mutate: jest.fn() }
    });
  });

  describe("Renderização", () => {
    it("deve renderizar lista", () => {
      const { Lista } = require("../components/Lista");
      const { container } = render(<Lista />);
      expect(container).toBeInTheDocument();
    });

    it("deve renderizar tabela de dados quando há dados", () => {
      require("../hooks/useGetDetalhesTiposCredito").useGetDetalhesTiposCredito.mockReturnValue({
        isLoading: false,
        data: { 
          results: [
            { uuid: "1", nome: "Detalhe 1", tipo_receita: "receita-1" }
          ] 
        },
        total: 1,
        count: 1
      });

      const { Lista } = require("../components/Lista");
      const { getByTestId } = render(<Lista />);
      expect(getByTestId("datatable")).toBeInTheDocument();
    });

    it("deve renderizar paginação", () => {
      require("../hooks/useGetDetalhesTiposCredito").useGetDetalhesTiposCredito.mockReturnValue({
        isLoading: false,
        data: { 
          results: [
            { uuid: "1", nome: "Detalhe 1", tipo_receita: "receita-1" }
          ] 
        },
        total: 1,
        count: 1
      });

      const { Lista } = require("../components/Lista");
      const { getByTestId } = render(<Lista />);
      expect(getByTestId("paginacao")).toBeInTheDocument();
    });

    it("deve renderizar modal form", () => {
      const { Lista } = require("../components/Lista");
      const { getByTestId } = render(<Lista />);
      expect(getByTestId("modal")).toBeInTheDocument();
    });
  });

  describe("Estado de Carregamento", () => {
    it("deve não renderizar loading quando isLoading é false", () => {
      const { Lista } = require("../components/Lista");
      const { queryByTestId } = render(<Lista />);
      expect(queryByTestId("loading")).not.toBeInTheDocument();
    });

    it("deve renderizar loading quando isLoading é true", () => {
      require("../hooks/useGetDetalhesTiposCredito").useGetDetalhesTiposCredito.mockReturnValue({
        isLoading: true,
        data: { results: [] },
        total: 0,
        count: 0
      });

      const { Lista } = require("../components/Lista");
      const { getByTestId } = render(<Lista />);
      expect(getByTestId("loading")).toBeInTheDocument();
    });
  });

  describe("Dados da Tabela", () => {
    it("deve renderizar lista vazia quando sem dados", () => {
      const { Lista } = require("../components/Lista");
      const { container } = render(<Lista />);
      expect(container).toBeInTheDocument();
      expect(container.querySelector('[data-testid="datatable"]')).not.toBeInTheDocument();
    });

    it("deve renderizar lista com dados", () => {
      require("../hooks/useGetDetalhesTiposCredito").useGetDetalhesTiposCredito.mockReturnValue({
        isLoading: false,
        data: { 
          results: [
            { uuid: "1", nome: "Detalhe 1", tipo_receita: "receita-1" },
            { uuid: "2", nome: "Detalhe 2", tipo_receita: "receita-2" }
          ] 
        },
        total: 2,
        count: 2
      });

      const { Lista } = require("../components/Lista");
      const { getByTestId } = render(<Lista />);
      expect(getByTestId("datatable")).toBeInTheDocument();
    });

    it("deve usar recurso_uuid do contexto", () => {
      require("../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext").useAbasPorRecursoContext.mockReturnValue({
        selectedRecurso: { uuid: "recurso-teste", nome: "Recurso Teste" }
      });

      const { Lista } = require("../components/Lista");
      render(<Lista />);
      expect(require("../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext").useAbasPorRecursoContext).toHaveBeenCalled();
    });
  });

  describe("Contexto e Hooks", () => {
    it("deve chamar useDetalhesTiposCreditoContext", () => {
      const { Lista } = require("../components/Lista");
      render(<Lista />);
      expect(require("../hooks/useDetalhesTiposCreditoContext").useDetalhesTiposCreditoContext).toHaveBeenCalled();
    });

    it("deve chamar useGetDetalhesTiposCredito", () => {
      const { Lista } = require("../components/Lista");
      render(<Lista />);
      expect(require("../hooks/useGetDetalhesTiposCredito").useGetDetalhesTiposCredito).toHaveBeenCalled();
    });

    it("deve chamar useAbasPorRecursoContext", () => {
      const { Lista } = require("../components/Lista");
      render(<Lista />);
      expect(require("../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext").useAbasPorRecursoContext).toHaveBeenCalled();
    });
  });
});
