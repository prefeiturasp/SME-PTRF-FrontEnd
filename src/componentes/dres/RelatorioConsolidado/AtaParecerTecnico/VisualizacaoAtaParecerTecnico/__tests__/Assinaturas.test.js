import React from "react";
import { render, screen } from "@testing-library/react";
import { Assinaturas } from "../Assinaturas";

describe("Assinaturas Component", () => {
  const mockPresentes = [
    { nome: "João da Silva", cargo: "Presidente", rf: "1234567" },
    { nome: "Maria Oliveira", cargo: "Secretária", rf: "7654321" }
  ];

  describe("Renderização da data de assinatura", () => {
    beforeEach(() => {
      // Congela o relógio do sistema usando a API moderna do Jest
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2024, 4, 5)); // 05 de maio de 2024
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("deve renderizar a data formatada corretamente quando data_assinatura for fornecida", () => {
      render(
        <Assinaturas
          data_assinatura="2023-10-15"
          presentes_na_ata={mockPresentes}
        />
      );

      expect(
        screen.getByText(/São Paulo,\s*15 de outubro de 2023\./i)
      ).toBeInTheDocument();
    });

    it("deve renderizar a data atual formatada quando data_assinatura não for fornecida", () => {
      render(<Assinaturas presentes_na_ata={mockPresentes} />);

      expect(
        screen.getByText(/São Paulo,\s*05 de maio de 2024\./i)
      ).toBeInTheDocument();
    });
  });

  describe("Renderização da lista de presentes", () => {
    it("deve renderizar a tabela com os cabeçalhos e as linhas dos presentes", () => {
      render(
        <Assinaturas
          data_assinatura="2023-10-15"
          presentes_na_ata={mockPresentes}
        />
      );

      expect(screen.getByText("Nome")).toBeInTheDocument();
      expect(screen.getByText("Cargo")).toBeInTheDocument();
      expect(screen.getByText("RF")).toBeInTheDocument();

      expect(screen.getByText("João da Silva")).toBeInTheDocument();
      expect(screen.getByText("Presidente")).toBeInTheDocument();
      expect(screen.getByText("1234567")).toBeInTheDocument();

      expect(screen.getByText("Maria Oliveira")).toBeInTheDocument();
      expect(screen.getByText("Secretária")).toBeInTheDocument();
      expect(screen.getByText("7654321")).toBeInTheDocument();
    });

    it("não deve renderizar a tabela quando presentes_na_ata for um array vazio", () => {
      render(
        <Assinaturas data_assinatura="2023-10-15" presentes_na_ata={[]} />
      );

      expect(screen.queryByRole("table")).not.toBeInTheDocument();
    });

    it("não deve renderizar a tabela quando presentes_na_ata for null ou undefined", () => {
      render(<Assinaturas data_assinatura="2023-10-15" />);

      expect(screen.queryByRole("table")).not.toBeInTheDocument();
    });
  });

  it("deve renderizar os textos padrão de encerramento da ata", () => {
    render(<Assinaturas presentes_na_ata={mockPresentes} />);

    expect(
      screen.getByText(
        /nada mais a ser tratado, os trabalhos foram encerrados/i
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Presentes")).toBeInTheDocument();
  });
});