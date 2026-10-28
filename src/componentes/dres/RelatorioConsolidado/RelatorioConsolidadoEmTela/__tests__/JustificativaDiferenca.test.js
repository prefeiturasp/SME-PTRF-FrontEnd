import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { JustificativaDiferenca } from "../JustificativaDiferenca";
import { visoesService } from "../../../../../services/visoes.service";

jest.mock("../../../../../services/visoes.service", () => ({
    visoesService: { getPermissoes: jest.fn() },
}));

const montar = (props = {}) => {
    const p = {
        execucaoFinanceira: { tipo_conta_uuid: "c1", valores: {} },
        haDiferencaPrevisaoExecucaoRepasse: jest.fn(() => true),
        justificativaDiferenca: { texto: "algo" },
        setJustificativaDiferenca: jest.fn(),
        onChangeJustificativaDiferenca: jest.fn(),
        onSubmitJustificativaDiferenca: jest.fn(),
        btnSalvarJustificativaDisable: false,
        setBtnSalvarJustificativaDisable: jest.fn(),
        jaPublicado: false,
        ...props,
    };
    return { p, ...render(<JustificativaDiferenca {...p} />) };
};

describe("JustificativaDiferenca", () => {
    beforeEach(() => {
        visoesService.getPermissoes.mockReturnValue(true);
    });

    it("não renderiza sem diferença", () => {
        const { container } = montar({ haDiferencaPrevisaoExecucaoRepasse: jest.fn(() => false) });
        expect(container).toBeEmptyDOMElement();
    });

    it("renderiza campos e habilita botões", () => {
        const { p } = montar();
        expect(p.haDiferencaPrevisaoExecucaoRepasse).toHaveBeenCalledWith({});
        expect(screen.getByPlaceholderText(/Escreva aqui/)).toBeEnabled();
        expect(screen.getByRole("button", { name: "Limpar" })).toBeEnabled();
        expect(screen.getByRole("button", { name: "Salvar" })).toBeEnabled();
        expect(screen.queryByText(/campo justificativa da diferença é obrigatório/)).not.toBeInTheDocument();
    });

    it("dispara onChange e submit", () => {
        const { p } = montar();
        fireEvent.change(screen.getByPlaceholderText(/Escreva aqui/), { target: { value: "novo" } });
        expect(p.onChangeJustificativaDiferenca).toHaveBeenCalledWith("novo", "c1");
        fireEvent.click(screen.getByRole("button", { name: "Salvar" }));
        expect(p.onSubmitJustificativaDiferenca).toHaveBeenCalled();
    });

    it("limpar usa updaters com estado anterior existente", () => {
        const { p } = montar();
        fireEvent.click(screen.getByRole("button", { name: "Limpar" }));
        const upd = p.setJustificativaDiferenca.mock.calls[0][0];
        expect(upd({ c1: { texto: "a", uuid: "u" } })).toEqual({ c1: { texto: "", uuid: "u" } });
        const btn = p.setBtnSalvarJustificativaDisable.mock.calls[0][0];
        expect(btn({ c2: true })).toEqual({ c2: true, c1: false });
    });

    it("limpar usa justificativa atual quando não há estado anterior", () => {
        const { p } = montar();
        fireEvent.click(screen.getByRole("button", { name: "Limpar" }));
        const upd = p.setJustificativaDiferenca.mock.calls[0][0];
        expect(upd({})).toEqual({ c1: { texto: "" } });
    });

    it("exibe erro e desabilita salvar com texto vazio", () => {
        montar({ justificativaDiferenca: { texto: "  " } });
        expect(screen.getByText(/campo justificativa da diferença é obrigatório/)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
    });

    it("trata texto indefinido", () => {
        montar({ justificativaDiferenca: {} });
        expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
    });

    it("desabilita tudo quando já publicado", () => {
        montar({ jaPublicado: true });
        expect(screen.getByPlaceholderText(/Escreva aqui/)).toBeDisabled();
        expect(screen.getByRole("button", { name: "Limpar" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
    });

    it("desabilita sem permissão", () => {
        visoesService.getPermissoes.mockReturnValue(false);
        montar();
        expect(screen.getByPlaceholderText(/Escreva aqui/)).toBeDisabled();
        expect(screen.getByRole("button", { name: "Limpar" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
    });

    it("desabilita salvar quando btnSalvarJustificativaDisable", () => {
        montar({ btnSalvarJustificativaDisable: true });
        expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "Limpar" })).toBeEnabled();
    });
});
