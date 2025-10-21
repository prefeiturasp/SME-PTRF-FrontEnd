import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { FormFiltroPorPalavra } from "../index";
import { filtroPorPalavraReceitas } from "../../../../services/escolas/Receitas.service";

jest.mock("../../../../services/escolas/Receitas.service");

describe("FormFiltroPorPalavra", () => {
    let mockProps;

    beforeEach(() => {
        mockProps = {
            inputPesquisa: "",
            setInputPesquisa: jest.fn(),
            setBuscaUtilizandoFiltro: jest.fn(),
            setLista: jest.fn(),
            setLoading: jest.fn(),
            origem: "Receitas",
            reusltadoSomaDosTotais: jest.fn(),
            buscaDespesasFiltrosPorPalavra: jest.fn(),
            setBuscaUtilizandoFiltroPalavra: jest.fn(),
            setBuscaUtilizandoFiltroAvancado: jest.fn(),
            forcarPrimeiraPagina: jest.fn()
        };
        
        filtroPorPalavraReceitas.mockResolvedValue([]);
    });

    it("renderiza o formulário com input e botão", () => {
        render(<FormFiltroPorPalavra {...mockProps} />);
        
        expect(screen.getByPlaceholderText("Escreva o termo que deseja filtrar")).toBeInTheDocument();
        expect(screen.getByText("Filtrar")).toBeInTheDocument();
    });

    it("atualiza o valor do input ao digitar", () => {
        render(<FormFiltroPorPalavra {...mockProps} />);
        
        const input = screen.getByPlaceholderText("Escreva o termo que deseja filtrar");
        fireEvent.change(input, { target: { value: "teste" } });
        
        expect(mockProps.setInputPesquisa).toHaveBeenCalledWith("teste");
    });

    it("chama funções corretas ao submeter para Receitas", async () => {
        const mockReceitas = [{ id: 1, nome: "Receita 1" }];
        filtroPorPalavraReceitas.mockResolvedValue(mockReceitas);
        
        mockProps.inputPesquisa = "receita teste";
        render(<FormFiltroPorPalavra {...mockProps} />);
        
        const form = screen.getByText("Filtrar").closest("form");
        fireEvent.submit(form);
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        expect(mockProps.setLoading).toHaveBeenCalledWith(true);
        expect(filtroPorPalavraReceitas).toHaveBeenCalledWith("receita teste");
        expect(mockProps.setBuscaUtilizandoFiltro).toHaveBeenCalledWith(true);
    });

    it("chama funções corretas ao submeter para Despesas", () => {
        mockProps.origem = "Despesas";
        mockProps.inputPesquisa = "despesa teste";
        render(<FormFiltroPorPalavra {...mockProps} />);
        
        const form = screen.getByText("Filtrar").closest("form");
        fireEvent.submit(form);
        
        expect(mockProps.setLoading).toHaveBeenCalledWith(true);
        expect(mockProps.buscaDespesasFiltrosPorPalavra).toHaveBeenCalled();
        expect(mockProps.setBuscaUtilizandoFiltroPalavra).toHaveBeenCalledWith(true);
        expect(mockProps.setBuscaUtilizandoFiltroAvancado).toHaveBeenCalledWith(false);
        expect(mockProps.setBuscaUtilizandoFiltro).toHaveBeenCalledWith(true);
    });

    it("chama reusltadoSomaDosTotais quando fornecido para Receitas", async () => {
        mockProps.inputPesquisa = "termo";
        render(<FormFiltroPorPalavra {...mockProps} />);
        
        const form = screen.getByText("Filtrar").closest("form");
        fireEvent.submit(form);
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        expect(mockProps.reusltadoSomaDosTotais).toHaveBeenCalledWith("termo");
    });

    it("não chama reusltadoSomaDosTotais quando não fornecido", async () => {
        mockProps.reusltadoSomaDosTotais = null;
        render(<FormFiltroPorPalavra {...mockProps} />);
        
        const form = screen.getByText("Filtrar").closest("form");
        fireEvent.submit(form);
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        expect(mockProps.setBuscaUtilizandoFiltro).toHaveBeenCalledWith(true);
    });

    it("renderiza input com valor controlado", () => {
        mockProps.inputPesquisa = "valor inicial";
        render(<FormFiltroPorPalavra {...mockProps} />);
        
        const input = screen.getByPlaceholderText("Escreva o termo que deseja filtrar");
        expect(input).toHaveValue("valor inicial");
    });
});

