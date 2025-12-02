import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { useDesvincularUnidade } from "../../../components/UnidadesVinculadas/hooks/useDesvincularUnidade";
import { useGetUnidadesVinculadas } from "../../../components/UnidadesVinculadas/hooks/useGetUnidadesVinculadas";
import { UnidadesVinculadas } from "../../../components/UnidadesVinculadas/index";
import { createStore } from "redux";
import { ModalConfirm } from "../../../../../../../Globais/Modal/ModalConfirm";

// Mock de hooks
jest.mock("../../../components/UnidadesVinculadas/hooks/useGetUnidadesVinculadas", () => ({
  useGetUnidadesVinculadas: jest.fn(),
}));

jest.mock("../../../components/UnidadesVinculadas/hooks/useDesvincularUnidade", () => ({
  useDesvincularUnidade: jest.fn(),
}));

jest.mock("../../../../../../../Globais/Modal/ModalConfirm", () => ({
  ModalConfirm: jest.fn(),
}));

const mockData = {
  count: 1,
  results: [{ uuid: "1", codigo_eol: "123", nome_com_tipo: "Unidade A" }],
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

    useDesvincularUnidade.mockReturnValue({
      mutationDesvincularUnidadeEmLote: { mutate: jest.fn(), isPending: false },
    });
  });

  it("deve renderizar o componente corretamente", async () => {
    render(
      <Provider store={mockStore}>
        <UnidadesVinculadas UUID="uuid" />
      </Provider>
    );

    expect(screen.getByRole("columnheader", { name: /Código Eol/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /Unidade educacional/i })).toBeInTheDocument();

    expect(screen.getByText("Unidade A")).toBeInTheDocument();
  });

  it("deve renderizar o botão de desvincular unidade", async () => {
    render(
      <Provider store={mockStore}>
        <UnidadesVinculadas UUID="uuid" />
      </Provider>
    );

    const desvincularButton = screen.getByRole("button", { name: /Desvincular unidade/i });
    expect(desvincularButton).toBeInTheDocument();
  });

  it("deve chamar a função de desvincular unidade quando o botão for clicado", async () => {
    render(
      <Provider store={mockStore}>
        <UnidadesVinculadas UUID="uuid" />
      </Provider>
    );

    const vincular = screen.getByRole("button", { name: /Desvincular unidade/i });
    fireEvent.click(vincular);

    await waitFor(() => {
      expect(ModalConfirm).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Confirmação desvincular unidade ao tipo de despesa de custeio",
        })
      );
    });
  });
});
