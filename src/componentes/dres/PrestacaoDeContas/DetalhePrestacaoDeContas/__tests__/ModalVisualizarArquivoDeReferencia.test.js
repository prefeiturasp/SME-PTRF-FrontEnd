import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ModalVisualizarArquivoDeReferencia from "../ModalVisualizarArquivoDeReferencia";
import { getVisualizarArquivoDeReferencia } from "../../../../../services/dres/PrestacaoDeContas.service";
import { toast } from "react-toastify";

jest.mock("../../../../../services/dres/PrestacaoDeContas.service", () => ({
  getVisualizarArquivoDeReferencia: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: { error: jest.fn() },
}));

describe("ModalVisualizarArquivoDeReferencia", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
  });

  it("deve solicitar a visualização do arquivo de referência", async () => {
    getVisualizarArquivoDeReferencia.mockResolvedValue({});

    render(
      <ModalVisualizarArquivoDeReferencia
        show
        handleClose={jest.fn()}
        uuidArquivoReferencia="arquivo-1"
        nomeArquivoReferencia="comprovante.pdf"
        tipoArquivoReferencia="pdf"
      />
    );

    expect(
      screen.getByText(/Este navegador não suporta a visualização de PDFs/)
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(getVisualizarArquivoDeReferencia).toHaveBeenCalledWith(
        "comprovante.pdf",
        "arquivo-1",
        "pdf"
      );
    });
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("deve avisar quando o carregamento do arquivo falha", async () => {
    getVisualizarArquivoDeReferencia.mockRejectedValue({ response: { status: 500 } });

    render(
      <ModalVisualizarArquivoDeReferencia
        show
        handleClose={jest.fn()}
        uuidArquivoReferencia="arquivo-1"
        nomeArquivoReferencia="comprovante.pdf"
        tipoArquivoReferencia="pdf"
      />
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("O carregamento do arquivo falhou.");
    });
  });
});
