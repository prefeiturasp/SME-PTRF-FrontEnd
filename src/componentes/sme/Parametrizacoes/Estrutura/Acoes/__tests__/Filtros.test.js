import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Filtros } from "../components/Filtros";
import { useAcoesContext } from "../hooks/useAcoesContext";

// Mock do hook de contexto
jest.mock("../hooks/useAcoesContext");

describe("Componente <Filtros />", () => {
  // Mocks das funções e do estado inicial com recurso_uuid
  const mockHandleChangeFiltros = jest.fn();
  const mockHandleSubmitFiltros = jest.fn();
  const mockLimpaFiltros = jest.fn();

  const mockDraftFilters = {
    filtrar_por_nome: "",
    recurso_uuid: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Configuração padrão do mock do hook
    useAcoesContext.mockReturnValue({
      draftFilters: mockDraftFilters,
      handleChangeFiltros: mockHandleChangeFiltros,
      handleSubmitFiltros: mockHandleSubmitFiltros,
      limpaFiltros: mockLimpaFiltros,
    });
  });

  test("deve renderizar o formulário e os elementos corretamente", () => {
    render(<Filtros />);

    // Verifica rótulo e input de texto
    const label = screen.getByLabelText(/Filtrar por nome da ação/i);
    const input = screen.getByPlaceholderText(/Escreva o nome da ação/i);

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("");

    // Verifica os botões
    const btnLimpar = screen.getByRole("button", { name: /Limpar/i });
    const btnFiltrar = screen.getByRole("button", { name: /Filtrar/i });

    expect(btnLimpar).toBeInTheDocument();
    expect(btnFiltrar).toBeInTheDocument();
  });

  test("deve exibir os valores atuais presentes em draftFilters (incluindo recurso_uuid)", () => {
    // Sobrescreve o mock simulando um estado preenchido com filtro por nome e recurso_uuid
    useAcoesContext.mockReturnValue({
      draftFilters: {
        filtrar_por_nome: "Projeto Alpha",
        recurso_uuid: "rec-123-uuid",
      },
      handleChangeFiltros: mockHandleChangeFiltros,
      handleSubmitFiltros: mockHandleSubmitFiltros,
      limpaFiltros: mockLimpaFiltros,
    });

    render(<Filtros />);

    const input = screen.getByPlaceholderText(/Escreva o nome da ação/i);
    expect(input).toHaveValue("Projeto Alpha");
  });

  test("deve chamar handleChangeFiltros ao digitar no input", () => {
    render(<Filtros />);

    const input = screen.getByPlaceholderText(/Escreva o nome da ação/i);

    fireEvent.change(input, {
      target: { name: "filtrar_por_nome", value: "Nova Ação" },
    });

    expect(mockHandleChangeFiltros).toHaveBeenCalledTimes(1);
    expect(mockHandleChangeFiltros).toHaveBeenCalledWith(
      "filtrar_por_nome",
      "Nova Ação"
    );
  });

  test("deve chamar limpaFiltros ao clicar no botão 'Limpar'", () => {
    render(<Filtros />);

    const btnLimpar = screen.getByRole("button", { name: /Limpar/i });
    fireEvent.click(btnLimpar);

    expect(mockLimpaFiltros).toHaveBeenCalledTimes(1);
  });

  test("deve chamar handleSubmitFiltros ao clicar no botão 'Filtrar'", () => {
    // Garante que o handleSubmitFiltros é disparado considerando a presença do recurso_uuid no estado
    useAcoesContext.mockReturnValue({
      draftFilters: {
        filtrar_por_nome: "Ação Específica",
        recurso_uuid: "rec-456-uuid",
      },
      handleChangeFiltros: mockHandleChangeFiltros,
      handleSubmitFiltros: mockHandleSubmitFiltros,
      limpaFiltros: mockLimpaFiltros,
    });

    render(<Filtros />);

    const btnFiltrar = screen.getByRole("button", { name: /Filtrar/i });
    fireEvent.click(btnFiltrar);

    expect(mockHandleSubmitFiltros).toHaveBeenCalledTimes(1);
  });
});