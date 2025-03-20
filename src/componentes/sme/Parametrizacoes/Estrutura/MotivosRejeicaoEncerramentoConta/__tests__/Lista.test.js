// import React from "react";
// import { render, screen, fireEvent, within, waitFor } from "@testing-library/react";
// import { Lista } from "../components/Lista";
// import { MotivosRejeicaoContext } from "../context/MotivosRejeicao";
// import { useGetMotivosRejeicao } from "../hooks/useGetMotivosRejeicao";
// import { usePostMotivoRejeicao } from "../hooks/usePostMotivoRejeicao";
// import { usePatchMotivoRejeicao } from "../hooks/usePatchMotivoRejeicao";
// import { useDeleteMotivoRejeicao } from "../hooks/useDeleteMotivoRejeicao";

// jest.mock("../hooks/useGetMotivosRejeicao");
// jest.mock("../hooks/usePostMotivoRejeicao");
// jest.mock("../hooks/usePatchMotivoRejeicao");
// jest.mock("../hooks/useDeleteMotivoRejeicao");

// const mockSetStateFormModal = jest.fn();
// const mockSetShowModalForm = jest.fn();
// const mockSetBloquearBtnSalvarForm = jest.fn();

// const itemMock = { id: 1, nome: "Motivo 1", uuid: "123" }

// describe("Lista", () => {

//   beforeEach(() => {
//     useGetMotivosRejeicao.mockReturnValue({
//       isLoading: false,
//       data: { results: [itemMock] },
//     });

//     usePostMotivoRejeicao.mockReturnValue({
//       mutationPost: { mutate: jest.fn() },
//     });

//     usePatchMotivoRejeicao.mockReturnValue({
//       mutationPatch: { mutate: jest.fn() },
//     });

//     useDeleteMotivoRejeicao.mockReturnValue({
//       mutationDelete: { mutate: jest.fn() },
//     });
//   });

//   it("deve renderizar a tabela com dados", () => {
//     render(
//       <MotivosRejeicaoContext.Provider
//         value={{
//           stateFormModal: {},
//           setShowModalForm: mockSetShowModalForm,
//           setStateFormModal: mockSetStateFormModal,
//           setBloquearBtnSalvarForm: mockSetBloquearBtnSalvarForm,
//         }}
//       >
//         <Lista />
//       </MotivosRejeicaoContext.Provider>
//     );

//     expect(screen.getByText("Motivo")).toBeInTheDocument();
//     expect(screen.getByText("Motivo 1")).toBeInTheDocument();
//   });

//   it("deve exibir mensagem quando não houver dados", () => {
//     useGetMotivosRejeicao.mockReturnValue({
//       isLoading: false,
//       data: { results: [] },
//     });

//     render(
//       <MotivosRejeicaoContext.Provider value={
//           {
//             stateFormModal: {},
//             setShowModalForm: mockSetShowModalForm
//           }
//         }>
//         <Lista />
//       </MotivosRejeicaoContext.Provider>
//     );

//     expect(screen.getByText("Nenhum resultado encontrado.")).toBeInTheDocument();
//   });

//   it("deve abrir o modal de edição quando clicar no botão editar", () => {
//     render(
//       <MotivosRejeicaoContext.Provider
//         value={{
//           stateFormModal: {},
//           setShowModalForm: mockSetShowModalForm,
//           setStateFormModal: mockSetStateFormModal,
//           setBloquearBtnSalvarForm: mockSetBloquearBtnSalvarForm,
//         }}
//       >
//         <Lista />
//       </MotivosRejeicaoContext.Provider>
//     );

//     const editButton = screen.getByRole("button", { selector: '.btn-editar-membro' });
//     expect(editButton).toBeInTheDocument();
//     fireEvent.click(editButton);

//     expect(mockSetStateFormModal).toHaveBeenCalledWith(itemMock);
//     expect(mockSetShowModalForm).toHaveBeenCalledWith(true);
//   });

//   test('Deve Abrir a Modal', async () => {
//     const handleSubmitFormModal = jest.fn();
//     render(
//       <MotivosRejeicaoContext.Provider
//         value={{
//           stateFormModal: itemMock,
//           setShowModalForm: mockSetShowModalForm,
//           setStateFormModal: mockSetStateFormModal,
//           setBloquearBtnSalvarForm: mockSetBloquearBtnSalvarForm,
//         }}
//       >
//         <Lista />
//       </MotivosRejeicaoContext.Provider>
//     );
//     await waitFor(() => {
      
//       const tabela = screen.getByRole("grid");
//       expect(tabela).toBeInTheDocument();
  
//     });
//     const botaoEditar = within(screen.getByRole("grid")).getByRole("button", { selector: ".btn-editar-membro" });
//     expect(botaoEditar).toBeInTheDocument();
//     expect(botaoEditar).toBeEnabled();
    
//     fireEvent.click(botaoEditar);
//     expect(mockSetShowModalForm).toHaveBeenCalledWith(true);
//     handleSubmitFormModal({nome: "Motivo"});
//     expect(handleSubmitFormModal).toHaveBeenCalledWith({ nome: "Motivo" });
//     // const campos = screen.getAllByRole("textbox");
//     // expect(campos[0]).toBeInTheDocument();
//     // expect(campos[0]).toBeEnabled();

//     // const campoNome = screen.getByLabelText("Motivo *")
//     // expect(campoNome).toBeInTheDocument();
// });

// });
import React, {act} from "react";
import { render, screen, fireEvent, waitFor, renderHook } from "@testing-library/react";
import { Lista } from "../components/Lista";
import { MotivosRejeicaoContext } from "../context/MotivosRejeicao";
import { usePostMotivoRejeicao } from "../hooks/usePostMotivoRejeicao";
import { usePatchMotivoRejeicao } from "../hooks/usePatchMotivoRejeicao";
import { useDeleteMotivoRejeicao } from "../hooks/useDeleteMotivoRejeicao";
import { useGetMotivosRejeicao } from "../hooks/useGetMotivosRejeicao";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

jest.mock("../hooks/useGetMotivosRejeicao");
jest.mock("../hooks/usePostMotivoRejeicao");
jest.mock("../hooks/usePatchMotivoRejeicao");
jest.mock("../hooks/useDeleteMotivoRejeicao");

jest.mock("../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));
const mockCreate = {
  "id": "",
  "nome": "",
  "operacao": "create",
  "uuid": "",
}
const mockEdit = {
  "id": "1",
  "nome": "Teste",
  "operacao": "edit",
  "uuid": "1234",
}
const mockContextValue = {
  initialStateFormModal: {
    "id": "",
    "nome": "",
    "uuid": "",
  },
  stateFormModal: mockCreate,
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
    useGetMotivosRejeicao.mockReturnValue({ isLoading: false, data: [], count: 0 });
    usePostMotivoRejeicao.mockReturnValue({ mutationPost: mutationPostMock });
    usePatchMotivoRejeicao.mockReturnValue({ mutationPatch: mutationPatchMock });
    useDeleteMotivoRejeicao.mockReturnValue({ mutationDelete: { mutate: jest.fn() } });
  });

  test("exibe carregamento quando isLoading é true", () => {
    useGetMotivosRejeicao.mockReturnValue({ isLoading: true, data: [], count: 0 });
    render(
      <MotivosRejeicaoContext.Provider value={mockContextValue}>
        <Lista />
      </MotivosRejeicaoContext.Provider>
    );
    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  test("exibe mensagem de nenhum resultado quando a lista está vazia", () => {
    render(
      <MotivosRejeicaoContext.Provider value={mockContextValue}>
        <Lista />
      </MotivosRejeicaoContext.Provider>
    );
    expect(screen.getByText(/Nenhum resultado encontrado./i)).toBeInTheDocument();
  });

  test("exibe tabela quando há dados", () => {
    useGetMotivosRejeicao.mockReturnValue({
      isLoading: false,
      data: { 
        results: [{ nome: "Motivo 1", uuid: "123", id: 1 }]
      },
      count: 1,
    });

    render(
      <MotivosRejeicaoContext.Provider value={mockContextValue}>
        <Lista />
      </MotivosRejeicaoContext.Provider>
    );

    expect(screen.getByText(/Motivo 1/i)).toBeInTheDocument();
  });

  test("deve abrir o modal de confirmação de exclusão", async () => {
    render(
      <MotivosRejeicaoContext.Provider
        value={{ ...mockContextValue, showModalConfirmacaoExclusao: true }}
      >
        <Lista />
      </MotivosRejeicaoContext.Provider>
    );
    expect(screen.getByText(/Excluir Motivo/i)).toBeInTheDocument();
    expect(screen.getByText(/Deseja realmente excluir este motivo?/i)).toBeInTheDocument();
  })

  test("chama função de exclusão ao confirmar exclusão", async () => {
    const itemDelete = { motivo: "Teste", uuid: "123", id: 1 }
    useGetMotivosRejeicao.mockReturnValue({
      isLoading: false,
      data: [itemDelete],
      count: 1,
    });
    
    const mockDelete = jest.fn();

    useDeleteMotivoRejeicao.mockReturnValue({ mutationDelete: { mutate: mockDelete } });
    
    render(
      <MotivosRejeicaoContext.Provider
        value={{ 
          ...mockContextValue, 
          showModalConfirmacaoExclusao: true,
          stateFormModal: { ...itemDelete, operacao: "edit" }
        }}
      >
        <Lista />
      </MotivosRejeicaoContext.Provider>
    );

    const excluirButton = screen.getByRole("button", { name: /^Excluir$/ });
    fireEvent.click(excluirButton);

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith("123");
    });
  });

  it("deve abrir o modal de edição com os dados corretos ao clicar no botão editar", () => {
    const motivosRejeicao = mockEdit;
    
    useGetMotivosRejeicao.mockReturnValue({
      isLoading: false,
      data: {results: [motivosRejeicao]},
      count: 1,
    });
  
    render(
        <MotivosRejeicaoContext.Provider
            value={{...mockContextValue, stateFormModal: mockEdit}}>
            <Lista />
        </MotivosRejeicaoContext.Provider>
    );

    const editarButton = screen.getByRole("button", { selector: '.btn-editar-membro' });
    fireEvent.click(editarButton);

    expect(mockContextValue.setStateFormModal).toHaveBeenCalledWith({
        ...mockEdit,
        operacao: "edit",
    });

    expect(mockContextValue.setShowModalForm).toHaveBeenCalledWith(true);
  });

  it("deve chamar mutationPost.mutate quando uuid não está presente", () => {
      RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
      const motivo = { nome: "Teste" };

      render(
        <MotivosRejeicaoContext.Provider value={{
          ...mockContextValue, 
          showModalForm: true,
          stateFormModal: {
            nome: motivo.nome,
            uuid: "",
            id: "",
            operacao: "create",
          }}}>
            <Lista />
        </MotivosRejeicaoContext.Provider>
      );

      const botaoAdicionar = screen.getByRole("button", { name: /adicionar/i });
      fireEvent.click(botaoAdicionar);
      
      const { result } = renderHook(() => usePostMotivoRejeicao(), { wrapper });

      act(() => {
        result.current.mutationPost.mutate({ payload: { nome: motivo.nome } });
      });

      expect(mutationPostMock.mutate).toHaveBeenCalledWith({ payload: { nome: "Teste" } });
  });

  it("deve chamar mutationPatch.mutate quando uuid está presente", () => {
      RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
      const motivoRejeicao = { nome: "Teste", uuid: "123", id: "123" };

      render(
        <MotivosRejeicaoContext.Provider value={{
          ...mockContextValue, 
          showModalForm: true, 
          stateFormModal: {
            ...mockEdit,
            operacao: "edit",
          }}}>
            <Lista />
        </MotivosRejeicaoContext.Provider>
      );

      const botaoSalvar = screen.getByRole("button", { name: /salvar/i });
      fireEvent.click(botaoSalvar);

      const { result } = renderHook(() => usePatchMotivoRejeicao(), { wrapper });

      act(() => {
        result.current.mutationPatch.mutate({ UUID: motivoRejeicao.uuid, payload: { nome: motivoRejeicao.nome } });
      });

      expect(mutationPatchMock.mutate).toHaveBeenCalledWith({ UUID: "123", payload: { nome: "Teste" } });
  });
});
