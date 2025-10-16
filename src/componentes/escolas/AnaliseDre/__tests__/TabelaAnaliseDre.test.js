import React from "react";
import { render } from "@testing-library/react";
import TabelaAnaliseDre from "../TabelaAnaliseDre";

describe("TabelaAnaliseDre", () => {
    const mockAcoesTemplate = jest.fn((rowData) => <div>{rowData.ver_acertos}</div>);
    const mockPeriodoTemplate = jest.fn((rowData) => <div>{rowData.referencia}</div>);
    const mockResultadoTemplate = jest.fn((rowData) => <div>{rowData.texto_status}</div>);

    it("renderiza tabela vazia", () => {
        const { container } = render(
            <TabelaAnaliseDre
                rowsPerPage={10}
                listaDeAnalises={[]}
                acoesTemplate={mockAcoesTemplate}
                periodoTemplate={mockPeriodoTemplate}
                resultadoAnaliseTemplate={mockResultadoTemplate}
            />
        );
        
        expect(container.querySelector(".p-datatable")).toBeInTheDocument();
    });

    it("renderiza lista com dados", () => {
        const analises = [
            { referencia: "2024-01", texto_status: "Aprovado", ver_acertos: "Ver" }
        ];
        
        render(
            <TabelaAnaliseDre
                rowsPerPage={10}
                listaDeAnalises={analises}
                acoesTemplate={mockAcoesTemplate}
                periodoTemplate={mockPeriodoTemplate}
                resultadoAnaliseTemplate={mockResultadoTemplate}
            />
        );
        
        expect(mockPeriodoTemplate).toHaveBeenCalled();
        expect(mockResultadoTemplate).toHaveBeenCalled();
        expect(mockAcoesTemplate).toHaveBeenCalled();
    });

    it("exibe paginador quando há mais itens que rowsPerPage", () => {
        const analises = Array.from({ length: 15 }, (_, i) => ({
            referencia: `2024-${i}`,
            texto_status: "Status",
            ver_acertos: "Ver"
        }));
        
        const { container } = render(
            <TabelaAnaliseDre
                rowsPerPage={10}
                listaDeAnalises={analises}
                acoesTemplate={mockAcoesTemplate}
                periodoTemplate={mockPeriodoTemplate}
                resultadoAnaliseTemplate={mockResultadoTemplate}
            />
        );
        
        expect(container.querySelector(".p-paginator")).toBeInTheDocument();
    });

    it("não exibe paginador quando há menos itens que rowsPerPage", () => {
        const analises = [
            { referencia: "2024-01", texto_status: "Aprovado", ver_acertos: "Ver" }
        ];
        
        const { container } = render(
            <TabelaAnaliseDre
                rowsPerPage={10}
                listaDeAnalises={analises}
                acoesTemplate={mockAcoesTemplate}
                periodoTemplate={mockPeriodoTemplate}
                resultadoAnaliseTemplate={mockResultadoTemplate}
            />
        );
        
        expect(container.querySelector(".p-paginator")).not.toBeInTheDocument();
    });

    it("renderiza com diferentes rowsPerPage", () => {
        const analises = Array.from({ length: 20 }, (_, i) => ({
            referencia: `2024-${i}`,
            texto_status: "Status",
            ver_acertos: "Ver"
        }));
        
        const { container } = render(
            <TabelaAnaliseDre
                rowsPerPage={5}
                listaDeAnalises={analises}
                acoesTemplate={mockAcoesTemplate}
                periodoTemplate={mockPeriodoTemplate}
                resultadoAnaliseTemplate={mockResultadoTemplate}
            />
        );
        
        expect(container.querySelector(".p-datatable")).toBeInTheDocument();
    });
});

