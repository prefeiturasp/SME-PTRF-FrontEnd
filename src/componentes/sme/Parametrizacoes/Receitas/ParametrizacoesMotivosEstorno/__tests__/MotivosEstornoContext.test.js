import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
    MotivosEstornoContext,
    MotivosEstornoProvider,
} from "../context/MotivosEstorno";
import { useAbasPorRecursoContext } from "../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext";

jest.mock("../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext");

const selectedRecurso = {
    uuid: "recurso-1",
    nome: "PTRF",
};

const Consumer = () => (
    <MotivosEstornoContext.Consumer>
        {(context) => (
            <div>
                <span data-testid="rows-per-page">{context.rowsPerPage}</span>
                <span data-testid="filter-motivo">{context.filter.motivo}</span>
                <span data-testid="filter-recurso">{context.filter.recurso_uuid}</span>
                <span data-testid="filter-page-size">{context.filter.page_size}</span>
                <span data-testid="modal-open">{String(context.stateFormModal.isOpen)}</span>
                <span data-testid="modal-recurso">{context.stateFormModal.recurso_uuid}</span>
                <span data-testid="modal-motivo">{context.stateFormModal.motivo}</span>
                <span data-testid="confirm-open">
                    {String(context.showModalConfirmacaoExclusao.is_open)}
                </span>
                <span data-testid="confirm-uuid">
                    {context.showModalConfirmacaoExclusao.motivo_uuid}
                </span>
                <button
                    type="button"
                    onClick={() => context.setFilter({
                        ...context.filter,
                        motivo: "Filtro teste",
                    })}
                >
                    alterar filtro
                </button>
                <button
                    type="button"
                    onClick={() => context.handleOpenCreateModal(selectedRecurso)}
                >
                    abrir modal
                </button>
                <button type="button" onClick={context.handleCloseModalForm}>
                    fechar modal
                </button>
                <button
                    type="button"
                    onClick={() => context.handleOpenModalConfirmacaoExclusao("motivo-1")}
                >
                    abrir confirmacao
                </button>
                <button
                    type="button"
                    onClick={context.handleCloseModalConfirmacaoExclusao}
                >
                    fechar confirmacao
                </button>
            </div>
        )}
    </MotivosEstornoContext.Consumer>
);

describe("MotivosEstornoProvider", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        useAbasPorRecursoContext.mockReturnValue({
            selectedRecurso,
        });
    });

    it("deve inicializar o contexto com filtro do recurso selecionado", async () => {
        render(
            <MotivosEstornoProvider>
                <Consumer />
            </MotivosEstornoProvider>,
        );

        expect(screen.getByTestId("rows-per-page")).toHaveTextContent("10");
        expect(screen.getByTestId("filter-motivo")).toHaveTextContent("");
        expect(screen.getByTestId("filter-page-size")).toHaveTextContent("10");

        await waitFor(() =>
            expect(screen.getByTestId("filter-recurso")).toHaveTextContent("recurso-1"),
        );
    });

    it("deve permitir alterar o filtro", async () => {
        render(
            <MotivosEstornoProvider>
                <Consumer />
            </MotivosEstornoProvider>,
        );

        fireEvent.click(screen.getByText("alterar filtro"));

        await waitFor(() =>
            expect(screen.getByTestId("filter-motivo")).toHaveTextContent("Filtro teste"),
        );
    });

    it("deve abrir e fechar o modal de formulario", async () => {
        render(
            <MotivosEstornoProvider>
                <Consumer />
            </MotivosEstornoProvider>,
        );

        fireEvent.click(screen.getByText("abrir modal"));

        expect(screen.getByTestId("modal-open")).toHaveTextContent("true");
        expect(screen.getByTestId("modal-recurso")).toHaveTextContent("recurso-1");

        fireEvent.click(screen.getByText("fechar modal"));

        await waitFor(() => {
            expect(screen.getByTestId("modal-open")).toHaveTextContent("false");
            expect(screen.getByTestId("modal-recurso")).toHaveTextContent("");
            expect(screen.getByTestId("modal-motivo")).toHaveTextContent("");
        });
    });

    it("deve abrir e fechar o modal de confirmacao de exclusao", async () => {
        render(
            <MotivosEstornoProvider>
                <Consumer />
            </MotivosEstornoProvider>,
        );

        fireEvent.click(screen.getByText("abrir confirmacao"));

        expect(screen.getByTestId("confirm-open")).toHaveTextContent("true");
        expect(screen.getByTestId("confirm-uuid")).toHaveTextContent("motivo-1");

        fireEvent.click(screen.getByText("fechar confirmacao"));

        await waitFor(() => {
            expect(screen.getByTestId("confirm-open")).toHaveTextContent("false");
            expect(screen.getByTestId("confirm-uuid")).toHaveTextContent("");
        });
    });
});
