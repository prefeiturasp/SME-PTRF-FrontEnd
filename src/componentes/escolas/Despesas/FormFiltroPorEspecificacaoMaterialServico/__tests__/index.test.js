import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { FormFiltroPorEspecificacaoMaterialServico } from "../index";

describe("FormFiltroPorEspecificacaoMaterialServico", () => {
    let mockProps;

    beforeEach(() => {
        mockProps = {
            reusltadoSomaDosTotais: jest.fn(),
            filtrosAvancados: { filtrar_por_termo: "" },
            setFiltrosAvancados: jest.fn(),
            buscaDespesasOrdenacao: jest.fn(),
            setBuscaUtilizandoOrdenacao: jest.fn(),
            limparOrdenacao: jest.fn(),
            setLoading: jest.fn(),
        };
    });

    it("renderiza o formulário com input e botão", () => {
        render(<FormFiltroPorEspecificacaoMaterialServico {...mockProps} />);
        
        expect(screen.getByPlaceholderText("Escreva o termo que deseja filtrar")).toBeInTheDocument();
        expect(screen.getByText("Filtrar")).toBeInTheDocument();
    });

    it("atualiza o valor do input ao digitar", () => {
        render(<FormFiltroPorEspecificacaoMaterialServico {...mockProps} />);
        
        const input = screen.getByPlaceholderText("Escreva o termo que deseja filtrar");
        fireEvent.change(input, { target: { name: "filtrar_por_termo", value: "teste" } });
        
        expect(mockProps.setFiltrosAvancados).toHaveBeenCalledWith({
            filtrar_por_termo: "teste"
        });
    });

    it("executa as funções corretas ao submeter o formulário", () => {
        mockProps.filtrosAvancados.filtrar_por_termo = "material";
        render(<FormFiltroPorEspecificacaoMaterialServico {...mockProps} />);
        
        const form = screen.getByRole("button", { name: "Filtrar" }).closest("form");
        fireEvent.submit(form);
        
        expect(mockProps.setLoading).toHaveBeenCalledWith(true);
        expect(mockProps.reusltadoSomaDosTotais).toHaveBeenCalledWith("material");
        expect(mockProps.buscaDespesasOrdenacao).toHaveBeenCalled();
        expect(mockProps.setBuscaUtilizandoOrdenacao).toHaveBeenCalledWith(true);
        expect(mockProps.limparOrdenacao).toHaveBeenCalled();
    });
});
