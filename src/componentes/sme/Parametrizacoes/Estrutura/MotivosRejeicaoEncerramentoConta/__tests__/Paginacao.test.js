import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Paginacao } from "../components/Paginacao";
import { MotivosRejeicaoContext } from "../context/MotivosRejeicao";
import { useGetMotivosRejeicao } from "../hooks/useGetMotivosRejeicao";
import React from "react";

jest.mock("../hooks/useGetMotivosRejeicao");

const mockContextValue = {
    setCurrentPage: jest.fn(),
    setFirstPage: jest.fn(),
    firstPage: 1
};

describe("Paginacao Component", () => {
    test("Deve renderizar o paginator quando os dados estiverem carregados", async () => {
        useGetMotivosRejeicao.mockReturnValue({
            isLoading: false,
            data: { count: 30 },
            totalMotivosRejeicao: true
        });

        render(
            <MotivosRejeicaoContext.Provider value={mockContextValue}>
                <Paginacao />
            </MotivosRejeicaoContext.Provider>
        );
        await waitFor(() => {
            
            const botoesPaginator = screen.getAllByRole("button", { hidden: true });
            const botaoProximo = Array.from(botoesPaginator).find(btn =>
                btn.classList.contains("p-paginator-next")
            );
    
            expect(botaoProximo).toBeInTheDocument();
        })
    });

    test("Não deve renderizar o paginator enquanto os dados estiverem carregando", () => {
      useGetMotivosRejeicao.mockReturnValue({
          isLoading: true,
          data: { count: 0 },
          totalMotivosRejeicao: false
      });
  
      render(
          <MotivosRejeicaoContext.Provider value={mockContextValue}>
              <Paginacao />
          </MotivosRejeicaoContext.Provider>
      );
  
      const botoesPaginator = screen.queryAllByRole("button");
      
      expect(botoesPaginator.length).toBe(0);
    });

  test("Deve chamar onPageChange corretamente", async () => {
    useGetMotivosRejeicao.mockReturnValue({
        isLoading: false,
        data: { count: 30 },
        totalMotivosRejeicao: true
    });

    render(
        <MotivosRejeicaoContext.Provider value={mockContextValue}>
            <Paginacao />
        </MotivosRejeicaoContext.Provider>
    );

    const botoesPaginator = screen.getAllByRole("button", { hidden: true });
    const botaoProximo = Array.from(botoesPaginator).find(btn =>
        btn.classList.contains("p-paginator-next")
    );

    fireEvent.click(botaoProximo);

    expect(mockContextValue.setCurrentPage).toHaveBeenCalledWith(2);
    expect(mockContextValue.setFirstPage).toHaveBeenCalledWith(11);
  });
});
