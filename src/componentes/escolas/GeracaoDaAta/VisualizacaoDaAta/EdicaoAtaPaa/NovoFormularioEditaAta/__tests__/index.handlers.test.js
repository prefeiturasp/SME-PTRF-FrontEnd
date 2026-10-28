import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { NovoFormularioEditaAta } from "../index";

import {
    getParticipantesOrdenadosPorCargoPaa,
    getListaPresentesPadraoPaa,
} from "../../../../../../../services/escolas/PresentesAtaPaa.service";
import { getCargosComposicaoVacanciaPorDataEAssociacao } from "../../../../../../../services/MandatosVacancia.service";
import { visoesService } from "../../../../../../../services/visoes.service";
import { ASSOCIACAO_UUID } from "../../../../../../../services/auth.service";
import { toastCustom } from "../../../../../../Globais/ToastCustom";

jest.mock("../../../../../../../services/escolas/PresentesAtaPaa.service", () => ({
    getParticipantesOrdenadosPorCargoPaa: jest.fn(),
    getListaPresentesPadraoPaa: jest.fn(),
    getMembroPorIdentificadorPaa: jest.fn(),
    getProfessorGremioInfo: jest.fn(),
}));

jest.mock("../../../../../../../services/MandatosVacancia.service", () => ({
    getCargosComposicaoVacanciaPorDataEAssociacao: jest.fn(),
}));

jest.mock("../../../../../../../services/visoes.service", () => ({
    visoesService: { getPermissoes: jest.fn(), featureFlagAtiva: jest.fn() },
}));

jest.mock("../../../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomError: jest.fn(),
        ToastCustomSuccess: jest.fn(),
        ToastCustomWarning: jest.fn(),
    },
}));

jest.mock("../../../../../../Globais/DatePickerField", () => ({
    DatePickerField: (props) => (
        <input
            aria-label="Data"
            value={props.value ? String(props.value) : ""}
            onChange={(e) => props.onChange(props.name, e.target.value)}
            disabled={props.disabled}
        />
    ),
}));

const propsBase = {
    stateFormEditarAta: {
        tipo_ata: "APRESENTACAO",
        data_reuniao: "2025-01-01",
        comentarios: "",
        justificativa_retificacao: "",
    },
    tabelas: { pareceres: [], tipos_reuniao: [], convocacoes: [] },
    onSubmitFormEdicaoAta: jest.fn(),
    uuid_ata: "uuid-123",
    setDisableBtnSalvar: jest.fn(),
    repassesPendentes: [],
    erros: {},
    showModalAvisoRegeracaoAta: false,
    setShowModalAvisoRegeracaoAta: jest.fn(),
};

const maria = {
    id: 1,
    cargo: "Presidente",
    identificacao: "9999999",
    nome: "Maria Silva",
    membro: true,
    presente: true,
};
const visitante = {
    id: 10,
    cargo: "Convidado",
    identificacao: "abc",
    nome: "Visitante",
    membro: false,
    presente: true,
    editavel: false,
};

const campo = (container, i, field) =>
    container.querySelector(`input[name="listaParticipantes[${i}].${field}"]`);

const renderForm = async (lista, extra = {}) => {
    getParticipantesOrdenadosPorCargoPaa.mockResolvedValue(lista);
    const formRef = { current: null };
    const utils = render(
        <NovoFormularioEditaAta {...propsBase} formRef={formRef} {...extra} />,
    );
    await waitFor(() => {
        expect(campo(utils.container, 0, "nome")).toBeInTheDocument();
    });
    return { ...utils, formRef };
};

describe("NovoFormularioEditaAta - ações sobre participantes", () => {
    beforeEach(() => {
        localStorage.setItem(ASSOCIACAO_UUID, "assoc-1");
        visoesService.getPermissoes.mockReturnValue(true);
        getListaPresentesPadraoPaa.mockResolvedValue([]);
        getCargosComposicaoVacanciaPorDataEAssociacao.mockResolvedValue({});
    });

    describe("fluxo de edição", () => {
        it("deve liberar todos os campos ao editar participante que não é servidor", async () => {
            const { container } = await renderForm([maria, visitante]);

            fireEvent.click(screen.getByText("Editar"));

            expect(propsBase.setDisableBtnSalvar).toHaveBeenCalledWith(true);
            expect(campo(container, 1, "nome")).toBeEnabled();
            expect(campo(container, 1, "cargo")).toBeEnabled();
            expect(campo(container, 1, "identificacao")).toBeEnabled();
            expect(screen.getByText("Confirmar")).toBeInTheDocument();
            expect(screen.getByText("Cancelar")).toBeInTheDocument();
        });

        it("deve liberar somente o identificador quando for servidor (RF com 7 dígitos)", async () => {
            const { container } = await renderForm([
                maria,
                { ...visitante, identificacao: "1234567" },
            ]);

            fireEvent.click(screen.getByText("Editar"));

            expect(campo(container, 1, "nome")).toBeDisabled();
            expect(campo(container, 1, "cargo")).toBeDisabled();
            expect(campo(container, 1, "identificacao")).toBeEnabled();
        });

        it("deve confirmar a edição quando não há duplicidade", async () => {
            const { container } = await renderForm([maria, visitante]);

            fireEvent.click(screen.getByText("Editar"));
            fireEvent.change(campo(container, 1, "nome"), {
                target: { name: "listaParticipantes[1].nome", value: "Novo Nome" },
            });
            fireEvent.click(screen.getByText("Confirmar"));

            await waitFor(() => {
                expect(campo(container, 1, "nome")).toBeDisabled();
            });
            expect(campo(container, 1, "nome").value).toBe("Novo Nome");
            expect(screen.queryByText("Confirmar")).not.toBeInTheDocument();
            expect(screen.getByText("Editar")).toBeInTheDocument();
        });

        it("deve exibir erro ao confirmar edição com nome já presente na lista", async () => {
            const { container } = await renderForm([maria, visitante]);

            fireEvent.click(screen.getByText("Editar"));
            fireEvent.change(campo(container, 1, "nome"), {
                target: { name: "listaParticipantes[1].nome", value: "Maria Silva" },
            });
            fireEvent.click(screen.getByText("Confirmar"));

            expect(
                await screen.findByText("Esta pessoa já está na lista de presentes"),
            ).toBeInTheDocument();
        });

        it("deve exibir erro ao confirmar edição com identificação já presente na lista", async () => {
            const { container } = await renderForm([maria, visitante]);

            fireEvent.click(screen.getByText("Editar"));
            fireEvent.change(campo(container, 1, "identificacao"), {
                target: {
                    name: "listaParticipantes[1].identificacao",
                    value: "9999999",
                },
            });
            fireEvent.click(screen.getByText("Confirmar"));

            expect(
                await screen.findByText("Esta pessoa já está na lista de presentes"),
            ).toBeInTheDocument();
        });

        it("deve restaurar os valores originais ao cancelar a edição", async () => {
            const { container } = await renderForm([maria, visitante]);

            fireEvent.click(screen.getByText("Editar"));
            fireEvent.change(campo(container, 1, "nome"), {
                target: { name: "listaParticipantes[1].nome", value: "Alterado" },
            });
            fireEvent.click(screen.getByText("Cancelar"));

            await waitFor(() => {
                expect(campo(container, 1, "nome").value).toBe("Visitante");
            });
            expect(campo(container, 1, "nome")).toBeDisabled();
            expect(campo(container, 1, "cargo").value).toBe("Convidado");
            expect(campo(container, 1, "identificacao").value).toBe("abc");
            expect(screen.getByText("Editar")).toBeInTheDocument();
        });

        it("deve limpar campos vazios ao cancelar edição de linha sem dados originais", async () => {
            const { container } = await renderForm([
                maria,
                { ...visitante, nome: "", cargo: "", identificacao: "" },
            ]);

            fireEvent.click(screen.getByText("Editar"));
            fireEvent.change(campo(container, 1, "nome"), {
                target: { name: "listaParticipantes[1].nome", value: "Digitado" },
            });
            fireEvent.click(screen.getByText("Cancelar"));

            await waitFor(() => {
                expect(campo(container, 1, "nome").value).toBe("");
            });
            expect(campo(container, 1, "cargo").value).toBe("");
            expect(campo(container, 1, "identificacao").value).toBe("");
        });
    });

    describe("fluxo de adição", () => {
        const adicionar = async (container, total) => {
            fireEvent.click(screen.getByText("+ Adicionar presente"));
            await waitFor(() => {
                expect(campo(container, total, "nome")).toBeInTheDocument();
            });
        };

        it("deve adicionar um novo presente e confirmar com sucesso", async () => {
            const { container } = await renderForm([maria]);

            await adicionar(container, 1);

            expect(screen.getByText("+ Adicionar presente")).toBeDisabled();
            const btnConfirmar = screen.getByText("Confirmar").closest("button");

            fireEvent.change(campo(container, 1, "nome"), {
                target: { name: "listaParticipantes[1].nome", value: "Fulano" },
            });
            await waitFor(() => expect(btnConfirmar).toBeEnabled());
            fireEvent.click(btnConfirmar);

            await waitFor(() => {
                expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
                    "Participante inserido com sucesso",
                );
            });
            expect(screen.getByText("+ Adicionar presente")).toBeEnabled();
        });

        it("deve exibir erro ao confirmar adição com nome duplicado", async () => {
            const { container } = await renderForm([maria]);

            await adicionar(container, 1);
            fireEvent.change(campo(container, 1, "nome"), {
                target: { name: "listaParticipantes[1].nome", value: "Maria Silva" },
            });
            const btnConfirmar = screen.getByText("Confirmar").closest("button");
            await waitFor(() => expect(btnConfirmar).toBeEnabled());
            fireEvent.click(btnConfirmar);

            expect(
                await screen.findByText("Esta pessoa já está na lista de presentes"),
            ).toBeInTheDocument();
            expect(propsBase.setDisableBtnSalvar).toHaveBeenCalledWith(true);
        });

        it("deve cancelar a adição removendo a linha criada", async () => {
            const { container } = await renderForm([maria]);

            await adicionar(container, 1);
            fireEvent.click(screen.getByText("Cancelar"));

            await waitFor(() => {
                expect(campo(container, 1, "nome")).not.toBeInTheDocument();
            });
            expect(screen.getByText("+ Adicionar presente")).toBeEnabled();
            expect(propsBase.setDisableBtnSalvar).toHaveBeenCalledWith(false);
        });
    });

    describe("remoção de participantes", () => {
        it("deve remover a linha persistida ao clicar em Remover", async () => {
            const { container } = await renderForm([maria, visitante]);

            fireEvent.click(screen.getByText("Remover"));

            await waitFor(() => {
                expect(campo(container, 1, "nome")).not.toBeInTheDocument();
            });
        });

        it("deve confirmar a linha editável sem duplicidade ao clicar em Remover", async () => {
            const { container } = await renderForm([
                maria,
                { ...visitante, editavel: true, adicao: true },
            ]);

            fireEvent.click(screen.getByText("Remover"));

            await waitFor(() => {
                expect(campo(container, 1, "nome")).toBeDisabled();
            });
            expect(campo(container, 1, "nome")).toBeInTheDocument();
        });

        it("deve exibir erro ao confirmar linha editável com nome duplicado", async () => {
            await renderForm([
                maria,
                { ...visitante, nome: "Maria Silva", editavel: true },
            ]);

            fireEvent.click(screen.getByText("Remover"));

            expect(
                await screen.findByText("Esta pessoa já está na lista de presentes"),
            ).toBeInTheDocument();
        });
    });
});
