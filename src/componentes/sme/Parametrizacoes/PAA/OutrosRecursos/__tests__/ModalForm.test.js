import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ModalForm } from "../ModalForm";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { OutrosRecursosPaaContext } from "../context/index";
import { useGet } from "../hooks/useGet";

jest.mock("../hooks/useGet");

jest.mock("../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

const contexto = {
  showModalForm: true,
  setShowModalForm: jest.fn(),
  setStateFormModal: jest.fn(),
  setBloquearBtnSalvarForm: jest.fn(),
  handleEditFormModal: jest.fn(),
  setShowModalConfirmacaoExclusao: jest.fn(),
}


const mockEdit = {
  nome: "Teste",
  id: 1,
  uuid: "12345",
  operacao: "edit",
};

const mockCreate = { 
  nome: "",
  id: null,
  uuid: null,
  operacao: "create",
};


const renderComponent = (mockForm) => {
  return render(
    <OutrosRecursosPaaContext.Provider value={{...contexto, stateFormModal: mockForm}}>
      <ModalForm 
        handleSubmitFormModal={contexto.handleEditFormModal}
        />
    </OutrosRecursosPaaContext.Provider>
  )
}

describe("Componente ModalForm", () => {
  beforeEach(() => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
    useGet.mockReturnValue({ isLoading: false, data: [], count: 0 });
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));
  });

  it("Renderiza a Modal quando a operação é Cadastro e Permissão True", () => {
    renderComponent(mockCreate);

    expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
    expect(screen.getByText("Adicionar Outros Recursos")).toBeInTheDocument();
    const campoNome = screen.getByLabelText("Nome do Recurso *");
    expect(campoNome).toHaveValue("");
    expect(campoNome).toBeEnabled();
    expect(screen.queryByRole("button", { name: "Excluir" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeEnabled();
  });

  it("Renderiza a Modal quando a operação é Cadastro e Permissão False", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);

    renderComponent(mockCreate);

    const campoNome = screen.getByLabelText("Nome do Recurso *");
    expect(campoNome).toHaveValue("");
    expect(campoNome).toBeDisabled();

    expect(screen.queryByRole("button", { name: "Excluir" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
  });

  it("Renderiza a Modal quando a operação é Edição e permissão é True", () => {
    renderComponent(mockEdit);

    const botaoExcluir = screen.queryByRole("button", { name: "Excluir" });
    expect(screen.getByText("Editar Outros Recursos")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome do Recurso *")).toHaveValue(mockEdit.Recurso);
    expect(botaoExcluir).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeEnabled();
    fireEvent.click(botaoExcluir);
  });

  it("Renderiza a Modal quando a operação é Edição e permissão é False", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);
    renderComponent(mockEdit);

    expect(screen.getByText("Visualizar Outros Recursos")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome do Recurso *")).toHaveValue(mockEdit.Recurso);
    expect(screen.getByLabelText("Nome do Recurso *")).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Excluir" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Excluir" })).toBeDisabled();
  });

  it("deve chamar handleSubmitModalForm quando o formulario for submetido", async () => {
    renderComponent(mockEdit);
    const saveButton = screen.getByRole("button", { name: "Salvar" });
    fireEvent.submit(saveButton);

    await waitFor(() => {
      expect(contexto.handleEditFormModal).toHaveBeenCalledTimes(1);
    });
  
  });

  it("deve chamar a ação de fechar modal quando o botão Cancelar for clicado", () => {
    renderComponent(mockEdit);

    const cancelButton = screen.getByRole("button", { name: "Cancelar" });
    fireEvent.click(cancelButton);

    expect(contexto.setShowModalForm).toHaveBeenCalledWith(false);
  });

  test('deve chamar setShowModalConfirmDelete quando o botão for clicado', () => {
    renderComponent(mockEdit);

    const button = screen.getByRole('button', { name: "Excluir" });
    fireEvent.click(button);

    expect(contexto.setShowModalConfirmacaoExclusao).toHaveBeenCalledWith(true);
  });

  it("Lancar erro ao tentar salvar Recurso vazia", async () => {
    renderComponent(mockCreate);

    const botaoSalvar = screen.getByRole("button", { name: "Salvar" })
    fireEvent.click(botaoSalvar);
    await waitFor(() => {
      expect(screen.getByText("Nome do Recurso é obrigatório")).toBeInTheDocument();
    })
  });

  const testaRadios = async (campoName) => {
    renderComponent({...mockCreate, [campoName]: true});
    const campoTrue = screen.getByTestId(`${campoName}_true`);
    const campoFalse = screen.getByTestId(`${campoName}_false`);

    // Testa onChange quando Não for selecionado
    fireEvent.click(campoFalse);
    await waitFor(() => {
      expect(campoFalse).toBeChecked()
      expect(campoTrue).not.toBeChecked()
    })

    // Testa onChange quando Sim for selecionado
    fireEvent.click(campoTrue);
    await waitFor(() => {
      expect(campoTrue).toBeChecked()
      expect(campoFalse).not.toBeChecked()
    })
  };
  
  // Reaproveita a lógica de testes entre componentes de radios
  it("deve validar onchange do campo aceita_capital true e false",
    () => testaRadios("aceita_capital"));

  it("deve validar onchange do campo aceita_custeio true e false",
    () => testaRadios("aceita_custeio"));

  it("deve validar onchange do campo aceita_livre_aplicacao true e false",
    () => testaRadios("aceita_livre_aplicacao"));

});
