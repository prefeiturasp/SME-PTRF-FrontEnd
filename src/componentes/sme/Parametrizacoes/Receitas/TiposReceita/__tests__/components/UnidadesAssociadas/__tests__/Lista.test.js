import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Spin } from "antd";
import { Provider } from "react-redux";
import { useDesvincularUnidade } from "../../../../components/UnidadesAssociadas/hooks/useDesvincularUnidade";
import { useGetUnidadesVinculadas } from "../../../../components/UnidadesAssociadas/hooks/useGetUnidadesVinculadas";
import { UnidadesVinculadas } from "../../../../components/UnidadesAssociadas/Lista";
import { createStore } from "redux";

// Mock de hooks
jest.mock("../../../../components/UnidadesAssociadas/hooks/useGetUnidadesVinculadas", () => ({
  useGetUnidadesVinculadas: jest.fn(),
}));

jest.mock("../../../../components/UnidadesAssociadas/hooks/useDesvincularUnidade", () => ({
  useDesvincularUnidade: jest.fn(),
}));

// Mock da resposta do hook
const mockData = {
  count: 1,
  results: [
    { uuid: "1", codigo_eol: "123", nome_com_tipo: "Unidade A" },
  ],
};

const mockStore = createStore(() => ({}));

describe("UnidadesVinculadas", () => {
  beforeEach(() => {
    useGetUnidadesVinculadas.mockReturnValue({
      data: mockData,
      refetch: jest.fn(),
      isLoading: false,
      error: null,
      isError: false,
    });
    
    const mockMutate = jest.fn();

    useDesvincularUnidade.mockReturnValue({
      mutationDesvincularUnidade: { mutate: mockMutate, isLoading: false },
      mutationDesvincularUnidadeEmLote: { mutate: jest.fn(), isLoading: false },
    });
  });

  it("deve renderizar o componente corretamente", async () => {
    render(<Provider store={mockStore}><UnidadesVinculadas tipoContaUUID="uuid" /></Provider>);

    // Verifique se os dados estão sendo exibidos
    expect(screen.getByText("Código Eol")).toBeInTheDocument();
    expect(screen.getByText("Unidade educacional")).toBeInTheDocument();

    // Verifique a exibição da unidade
    expect(screen.getByText("Unidade A")).toBeInTheDocument();
  });

  it("deve renderizar o botão de desvincular unidade", async () => {
    render(<UnidadesVinculadas tipoContaUUID="uuid" />);

    // Verifique se o botão para desvincular unidade aparece
    const desvincularButton = screen.getByRole("button", { aria: /Desvincular unidade/i });
    expect(desvincularButton).toBeInTheDocument();
  });

  it("deve chamar a função de desvincular unidade quando o botão for clicado", async () => {
  
    render(<Provider store={mockStore}><UnidadesVinculadas tipoContaUUID="uuid" /></Provider>);

    const desvincularButton = screen.getByRole("button", { name: /Desvincular unidade/i });

    fireEvent.click(desvincularButton);

    await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith({
            uuid: "uuid",
            unidadeUUID: "1"
        });
    });
  });
});
