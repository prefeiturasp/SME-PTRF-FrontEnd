import React from "react";
import { render, screen, renderHook } from "@testing-library/react";
import useRowExpansionReceitaTemplate from "../useRowExpansionReceitaTemplate";
import { useCarregaTabelaReceita } from "../../../../Globais/useCarregaTabelaReceita";

jest.mock("../../../../Globais/useCarregaTabelaReceita", () => ({
  useCarregaTabelaReceita: jest.fn(),
}));

describe("useRowExpansionReceitaTemplate", () => {
  it("deve renderizar corretamente o template com dados", () => {
    const prestacaoDeContas = {};

    const mockData = {
      documento_mestre: {
        mensagem_inativa: "Documento inativo por motivo X",
        detalhamento: "Detalhe 1 ",
        categoria_receita: 42,
        acao_associacao: { nome: "Ação XYZ" },
      },
    };

    useCarregaTabelaReceita.mockReturnValue({
      categorias_receita: [{ id: 42, nome: "Categoria Especial" }],
    });

    const { result } = renderHook(() =>
      useRowExpansionReceitaTemplate(prestacaoDeContas)
    );

    const JSX = result.current(mockData);

    render(JSX);

    expect(
      screen.getByText("Documento inativo por motivo X")
    ).toBeInTheDocument();
    expect(screen.getByText("Detalhe 1")).toBeInTheDocument();
    expect(screen.getByText("Categoria Especial")).toBeInTheDocument();
    expect(screen.getByText("Ação XYZ")).toBeInTheDocument();
  });
});
