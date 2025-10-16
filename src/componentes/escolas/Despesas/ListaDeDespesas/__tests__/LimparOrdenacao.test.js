import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { LimparArgumentosOrdenacao } from "../LimparOrdenacao";

describe("LimparArgumentosOrdenacao", () => {
    let mockLimparOrdenacao;

    beforeEach(() => {
        mockLimparOrdenacao = jest.fn();
    });

    it("não renderiza o botão quando camposOrdenacao está vazio", () => {
        const camposOrdenacao = {
            ordenar_por_numero_do_documento: "",
            ordenar_por_data_especificacao: "",
            ordenar_por_valor: ""
        };

        render(<LimparArgumentosOrdenacao limparOrdenacao={mockLimparOrdenacao} camposOrdenacao={camposOrdenacao} />);
        
        expect(screen.queryByText("Limpar ordenação")).not.toBeInTheDocument();
    });

    it("renderiza o botão quando há campos preenchidos", () => {
        const camposOrdenacao = {
            ordenar_por_numero_do_documento: "crescente",
            ordenar_por_data_especificacao: "",
            ordenar_por_valor: ""
        };

        render(<LimparArgumentosOrdenacao limparOrdenacao={mockLimparOrdenacao} camposOrdenacao={camposOrdenacao} />);
        
        expect(screen.getByText("Limpar ordenação")).toBeInTheDocument();
    });

    it("executa a função limparOrdenacao ao clicar no botão", () => {
        const camposOrdenacao = {
            ordenar_por_numero_do_documento: "crescente"
        };

        render(<LimparArgumentosOrdenacao limparOrdenacao={mockLimparOrdenacao} camposOrdenacao={camposOrdenacao} />);
        
        const botao = screen.getByText("Limpar ordenação");
        fireEvent.click(botao);
        
        expect(mockLimparOrdenacao).toHaveBeenCalled();
    });
});

