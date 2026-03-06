import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createStore } from "redux";

import { useDesvincularUnidade } from "../../../components/UnidadesAssociadas/hooks/useDesvincularUnidade";
import { useGetUnidadesVinculadas } from "../../../components/UnidadesAssociadas/hooks/useGetUnidadesVinculadas";
import { UnidadesVinculadas } from "../../../components/UnidadesAssociadas/Lista";
import { ModalConfirm } from "../../../../../../../Globais/Modal/ModalConfirm";

// Mock de hooks
jest.mock(
  "../../../components/UnidadesAssociadas/hooks/useGetUnidadesVinculadas",
  () => ({
    useGetUnidadesVinculadas: jest.fn(),
  }),
);

jest.mock(
  "../../../components/UnidadesAssociadas/hooks/useDesvincularUnidade",
  () => ({
    useDesvincularUnidade: jest.fn(),
  }),
);

jest.mock("../../../../../../../Globais/Modal/ModalConfirm", () => ({
  ModalConfirm: jest.fn(),
}));

const mockMutate = jest.fn();

const mockData = {
  count: 1,
  results: [{ uuid: "1", codigo_eol: "123", nome_com_tipo: "Unidade A" }],
};

const mockStore = createStore(() => ({}));

const renderWithProviders = (component) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <Provider store={mockStore}>
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    </Provider>,
  );
};

describe("UnidadesVinculadas", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useGetUnidadesVinculadas.mockReturnValue({
      data: mockData,
      refetch: jest.fn(),
      isLoading: false,
      error: null,
      isError: false,
    });

    useDesvincularUnidade.mockReturnValue({
      mutationDesvincularUnidade: { mutate: mockMutate, isPending: false },
      mutationDesvincularUnidadeEmLote: { mutate: jest.fn(), isPending: false },
    });
  });

  it("deve renderizar o componente corretamente", () => {
    renderWithProviders(<UnidadesVinculadas tipoContaUUID="uuid" />);

    expect(
      screen.getByRole("columnheader", { name: /Código Eol/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /Unidade educacional/i }),
    ).toBeInTheDocument();

    expect(screen.getByText("Unidade A")).toBeInTheDocument();
  });

  it("deve renderizar o botão de desvincular unidade", () => {
    renderWithProviders(<UnidadesVinculadas tipoContaUUID="uuid" />);

    const desvincularButton = screen.getByRole("button", {
      name: /Desvincular unidade/i,
    });
    expect(desvincularButton).toBeInTheDocument();
  });

  it("deve chamar a função de desvincular unidade quando clicar", async () => {
    ModalConfirm.mockImplementation(({ onConfirm }) => {
      onConfirm();
      return null;
    });

    renderWithProviders(<UnidadesVinculadas tipoContaUUID="uuid" />);

    const button = screen.getByRole("button", { name: /Desvincular unidade/i });

    fireEvent.click(button);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        uuid: "uuid",
        unidadeUUID: "1",
      });
    });
  });
});
