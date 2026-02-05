import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TelaEscolherRecurso } from "../index";
import useRecursoSelecionado from "../../../../hooks/Globais/useRecursoSelecionado";

jest.mock("../../../../hooks/Globais/useRecursoSelecionado");

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

describe("TelaEscolherRecurso", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));
  });

  it("renderiza overlay quando existem múltiplos recursos", () => {
    useRecursoSelecionado.mockReturnValue({
      recursoSelecionado: null,
      recursos: mockRecursos,
      handleChangeRecurso: mockHandleChange,
      isLoading: false,
    });

    render(<TelaEscolherRecurso />);

    expect(screen.getByText("Deseja acessar os dados de qual recurso?")).toBeInTheDocument();
    expect(screen.getByText("Recurso A")).toBeInTheDocument();
    expect(screen.getByText("Recurso B")).toBeInTheDocument();
  });

  it("chama handleChangeRecurso ao clicar no card", () => {
    useRecursoSelecionado.mockReturnValue({
      recursoSelecionado: null,
      recursos: mockRecursos,
      handleChangeRecurso: mockHandleChange,
      isLoading: false,
    });

    render(<TelaEscolherRecurso />);

    fireEvent.click(screen.getByText("Recurso A"));

    expect(mockHandleChange).toHaveBeenCalledWith(mockRecursos[0]);
  });

  it("não renderiza se já existe recursoSelecionado", () => {
    useRecursoSelecionado.mockReturnValue({
      recursoSelecionado: mockRecursos[0],
      recursos: mockRecursos,
      handleChangeRecurso: mockHandleChange,
      isLoading: false,
    });

    const { container } = render(<TelaEscolherRecurso />);

    expect(container).toBeEmptyDOMElement();
  });

  it("seleciona automaticamente quando só existe 1 recurso", () => {
    useRecursoSelecionado.mockReturnValue({
      recursoSelecionado: null,
      recursos: [mockRecursos[0]],
      handleChangeRecurso: mockHandleChange,
      isLoading: false,
    });

    render(<TelaEscolherRecurso />);

    expect(mockHandleChange).toHaveBeenCalledWith(mockRecursos[0]);
  });
});
