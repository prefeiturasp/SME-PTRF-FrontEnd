import React, { useContext } from "react";
import { renderHook, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useNavigate } from "react-router-dom";
import {
  ReordenarAcoesContext,
  ReordenarAcoesContextProvider,
} from "../../components/ReordenarAcoes/context/ReordenarAcoesContext";

// Imports dos hooks mockados
import { useAbasPorRecursoContext } from "../../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext";
import { useGetAcoesOrdenadas } from "../../components/ReordenarAcoes/hooks/useGetAcoesOrdenadas";
import { usePostReordenarAcoes } from "../../components/ReordenarAcoes/hooks/usePostReordenarAcoes";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";

// Mocks das dependências externas
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock(
  "../../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext",
  () => ({
    useAbasPorRecursoContext: jest.fn(),
  })
);

jest.mock(
  "../../components/ReordenarAcoes/hooks/useGetAcoesOrdenadas",
  () => ({
    useGetAcoesOrdenadas: jest.fn(),
  })
);

jest.mock(
  "../../components/ReordenarAcoes/hooks/usePostReordenarAcoes",
  () => ({
    usePostReordenarAcoes: jest.fn(),
  })
);

jest.mock(
  "../../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes",
  () => ({
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
  })
);

describe("ReordenarAcoesContextProvider", () => {
  const mockNavigate = jest.fn();
  const mockMutate = jest.fn();

  const mockAcoes = [
    { uuid: "acao-1", nome: "Ação 1" },
    { uuid: "acao-2", nome: "Ação 2" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    useNavigate.mockReturnValue(mockNavigate);

    useAbasPorRecursoContext.mockReturnValue({
      selectedRecurso: { uuid: "recurso-contexto-uuid" },
    });

    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

    usePostReordenarAcoes.mockReturnValue({
      mutationPost: { mutate: mockMutate },
    });

    useGetAcoesOrdenadas.mockReturnValue({
      isLoading: false,
      data: mockAcoes,
    });
  });

  const wrapper = ({ children, recursoUuid }) => (
    <ReordenarAcoesContextProvider recursoUuid={recursoUuid}>
      {children}
    </ReordenarAcoesContextProvider>
  );

  test("deve inicializar o contexto e resolver o recursoAtivo priorizando a prop recursoUuid", () => {
    const { result } = renderHook(() => useContext(ReordenarAcoesContext), {
      wrapper: ({ children }) =>
        wrapper({ children, recursoUuid: "recurso-prop-uuid" }),
    });

    expect(result.current.recursoAtivo).toBe("recurso-prop-uuid");
    expect(result.current.TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES).toBe(true);
    expect(result.current.tempResults).toEqual(mockAcoes);
    expect(result.current.uuidsOrdenados).toEqual(["acao-1", "acao-2"]);
  });

  test("deve utilizar selectedRecurso.uuid quando a prop recursoUuid não for informada", () => {
    const { result } = renderHook(() => useContext(ReordenarAcoesContext), {
      wrapper: ({ children }) => wrapper({ children, recursoUuid: null }),
    });

    expect(result.current.recursoAtivo).toBe("recurso-contexto-uuid");
  });

  test("deve identificar corretamente quando existem diferenças na ordenação das ações", () => {
    const { result } = renderHook(() => useContext(ReordenarAcoesContext), {
      wrapper,
    });

    // Inicialmente idênticos (sem diferenças)
    expect(result.current.existemDiferencas()).toBe(false);

    // Altera a ordem dos resultados temporários
    act(() => {
      result.current.setTempResults([
        { uuid: "acao-2", nome: "Ação 2" },
        { uuid: "acao-1", nome: "Ação 1" },
      ]);
    });

    expect(result.current.existemDiferencas()).toBe(true);
  });

  test("deve abrir o modal de salvar ordenação e submeter os dados ao confirmar", async () => {
    const { result } = renderHook(() => useContext(ReordenarAcoesContext), {
      wrapper,
    });

    act(() => {
      result.current.handleSalvarOrdenacaoBtnSalvar();
    });

    expect(result.current.showModalSalvarOrdenacao).toBe(true);

    // Simula a confirmação no modal
    await act(async () => {
      await result.current.handleConfirmModalSalvarOrdenacao();
    });

    expect(mockMutate).toHaveBeenCalledWith({
      uuids_ordenados: ["acao-1", "acao-2"],
    });
    expect(result.current.showModalSalvarOrdenacao).toBe(false);
  });

  test("deve redirecionar diretamente ao clicar em 'Voltar' quando NÃO houver diferenças", () => {
    const { result } = renderHook(() => useContext(ReordenarAcoesContext), {
      wrapper: ({ children }) =>
        wrapper({ children, recursoUuid: "rec-123" }),
    });

    act(() => {
      result.current.handleSalvarOrdenacaoBtnVoltar();
    });

    expect(result.current.showModalAlteracoesNaoSalvas).toBe(false);
    expect(mockNavigate).toHaveBeenCalledWith("/parametro-acoes", {
      state: { recurso_uuid: "rec-123" },
      replace: true,
    });
  });

  test("deve abrir o modal de alterações não salvas ao clicar em 'Voltar' quando houver diferenças", async () => {
    const { result } = renderHook(() => useContext(ReordenarAcoesContext), {
      wrapper: ({ children }) =>
        wrapper({ children, recursoUuid: "rec-123" }),
    });

    // Simula alteração na lista
    act(() => {
      result.current.setTempResults([
        { uuid: "acao-2", nome: "Ação 2" },
        { uuid: "acao-1", nome: "Ação 1" },
      ]);
      result.current.setUuidsOrdenados(["acao-2", "acao-1"]);
    });

    act(() => {
      result.current.handleSalvarOrdenacaoBtnVoltar();
    });

    expect(result.current.showModalAlteracoesNaoSalvas).toBe(true);

    // Confirma a ação de salvar a partir do modal de alterações não salvas
    await act(async () => {
      await result.current.handleConfirmModalAlteracoesNaoSalvas();
    });

    expect(mockMutate).toHaveBeenCalledWith({
      uuids_ordenados: ["acao-2", "acao-1"],
    });
    expect(mockNavigate).toHaveBeenCalledWith("/parametro-acoes", {
      state: { recurso_uuid: "rec-123" },
      replace: true,
    });
  });

  test("deve fechar o modal de salvar ordenação ao chamar handleCloseModalSalvarOrdenacao", () => {
    const { result } = renderHook(() => useContext(ReordenarAcoesContext), {
      wrapper,
    });

    act(() => {
      result.current.handleOpenModalSalvarOrdenacao();
    });
    expect(result.current.showModalSalvarOrdenacao).toBe(true);

    act(() => {
      result.current.handleCloseModalSalvarOrdenacao();
    });
    expect(result.current.showModalSalvarOrdenacao).toBe(false);
  });
});