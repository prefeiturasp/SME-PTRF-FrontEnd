import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { TopoComBotoes } from "../TopoComBotoes";
import { AbasPorRecursoContext } from "../../../componentes/AbasPorRecurso/context/Recursos";

describe("TopoComBotoes", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const defaultContextValue = {
        selectedRecurso: {
            nome: "Programa de Transferência de Recursos Financeiros (PTRF) - Básico",
            nome_exibicao: "PTRF Básico",
        },
        setSelectedRecurso: jest.fn(),
        clickBtnEscolheOpcao: {},
        setClickBtnEscolheOpcao: jest.fn(),
    };

    const renderWithRecursosContext = () => {
        return render(
            <AbasPorRecursoContext.Provider value={defaultContextValue}>
                <TopoComBotoes />
            </AbasPorRecursoContext.Provider>
        );
    };

    it("deve renderizar corretamente o nome do recurso selecionado e legenda com nome de exibição do recurso", () => {
        renderWithRecursosContext();
        
        expect(screen.getByText(defaultContextValue.selectedRecurso.nome)).toBeInTheDocument();
        expect(screen.getByText("Confira abaixo os prazos de repasse e execução do PTRF Básico.")).toBeInTheDocument();
    });
});
