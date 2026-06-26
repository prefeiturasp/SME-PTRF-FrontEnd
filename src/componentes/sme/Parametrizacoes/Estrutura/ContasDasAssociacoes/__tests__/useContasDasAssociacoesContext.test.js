import React from "react";
import { renderHook } from "@testing-library/react";
import { ContasDasAssociacoesContext } from "../context/ContasDasAssociacoesContext";
import { useContasDasAssociacoesContext } from "../hooks/useContasDasAssociacoesContext";

describe("useContasDasAssociacoesContext", () => {
  it("retorna o valor do provider", () => {
    const value = {
      filter: { page: 2 },
      setFilter: jest.fn(),
    };

    const wrapper = ({ children }) => (
      <ContasDasAssociacoesContext.Provider value={value}>
        {children}
      </ContasDasAssociacoesContext.Provider>
    );

    const { result } = renderHook(() => useContasDasAssociacoesContext(), { wrapper });

    expect(result.current).toBe(value);
  });
});
