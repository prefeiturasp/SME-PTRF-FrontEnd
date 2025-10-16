import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { useVincularUnidade } from "../../../components/VincularUnidades/hooks/useVincularUnidade";
import { useGetUnidadesNaoVinculadas } from "../../../components/VincularUnidades/hooks/useGetUnidadesNaoVinculadas";
import { VincularUnidades } from "../../../components/VincularUnidades";
import { createStore } from "redux";
import { ModalConfirm } from "../../../../../../../Globais/Modal/ModalConfirm";

// Mock de hooks
jest.mock("../../../components/VincularUnidades/hooks/useGetUnidadesNaoVinculadas", () => ({
  useGetUnidadesNaoVinculadas: jest.fn(),
}));

jest.mock("../../../components/VincularUnidades/hooks/useVincularUnidade", () => ({
  useVincularUnidade: jest.fn(),
}));

jest.mock("../../../../../../../Globais/Modal/ModalConfirm", () => ({
  ModalConfirm: jest.fn(),
}));

// Mock da resposta do hook
const mockData = {
  count: 1,
  results: [{ uuid: "1", codigo_eol: "123", nome_com_tipo: "Unidade A" }],
};

const mockStore = createStore(() => ({}));

describe("VincularUnidades", () => {
  beforeEach(() => {
    useGetUnidadesNaoVinculadas.mockReturnValue({
      data: mockData,
      refetch: jest.fn(),
      isLoading: false,
      error: null,
      isError: false,
    });

    useVincularUnidade.mockReturnValue({
      mutationVincularUnidadeEmLote: { mutate: jest.fn(), isLoading: false },
    });
  });

  it("deve renderizar o componente corretamente", async () => {
    render(
      <Provider store={mockStore}>
        <VincularUnidades UUID="uuid" />
      </Provider>
    );

    expect(screen.getByRole("columnheader", { name: /Código Eol/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /Unidade educacional/i })).toBeInTheDocument();

    expect(screen.getByText("Unidade A")).toBeInTheDocument();
  });

  it("deve renderizar o botão de vincular unidade", async () => {
    render(
      <Provider store={mockStore}>
        <VincularUnidades UUID="uuid" />
      </Provider>
    );

    const vincularButton = screen.getByRole("button", { name: /Vincular unidade/i });
    expect(vincularButton).toBeInTheDocument();
  });

  it("deve chamar a função de vincular unidade quando o botão for clicado", async () => {
    render(
      <Provider store={mockStore}>
        <VincularUnidades UUID="uuid" />
      </Provider>
    );

    const vincular = screen.getByRole("button", { name: /Vincular unidade/i });
    fireEvent.click(vincular);

    await waitFor(() => {
      expect(ModalConfirm).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Confirmação vincular unidade",
        })
      );
    });
  });
});
