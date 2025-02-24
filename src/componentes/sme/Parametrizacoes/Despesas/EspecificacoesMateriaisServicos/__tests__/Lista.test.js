import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Lista } from "../components/Lista";
import { ModalForm } from "../components/ModalForm";
import { MateriaisServicosContext } from "../context/MateriaisServicos";
import { useGet } from "../hooks/useGet";
import { usePost } from "../hooks/usePost";
import { usePatch } from "../hooks/usePatch";
import { useDelete } from "../hooks/useDelete";
import { mockData } from "../__fixtures__/mockData";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

// Mock das hooks
jest.mock("../hooks/useGet");
jest.mock("../hooks/usePost");
jest.mock("../hooks/usePatch");
jest.mock("../hooks/useDelete");


const mockSetStateFormModal = jest.fn();
const mockSetShowModalForm = jest.fn();
const mockSetBloquearBtnSalvarForm = jest.fn();
const mockHandleExcluir = jest.fn();

const stateFormCreate = {
    id: null,
    uuid: "",
    descricao: "",
    aplicacao_recurso: "",
    tipo_custeio: "",
    ativa: true
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
        useGet.mockReturnValue({
            isLoading: false,
      refetch: jest.fn(),
      data: mockData
    });

    usePost.mockReturnValue({ mutationPost: mockMutationPost});
    usePatch.mockReturnValue({ mutationPatch: mockMutationPatch });
    useDelete.mockReturnValue({ mutationDelete: mockMutationDelete });
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MateriaisServicosContext.Provider value={context}>
          <Lista />
          <ModalForm handleSubmitFormModal={jest.fn()} />
        </MateriaisServicosContext.Provider>
      </QueryClientProvider>
    );
  };

  it("deve renderizar a tabela com dados", () => {
    renderComponent();

    // Verifica se os dois primeiros registros da lista aparecem
    expect(screen.getByText("Especificação 9f74")).toBeInTheDocument();
    expect(screen.getByText("Especificação 9d3a")).toBeInTheDocument();
    expect(useGet).toHaveBeenCalled();

  });

  it("Valida quando nenhum registro foi carregado", () => {
    useGet.mockReturnValue({ data: { results: [] } });
    renderComponent();
    expect(screen.getByText("Nenhum resultado encontrado.")).toBeInTheDocument();
  });

  it("deve abrir o modal de edição quando clicar no botão editar", async () => {
    const item = mockData.results[0]
    useGet.mockReturnValue({ data: { results: [item] } });
    renderComponent();

    const botaoEditar = screen.getByRole("button", { selector: ".btn-editar-especificacoes" });
    fireEvent.click(botaoEditar);

    let edicaoItem = item
    delete edicaoItem.tipo_custeio_objeto // apenas para listagem (não para o form)
    edicaoItem.tipo_custeio = edicaoItem.tipo_custeio_objeto ?? "" // tratado no handleEditFormModal a conversão de null para "" devido à validação de string YUP

    expect(mockSetStateFormModal).toHaveBeenCalledWith(edicaoItem);
    expect(mockSetShowModalForm).toHaveBeenCalledWith(true);
  });

  it("deve remover um registro", async () => {
    const item = mockData.results[0]
    useGet.mockReturnValue({ data: { results: [item] } });
    renderComponent();

    const botaoEditar = screen.getByRole("button", { selector: ".btn-editar-especificacoes" });
    fireEvent.click(botaoEditar);

    await waitFor(() => {
        expect(mockSetStateFormModal).toHaveBeenCalledWith(item);
        expect(mockSetShowModalForm).toHaveBeenCalledWith(true);
    });
  });
});
