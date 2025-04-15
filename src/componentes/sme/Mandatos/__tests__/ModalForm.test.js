import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { ModalForm } from "../components/ModalForm";
import { MandatosContext } from "../context/Mandatos";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import {ModalFormBodyText} from "../../../Globais/ModalBootstrap";
// import { dadosTabelas, mockData } from "../__fixtures__/mockData";
import { useGetMandatoMaisRecente } from "../hooks/useGetMandatoMaisRecente";
import { getMandatoMaisRecente } from "../../../../services/Mandatos.service";
import {postMandato} from "../../../../services/Mandatos.service";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


jest.mock("../../../../services/Mandatos.service", () => ({
  getMandatoMaisRecente: jest.fn(),
  postMandato: jest.fn()
}));

jest.mock("../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

const handleSubmitFormModal = jest.fn();
const handleConfirmDeleteMandato = jest.fn();
const setShowModalForm = jest.fn();
const setShowModalConfirmacaoExclusao = jest.fn();
// const setBloquearBtnSalvarForm = jest.fn();
// const setStateFormModal = jest.fn();

const queryClient = new QueryClient();

const stateFormCreate = {
  referencia: "",
  data_inicial: "",
  data_final: "",
  editavel: true,
  data_inicial_proximo_mandato: "", 
  uuid: "", id: "", 
  limite_min_data_inicial: ""
}

const stateFormEdit = {
  referencia: "Referencia 1",
  data_inicial: "2025-04-01",
  data_final: "2025-04-11",
  editavel: true,
  data_inicial_proximo_mandato: "2025-04-15", 
  uuid: "uuid1", id: 1, 
  limite_min_data_inicial: ""
};

const mockContextValue = {
  showModalForm: true,
  setShowModalForm,
  stateFormModal: stateFormCreate,
  bloquearBtnSalvarForm: false,
  handleConfirmDeleteMandato,
  // setStateFormModal,
  // setBloquearBtnSalvarForm
};

describe("ModalForm Componente", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    getMandatoMaisRecente.mockReturnValue({ data: {
      referencia: "Referencia 1",
      data_inicial: "2025-04-01",
      data_final: "2025-04-11",
      editavel: true,
      data_inicial_proximo_mandato: "2025-04-15", 
      uuid: "uuid1", id: 1, 
      limite_min_data_inicial: ""
    } });
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
      <MandatosContext.Provider value={mockContextValue}>
        <ModalForm handleSubmitFormModal={handleSubmitFormModal} handleConfirmDeleteMandato={handleConfirmDeleteMandato}/>
      </MandatosContext.Provider>
      </QueryClientProvider>
    );
  }

  it("Renderiza a Modal Form quando há permissão", async () => {
    renderComponent();

    const campoReferencia = screen.getByLabelText("Referência do mandato *")
    expect(campoReferencia).toBeInTheDocument();
    expect(campoReferencia).toBeEnabled();

    const campoDataInicial = screen.getByLabelText("Data inicial *")
    expect(campoDataInicial).toBeInTheDocument();
    expect(campoDataInicial).toBeEnabled();

    const campoDataFinal = screen.getByLabelText("Data final *")
    expect(campoDataFinal).toBeInTheDocument();
    expect(campoDataFinal).toBeDisabled();

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

    const campoReferencia = screen.getByLabelText("Referência do mandato *")
    expect(campoReferencia).toBeInTheDocument();
    expect(campoReferencia).not.toBeEnabled();

    const campoDataInicial = screen.getByLabelText("Data inicial *")
    expect(campoDataInicial).toBeInTheDocument();
    expect(campoDataInicial).not.toBeEnabled();

    const campoDataFinal = screen.getByLabelText("Data final *")
    expect(campoDataFinal).toBeInTheDocument();
    expect(campoDataFinal).not.toBeEnabled();

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
      const erroValidaDescricao = screen.getByText("Referência do mandato é obrigatório");
      expect(erroValidaDescricao).toBeInTheDocument();

      const erroValidaTipoAplicacao = screen.getAllByText("Data Inicial é obrigatória");
      expect(erroValidaTipoAplicacao[0]).toBeInTheDocument();

      expect(handleSubmitFormModal).not.toHaveBeenCalled();
    })
  });


  it("CREATE - Chama submit e onChange quando preenchidos os campos", async () => {
    renderComponent();

    const campoReferencia = screen.getByLabelText("Referência do mandato *")
    expect(campoReferencia).toBeInTheDocument();
    fireEvent.change(campoReferencia, { target: { value: "Referencia 1" } });

    const campoDataInicial = screen.getByLabelText("Data inicial *")
    const campoDataFinal = screen.getByLabelText("Data final *")

    userEvent.clear(campoDataInicial);
    userEvent.click(campoDataInicial);
    userEvent.type(campoDataInicial, "14/04/2025");

    userEvent.clear(campoDataFinal);
    userEvent.click(campoDataFinal);
    userEvent.type(campoDataFinal, "15/04/2025");

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
      <QueryClientProvider client={queryClient}>
      <MandatosContext.Provider value={mockContextEdicao}>
        <ModalForm handleSubmitFormModal={handleSubmitFormModal} handleConfirmDeleteMandato={handleConfirmDeleteMandato}/>
      </MandatosContext.Provider>
      </QueryClientProvider>
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
      <QueryClientProvider client={queryClient}>
      <MandatosContext.Provider value={mockContextEdicao}>
        <ModalForm handleSubmitFormModal={handleSubmitFormModal} handleConfirmDeleteMandato={handleConfirmDeleteMandato}/>
      </MandatosContext.Provider>
      </QueryClientProvider>
    );

    const botaoExcluir = screen.getByRole("button", { name: "Apagar" });
    fireEvent.click(botaoExcluir);

    await waitFor(() => {
      expect(handleConfirmDeleteMandato).toHaveBeenCalledWith("uuid1");
    })
  });

  it("CANCELAR EDIT - Fecha a Modal de Edição ao cancelar", async () => {
    const mockContextEdicao = {
      ...mockContextValue,
      stateFormModal: stateFormEdit
    }
    render(
      <QueryClientProvider client={queryClient}>
      <MandatosContext.Provider value={mockContextEdicao}>
        <ModalForm handleSubmitFormModal={handleSubmitFormModal} handleConfirmDeleteMandato={handleConfirmDeleteMandato}/>
      </MandatosContext.Provider>
      </QueryClientProvider>
    );

    const botaoCancelar = screen.getByRole("button", { name: "Cancelar" });
    fireEvent.click(botaoCancelar);

    await waitFor(() => {
      expect(setShowModalForm).toHaveBeenCalledWith(false);
    })
  });

});
