import { render, screen } from "@testing-library/react";

import { CargosTimelineModoListagem } from "../CargosTimelineModoListagem";

describe("CargosTimelineModoListagem", () => {
    beforeEach(() => {
        // Row/Col do antd registram um observer baseado em window.matchMedia no mount
        window.matchMedia = jest.fn().mockImplementation(() => ({
            matches: false,
            addListener: jest.fn(),
            removeListener: jest.fn(),
        }));
    });

    it("renderiza o título da seção e o nome do ocupante de cada cargo", () => {
        const cargos = [
            { cargo_associacao: "PRESIDENTE_DIRETORIA_EXECUTIVA", cargo_associacao_label: "Presidente", nomeOuVago: "Maria Silva" },
            { cargo_associacao: "TESOUREIRO", cargo_associacao_label: "Tesoureiro", nomeOuVago: "Vago" },
        ];

        render(<CargosTimelineModoListagem cargos={cargos} secao="Diretoria executiva" />);

        expect(screen.getByText("Diretoria executiva")).toBeInTheDocument();
        expect(screen.getByText("Presidente")).toBeInTheDocument();
        expect(screen.getByText("Maria Silva")).toBeInTheDocument();
        expect(screen.getByText("Tesoureiro")).toBeInTheDocument();
        expect(screen.getByText("Vago")).toBeInTheDocument();
    });

    it("exibe as informações do cargo e do ocupante corretamente", () => { 
        
        const cargos = [ 
            { 
                cargo_associacao: "PRESIDENTE_DIRETORIA_EXECUTIVA",
                cargo_associacao_label: "Presidente",
                ocupante_do_cargo: {
                    representacao: "SERVIDOR",
                    representacao_label: "Servidor",
                    codigo_identificacao: "123456",
                },
                nomeOuVago: "Maria Silva", 
            }, 
            { cargo_associacao: "TESOUREIRO", cargo_associacao_label: "Tesoureiro", nomeOuVago: "Vago" }
        ];

        render( <CargosTimelineModoListagem cargos={cargos} secao="Diretoria executiva" /> ); 
        
        //Cargo 
        expect(screen.getByText("Presidente")).toHaveClass("text-muted");
        expect(screen.getByText("Tesoureiro")).toHaveClass("text-muted");     
        // Representação 
        expect(screen.getByText("Servidor")).toBeInTheDocument()
        // Código de identificação 
        expect(screen.getByText("123456")).toBeInTheDocument()
        //Nome 
        expect(screen.getByText("Maria Silva")).toBeInTheDocument()
        expect(screen.getByText("Maria Silva")).toHaveClass("text-muted"); 
        // Cargo vago 
        expect(screen.getByText("Vago")).toBeInTheDocument()
    });

    it("renderiza apenas o título da seção quando não há cargos", () => {
        render(<CargosTimelineModoListagem cargos={[]} secao="Conselho Fiscal" />);

        expect(screen.getByText("Conselho Fiscal")).toBeInTheDocument();
        expect(document.querySelectorAll(".linha-composicao-data")).toHaveLength(1);
    });
});
