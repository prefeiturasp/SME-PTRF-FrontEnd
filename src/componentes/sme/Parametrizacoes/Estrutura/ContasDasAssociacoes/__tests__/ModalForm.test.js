import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ModalForm from "../components/ModalForm";
import { useContasDasAssociacoesContext } from "../hooks/useContasDasAssociacoesContext";
import { useRecursoSelecionadoContext } from "../../../../../../context/RecursoSelecionado";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";

jest.mock("../hooks/useContasDasAssociacoesContext");
jest.mock("../../../../../../context/RecursoSelecionado", () => ({
  useRecursoSelecionadoContext: jest.fn(),
}));
jest.mock("../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

jest.mock("../../../../../Globais/ModalBootstrap", () => ({
  ModalFormBodyText: ({ show, titulo, bodyText }) => (
    show ? (
      <div role="dialog">
        <h2>{titulo}</h2>
        {bodyText}
      </div>
    ) : null
  ),
}));

jest.mock("../../../../../Globais/DatePickerField", () => ({
  DatePickerField: ({ name, id, value, onChange, disabled }) => (
    <input
      name={name}
      id={id}
      aria-label="Data de início *"
      value={value || ""}
      disabled={disabled}
      onChange={(event) => onChange(name, event.target.value ? new Date("2026-01-01") : null)}
    />
  ),
}));

jest.mock("../AutoCompleteAssociacoes", () => ({
  __esModule: true,
  default: ({ recebeAutoComplete, disabled }) => (
    <button
      type="button"
      disabled={disabled}
      onClick={() =>
        recebeAutoComplete({
          uuid: "associacao-1",
          unidade: { nome_com_tipo: "EMEF Teste" },
        })
      }
    >
      selecionar unidade
    </button>
  ),
}));

const baseContext = {
  bloquearBtnSalvarForm: false,
  handleOpenModalConfirmacaoExclusao: jest.fn(),
  handleCloseModalForm: jest.fn(),
  listaTiposDeConta: [{ uuid: "tipo-1", nome: "Conta Corrente" }],
  todasAsAssociacoesAutoComplete: [],
  loadingAssociacoes: false,
  recebeAutoComplete: jest.fn(),
};

const mockCreate = {
  associacao: "",
  associacao_nome: "",
  tipo_conta: "",
  status: "",
  uuid: "",
  id: "",
  banco_nome: "",
  agencia: "",
  numero_conta: "",
  numero_cartao: "",
  data_inicio: "",
  recurso_uuid: "recurso-1",
  isOpen: true,
};

const mockEdit = {
  ...mockCreate,
  associacao: "associacao-1",
  associacao_nome: "EMEF Teste",
  tipo_conta: "tipo-1",
  status: "ATIVA",
  uuid: "conta-1",
  id: 10,
  banco_nome: "Banco",
  data_inicio: "2026-01-01",
};

describe("ModalForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
    useRecursoSelecionadoContext.mockReturnValue({
      recursos: [{ uuid: "recurso-1", nome: "PTRF" }],
    });
  });

  it("renderiza formulário de criação com recurso desabilitado", () => {
    useContasDasAssociacoesContext.mockReturnValue({
      ...baseContext,
      stateFormModal: mockCreate,
    });

    render(<ModalForm handleSubmitFormModal={jest.fn()} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Adicionar conta de associação")).toBeInTheDocument();
    expect(screen.getByLabelText("Recurso *")).toHaveValue("recurso-1");
    expect(screen.getByLabelText("Recurso *")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Adicionar" })).toBeEnabled();
    expect(screen.queryByRole("button", { name: "Excluir" })).not.toBeInTheDocument();
  });

  it("seleciona unidade pelo autocomplete mantendo uuid da associação", () => {
    useContasDasAssociacoesContext.mockReturnValue({
      ...baseContext,
      stateFormModal: mockCreate,
    });

    render(<ModalForm handleSubmitFormModal={jest.fn()} />);

    fireEvent.click(screen.getByText("selecionar unidade"));

    expect(baseContext.recebeAutoComplete).toHaveBeenCalledWith({
      uuid: "associacao-1",
      unidade: { nome_com_tipo: "EMEF Teste" },
    });
  });

  it("renderiza formulário de edição e abre confirmação de exclusão", () => {
    useContasDasAssociacoesContext.mockReturnValue({
      ...baseContext,
      stateFormModal: mockEdit,
    });

    render(<ModalForm handleSubmitFormModal={jest.fn()} />);

    expect(screen.getByText("Editar conta de associação")).toBeInTheDocument();
    expect(screen.getByLabelText("Unidade Educacional *")).toHaveValue("EMEF Teste");
    expect(screen.getByText("ID: 10")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Excluir" }));

    expect(baseContext.handleOpenModalConfirmacaoExclusao).toHaveBeenCalledWith("conta-1");
    expect(baseContext.handleCloseModalForm).toHaveBeenCalled();
  });

  it("submete formulário válido", async () => {
    const handleSubmitFormModal = jest.fn();
    useContasDasAssociacoesContext.mockReturnValue({
      ...baseContext,
      stateFormModal: mockEdit,
    });

    render(<ModalForm handleSubmitFormModal={handleSubmitFormModal} />);

    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    await waitFor(() => expect(handleSubmitFormModal).toHaveBeenCalledTimes(1));
  });

  it("desabilita campos e botão sem permissão", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);
    useContasDasAssociacoesContext.mockReturnValue({
      ...baseContext,
      stateFormModal: mockEdit,
    });

    render(<ModalForm handleSubmitFormModal={jest.fn()} />);

    expect(screen.getByLabelText("Unidade Educacional *")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
  });
});
