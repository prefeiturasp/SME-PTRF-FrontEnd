import { render, screen, fireEvent, configure } from "@testing-library/react";
import { CargosDaComposicaoList } from "../CargosDaComposicaoList";
import { MembrosDaAssociacaoContext } from "../../context/MembrosDaAssociacao";
import { useGetCargosDaComposicao } from "../../hooks/useGetCargosDaComposicao";
import { useNavigate } from "react-router-dom";

jest.mock("../../hooks/useGetCargosDaComposicao");

jest.mock("react-router-dom", () => ({
    useNavigate: jest.fn(),
}));

jest.mock("../../../../Globais/UI/Button", () => ({
    EditIconButton: ({ onClick }) => (
        <button data-qa="mock-edit-icon-button" onClick={onClick}>
            Editar
        </button>
    ),
}));

configure({ testIdAttribute: 'data-qa' });

describe("CargosDaComposicaoList", () => {
    const mockNavigate = jest.fn();

    const defaultContextValue = {
        currentPage: 1,
        composicaoUuid: "mock-composicao-uuid",
    };

    const mockData = {
        diretoria_executiva: [
            {
                uuid: "1",
                cargo_associacao_label: "Presidente",
                ocupante_do_cargo: { nome: "João Silva", representacao_label: "Empresa A" },
                substituto: false,
                substituido: false,
            },
            {
                uuid: "2",
                cargo_associacao_label: "Diretor",
                ocupante_do_cargo: { nome: "Maria Souza", representacao_label: "Empresa B" },
                substituto: true,
                tag_substituto: "Substituto Ativo",
            },
        ],
        conselho_fiscal: [
            {
                uuid: "3",
                cargo_associacao_label: "Conselheiro",
                ocupante_do_cargo: { nome: "Carlos Oliveira", representacao_label: "Empresa C" },
                substituido: true,
                tag_substituido: "Substituído",
            },
        ],
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useNavigate.mockReturnValue(mockNavigate);
    });

    const renderComponent = (props = { escopo: "mandato-vigente" }, contextValue = defaultContextValue) => {
        return render(
            <MembrosDaAssociacaoContext.Provider value={contextValue}>
                <CargosDaComposicaoList {...props} />
            </MembrosDaAssociacaoContext.Provider>
        );
    };

    it("não deve renderizar as tabelas quando estiver em estado de loading", () => {
        useGetCargosDaComposicao.mockReturnValue({ isLoading: true, data: null });
        
        renderComponent();

        expect(screen.queryByText("Diretoria executiva")).not.toBeInTheDocument();
        expect(screen.queryByText("Conselho Fiscal")).not.toBeInTheDocument();
    });

    it("deve renderizar as tabelas de diretoria e conselho corretamente com seus respectivos dados", () => {
        useGetCargosDaComposicao.mockReturnValue({ isLoading: false, data: mockData });
        
        renderComponent();

        expect(screen.getByText("Diretoria executiva")).toBeInTheDocument();
        expect(screen.getByText("Conselho Fiscal")).toBeInTheDocument();

        expect(screen.getByText("João Silva")).toBeInTheDocument();
        expect(screen.getByText("Maria Souza")).toBeInTheDocument();
        expect(screen.getByText("Carlos Oliveira")).toBeInTheDocument();
    });

    it("deve renderizar a badge de substituto quando aplicável", () => {
        useGetCargosDaComposicao.mockReturnValue({ isLoading: false, data: mockData });
        
        renderComponent();

        expect(screen.getByText("Substituto Ativo")).toBeInTheDocument();
        expect(screen.getByText("Substituto Ativo")).toHaveClass("badge-substituto");
    });

    it("deve renderizar a badge de substituído quando aplicável", () => {
        useGetCargosDaComposicao.mockReturnValue({ isLoading: false, data: mockData });
        
        renderComponent();

        expect(screen.getByText("Substituído")).toBeInTheDocument();
        expect(screen.getByText("Substituído")).toHaveClass("badge-substituido");
    });

    it("deve renderizar o EditIconButton quando currentPage for 1 e escopo for 'mandato-vigente'", () => {
        useGetCargosDaComposicao.mockReturnValue({ isLoading: false, data: mockData });
        
        renderComponent({ escopo: "mandato-vigente" }, { currentPage: 1, composicaoUuid: "uuid-123" });

        const editButtons = screen.getAllByTestId("mock-edit-icon-button");
        expect(editButtons).toHaveLength(3);

        fireEvent.click(editButtons[0]);

        expect(mockNavigate).toHaveBeenCalledWith("/cadastro-historico-de-membros/uuid-123", {
            state: { cargo: mockData.diretoria_executiva[0] },
        });
    });

    it("deve renderizar o botão de visualizar (faEye) quando currentPage não for 1", () => {
        useGetCargosDaComposicao.mockReturnValue({ isLoading: false, data: mockData });
        
        renderComponent({ escopo: "mandato-vigente" }, { currentPage: 2, composicaoUuid: "uuid-123" });

        expect(screen.queryByTestId("mock-edit-icon-button")).not.toBeInTheDocument();

        const viewButtons = screen.getAllByTestId("editar-membro")

        expect(viewButtons).toHaveLength(3);
        expect(viewButtons).toHaveLength(3);

        fireEvent.click(viewButtons[0]);

        expect(mockNavigate).toHaveBeenCalledWith("/cadastro-historico-de-membros/uuid-123", {
            state: { cargo: mockData.diretoria_executiva[0] },
        });
    });

    it("deve renderizar o botão de visualizar (faEye) quando o escopo não for 'mandato-vigente'", () => {
        useGetCargosDaComposicao.mockReturnValue({ isLoading: false, data: mockData });
        
        renderComponent({ escopo: "historico" }, { currentPage: 1, composicaoUuid: "uuid-123" });

        expect(screen.queryByTestId("mock-edit-icon-button")).not.toBeInTheDocument();
        
        const viewButtons = screen.getAllByTestId("editar-membro");
        
        expect(viewButtons).toHaveLength(3);
    });
});