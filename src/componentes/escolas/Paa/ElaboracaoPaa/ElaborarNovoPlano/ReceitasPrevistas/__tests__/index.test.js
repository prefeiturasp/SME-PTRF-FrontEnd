import React from "react";
import { render, screen } from "@testing-library/react";
import { useGetAcoesAssociacao } from "../hooks/useGetAcoesAssociacao";
import { useGetTotalizadorRecursoProprio } from "../../DetalhamentoRecursosProprios/hooks/useGetTotalizarRecursoProprio";
import ReceitasPrevistas from "../index";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("../hooks/useGetAcoesAssociacao");
jest.mock(
  "../../DetalhamentoRecursosProprios/hooks/useGetTotalizarRecursoProprio"
);

describe("ReceitasPrevistas Component", () => {
  let queryClient;

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    useGetTotalizadorRecursoProprio.mockReturnValue({
      data: { total: 0 },
      isLoading: false,
    });
  });

  it("deve renderizar corretamente", () => {
    useGetAcoesAssociacao.mockReturnValue({
      data: [],
      isLoading: false,
    });

    render(<ReceitasPrevistas />, { wrapper });

    const titulo = screen.getByRole("heading", {
      level: 4,
      name: /receitas previstas/i,
    });
    expect(titulo).toBeInTheDocument();
    expect(screen.getAllByText("Receitas Previstas")[0]).toBeInTheDocument();
    expect(screen.getByText("Detalhamento das ações PDDE")).toBeInTheDocument();
    expect(
      screen.getByText("Detalhamento de Recursos Próprios")
    ).toBeInTheDocument();
  });
});
