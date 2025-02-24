import { render, screen, fireEvent } from "@testing-library/react";
import { Paginacao } from "../components/Paginacao";
import { MateriaisServicosContext } from "../context/MateriaisServicos";
import { useGet } from "../hooks/useGet";
import React from "react";
import { mockData } from "../__fixtures__/mockData";
jest.mock("../hooks/useGet");

const mockContextValue = {
    setCurrentPage: jest.fn(),
    setFirstPage: jest.fn(),
    firstPage: 0
};

describe("Paginacao Component", () => {
    test("Deve renderizar o paginator quando os dados estiverem carregados", () => {
        useGet.mockReturnValue({
            isLoading: false,
            data: mockData,
            total: true
        });

        render(
            <MateriaisServicosContext.Provider value={mockContextValue}>
                <Paginacao />
            </MateriaisServicosContext.Provider>
        );

        const botoesPaginator = screen.queryAllByRole("button");

        const botaoProximo = Array.from(botoesPaginator).find(btn =>
            btn.classList.contains("p-paginator-next")
        );

        expect(botaoProximo).toBeInTheDocument();
    });

    test("Não deve renderizar o paginator enquanto os dados estiverem carregando", () => {
      useGet.mockReturnValue({
          isLoading: true,
          data: { count: 0, results: [] },
          total: false
      });

      render(
          <MateriaisServicosContext.Provider value={mockContextValue}>
              <Paginacao />
          </MateriaisServicosContext.Provider>
      );

      const botoesPaginator = screen.queryAllByRole("button");
      expect(botoesPaginator.length).toBe(0);
    });

    test("Deve chamar onPageChange corretamente", async () => {
        useGet.mockReturnValue({
            isLoading: false,
            data: mockData,
            total: true
        });

        render(
            <MateriaisServicosContext.Provider value={mockContextValue}>
                <Paginacao />
            </MateriaisServicosContext.Provider>
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
