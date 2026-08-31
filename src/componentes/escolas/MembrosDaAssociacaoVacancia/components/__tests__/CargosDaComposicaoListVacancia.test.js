import { render, screen, fireEvent, configure } from "@testing-library/react";
import { CargosDaComposicaoListVacancia } from "../CargosDaComposicaoListVacancia";
import { useGetCargosDaComposicaoVacancia } from "../../hooks/useGetCargosDaComposicaoVacancia";
import { useNavigate } from "react-router-dom";

jest.mock("../../hooks/useGetCargosDaComposicaoVacancia");

jest.mock("react-router-dom", () => ({
    useNavigate: jest.fn(),
}));

jest.mock("../../../../Globais/UI/Button", () => ({
    EditIconButton: ({ onClick }) => (
        <button data-qa="mock-edit-icon-button" onClick={onClick}>
            Editar
        </button>
    ),
    TimelineIconButton: ({ onClick }) => (
        <button data-qa="mock-timeline-icon-button" onClick={onClick}>
            Visualizar
        </button>
    ),
}));

jest.mock("../ModalTimelineCargoVacancia", () => ({
    ModalTimelineCargoVacancia: ({ show, composicaoUuid, cargoAssociacao, cargoLabel }) => (
        show ? (
            <div data-qa="mock-modal-timeline">
                {composicaoUuid} - {cargoAssociacao} - {cargoLabel}
            </div>
        ) : null
    ),
}));

configure({ testIdAttribute: 'data-qa' });

describe("CargosDaComposicaoListVacancia", () => {
    const mockNavigate = jest.fn();

    const mockData = {
        diretoria_executiva: [
            {
                uuid: "1",
                cargo_associacao_label: "Presidente",
                ocupante_do_cargo: { nome: "João Silva", representacao_label: "Servidor" },
                substituto: false,
                substituido: false,
            },
            {
                uuid: "2",
                cargo_associacao: "TESOUREIRO",
                cargo_associacao_label: "Tesoureiro",
                ocupante_do_cargo: { nome: "Maria Souza", representacao_label: "Servidor" },
                substituto: true,
                tag_substituto: "Novo membro em 01/02/2026",
            },
        ],
        conselho_fiscal: [
            {
                uuid: "3",
                cargo_associacao_label: "Conselheiro",
                ocupante_do_cargo: { nome: "Carlos Oliveira", representacao_label: "Servidor" },
                substituido: true,
                tag_substituido: "Substituído em 01/02/2026",
            },
        ],
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useNavigate.mockReturnValue(mockNavigate);
    });

    it("não deve renderizar as tabelas quando estiver em estado de loading", () => {
        useGetCargosDaComposicaoVacancia.mockReturnValue({ isLoading: true, data: null });

        render(<CargosDaComposicaoListVacancia composicaoUuid="composicao-1" />);

        expect(screen.queryByText("Diretoria executiva")).not.toBeInTheDocument();
        expect(screen.queryByText("Conselho Fiscal")).not.toBeInTheDocument();
    });

    it("deve renderizar as tabelas de diretoria e conselho corretamente com seus respectivos dados", () => {
        useGetCargosDaComposicaoVacancia.mockReturnValue({ isLoading: false, data: mockData });

        render(<CargosDaComposicaoListVacancia composicaoUuid="composicao-1" />);

        expect(screen.getByText("Diretoria executiva")).toBeInTheDocument();
        expect(screen.getByText("Conselho Fiscal")).toBeInTheDocument();
        expect(screen.getByText("João Silva")).toBeInTheDocument();
        expect(screen.getByText("Maria Souza")).toBeInTheDocument();
        expect(screen.getByText("Carlos Oliveira")).toBeInTheDocument();
    });

    it("deve renderizar a badge de substituto quando aplicável", () => {
        useGetCargosDaComposicaoVacancia.mockReturnValue({ isLoading: false, data: mockData });

        render(<CargosDaComposicaoListVacancia composicaoUuid="composicao-1" />);

        expect(screen.getByText("Novo membro em 01/02/2026")).toHaveClass("badge-substituto");
    });

    it("deve renderizar a badge de substituído quando aplicável", () => {
        useGetCargosDaComposicaoVacancia.mockReturnValue({ isLoading: false, data: mockData });

        render(<CargosDaComposicaoListVacancia composicaoUuid="composicao-1" />);

        expect(screen.getByText("Substituído em 01/02/2026")).toHaveClass("badge-substituido");
    });

    it("deve buscar os cargos usando o composicaoUuid recebido por prop, sem data de referência", () => {
        useGetCargosDaComposicaoVacancia.mockReturnValue({ isLoading: false, data: mockData });

        render(<CargosDaComposicaoListVacancia composicaoUuid="composicao-xyz" />);

        expect(useGetCargosDaComposicaoVacancia).toHaveBeenCalledWith("composicao-xyz", undefined);
    });

    it("deve repassar a data de referência recebida por prop pro hook", () => {
        useGetCargosDaComposicaoVacancia.mockReturnValue({ isLoading: false, data: mockData });

        render(<CargosDaComposicaoListVacancia composicaoUuid="composicao-xyz" data="2026-03-15" />);

        expect(useGetCargosDaComposicaoVacancia).toHaveBeenCalledWith("composicao-xyz", "2026-03-15");
    });

    it("deve renderizar o EditIconButton quando a composição for a vigente e navegar pra rota de cadastro v2 ao clicar", () => {
        useGetCargosDaComposicaoVacancia.mockReturnValue({ isLoading: false, data: mockData });

        render(<CargosDaComposicaoListVacancia composicaoUuid="uuid-123" />);

        const editButtons = screen.getAllByTestId("mock-edit-icon-button");
        expect(editButtons).toHaveLength(3);

        fireEvent.click(editButtons[0]);

        expect(mockNavigate).toHaveBeenCalledWith(
            "/cadastro-historico-de-membros-vacancia/uuid-123",
            { state: { cargo: mockData.diretoria_executiva[0] } }
        );
    });

    it("não deve renderizar o EditIconButton quando a composição não for a vigente (mandato anterior)", () => {
        const mockDataMandatoAnterior = {
            diretoria_executiva: [
                { ...mockData.diretoria_executiva[0], eh_composicao_vigente: false },
            ],
        };
        useGetCargosDaComposicaoVacancia.mockReturnValue({ isLoading: false, data: mockDataMandatoAnterior });

        render(<CargosDaComposicaoListVacancia composicaoUuid="uuid-123" />);

        expect(screen.queryByTestId("mock-edit-icon-button")).not.toBeInTheDocument();
        expect(screen.getByTestId("mock-timeline-icon-button")).toBeInTheDocument();
    });

    it("deve abrir a modal de timeline do cargo ao clicar no botão de visualizar", () => {
        useGetCargosDaComposicaoVacancia.mockReturnValue({ isLoading: false, data: mockData });

        render(<CargosDaComposicaoListVacancia composicaoUuid="composicao-1" />);

        expect(screen.queryByTestId("mock-modal-timeline")).not.toBeInTheDocument();

        const timelineButtons = screen.getAllByTestId("mock-timeline-icon-button");
        expect(timelineButtons).toHaveLength(3);

        fireEvent.click(timelineButtons[1]);

        expect(screen.getByTestId("mock-modal-timeline")).toHaveTextContent(
            "composicao-1 - TESOUREIRO - Tesoureiro"
        );
    });
});
