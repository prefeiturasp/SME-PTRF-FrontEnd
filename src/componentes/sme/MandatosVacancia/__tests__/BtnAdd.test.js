import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BtnAdd } from "../BtnAdd";

jest.mock("../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

const mockRetornaSeTemPermissaoEdicaoPainelParametrizacoes = require(
    "../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes"
).RetornaSeTemPermissaoEdicaoPainelParametrizacoes;

describe("BtnAdd (MandatosVacancia)", () => {
    const setShowModalForm = jest.fn();
    const setStateFormModal = jest.fn();
    const initialStateFormModal = { referencia_mandato: "" };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve renderizar o botão de adicionar período de mandato", () => {
        mockRetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

        render(
            <BtnAdd
                setShowModalForm={setShowModalForm}
                initialStateFormModal={initialStateFormModal}
                setStateFormModal={setStateFormModal}
            />
        );

        expect(screen.getByRole("button", { name: /adicionar período de mandato/i })).toBeInTheDocument();
    });

    it("deve habilitar o botão quando houver permissão", () => {
        mockRetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

        render(
            <BtnAdd
                setShowModalForm={setShowModalForm}
                initialStateFormModal={initialStateFormModal}
                setStateFormModal={setStateFormModal}
            />
        );

        expect(screen.getByRole("button", { name: /adicionar período de mandato/i })).not.toBeDisabled();
    });

    it("deve desabilitar o botão quando não houver permissão", () => {
        mockRetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);

        render(
            <BtnAdd
                setShowModalForm={setShowModalForm}
                initialStateFormModal={initialStateFormModal}
                setStateFormModal={setStateFormModal}
            />
        );

        expect(screen.getByRole("button", { name: /adicionar período de mandato/i })).toBeDisabled();
    });

    it("deve resetar o formulário e abrir a modal ao clicar", () => {
        mockRetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

        render(
            <BtnAdd
                setShowModalForm={setShowModalForm}
                initialStateFormModal={initialStateFormModal}
                setStateFormModal={setStateFormModal}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: /adicionar período de mandato/i }));

        expect(setStateFormModal).toHaveBeenCalledWith(initialStateFormModal);
        expect(setShowModalForm).toHaveBeenCalledWith(true);
    });
});
