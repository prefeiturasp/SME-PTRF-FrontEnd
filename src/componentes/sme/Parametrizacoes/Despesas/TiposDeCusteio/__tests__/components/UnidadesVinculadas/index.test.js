import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { useDesvincularUnidade } from "../../../components/UnidadesVinculadas/hooks/useDesvincularUnidade";
import { useGetUnidadesVinculadas } from "../../../components/UnidadesVinculadas/hooks/useGetUnidadesVinculadas";
import { UnidadesVinculadas } from "../../../components/UnidadesVinculadas/index";
import { ModalConfirm } from "../../../../../../../Globais/Modal/ModalConfirm";
import { renderWithProviders } from "../../../__fixtures__/mockData";

// Mock de hooks
jest.mock(
  "../../../components/UnidadesVinculadas/hooks/useGetUnidadesVinculadas",
  () => ({
    useGetUnidadesVinculadas: jest.fn(),
  }),
);

jest.mock(
  "../../../components/UnidadesVinculadas/hooks/useDesvincularUnidade",
  () => ({
    useDesvincularUnidade: jest.fn(),
  }),
);

jest.mock("../../../../../../../Globais/Modal/ModalConfirm", () => ({
  ModalConfirm: jest.fn(),
}));

const mockData = {
  count: 1,
  results: [{ uuid: "1", codigo_eol: "123", nome_com_tipo: "Unidade A" }],
};

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
    renderWithProviders(<UnidadesVinculadas UUID="uuid" />);

    expect(
      screen.getByRole("columnheader", { name: /Código Eol/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /Unidade educacional/i }),
    ).toBeInTheDocument();

    expect(screen.getByText("Unidade A")).toBeInTheDocument();
  });

  it("deve renderizar o botão de desvincular unidade", async () => {
    renderWithProviders(<UnidadesVinculadas UUID="uuid" podeEditar={true} />);

    const desvincularButton = screen.getByRole("button", {
      name: /Desvincular unidade/i,
    });
    expect(desvincularButton).toBeInTheDocument();
  });

  it("deve chamar a função de desvincular unidade quando o botão for clicado", async () => {
    renderWithProviders(<UnidadesVinculadas UUID="uuid" podeEditar={true} />);

    const vincular = screen.getByRole("button", {
      name: /Desvincular unidade/i,
    });
    fireEvent.click(vincular);

    await waitFor(() => {
      expect(ModalConfirm).toHaveBeenCalledWith(
        expect.objectContaining({
          title:
            "Confirmação desvincular unidade ao tipo de despesa de custeio",
        }),
      );
    });
  });
});
