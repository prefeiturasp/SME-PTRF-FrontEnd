import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Lista } from "../components/Lista";
import { useGetContasDasAssociacoes } from "../hooks/useGetContasDasAssociacoes";
import { useContasDasAssociacoesContext } from "../hooks/useContasDasAssociacoesContext";
import { usePostContaAssociacao } from "../hooks/usePostContaAssociacao";
import { usePatchContaAssociacao } from "../hooks/usePatchContaAssociacao";
import { useDeleteContaAssociacao } from "../hooks/useDeleteContaAssociacao";
import { useAbasPorRecursoContext } from "../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext";
import { toastCustom } from "../../../../../Globais/ToastCustom";

jest.mock("../hooks/useGetContasDasAssociacoes");
jest.mock("../hooks/useContasDasAssociacoesContext");
jest.mock("../hooks/usePostContaAssociacao");
jest.mock("../hooks/usePatchContaAssociacao");
jest.mock("../hooks/useDeleteContaAssociacao");
jest.mock("../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext");
jest.mock("../../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomError: jest.fn(),
  },
}));

jest.mock("../components/ModalForm", () => ({
  __esModule: true,
  default: ({ handleSubmitFormModal }) => (
    <>
      <button
        type="button"
        onClick={() =>
          handleSubmitFormModal({
            associacao: "associacao-1",
            tipo_conta: "tipo-1",
            status: "ATIVA",
            uuid: "",
            banco_nome: "Banco",
            agencia: "0001",
            numero_conta: "123",
            numero_cartao: "456",
            data_inicio: "2026-01-01",
          })
        }
      >
        submit-create
      </button>
      <button
        type="button"
        onClick={() =>
          handleSubmitFormModal({
            associacao: "associacao-1",
            tipo_conta: "tipo-1",
            status: "INATIVA",
            uuid: "conta-1",
            banco_nome: "Banco",
            agencia: "0001",
            numero_conta: "123",
            numero_cartao: "456",
            data_inicio: "2026-01-01",
          })
        }
      >
        submit-edit
      </button>
    </>
  ),
}));

jest.mock("../components/Paginacao", () => ({
  Paginacao: ({ total }) => <div data-testid="paginacao">total: {total}</div>,
}));

jest.mock("../../../../../Globais/ModalAntDesign/ModalConfirmarExclusao", () => ({
  ModalConfirmarExclusao: ({ open, onOk, onCancel }) =>
    open ? (
      <div data-testid="modal-confirmacao">
        <button onClick={onOk}>confirmar exclusao</button>
        <button onClick={onCancel}>cancelar exclusao</button>
      </div>
    ) : null,
}));

const mockMutationPostMutate = jest.fn();
const mockMutationPatchMutate = jest.fn();
const mockMutationDeleteMutate = jest.fn();

const conta = {
  associacao: "associacao-1",
  associacao_dados: {
    unidade: { nome_com_tipo: "EMEF Teste" },
  },
  tipo_conta: "tipo-1",
  tipo_conta_dados: { nome: "Conta Corrente" },
  status: "ATIVA",
  uuid: "conta-1",
  id: 1,
  banco_nome: "Banco",
  agencia: "0001",
  numero_conta: "123",
  numero_cartao: "456",
  data_inicio: "2026-01-01",
};

describe("Lista", () => {
  const setStateFormModal = jest.fn();
  const setBloquearBtnSalvarForm = jest.fn();
  const handleCloseModalConfirmacaoExclusao = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useGetContasDasAssociacoes.mockReturnValue({
      isLoading: false,
      data: { count: 1, results: [conta] },
      total: 1,
    });
    useContasDasAssociacoesContext.mockReturnValue({
      stateFormModal: {},
      setStateFormModal,
      setBloquearBtnSalvarForm,
      showModalConfirmacaoExclusao: { is_open: false, conta_uuid: "" },
      handleCloseModalConfirmacaoExclusao,
    });
    usePostContaAssociacao.mockReturnValue({
      mutationPost: { mutate: mockMutationPostMutate },
    });
    usePatchContaAssociacao.mockReturnValue({
      mutationPatch: { mutate: mockMutationPatchMutate },
    });
    useDeleteContaAssociacao.mockReturnValue({
      mutationDelete: { mutate: mockMutationDeleteMutate },
    });
    useAbasPorRecursoContext.mockReturnValue({
      selectedRecurso: { uuid: "recurso-1" },
    });
  });

  it("renderiza tabela com contas", () => {
    render(<Lista />);

    expect(screen.getByText("EMEF Teste")).toBeInTheDocument();
    expect(screen.getByText("Conta Corrente")).toBeInTheDocument();
    expect(screen.getByText("Ativa")).toBeInTheDocument();
    expect(screen.getByTestId("paginacao")).toHaveTextContent("total: 1");
  });

  it("abre modal de edição com dados da linha", () => {
    render(<Lista />);

    fireEvent.click(screen.getByTestId("btn-editar-contas-das-associacoes"));

    expect(setStateFormModal).toHaveBeenCalledWith({
      associacao: "associacao-1",
      associacao_nome: "EMEF Teste",
      tipo_conta: "tipo-1",
      status: "ATIVA",
      uuid: "conta-1",
      id: 1,
      banco_nome: "Banco",
      agencia: "0001",
      numero_conta: "123",
      numero_cartao: "456",
      data_inicio: "2026-01-01",
      recurso_uuid: "recurso-1",
      isOpen: true,
    });
  });

  it("submete criação e edição pelo modal", () => {
    render(<Lista />);

    fireEvent.click(screen.getByText("submit-create"));
    expect(setBloquearBtnSalvarForm).toHaveBeenCalledWith(true);
    expect(mockMutationPostMutate).toHaveBeenCalledWith({
      payload: {
        associacao: "associacao-1",
        tipo_conta: "tipo-1",
        status: "ATIVA",
        uuid: "",
        banco_nome: "Banco",
        agencia: "0001",
        numero_conta: "123",
        numero_cartao: "456",
        data_inicio: "2026-01-01",
      },
    });

    fireEvent.click(screen.getByText("submit-edit"));
    expect(mockMutationPatchMutate).toHaveBeenCalledWith({
      uuidContaAssociacao: "conta-1",
      payload: expect.objectContaining({ status: "INATIVA" }),
    });
  });

  it("exibe vazio quando não há resultados", () => {
    useGetContasDasAssociacoes.mockReturnValue({
      isLoading: false,
      data: { count: 0, results: [] },
      total: 0,
    });

    render(<Lista />);

    expect(screen.getByText("Nenhum resultado encontrado.")).toBeInTheDocument();
  });

  it("confirma exclusão pelo modal", () => {
    useContasDasAssociacoesContext.mockReturnValue({
      stateFormModal: {},
      setStateFormModal,
      setBloquearBtnSalvarForm,
      showModalConfirmacaoExclusao: { is_open: true, conta_uuid: "conta-1" },
      handleCloseModalConfirmacaoExclusao,
    });

    render(<Lista />);

    fireEvent.click(screen.getByText("confirmar exclusao"));

    expect(mockMutationDeleteMutate).toHaveBeenCalledWith("conta-1");
    expect(handleCloseModalConfirmacaoExclusao).toHaveBeenCalled();
  });

  it("exibe toast quando tenta excluir sem uuid", () => {
    useContasDasAssociacoesContext.mockReturnValue({
      stateFormModal: {},
      setStateFormModal,
      setBloquearBtnSalvarForm,
      showModalConfirmacaoExclusao: { is_open: true, conta_uuid: "" },
      handleCloseModalConfirmacaoExclusao,
    });

    render(<Lista />);

    fireEvent.click(screen.getByText("confirmar exclusao"));

    expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
      "Erro ao apagar conta de associação",
      "Informe os campos corretamente e tente novamente."
    );
    expect(mockMutationDeleteMutate).not.toHaveBeenCalled();
  });
});
