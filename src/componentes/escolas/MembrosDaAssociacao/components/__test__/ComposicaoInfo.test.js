import { render, screen, configure  } from "@testing-library/react";
import { ComposicaoInfo } from "../ComposicaoInfo";
import { useGetComposicao } from "../../hooks/useGetComposicao";

jest.mock("../../hooks/useGetComposicao");

jest.mock("../../../../../hooks/Globais/useDataTemplate", () => ({
    __esModule: true,
    default: () => jest.fn((_, __, date) => date) 
}));

configure({ testIdAttribute: 'data-qa' });

describe("<ComposicaoInfo />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve exibir o estado de loading (não renderizar o container) quando isLoading for true", () => {
        useGetComposicao.mockReturnValue({
            isLoading: true,
            data: null,
        });

        render(<ComposicaoInfo />);

        const container = screen.queryByTestId("composicao-info");
        expect(container).not.toBeInTheDocument();
    });

    it("deve renderizar as informações corretamente quando os dados forem carregados com sucesso", () => {
        const mockData = {
            uuid: "1234-abcd",
            data_inicial: "2026-01-01",
            data_final: "2026-01-31",
        };

        useGetComposicao.mockReturnValue({
            isLoading: false,
            data: mockData,
        });

        render(<ComposicaoInfo />);

        const container = screen.getByTestId("composicao-info");
        expect(container).toBeInTheDocument();

        expect(screen.getByText("Composição a partir de:")).toBeInTheDocument();

        expect(screen.getByText("2026-01-01", { exact: false })).toBeInTheDocument();
        expect(screen.getByText("até", { exact: false })).toBeInTheDocument();
        expect(screen.getByText("2026-01-31", { exact: false })).toBeInTheDocument();
    });

    it("não deve renderizar nada se isLoading for false mas data for nulo", () => {
        useGetComposicao.mockReturnValue({
            isLoading: false,
            data: null,
        });

        render(<ComposicaoInfo />);

        const container = screen.queryByTestId("composicao-info");
        expect(container).not.toBeInTheDocument();
    });

    it("não deve renderizar nada se data existir mas não possuir um uuid válido", () => {
        useGetComposicao.mockReturnValue({
            isLoading: false,
            data: {
                uuid: null,
                data_inicial: "2026-01-01",
                data_final: "2026-01-31",
            },
        });

        render(<ComposicaoInfo />);

        const container = screen.queryByTestId("composicao-info");
        expect(container).not.toBeInTheDocument();
    });
});