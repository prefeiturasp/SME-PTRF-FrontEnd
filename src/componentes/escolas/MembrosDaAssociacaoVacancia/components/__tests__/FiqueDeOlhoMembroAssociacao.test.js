import { render, screen } from "@testing-library/react";
import { FiqueDeOlhoMembroAssociacao } from "../FiqueDeOlhoMembroAssociação";

import { useGetFiqueDeOlhoMembroAssociacao } from "../../hooks/useGetFiqueDeOlhoMembroAssociacao";

jest.mock("../../hooks/useGetFiqueDeOlhoMembroAssociacao");

describe("FiqueDeOlhoMembroAssociacao", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("não deve renderizar nada quando não houver dados", () => {
        useGetFiqueDeOlhoMembroAssociacao.mockReturnValue({
            data: undefined,
        });

        const { container } = render(<FiqueDeOlhoMembroAssociacao />);

        expect(container).toBeEmptyDOMElement();
    });

    it("não deve renderizar nada quando a lista de resultados estiver vazia", () => {
        useGetFiqueDeOlhoMembroAssociacao.mockReturnValue({
            data: { results: [] },
        });

        const { container } = render(<FiqueDeOlhoMembroAssociacao />);

        expect(container).toBeEmptyDOMElement();
    });

    it("não deve renderizar nada quando o primeiro resultado não possuir texto", () => {
        useGetFiqueDeOlhoMembroAssociacao.mockReturnValue({
            data: { results: [{ texto: null }] },
        });

        const { container } = render(<FiqueDeOlhoMembroAssociacao />);

        expect(container).toBeEmptyDOMElement();
    });

    it("deve renderizar o texto do primeiro resultado retornado pelo hook", () => {
        useGetFiqueDeOlhoMembroAssociacao.mockReturnValue({
            data: {
                results: [
                    { texto: "<p>Fique de olho: atenção aos prazos.</p>" },
                    { texto: "<p>Outro texto que não deve ser exibido.</p>" },
                ],
            },
        });

        render(<FiqueDeOlhoMembroAssociacao />);

        expect(
            screen.getByText("Fique de olho: atenção aos prazos.")
        ).toBeInTheDocument();
        expect(
            screen.queryByText("Outro texto que não deve ser exibido.")
        ).not.toBeInTheDocument();
    });
});
