import React from "react";
import { render, screen } from "@testing-library/react";
import { InfosAssociacao } from "../InfosAssociacao";

const mockDados = {
  dados_da_associacao: {
    nome: "Associação Teste",
    cnpj: "12.345.678/0001-90",
    ccm: "123456",
    presidente_associacao: {
      nome: "João Silva",
      cargo_educacao: "Presidente",
      email: "joao@teste.com",
    },
    presidente_conselho_fiscal: {
      nome: "Maria Souza",
      cargo_educacao: "Conselheira",
      email: "maria@teste.com",
    },
  },
};

describe("InfosAssociacao", () => {
  it("deve renderizar o título da seção", () => {
    render(<InfosAssociacao dadosDaAssociacao={mockDados} />);

    expect(screen.getByText("Dados da associação")).toBeInTheDocument();
  });

  it("deve exibir o nome da associação", () => {
    render(<InfosAssociacao dadosDaAssociacao={mockDados} />);

    expect(screen.getByText("Associação Teste")).toBeInTheDocument();
  });

  it("deve exibir o CNPJ e CCM corretamente", () => {
    render(<InfosAssociacao dadosDaAssociacao={mockDados} />);

    expect(screen.getByText("12.345.678/0001-90")).toBeInTheDocument();
    expect(screen.getByText("123456")).toBeInTheDocument();
  });

  it("deve exibir dados do presidente da associação", () => {
    render(<InfosAssociacao dadosDaAssociacao={mockDados} />);

    expect(screen.getByText("João Silva")).toBeInTheDocument();
    expect(screen.getByText("Presidente")).toBeInTheDocument();
    expect(screen.getByText("joao@teste.com")).toBeInTheDocument();
  });

  it("deve exibir dados do presidente do conselho fiscal", () => {
    render(<InfosAssociacao dadosDaAssociacao={mockDados} />);

    expect(screen.getByText("Maria Souza")).toBeInTheDocument();
    expect(screen.getByText("Conselheira")).toBeInTheDocument();
    expect(screen.getByText("maria@teste.com")).toBeInTheDocument();
  });
});