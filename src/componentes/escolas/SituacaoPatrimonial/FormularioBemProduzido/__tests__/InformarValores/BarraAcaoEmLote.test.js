import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { BarraAcaoEmLote } from "../../InformarValores/BarraAcaoEmLote";

const mockUseNavigate = jest.fn();
const mockSetDespesasSelecionadas = jest.fn();
const mockHandleExcluirDespesa = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useSearchParams: jest.fn()
}));

describe("Componente BarraAcaoEmLote", () => {
  it("deve mostrar a quantidade de despesas selecionadas", () => {
    render(
      <BarraAcaoEmLote
        despesasSelecionadas={[{ id: "despesa-1" }, { id: "despesa-2" }]}
      />
    );
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("despesas selecionadas")).toBeInTheDocument();
  });
  it("deve chamar setDespesasSelecionadas após clicar em Cancelar", () => {
    render(
      <BarraAcaoEmLote
        despesasSelecionadas={[{ id: "despesa-1" }, { id: "despesa-2" }]}
        setDespesasSelecionadas={mockSetDespesasSelecionadas}
      />
    );
    const buttonCancelar = screen.getByRole("button", { name: "Cancelar" });
    fireEvent.click(buttonCancelar);

    expect(mockSetDespesasSelecionadas).toHaveBeenCalledWith([]);
  });
  it("deve chamar handleExcluirDespesa após clicar em Excluir despesa", () => {
    render(
      <BarraAcaoEmLote
        despesasSelecionadas={[{ id: "despesa-1" }, { id: "despesa-2" }]}
        setDespesasSelecionadas={mockSetDespesasSelecionadas}
        handleExcluirDespesa={mockHandleExcluirDespesa}
      />
    );
    const buttonExcluir = screen.getByRole("button", {
      name: "Excluir despesa",
    });
    fireEvent.click(buttonExcluir);

    expect(mockHandleExcluirDespesa).toHaveBeenCalled();
  });
});
