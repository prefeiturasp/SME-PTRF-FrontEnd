import React from "react";
import { render, screen } from "@testing-library/react";
import { InfosUnidadeEducacional } from "../InfosUnidadeEducacional";

const mockDadosCompletos = {
  dados_da_associacao: {
    unidade: {
      nome: "EMEF Teste",
      codigo_eol: "123456",
      email: "emef@teste.com",
      qtd_alunos: 350,
      diretor_nome: "Carlos Diretor",
      telefone: "(11) 1234-5678",
      tipo_logradouro: "Rua",
      logradouro: "das Flores",
      numero: "100",
      complemento: "Fundos",
      bairro: "Centro",
      cep: "01000-000",
    },
  },
};

describe("InfosUnidadeEducacional", () => {
  it("deve renderizar o título da seção", () => {
    render(<InfosUnidadeEducacional dadosDaAssociacao={mockDadosCompletos} />);

    expect(screen.getByText("Dados da unidade")).toBeInTheDocument();
  });

  it("deve exibir todos os campos com dados completos", () => {
    render(<InfosUnidadeEducacional dadosDaAssociacao={mockDadosCompletos} />);

    expect(screen.getByText("EMEF Teste")).toBeInTheDocument();
    expect(screen.getByText("123456")).toBeInTheDocument();
    expect(screen.getByText("emef@teste.com")).toBeInTheDocument();
    expect(screen.getByText("350")).toBeInTheDocument();
    expect(screen.getByText("Carlos Diretor")).toBeInTheDocument();
    expect(screen.getByText("(11) 1234-5678")).toBeInTheDocument();
  });

  it("deve exibir os rótulos dos campos", () => {
    render(<InfosUnidadeEducacional dadosDaAssociacao={mockDadosCompletos} />);

    expect(screen.getByText("Nome da Unidade Educacional")).toBeInTheDocument();
    expect(screen.getByText("Código EOL da Unidade Escolar")).toBeInTheDocument();
    expect(screen.getByText("E-mail da Unidade Escolar")).toBeInTheDocument();
    expect(screen.getByText("Número de estudantes")).toBeInTheDocument();
    expect(screen.getByText("Nome do Diretor")).toBeInTheDocument();
    expect(screen.getByText("Telefone da Unidade Educacional")).toBeInTheDocument();
    expect(screen.getByText("Endereço da Unidade Educacional")).toBeInTheDocument();
  });

  it("deve montar o endereço completo com todos os campos presentes", () => {
    render(<InfosUnidadeEducacional dadosDaAssociacao={mockDadosCompletos} />);

    expect(
      screen.getByText((content) =>
        content.includes("Rua") &&
        content.includes("das Flores,") &&
        content.includes("100 -") &&
        content.includes("Fundos -") &&
        content.includes("Centro,") &&
        content.includes("São Paulo - SP,") &&
        content.includes("01000-000")
      )
    ).toBeInTheDocument();
  });

  it("deve montar o endereço sem logradouro quando ausente", () => {
    const dados = {
      dados_da_associacao: {
        unidade: {
          ...mockDadosCompletos.dados_da_associacao.unidade,
          logradouro: undefined,
        },
      },
    };
    render(<InfosUnidadeEducacional dadosDaAssociacao={dados} />);

    const enderecoEl = screen.getByText((content) =>
      content.includes("São Paulo - SP,") && content.includes("01000-000")
    );
    expect(enderecoEl).toBeInTheDocument();
    expect(enderecoEl.textContent).not.toContain("das Flores");
  });

  it("deve montar o endereço sem complemento quando ausente", () => {
    const dados = {
      dados_da_associacao: {
        unidade: {
          ...mockDadosCompletos.dados_da_associacao.unidade,
          complemento: undefined,
        },
      },
    };
    render(<InfosUnidadeEducacional dadosDaAssociacao={dados} />);

    const enderecoEl = screen.getByText((content) =>
      content.includes("das Flores,") &&
      content.includes("São Paulo - SP,") &&
      content.includes("01000-000")
    );
    expect(enderecoEl).toBeInTheDocument();
    expect(enderecoEl.textContent).not.toContain("Fundos");
  });

  it("deve montar o endereço sem bairro quando ausente", () => {
    const dados = {
      dados_da_associacao: {
        unidade: {
          ...mockDadosCompletos.dados_da_associacao.unidade,
          bairro: undefined,
        },
      },
    };
    render(<InfosUnidadeEducacional dadosDaAssociacao={dados} />);

    const enderecoEl = screen.getByText((content) =>
      content.includes("das Flores,") &&
      content.includes("Fundos") &&
      content.includes("São Paulo - SP,") &&
      content.includes("01000-000")
    );
    expect(enderecoEl).toBeInTheDocument();
    expect(enderecoEl.textContent).not.toContain("Centro");
  });

  it("deve montar o endereço sem cep quando ausente", () => {
    const dados = {
      dados_da_associacao: {
        unidade: {
          ...mockDadosCompletos.dados_da_associacao.unidade,
          cep: undefined,
        },
      },
    };
    render(<InfosUnidadeEducacional dadosDaAssociacao={dados} />);

    const enderecoEl = screen.getByText((content) =>
      content.includes("das Flores,") &&
      content.includes("São Paulo - SP,") &&
      !content.includes("01000-000")
    );
    expect(enderecoEl).toBeInTheDocument();
  });

  it("deve montar o endereço sem número quando ausente", () => {
    const dados = {
      dados_da_associacao: {
        unidade: {
          ...mockDadosCompletos.dados_da_associacao.unidade,
          numero: undefined,
        },
      },
    };
    render(<InfosUnidadeEducacional dadosDaAssociacao={dados} />);

    const enderecoEl = screen.getByText((content) =>
      content.includes("das Flores,") &&
      content.includes("Fundos") &&
      content.includes("São Paulo - SP,") &&
      content.includes("01000-000")
    );
    expect(enderecoEl).toBeInTheDocument();
    expect(enderecoEl.textContent).not.toContain("100 -");
  });

  it("deve montar o endereço somente com tipo_logradouro e cidade/estado quando todos os outros campos ausentes", () => {
    const dados = {
      dados_da_associacao: {
        unidade: {
          tipo_logradouro: "Avenida",
          logradouro: undefined,
          numero: undefined,
          complemento: undefined,
          bairro: undefined,
          cep: undefined,
        },
      },
    };
    render(<InfosUnidadeEducacional dadosDaAssociacao={dados} />);

    const enderecoEl = screen.getByText((content) =>
      content.includes("Avenida") && content.includes("São Paulo - SP,")
    );
    expect(enderecoEl).toBeInTheDocument();
  });
});
