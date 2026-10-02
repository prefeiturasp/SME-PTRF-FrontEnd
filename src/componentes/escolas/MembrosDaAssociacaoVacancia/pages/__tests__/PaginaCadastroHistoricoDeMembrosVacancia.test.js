import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PaginaCadastroHistoricoDeMembrosVacancia } from "../PaginaCadastroHistoricoDeMembrosVacancia";
import { usePostCargoComposicaoVacancia } from "../../hooks/usePostCargoComposicaoVacancia";
import { useEditarOcupanteCargoComposicaoVacancia } from "../../hooks/useEditarOcupanteCargoComposicaoVacancia";
import { useRegistrarSaidaCargoComposicaoVacancia } from "../../hooks/useRegistrarSaidaCargoComposicaoVacancia";
import { useCancelarSaidaCargoComposicaoVacancia } from "../../hooks/useCancelarSaidaCargoComposicaoVacancia";
import { useCancelarEntradaCargoComposicaoVacancia } from "../../hooks/useCancelarEntradaCargoComposicaoVacancia";
import { useGetMandatoVigente } from "../../hooks/useGetMandatoVigente";
import { getCargosDaComposicaoVacancia } from "../../../../../services/MandatosVacancia.service";
import { toastCustom } from "../../../../Globais/ToastCustom";

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
        onCancelarSaida, onCancelarEntrada,
    }) => (
        <div>
            <h2>FormCadastroVacancia</h2>
            <div data-testid="cargo-label">{cargo?.cargo_associacao_label || ""}</div>
            <div data-testid="mandato-inicial">{mandato?.data_inicial || ""}</div>
            <div data-testid="eh-edicao">{String(cargo?.cargo_vago === false)}</div>
            <div data-testid="ocupante-vigente">{String(cargo?.ocupante_vigente)}</div>
            <div data-testid="pode-cancelar-saida">{String(cargo?.pode_cancelar_saida)}</div>
            <div data-testid="pode-cancelar-entrada">{String(cargo?.pode_cancelar_entrada)}</div>
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

jest.mock("../../components/ModalIncluirNovoMembroVacancia", () => ({
    ModalIncluirNovoMembroVacancia: ({ show, handleConfirm, handleClose }) => (
        show ? (
            <div>
                <button onClick={handleClose}>Não incluir</button>
                <button onClick={handleConfirm}>Incluir novo membro</button>
            </div>
        ) : null
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

jest.mock("../../../../../services/MandatosVacancia.service", () => ({
    getCargosDaComposicaoVacancia: jest.fn(),
}));

jest.mock("../../../../Globais/ToastCustom", () => ({
    toastCustom: { ToastCustomError: jest.fn() },
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
    pode_cancelar_entrada: false,
    pode_cancelar_saida: false,
};

const baseCargoOcupado = {
    ...baseCargoVago,
    uuid: "cargo-uuid",
    cargo_vago: false,
    cargo_vago_vigente: false,
    ocupante_vigente: true,
    pode_cancelar_entrada: true,
    pode_cancelar_saida: false,
};

// registro do TESOUREIRO no board atual (GET /cargos-da-composicao/), já vago e vigente
// logo após a saída - é o que o backend efetivamente monta, com data_inicio_no_cargo
// correspondente ao início do vago aberto, não ao início do mandato.
const cargoVagoVigenteDoBoard = {
    uuid: "",
    cargo_associacao: "TESOUREIRO",
    cargo_associacao_label: "Tesoureiro",
    data_inicio_no_cargo: "2026-07-15",
    cargo_vago: true,
    cargo_vago_vigente: true,
    ocupante_vigente: false,
    substituido: false,
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

        getCargosDaComposicaoVacancia.mockResolvedValue({
            diretoria_executiva: [cargoVagoVigenteDoBoard],
            conselho_fiscal: [],
        });
    });

    it("deve renderizar o formulário passando cargo e mandato", () => {
        renderComponent();

        expect(screen.getByRole("heading", { name: /membros/i })).toBeInTheDocument();
        expect(screen.getByText("FormCadastroVacancia")).toBeInTheDocument();
        expect(screen.getByTestId("cargo-label")).toHaveTextContent("Tesoureiro");
        expect(screen.getByTestId("mandato-inicial")).toHaveTextContent("2026-01-01");
    });

    it("deve repassar ehEdicao=false e pode_cancelar_entrada/saida=false para um cargo vago", () => {
        renderComponent();

        expect(screen.getByTestId("eh-edicao")).toHaveTextContent("false");
        expect(screen.getByTestId("pode-cancelar-entrada")).toHaveTextContent("false");
        expect(screen.getByTestId("pode-cancelar-saida")).toHaveTextContent("false");
    });

    it("deve repassar ehEdicao=true, ocupanteVigente=true e pode_cancelar_entrada=true vindos do cargo para um cargo ocupado e vigente", () => {
        mockUseLocation.mockReturnValue({ state: { cargo: baseCargoOcupado } });

        renderComponent();

        expect(screen.getByTestId("eh-edicao")).toHaveTextContent("true");
        expect(screen.getByTestId("ocupante-vigente")).toHaveTextContent("true");
        expect(screen.getByTestId("pode-cancelar-entrada")).toHaveTextContent("true");
        expect(screen.getByTestId("pode-cancelar-saida")).toHaveTextContent("false");
    });

    it("deve repassar pode_cancelar_saida=true vindo do cargo para um cargo já saído sem sucessor", () => {
        mockUseLocation.mockReturnValue({
            state: {
                cargo: {
                    ...baseCargoOcupado,
                    ocupante_vigente: false,
                    substituido: false,
                    pode_cancelar_entrada: false,
                    pode_cancelar_saida: true,
                },
            },
        });

        renderComponent();

        expect(screen.getByTestId("pode-cancelar-saida")).toHaveTextContent("true");
        expect(screen.getByTestId("pode-cancelar-entrada")).toHaveTextContent("false");
    });

    it("deve repassar pode_cancelar_saida=false vindo do cargo quando já existe sucessor", () => {
        mockUseLocation.mockReturnValue({
            state: {
                cargo: {
                    ...baseCargoOcupado,
                    ocupante_vigente: false,
                    substituido: true,
                    pode_cancelar_saida: false,
                },
            },
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

    it("deve registrar a saída e abrir o modal de incluir novo membro ao confirmar", () => {
        mockUseLocation.mockReturnValue({ state: { cargo: baseCargoOcupado } });
        registrarSaidaMutation.mutate.mockImplementation((_, { onSuccess }) => onSuccess());

        renderComponent();

        fireEvent.click(screen.getByRole("button", { name: /informar saída/i }));
        fireEvent.click(screen.getByRole("button", { name: /confirmar saída/i }));

        expect(registrarSaidaMutation.mutate).toHaveBeenCalledWith(
            { uuid: "cargo-uuid", data_saida: "2026-07-15" },
            expect.objectContaining({ onSuccess: expect.any(Function) })
        );
        // não navega direto: primeiro pergunta se quer incluir um novo membro no cargo
        expect(mockNavigate).not.toHaveBeenCalled();
        expect(screen.getByRole("button", { name: /incluir novo membro/i })).toBeInTheDocument();
        // o modal de informar saída fecha ao abrir o de incluir novo membro
        expect(screen.queryByRole("button", { name: /confirmar saída/i })).not.toBeInTheDocument();
    });

    it("deve navegar para a listagem ao optar por não incluir um novo membro", () => {
        mockUseLocation.mockReturnValue({ state: { cargo: baseCargoOcupado } });
        registrarSaidaMutation.mutate.mockImplementation((_, { onSuccess }) => onSuccess());

        renderComponent();

        fireEvent.click(screen.getByRole("button", { name: /informar saída/i }));
        fireEvent.click(screen.getByRole("button", { name: /confirmar saída/i }));
        fireEvent.click(screen.getByRole("button", { name: /não incluir/i }));

        expect(mockNavigate).toHaveBeenCalledWith("/membros-da-associacao");
    });

    it("deve buscar o board atual e navegar com o registro vago vigente do cargo ao optar por incluir um novo membro", async () => {
        mockUseLocation.mockReturnValue({ state: { cargo: baseCargoOcupado } });
        registrarSaidaMutation.mutate.mockImplementation((_, { onSuccess }) => onSuccess());

        renderComponent();

        fireEvent.click(screen.getByRole("button", { name: /informar saída/i }));
        fireEvent.click(screen.getByRole("button", { name: /confirmar saída/i }));
        fireEvent.click(screen.getByRole("button", { name: /incluir novo membro/i }));

        await waitFor(() => expect(mockNavigate).toHaveBeenCalled());

        // busca no mesmo endpoint/data (hoje) que a listagem usa, pra achar o vago vigente
        expect(getCargosDaComposicaoVacancia).toHaveBeenCalledWith(
            "composicao-1",
            expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/)
        );
        expect(mockNavigate).toHaveBeenCalledWith(
            "/cadastro-historico-de-membros-vacancia/composicao-1",
            { state: { cargo: cargoVagoVigenteDoBoard } }
        );
    });

    it("deve mostrar toast de erro e voltar pra listagem (sem abrir o formulário) se a busca do board falhar", async () => {
        mockUseLocation.mockReturnValue({ state: { cargo: baseCargoOcupado } });
        registrarSaidaMutation.mutate.mockImplementation((_, { onSuccess }) => onSuccess());
        getCargosDaComposicaoVacancia.mockRejectedValueOnce(new Error("Network Error"));

        renderComponent();

        fireEvent.click(screen.getByRole("button", { name: /informar saída/i }));
        fireEvent.click(screen.getByRole("button", { name: /confirmar saída/i }));
        fireEvent.click(screen.getByRole("button", { name: /incluir novo membro/i }));

        await waitFor(() => expect(mockNavigate).toHaveBeenCalled());

        expect(toastCustom.ToastCustomError).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith("/membros-da-associacao");
    });

    it("deve mostrar toast de erro e voltar pra listagem (sem abrir o formulário) se o cargo não estiver mais vago vigente", async () => {
        mockUseLocation.mockReturnValue({ state: { cargo: baseCargoOcupado } });
        registrarSaidaMutation.mutate.mockImplementation((_, { onSuccess }) => onSuccess());
        // outra pessoa já preencheu o cargo (ou o board não retorna mais o registro vago)
        getCargosDaComposicaoVacancia.mockResolvedValueOnce({
            diretoria_executiva: [{ ...cargoVagoVigenteDoBoard, cargo_vago: false, cargo_vago_vigente: false }],
            conselho_fiscal: [],
        });

        renderComponent();

        fireEvent.click(screen.getByRole("button", { name: /informar saída/i }));
        fireEvent.click(screen.getByRole("button", { name: /confirmar saída/i }));
        fireEvent.click(screen.getByRole("button", { name: /incluir novo membro/i }));

        await waitFor(() => expect(mockNavigate).toHaveBeenCalled());

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Não foi possível incluir um novo membro.",
            expect.any(String)
        );
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
