import React from "react";
import { render, screen } from "@testing-library/react";
import { ExibicaoQuantidade } from "../components/ExibicaoQuantidade";
import { useGetMotivosDevolucaoTesouro } from "../hooks/useGetMotivosDevolucaoTesouro";

jest.mock("../hooks/useGetMotivosDevolucaoTesouro");

describe("ExibicaoQuantidade", () => {
  it("não deve exibir nada quando os dados ainda estão carregando", () => {
    useGetMotivosDevolucaoTesouro.mockReturnValue({
      isLoading: true,
      totalMotivosDevolucaoTesouro: null,
    });

    render(<ExibicaoQuantidade />);

    expect(screen.queryByText(/Exibindo/i)).not.toBeInTheDocument();
  });

  it("não deve exibir nada quando totalMotivosDevolucaoTesouro for nulo", () => {
    useGetMotivosDevolucaoTesouro.mockReturnValue({
      isLoading: false,
      totalMotivosDevolucaoTesouro: null,
    });

    render(<ExibicaoQuantidade />);

    expect(screen.queryByText(/Exibindo/i)).not.toBeInTheDocument();
  });

  it("deve exibir o número total de motivos quando os dados estão carregados", () => {
    useGetMotivosDevolucaoTesouro.mockReturnValue({
      isLoading: false,
      totalMotivosDevolucaoTesouro: 25,
    });

    render(<ExibicaoQuantidade />);

    expect(screen.getByText(/Exibindo/i)).toBeInTheDocument();
    expect(screen.getByText(/25/i)).toBeInTheDocument();

  });
});
