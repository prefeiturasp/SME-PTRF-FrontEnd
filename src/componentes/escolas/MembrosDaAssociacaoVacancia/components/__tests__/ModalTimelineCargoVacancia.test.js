import { render, screen, fireEvent } from "@testing-library/react";
import { ModalTimelineCargoVacancia } from "../ModalTimelineCargoVacancia";
import { useGetTimelineCargoComposicaoVacancia } from "../../hooks/useGetTimelineCargoComposicaoVacancia";

jest.mock("../../hooks/useGetTimelineCargoComposicaoVacancia");

jest.mock("../../../../../hooks/Globais/useDataTemplate", () => ({
    __esModule: true,
    default: () => (_, __, value) => value,
}));

describe("ModalTimelineCargoVacancia", () => {
    const handleClose = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve exibir mensagem de carregando enquanto a timeline é buscada", () => {
        useGetTimelineCargoComposicaoVacancia.mockReturnValue({ isLoading: true, data: [] });

        render(
            <ModalTimelineCargoVacancia
                show={true}
                handleClose={handleClose}
                composicaoUuid="composicao-1"
                cargoAssociacao="PRESIDENTE_DIRETORIA_EXECUTIVA"
                cargoLabel="Presidente"
            />
        );

        expect(screen.getByText(/carregando/i)).toBeInTheDocument();
    });

    it("deve exibir mensagem de nenhum registro quando a timeline vier vazia", () => {
        useGetTimelineCargoComposicaoVacancia.mockReturnValue({ isLoading: false, data: [] });

        render(
            <ModalTimelineCargoVacancia
                show={true}
                handleClose={handleClose}
                composicaoUuid="composicao-1"
                cargoAssociacao="PRESIDENTE_DIRETORIA_EXECUTIVA"
            />
        );

        expect(screen.getByText(/nenhum registro encontrado/i)).toBeInTheDocument();
    });

    it("deve exibir o nome do ocupante e o período de cada registro ocupado", () => {
        useGetTimelineCargoComposicaoVacancia.mockReturnValue({
            isLoading: false,
            data: [
                {
                    uuid: "registro-1",
                    vago: false,
                    ocupante_do_cargo: { nome: "Maria Silva" },
                    data_inicio_no_cargo: "2026-01-01",
                    data_fim_no_cargo: "2026-06-30",
                    substituto: false,
                    substituido: false,
                },
            ],
        });

        render(
            <ModalTimelineCargoVacancia
                show={true}
                handleClose={handleClose}
                composicaoUuid="composicao-1"
                cargoAssociacao="PRESIDENTE_DIRETORIA_EXECUTIVA"
                cargoLabel="Presidente"
            />
        );

        expect(screen.getByText("Maria Silva")).toBeInTheDocument();
        expect(screen.getByText(/2026-01-01.*2026-06-30/)).toBeInTheDocument();
    });

    it("deve exibir 'Vago' para registros sem ocupante", () => {
        useGetTimelineCargoComposicaoVacancia.mockReturnValue({
            isLoading: false,
            data: [
                {
                    uuid: "registro-2",
                    vago: true,
                    ocupante_do_cargo: null,
                    data_inicio_no_cargo: "2026-07-01",
                    data_fim_no_cargo: "2026-12-31",
                    substituto: false,
                    substituido: false,
                },
            ],
        });

        render(
            <ModalTimelineCargoVacancia
                show={true}
                handleClose={handleClose}
                composicaoUuid="composicao-1"
                cargoAssociacao="PRESIDENTE_DIRETORIA_EXECUTIVA"
            />
        );

        // "Cargo Vago" aparece 2x: uma na legenda de cores e outra no próprio registro da timeline
        expect(screen.getAllByText("Cargo Vago")).toHaveLength(2);
    });

    it("deve exibir a badge de substituição direta quando o registro for substituto", () => {
        useGetTimelineCargoComposicaoVacancia.mockReturnValue({
            isLoading: false,
            data: [
                {
                    uuid: "registro-3",
                    vago: false,
                    ocupante_do_cargo: { nome: "Luis" },
                    data_inicio_no_cargo: "2026-02-01",
                    data_fim_no_cargo: "2026-12-31",
                    substituto: true,
                    substituido: false,
                },
            ],
        });

        render(
            <ModalTimelineCargoVacancia
                show={true}
                handleClose={handleClose}
                composicaoUuid="composicao-1"
                cargoAssociacao="PRESIDENTE_DIRETORIA_EXECUTIVA"
            />
        );

        expect(screen.getByText("Substituição direta")).toBeInTheDocument();
    });

    it("deve exibir a badge de substituído quando o registro tiver sido substituído", () => {
        useGetTimelineCargoComposicaoVacancia.mockReturnValue({
            isLoading: false,
            data: [
                {
                    uuid: "registro-4",
                    vago: false,
                    ocupante_do_cargo: { nome: "Pedro" },
                    data_inicio_no_cargo: "2026-01-01",
                    data_fim_no_cargo: "2026-01-31",
                    substituto: false,
                    substituido: true,
                },
            ],
        });

        render(
            <ModalTimelineCargoVacancia
                show={true}
                handleClose={handleClose}
                composicaoUuid="composicao-1"
                cargoAssociacao="PRESIDENTE_DIRETORIA_EXECUTIVA"
            />
        );

        expect(screen.getByText("Substituído")).toBeInTheDocument();
    });

    it("deve exibir o cargo no título quando cargoLabel for informado", () => {
        useGetTimelineCargoComposicaoVacancia.mockReturnValue({ isLoading: false, data: [] });

        render(
            <ModalTimelineCargoVacancia
                show={true}
                handleClose={handleClose}
                composicaoUuid="composicao-1"
                cargoAssociacao="PRESIDENTE_DIRETORIA_EXECUTIVA"
                cargoLabel="Presidente"
            />
        );

        expect(screen.getByText(/linha temporal do cargo/i)).toHaveTextContent("Presidente");
    });

    it("deve exibir a legenda com o significado de cada cor", () => {
        useGetTimelineCargoComposicaoVacancia.mockReturnValue({ isLoading: false, data: [] });

        render(
            <ModalTimelineCargoVacancia
                show={true}
                handleClose={handleClose}
                composicaoUuid="composicao-1"
                cargoAssociacao="PRESIDENTE_DIRETORIA_EXECUTIVA"
            />
        );

        expect(screen.getByText("Cargo Ocupado")).toBeInTheDocument();
        expect(screen.getByText("Cargo Vago")).toBeInTheDocument();
        expect(screen.getByText("Cargo Substituído")).toBeInTheDocument();
    });

    it("deve exibir os registros do mais antigo para o mais recente por padrão", () => {
        useGetTimelineCargoComposicaoVacancia.mockReturnValue({
            isLoading: false,
            data: [
                { uuid: "registro-1", vago: false, ocupante_do_cargo: { nome: "Pedro" }, data_inicio_no_cargo: "2026-01-01", data_fim_no_cargo: "2026-01-31", substituto: false, substituido: false },
                { uuid: "registro-2", vago: false, ocupante_do_cargo: { nome: "Luis" }, data_inicio_no_cargo: "2026-02-01", data_fim_no_cargo: "2026-12-31", substituto: false, substituido: false },
            ],
        });

        render(
            <ModalTimelineCargoVacancia
                show={true}
                handleClose={handleClose}
                composicaoUuid="composicao-1"
                cargoAssociacao="PRESIDENTE_DIRETORIA_EXECUTIVA"
            />
        );

        expect(screen.getByText(/do mais antigo para o mais recente/i)).toBeInTheDocument();

        const nomes = screen.getAllByText(/Pedro|Luis/).map((elemento) => elemento.textContent);
        expect(nomes).toEqual(["Pedro", "Luis"]);
    });

    it("deve inverter a ordem dos registros ao clicar no botão de inverter ordem", () => {
        useGetTimelineCargoComposicaoVacancia.mockReturnValue({
            isLoading: false,
            data: [
                { uuid: "registro-1", vago: false, ocupante_do_cargo: { nome: "Pedro" }, data_inicio_no_cargo: "2026-01-01", data_fim_no_cargo: "2026-01-31", substituto: false, substituido: false },
                { uuid: "registro-2", vago: false, ocupante_do_cargo: { nome: "Luis" }, data_inicio_no_cargo: "2026-02-01", data_fim_no_cargo: "2026-12-31", substituto: false, substituido: false },
            ],
        });

        render(
            <ModalTimelineCargoVacancia
                show={true}
                handleClose={handleClose}
                composicaoUuid="composicao-1"
                cargoAssociacao="PRESIDENTE_DIRETORIA_EXECUTIVA"
            />
        );

        const botaoInverter = screen.getByRole("button", { name: /caret/i });
        fireEvent.click(botaoInverter);

        expect(screen.getByText(/do mais recente para o mais antigo/i)).toBeInTheDocument();

        const nomes = screen.getAllByText(/Pedro|Luis/).map((elemento) => elemento.textContent);
        expect(nomes).toEqual(["Luis", "Pedro"]);
    });
});
