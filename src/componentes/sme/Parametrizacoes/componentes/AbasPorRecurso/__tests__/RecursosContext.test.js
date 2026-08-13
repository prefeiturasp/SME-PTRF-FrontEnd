import React, { useContext } from "react";
import { render, screen, act, renderHook } from "@testing-library/react";
import {
  AbasPorRecursoContext,
  AbasPorRecursoProvider,
} from "../context/Recursos";

describe("AbasPorRecursoContext & AbasPorRecursoProvider", () => {
  describe("Valores Padrão do Contexto (Sem Provider)", () => {
    test("deve fornecer os valores iniciais definidos no createContext quando consumido fora do Provider", () => {
      const { result } = renderHook(() => useContext(AbasPorRecursoContext));

      expect(result.current.selectedRecurso).toBeNull();
      expect(result.current.clickBtnEscolheOpcao).toEqual({});
      expect(typeof result.current.setSelectedRecurso).toBe("function");
      expect(typeof result.current.setClickBtnEscolheOpcao).toBe("function");
    });
  });

  describe("AbasPorRecursoProvider", () => {
    test("deve renderizar os componentes filhos (children) corretamente", () => {
      render(
        <AbasPorRecursoProvider>
          <div data-testid="child-component">Conteúdo Filho</div>
        </AbasPorRecursoProvider>
      );

      expect(screen.getByTestId("child-component")).toBeInTheDocument();
      expect(screen.getByText("Conteúdo Filho")).toBeInTheDocument();
    });

    test("deve fornecer os valores iniciais de estado através do Provider", () => {
      const { result } = renderHook(() => useContext(AbasPorRecursoContext), {
        wrapper: AbasPorRecursoProvider,
      });

      expect(result.current.selectedRecurso).toBeNull();
      expect(result.current.clickBtnEscolheOpcao).toEqual({});
    });

    test("deve atualizar o estado `selectedRecurso` corretamente", () => {
      const { result } = renderHook(() => useContext(AbasPorRecursoContext), {
        wrapper: AbasPorRecursoProvider,
      });

      const mockRecurso = { uuid: "rec-123", nome: "Relatórios" };

      act(() => {
        result.current.setSelectedRecurso(mockRecurso);
      });

      expect(result.current.selectedRecurso).toEqual(mockRecurso);
    });

    test("deve atualizar o estado `clickBtnEscolheOpcao` corretamente", () => {
      const { result } = renderHook(() => useContext(AbasPorRecursoContext), {
        wrapper: AbasPorRecursoProvider,
      });

      const novoEstadoBtn = { "rec-123": true };

      act(() => {
        result.current.setClickBtnEscolheOpcao(novoEstadoBtn);
      });

      expect(result.current.clickBtnEscolheOpcao).toEqual(novoEstadoBtn);
    });

    test("deve permitir resetar os estados para os valores padrão", () => {
      const { result } = renderHook(() => useContext(AbasPorRecursoContext), {
        wrapper: AbasPorRecursoProvider,
      });

      // Altera os estados
      act(() => {
        result.current.setSelectedRecurso({ uuid: "rec-1" });
        result.current.setClickBtnEscolheOpcao({ "rec-1": true });
      });

      // Reseta os estados
      act(() => {
        result.current.setSelectedRecurso(null);
        result.current.setClickBtnEscolheOpcao({});
      });

      expect(result.current.selectedRecurso).toBeNull();
      expect(result.current.clickBtnEscolheOpcao).toEqual({});
    });
  });
});