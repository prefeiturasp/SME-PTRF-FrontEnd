import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { ImportarUnidades } from "../ImportarUnidades";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/* -------------------------------------------------
 * Mocks
 * ------------------------------------------------- */

// Mock do ModalImportarListaUes
jest.mock("../ModalImportarListaUes", () => ({
  __esModule: true,
  default: ({ showModalImportarUEs, onCloseModal, onSuccess }) =>
    showModalImportarUEs ? (
      <div data-testid="modal-importar">
        <button onClick={onSuccess}>confirmar</button>
        <button onClick={onCloseModal}>fechar</button>
      </div>
    ) : null,
}));

/* -------------------------------------------------
 * Helper de render com QueryClient
 * ------------------------------------------------- */
const renderWithQueryClient = (ui, client) => {
  return render(
    <QueryClientProvider client={client}>
      {ui}
    </QueryClientProvider>
  );
};

describe("ImportarUnidades", () => {
  let queryClient;

  const outroRecursoPeriodo = {
    uuid: "uuid-destino",
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    jest.spyOn(queryClient, "invalidateQueries");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /* ---------------------------------------------
   * Testes
   * --------------------------------------------- */

  it("renderiza o botão Importar lista de UEs", () => {
    renderWithQueryClient(
      <ImportarUnidades outroRecursoPeriodo={outroRecursoPeriodo} />,
      queryClient
    );

    expect(
      screen.getByRole("button", { name: /importar lista de ues/i })
    ).toBeInTheDocument();
  });

  it("abre o modal ao clicar no botão", () => {
    renderWithQueryClient(
      <ImportarUnidades outroRecursoPeriodo={outroRecursoPeriodo} />,
      queryClient
    );

    fireEvent.click(
      screen.getByRole("button", { name: /importar lista de ues/i })
    );

    expect(screen.getByTestId("modal-importar")).toBeInTheDocument();
  });

  it("fecha o modal ao chamar onCloseModal", () => {
    renderWithQueryClient(
      <ImportarUnidades outroRecursoPeriodo={outroRecursoPeriodo} />,
      queryClient
    );

    fireEvent.click(
      screen.getByRole("button", { name: /importar lista de ues/i })
    );

    fireEvent.click(screen.getByText("fechar"));

    expect(
      screen.queryByTestId("modal-importar")
    ).not.toBeInTheDocument();
  });

  it("invalida as queries corretas ao executar onSuccess", () => {
    renderWithQueryClient(
      <ImportarUnidades outroRecursoPeriodo={outroRecursoPeriodo} />,
      queryClient
    );

    fireEvent.click(
      screen.getByRole("button", { name: /importar lista de ues/i })
    );

    fireEvent.click(screen.getByText("confirmar"));

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["unidades-vinculadas", "uuid-destino"],
      exact: false,
    });

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["unidades-nao-vinculadas", "uuid-destino"],
      exact: false,
    });

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["outros-recursos-periodos-paa"],
      exact: false,
    });
  });
});
