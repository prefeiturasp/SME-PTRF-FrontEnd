import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { Form } from "../Form";
import { useAssociacoesFormularioContext } from "../../hooks/useAssociacoesFormularioContext";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { visoesService } from "../../../../../../../services/visoes.service";

// --- Mocks de dependências externas ---

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../hooks/useAssociacoesFormularioContext");
jest.mock("../../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes");
jest.mock("../../../../../../../services/visoes.service");

// Mocks de subcomponentes para evitar complexidade desnecessária nos testes do Form
jest.mock("../../../../../../Globais/DatePickerField", () => ({
  DatePickerField: ({ id, value, onChange, disabled }) => (
    <input
      data-testid={id}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange && onChange(id, e.target.value ? new Date(e.target.value) : null)}
    />
  ),
}));

jest.mock("../InputsPeriodosIniciais", () => ({
  InputsPeriodosIniciais: () => <div data-testid="inputs-periodos-iniciais" />,
}));

jest.mock("../../../../../../Globais/ModalAntDesign/ModalConfirmarExclusao", () => ({
  ModalConfirmarExclusao: ({ open, onOk, onCancel }) =>
    open ? (
      <div data-testid="modal-exclusao">
        <button onClick={onOk}>Confirmar Excluir</button>
        <button onClick={onCancel}>Cancelar Excluir</button>
      </div>
    ) : null,
}));

jest.mock("../../components/ModalConfirmUpdateObservacao", () => ({
  ModalConfirmUpdateObservacao: ({ show }) =>
    show ? <div data-testid="modal-observacao" /> : null,
}));

jest.mock("../../../../../../../utils/Loading", () => () => <div data-testid="loading-component" />);

// --- Valores e Context Mock Padrão ---

const defaultStateForm = {
  id: "123",
  nome: "Associação Teste",
  codigo_eol_unidade: "987654",
  tipo_unidade: "EMEF",
  nome_unidade: "Escola Exemplo",
  nome_dre: "DIRETORIA REGIONAL DE EDUCACAO BUTANTA",
  cnpj: "00000000000191",
  processo_regularidade: "1234.5678/2023000-1",
  ccm: "12345678",
  email: "teste@escola.gov.br",
  data_de_encerramento: null,
  observacao: "Minha observação",
  operacao: "edit",
  pode_editar_dados_associacao_encerrada: true,
  pode_editar_periodo_inicial: true,
};

const mockContextValue = {
  stateForm: defaultStateForm,
  errosCodigoEol: null,
  carregaUnidadePeloCodigoEol: jest.fn(),
  isLoadingAssociacaoByUUID: false,
  handleSubmitModalFormAssociacoes: jest.fn(),
  handleConfirmDelete: jest.fn(),
  showModalConfirmUpdateObservacao: false,
  setShowModalConfirmUpdateObservacao: jest.fn(),
  handleUpdateObservacao: jest.fn(),
  setStateForm: jest.fn(),
};

describe("Componente Form", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAssociacoesFormularioContext).mockReturnValue(mockContextValue);
    (RetornaSeTemPermissaoEdicaoPainelParametrizacoes).mockReturnValue(true);
    (visoesService.getPermissoes).mockReturnValue(true);
  });

  it("deve renderizar o componente de Loading quando isLoadingAssociacaoByUUID for true", () => {
    (useAssociacoesFormularioContext).mockReturnValue({
      ...mockContextValue,
      isLoadingAssociacaoByUUID: true,
    });

    render(<Form />);

    expect(screen.getByTestId("loading-component")).toBeInTheDocument();
    expect(screen.queryByLabelText(/Nome\*/i)).not.toBeInTheDocument();
  });

  it("deve renderizar os campos do formulário preenchidos e tratar o nome da DRE", () => {
    render(<Form />);

    expect(screen.getByLabelText(/Nome\*/i)).toHaveValue("Associação Teste");
    expect(screen.getByLabelText(/Código EOL\*/i)).toHaveValue("987654");
    expect(screen.getByLabelText(/Unidade educacional/i)).toHaveValue("EMEF Escola Exemplo");
    // Verifica a remoção de "DIRETORIA REGIONAL DE EDUCACAO" via regex no componente
    expect(screen.getByLabelText(/DRE/i)).toHaveValue("BUTANTA");
    expect(screen.getByText("ID: 123")).toBeInTheDocument();
  });

  it("deve disparar carregaUnidadePeloCodigoEol ao alterar o campo Código EOL", async () => {
    const carregaUnidadeMock = jest.fn();
    (useAssociacoesFormularioContext).mockReturnValue({
      ...mockContextValue,
      carregaUnidadePeloCodigoEol: carregaUnidadeMock,
    });

    render(<Form />);

    const inputEol = screen.getByLabelText(/Código EOL\*/i);
    fireEvent.change(inputEol, { target: { value: "111222" } });

    expect(carregaUnidadeMock).toHaveBeenCalledWith("111222", expect.any(Function));
  });

  it("deve exibir mensagem de erro de código EOL caso exista em errosCodigoEol", () => {
    (useAssociacoesFormularioContext).mockReturnValue({
      ...mockContextValue,
      errosCodigoEol: "Código EOL inválido",
    });

    render(<Form />);

    expect(screen.getByText("Código EOL inválido")).toBeInTheDocument();
  });

  it("deve atualizar o estado ao alterar o campo Observação", () => {
    const setStateFormMock = jest.fn();
    (useAssociacoesFormularioContext).mockReturnValue({
      ...mockContextValue,
      setStateForm: setStateFormMock,
    });

    render(<Form />);

    const textareaObs = screen.getByLabelText(/Observação/i);
    fireEvent.change(textareaObs, { target: { value: "Nova observação digitada" } });

    expect(setStateFormMock).toHaveBeenCalled();
  });

  it("deve desabilitar todos os campos e botões quando o usuário NÃO tem permissão de edição", () => {
    (RetornaSeTemPermissaoEdicaoPainelParametrizacoes).mockReturnValue(false);

    render(<Form />);

    expect(screen.getByLabelText(/Nome\*/i)).toBeDisabled();
    expect(screen.getByLabelText(/Código EOL\*/i)).toBeDisabled();
    expect(screen.getByLabelText(/Observação/i)).toBeDisabled();
    expect(screen.getByRole("button", { name: /Salvar/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Excluir/i })).toBeDisabled();
  });

  it("deve desabilitar o campo Código EOL no modo de edição (operacao = 'edit')", () => {
    render(<Form />);

    const inputEol = screen.getByLabelText(/Código EOL\*/i);
    expect(inputEol).toBeDisabled();
  });

  it("deve navegar para '/parametro-associacoes' ao clicar no botão Cancelar", () => {
    render(<Form />);

    const btnCancelar = screen.getByRole("button", { name: /Cancelar/i });
    fireEvent.click(btnCancelar);

    expect(mockNavigate).toHaveBeenCalledWith("/parametro-associacoes");
  });

  it("deve abrir o modal de exclusão e chamar handleConfirmDelete ao confirmar", async () => {
    const handleConfirmDeleteMock = jest.fn();
    (useAssociacoesFormularioContext).mockReturnValue({
      ...mockContextValue,
      handleConfirmDelete: handleConfirmDeleteMock,
    });

    render(<Form />);

    // Clica no botão de excluir para abrir o modal
    const btnExcluir = screen.getByRole("button", { name: /Excluir/i });
    fireEvent.click(btnExcluir);

    // O modal deve ser exibido
    expect(screen.getByTestId("modal-exclusao")).toBeInTheDocument();

    // Confirma a exclusão no modal
    const btnConfirmarExcluir = screen.getByText("Confirmar Excluir");
    fireEvent.click(btnConfirmarExcluir);

    expect(handleConfirmDeleteMock).toHaveBeenCalledTimes(1);
  });

  it("deve chamar handleSubmitModalFormAssociacoes ao submeter o formulário", async () => {
    const handleSubmitMock = jest.fn((e) => e.preventDefault());
    (useAssociacoesFormularioContext).mockReturnValue({
      ...mockContextValue,
      handleSubmitModalFormAssociacoes: handleSubmitMock,
    });

    render(<Form />);

    const btnSalvar = screen.getByRole("button", { name: /Salvar/i });
    fireEvent.click(btnSalvar);

    await waitFor(() => {
      expect(handleSubmitMock).toHaveBeenCalled();
    });
  });
});