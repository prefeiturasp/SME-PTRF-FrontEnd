import React from "react";
import { render, screen } from "@testing-library/react";
import { SomaDasDespesas } from "../index";

describe("SomaDasDespesas", () => {
    it("renderiza o título e cabeçalhos da tabela", () => {
        const somaDosTotais = {
            total_despesas_sem_filtro: 0,
            total_despesas_com_filtro: 0
        };
        
        render(<SomaDasDespesas somaDosTotais={somaDosTotais} />);
        
        expect(screen.getByText("Soma das Despesas")).toBeInTheDocument();
        expect(screen.getByText("Sem filtros aplicados")).toBeInTheDocument();
        expect(screen.getByText("Filtros aplicados")).toBeInTheDocument();
    });

    it("exibe valores formatados como moeda brasileira", () => {
        const somaDosTotais = {
            total_despesas_sem_filtro: 1500.50,
            total_despesas_com_filtro: 750.25
        };
        
        render(<SomaDasDespesas somaDosTotais={somaDosTotais} />);
        
        expect(screen.getByText("R$ 1.500,50")).toBeInTheDocument();
        expect(screen.getByText("R$ 750,25")).toBeInTheDocument();
    });

    it("renderiza corretamente quando valores são zero", () => {
        const somaDosTotais = {
            total_despesas_sem_filtro: 0,
            total_despesas_com_filtro: 0
        };
        
        const { container } = render(<SomaDasDespesas somaDosTotais={somaDosTotais} />);
        
        const celulas = container.querySelectorAll("td");
        expect(celulas[0].textContent).toBe("0");
        expect(celulas[1].textContent).toBe("0");
    });

    it("não exibe valor quando propriedade é undefined", () => {
        const somaDosTotais = {};
        
        const { container } = render(<SomaDasDespesas somaDosTotais={somaDosTotais} />);
        
        const celulas = container.querySelectorAll("td");
        expect(celulas[0].textContent).toBe("");
        expect(celulas[1].textContent).toBe("");
    });
});
