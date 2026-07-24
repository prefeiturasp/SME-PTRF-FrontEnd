import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Filtro } from "../components/Filtro";
import { useMotivosEstornoContext } from "../hooks/useMotivosEstornoContext";

jest.mock("../hooks/useMotivosEstornoContext", () => ({
    useMotivosEstornoContext: jest.fn(),
}));

jest.mock(
    "../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext",
    () => ({
        useAbasPorRecursoContext: () => ({
            selectedRecurso: {
                uuid: "recurso-selecionado",
                nome: "PTRF",
            },
        }),
    }),
);

describe("Filtro", () => {
    const setFilter = jest.fn();
    const initialFilter = {
        motivo: "",
        recurso_uuid: "",
        is_required_recurso_uuid: true,
        page: 1,
        page_size: 10,
    };

    beforeEach(() => {
        jest.clearAllMocks();

        useMotivosEstornoContext.mockReturnValue({
            setFilter,
            initialFilter,
        });
    });

    it("deve renderizar campo e botoes do filtro", () => {
        render(<Filtro />);

        expect(screen.getByLabelText("Filtrar por nome")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Busque por motivo")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Limpar" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Filtrar" })).toBeInTheDocument();
    });

    it("deve atualizar o valor do campo de motivo", () => {
        render(<Filtro />);

        const inputMotivo = screen.getByLabelText("Filtrar por nome");

        fireEvent.change(inputMotivo, {
            target: { name: "motivo", value: "Estorno indevido" },
        });

        expect(inputMotivo).toHaveValue("Estorno indevido");
    });

    it("deve chamar setFilter com o motivo informado ao filtrar preservando o recurso atual", () => {
        render(<Filtro />);

        fireEvent.change(screen.getByLabelText("Filtrar por nome"), {
            target: { name: "motivo", value: "Estorno indevido" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Filtrar" }));

        expect(setFilter).toHaveBeenCalledTimes(1);

        const updater = setFilter.mock.calls[0][0];
        expect(updater({ recurso_uuid: "recurso-atual" })).toEqual({
            ...initialFilter,
            motivo: "Estorno indevido",
            recurso_uuid: "recurso-atual",
        });
    });

    it("deve limpar o campo e resetar o filtro preservando o recurso atual", () => {
        render(<Filtro />);

        const inputMotivo = screen.getByLabelText("Filtrar por nome");

        fireEvent.change(inputMotivo, {
            target: { name: "motivo", value: "Estorno indevido" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Limpar" }));

        expect(inputMotivo).toHaveValue("");
        expect(setFilter).toHaveBeenCalledTimes(1);

        const updater = setFilter.mock.calls[0][0];
        expect(updater({ recurso_uuid: "recurso-atual" })).toEqual({
            ...initialFilter,
            recurso_uuid: "recurso-atual",
        });
    });
});
