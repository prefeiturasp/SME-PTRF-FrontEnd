import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { PaginaMandatosAnteriores } from "../PaginaMandatosAnteriores";
import { MembrosDaAssociacaoContext } from "../../context/MembrosDaAssociacao";
import { useGetMandatoAnterior } from "../../hooks/useGetMandatoAnterior";
import { useGetMandatosAnteriores } from "../../hooks/useGetMandatosAnteriores";

jest.mock("../../hooks/useGetMandatoAnterior");
jest.mock("../../hooks/useGetMandatosAnteriores");

jest.mock("../../components/SelectMandatosAnteriores", () => ({
    SelectMandatosAnteriores: () => (
        <div>Selecionar Mandato</div>
    ),
}));

jest.mock("../../components/ComposicaoInfo", () => ({
    ComposicaoInfo: () => (
        <div>Composição Info</div>
    ),
}));

jest.mock("../../components/CargosDaComposicaoList", () => ({
    CargosDaComposicaoList: ({ escopo }) => (
        <div>Cargos {escopo}</div>
    ),
}));

jest.mock("../../components/Paginacao", () => ({
    Paginacao: ({ count }) => (
        <div>Paginação {count}</div>
    ),
}));

jest.mock("../../../../../utils/Loading", () => () => (
    <div data-testid="loading">Loading...</div>
));

const mockedUseGetMandatoAnterior = useGetMandatoAnterior;
const mockedUseGetMandatosAnteriores = useGetMandatosAnteriores;

const setComposicaoUuid = jest.fn();
const setMandatoUuid = jest.fn();
const reiniciaEstadosControleComposicoes = jest.fn();

const renderComponent = ({
    composicaoUuid = "",
    currentPage = 1,
    mandatoAnterior,
    mandatosAnteriores,
} = {}) => {
    mockedUseGetMandatosAnteriores.mockReturnValue(
        mandatosAnteriores || {
            data_mandatos_anteriores: [
                {
                    uuid: "mandato-1",
                },
            ],
            isLoading_mandatos_anteriores: false,
        }
    );

    mockedUseGetMandatoAnterior.mockReturnValue(
        mandatoAnterior || {
            isLoading: false,
            isError: false,
            count: 2,
            data: {
                uuid: "mandato-atual",
                composicoes: [
                    {
                        uuid: "comp-1",
                    },
                    {
                        uuid: "comp-2",
                    },
                ],
            },
        }
    );

    return render(
        <MembrosDaAssociacaoContext.Provider
            value={{
                composicaoUuid,
                currentPage,
                setComposicaoUuid,
                setMandatoUuid,
                reiniciaEstadosControleComposicoes,
            }}
        >
            <PaginaMandatosAnteriores />
        </MembrosDaAssociacaoContext.Provider>
    );
};

beforeEach(() => {
    jest.clearAllMocks();
});

describe("PaginaMandatosAnteriores", () => {
    it("deve exibir loading quando estiver carregando o mandato anterior", () => {
        renderComponent({
            mandatoAnterior: {
                isLoading: true,
                isError: false,
                count: 0,
                data: null,
            },
        });

        expect(screen.getByTestId("loading")).toBeInTheDocument();
    });

    it("deve exibir loading quando estiver carregando os mandatos anteriores", () => {
        renderComponent({
            mandatosAnteriores: {
                data_mandatos_anteriores: [],
                isLoading_mandatos_anteriores: true,
            },
        });

        expect(screen.getByTestId("loading")).toBeInTheDocument();
    });

    it("deve exibir mensagem quando ocorrer erro", () => {
        renderComponent({
            mandatoAnterior: {
                isLoading: false,
                isError: true,
                count: 0,
                data: null,
            },
        });

        expect(
            screen.getByText(/não existem mandatos anteriores/i)
        ).toBeInTheDocument();
    });

    it("deve exibir mensagem quando não existir mandato", () => {
        renderComponent({
            mandatoAnterior: {
                isLoading: false,
                isError: false,
                count: 0,
                data: {},
            },
        });

        expect(
            screen.getByText(/não existem mandatos anteriores/i)
        ).toBeInTheDocument();
    });

    it("deve reiniciar os estados de controle ao montar", () => {
        renderComponent();

        expect(
            reiniciaEstadosControleComposicoes
        ).toHaveBeenCalledTimes(1);
    });

    it("deve definir o primeiro mandato automaticamente", async () => {
        renderComponent({
            mandatosAnteriores: {
                isLoading_mandatos_anteriores: false,
                data_mandatos_anteriores: [
                    {
                        uuid: "mandato-123",
                    },
                    {
                        uuid: "mandato-456",
                    },
                ],
            },
        });

        await waitFor(() => {
            expect(setMandatoUuid).toHaveBeenCalledWith(
                "mandato-123"
            );
        });
    });

    it("não deve definir mandato quando a lista estiver vazia", () => {
        renderComponent({
            mandatosAnteriores: {
                isLoading_mandatos_anteriores: false,
                data_mandatos_anteriores: [],
            },
        });

        expect(setMandatoUuid).not.toHaveBeenCalled();
    });

    it("deve definir a composição correspondente à página atual", async () => {
        renderComponent({
            currentPage: 2,
        });

        await waitFor(() => {
            expect(setComposicaoUuid).toHaveBeenCalledWith(
                "comp-2"
            );
        });
    });

    it("não deve definir composição quando data for nulo", () => {
        renderComponent({
            mandatoAnterior: {
                isLoading: false,
                isError: false,
                count: 0,
                data: null,
            },
        });

        expect(setComposicaoUuid).not.toHaveBeenCalled();
    });

    it("não deve definir composição quando não existirem composições", () => {
        renderComponent({
            mandatoAnterior: {
                isLoading: false,
                isError: false,
                count: 0,
                data: {
                    uuid: "mandato",
                    composicoes: [],
                },
            },
        });

        expect(setComposicaoUuid).not.toHaveBeenCalled();
    });

    it("não deve definir composição quando a página for maior que a quantidade de composições", () => {
        renderComponent({
            currentPage: 3,
        });

        expect(setComposicaoUuid).not.toHaveBeenCalled();
    });

    it("deve renderizar todas as informações quando existir composição", () => {
        renderComponent({
            composicaoUuid: "comp-1",
        });

        expect(
            screen.getByText("Selecionar Mandato")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Composição Info")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Paginação 2")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Cargos mandatos-anteriores")
        ).toBeInTheDocument();
    });

    it("não deve renderizar informações da composição quando composicaoUuid estiver vazio", () => {
        renderComponent();

        expect(
            screen.queryByText("Composição Info")
        ).not.toBeInTheDocument();

        expect(
            screen.getByText(
                /não foram encontradas composições/i
            )
        ).toBeInTheDocument();

        expect(
            screen.queryByText("Paginação 2")
        ).not.toBeInTheDocument();

        expect(
            screen.queryByText("Cargos mandatos-anteriores")
        ).not.toBeInTheDocument();
    });

    it("deve exibir mensagem quando o mandato não possuir composições", () => {
        renderComponent({
            composicaoUuid: "comp-1",
            mandatoAnterior: {
                isLoading: false,
                isError: false,
                count: 0,
                data: {
                    uuid: "mandato",
                    composicoes: [],
                },
            },
        });

        expect(
            screen.queryByText("Composição Info")
        ).not.toBeInTheDocument();

        expect(
            screen.getByText(
                /não foram encontradas composições/i
            )
        ).toBeInTheDocument();

        expect(
            screen.queryByText("Paginação")
        ).not.toBeInTheDocument();

        expect(
            screen.queryByText("Cargos mandatos-anteriores")
        ).not.toBeInTheDocument();
    });
});