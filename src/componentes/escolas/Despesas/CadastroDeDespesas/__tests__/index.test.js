import React from "react";
import { render, screen } from "@testing-library/react";
import { CadastroDeDespesas } from "../index";
import { CadastroForm } from "../CadastroForm";

// Mock do componente CadastroForm
jest.mock("../CadastroForm", () => ({
  CadastroForm: ({ verbo_http, veioDeSituacaoPatrimonial }) => (
    <div data-testid="cadastro-form">
      <div data-testid="verbo-http">{verbo_http}</div>
      <div data-testid="veio-de-situacao-patrimonial">
        {veioDeSituacaoPatrimonial ? "true" : "false"}
      </div>
    </div>
  ),
}));

describe("Componente CadastroDeDespesas", () => {
  it("deve renderizar o CadastroForm com as props corretas", () => {
    const props = {
      verbo_http: "POST",
      veioDeSituacaoPatrimonial: true,
    };

    render(<CadastroDeDespesas {...props} />);

    expect(screen.getByTestId("cadastro-form")).toBeInTheDocument();
    expect(screen.getByTestId("verbo-http")).toHaveTextContent("POST");
    expect(screen.getByTestId("veio-de-situacao-patrimonial")).toHaveTextContent("true");
  });

  it("deve renderizar o CadastroForm com verbo_http PATCH", () => {
    const props = {
      verbo_http: "PATCH",
      veioDeSituacaoPatrimonial: false,
    };

    render(<CadastroDeDespesas {...props} />);

    expect(screen.getByTestId("verbo-http")).toHaveTextContent("PATCH");
    expect(screen.getByTestId("veio-de-situacao-patrimonial")).toHaveTextContent("false");
  });

  it("deve renderizar o CadastroForm com props undefined", () => {
    render(<CadastroDeDespesas />);

    expect(screen.getByTestId("cadastro-form")).toBeInTheDocument();
    expect(screen.getByTestId("verbo-http")).toHaveTextContent("");
    expect(screen.getByTestId("veio-de-situacao-patrimonial")).toHaveTextContent("false");
  });

  it("deve passar todas as props para o CadastroForm", () => {
    const props = {
      verbo_http: "PUT",
      veioDeSituacaoPatrimonial: true,
    };

    render(<CadastroDeDespesas {...props} />);

    const cadastroForm = screen.getByTestId("cadastro-form");
    expect(cadastroForm).toBeInTheDocument();
    
    // Verifica se as props estão sendo passadas corretamente
    expect(screen.getByTestId("verbo-http")).toHaveTextContent("PUT");
    expect(screen.getByTestId("veio-de-situacao-patrimonial")).toHaveTextContent("true");
  });
}); 