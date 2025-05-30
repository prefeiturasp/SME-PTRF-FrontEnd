import React from "react";
import { render, screen } from "@testing-library/react";
import { FormularioBemProduzido } from "../index";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({}),
}));

jest.mock("react-router-dom-v5-compat", () => ({
  ...jest.requireActual("react-router-dom-v5-compat"),
  useNavigate: () => mockUseNavigate,
}));

jest.mock("../../../../Globais/UI", () => ({
  IconButton: ({ label }) => <button>{label}</button>,
}));

jest.mock("../components/Steps", () => ({
  Steps: ({ currentStep }) => (
    <div data-testid="steps">Passo atual: {currentStep}</div>
  ),
}));

jest.mock("../VincularDespesas", () => ({
  VincularDespesas: ({ uuid }) => (
    <div data-testid="vincular-despesas">UUID: {uuid}</div>
  ),
}));

let queryClient;

describe("Componente FormularioBemProduzido", () => {
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });
  it("deve renderizar o botão 'Informar valores'", () => {
    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <FormularioBemProduzido />
        </QueryClientProvider>
      </MemoryRouter>
    );
    expect(screen.getByText("Informar valores")).toBeInTheDocument();
  });

  it("deve renderizar o componente Steps com o passo atual", () => {
    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <FormularioBemProduzido />
        </QueryClientProvider>
      </MemoryRouter>
    );
    expect(screen.getByTestId("steps")).toHaveTextContent("Passo atual: 1");
  });

  it("deve renderizar o componente VincularDespesas quando o step é 1", () => {
    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <FormularioBemProduzido />
        </QueryClientProvider>
      </MemoryRouter>
    );
    expect(screen.getByTestId("vincular-despesas")).toHaveTextContent("UUID:");
  });
});
