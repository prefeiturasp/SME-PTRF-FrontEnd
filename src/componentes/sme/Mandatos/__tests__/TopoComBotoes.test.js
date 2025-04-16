import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TopoComBotoes } from "../components/TopoComBotoes";
import { MandatosContext } from "../context/Mandatos";
import { useGetMandatoMaisRecente } from "../hooks/useGetMandatoMaisRecente";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

jest.mock("../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

// Mock das hooks
jest.mock("../hooks/useGetMandatoMaisRecente");

const mockSetShowModalForm = jest.fn();
const mockSetStateFormModal = jest.fn();
const mockInitialStateFormModal = {}

const context = {
  setShowModalForm: mockSetShowModalForm,
  setStateFormModal: mockSetStateFormModal,
  initialStateFormModal: mockInitialStateFormModal
}

describe("Topo com botões", () => {
    
    beforeEach(() => {
      useGetMandatoMaisRecente.mockReturnValue({
        data: {data_inicial_proximo_mandato: "2025-04-01"}
    });
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MandatosContext.Provider value={context}>
          <TopoComBotoes />
        </MandatosContext.Provider>
      </QueryClientProvider>
    );
  };

  it("deve renderizar o topo com botões", () => {
    renderComponent();

    // Verifica se os dois primeiros registros da lista aparecem
    expect(screen.getByText("Consulta dos mandatos")).toBeInTheDocument();
    expect(useGetMandatoMaisRecente).toHaveBeenCalled();

    const botaoAdd = screen.getByRole("button", { name: "+ adicionar mandato" });
    expect(botaoAdd).toBeInTheDocument();
    expect(botaoAdd).not.toBeDisabled();
    fireEvent.click(botaoAdd);
    expect(mockSetStateFormModal).toHaveBeenCalledWith({
      editavel: true,
      data_inicial: "2025-04-01",
    });
    expect(mockSetShowModalForm).toHaveBeenCalledWith(true);

  });

});
