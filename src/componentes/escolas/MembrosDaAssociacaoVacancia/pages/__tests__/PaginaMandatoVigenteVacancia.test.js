import React from "react";
import { render, screen, act } from "@testing-library/react";
import { PaginaMandatoVigenteVacancia } from "../PaginaMandatoVigenteVacancia";

const mockUseGetMandatoVigente = jest.fn();
const mockUseGetComposicaoVigenteVacancia = jest.fn();
const mockUseGetDatasDeAlteracaoDaComposicaoVacancia = jest.fn();
const mockUseLocation = jest.fn();
const mockOnPageChangeCapturado = { current: null };

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useLocation: () => mockUseLocation(),
}));

jest.mock("../../hooks/useGetMandatoVigente", () => ({
    useGetMandatoVigente: () => mockUseGetMandatoVigente(),
}));

jest.mock("../../hooks/useGetComposicaoVigenteVacancia", () => ({
    useGetComposicaoVigenteVacancia: (mandatoUuid) => mockUseGetComposicaoVigenteVacancia(mandatoUuid),
}));

jest.mock("../../hooks/useGetDatasDeAlteracaoDaComposicaoVacancia", () => ({
    useGetDatasDeAlteracaoDaComposicaoVacancia: (composicaoUuid) =>
        mockUseGetDatasDeAlteracaoDaComposicaoVacancia(composicaoUuid),
}));

jest.mock("../../components/MandatoInfo", () => ({
    MandatoInfo: () => <div data-testid="mandato-info" />,
}));

jest.mock("../../components/MarcoInfoVacancia", () => ({
    MarcoInfoVacancia: ({ dataInicio, dataFim }) => (
        <div data-testid="marco-info-vacancia">{dataInicio} até {dataFim}</div>
    ),
}));

jest.mock("../../components/PaginacaoVacancia", () => ({
    PaginacaoVacancia: ({ count, firstPage, onPageChange }) => {
        mockOnPageChangeCapturado.current = onPageChange;
        return (
            <div data-testid="paginacao-vacancia">
                count:{count} firstPage:{firstPage}
            </div>
        );
    },
}));

jest.mock("../../components/CargosDaComposicaoListVacancia", () => ({
    CargosDaComposicaoListVacancia: ({ composicaoUuid, data }) => (
        <div data-testid="cargos-da-composicao-vacancia">{composicaoUuid} data:{data ?? "undefined"}</div>
    ),
}));

describe("PaginaMandatoVigenteVacancia", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockOnPageChangeCapturado.current = null;
        mockUseGetDatasDeAlteracaoDaComposicaoVacancia.mockReturnValue({ data: [] });
        mockUseLocation.mockReturnValue({ state: undefined });
    });

    it("deve exibir loading enquanto o mandato está carregando", () => {
        mockUseGetMandatoVigente.mockReturnValue({
            isLoading: true, data: { uuid: null }, isError: false,
        });
        mockUseGetComposicaoVigenteVacancia.mockReturnValue({
            isLoading: false, data: { uuid: null },
        });

        render(<PaginaMandatoVigenteVacancia />);

        expect(screen.queryByTestId("mandato-info")).not.toBeInTheDocument();
        expect(screen.getByText(/carregando/i)).toBeInTheDocument();
    });

    it("deve exibir mensagem quando não existe mandato vigente", () => {
        mockUseGetMandatoVigente.mockReturnValue({
            isLoading: false, data: { uuid: null }, isError: false,
        });
        mockUseGetComposicaoVigenteVacancia.mockReturnValue({
            isLoading: false, data: { uuid: null },
        });

        render(<PaginaMandatoVigenteVacancia />);

        expect(screen.getByText(/não existe mandato vigente/i)).toBeInTheDocument();
    });

    it("deve exibir mensagem quando a consulta do mandato falhar", () => {
        mockUseGetMandatoVigente.mockReturnValue({
            isLoading: false, data: { uuid: "mandato-1" }, isError: true,
        });
        mockUseGetComposicaoVigenteVacancia.mockReturnValue({
            isLoading: false, data: { uuid: null },
        });

        render(<PaginaMandatoVigenteVacancia />);

        expect(screen.getByText(/não existe mandato vigente/i)).toBeInTheDocument();
    });

    it("deve aguardar a composição carregar antes de mostrar o board", () => {
        mockUseGetMandatoVigente.mockReturnValue({
            isLoading: false, data: { uuid: "mandato-1" }, isError: false,
        });
        mockUseGetComposicaoVigenteVacancia.mockReturnValue({
            isLoading: true, data: { uuid: null },
        });

        render(<PaginaMandatoVigenteVacancia />);

        expect(screen.queryByTestId("mandato-info")).not.toBeInTheDocument();
        expect(screen.getByText(/carregando/i)).toBeInTheDocument();
    });

    it("deve renderizar MandatoInfo e a tabela de cargos sem navegação quando não houver marcos", () => {
        mockUseGetMandatoVigente.mockReturnValue({
            isLoading: false, data: { uuid: "mandato-1", data_final: "2026-12-31" }, isError: false,
        });
        mockUseGetComposicaoVigenteVacancia.mockReturnValue({
            isLoading: false, data: { uuid: "composicao-1" },
        });
        mockUseGetDatasDeAlteracaoDaComposicaoVacancia.mockReturnValue({ data: [] });

        render(<PaginaMandatoVigenteVacancia />);

        expect(screen.getByTestId("mandato-info")).toBeInTheDocument();
        expect(screen.queryByTestId("marco-info-vacancia")).not.toBeInTheDocument();
        expect(screen.queryByTestId("paginacao-vacancia")).not.toBeInTheDocument();
        expect(screen.getByTestId("cargos-da-composicao-vacancia")).toHaveTextContent("composicao-1");
        expect(screen.getByTestId("cargos-da-composicao-vacancia")).toHaveTextContent("data:undefined");
        expect(mockUseGetComposicaoVigenteVacancia).toHaveBeenCalledWith("mandato-1");
        expect(mockUseGetDatasDeAlteracaoDaComposicaoVacancia).toHaveBeenCalledWith("composicao-1");
    });

    it("deve abrir no marco mais recente (primeira página) e exibir o período até o fim do mandato", () => {
        mockUseGetMandatoVigente.mockReturnValue({
            isLoading: false, data: { uuid: "mandato-1", data_final: "2026-12-31" }, isError: false,
        });
        mockUseGetComposicaoVigenteVacancia.mockReturnValue({
            isLoading: false, data: { uuid: "composicao-1" },
        });
        mockUseGetDatasDeAlteracaoDaComposicaoVacancia.mockReturnValue({
            data: ["2026-01-01", "2026-03-15"],
        });

        render(<PaginaMandatoVigenteVacancia />);

        expect(screen.getByTestId("paginacao-vacancia")).toHaveTextContent("count:2");
        expect(screen.getByTestId("paginacao-vacancia")).toHaveTextContent("firstPage:0");
        expect(screen.getByTestId("marco-info-vacancia")).toHaveTextContent("2026-03-15 até 2026-12-31");
        expect(screen.getByTestId("cargos-da-composicao-vacancia")).toHaveTextContent("data:2026-03-15");
    });

    it("deve mostrar marcos cada vez mais antigos ao avançar a paginação, sempre com o fim do mandato como período final", () => {
        mockUseGetMandatoVigente.mockReturnValue({
            isLoading: false, data: { uuid: "mandato-1", data_final: "2026-12-31" }, isError: false,
        });
        mockUseGetComposicaoVigenteVacancia.mockReturnValue({
            isLoading: false, data: { uuid: "composicao-1" },
        });
        mockUseGetDatasDeAlteracaoDaComposicaoVacancia.mockReturnValue({
            data: ["2026-01-01", "2026-03-15"],
        });

        render(<PaginaMandatoVigenteVacancia />);

        // avança pra segunda página (marco mais antigo)
        act(() => {
            mockOnPageChangeCapturado.current(2, 1);
        });

        expect(screen.getByTestId("marco-info-vacancia")).toHaveTextContent("2026-01-01 até 2026-12-31");
        expect(screen.getByTestId("cargos-da-composicao-vacancia")).toHaveTextContent("data:2026-01-01");
    });

    it("deve restaurar o marco recebido por state quando ele ainda existir na lista", () => {
        mockUseLocation.mockReturnValue({ state: { marcoSelecionado: "2026-01-01" } });
        mockUseGetMandatoVigente.mockReturnValue({
            isLoading: false, data: { uuid: "mandato-1", data_final: "2026-12-31" }, isError: false,
        });
        mockUseGetComposicaoVigenteVacancia.mockReturnValue({
            isLoading: false, data: { uuid: "composicao-1" },
        });
        mockUseGetDatasDeAlteracaoDaComposicaoVacancia.mockReturnValue({
            data: ["2026-01-01", "2026-03-15"],
        });

        render(<PaginaMandatoVigenteVacancia />);

        expect(screen.getByTestId("marco-info-vacancia")).toHaveTextContent("2026-01-01 até 2026-12-31");
        expect(screen.getByTestId("cargos-da-composicao-vacancia")).toHaveTextContent("data:2026-01-01");
        expect(screen.getByTestId("paginacao-vacancia")).toHaveTextContent("firstPage:1");
    });

    it("deve manter o marco mais recente quando o marco recebido por state não existir mais na lista", () => {
        mockUseLocation.mockReturnValue({ state: { marcoSelecionado: "2026-02-01" } });
        mockUseGetMandatoVigente.mockReturnValue({
            isLoading: false, data: { uuid: "mandato-1", data_final: "2026-12-31" }, isError: false,
        });
        mockUseGetComposicaoVigenteVacancia.mockReturnValue({
            isLoading: false, data: { uuid: "composicao-1" },
        });
        mockUseGetDatasDeAlteracaoDaComposicaoVacancia.mockReturnValue({
            data: ["2026-01-01", "2026-03-15"],
        });

        render(<PaginaMandatoVigenteVacancia />);

        expect(screen.getByTestId("marco-info-vacancia")).toHaveTextContent("2026-03-15 até 2026-12-31");
        expect(screen.getByTestId("cargos-da-composicao-vacancia")).toHaveTextContent("data:2026-03-15");
        expect(screen.getByTestId("paginacao-vacancia")).toHaveTextContent("firstPage:0");
    });
});
