import React from "react";
import { render, screen, act } from "@testing-library/react";
import { PaginaMandatoAnteriorVacancia } from "../PaginaMandatoAnteriorVacancia";

const mockUseGetMandatosAnterioresVacancia = jest.fn();
const mockUseGetComposicaoVigenteVacancia = jest.fn();
const mockUseGetDatasDeAlteracaoDaComposicaoVacancia = jest.fn();
const mockOnPageChangeCapturado = { current: null };
const mockOnChangeMandatoCapturado = { current: null };

jest.mock("../../hooks/useGetMandatosAnterioresVacancia", () => ({
    useGetMandatosAnterioresVacancia: () => mockUseGetMandatosAnterioresVacancia(),
}));

jest.mock("../../hooks/useGetComposicaoVigenteVacancia", () => ({
    useGetComposicaoVigenteVacancia: (mandatoUuid) => mockUseGetComposicaoVigenteVacancia(mandatoUuid),
}));

jest.mock("../../hooks/useGetDatasDeAlteracaoDaComposicaoVacancia", () => ({
    useGetDatasDeAlteracaoDaComposicaoVacancia: (composicaoUuid) =>
        mockUseGetDatasDeAlteracaoDaComposicaoVacancia(composicaoUuid),
}));

jest.mock("../../components/SelectMandatoAnteriorVacancia", () => ({
    SelectMandatoAnteriorVacancia: ({ mandatos, mandatoUuid, onChangeMandato }) => {
        mockOnChangeMandatoCapturado.current = onChangeMandato;
        return (
            <div data-testid="select-mandato-anterior">
                selecionado:{mandatoUuid} total:{mandatos.length}
            </div>
        );
    },
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

const mandatoAnterior1 = { uuid: "mandato-1", data_inicial: "2024-01-01", data_final: "2024-12-31" };
const mandatoAnterior2 = { uuid: "mandato-2", data_inicial: "2023-01-01", data_final: "2023-12-31" };

describe("PaginaMandatoAnteriorVacancia", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockOnPageChangeCapturado.current = null;
        mockOnChangeMandatoCapturado.current = null;
        mockUseGetDatasDeAlteracaoDaComposicaoVacancia.mockReturnValue({ data: [] });
        mockUseGetComposicaoVigenteVacancia.mockReturnValue({ isLoading: false, data: { uuid: null } });
    });

    it("deve exibir loading enquanto a lista de mandatos anteriores está carregando", () => {
        mockUseGetMandatosAnterioresVacancia.mockReturnValue({ isLoading: true, data: [] });

        render(<PaginaMandatoAnteriorVacancia />);

        expect(screen.queryByTestId("select-mandato-anterior")).not.toBeInTheDocument();
        expect(screen.getByText(/carregando/i)).toBeInTheDocument();
    });

    it("deve exibir mensagem quando não existem mandatos anteriores", () => {
        mockUseGetMandatosAnterioresVacancia.mockReturnValue({ isLoading: false, data: [] });

        render(<PaginaMandatoAnteriorVacancia />);

        expect(screen.getByText(/não existem mandatos anteriores/i)).toBeInTheDocument();
    });

    it("deve selecionar o primeiro mandato da lista por padrão", () => {
        mockUseGetMandatosAnterioresVacancia.mockReturnValue({
            isLoading: false, data: [mandatoAnterior1, mandatoAnterior2],
        });
        mockUseGetComposicaoVigenteVacancia.mockReturnValue({ isLoading: false, data: { uuid: "composicao-1" } });

        render(<PaginaMandatoAnteriorVacancia />);

        expect(screen.getByTestId("select-mandato-anterior")).toHaveTextContent("selecionado:mandato-1");
        expect(screen.getByTestId("select-mandato-anterior")).toHaveTextContent("total:2");
        expect(mockUseGetComposicaoVigenteVacancia).toHaveBeenCalledWith("mandato-1");
    });

    it("deve renderizar a tabela de cargos sem navegação quando não houver marcos", () => {
        mockUseGetMandatosAnterioresVacancia.mockReturnValue({ isLoading: false, data: [mandatoAnterior1] });
        mockUseGetComposicaoVigenteVacancia.mockReturnValue({ isLoading: false, data: { uuid: "composicao-1" } });
        mockUseGetDatasDeAlteracaoDaComposicaoVacancia.mockReturnValue({ data: [] });

        render(<PaginaMandatoAnteriorVacancia />);

        expect(screen.queryByTestId("marco-info-vacancia")).not.toBeInTheDocument();
        expect(screen.queryByTestId("paginacao-vacancia")).not.toBeInTheDocument();
        expect(screen.getByTestId("cargos-da-composicao-vacancia")).toHaveTextContent("composicao-1");
        expect(screen.getByTestId("cargos-da-composicao-vacancia")).toHaveTextContent("data:undefined");
        expect(mockUseGetDatasDeAlteracaoDaComposicaoVacancia).toHaveBeenCalledWith("composicao-1");
    });

    it("deve abrir no marco mais recente do mandato selecionado", () => {
        mockUseGetMandatosAnterioresVacancia.mockReturnValue({ isLoading: false, data: [mandatoAnterior1] });
        mockUseGetComposicaoVigenteVacancia.mockReturnValue({ isLoading: false, data: { uuid: "composicao-1" } });
        mockUseGetDatasDeAlteracaoDaComposicaoVacancia.mockReturnValue({
            data: ["2024-01-01", "2024-06-15"],
        });

        render(<PaginaMandatoAnteriorVacancia />);

        expect(screen.getByTestId("paginacao-vacancia")).toHaveTextContent("count:2");
        expect(screen.getByTestId("paginacao-vacancia")).toHaveTextContent("firstPage:0");
        expect(screen.getByTestId("marco-info-vacancia")).toHaveTextContent("2024-06-15 até 2024-12-31");
        expect(screen.getByTestId("cargos-da-composicao-vacancia")).toHaveTextContent("data:2024-06-15");
    });

    it("deve mostrar marcos cada vez mais antigos ao avançar a paginação", () => {
        mockUseGetMandatosAnterioresVacancia.mockReturnValue({ isLoading: false, data: [mandatoAnterior1] });
        mockUseGetComposicaoVigenteVacancia.mockReturnValue({ isLoading: false, data: { uuid: "composicao-1" } });
        mockUseGetDatasDeAlteracaoDaComposicaoVacancia.mockReturnValue({
            data: ["2024-01-01", "2024-06-15"],
        });

        render(<PaginaMandatoAnteriorVacancia />);

        act(() => {
            mockOnPageChangeCapturado.current(2, 1);
        });

        expect(screen.getByTestId("marco-info-vacancia")).toHaveTextContent("2024-01-01 até 2024-12-31");
        expect(screen.getByTestId("cargos-da-composicao-vacancia")).toHaveTextContent("data:2024-01-01");
    });

    it("deve trocar o mandato selecionado e reiniciar a paginação ao selecionar outro mandato", () => {
        mockUseGetMandatosAnterioresVacancia.mockReturnValue({
            isLoading: false, data: [mandatoAnterior1, mandatoAnterior2],
        });
        mockUseGetComposicaoVigenteVacancia.mockReturnValue({ isLoading: false, data: { uuid: "composicao-1" } });
        mockUseGetDatasDeAlteracaoDaComposicaoVacancia.mockReturnValue({
            data: ["2024-01-01", "2024-06-15"],
        });

        render(<PaginaMandatoAnteriorVacancia />);

        act(() => {
            mockOnPageChangeCapturado.current(2, 1);
        });
        expect(screen.getByTestId("paginacao-vacancia")).toHaveTextContent("firstPage:1");

        act(() => {
            mockOnChangeMandatoCapturado.current("mandato-2");
        });

        expect(screen.getByTestId("select-mandato-anterior")).toHaveTextContent("selecionado:mandato-2");
        expect(mockUseGetComposicaoVigenteVacancia).toHaveBeenCalledWith("mandato-2");
        expect(screen.getByTestId("paginacao-vacancia")).toHaveTextContent("firstPage:0");
    });
});
