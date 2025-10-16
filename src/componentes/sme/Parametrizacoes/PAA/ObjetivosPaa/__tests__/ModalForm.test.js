import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ModalForm } from "../ModalForm";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { ObjetivosPaaContext } from "../context/index";
import { useGet } from "../hooks/useGet";
import { useGetTabelas } from "../hooks/useGetTabelas";

jest.mock("../hooks/useGet");
jest.mock("../hooks/useGetTabelas");

const objetivoTabelas = {
  status: [
    { key: 1, value: "Ativo" },
    { key: 0, value: "Inativo" },
  ]
};

jest.mock("antd", () => {
      const Select = ({ options, ...props }) => (
      <select {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );

    Select.Option = ({ children, value }) => (
        <option value={value}>{children}</option>
    );

    return { ...jest.requireActual("antd"), Select };
});

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
  status: 1,
  id: 1,
  uuid: "12345",
  operacao: "edit",
};

const mockCreate = { 
  nome: "",
  status: 1,
  id: null,
  uuid: null,
  operacao: "create",
};


const renderComponent = (mockForm) => {
  return render(
    <ObjetivosPaaContext.Provider value={{...contexto, stateFormModal: mockForm}}>
      <ModalForm 
        handleSubmitFormModal={contexto.handleEditFormModal}
        objetivosTabelas={objetivoTabelas}
        />
    </ObjetivosPaaContext.Provider>
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
    const campoNome = screen.getByLabelText("Objetivo *");
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(campoNome).toHaveValue("");
    expect(campoNome).toBeEnabled();
    expect(screen.queryByRole("button", { name: "Excluir" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeEnabled();
  });

  it("Renderiza a Modal quando a operação é Cadastro e Permissão False", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);

    renderComponent(mockCreate);

    const campoNome = screen.getByLabelText("Objetivo *");
    expect(campoNome).toHaveValue("");
    expect(campoNome).toBeDisabled();
    const campoStatus = screen.getByLabelText("Status");
    expect(campoStatus).toBeDisabled();

    expect(screen.queryByRole("button", { name: "Excluir" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
  });

  it("Renderiza a Modal quando a operação é Edição e permissão é True", () => {
    renderComponent(mockEdit);

    const botaoExcluir = screen.queryByRole("button", { name: "Excluir" });
    expect(screen.getByText("Editar objetivo")).toBeInTheDocument();
    expect(screen.getByLabelText("Objetivo *")).toHaveValue(mockEdit.objetivo);
    expect(botaoExcluir).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeEnabled();
    fireEvent.click(botaoExcluir);
  });

  it("Renderiza a Modal quando a operação é Edição e permissão é False", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);
    renderComponent(mockEdit);

    expect(screen.getByText("Visualizar objetivo")).toBeInTheDocument();
    expect(screen.getByLabelText("Objetivo *")).toHaveValue(mockEdit.objetivo);
    expect(screen.getByLabelText("Objetivo *")).toBeDisabled();
    expect(screen.getByLabelText("Status")).toBeDisabled();
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

  it("Lancar erro ao tentar salvar objetivo vazia", async () => {
    renderComponent(mockCreate);

    const botaoSalvar = screen.getByRole("button", { name: "Salvar" })
    fireEvent.click(botaoSalvar);
    await waitFor(() => {
      expect(screen.getByText("Nome do objetivo é obrigatório")).toBeInTheDocument();
    })
    
  });

  it("deve validar onchange do campo Status", async () => {
    renderComponent({...mockCreate, status: 0});
    const campoStatus = screen.getByLabelText('Status');
    expect(campoStatus).toBeInTheDocument();
    expect(campoStatus).toBeEnabled();
    expect(campoStatus).toHaveValue("0");
    fireEvent.change(campoStatus, { target: { value: "1" } });
    await waitFor(() => {
      expect(campoStatus).toHaveValue("1")
    })
  });
  
});
