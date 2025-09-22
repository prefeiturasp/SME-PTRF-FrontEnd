import React, {act} from "react";
import { render, screen, fireEvent, waitFor, renderHook, within } from "@testing-library/react";
import { Lista } from "../Lista";
import { MotivosEstornoContext } from "../context/MotivosEstorno";
import { usePostMotivoEstorno } from "../hooks/usePostMotivoEstorno";
import { usePatchMotivoEstorno } from "../hooks/usePatchMotivoEstorno";
import { useDeleteMotivoEstorno } from "../hooks/useDeleteMotivoEstorno";
import { useGetMotivosEstorno } from "../hooks/useGetMotivosEstorno";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

jest.mock("../hooks/useGetMotivosEstorno");
jest.mock("../hooks/usePostMotivoEstorno");
jest.mock("../hooks/usePatchMotivoEstorno");
jest.mock("../hooks/useDeleteMotivoEstorno");

jest.mock("../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

const mockContextValue = {
  initialStateFormModal: {
    "id": "",
    "motivo": "",
    "operacao": "create",
    "uuid": "",
  },
  stateFormModal: {
    "id": "",
    "motivo": "",
    "operacao": "create",
    "uuid": "",
  },
  showModalConfirmacaoExclusao: false,
  rowsPerPage: 10,
  setShowModalConfirmacaoExclusao: jest.fn(),
  setStateFormModal: jest.fn(),
  setShowModalForm: jest.fn(),
};

describe("Lista Component", () => {
  let mutationPostMock = { mutate: jest.fn() };
  let mutationPatchMock = { mutate: jest.fn() };

  const queryClient = new QueryClient()
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )


  beforeEach(() => {
    useGetMotivosEstorno.mockReturnValue({ isLoading: false, data: [], count: 0 });
    usePostMotivoEstorno.mockReturnValue({ mutationPost: mutationPostMock });
    usePatchMotivoEstorno.mockReturnValue({ mutationPatch: mutationPatchMock });
    useDeleteMotivoEstorno.mockReturnValue({ mutationDelete: { mutate: jest.fn() } });
  });

  test("exibe carregamento quando isLoading é true", () => {
    useGetMotivosEstorno.mockReturnValue({ isLoading: true, data: [], count: 0 });
    render(
      <MotivosEstornoContext.Provider value={mockContextValue}>
        <Lista />
      </MotivosEstornoContext.Provider>
    );
    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  test("exibe mensagem de nenhum resultado quando a lista está vazia", () => {
    render(
      <MotivosEstornoContext.Provider value={mockContextValue}>
        <Lista />
      </MotivosEstornoContext.Provider>
    );
    expect(screen.getByText(/Nenhum resultado encontrado./i)).toBeInTheDocument();
  });

  test("exibe tabela quando há dados", () => {
    useGetMotivosEstorno.mockReturnValue({
      isLoading: false,
      data: [{ motivo: "Teste", uuid: "123", id: 1 }],
      count: 1,
    });

    render(
      <MotivosEstornoContext.Provider value={mockContextValue}>
        <Lista />
      </MotivosEstornoContext.Provider>
    );

    expect(screen.getByText((_, element) => element.textContent === 'Exibindo 1 motivo(s) de estorno')).toBeInTheDocument();
    expect(screen.getByText(/Teste/i)).toBeInTheDocument();
  });

  test("deve abrir o modal de confirmação de exclusão", async () => {
    render(
      <MotivosEstornoContext.Provider
        value={{ ...mockContextValue, showModalConfirmacaoExclusao: true }}
      >
        <Lista />
      </MotivosEstornoContext.Provider>
    );
    expect(screen.getByText(/Excluir Motivo de Estorno/i)).toBeInTheDocument();
    expect(screen.getByText(/Deseja realmente excluir este motivo de estorno?/i)).toBeInTheDocument();
  })

  test("chama função de exclusão ao confirmar exclusão", async () => {
    useGetMotivosEstorno.mockReturnValue({
      isLoading: false,
      data: [{ motivo: "Teste", uuid: "123", id: 1 }],
      count: 1,
    });
    
    const mockDelete = jest.fn();

    useDeleteMotivoEstorno.mockReturnValue({ mutationDelete: { mutate: mockDelete } });
    
    render(
      <MotivosEstornoContext.Provider
        value={{ 
          ...mockContextValue, 
          showModalConfirmacaoExclusao: true,
          stateFormModal: { motivo: "Teste", uuid: "123", id: 1, operacao: "edit" }
        }}
      >
        <Lista />
      </MotivosEstornoContext.Provider>
    );

    const excluirButton = screen.getByRole("button", { name: /^Excluir$/ });
    fireEvent.click(excluirButton);

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith("123");
    });
  });

  it("deve abrir o modal de adição ao clicar no botão de adicionar motivo de estorno", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

    render(
      <MotivosEstornoContext.Provider value={{...mockContextValue}}>
          <Lista />
      </MotivosEstornoContext.Provider>
    );

    const adicionarButton = screen.getByRole("button", { name: /adicionar motivo de estorno/i });
    expect(adicionarButton).toBeInTheDocument();
    
    fireEvent.click(adicionarButton);

    expect(mockContextValue.setStateFormModal).toHaveBeenCalledWith({
      "id": "",
      "motivo": "",
      "operacao": "create",
      "uuid": "",
    });
    expect(mockContextValue.setShowModalForm).toHaveBeenCalledWith(true);
  });

  it("deve abrir o modal de edição com os dados corretos ao clicar no botão editar", () => {
    const motivoEstorno = { motivo: "Teste", uuid: "123", id: 1 };
    
    useGetMotivosEstorno.mockReturnValue({
      isLoading: false,
      data: [motivoEstorno],
      count: 1,
    });
  
    render(
        <MotivosEstornoContext.Provider value={{...mockContextValue}}>
            <Lista />
        </MotivosEstornoContext.Provider>
    );

    const editarButton = screen.getByRole("button", { name: /editar/i });
    fireEvent.click(editarButton);

    expect(mockContextValue.setStateFormModal).toHaveBeenCalledWith({
        ...mockContextValue.stateFormModal,
        motivo: motivoEstorno.motivo,
        uuid: motivoEstorno.uuid,
        id: motivoEstorno.id,
        operacao: "edit",
    });

    expect(mockContextValue.setShowModalForm).toHaveBeenCalledWith(true);
  });

  it("deve chamar mutationPost.mutate quando uuid não está presente", () => {
      RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
      const motivoEstorno = { motivo: "Teste" };

      render(
        <MotivosEstornoContext.Provider value={{
          ...mockContextValue, 
          showModalForm: true,
          stateFormModal: {
            motivo: motivoEstorno.motivo,
            uuid: "",
            id: "",
            operacao: "create",
          }}}>
            <Lista />
        </MotivosEstornoContext.Provider>
      );

      const modal = screen.getByRole("dialog");
      const botaoAdicionar = within(modal).getByRole("button", { name: /^Adicionar$/ });
      fireEvent.click(botaoAdicionar);
      
      const { result } = renderHook(() => usePostMotivoEstorno(), { wrapper });

      act(() => {
        result.current.mutationPost.mutate({ payload: { motivo: motivoEstorno.motivo } });
      });

      expect(mutationPostMock.mutate).toHaveBeenCalledWith({ payload: { motivo: "Teste" } });
  });

  it("deve chamar mutationPatch.mutate quando uuid está presente", () => {
      RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
      const motivoEstorno = { motivo: "Teste", uuid: "123", id: "123" };

      render(
        <MotivosEstornoContext.Provider value={{
          ...mockContextValue, 
          showModalForm: true, 
          stateFormModal: {
            motivo: motivoEstorno.motivo,
            uuid: motivoEstorno.uuid,
            id: motivoEstorno.id,
            operacao: "edit",
          }}}>
            <Lista />
        </MotivosEstornoContext.Provider>
      );

      const botaoSalvar = screen.getByRole("button", { name: /salvar/i });
      fireEvent.click(botaoSalvar);

      const { result } = renderHook(() => usePatchMotivoEstorno(), { wrapper });

      act(() => {
        result.current.mutationPatch.mutate({ UUID: motivoEstorno.uuid, payload: { motivo: motivoEstorno.motivo } });
      });

      expect(mutationPatchMock.mutate).toHaveBeenCalledWith({ UUID: "123", payload: { motivo: "Teste" } });
  });
});
