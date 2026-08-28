import React from "react";
import { render, screen } from "@testing-library/react";
import { TabelaAprovadas } from "../TabelaAprovadas";
import { useRecursoSelecionadoContext } from "../../../../../../context/RecursoSelecionado";

// Mock do Contexto
jest.mock("../../../../../../context/RecursoSelecionado", () => ({
  useRecursoSelecionadoContext: jest.fn()
}));

describe("TabelaAprovadas Component", () => {
  const mockRecursoPadrao = {
    habilita_aprovacao_com_ressalvas: true,
    textos_ata: {
      letra_a: "<span>Contas Aprovadas</span>",
      letra_b: "<span>Contas Aprovadas com Ressalva</span>",
      letra_c: "<span>Contas Reprovadas</span>",
      letra_d: "<span>Considerações Finais</span>"
    }
  };

  const mockUnidade1 = {
    codigo_eol: "123456",
    tipo_unidade: "EMEF",
    nome: "DUQUE DE CAXIAS"
  };

  const mockUnidade2 = {
    codigo_eol: "654321",
    tipo_unidade: "CEI",
    nome: "PAULO FREIRE"
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useRecursoSelecionadoContext.mockReturnValue({
      recursoSelecionado: mockRecursoPadrao
    });
  });

  // --- CENÁRIOS DE CONTAS APROVADAS ---
  describe("Status: aprovadas", () => {
    it("deve renderizar o título e os itens da tabela divididos corretamente em colunas", () => {
      const mockInfoContas = {
        contas: [
          {
            info: [
              { unidade: mockUnidade1 },
              { unidade: mockUnidade2 }
            ]
          }
        ]
      };

      render(<TabelaAprovadas infoContas={mockInfoContas} status="aprovadas" />);

      expect(screen.getByText("Contas Aprovadas")).toBeInTheDocument();
      expect(screen.getByText("123456 - EMEF DUQUE DE CAXIAS")).toBeInTheDocument();
      expect(screen.getByText("654321 - CEI PAULO FREIRE")).toBeInTheDocument();
    });

    it("deve exibir a mensagem de lista vazia quando não houver contas aprovadas", () => {
      render(<TabelaAprovadas infoContas={{ contas: [] }} status="aprovadas" />);

      expect(screen.getByText("Nenhuma prestação de contas aprovada.")).toBeInTheDocument();
    });
  });

  // --- CENÁRIOS DE CONTAS APROVADAS COM RESSALVA ---
  describe("Status: aprovadas_ressalva", () => {
    const mockInfoContasRessalva = {
      contas: [
        {
          info: [
            {
              unidade: mockUnidade1,
              motivos_aprovada_ressalva: ["Atraso no envio", "Documento rasurado"],
              recomendacoes: "Regularizar prazos"
            }
          ]
        }
      ]
    };

    it("deve renderizar a tabela com motivos e recomendações quando a flag estiver habilitada", () => {
      render(
        <TabelaAprovadas infoContas={mockInfoContasRessalva} status="aprovadas_ressalva" />
      );

      expect(screen.getByText("Contas Aprovadas com Ressalva")).toBeInTheDocument();
      expect(screen.getByText("123456 - EMEF DUQUE DE CAXIAS")).toBeInTheDocument();
      expect(screen.getByText("Atraso no envio")).toBeInTheDocument();
      expect(screen.getByText("Documento rasurado")).toBeInTheDocument();
      expect(screen.getByText("Regularizar prazos")).toBeInTheDocument();
    });

    it("deve exibir mensagem de lista vazia quando não houver contas aprovadas com ressalva", () => {
      render(
        <TabelaAprovadas infoContas={{ contas: [] }} status="aprovadas_ressalva" />
      );

      expect(
        screen.getByText("Nenhuma prestação de contas aprovada com ressalva.")
      ).toBeInTheDocument();
    });

    it("não deve renderizar a seção se habilita_aprovacao_com_ressalvas for false", () => {
      useRecursoSelecionadoContext.mockReturnValue({
        recursoSelecionado: {
          ...mockRecursoPadrao,
          habilita_aprovacao_com_ressalvas: false
        }
      });

      render(
        <TabelaAprovadas infoContas={mockInfoContasRessalva} status="aprovadas_ressalva" />
      );

      expect(screen.queryByText("Contas Aprovadas com Ressalva")).not.toBeInTheDocument();
      expect(screen.queryByText("123456 - EMEF DUQUE DE CAXIAS")).not.toBeInTheDocument();
    });
  });

  // --- CENÁRIOS DE CONTAS REPROVADAS ---
  describe("Status: reprovadas", () => {
    const mockInfoContasReprovadas = {
      contas: [
        {
          info: [
            {
              unidade: mockUnidade1,
              motivos_reprovacao: ["Falta de notas fiscais"]
            }
          ]
        }
      ]
    };

    it("deve renderizar a tabela de contas reprovadas com seus motivos", () => {
      render(
        <TabelaAprovadas infoContas={mockInfoContasReprovadas} status="reprovadas" />
      );

      expect(screen.getByText("Contas Reprovadas")).toBeInTheDocument();
      expect(screen.getByText("123456 - EMEF DUQUE DE CAXIAS")).toBeInTheDocument();
      expect(screen.getByText("Falta de notas fiscais")).toBeInTheDocument();
    });

    it("deve exibir mensagem de lista vazia quando não houver contas reprovadas", () => {
      render(<TabelaAprovadas infoContas={{ contas: [] }} status="reprovadas" />);

      expect(screen.getByText("Nenhuma prestação de contas rejeitada.")).toBeInTheDocument();
    });
  });

  // --- CENÁRIO DO ÚLTIMO ITEM ---
  describe("Exibição do Último Item (letra_d)", () => {
    it("deve exibir o texto do último item quando exibirUltimoItem for true", () => {
      render(
        <TabelaAprovadas
          infoContas={{ contas: [] }}
          status="aprovadas"
          exibirUltimoItem={true}
        />
      );

      expect(screen.getByText("Considerações Finais")).toBeInTheDocument();
    });

    it("não deve exibir o texto do último item quando exibirUltimoItem for false", () => {
      render(
        <TabelaAprovadas
          infoContas={{ contas: [] }}
          status="aprovadas"
          exibirUltimoItem={false}
        />
      );

      expect(screen.queryByText("Considerações Finais")).not.toBeInTheDocument();
    });
  });
});