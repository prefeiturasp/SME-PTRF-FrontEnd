import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ModalForm from "../components/ModalForm";
import { useMotivosEstornoContext } from "../hooks/useMotivosEstornoContext";
import { useRecursoSelecionadoContext } from "../../../../../../context/RecursoSelecionado";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";

jest.mock("../hooks/useMotivosEstornoContext");
jest.mock("../../../../../../context/RecursoSelecionado", () => ({
    useRecursoSelecionadoContext: jest.fn(),
}));
jest.mock("../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));
jest.mock("@fortawesome/react-fontawesome", () => ({
    FontAwesomeIcon: () => <span data-testid="font-awesome-icon" />,
}));
jest.mock("../../../../../Globais/ModalBootstrap", () => ({
    ModalFormBodyText: ({ show, titulo, bodyText, onHide }) =>
        show ? (
            <div role="dialog">
                <h2>{titulo}</h2>
                <button type="button" onClick={onHide}>fechar modal</button>
                {bodyText}
            </div>
        ) : null,
}));

const baseStateFormModal = {
    id: "",
    uuid: "",
    motivo: "",
    recurso: "recurso-1",
    recurso_uuid: "recurso-1",
    isOpen: true,
};

const editStateFormModal = {
    ...baseStateFormModal,
    id: 10,
    uuid: "motivo-1",
    motivo: "Motivo existente",
};

describe("ModalForm", () => {
    const handleCloseModalForm = jest.fn();
    const handleOpenModalConfirmacaoExclusao = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        useRecursoSelecionadoContext.mockReturnValue({
            recursos: [
                { uuid: "recurso-1", nome: "PTRF" },
                { uuid: "recurso-2", nome: "PDAF" },
            ],
        });
        useMotivosEstornoContext.mockReturnValue({
            stateFormModal: baseStateFormModal,
            handleCloseModalForm,
            handleOpenModalConfirmacaoExclusao,
        });
    });

    it("deve renderizar formulario de criacao com recurso desabilitado", () => {
        const { container } = render(<ModalForm handleSubmitFormModal={jest.fn()} />);
        const selectRecurso = container.querySelector('[data-qa="input-recurso"]');

        expect(screen.getByRole("dialog")).toBeInTheDocument();
        expect(screen.getByText("Adicionar motivo")).toBeInTheDocument();
        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
        expect(selectRecurso).toHaveValue("recurso-1");
        expect(selectRecurso).toBeDisabled();
        expect(screen.getByLabelText("Nome *")).toHaveValue("");
        expect(screen.getByRole("button", { name: "Adicionar" })).toBeEnabled();
        expect(screen.queryByRole("button", { name: "Excluir" })).not.toBeInTheDocument();
    });

    it("deve renderizar formulario de edicao e abrir confirmacao de exclusao", () => {
        useMotivosEstornoContext.mockReturnValue({
            stateFormModal: editStateFormModal,
            handleCloseModalForm,
            handleOpenModalConfirmacaoExclusao,
        });

        render(<ModalForm handleSubmitFormModal={jest.fn()} />);

        expect(screen.getByText("Editar motivo")).toBeInTheDocument();
        expect(screen.getByLabelText("Nome *")).toHaveValue("Motivo existente");
        expect(screen.getByText("ID 10")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "Excluir" }));

        expect(handleOpenModalConfirmacaoExclusao).toHaveBeenCalledWith("motivo-1");
    });

    it("deve chamar handleCloseModalForm ao cancelar e ao esconder o modal", () => {
        render(<ModalForm handleSubmitFormModal={jest.fn()} />);

        fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
        fireEvent.click(screen.getByRole("button", { name: "fechar modal" }));

        expect(handleCloseModalForm).toHaveBeenCalledTimes(2);
    });

    it("deve submeter formulario valido", async () => {
        const handleSubmitFormModal = jest.fn();

        render(<ModalForm handleSubmitFormModal={handleSubmitFormModal} />);

        fireEvent.change(screen.getByLabelText("Nome *"), {
            target: { name: "motivo", value: "Novo motivo" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Adicionar" }));

        await waitFor(() =>
            expect(handleSubmitFormModal).toHaveBeenCalledWith(
                expect.objectContaining({
                    motivo: "Novo motivo",
                    recurso: "recurso-1",
                    recurso_uuid: "recurso-1",
                }),
                expect.any(Object),
            ),
        );
    });

    it("deve desabilitar acoes de edicao quando usuario nao tem permissao", () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);
        useMotivosEstornoContext.mockReturnValue({
            stateFormModal: editStateFormModal,
            handleCloseModalForm,
            handleOpenModalConfirmacaoExclusao,
        });

        render(<ModalForm handleSubmitFormModal={jest.fn()} />);

        expect(screen.getByLabelText("Nome *")).toBeDisabled();
        expect(screen.getByRole("button", { name: "Excluir" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "Cancelar" })).toBeEnabled();
    });

    it("nao deve renderizar o conteudo quando modal estiver fechado", () => {
        useMotivosEstornoContext.mockReturnValue({
            stateFormModal: {
                ...baseStateFormModal,
                isOpen: false,
            },
            handleCloseModalForm,
            handleOpenModalConfirmacaoExclusao,
        });

        render(<ModalForm handleSubmitFormModal={jest.fn()} />);

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
});
