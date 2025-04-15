import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ExibicaoQuantidade } from "../components/ExibicaoQuantidade";
import { useGetMandatos } from "../hooks/useGetMandatos";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();


// Mock das hooks
jest.mock("../hooks/useGetMandatos");


describe("Exibição quantidade", () => {
    
    beforeEach(() => {
      useGetMandatos.mockReturnValue({
        isLoading: false,
        totalMandatos: 12
      });
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>

          <ExibicaoQuantidade />

      </QueryClientProvider>
    );
  };

  it("deve exibir a quantidade", () => {
    renderComponent();

    // Verifica se os dois primeiros registros da lista aparecem
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(useGetMandatos).toHaveBeenCalled();

  });

});
