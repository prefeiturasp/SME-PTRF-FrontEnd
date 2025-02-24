import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ModalForm } from "../components/ModalForm";
import { MateriaisServicosContext } from "../context/MateriaisServicos";
import { useGetTabelas } from "../hooks/useGetTabelas";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { ModalFormBodyText } from "../../../../../Globais/ModalBootstrap";
import { dadosTabelas, mockData } from "../__fixtures__/mockData";

jest.mock("../hooks/useGetTabelas", () => ({
  useGetTabelas: jest.fn(),
}));

jest.mock("../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

const handleSubmitFormModal = jest.fn();
const setShowModalForm = jest.fn();
const setShowModalConfirmacaoExclusao = jest.fn();
const setBloquearBtnSalvarForm = jest.fn();
const setStateFormModal = jest.fn();

const stateFormCreate = {
  id: null,
  uuid: null,
  descricao: "",
  aplicacao_recurso: "",
  tipo_custeio: "",
  ativa: true
}

const stateFormEdit = mockData.results[0];

const mockContextValue = {
  showModalForm: true,
  setShowModalForm,
  stateFormModal: stateFormCreate,
  bloquearBtnSalvarForm: false,
  setShowModalConfirmacaoExclusao,
  setStateFormModal,
  setBloquearBtnSalvarForm
};

describe("ModalForm Componente", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    useGetTabelas.mockReturnValue({ data: dadosTabelas });
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
  });

  const renderComponent = () => {
    return render(
      <MateriaisServicosContext.Provider value={mockContextValue}>
        <ModalForm handleSubmitFormModal={handleSubmitFormModal} />
      </MateriaisServicosContext.Provider>
    );
  }

  it("Renderiza a Modal Form quando há permissão", async () => {
    renderComponent();

    const campoDescricao = screen.getByLabelText("Descrição *")
    expect(campoDescricao).toBeInTheDocument();
    expect(campoDescricao).toBeEnabled();

    const campoAplicacao = screen.getByLabelText("Tipo de aplicação do recurso *")
    expect(campoAplicacao).toBeInTheDocument();
    expect(campoAplicacao).toBeEnabled();

    const campoTipoCusteio = screen.getByLabelText("Tipo de despesa de custeio *")
    expect(campoTipoCusteio).toBeInTheDocument();
    expect(campoTipoCusteio).toBeEnabled();

    const radioEstaAtivo = screen.getByLabelText("Sim", { selector: 'input[name="ativa_true"]' });
    expect(radioEstaAtivo).toBeInTheDocument();
    expect(radioEstaAtivo).toBeEnabled();
    const radioEstaInativo = screen.getByLabelText("Não", { selector: 'input[name="ativa_false"]' });
    expect(radioEstaInativo).toBeInTheDocument();
    expect(radioEstaInativo).toBeEnabled();

    const botaoSalvar = screen.getByRole("button", { name: "Adicionar" });
    expect(botaoSalvar).toBeInTheDocument();
    expect(botaoSalvar).toBeEnabled();

    const botaoCancelar = screen.getByRole("button", { name: "Cancelar" });
    expect(botaoCancelar).toBeInTheDocument();
    expect(botaoCancelar).toBeEnabled();
  });

  it("Renderiza a Modal Form quando NÃO há permissão", async () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);
    renderComponent();

    const campoDescricao = screen.getByLabelText("Descrição *")
    expect(campoDescricao).toBeInTheDocument();
    expect(campoDescricao).not.toBeEnabled();

    const campoAplicacao = screen.getByLabelText("Tipo de aplicação do recurso *")
    expect(campoAplicacao).toBeInTheDocument();
    expect(campoAplicacao).not.toBeEnabled();

    const campoTipoCusteio = screen.getByLabelText("Tipo de despesa de custeio *")
    expect(campoTipoCusteio).toBeInTheDocument();
    expect(campoTipoCusteio).not.toBeEnabled();

    const radioEstaAtivo = screen.getByLabelText("Sim", { selector: 'input[name="ativa_true"]' });
    expect(radioEstaAtivo).toBeInTheDocument();
    expect(radioEstaAtivo).not.toBeEnabled();
    const radioEstaInativo = screen.getByLabelText("Não", { selector: 'input[name="ativa_false"]' });
    expect(radioEstaInativo).toBeInTheDocument();
    expect(radioEstaInativo).not.toBeEnabled();

    const botaoSalvar = screen.getByRole("button", { name: "Adicionar" });
    expect(botaoSalvar).toBeInTheDocument();
    expect(botaoSalvar).not.toBeEnabled();

  });

  it("Reporta validações nos campos quando não preenchidos", async () => {
    renderComponent();

    const botaoSalvar = screen.getByRole("button", { name: "Adicionar" });
    expect(botaoSalvar).toBeInTheDocument();
    fireEvent.click(botaoSalvar);
    await waitFor(() => {
      const erroValidaDescricao = screen.getByText("Descrição é obrigatório.");
      expect(erroValidaDescricao).toBeInTheDocument();

      const erroValidaTipoAplicacao = screen.getByText("Aplicação de recurso é obrigatório.");
      expect(erroValidaTipoAplicacao).toBeInTheDocument();

      const erroValidaTipoCusteio = screen.getByText("Tipo de custeio é obrigatório.");
      expect(erroValidaTipoCusteio).toBeInTheDocument();

      // Habilitado por default
      const radioEstaAtivo = screen.getByLabelText("Sim", { selector: 'input[name="ativa_true"]' });
      expect(radioEstaAtivo).toBeInTheDocument();
      expect(radioEstaAtivo).toBeChecked();

      // Desabilitado por default
      const radioEstaInativo = screen.getByLabelText("Não", { selector: 'input[name="ativa_false"]' });
      expect(radioEstaInativo).toBeInTheDocument();
      expect(radioEstaInativo).not.toBeChecked();

      expect(handleSubmitFormModal).not.toHaveBeenCalled();
    })
  });

  it("Testa a condicional do campo Tipo de Custeio quando Aplicação é CAPITAL", async () => {
    renderComponent();

    const botaoSalvar = screen.getByRole("button", { name: "Adicionar" });

    const campoDescricao = screen.getByLabelText("Descrição *")
    fireEvent.change(campoDescricao, { target: { value: "Descrição teste" } });

    const campoAplicacao = screen.getByLabelText("Tipo de aplicação do recurso *")
    fireEvent.change(campoAplicacao, { target: { value: "CAPITAL" } });

    const campoTipoCusteioObrigatorio = screen.queryByLabelText("Tipo de despesa de custeio *")
    expect(campoTipoCusteioObrigatorio).not.toBeInTheDocument();

    const campoTipoCusteioDesabilitado = screen.queryByLabelText("Tipo de despesa de custeio")
    expect(campoTipoCusteioDesabilitado).toBeInTheDocument();
    expect(campoTipoCusteioDesabilitado).toBeDisabled();

    fireEvent.click(botaoSalvar);
    await waitFor(() => {
      expect(handleSubmitFormModal).toHaveBeenCalled();
    });

  });

  it("Testa a condicional do campo Tipo de Custeio quando Aplicação é CUSTEIO", async () => {
    renderComponent();

    const botaoSalvar = screen.getByRole("button", { name: "Adicionar" });

    const campoDescricao = screen.getByLabelText("Descrição *")
    fireEvent.change(campoDescricao, { target: { value: "Descrição teste" } });

    const campoAplicacao = screen.getByLabelText("Tipo de aplicação do recurso *")
    fireEvent.change(campoAplicacao, { target: { value: "CUSTEIO" } });

    const campoTipoCusteioObrigatorio = screen.getByLabelText("Tipo de despesa de custeio *")
    expect(campoTipoCusteioObrigatorio).toBeInTheDocument();
    expect(campoTipoCusteioObrigatorio).not.toBeDisabled();

    const campoTipoCusteioOpcional = screen.queryByLabelText("Tipo de despesa de custeio")
    expect(campoTipoCusteioOpcional).not.toBeInTheDocument();

    fireEvent.click(botaoSalvar);
    await waitFor(() => {
      // Não chama o método devido à obrigação de seleção de Tipo de Custeio
      // quando tipo de aplicação é igual a CUSTEIO
      expect(handleSubmitFormModal).not.toHaveBeenCalled();
    });

    fireEvent.change(campoTipoCusteioObrigatorio, { target: { value: "1" } });
    fireEvent.click(botaoSalvar);
    await waitFor(() => {
      expect(handleSubmitFormModal).toHaveBeenCalled();
    });

  });

  it("CREATE - Chama submit e onChange quando preenchidos os campos", async () => {
    renderComponent();

    const campoDescricao = screen.getByLabelText("Descrição *")
    fireEvent.change(campoDescricao, { target: { value: "Descrição teste" } });

    const campoAplicacao = screen.getByLabelText("Tipo de aplicação do recurso *")
    fireEvent.change(campoAplicacao, { target: { value: "CUSTEIO" } });

    const campoTipoCusteio = screen.getByLabelText("Tipo de despesa de custeio *")
    fireEvent.change(campoTipoCusteio, { target: { value: "1" } });

    const radioEstaInativo = screen.getByLabelText("Não", { selector: 'input[name="ativa_false"]' });
    fireEvent.click(radioEstaInativo);
    const radioEstaAtivo = screen.getByLabelText("Sim", { selector: 'input[name="ativa_true"]' });
    fireEvent.click(radioEstaAtivo);

    const erroValidaDescricao = screen.queryByText("Descrição é obrigatório.");
    expect(erroValidaDescricao).not.toBeInTheDocument();

    const erroValidaTipoAplicacao = screen.queryByText("Aplicação de recurso é obrigatório.");
    expect(erroValidaTipoAplicacao).not.toBeInTheDocument();

    const erroValidaTipoCusteio = screen.queryByText("Tipo de custeio é obrigatório.");
    expect(erroValidaTipoCusteio).not.toBeInTheDocument();

    const botaoSalvar = screen.getByRole("button", { name: "Adicionar" });
    fireEvent.click(botaoSalvar);

    await waitFor(() => {
      expect(handleSubmitFormModal).toHaveBeenCalled();
    })
  });

  it("EDIT - Chama submit de edição", async () => {
    const mockContextEdicao = {
      ...mockContextValue,
      stateFormModal: stateFormEdit
    }
    render(
      <MateriaisServicosContext.Provider value={mockContextEdicao}>
        <ModalForm handleSubmitFormModal={handleSubmitFormModal} />
      </MateriaisServicosContext.Provider>
    );

    const botaoSalvar = screen.getByRole("button", { name: "Salvar" });
    fireEvent.click(botaoSalvar);
    await waitFor(() => {
      expect(handleSubmitFormModal).toHaveBeenCalled();
    })
  });

  it("DELETE - Chama a confirmação de Exclusão", async () => {
    const mockContextEdicao = {
      ...mockContextValue,
      stateFormModal: stateFormEdit
    }
    render(
      <MateriaisServicosContext.Provider value={mockContextEdicao}>
        <ModalForm handleSubmitFormModal={handleSubmitFormModal} />
      </MateriaisServicosContext.Provider>
    );

    const botaoExcluir = screen.getByRole("button", { name: "Excluir" });
    fireEvent.click(botaoExcluir);

    await waitFor(() => {
      expect(setShowModalConfirmacaoExclusao).toHaveBeenCalledWith(true);
    })
  });

  it("CANCELAR EDIT - Fecha a Modal de Edição ao cancelar", async () => {
    const mockContextEdicao = {
      ...mockContextValue,
      stateFormModal: stateFormEdit
    }
    render(
      <MateriaisServicosContext.Provider value={mockContextEdicao}>
        <ModalForm handleSubmitFormModal={handleSubmitFormModal} />
      </MateriaisServicosContext.Provider>
    );

    const botaoCancelar = screen.getByRole("button", { name: "Cancelar" });
    fireEvent.click(botaoCancelar);

    await waitFor(() => {
      expect(setShowModalForm).toHaveBeenCalledWith(false);
    })
  });

});
