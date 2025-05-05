import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ModalForm } from "../ModalForm";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { PeriodosPaaContext } from "../context/index";
import { useGet } from "../hooks/useGet";
import dayjs from "dayjs";

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

jest.mock('antd', () => {
  const React = require('react');
  const dayjs = require('dayjs');
  return {
    DatePicker: ({ onChange, value, ...rest }) => {
      const formatted = value ? dayjs(value).format('MM/YYYY') : '';
      return (
        <input
          value={formatted}
          onChange={(e) => {
            const selectedDate = dayjs(e.timeStamp); // Simule uma data qualquer aqui
            onChange(selectedDate);
          }}
          {...rest}
        />
      );
    },
    Tooltip: ({ children }) => <>{children}</>,
  };
});


const mockEdit = {
  referencia: "2020 a 2021",
  data_inicial: "2020-01-01",
  data_final: "2020-12-31",
  editavel: true,
  id: 1,
  uuid: "12345",
  operacao: "edit"
};

const mockCreate = { 
  referencia: "",
  data_inicial: "",
  data_final: "",
  editavel: true,
  id: null,
  uuid: null,
  operacao: "create",
};

const renderComponent = (mockForm) => {
  return render(
    <PeriodosPaaContext.Provider value={{...contexto, stateFormModal: mockForm}}>
      <ModalForm handleSubmitFormModal={contexto.handleEditFormModal} />
    </PeriodosPaaContext.Provider>
  )
}


describe("Componente ModalForm", () => {
  beforeEach(() => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
    useGet.mockReturnValue({ isLoading: false, data: [], count: 0 });
  });

  it("Renderiza a Modal quando a operação é Cadastro e Permissão True", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

    renderComponent(mockCreate);

    const campoMotivo = screen.getByLabelText("Referência do período de PAA *");
    expect(screen.getByText("Adicionar período do PAA")).toBeInTheDocument();
    expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
    expect(campoMotivo).toHaveValue("");
    expect(campoMotivo).toBeEnabled();
    expect(screen.queryByRole("button", { name: "Excluir" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Adicionar" })).toBeEnabled();
  });

  it("Renderiza a Modal quando a operação é Cadastro e Permissão False", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);

    renderComponent(mockCreate);

    const campoMotivo = screen.getByLabelText("Referência do período de PAA *");
    expect(campoMotivo).toHaveValue("");
    expect(campoMotivo).toBeDisabled();

    expect(screen.getByText("Adicionar período do PAA")).toBeInTheDocument();
    expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Excluir" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Adicionar" })).toBeDisabled();
  });

  it("Renderiza a Modal quando a operação é Edição e permissão é True", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
    renderComponent(mockEdit);

    const botaoExcluir = screen.queryByRole("button", { name: "Excluir" });
    expect(screen.getByText("Editar período do PAA")).toBeInTheDocument();
    expect(screen.getByLabelText("Referência do período de PAA *")).toHaveValue(mockEdit.referencia);
    expect(botaoExcluir).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeEnabled();
    fireEvent.click(botaoExcluir);

  });

  it("Renderiza a Modal quando a operação é Edição e permissão é False", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);
    renderComponent(mockEdit);

    expect(screen.getByText("Editar período do PAA")).toBeInTheDocument();
    expect(screen.getByLabelText("Referência do período de PAA *")).toHaveValue(mockEdit.referencia);
    expect(screen.getByLabelText("Referência do período de PAA *")).toBeDisabled();
    expect(screen.getByLabelText("Data inicial *")).toBeDisabled();
    expect(screen.getByLabelText("Data final *")).toBeDisabled();
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

    const button = screen.getByRole('button', { name: /Excluir/i });
    fireEvent.click(button);

    expect(contexto.setShowModalConfirmacaoExclusao).toHaveBeenCalledWith(true);
  });

  it("Lancar erro ao tentar salvar referencia vazia", async () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

    renderComponent(mockCreate);

    const botaoSalvar = screen.getByRole("button", { name: "Adicionar" })
    fireEvent.click(botaoSalvar);
    await waitFor(() => {
      expect(screen.getByText("Referência é obrigatória")).toBeInTheDocument();
      expect(screen.getByText("Data inicial é obrigatória")).toBeInTheDocument();
      expect(screen.getByText("Data final é obrigatória")).toBeInTheDocument();
    })
    
  });

  it("deve validar onchange do campo data_inicial", async () => {
    renderComponent(mockCreate);

    const campo = screen.getByTestId("input-data-inicial");
    fireEvent.change(campo, { target: { value: "04/2025" } });
    expect(campo).toHaveValue("04/2025")
  
  });
  
  it("deve validar onchange do campo data_final", async () => {
    renderComponent(mockCreate);
    const campo = screen.getByTestId("input-data-final");
    fireEvent.change(campo, { target: { value: "04/2025" } });
    expect(campo).toHaveValue("04/2025")
  });

});
