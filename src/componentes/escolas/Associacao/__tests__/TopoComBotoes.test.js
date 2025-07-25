import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { TopoComBotoes } from "../TopoComBotoes";
import { useNavigate, MemoryRouter } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";

// Mock mais robusto do FontAwesomeIcon
jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: ({ icon }) => (
    <span data-testid="font-awesome-icon" data-icon={icon.iconName} />
  )
}));

// Mock apenas o hook useNavigate, preservando outros exports
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate
}));

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn()
}));

jest.mock("../../../../store/reducers/componentes/escolas/PrestacaoDeContas/PendenciaCadastro/actions", () => ({
  resetUrlVoltar: jest.fn()
}));

describe("TopoComBotoes", () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    mockNavigate.mockClear();
    useDispatch.mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza corretamente com título e sem botão Voltar quando popTo não está definido", () => {
    useSelector.mockImplementation((selector) => selector({
      PendenciaCadastro: { popTo: null }
    }));

    render(
      <MemoryRouter>
        <TopoComBotoes tituloPagina="Meu Título" />
      </MemoryRouter>
    );

    expect(screen.getByText("Meu Título")).toBeInTheDocument();
    expect(screen.queryByText("Voltar")).not.toBeInTheDocument();
  });

  test("renderiza corretamente com título e botão Voltar quando popTo está definido", () => {
    useSelector.mockImplementation((selector) => selector({
      PendenciaCadastro: { popTo: "/minha-rota" }
    }));

    render(
      <MemoryRouter>
        <TopoComBotoes tituloPagina="Meu Título" />
      </MemoryRouter>
    );

    expect(screen.getByText("Meu Título")).toBeInTheDocument();
    expect(screen.getByText("Voltar")).toBeInTheDocument();
    
    // Verifica se o ícone está presente no botão
    const button = screen.getByText("Voltar");
    const icon = button.querySelector('[data-testid="font-awesome-icon"]');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("data-icon", "arrow-left");
  });

  test("chama as funções corretas ao clicar no botão Voltar", () => {
    const mockPopTo = "/minha-rota";
    useSelector.mockImplementation((selector) => selector({
      PendenciaCadastro: { popTo: mockPopTo }
    }));

    render(
      <MemoryRouter>
        <TopoComBotoes tituloPagina="Meu Título" />
      </MemoryRouter>
    );

    const botaoVoltar = screen.getByText("Voltar");
    fireEvent.click(botaoVoltar);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  test("aplica os estilos corretos no botão Voltar", () => {
    useSelector.mockImplementation((selector) => selector({
      PendenciaCadastro: { popTo: "/minha-rota" }
    }));

    render(
      <MemoryRouter>
        <TopoComBotoes tituloPagina="Meu Título" />
      </MemoryRouter>
    );

    const botaoVoltar = screen.getByText("Voltar");
    expect(botaoVoltar).toHaveClass("btn btn-outline-success mr-2");
  });
});