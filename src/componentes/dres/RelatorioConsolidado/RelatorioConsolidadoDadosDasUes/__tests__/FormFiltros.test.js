import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { FormFiltros } from "../FormFiltros";

const mockTipoDeUnidades = [
    { id: "EMEF", nome: "EMEF" },
    { id: "CEI", nome: "CEI" },
];

const mockStatusPc = [
    { id: "APROVADA", nome: "Aprovada" },
    { id: "REPROVADA", nome: "Reprovada" },
];

const filtrosVazios = {
    filtrar_por_ue: "",
    filtrar_por_tipo_unidade: "",
    filtrar_por_status_pc: "",
};

const renderFormFiltros = (props = {}) => {
    const propsPadrao = {
        stateFiltros: filtrosVazios,
        handleChangeFiltros: jest.fn(),
        limpaFiltros: jest.fn(),
        handleSubmitFiltros: jest.fn((e) => e.preventDefault()),
        tiposDeUnidade: mockTipoDeUnidades,
        statusPc: mockStatusPc,
        ...props,
    }

    const resultado = render(<FormFiltros {...propsPadrao} />);
    return { ...resultado, props: propsPadrao };
};

const campoUe = () => screen.getByLabelText("Filtrar por unidade educacional");
const campoTipoUnidade = () => screen.getByLabelText("Filtrar por tipo de unidade");
const campoStatusPc = () => screen.getByLabelText("Filtrar por situação da prestação de contas");

const obtemTextosDasOpcoes = (select) =>
    within(select).getAllByRole("option").map((opcao) => opcao.textContent);


describe("Exibição do formulário", () => {
    it("deve renderizar o título, os três filtros e os botões", () => {
        renderFormFiltros();

        expect(
            screen.getByText("Dados Físico-Financeiros da Execução")
        ).toBeInTheDocument()

        expect(campoUe()).toBeInTheDocument();
        expect(campoTipoUnidade()).toBeInTheDocument();
        expect(campoStatusPc()).toBeInTheDocument();

        expect(screen.getByRole("button", { name: "Limpar" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Filtrar" })).toBeInTheDocument();
    });

    it("deve associar cada label ao seu campo", () => {
        renderFormFiltros();

        expect(campoUe()).toHaveAttribute("name", "filtrar_por_ue");
        expect(campoUe()).toHaveAttribute("name", "filtrar_por_ue");
        expect(campoUe()).toHaveAttribute("placeholder", "Escreva o nome da unidade");
        expect(campoTipoUnidade()).toHaveAttribute("name", "filtrar_por_tipo_unidade");
        expect(campoStatusPc()).toHaveAttribute("name", "filtrar_por_status_pc");
    });
});

describe("Preenchimento dos campos", () => {
    it("deve exibir os campos vazios quando nenhum filtro estiver aplicado", () => {
        renderFormFiltros();

        expect(campoUe()).toHaveValue("");
        expect(campoTipoUnidade()).toHaveValue("");
        expect(campoStatusPc()).toHaveValue("");
    });

    it("deve exibir os valores dos filtros já aplicados", () => {
        renderFormFiltros({
            stateFiltros: {
                filtrar_por_ue: "Duque de Caxias",
                filtrar_por_tipo_unidade: "CEI",
                filtrar_por_status_pc: "REPROVADA",
            },
        });

        expect(campoUe()).toHaveValue("Duque de Caxias");
        expect(campoTipoUnidade()).toHaveValue("CEI");
        expect(campoStatusPc()).toHaveValue("REPROVADA");
    });
});

describe("Opções dos filtros", ()=>{
    it("deve listar os tipos de unidade e os status após a opção padrão", () => {
        renderFormFiltros();

        expect(obtemTextosDasOpcoes(campoTipoUnidade())).toEqual([
            "Selecione um tipo de unidade",
            "EMEF",
            "CEI",
        ]);

        expect(obtemTextosDasOpcoes(campoStatusPc())).toEqual([
            "Selecione o status",
            "Aprovada",
            "Reprovada",
        ]);
    })

    it.each([
        ["uma lista vazia", []],
        ["null", null],
        ["undefined", undefined]
    ])("deve exibir apenas a opção padrão quando as listas forem %s", (_, lista) => {

        renderFormFiltros({ tiposDeUnidade: lista, statusPc: lista });

        expect(obtemTextosDasOpcoes(campoTipoUnidade())).toEqual([
            "Selecione um tipo de unidade",
        ]);

        expect(obtemTextosDasOpcoes(campoStatusPc())).toEqual([
            "Selecione o status",
        ]);
    });
})

describe("Edição dos filtros", () => {
    it("deve chamar handleChangeFiltros com o nome e o valor digitado na unidade", () => {
        const { props } = renderFormFiltros();

        fireEvent.change(campoUe(), { target: { value: "Paulo Freire" } });

        expect(props.handleChangeFiltros).toHaveBeenCalledWith(
            "filtrar_por_ue",
            "Paulo Freire"
        );
    });

    it("deve chamar handleChangeFiltros ao selecionar um tipo de unidade", () => {
        const { props } = renderFormFiltros();

        fireEvent.change(campoTipoUnidade(), { target: { value: "EMEF" } });

        expect(props.handleChangeFiltros).toHaveBeenCalledWith(
            "filtrar_por_tipo_unidade",
            "EMEF"
        );
    });

    it("deve chamar handleChangeFiltros ao selecionar um status", () => {
        const { props } = renderFormFiltros();

        fireEvent.change(campoStatusPc(), { target: { value: "APROVADA" } });

        expect(props.handleChangeFiltros).toHaveBeenCalledWith(
            "filtrar_por_status_pc",
            "APROVADA"
        );
    });

    it("deve permitir voltar o select para a opção padrão", () => {
        const { props } = renderFormFiltros({
            stateFiltros: { ...filtrosVazios, filtrar_por_status_pc: "APROVADA" },
        });

        fireEvent.change(campoStatusPc(), { target: { value: "" } });

        expect(props.handleChangeFiltros).toHaveBeenCalledWith("filtrar_por_status_pc", "");
    });
});

describe("Ações do formulário", () => {
    it("deve chamar handleSubmitFiltros ao clicar em Filtrar", () => {
        const { props } = renderFormFiltros();

        fireEvent.click(screen.getByRole("button", { name: "Filtrar" }));

        expect(props.handleSubmitFiltros).toHaveBeenCalledTimes(1);
        expect(props.limpaFiltros).not.toHaveBeenCalled();
    });

    it("deve chamar limpaFiltros ao clicar em Limpar sem enviar o formulário", () => {
        const { props } = renderFormFiltros({
            stateFiltros: {
                filtrar_por_ue: "Duque de Caxias",
                filtrar_por_tipo_unidade: "CEI",
                filtrar_por_status_pc: "REPROVADA",
            },
        });

        fireEvent.click(screen.getByRole("button", { name: "Limpar" }));

        expect(props.limpaFiltros).toHaveBeenCalledTimes(1);
        expect(props.handleSubmitFiltros).not.toHaveBeenCalled();
    });
});
