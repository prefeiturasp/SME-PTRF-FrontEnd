import React from "react";
import {render, screen, fireEvent} from "@testing-library/react";

import {TopoComBotoes} from "../components/TopoComBotoes";
import {RepassesContext} from "../context/Repasse";

import {RetornaSeTemPermissaoEdicaoPainelParametrizacoes} from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import {useAbasPorRecursoContext} from "../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext";

jest.mock(
    "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes",
    () => ({
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
    })
);

jest.mock(
    "../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext",
    () => ({
        useAbasPorRecursoContext: jest.fn(),
    })
);

jest.mock("../../../../../Globais/UI/Button", () => ({
    IconButton: ({label, onClick, disabled}) => (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
        >
            {label}
        </button>
    ),
}));

describe("TopoComBotoes", () => {
    const mockSetShowModalForm = jest.fn();
    const mockSetStateFormModal = jest.fn();

    const initialStateFormModal = {
        recurso: "",
        valor_capital: "",
        valor_custeio: "",
        valor_livre: "",
    };

    const selectedRecurso = {
        uuid: "recurso-1",
        nome: "Recurso 1",
        nome_exibicao: "Recurso 1",
    };

    const renderComponent = ({
        permission = true,
        recurso = selectedRecurso,
    } = {}) => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(
            permission
        );

        useAbasPorRecursoContext.mockReturnValue({
            selectedRecurso: recurso,
        });

        return render(
            <RepassesContext.Provider
                value={{
                    setShowModalForm: mockSetShowModalForm,
                    setStateFormModal: mockSetStateFormModal,
                    initialStateFormModal,
                }}
            >
                <TopoComBotoes />
            </RepassesContext.Provider>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("renderização", () => {
        it("deve exibir o nome do recurso selecionado", () => {
            renderComponent();

            expect(
                screen.getByRole("heading", {name: "Recurso 1"})
            ).toBeInTheDocument();
        });

        it("deve exibir a descrição do recurso selecionado", () => {
            renderComponent();

            expect(
                screen.getByText(
                    "Confira abaixo os repasses do Recurso 1."
                )
            ).toBeInTheDocument();
        });

        it("deve exibir o botão de adicionar repasse previsto", () => {
            renderComponent();

            expect(
                screen.getByRole("button", {
                    name: "Adicionar repasse previsto",
                })
            ).toBeInTheDocument();
        });

        it("deve exibir o nome do recurso mesmo quando não houver recurso selecionado", () => {
            renderComponent({
                recurso: null,
            });

            expect(screen.getByRole("heading")).toBeEmptyDOMElement();

            expect(
                screen.getByText("Confira abaixo os repasses do .")
            ).toBeInTheDocument();
        });
    });

    describe("permissões", () => {
        it("deve habilitar o botão quando o usuário possui permissão", () => {
            renderComponent({
                permission: true,
            });

            expect(
                screen.getByRole("button", {
                    name: "Adicionar repasse previsto",
                })
            ).toBeEnabled();
        });

        it("deve desabilitar o botão quando o usuário não possui permissão", () => {
            renderComponent({
                permission: false,
            });

            expect(
                screen.getByRole("button", {
                    name: "Adicionar repasse previsto",
                })
            ).toBeDisabled();
        });
    });

    describe("ações do botão", () => {
        it("deve abrir o formulário ao adicionar um repasse", () => {
            renderComponent();

            fireEvent.click(
                screen.getByRole("button", {
                    name: "Adicionar repasse previsto",
                })
            );

            expect(mockSetStateFormModal).toHaveBeenCalledWith({
                ...initialStateFormModal,
                recurso: "recurso-1",
            });

            expect(mockSetShowModalForm).toHaveBeenCalledWith(true);
        });

        it("deve utilizar recurso vazio quando não houver recurso selecionado", () => {
            renderComponent({
                recurso: null,
            });

            fireEvent.click(
                screen.getByRole("button", {
                    name: "Adicionar repasse previsto",
                })
            );

            expect(mockSetStateFormModal).toHaveBeenCalledWith({
                ...initialStateFormModal,
                recurso: "",
            });

            expect(mockSetShowModalForm).toHaveBeenCalledWith(true);
        });

        it("não deve executar a ação quando o botão estiver desabilitado", () => {
            renderComponent({
                permission: false,
            });

            fireEvent.click(
                screen.getByRole("button", {
                    name: "Adicionar repasse previsto",
                })
            );

            expect(mockSetStateFormModal).not.toHaveBeenCalled();
            expect(mockSetShowModalForm).not.toHaveBeenCalled();
        });
    });
});