import { render, screen, fireEvent } from "@testing-library/react";
import { Paginacao } from "../components/Paginacao";
import { MotivosDevolucaoTesouroContext } from "../context/MotivosDevolucaoTesouro";
import { useGetMotivosDevolucaoTesouro } from "../hooks/useGetMotivosDevolucaoTesouro";
import React from "react";

jest.mock("../hooks/useGetMotivosDevolucaoTesouro");

const mockContextValue = {
    setCurrentPage: jest.fn(),
    setFirstPage: jest.fn(),
    firstPage: 0
};

describe("Paginacao Component", () => {
    test("Deve renderizar o paginator quando os dados estiverem carregados", () => {
        useGetMotivosDevolucaoTesouro.mockReturnValue({
            isLoading: false,
            data: { count: 30 },
            totalMotivosDevolucaoTesouro: true
        });

        render(
            <MotivosDevolucaoTesouroContext.Provider value={mockContextValue}>
                <Paginacao />
            </MotivosDevolucaoTesouroContext.Provider>
        );

        const botoesPaginator = screen.getAllByRole("button", { hidden: true });
        const botaoProximo = Array.from(botoesPaginator).find(btn =>
        btn.classList.contains("p-paginator-next")
        );

        expect(botaoProximo).toBeInTheDocument();
    });

    test("Não deve renderizar o paginator enquanto os dados estiverem carregando", () => {
      useGetMotivosDevolucaoTesouro.mockReturnValue({
          isLoading: true,
          data: { count: 0 },
          totalMotivosDevolucaoTesouro: false
      });
  
      render(
          <MotivosDevolucaoTesouroContext.Provider value={mockContextValue}>
              <Paginacao />
          </MotivosDevolucaoTesouroContext.Provider>
      );
  
      const botoesPaginator = screen.queryAllByRole("button");
      
      expect(botoesPaginator.length).toBe(0);
    });

  test("Deve chamar onPageChange corretamente", async () => {
    useGetMotivosDevolucaoTesouro.mockReturnValue({
        isLoading: false,
        data: { count: 30 },
        totalMotivosDevolucaoTesouro: true
    });

    render(
        <MotivosDevolucaoTesouroContext.Provider value={mockContextValue}>
            <Paginacao />
        </MotivosDevolucaoTesouroContext.Provider>
    );

    const botoesPaginator = screen.getAllByRole("button", { hidden: true });
    const botaoProximo = Array.from(botoesPaginator).find(btn =>
    btn.classList.contains("p-paginator-next")
    );

    fireEvent.click(botaoProximo);

    expect(mockContextValue.setCurrentPage).toHaveBeenCalledWith(2);
    expect(mockContextValue.setFirstPage).toHaveBeenCalledWith(20);
  });
});
