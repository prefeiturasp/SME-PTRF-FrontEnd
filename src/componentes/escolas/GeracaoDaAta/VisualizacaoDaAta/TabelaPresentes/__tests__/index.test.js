import React from "react";
import { render, screen } from "@testing-library/react";
import { TabelaPresentes } from "../index";

describe("TabelaPresentes", () => {
    it("renderiza a tabela com cabeçalhos", () => {
        render(<TabelaPresentes listaPresentes={[]} />);
        
        expect(screen.getByText("Nome e cargo")).toBeInTheDocument();
        expect(screen.getByText("Assinatura")).toBeInTheDocument();
    });

    it("renderiza o título quando fornecido", () => {
        render(<TabelaPresentes titulo="Membros presentes" listaPresentes={[]} />);
        expect(screen.getByText("Membros presentes")).toBeInTheDocument();
    });

    it("não renderiza título quando não fornecido", () => {
        const { container } = render(<TabelaPresentes listaPresentes={[]} />);
        expect(container.querySelector(".titulo-tabela-acoes")).not.toBeInTheDocument();
    });

    it("renderiza lista de presentes com dados", () => {
        const presentes = [
            { nome: "João Silva", cargo: "Presidente", presente: true },
            { nome: "Maria Santos", cargo: "Secretária", presente: true }
        ];
        
        render(<TabelaPresentes listaPresentes={presentes} />);
        
        expect(screen.getByText("João Silva")).toBeInTheDocument();
        expect(screen.getByText("Presidente")).toBeInTheDocument();
        expect(screen.getByText("Maria Santos")).toBeInTheDocument();
        expect(screen.getByText("Secretária")).toBeInTheDocument();
    });

    it("renderiza 'Ausente' quando membro não está presente", () => {
        const presentes = [
            { nome: "João Silva", cargo: "Presidente", presente: false, membro: true }
        ];
        
        render(<TabelaPresentes listaPresentes={presentes} />);
        
        expect(screen.getByText("Ausente")).toBeInTheDocument();
    });

    it("não renderiza 'Ausente' quando membro está presente", () => {
        const presentes = [
            { nome: "João Silva", cargo: "Presidente", presente: true, membro: true }
        ];
        
        render(<TabelaPresentes listaPresentes={presentes} />);
        
        expect(screen.queryByText("Ausente")).not.toBeInTheDocument();
    });

    it("renderiza linha vazia quando lista está vazia", () => {
        const { container } = render(<TabelaPresentes listaPresentes={[]} />);
        const tbody = container.querySelector("tbody");
        expect(tbody.querySelectorAll("tr").length).toBe(1);
    });

    it("renderiza linha vazia quando lista é null", () => {
        const { container } = render(<TabelaPresentes listaPresentes={null} />);
        const tbody = container.querySelector("tbody");
        expect(tbody.querySelectorAll("tr").length).toBe(1);
    });

    it("renderiza múltiplos presentes", () => {
        const presentes = [
            { nome: "Pessoa 1", cargo: "Cargo 1", presente: true },
            { nome: "Pessoa 2", cargo: "Cargo 2", presente: false, membro: true },
            { nome: "Pessoa 3", cargo: "Cargo 3", presente: true }
        ];
        
        render(<TabelaPresentes listaPresentes={presentes} />);
        
        expect(screen.getByText("Pessoa 1")).toBeInTheDocument();
        expect(screen.getByText("Pessoa 2")).toBeInTheDocument();
        expect(screen.getByText("Pessoa 3")).toBeInTheDocument();
        expect(screen.getByText("Ausente")).toBeInTheDocument();
    });

    it("renderiza cargo com '/ Professor Orientador' quando for professor do grêmio", () => {
        const presentes = [
            { nome: "João Silva", cargo: "Professor", professor_gremio: true, presente: true }
        ];
        
        render(<TabelaPresentes listaPresentes={presentes} />);
        
        expect(screen.getByText("João Silva")).toBeInTheDocument();
        expect(screen.getByText("Professor / Professor Orientador")).toBeInTheDocument();
    });

    it("não renderiza cargo quando professor do grêmio não tem cargo", () => {
        const presentes = [
            { nome: "João Silva", cargo: "", professor_gremio: true, presente: true }
        ];
        
        render(<TabelaPresentes listaPresentes={presentes} />);
        
        expect(screen.getByText("João Silva")).toBeInTheDocument();
        expect(screen.queryByText("Professor Orientador")).not.toBeInTheDocument();
    });
});

