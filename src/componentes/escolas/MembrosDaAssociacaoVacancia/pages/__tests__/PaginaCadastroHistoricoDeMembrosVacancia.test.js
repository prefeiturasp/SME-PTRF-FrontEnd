import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PaginaCadastroHistoricoDeMembrosVacancia } from "../PaginaCadastroHistoricoDeMembrosVacancia";
import { usePostCargoComposicaoVacancia } from "../../hooks/usePostCargoComposicaoVacancia";
import { useEditarOcupanteCargoComposicaoVacancia } from "../../hooks/useEditarOcupanteCargoComposicaoVacancia";
import { useRegistrarSaidaCargoComposicaoVacancia } from "../../hooks/useRegistrarSaidaCargoComposicaoVacancia";
import { useCancelarSaidaCargoComposicaoVacancia } from "../../hooks/useCancelarSaidaCargoComposicaoVacancia";
import { useCancelarEntradaCargoComposicaoVacancia } from "../../hooks/useCancelarEntradaCargoComposicaoVacancia";
import { useGetMandatoVigente } from "../../hooks/useGetMandatoVigente";

const mockNavigate = jest.fn();
const mockUseLocation = jest.fn();
const mockUseParams = jest.fn();

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useLocation: () => mockUseLocation(),
    useParams: () => mockUseParams(),
    useNavigate: () => mockNavigate,
}));

jest.mock("../../../../../paginas/PaginasContainer", () => ({
    PaginasContainer: ({ children }) => <div>{children}</div>,
}));

jest.mock("../../components/FormCadastroVacancia", () => ({
    FormCadastroVacancia: ({
        cargo, mandato, onSubmitForm, onInformarSaida,
        ehEdicao, ocupanteVigente,
        podeCancelarSaida, onCancelarSaida,
        podeCancelarEntrada, onCancelarEntrada,
    }) => (
        <div>
            <h2>FormCadastroVacancia</h2>
            <div data-testid="cargo-label">{cargo?.cargo_associacao_label || ""}</div>
            <div data-testid="mandato-inicial">{mandato?.data_inicial || ""}</div>
            <div data-testid="eh-edicao">{String(ehEdicao)}</div>
            <div data-testid="ocupante-vigente">{String(ocupanteVigente)}</div>
            <div data-testid="pode-cancelar-saida">{String(podeCancelarSaida)}</div>
            <div data-testid="pode-cancelar-entrada">{String(podeCancelarEntrada)}</div>
            <button onClick={() => onSubmitForm(mockSubmitValues.current)}>Salvar</button>
            <button onClick={onInformarSaida}>Informar saída</button>
            <button onClick={onCancelarSaida}>Cancelar Ocupante</button>
            <button onClick={onCancelarEntrada}>Cancelar Entrada</button>
        </div>
    ),
}));

jest.mock("../../components/ModalInformarSaidaCargoVacancia", () => ({
    ModalInformarSaidaCargoVacancia: ({ show, handleConfirm, handleClose }) => (
        <div>
            {show ? <button onClick={() => handleConfirm("2026-07-15")}>Confirmar saída</button> : null}
            <button onClick={handleClose}>Fechar</button>
        </div>
    ),
}));

jest.mock("../../hooks/usePostCargoComposicaoVacancia", () => ({
    usePostCargoComposicaoVacancia: jest.fn(),
}));

jest.mock("../../hooks/useEditarOcupanteCargoComposicaoVacancia", () => ({
    useEditarOcupanteCargoComposicaoVacancia: jest.fn(),
}));

jest.mock("../../hooks/useRegistrarSaidaCargoComposicaoVacancia", () => ({
    useRegistrarSaidaCargoComposicaoVacancia: jest.fn(),
}));

jest.mock("../../hooks/useCancelarSaidaCargoComposicaoVacancia", () => ({
    useCancelarSaidaCargoComposicaoVacancia: jest.fn(),
}));

jest.mock("../../hooks/useCancelarEntradaCargoComposicaoVacancia", () => ({
    useCancelarEntradaCargoComposicaoVacancia: jest.fn(),
}));

jest.mock("../../hooks/useGetMandatoVigente", () => ({
    useGetMandatoVigente: jest.fn(),
}));

const mockSubmitValues = { current: {} };

const baseCargoVago = {
    uuid: "",
    cargo_associacao: "TESOUREIRO",
    cargo_associacao_label: "Tesoureiro",
    data_inicio_no_cargo: "2026-01-01",
    cargo_vago: true,
    cargo_vago_vigente: true,
    ocupante_vigente: false,
    substituido: false,
};

const baseCargoOcupado = {
    ...baseCargoVago,
    uuid: "cargo-uuid",
    cargo_vago: false,
    cargo_vago_vigente: false,
    ocupante_vigente: true,
};

const renderComponent = () => render(<PaginaCadastroHistoricoDeMembrosVacancia />);

describe("PaginaCadastroHistoricoDeMembrosVacancia", () => {
    const postMutation = { mutate: jest.fn() };
    const editarMutation = { mutate: jest.fn() };
    const registrarSaidaMutation = { mutate: jest.fn() };
    const cancelarSaidaMutation = { mutate: jest.fn() };
    const cancelarEntradaMutation = { mutate: jest.fn() };

    beforeEach(() => {
        jest.clearAllMocks();

        mockSubmitValues.current = {
            nome: "Ana",
            codigo_identificacao: "123",
            cargo_educacao: "Professor",
            representacao: "SERVIDOR",
            email: "ana@example.com",
            cpf_responsavel: "",
            telefone: "11999999999",
            cep: "01000-000",
            bairro: "Centro",
            endereco: "Rua A",
            cargo_associacao: "TESOUREIRO",
            data_inicio_no_cargo: "2026-01-01",
        };

        mockUseLocation.mockReturnValue({ state: { cargo: baseCargoVago } });
        mockUseParams.mockReturnValue({ composicaoUuid: "composicao-1" });
        mockNavigate.mockReset();

        usePostCargoComposicaoVacancia.mockReturnValue({ mutationPostCargoComposicaoVacancia: postMutation });
        useEditarOcupanteCargoComposicaoVacancia.mockReturnValue({ mutationEditarOcupanteCargoComposicaoVacancia: editarMutation });
        useRegistrarSaidaCargoComposicaoVacancia.mockReturnValue({ mutationRegistrarSaidaCargoComposicaoVacancia: registrarSaidaMutation });
        useCancelarSaidaCargoComposicaoVacancia.mockReturnValue({ mutationCancelarSaidaCargoComposicaoVacancia: cancelarSaidaMutation });
        useCancelarEntradaCargoComposicaoVacancia.mockReturnValue({ mutationCancelarEntradaCargoComposicaoVacancia: cancelarEntradaMutation });
        useGetMandatoVigente.mockReturnValue({ data: { data_inicial: "2026-01-01", data_final: "2026-12-31" } });
    });

    it("deve renderizar o formulário passando cargo e mandato", () => {
        renderComponent();

        expect(screen.getByRole("heading", { name: /membros/i })).toBeInTheDocument();
        expect(screen.getByText("FormCadastroVacancia")).toBeInTheDocument();
        expect(screen.getByTestId("cargo-label")).toHaveTextContent("Tesoureiro");
        expect(screen.getByTestId("mandato-inicial")).toHaveTextContent("2026-01-01");
    });

    it("deve calcular ehEdicao=false e podeCancelarEntrada=false para um cargo vago", () => {
        renderComponent();

        expect(screen.getByTestId("eh-edicao")).toHaveTextContent("false");
        expect(screen.getByTestId("pode-cancelar-entrada")).toHaveTextContent("false");
        expect(screen.getByTestId("pode-cancelar-saida")).toHaveTextContent("false");
    });

    it("deve calcular ehEdicao=true, ocupanteVigente=true e podeCancelarEntrada=true para um cargo ocupado e vigente", () => {
        mockUseLocation.mockReturnValue({ state: { cargo: baseCargoOcupado } });

        renderComponent();

        expect(screen.getByTestId("eh-edicao")).toHaveTextContent("true");
        expect(screen.getByTestId("ocupante-vigente")).toHaveTextContent("true");
        expect(screen.getByTestId("pode-cancelar-entrada")).toHaveTextContent("true");
        expect(screen.getByTestId("pode-cancelar-saida")).toHaveTextContent("false");
    });

    it("deve calcular podeCancelarOcupante=true para um cargo já saído sem sucessor", () => {
        mockUseLocation.mockReturnValue({
            state: { cargo: { ...baseCargoOcupado, ocupante_vigente: false, substituido: false } },
        });

        renderComponent();

        expect(screen.getByTestId("pode-cancelar-saida")).toHaveTextContent("true");
        expect(screen.getByTestId("pode-cancelar-entrada")).toHaveTextContent("false");
    });

    it("não deve calcular podeCancelarOcupante=true quando já existe sucessor", () => {
        mockUseLocation.mockReturnValue({
            state: { cargo: { ...baseCargoOcupado, ocupante_vigente: false, substituido: true } },
        });

        renderComponent();

        expect(screen.getByTestId("pode-cancelar-saida")).toHaveTextContent("false");
    });

    it("deve criar um novo cargo com o payload correto", () => {
        renderComponent();

        fireEvent.click(screen.getByRole("button", { name: /salvar/i }));

        expect(postMutation.mutate).toHaveBeenCalledWith(
            {
                payload: expect.objectContaining({
                    composicao: "composicao-1",
                    cargo_associacao: "TESOUREIRO",
                    data_inicio_no_cargo: "2026-01-01",
                    ocupante_do_cargo: expect.objectContaining({ nome: "Ana" }),
                }),
            },
            expect.objectContaining({ onSuccess: expect.any(Function) })
        );
        expect(editarMutation.mutate).not.toHaveBeenCalled();
    });

    it("deve editar um cargo existente e navegar para a listagem ao concluir", () => {
        mockUseLocation.mockReturnValue({ state: { cargo: baseCargoOcupado } });
        editarMutation.mutate.mockImplementation((_, { onSuccess }) => onSuccess());

        renderComponent();

        fireEvent.click(screen.getByRole("button", { name: /salvar/i }));

        expect(editarMutation.mutate).toHaveBeenCalledWith(
            {
                uuid: "cargo-uuid",
                payload: { ocupante_do_cargo: expect.objectContaining({ nome: "Ana" }) },
            },
            expect.objectContaining({ onSuccess: expect.any(Function) })
        );
        expect(postMutation.mutate).not.toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith("/membros-da-associacao", { state: { marcoSelecionado: undefined } });
    });

    it("deve preservar o marco de origem ao voltar para a listagem após editar", () => {
        mockUseLocation.mockReturnValue({
            state: { cargo: baseCargoOcupado, marcoSelecionado: "2026-03-15" },
        });
        editarMutation.mutate.mockImplementation((_, { onSuccess }) => onSuccess());

        renderComponent();

        fireEvent.click(screen.getByRole("button", { name: /salvar/i }));

        expect(mockNavigate).toHaveBeenCalledWith("/membros-da-associacao", { state: { marcoSelecionado: "2026-03-15" } });
    });

    it("deve abrir o modal de informar saída ao clicar no botão", () => {
        renderComponent();

        fireEvent.click(screen.getByRole("button", { name: /informar saída/i }));

        expect(screen.getByRole("button", { name: /confirmar saída/i })).toBeInTheDocument();
    });

    it("deve registrar a saída e navegar para a listagem ao confirmar", () => {
        mockUseLocation.mockReturnValue({ state: { cargo: baseCargoOcupado } });
        registrarSaidaMutation.mutate.mockImplementation((_, { onSuccess }) => onSuccess());

        renderComponent();

        fireEvent.click(screen.getByRole("button", { name: /informar saída/i }));
        fireEvent.click(screen.getByRole("button", { name: /confirmar saída/i }));

        expect(registrarSaidaMutation.mutate).toHaveBeenCalledWith(
            { uuid: "cargo-uuid", data_saida: "2026-07-15" },
            expect.objectContaining({ onSuccess: expect.any(Function) })
        );
        // registrar saída altera a timeline do cargo - sempre volta pro padrão, sem preservar marco
        expect(mockNavigate).toHaveBeenCalledWith("/membros-da-associacao");
    });

    it("deve cancelar o ocupante (reverter saída) e navegar para a listagem ao concluir", () => {
        mockUseLocation.mockReturnValue({ state: { cargo: baseCargoOcupado } });
        cancelarSaidaMutation.mutate.mockImplementation((_, { onSuccess }) => onSuccess());

        renderComponent();

        fireEvent.click(screen.getByRole("button", { name: /cancelar ocupante/i }));

        expect(cancelarSaidaMutation.mutate).toHaveBeenCalledWith(
            { uuid: "cargo-uuid" },
            expect.objectContaining({ onSuccess: expect.any(Function) })
        );
        // cancelar saída altera a timeline do cargo - sempre volta pro padrão, sem preservar marco
        expect(mockNavigate).toHaveBeenCalledWith("/membros-da-associacao");
    });

    it("deve cancelar a entrada e navegar para a listagem ao concluir", () => {
        mockUseLocation.mockReturnValue({ state: { cargo: baseCargoOcupado } });
        cancelarEntradaMutation.mutate.mockImplementation((_, { onSuccess }) => onSuccess());

        renderComponent();

        fireEvent.click(screen.getByRole("button", { name: /cancelar entrada/i }));

        expect(cancelarEntradaMutation.mutate).toHaveBeenCalledWith(
            { uuid: "cargo-uuid" },
            expect.objectContaining({ onSuccess: expect.any(Function) })
        );
        // cancelar entrada altera a timeline do cargo - sempre volta pro padrão, sem preservar marco
        expect(mockNavigate).toHaveBeenCalledWith("/membros-da-associacao");
    });

    it("deve criar um novo cargo e navegar para a listagem ao concluir, sem preservar o marco", () => {
        mockUseLocation.mockReturnValue({
            state: { cargo: baseCargoVago, marcoSelecionado: "2026-03-15" },
        });
        postMutation.mutate.mockImplementation((_, { onSuccess }) => onSuccess());

        renderComponent();

        fireEvent.click(screen.getByRole("button", { name: /salvar/i }));

        // criar uma entrada nova também altera a timeline - sempre volta pro padrão
        expect(mockNavigate).toHaveBeenCalledWith("/membros-da-associacao");
    });
});
