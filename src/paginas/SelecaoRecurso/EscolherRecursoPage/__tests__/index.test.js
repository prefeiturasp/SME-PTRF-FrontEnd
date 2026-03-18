import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { EscolherRecursoPage } from "../index";
import { useRecursoSelecionadoContext } from "../../../../context/RecursoSelecionado";

jest.mock("../../../../context/RecursoSelecionado", () => ({
  useRecursoSelecionadoContext: jest.fn(),
}));

const mockHandleChange = jest.fn();

const mockRecursos = [
  {
    id: 1,
    nome: "Recurso A",
    cor: "#ff0000",
    icone: "/icone-a.png",
  },
  {
    id: 2,
    nome: "Recurso B",
    cor: "#00ff00",
    icone: "/icone-b.png",
  },
];

describe("EscolherRecursoPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));
  });

  it("renderiza overlay quando existem múltiplos recursos", () => {
    useRecursoSelecionadoContext.mockReturnValue({
      recursoSelecionado: null,
      recursos: mockRecursos,
      handleChangeRecurso: mockHandleChange,
      isLoading: false,
    });

    render(<EscolherRecursoPage />);

    expect(screen.getByText("Deseja acessar os dados de qual recurso?")).toBeInTheDocument();
    expect(screen.getByText("Recurso A")).toBeInTheDocument();
    expect(screen.getByText("Recurso B")).toBeInTheDocument();
  });

  it("chama handleChangeRecurso ao clicar no card", () => {
    useRecursoSelecionadoContext.mockReturnValue({
      recursoSelecionado: null,
      recursos: mockRecursos,
      handleChangeRecurso: mockHandleChange,
      isLoading: false,
    });

    render(<EscolherRecursoPage />);

    fireEvent.click(screen.getByText("Recurso A"));

    expect(mockHandleChange).toHaveBeenCalledWith(mockRecursos[0]);
  });
});
