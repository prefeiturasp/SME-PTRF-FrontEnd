import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Paginacao } from "../components/Paginacao";
import { MandatosContext } from "../context/Mandatos";
import { useGetMandatos } from "../hooks/useGetMandatos";
import { mandatosData } from "../__fixtures__/mockData";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

// Mock das hooks
jest.mock("../hooks/useGetMandatos");

const mockSetCurrentPage = jest.fn();
const mockSetFirstPage = jest.fn();

const context = {
    setCurrentPage: mockSetCurrentPage,
    setFirstPage: mockSetFirstPage,
    firstPage: 1
}

describe("Paginacao", () => {

    beforeEach(() => {
      useGetMandatos.mockReturnValue({
        isLoading: false,
        totalMandatos: 12,
        data: {results: mandatosData, count: 12}
    });
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MandatosContext.Provider value={context}>
          <Paginacao />
        </MandatosContext.Provider>
      </QueryClientProvider>
    );
  };

  it("deve renderizar a paginação", () => {
    renderComponent();

    // Verifica se os dois primeiros registros da lista aparecem
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(useGetMandatos).toHaveBeenCalled();

  });

  it("deve renderizar a paginação e mudar de página", () => {
    renderComponent();

    const pagina2 = screen.getByText("2");
    fireEvent.click(pagina2);
    expect(mockSetCurrentPage).toHaveBeenCalledWith(2);
    expect(mockSetFirstPage).toHaveBeenCalledWith(10);

  });

});
