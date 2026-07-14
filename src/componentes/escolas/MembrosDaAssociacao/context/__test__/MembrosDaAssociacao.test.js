import React, { useContext } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import {
    MembrosDaAssociacaoProvider,
    MembrosDaAssociacaoContext,
} from "../MembrosDaAssociacao";

const Consumer = () => {
    const {
        composicaoUuid,
        setComposicaoUuid,
        currentPage,
        setCurrentPage,
        firstPage,
        setFirstPage,
        mandatoUuid,
        setMandatoUuid,
        reiniciaEstadosControleComposicoes,
    } = useContext(MembrosDaAssociacaoContext);

    return (
        <>
            <span data-testid="composicaoUuid">{composicaoUuid}</span>
            <span data-testid="currentPage">{currentPage}</span>
            <span data-testid="firstPage">{firstPage}</span>
            <span data-testid="mandatoUuid">{mandatoUuid}</span>

            <button onClick={() => setComposicaoUuid("comp-123")}>
                composição
            </button>

            <button onClick={() => setCurrentPage(5)}>
                página
            </button>

            <button onClick={() => setFirstPage(10)}>
                primeira
            </button>

            <button onClick={() => setMandatoUuid("mandato-321")}>
                mandato
            </button>

            <button onClick={reiniciaEstadosControleComposicoes}>
                reiniciar
            </button>
        </>
    );
};

describe("MembrosDaAssociacaoProvider", () => {
    const renderComponent = () =>
        render(
            <MembrosDaAssociacaoProvider>
                <Consumer />
            </MembrosDaAssociacaoProvider>
        );

    it("deve fornecer os valores iniciais do contexto", () => {
        renderComponent();

        expect(screen.getByTestId("composicaoUuid")).toHaveTextContent("");
        expect(screen.getByTestId("currentPage")).toHaveTextContent("1");
        expect(screen.getByTestId("firstPage")).toHaveTextContent("0");
        expect(screen.getByTestId("mandatoUuid")).toHaveTextContent("");
    });

    it("deve atualizar composicaoUuid", () => {
        renderComponent();

        fireEvent.click(screen.getByRole("button", { name: /composição/i }));

        expect(screen.getByTestId("composicaoUuid")).toHaveTextContent(
            "comp-123"
        );
    });

    it("deve atualizar currentPage", () => {
        renderComponent();

        fireEvent.click(screen.getByRole("button", { name: /página/i }));

        expect(screen.getByTestId("currentPage")).toHaveTextContent("5");
    });

    it("deve atualizar firstPage", () => {
        renderComponent();

        fireEvent.click(screen.getByRole("button", { name: /primeira/i }));

        expect(screen.getByTestId("firstPage")).toHaveTextContent("10");
    });

    it("deve atualizar mandatoUuid", () => {
        renderComponent();

        fireEvent.click(screen.getByRole("button", { name: /mandato/i }));

        expect(screen.getByTestId("mandatoUuid")).toHaveTextContent(
            "mandato-321"
        );
    });

    it("deve reiniciar os estados de composição", () => {
        renderComponent();

        fireEvent.click(screen.getByRole("button", { name: /composição/i }));
        fireEvent.click(screen.getByRole("button", { name: /página/i }));
        fireEvent.click(screen.getByRole("button", { name: /primeira/i }));
        fireEvent.click(screen.getByRole("button", { name: /mandato/i }));

        fireEvent.click(screen.getByRole("button", { name: /reiniciar/i }));

        expect(screen.getByTestId("composicaoUuid")).toHaveTextContent("");
        expect(screen.getByTestId("currentPage")).toHaveTextContent("1");
        expect(screen.getByTestId("firstPage")).toHaveTextContent("0");

        expect(screen.getByTestId("mandatoUuid")).toHaveTextContent(
            "mandato-321"
        );
    });
});