import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Lista } from "../components/Lista";
import { ModalForm } from "../components/ModalForm";
import { RepassesContext } from "../context/Repasse";
import { useGetRepasses } from "../hooks/useGetRepasses";
import { usePostRepasse } from "../hooks/usePostRepasse";
import { usePatchRepasse } from "../hooks/usePatchRepasse";
import { useDeleteRepasse } from "../hooks/useDeleteRepasse";
import { mockRepasses } from "../__fixtures__/mockData";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

// Mock das hooks
jest.mock("../hooks/useGetRepasses");
jest.mock("../hooks/usePostRepasse");
jest.mock("../hooks/usePatchRepasse");
jest.mock("../hooks/useDeleteRepasse");


const mockSetStateFormModal = jest.fn();
const mockSetShowModalForm = jest.fn();
const mockSetBloquearBtnSalvarForm = jest.fn();
const mockHandleExcluir = jest.fn();

const stateFormCreate = {
    uuid: '',
    associacao: '',
    valor_capital: 0,
    valor_custeio: 0,
    valor_livre: 0,
    conta_associacao: '',
    acao_associacao: '',
    periodo: '',
    status: 'PENDENTE',
    realizado_capital: '',
    realizado_custeio: '',
    realizado_livre: '',
    nome_unidade: '',
    carga_origem: '',
    id_linha_carga: '',
    id: '',
    campos_editaveis: {
        campos_de_realizacao: false
    }
}

const context = {
    setBloquearBtnSalvarForm: mockSetBloquearBtnSalvarForm,
    setShowModalForm: mockSetShowModalForm,
    stateFormModal: stateFormCreate,
    setStateFormModal: mockSetStateFormModal,
    handleExcluir: mockHandleExcluir,
}

describe("Lista", () => {
    const mockMutationPost = { mutate: jest.fn() };
    const mockMutationPatch = { mutate: jest.fn() };
    const mockMutationDelete = { mutate: jest.fn() };
    beforeEach(() => {
        useGetRepasses.mockReturnValue({
            isLoading: false,
      refetch: jest.fn(),
      data: mockRepasses
    });

    usePostRepasse.mockReturnValue({ mutationPost: mockMutationPost});
    usePatchRepasse.mockReturnValue({ mutationPatch: mockMutationPatch });
    useDeleteRepasse.mockReturnValue({ mutationDelete: mockMutationDelete });
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <RepassesContext.Provider value={context}>
          <Lista />
          <ModalForm handleSubmitFormModal={jest.fn()} />
        </RepassesContext.Provider>
      </QueryClientProvider>
    );
  };

  it("deve renderizar a tabela com dados", () => {
    renderComponent();

    // Verifica se os dois primeiros registros da lista aparecem
    expect(screen.getByText("EMEI 25 DE JANEIRO")).toBeInTheDocument();
    expect(screen.getByText("CEI DIRET JARDIM SAO LUIZ I")).toBeInTheDocument();
    expect(useGetRepasses).toHaveBeenCalled();

  });

  it("Valida quando nenhum registro foi carregado", () => {
    useGetRepasses.mockReturnValue({ data: { results: [] } });
    renderComponent();
    expect(screen.getByText("Nenhum resultado encontrado.")).toBeInTheDocument();
  });

  it("deve abrir o modal de edição quando clicar no botão editar", async () => {
    const item = mockRepasses.results[0]
    useGetRepasses.mockReturnValue({ data: { results: [item] } });
    renderComponent();

    const botaoEditar = screen.getByRole("button", { selector: ".btn-editar-membro" });
    fireEvent.click(botaoEditar);
    expect(mockSetShowModalForm).toHaveBeenCalledWith(true);
  });

});
