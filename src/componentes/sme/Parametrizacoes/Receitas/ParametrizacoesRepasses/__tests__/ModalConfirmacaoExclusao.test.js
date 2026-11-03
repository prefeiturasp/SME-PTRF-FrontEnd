import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import { ModalConfirmacaoExclusao } from "../components/ModalConfirmacaoExclusao";
import { RepassesContext } from "../context/Repasse";

const renderComponent = ({
    open = true,
    uuid = "repasse-1",
    onExcluir = jest.fn(),
    setShowModalConfirmacaoExclusao = jest.fn(),
} = {}) => {
    return {
        onExcluir,
        setShowModalConfirmacaoExclusao,
        ...render(
            <RepassesContext.Provider
                value={{
                    showModalConfirmacaoExclusao: open,
                    setShowModalConfirmacaoExclusao,
                    stateFormModal: { uuid },
                }}
            >
                <ModalConfirmacaoExclusao handleExcluirRepasse={onExcluir} />
            </RepassesContext.Provider>
        ),
    };
};

describe("ModalConfirmacaoExclusao", () => {
    beforeEach(() => {
        window.matchMedia = jest.fn().mockImplementation(() => ({
            matches: false,
            addListener: jest.fn(),
            removeListener: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
        }));
    });

    it("deve pedir confirmação antes de excluir o repasse", () => {
        renderComponent();

        const dialog = screen.getByRole("dialog");

        expect(
            within(dialog).getByText("Excluir repasse")
        ).toBeInTheDocument();
        expect(
            within(dialog).getByText("Deseja realmente excluir esse repasse?")
        ).toBeInTheDocument();
        expect(
            within(dialog).getByRole("button", { name: "Excluir" })
        ).toBeInTheDocument();
        expect(
            within(dialog).getByRole("button", { name: "Cancelar" })
        ).toBeInTheDocument();
    });

    it("não deve exibir a confirmação enquanto ela estiver fechada", () => {
        renderComponent({ open: false });

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        expect(
            screen.queryByText("Deseja realmente excluir esse repasse?")
        ).not.toBeInTheDocument();
    });

    it("deve excluir o repasse selecionado ao confirmar", async () => {
        const user = userEvent.setup();
        const onExcluir = jest.fn();
        const setShowModalConfirmacaoExclusao = jest.fn();

        renderComponent({
            uuid: "repasse-42",
            onExcluir,
            setShowModalConfirmacaoExclusao,
        });

        await user.click(
            within(screen.getByRole("dialog")).getByRole("button", {
                name: "Excluir",
            })
        );

        expect(setShowModalConfirmacaoExclusao).toHaveBeenCalledWith(false);
        expect(onExcluir).toHaveBeenCalledWith("repasse-42");
    });

    it("deve manter o repasse ao cancelar a exclusão", async () => {
        const user = userEvent.setup();
        const onExcluir = jest.fn();
        const setShowModalConfirmacaoExclusao = jest.fn();

        renderComponent({ onExcluir, setShowModalConfirmacaoExclusao });

        await user.click(
            within(screen.getByRole("dialog")).getByRole("button", {
                name: "Cancelar",
            })
        );

        expect(setShowModalConfirmacaoExclusao).toHaveBeenCalledWith(false);
        expect(onExcluir).not.toHaveBeenCalled();
    });
});
