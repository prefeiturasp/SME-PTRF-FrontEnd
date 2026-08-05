import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Lista } from "../components/Lista";
import { useMotivosEstornoContext } from "../hooks/useMotivosEstornoContext";
import { useGetMotivosEstorno } from "../hooks/useGetMotivosEstorno";
import { usePostMotivoEstorno } from "../hooks/usePostMotivoEstorno";
import { usePatchMotivoEstorno } from "../hooks/usePatchMotivoEstorno";
import { useDeleteMotivoEstorno } from "../hooks/useDeleteMotivoEstorno";
import { toastCustom } from "../../../../../Globais/ToastCustom";

jest.mock("../hooks/useMotivosEstornoContext");
jest.mock("../hooks/useGetMotivosEstorno");
jest.mock("../hooks/usePostMotivoEstorno");
jest.mock("../hooks/usePatchMotivoEstorno");
jest.mock("../hooks/useDeleteMotivoEstorno");

jest.mock("primereact/datatable", () => ({
    DataTable: ({ value, children, paginator, rows }) => {
        const React = require("react");
        const columns = React.Children.toArray(children);

        return (
            <div data-testid="datatable" data-paginator={paginator} data-rows={rows}>
                {value.map((rowData) => (
                    <div data-testid="datatable-row" key={rowData.uuid}>
                        {columns.map((column) => (
                            <div key={column.props.field}>
                                {column.props.body
                                    ? column.props.body(rowData)
                                    : rowData[column.props.field]}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    },
}));

jest.mock("primereact/column", () => ({
    Column: () => null,
}));

jest.mock("../../../../../Globais/UI/Button", () => ({
    EditIconButton: (props) => <button type="button" {...props}>Editar</button>,
}));

jest.mock("../../../../../Globais/Mensagens/MsgImgCentralizada", () => ({
    MsgImgCentralizada: ({ texto }) => <div>{texto}</div>,
}));

jest.mock("../../../../../../utils/Loading", () => ({
    __esModule: true,
    default: () => <div data-testid="loading">Loading</div>,
}));

jest.mock("../components/ModalForm", () => ({
    __esModule: true,
    default: ({ handleSubmitFormModal }) => (
        <div data-testid="modal-form">
            <button
                type="button"
                onClick={() =>
                    handleSubmitFormModal({
                        motivo: "Novo motivo",
                        recurso_uuid: "recurso-1",
                        uuid: "",
                    })
                }
            >
                submit-create
            </button>
            <button
                type="button"
                onClick={() =>
                    handleSubmitFormModal({
                        motivo: "Motivo editado",
                        recurso_uuid: "recurso-2",
                        uuid: "motivo-1",
                    })
                }
            >
                submit-edit
            </button>
        </div>
    ),
}));

jest.mock("../../../../../Globais/ModalAntDesign/ModalConfirmarExclusao", () => ({
    ModalConfirmarExclusao: ({ open, onOk, onCancel, titulo, bodyText }) =>
        open ? (
            <div data-testid="modal-confirmacao">
                <span>{titulo}</span>
                <span>{bodyText}</span>
                <button type="button" onClick={onOk}>confirmar exclusao</button>
                <button type="button" onClick={onCancel}>cancelar exclusao</button>
            </div>
        ) : null,
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomError: jest.fn(),
    },
}));

const motivoEstorno = {
    id: 1,
    uuid: "motivo-1",
    motivo: "Motivo teste",
    recurso: "recurso-1",
};

describe("Lista", () => {
    const setStateFormModal = jest.fn();
    const handleCloseModalConfirmacaoExclusao = jest.fn();
    const mockMutationPostMutate = jest.fn();
    const mockMutationPatchMutate = jest.fn();
    const mockMutationDeleteMutate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        useMotivosEstornoContext.mockReturnValue({
            stateFormModal: {
                id: "",
                uuid: "",
                motivo: "",
                recurso_uuid: "",
                isOpen: false,
            },
            setStateFormModal,
            rowsPerPage: 10,
            showModalConfirmacaoExclusao: {
                is_open: false,
                motivo_uuid: "",
            },
            handleCloseModalConfirmacaoExclusao,
        });
        useGetMotivosEstorno.mockReturnValue({
            isLoading: false,
            data: [motivoEstorno],
            count: 1,
        });
        usePostMotivoEstorno.mockReturnValue({
            mutationPost: { mutate: mockMutationPostMutate },
        });
        usePatchMotivoEstorno.mockReturnValue({
            mutationPatch: { mutate: mockMutationPatchMutate },
        });
        useDeleteMotivoEstorno.mockReturnValue({
            mutationDelete: { mutate: mockMutationDeleteMutate },
        });
    });

    it("deve renderizar loading quando estiver carregando", () => {
        useGetMotivosEstorno.mockReturnValue({
            isLoading: true,
            data: [],
            count: 0,
        });

        render(<Lista />);

        expect(screen.getByTestId("loading")).toBeInTheDocument();
        expect(screen.queryByTestId("datatable")).not.toBeInTheDocument();
    });

    it("deve renderizar tabela quando existem motivos de estorno", () => {
        render(<Lista />);

        expect(screen.getByTestId("datatable")).toBeInTheDocument();
        expect(screen.getByText("Motivo teste")).toBeInTheDocument();
        expect(screen.getByTestId("btn-editar-motivos-estorno")).toBeInTheDocument();
        expect(screen.getByTestId("modal-form")).toBeInTheDocument();
    });

    it("deve renderizar mensagem de lista vazia quando nao existem motivos", () => {
        useGetMotivosEstorno.mockReturnValue({
            isLoading: false,
            data: [],
            count: 0,
        });

        render(<Lista />);

        expect(screen.getByText("Nenhum resultado encontrado.")).toBeInTheDocument();
        expect(screen.queryByTestId("datatable")).not.toBeInTheDocument();
    });

    it("deve abrir o modal de edicao com os dados da linha", () => {
        render(<Lista />);

        fireEvent.click(screen.getByTestId("btn-editar-motivos-estorno"));

        expect(setStateFormModal).toHaveBeenCalledWith({
            id: 1,
            uuid: "motivo-1",
            motivo: "Motivo teste",
            recurso_uuid: "recurso-1",
            isOpen: true,
        });
    });

    it("deve submeter criacao e edicao pelo modal", () => {
        render(<Lista />);

        fireEvent.click(screen.getByText("submit-create"));
        expect(mockMutationPostMutate).toHaveBeenCalledWith({
            payload: {
                motivo: "Novo motivo",
                recurso: "recurso-1",
            },
        });

        fireEvent.click(screen.getByText("submit-edit"));
        expect(mockMutationPatchMutate).toHaveBeenCalledWith({
            uuidMotivoEstorno: "motivo-1",
            payload: {
                motivo: "Motivo editado",
                recurso: "recurso-2",
            },
        });
    });

    it("deve confirmar exclusao pelo modal", () => {
        useMotivosEstornoContext.mockReturnValue({
            stateFormModal: {},
            setStateFormModal,
            rowsPerPage: 10,
            showModalConfirmacaoExclusao: {
                is_open: true,
                motivo_uuid: "motivo-1",
            },
            handleCloseModalConfirmacaoExclusao,
        });

        render(<Lista />);

        fireEvent.click(screen.getByText("confirmar exclusao"));

        expect(mockMutationDeleteMutate).toHaveBeenCalledWith("motivo-1");
        expect(handleCloseModalConfirmacaoExclusao).toHaveBeenCalled();
    });

    it("deve fechar modal de confirmacao ao cancelar exclusao", () => {
        useMotivosEstornoContext.mockReturnValue({
            stateFormModal: {},
            setStateFormModal,
            rowsPerPage: 10,
            showModalConfirmacaoExclusao: {
                is_open: true,
                motivo_uuid: "motivo-1",
            },
            handleCloseModalConfirmacaoExclusao,
        });

        render(<Lista />);

        fireEvent.click(screen.getByText("cancelar exclusao"));

        expect(handleCloseModalConfirmacaoExclusao).toHaveBeenCalled();
        expect(mockMutationDeleteMutate).not.toHaveBeenCalled();
    });

    it("deve exibir toast quando tenta excluir sem uuid", () => {
        useMotivosEstornoContext.mockReturnValue({
            stateFormModal: {},
            setStateFormModal,
            rowsPerPage: 10,
            showModalConfirmacaoExclusao: {
                is_open: true,
                motivo_uuid: "",
            },
            handleCloseModalConfirmacaoExclusao,
        });

        render(<Lista />);

        fireEvent.click(screen.getByText("confirmar exclusao"));

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Erro ao apagar o motivo de estorno",
            "Informe os campos corretamente e tente novamente.",
        );
        expect(mockMutationDeleteMutate).toHaveBeenCalledWith("");
    });
});
