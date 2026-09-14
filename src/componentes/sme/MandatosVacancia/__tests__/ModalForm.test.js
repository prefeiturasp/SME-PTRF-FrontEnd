import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ModalForm from "../ModalForm";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { useGetMandatoMaisRecenteVacancia } from "../hooks/useGetMandatoMaisRecenteVacancia";

jest.mock("../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

jest.mock("../hooks/useGetMandatoMaisRecenteVacancia");

const handleClose = jest.fn();
const handleSubmitModalForm = jest.fn();
const setShowModalConfirmDelete = jest.fn();

const stateFormCreate = {
    referencia_mandato: "",
    data_inicial: "",
    data_final: "",
    editavel: true,
    uuid: "",
    id: "",
    limite_min_data_inicial: null,
};

const stateFormEdit = {
    referencia_mandato: "2023 a 2025",
    data_inicial: "2023-01-01",
    data_final: "2025-12-31",
    editavel: true,
    uuid: "mandato-1",
    id: 1,
    limite_min_data_inicial: null,
};

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

const renderComponent = (props = {}) =>
    render(
        <QueryClientProvider client={queryClient}>
            <ModalForm
                show={true}
                stateFormModal={stateFormCreate}
                handleClose={handleClose}
                handleSubmitModalForm={handleSubmitModalForm}
                setShowModalConfirmDelete={setShowModalConfirmDelete}
                {...props}
            />
        </QueryClientProvider>
    );

describe("ModalForm (MandatosVacancia)", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        useGetMandatoMaisRecenteVacancia.mockReturnValue({ data: null });
        // RodapeFormsID usa Row/Col do antd, que depende de matchMedia (ausente no jsdom)
        window.matchMedia = jest.fn().mockImplementation((query) => ({
            matches: false,
            addListener: jest.fn(),
            removeListener: jest.fn(),
        }));
    });

    it("deve exibir o título de criação e o botão Adicionar quando não há uuid", () => {
        renderComponent();

        expect(screen.getByText("Adicionar período de mandato")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Adicionar" })).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Excluir" })).not.toBeInTheDocument();
    });

    it("deve exibir o título de edição e o botão Salvar/Excluir quando há uuid", () => {
        renderComponent({ stateFormModal: stateFormEdit });

        expect(screen.getByText("Editar período de mandato")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Salvar" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Excluir" })).toBeInTheDocument();
    });

    it("deve desabilitar os campos e o botão de salvar quando não houver permissão", () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);
        renderComponent();

        expect(screen.getByLabelText("Referência do mandato *")).toBeDisabled();
        expect(screen.getByRole("button", { name: "Adicionar" })).toBeDisabled();
    });

    it("deve reportar validação quando o formulário for submetido vazio", async () => {
        renderComponent();

        fireEvent.click(screen.getByRole("button", { name: "Adicionar" }));

        await waitFor(() => {
            expect(screen.getByText("Referência do mandato é obrigatório")).toBeInTheDocument();
        });
        expect(handleSubmitModalForm).not.toHaveBeenCalled();
    });

    it("deve chamar handleSubmitModalForm ao submeter o formulário preenchido", async () => {
        renderComponent();

        fireEvent.change(screen.getByLabelText("Referência do mandato *"), {
            target: { value: "2023 a 2025" },
        });
        fireEvent.change(screen.getByLabelText("Data inicial *"), { target: { value: "01/01/2023" } });
        fireEvent.change(screen.getByLabelText("Data final *"), { target: { value: "31/12/2025" } });

        fireEvent.click(screen.getByRole("button", { name: "Adicionar" }));

        await waitFor(() => {
            expect(handleSubmitModalForm).toHaveBeenCalled();
        });
    });

    it("deve chamar handleClose ao clicar em Cancelar", () => {
        renderComponent();

        fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

        expect(handleClose).toHaveBeenCalled();
    });

    it("deve chamar setShowModalConfirmDelete ao clicar em Excluir", () => {
        renderComponent({ stateFormModal: stateFormEdit });

        fireEvent.click(screen.getByRole("button", { name: "Excluir" }));

        expect(setShowModalConfirmDelete).toHaveBeenCalledWith(true);
    });

    it("não deve exibir os botões de salvar/excluir quando o mandato não for editável", () => {
        renderComponent({ stateFormModal: { ...stateFormEdit, editavel: false } });

        expect(screen.queryByRole("button", { name: "Salvar" })).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Excluir" })).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    });

    it("deve exibir o ID via RodapeFormsID quando presente", () => {
        renderComponent({ stateFormModal: stateFormEdit });

        expect(screen.getByText("ID")).toBeInTheDocument();
        expect(screen.getByText("1")).toBeInTheDocument();
    });
});
