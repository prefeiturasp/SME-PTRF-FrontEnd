import React from "react";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import "@testing-library/jest-dom";
import {PaginaCadastroHistoricoDeMembros} from "../PaginaCadastroHistoricoDeMembros";
import {ASSOCIACAO_UUID} from "../../../../../services/auth.service";
import {getStatusPresidenteAssociacao} from "../../../../../services/escolas/Associacao.service";
import {usePostCargoDaComposicao} from "../../hooks/usePostCargoDaComposicao";
import {useGetCargosDiretoriaExecutiva} from "../../hooks/useGetCargosDiretoriaExecutiva";
import {usePutCargoDaComposicao} from "../../hooks/usePutCargoDaComposicao";
import {usePatchStatusPresidente} from "../../hooks/usePatchStatusPresidente";

const mockDispatch = jest.fn();
const mockNavigate = jest.fn();
const mockUseLocation = jest.fn();
const mockUseParams = jest.fn();
const mockModalConfirm = jest.fn();

jest.mock("react-redux", () => ({
    useDispatch: () => mockDispatch,
}));

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useLocation: () => mockUseLocation(),
    useParams: () => mockUseParams(),
    useNavigate: () => mockNavigate,
}));

jest.mock("../../../../../paginas/PaginasContainer", () => ({
    PaginasContainer: ({children}) => <div>{children}</div>,
}));

jest.mock("../../../../Globais/Modal/ModalConfirm", () => ({
    ModalConfirm: (...args) => mockModalConfirm(...args),
}));

jest.mock("../../components/FormCadastro", () => ({
    FormCadastro: ({cargo, onSubmitForm, onInformarSaida, cargosDaDiretoriaExecutiva, responsavelPelasAtribuicoes, switchStatusPresidente}) => {
        return (
            <div>
                <h2>FormCadastro</h2>
                <div data-testid="cargo-label">{cargo?.cargo_associacao_label || ""}</div>
                <div data-testid="cargos">{cargosDaDiretoriaExecutiva.join(",")}</div>
                <div data-testid="responsavel">{responsavelPelasAtribuicoes}</div>
                <div data-testid="switch-status">{String(switchStatusPresidente)}</div>
                <button onClick={() => onSubmitForm(mockSubmitValues.current)}>Salvar</button>
                <button onClick={() => onInformarSaida({teste: "saida"}, "composicao-atual")}>Informar saída</button>
            </div>
        );
    },
}));

jest.mock("../../components/ModalInformarSaidaDoCargo", () => ({
    ModalInformarSaidaDoCargo: ({show, handleConfirm, handleClose}) => (
        <div>
            {show ? <button onClick={() => handleConfirm("2024-07-15")}>Confirmar saída</button> : null}
            <button onClick={handleClose}>Fechar</button>
        </div>
    ),
}));

jest.mock("../../../../../services/escolas/Associacao.service", () => ({
    getStatusPresidenteAssociacao: jest.fn(),
}));

jest.mock("../../hooks/usePostCargoDaComposicao", () => ({
    usePostCargoDaComposicao: jest.fn(),
}));

jest.mock("../../hooks/useGetCargosDiretoriaExecutiva", () => ({
    useGetCargosDiretoriaExecutiva: jest.fn(),
}));

jest.mock("../../hooks/usePutCargoDaComposicao", () => ({
    usePutCargoDaComposicao: jest.fn(),
}));

jest.mock("../../hooks/usePatchStatusPresidente", () => ({
    usePatchStatusPresidente: jest.fn(),
}));

const mockSubmitValues = {current: {
    nome: "Ana",
    codigo_identificacao: "123",
    cargo_educacao: "Professor",
    representacao: "",
    email: "ana@example.com",
    cpf_responsavel: "11111111111",
    telefone: "11999999999",
    cep: "01000-000",
    bairro: "Centro",
    endereco: "Rua A",
    cargo_associacao: "cargo-1",
    substituto: null,
    substituido: null,
    data_inicio_no_cargo: "2024-01-01",
    data_fim_no_cargo: "2024-12-31",
    switch_status_presidente: true,
    responsavel_pelas_atribuicoes: "",
}};

const baseCargo = {
    uuid: "",
    cargo_associacao: "cargo-1",
    cargo_associacao_label: "Cargo Teste",
};

const renderComponent = () => render(<PaginaCadastroHistoricoDeMembros />);

describe("PaginaCadastroHistoricoDeMembros", () => {
    const postMutation = {mutate: jest.fn()};
    const putMutation = {mutateAsync: jest.fn()};
    const patchMutation = {mutate: jest.fn()};

    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
        localStorage.setItem(ASSOCIACAO_UUID, "assoc-uuid");

        mockSubmitValues.current = {
            nome: "Ana",
            codigo_identificacao: "123",
            cargo_educacao: "Professor",
            representacao: "",
            email: "ana@example.com",
            cpf_responsavel: "11111111111",
            telefone: "11999999999",
            cep: "01000-000",
            bairro: "Centro",
            endereco: "Rua A",
            cargo_associacao: "cargo-1",
            substituto: null,
            substituido: null,
            data_inicio_no_cargo: "2024-01-01",
            data_fim_no_cargo: "2024-12-31",
            switch_status_presidente: true,
            responsavel_pelas_atribuicoes: "",
        };

        mockUseLocation.mockReturnValue({state: {cargo: baseCargo}});
        mockUseParams.mockReturnValue({composicaoUuid: "composicao-1"});
        mockNavigate.mockReset();
        mockDispatch.mockReset();
        mockModalConfirm.mockReset();

        getStatusPresidenteAssociacao.mockResolvedValue({status_presidente: "PRESENTE"});
        usePostCargoDaComposicao.mockReturnValue({mutationPostCargoDaComposicao: postMutation});
        useGetCargosDiretoriaExecutiva.mockReturnValue({data_cargos_diretoria_executiva: ["Cargo A", "Cargo B"]});
        usePutCargoDaComposicao.mockReturnValue({mutationPutCargoDaComposicao: putMutation});
        usePatchStatusPresidente.mockReturnValue({mutationPatchStatusPresidenteAssociacao: patchMutation});
    });

    it("deve renderizar o formulário e carregar os dados iniciais", async () => {
        renderComponent();

        expect(screen.getByRole("heading", {name: /membros/i})).toBeInTheDocument();
        expect(screen.getByText("FormCadastro")).toBeInTheDocument();

        await waitFor(() => expect(screen.getByTestId("switch-status")).toHaveTextContent("true"));
        expect(screen.getByTestId("cargo-label")).toHaveTextContent("Cargo Teste");
        expect(screen.getByTestId("cargos")).toHaveTextContent("Cargo A,Cargo B");
        expect(screen.getByTestId("responsavel")).toHaveTextContent("");
    });

    it("deve criar um novo cargo e atualizar o status do presidente", () => {
        renderComponent();

        fireEvent.click(screen.getByRole("button", {name: /salvar/i}));

        expect(postMutation.mutate).toHaveBeenCalledWith({
            payload: expect.objectContaining({
                composicao: "composicao-1",
                cargo_associacao: "cargo-1",
                data_inicio_no_cargo: "2024-01-01",
                data_fim_no_cargo: "2024-12-31",
            }),
        });

        expect(patchMutation.mutate).toHaveBeenCalledWith({
            uuidAssociacao: "assoc-uuid",
            payload: {
                status_presidente: "PRESENTE",
                cargo_substituto_presidente_ausente: null,
            },
        });
        
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("deve atualizar um cargo existente e navegar para a listagem", async () => {
        mockUseLocation.mockReturnValue({state: {cargo: {...baseCargo, uuid: "cargo-uuid"}}});
        putMutation.mutateAsync.mockResolvedValue({data: {}});

        renderComponent();

        fireEvent.click(screen.getByRole("button", {name: /salvar/i}));

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/membros-da-associacao"));
        expect(putMutation.mutateAsync).toHaveBeenCalledWith({
            uuidCargoComposicao: "cargo-uuid",
            payload: expect.objectContaining({
                composicao: "composicao-1",
                cargo_associacao: "cargo-1",
            }),
        });
        expect(patchMutation.mutate).toHaveBeenCalled();
    });

    it("deve enviar o status de presidente ausente quando o switch estiver desativado", () => {
        mockSubmitValues.current.switch_status_presidente = false;
        mockSubmitValues.current.responsavel_pelas_atribuicoes = "Titular substituto";

        renderComponent();

        fireEvent.click(screen.getByRole("button", {name: /salvar/i}));

        expect(patchMutation.mutate).toHaveBeenCalledWith({
            uuidAssociacao: "assoc-uuid",
            payload: {
                status_presidente: "AUSENTE",
                cargo_substituto_presidente_ausente: "Titular substituto",
            },
        });
    });

    it("deve informar saída e incluir um novo membro quando houver composição posterior", async () => {
        putMutation.mutateAsync.mockResolvedValue({data: {composicao_posterior: "composicao-2"}});
        mockModalConfirm.mockImplementation(({onConfirm}) => onConfirm());

        renderComponent();
        fireEvent.click(screen.getByRole("button", {name: /informar saída/i}));
        fireEvent.click(screen.getByRole("button", {name: /confirmar saída/i}));

        await waitFor(() => expect(mockModalConfirm).toHaveBeenCalled());
        expect(mockNavigate).toHaveBeenCalledWith("/cadastro-historico-de-membros/composicao-2", {
            state: {
                cargo: expect.objectContaining({
                    cargo_associacao: "cargo-1",
                    cargo_associacao_label: "Cargo Teste",
                }),
            },
        });
    });

    it("deve navegar para a listagem quando não houver composição posterior após informar saída", async () => {
        putMutation.mutateAsync.mockResolvedValue({data: {}});

        renderComponent();
        fireEvent.click(screen.getByRole("button", {name: /informar saída/i}));
        fireEvent.click(screen.getByRole("button", {name: /confirmar saída/i}));

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/membros-da-associacao"));
    });
});
