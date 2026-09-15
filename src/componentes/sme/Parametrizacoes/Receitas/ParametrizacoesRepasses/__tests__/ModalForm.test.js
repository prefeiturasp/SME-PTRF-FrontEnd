import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import { ModalForm } from "../components/ModalForm";
import { RepassesContext } from "../context/Repasse";

import { useGetTabelasPorAssociacao } from "../hooks/useGetTabelasPorAssociacao";
import { useRecursoSelecionadoContext } from "../../../../../../context/RecursoSelecionado";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";

jest.mock("../hooks/useGetTabelasPorAssociacao");
jest.mock("../../../../../../context/RecursoSelecionado");
jest.mock(
    "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes"
);

jest.mock("../../../../../Globais/ModalBootstrap", () => ({
    ModalFormBodyText: ({ show, titulo, bodyText }) => (
        show ? (
            <div>
                <h1>{titulo}</h1>
                {bodyText}
            </div>
        ) : null
    ),
}));

jest.mock("../../../../../Globais/ReactNumberFormatInput", () => ({
    ReactNumberFormatInput: ({ value, onChangeEvent, ...props }) => (
        <input
            {...props}
            value={value || ""}
            onChange={onChangeEvent}
        />
    ),
}));

jest.mock("../components/AutoCompleteAssociacoes", () => ({
    __esModule: true,
    default: ({ disabled, setFieldValue }) => (
        <input
            data-testid="autocomplete-associacao"
            disabled={disabled}
            onChange={(event) =>
                setFieldValue("associacao", event.target.value)
            }
        />
    ),
}));

jest.mock("../../../../../../context/RecursoSelecionado", () => ({
    useRecursoSelecionadoContext: jest.fn(),
}));

jest.mock("../YupSchemaRepasse", () => ({
    YupSchemaRepasse: {
        validate: jest.fn(),
    },
}));

jest.mock("../../../../../../assets/img/spinner.gif", () => "spinner.gif");

const mockSetShowModalForm = jest.fn();
const mockSetShowModalConfirmacaoExclusao = jest.fn();
const mockSetStateFormModal = jest.fn();
const mockHandleSubmitFormModal = jest.fn();

const recursos = [
    {
        uuid: "recurso-1",
        nome: "Recurso 1",
    },
    {
        uuid: "recurso-2",
        nome: "Recurso 2",
    },
];

const tabelas = {
    periodos: [
        {
            uuid: "periodo-1",
            referencia: "2025",
        },
        {
            uuid: "periodo-2",
            referencia: "2026",
        },
    ],
    status: [
        {
            id: 1,
            nome: "Ativo",
        },
        {
            id: 2,
            nome: "Inativo",
        },
    ],
};

const tabelasPorAssociacao = {
    contas_associacao: [
        {
            uuid: "conta-1",
            nome: "Conta Capital",
        },
        {
            uuid: "conta-2",
            nome: "Conta Custeio",
        },
    ],
    acoes_associacao: [
        {
            uuid: "acao-1",
            nome: "Ação 1",
        },
        {
            uuid: "acao-2",
            nome: "Ação 2",
        },
    ],
};

const stateFormModal = {
    uuid: "",
    recurso: "recurso-1",
    associacao: "associacao-1",
    nome_unidade: "EMEF Escola Teste",
    valor_capital: 1000,
    valor_custeio: 2000,
    valor_livre: 3000,
    conta_associacao: "conta-1",
    acao_associacao: "acao-1",
    periodo: "periodo-1",
    status: 1,
    realizado_capital: true,
    realizado_custeio: false,
    realizado_livre: true,
    carga_origem: "",
    id_linha_carga: "",
    id: "",
    campos_editaveis: {
        valor_capital: true,
        valor_custeio: true,
        valor_livre: true,
        campos_identificacao: true,
        campos_de_realizacao: true,
    },
};

const renderComponent = ({
    permission = true,
    state = stateFormModal,
    showModalForm = true,
    bloquearBtnSalvarForm = false,
    loadingAssociacoes = false,
    tabelasAssociacao = tabelasPorAssociacao,
} = {}) => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(
        permission
    );

    useRecursoSelecionadoContext.mockReturnValue({
        recursos,
    });

    useGetTabelasPorAssociacao.mockReturnValue({
        data: tabelasAssociacao,
        isFetching: false,
    });

    return render(
        <RepassesContext.Provider
            value={{
                filter: {
                    associacao: state.associacao,
                },
                showModalForm,
                setShowModalForm: mockSetShowModalForm,
                stateFormModal: state,
                bloquearBtnSalvarForm,
                setShowModalConfirmacaoExclusao:
                    mockSetShowModalConfirmacaoExclusao,
                setStateFormModal: mockSetStateFormModal,
                tabelas,
            }}
        >
            <ModalForm
                handleSubmitFormModal={mockHandleSubmitFormModal}
                todasAsAssociacoesAutoComplete={[]}
                loadingAssociacoes={loadingAssociacoes}
            />
        </RepassesContext.Provider>
    );
};

describe("ModalForm", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("renderização", () => {
        it("deve exibir o título de adicionar quando não existe uuid", () => {
            renderComponent();

            expect(
                screen.getByRole("heading", {
                    name: "Adicionar repasse previsto",
                })
            ).toBeInTheDocument();
        });

        it("deve exibir o título de edição quando existe uuid", () => {
            renderComponent({
                state: {
                    ...stateFormModal,
                    uuid: "repasse-1",
                },
            });

            expect(
                screen.getByRole("heading", {
                    name: "Editar repasse previsto",
                })
            ).toBeInTheDocument();
        });

        it("deve exibir os valores iniciais do formulário", () => {
            renderComponent();

            expect(screen.getByLabelText("Valor capital *")).toHaveValue(
                "1000"
            );
            expect(screen.getByLabelText("Valor custeio *")).toHaveValue(
                "2000"
            );
            expect(
                screen.getByLabelText("Valor livre aplicação *")
            ).toHaveValue("3000");

            expect(screen.getByLabelText("Conta *")).toHaveValue("conta-1");
            expect(screen.getByLabelText("Ação *")).toHaveValue("acao-1");
            expect(screen.getByLabelText("Período *")).toHaveValue(
                "periodo-1"
            );
        });

        it("deve exibir as opções de recursos disponíveis", () => {
            renderComponent();

            expect(
                screen.getByRole("option", { name: "Recurso 1" })
            ).toBeInTheDocument();

            expect(
                screen.getByRole("option", { name: "Recurso 2" })
            ).toBeInTheDocument();
        });

        it("deve exibir as opções de contas e ações da associação", () => {
            renderComponent();

            expect(
                screen.getByRole("option", { name: "Conta Capital" })
            ).toBeInTheDocument();

            expect(
                screen.getByRole("option", { name: "Conta Custeio" })
            ).toBeInTheDocument();

            expect(
                screen.getByRole("option", { name: "Ação 1" })
            ).toBeInTheDocument();

            expect(
                screen.getByRole("option", { name: "Ação 2" })
            ).toBeInTheDocument();
        });

        it("deve exibir as opções de período e status", () => {
            renderComponent();

            expect(
                screen.getByRole("option", { name: "2025" })
            ).toBeInTheDocument();

            expect(
                screen.getByRole("option", { name: "2026" })
            ).toBeInTheDocument();

            expect(
                screen.getByRole("option", { name: "Ativo" })
            ).toBeInTheDocument();

            expect(
                screen.getByRole("option", { name: "Inativo" })
            ).toBeInTheDocument();
        });
    });

    describe("modo edição", () => {
        it("deve exibir recurso desabilitado e unidade educacional somente leitura", () => {
            renderComponent({
                state: {
                    ...stateFormModal,
                    uuid: "repasse-1",
                },
            });

            const recurso = document.querySelector('[data-qa="input-recurso"]');

            expect(recurso).toBeDisabled();

            expect(
                screen.getByLabelText("Unidade Educacional *")
            ).toHaveAttribute("readonly");
        });

        it("deve exibir carga origem, ID da linha de carga e ID", () => {
            renderComponent({
                state: {
                    ...stateFormModal,
                    uuid: "repasse-1",
                    carga_origem: "Sistema",
                    id_linha_carga: "linha-123",
                    id: 456,
                },
            });

            expect(screen.getByText("Carga origem:")).toBeInTheDocument();
            expect(screen.getByText("Sistema")).toBeInTheDocument();

            expect(
                screen.getByText("ID da linha de carga:")
            ).toBeInTheDocument();
            expect(screen.getByText("linha-123")).toBeInTheDocument();

            expect(screen.getByText("ID:")).toBeInTheDocument();
            expect(screen.getByText("456")).toBeInTheDocument();
        });

        it("deve exibir o botão Salvar", () => {
            renderComponent({
                state: {
                    ...stateFormModal,
                    uuid: "repasse-1",
                },
            });

            expect(
                screen.getByRole("button", { name: "Salvar" })
            ).toBeInTheDocument();
        });

        it("deve exibir o botão Excluir", () => {
            renderComponent({
                state: {
                    ...stateFormModal,
                    uuid: "repasse-1",
                },
            });

            expect(
                screen.getByRole("button", { name: "Excluir" })
            ).toBeInTheDocument();
        });
    });

    describe("modo adicionar", () => {
        it("deve exibir o autocomplete de associação", () => {
            renderComponent();

            expect(
                screen.getByTestId("autocomplete-associacao")
            ).toBeInTheDocument();
        });

        it("deve exibir o botão Adicionar", () => {
            renderComponent();

            expect(
                screen.getByRole("button", { name: "Adicionar" })
            ).toBeInTheDocument();
        });

        it("não deve exibir o botão Excluir", () => {
            renderComponent();

            expect(
                screen.queryByRole("button", { name: "Excluir" })
            ).not.toBeInTheDocument();
        });
    });

    describe("permissões", () => {
        it("deve desabilitar os campos editáveis quando o usuário não possui permissão", () => {
            renderComponent({
                permission: false,
            });

            expect(screen.getByLabelText("Valor capital *")).toBeDisabled();

            expect(screen.getByLabelText("Valor custeio *")).toBeDisabled();

            expect(
                screen.getByLabelText("Valor livre aplicação *")
            ).toBeDisabled();

            expect(screen.getByLabelText("Conta *")).toBeDisabled();

            expect(screen.getByLabelText("Ação *")).toBeDisabled();

            expect(screen.getByLabelText("Período *")).toBeDisabled();

            expect(
                screen.getByTestId("autocomplete-associacao")
            ).toBeDisabled();
        });

        it("deve desabilitar os campos de realização quando o usuário não possui permissão", () => {
            renderComponent({ permission: false });

            const opcoesSim = screen.getAllByLabelText("Sim");
            const opcoesNao = screen.getAllByLabelText("Não");

            expect(opcoesSim[0]).toBeDisabled();
            expect(opcoesSim[1]).toBeDisabled();
            expect(opcoesSim[2]).toBeDisabled();

            expect(opcoesNao[0]).toBeDisabled();
            expect(opcoesNao[1]).toBeDisabled();
            expect(opcoesNao[2]).toBeDisabled();
        });

        it("deve desabilitar o botão Adicionar quando o usuário não possui permissão", () => {
            renderComponent({
                permission: false,
            });

            expect(
                screen.getByRole("button", { name: "Adicionar" })
            ).toBeDisabled();
        });

        it("deve desabilitar Salvar e Excluir quando o usuário não possui permissão", () => {
            renderComponent({
                permission: false,
                state: {
                    ...stateFormModal,
                    uuid: "repasse-1",
                },
            });

            expect(
                screen.getByRole("button", { name: "Salvar" })
            ).toBeDisabled();

            expect(
                screen.getByRole("button", { name: "Excluir" })
            ).toBeDisabled();
        });

        it("deve respeitar a configuração individual de campos editáveis", () => {
            renderComponent({
                state: {
                    ...stateFormModal,
                    campos_editaveis: {
                        ...stateFormModal.campos_editaveis,
                        valor_capital: false,
                        valor_custeio: false,
                        valor_livre: true,
                    },
                },
            });

            expect(
                screen.getByLabelText("Valor capital *")
            ).toBeDisabled();

            expect(
                screen.getByLabelText("Valor custeio *")
            ).toBeDisabled();

            expect(
                screen.getByLabelText("Valor livre aplicação *")
            ).not.toBeDisabled();
        });
    });

    describe("associação", () => {
        it("deve atualizar a associação ao selecionar uma nova associação", () => {
            renderComponent();

            fireEvent.change(
                screen.getByTestId("autocomplete-associacao"),
                {
                    target: {
                        value: "associacao-2",
                    },
                }
            );

            expect(mockSetStateFormModal).not.toHaveBeenCalled();

            expect(
                screen.getByTestId("autocomplete-associacao")
            ).toHaveValue("associacao-2");
        });

        it("deve desabilitar o autocomplete quando não possui permissão", () => {
            renderComponent({
                permission: false,
            });

            expect(
                screen.getByTestId("autocomplete-associacao")
            ).toBeDisabled();
        });
    });

    describe("tabelas da associação", () => {
        it("deve desabilitar conta e ação quando não existe associação", () => {
            renderComponent({
                state: {
                    ...stateFormModal,
                    associacao: "",
                },
            });

            expect(screen.getByLabelText("Conta *")).toBeDisabled();

            expect(screen.getByLabelText("Ação *")).toBeDisabled();
        });

        it("deve exibir as opções retornadas para conta e ação", () => {
            renderComponent();

            expect(
                screen.getByRole("option", {
                    name: "Conta Capital",
                })
            ).toBeInTheDocument();

            expect(
                screen.getByRole("option", {
                    name: "Ação 1",
                })
            ).toBeInTheDocument();
        });
    });

    describe("campos de realização", () => {
        it("deve marcar corretamente o valor de realizado capital", () => {
            renderComponent();

            expect(
                document.querySelector("#realizado_capital_true")
            ).toBeChecked();

            expect(
                document.querySelector("#realizado_capital_false")
            ).not.toBeChecked();
        });

        it("deve marcar corretamente o valor de realizado custeio", () => {
            renderComponent();

            expect(
                document.querySelector("#realizado_custeio_true")
            ).not.toBeChecked();

            expect(
                document.querySelector("#realizado_custeio_false")
            ).toBeChecked();
        });

        it("deve atualizar realizado capital para verdadeiro", () => {
            renderComponent({
                state: {
                    ...stateFormModal,
                    realizado_capital: false,
                },
            });

            const radios = screen.getAllByRole("radio", {
                name: "Sim",
            });

            fireEvent.click(radios[0]);

            expect(radios[0]).toBeChecked();
        });

        it("deve atualizar realizado capital para falso", () => {
            renderComponent({
                state: {
                    ...stateFormModal,
                    realizado_capital: true,
                },
            });

            const radios = screen.getAllByRole("radio", {
                name: "Não",
            });

            fireEvent.click(radios[0]);

            expect(radios[0]).toBeChecked();
        });
    });

    describe("ações do formulário", () => {
        it("deve fechar o modal ao clicar em Cancelar", () => {
            renderComponent();

            fireEvent.click(
                screen.getByRole("button", { name: "Cancelar" })
            );

            expect(mockSetShowModalForm).toHaveBeenCalledWith(false);
        });

        it("deve abrir a confirmação de exclusão ao clicar em Excluir", () => {
            renderComponent({
                state: {
                    ...stateFormModal,
                    uuid: "repasse-1",
                },
            });

            fireEvent.click(
                screen.getByRole("button", { name: "Excluir" })
            );

            expect(
                mockSetShowModalConfirmacaoExclusao
            ).toHaveBeenCalledWith(true);
        });


        it("deve manter o botão Salvar desabilitado quando bloquearBtnSalvarForm estiver ativo", () => {
            renderComponent({
                bloquearBtnSalvarForm: true,
                state: {
                    ...stateFormModal,
                    uuid: "repasse-1",
                },
            });

            expect(
                screen.getByRole("button", { name: "Salvar" })
            ).toBeDisabled();
        });
    });


    describe("status", () => {
        it("deve manter o campo Status desabilitado", () => {
            renderComponent();

            expect(screen.getByLabelText("Status")).toBeDisabled();
        });
    });
});