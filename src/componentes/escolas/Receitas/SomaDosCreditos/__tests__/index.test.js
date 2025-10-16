import React from "react";
import { render, screen } from "@testing-library/react";
import { SomaDosCreditos } from "../index";

describe("SomaDosCreditos", () => {
    it("renderiza o título", () => {
        render(<SomaDosCreditos somaDosTotais={{}} />);
        expect(screen.getByText("Soma dos Créditos")).toBeInTheDocument();
    });

    it("renderiza cabeçalhos da tabela", () => {
        render(<SomaDosCreditos somaDosTotais={{}} />);
        expect(screen.getByText("Sem filtros aplicados")).toBeInTheDocument();
        expect(screen.getByText("Filtros aplicados")).toBeInTheDocument();
    });

    it("renderiza valores formatados", () => {
        const somaDosTotais = {
            total_receitas_sem_filtro: 1000,
            total_receitas_com_filtro: 500
        };
        
        const { container } = render(<SomaDosCreditos somaDosTotais={somaDosTotais} />);
        const cells = container.querySelectorAll("td");
        
        expect(cells[0].textContent).toContain("1.000");
        expect(cells[1].textContent).toContain("500");
    });

    it("não quebra sem valores", () => {
        const { container } = render(<SomaDosCreditos somaDosTotais={{}} />);
        expect(container.querySelector("table")).toBeInTheDocument();
    });

    it("renderiza valores decimais corretamente", () => {
        const somaDosTotais = {
            total_receitas_sem_filtro: 1234.56,
            total_receitas_com_filtro: 987.65
        };
        
        const { container } = render(<SomaDosCreditos somaDosTotais={somaDosTotais} />);
        const cells = container.querySelectorAll("td");
        
        expect(cells[0].textContent).toContain("1.234,56");
        expect(cells[1].textContent).toContain("987,65");
    });

    it("renderiza valor zero", () => {
        const somaDosTotais = {
            total_receitas_sem_filtro: 0,
            total_receitas_com_filtro: 0
        };
        
        const { container } = render(<SomaDosCreditos somaDosTotais={somaDosTotais} />);
        const cells = container.querySelectorAll("td");
        
        expect(cells[0].textContent).toContain("0");
        expect(cells[1].textContent).toContain("0");
    });

    it("renderiza apenas um valor quando o outro não está presente", () => {
        const somaDosTotais = {
            total_receitas_sem_filtro: 1500
        };
        
        const { container } = render(<SomaDosCreditos somaDosTotais={somaDosTotais} />);
        const cells = container.querySelectorAll("td");
        
        expect(cells[0].textContent).toContain("1.500");
    });
});

