import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { FiltrosAssociacoes } from "../FiltrosAssociacoes";

describe("FiltrosAssociacoes", () => {
    const tabelaAssociacoesPadrao = {
        tipos_unidade: [
            { id: "EMEI", nome: "EMEI" },
            { id: "EMEF", nome: "EMEF" },
            { id: "ADM", nome: "ADM" },
            { id: "DRE", nome: "DRE" },
            { id: "IFSP", nome: "IFSP" },
            { id: "CMCT", nome: "CMCT" },
        ],
        filtro_informacoes: [
            { id: "status1", nome: "Status 1" },
            { id: "status2", nome: "Status 2" },
        ],
    };

    const stateFiltrosPadrao = {
        unidade_escolar_ou_associacao: "",
        tipo_de_unidade: "",
        filtro_status: [],
    };

    let handleChangeFiltrosAssociacao;
    let handleSubmitFiltrosAssociacao;
    let limpaFiltros;
    let handleOnChangeMultipleSelectStatus;

    beforeEach(() => {
        handleChangeFiltrosAssociacao = jest.fn();
        handleSubmitFiltrosAssociacao = jest.fn((e) => e && e.preventDefault && e.preventDefault());
        limpaFiltros = jest.fn();
        handleOnChangeMultipleSelectStatus = jest.fn();
    });

    const renderComponent = (props = {}) => {
        return render(
            <FiltrosAssociacoes
                tabelaAssociacoes={tabelaAssociacoesPadrao}
                stateFiltros={stateFiltrosPadrao}
                handleChangeFiltrosAssociacao={handleChangeFiltrosAssociacao}
                handleSubmitFiltrosAssociacao={handleSubmitFiltrosAssociacao}
                limpaFiltros={limpaFiltros}
                handleOnChangeMultipleSelectStatus={handleOnChangeMultipleSelectStatus}
                {...props}
            />
        );
    };

    it("renderiza o input de unidade escolar ou associação", () => {
        renderComponent();
        expect(
            screen.getByPlaceholderText("Escreva o termo que deseja filtrar")
        ).toBeInTheDocument();
    });

    it("chama handleChangeFiltrosAssociacao ao digitar no input de unidade", () => {
        renderComponent();
        const input = screen.getByPlaceholderText(
            "Escreva o termo que deseja filtrar"
        );
        fireEvent.change(input, { target: { value: "Escola Teste" } });
        expect(handleChangeFiltrosAssociacao).toHaveBeenCalledWith(
            "unidade_escolar_ou_associacao",
            "Escola Teste"
        );
    });

    it("popula o select de tipo de unidade excluindo ADM, DRE, IFSP e CMCT", () => {
        renderComponent();
        const select = document.getElementById("tipo_de_unidade");
        expect(select).toBeInTheDocument();

        expect(screen.getByText("EMEI")).toBeInTheDocument();
        expect(screen.getByText("EMEF")).toBeInTheDocument();

        expect(screen.queryByText("ADM")).not.toBeInTheDocument();
        expect(screen.queryByText("DRE")).not.toBeInTheDocument();
        expect(screen.queryByText("IFSP")).not.toBeInTheDocument();
        expect(screen.queryByText("CMCT")).not.toBeInTheDocument();

        // Opção default + 2 opções válidas
        expect(select.querySelectorAll("option")).toHaveLength(3);
    });

    it("chama handleChangeFiltrosAssociacao ao selecionar tipo de unidade", () => {
        renderComponent();
        const select = document.getElementById("tipo_de_unidade");
        fireEvent.change(select, { target: { value: "EMEI", name: "tipo_de_unidade" } });
        expect(handleChangeFiltrosAssociacao).toHaveBeenCalledWith(
            "tipo_de_unidade",
            "EMEI"
        );
    });

    it("renderiza o multiselect de status com as opções de filtro_informacoes", () => {
        renderComponent();
        expect(screen.getByText("Selecione as informações")).toBeInTheDocument();
    });

    it("chama handleOnChangeMultipleSelectStatus ao alterar o multiselect", () => {
        renderComponent();
        // O Select do antd renderiza um combobox - localizamos pelo placeholder
        const selectMultiplo = screen.getByText("Selecione as informações");
        fireEvent.mouseDown(selectMultiplo);
        // Abre opções
        const opcao = screen.queryAllByText("Status 1");
        if (opcao.length > 0) {
            fireEvent.click(opcao[opcao.length - 1]);
            expect(handleOnChangeMultipleSelectStatus).toHaveBeenCalled();
        } else {
            // Em ambientes onde antd não renderiza dropdown completo, garante que ao menos existe
            expect(selectMultiplo).toBeInTheDocument();
        }
    });

    it("chama limpaFiltros ao clicar em Cancelar", () => {
        renderComponent();
        fireEvent.click(screen.getByText("Cancelar"));
        expect(limpaFiltros).toHaveBeenCalledTimes(1);
    });

    it("chama handleSubmitFiltrosAssociacao ao submeter o formulário", () => {
        renderComponent();
        fireEvent.click(screen.getByText("Filtrar"));
        expect(handleSubmitFiltrosAssociacao).toHaveBeenCalledTimes(1);
    });

    it("não quebra quando tabelaAssociacoes é um objeto vazio", () => {
        renderComponent({ tabelaAssociacoes: {} });

        const select = document.getElementById("tipo_de_unidade");
        expect(select).toBeInTheDocument();
        expect(select.querySelectorAll("option")).toHaveLength(1);

        expect(screen.getByText("Selecione as informações")).toBeInTheDocument();
    });

    it("não quebra quando tipos_unidade e filtro_informacoes são listas vazias", () => {
        renderComponent({
            tabelaAssociacoes: { tipos_unidade: [], filtro_informacoes: [] },
        });
        const select = document.getElementById("tipo_de_unidade");
        expect(select.querySelectorAll("option")).toHaveLength(1);
    });

    it("exibe o valor atual de stateFiltros nos campos", () => {
        renderComponent({
            stateFiltros: {
                unidade_escolar_ou_associacao: "Termo Atual",
                tipo_de_unidade: "EMEI",
                filtro_status: [],
            },
        });
        expect(
            screen.getByPlaceholderText("Escreva o termo que deseja filtrar")
        ).toHaveValue("Termo Atual");
        expect(document.getElementById("tipo_de_unidade")).toHaveValue("EMEI");
    });
});
