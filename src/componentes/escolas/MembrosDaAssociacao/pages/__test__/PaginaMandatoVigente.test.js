import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { PaginaMandatoVigente } from "../PaginaMandatoVigente";
import { useGetMandatoVigente } from "../../hooks/useGetMandatoVigente";
import { MembrosDaAssociacaoContext } from "../../context/MembrosDaAssociacao";
import { ExportaDadosAssociacaoContext } from "../../../Associacao/ExportaDadosAssociacao/context/ExportaDadosAssociacao";

jest.mock("../../hooks/useGetMandatoVigente");

jest.mock("../../components/MandatoInfo", () => ({
    MandatoInfo: () => <div>Mandato Info</div>,
}));

jest.mock("../../components/ComposicaoInfo", () => ({
    ComposicaoInfo: () => <div>Composição Info</div>,
}));

jest.mock("../../components/CargosDaComposicaoList", () => ({
    CargosDaComposicaoList: ({ escopo }) => (
        <div>Cargos {escopo}</div>
    ),
}));

jest.mock("../../components/Paginacao", () => ({
    Paginacao: ({ count }) => <div>Página {count}</div>,
}));

jest.mock("../../../../../utils/Loading", () => () => (
    <div data-testid="loading">Loading...</div>
));

const mockedUseGetMandatoVigente = useGetMandatoVigente;

const setComposicaoUuid = jest.fn();
const reiniciaEstadosControleComposicoes = jest.fn();
const setExibeComponent = jest.fn();

const renderComponent = ({
    composicaoUuid = "",
    currentPage = 1,
    hookReturn,
} = {}) => {
    mockedUseGetMandatoVigente.mockReturnValue(
        hookReturn || {
            isLoading: false,
            isError: false,
            count: 1,
            data: {
                uuid: "mandato-1",
                composicoes: [{ uuid: "comp-1" }],
            },
        }
    );

    return render(
        <ExportaDadosAssociacaoContext.Provider
            value={{
                setExibeComponent,
            }}
        >
            <MembrosDaAssociacaoContext.Provider
                value={{
                    composicaoUuid,
                    currentPage,
                    setComposicaoUuid,
                    reiniciaEstadosControleComposicoes,
                }}
            >
                <PaginaMandatoVigente />
            </MembrosDaAssociacaoContext.Provider>
        </ExportaDadosAssociacaoContext.Provider>
    );
};

beforeEach(() => {
    jest.clearAllMocks();
});

describe("PaginaMandatoVigente", () => {
    it("deve exibir loading enquanto busca os dados", () => {
        renderComponent({
            hookReturn: {
                isLoading: true,
                isError: false,
                count: 0,
                data: null,
            },
        });

        expect(screen.getByTestId("loading")).toBeInTheDocument();
    });

    it("deve exibir mensagem quando não existir mandato vigente", () => {
        renderComponent({
            hookReturn: {
                isLoading: false,
                isError: false,
                count: 0,
                data: {},
            },
        });

        expect(
            screen.getByText(/não existe mandato vigente/i)
        ).toBeInTheDocument();
    });

    it("deve exibir mensagem quando ocorrer erro na consulta", () => {
        renderComponent({
            hookReturn: {
                isLoading: false,
                isError: true,
                count: 0,
                data: null,
            },
        });

        expect(
            screen.getByText(/não existe mandato vigente/i)
        ).toBeInTheDocument();
    });

    it("deve renderizar apenas informações do mandato quando não existir composição selecionada", () => {
        renderComponent({
            composicaoUuid: "",
        });

        expect(screen.getByText("Mandato Info")).toBeInTheDocument();
        expect(screen.getByText("Página 1")).toBeInTheDocument();

        expect(
            screen.queryByText("Composição Info")
        ).not.toBeInTheDocument();

        expect(
            screen.queryByText(/Cargos mandato-vigente/)
        ).not.toBeInTheDocument();
    });

    it("deve renderizar informações da composição e lista de cargos quando existir composição selecionada", () => {
        renderComponent({
            composicaoUuid: "comp-1",
        });

        expect(screen.getByText("Mandato Info")).toBeInTheDocument();
        expect(screen.getByText("Composição Info")).toBeInTheDocument();
        expect(
            screen.getByText("Cargos mandato-vigente")
        ).toBeInTheDocument();
        expect(screen.getByText("Página 1")).toBeInTheDocument();
    });

    it("deve reiniciar os estados de controle ao montar o componente", () => {
        renderComponent();

        expect(
            reiniciaEstadosControleComposicoes
        ).toHaveBeenCalledTimes(1);
    });

    it("deve definir a composição correspondente à página atual", async () => {
        renderComponent({
            currentPage: 2,
            hookReturn: {
                isLoading: false,
                isError: false,
                count: 2,
                data: {
                    uuid: "mandato-1",
                    composicoes: [
                        { uuid: "comp-1" },
                        { uuid: "comp-2" },
                    ],
                },
            },
        });

        await waitFor(() => {
            expect(setComposicaoUuid).toHaveBeenCalledWith("comp-2");
        });
    });

    it("não deve definir composição quando não houver composições", () => {
        renderComponent({
            hookReturn: {
                isLoading: false,
                isError: false,
                count: 0,
                data: {
                    uuid: "mandato-1",
                    composicoes: [],
                },
            },
        });

        expect(setComposicaoUuid).not.toHaveBeenCalled();
    });

    it("não deve definir composição quando a página for maior que a quantidade de composições", () => {
        renderComponent({
            currentPage: 3,
            hookReturn: {
                isLoading: false,
                isError: false,
                count: 2,
                data: {
                    uuid: "mandato-1",
                    composicoes: [
                        { uuid: "comp-1" },
                        { uuid: "comp-2" },
                    ],
                },
            },
        });

        expect(setComposicaoUuid).not.toHaveBeenCalled();
    });

    it("não deve definir composição quando data for nulo", () => {
        renderComponent({
            hookReturn: {
                isLoading: false,
                isError: false,
                count: 0,
                data: null,
            },
        });

        expect(setComposicaoUuid).not.toHaveBeenCalled();
    });

    it("deve habilitar a exportação quando estiver na primeira página", () => {
        renderComponent({
            currentPage: 1,
        });

        expect(setExibeComponent).toHaveBeenCalledWith(true);
    });

    it("deve desabilitar a exportação quando não estiver na primeira página", () => {
        renderComponent({
            currentPage: 2,
            hookReturn: {
                isLoading: false,
                isError: false,
                count: 2,
                data: {
                    uuid: "mandato-1",
                    composicoes: [
                        { uuid: "comp-1" },
                        { uuid: "comp-2" },
                    ],
                },
            },
        });

        expect(setExibeComponent).toHaveBeenCalledWith(false);
    });
});