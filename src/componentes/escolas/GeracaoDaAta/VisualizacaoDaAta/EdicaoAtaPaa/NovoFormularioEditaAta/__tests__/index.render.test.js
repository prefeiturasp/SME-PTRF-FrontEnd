import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { NovoFormularioEditaAta } from "../index";

import {
    getParticipantesOrdenadosPorCargoPaa,
    getListaPresentesPadraoPaa,
    getMembroPorIdentificadorPaa,
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

jest.mock("../../../TabelaRepassesPendentes", () => ({
    __esModule: true,
    default: () => <div data-testid="tabela-repasses" />,
}));

jest.mock("../../../../../../Globais/ModalAntDesign", () => ({
    ModalAntDesignConfirmacao: ({ handleShow, handleOk, handleCancel }) =>
        handleShow ? (
            <div data-testid="modal-remocao">
                <button data-testid="modal-ok" onClick={handleOk}>ok</button>
                <button data-testid="modal-cancel" onClick={handleCancel}>cancel</button>
            </div>
        ) : null,
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

const switches = () => screen.getAllByRole("switch");

describe("NovoFormularioEditaAta - renderização, presença e data", () => {
    let consoleErrorSpy;

    beforeEach(() => {
        localStorage.setItem(ASSOCIACAO_UUID, "assoc-1");
        visoesService.getPermissoes.mockReturnValue(true);
        getListaPresentesPadraoPaa.mockResolvedValue([]);
        getParticipantesOrdenadosPorCargoPaa.mockResolvedValue([]);
        getCargosComposicaoVacanciaPorDataEAssociacao.mockResolvedValue({});
        consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    describe("carregamento inicial", () => {
        it("deve registrar erro quando a busca de participantes falhar", async () => {
            getParticipantesOrdenadosPorCargoPaa.mockRejectedValue(new Error("falha"));
            render(<NovoFormularioEditaAta {...propsBase} formRef={{ current: null }} />);
            await waitFor(() => {
                expect(consoleErrorSpy).toHaveBeenCalledWith(
                    "Erro ao carregar participantes da ata PAA",
                    expect.any(Error),
                );
            });
        });

        it("deve seguir com lista vazia quando a lista padrão falhar", async () => {
            getListaPresentesPadraoPaa.mockRejectedValue(new Error("falha"));
            const { container } = await renderForm([maria]);
            expect(campo(container, 0, "nome").value).toBe("Maria Silva");
        });

        it("não deve buscar participantes sem uuid da ata", async () => {
            render(
                <NovoFormularioEditaAta {...propsBase} uuid_ata={null} formRef={{ current: null }} />,
            );
            await screen.findByText("Participantes");
            expect(getParticipantesOrdenadosPorCargoPaa).not.toHaveBeenCalled();
        });

        it("deve usar o professor já cadastrado na lista padrão", async () => {
            getListaPresentesPadraoPaa.mockResolvedValue([
                { id: "p", professor_gremio: true, nome: "Prof Padrão", cargo: "Prof", identificacao: "1234567" },
            ]);
            getParticipantesOrdenadosPorCargoPaa.mockResolvedValue([maria]);
            const { container } = render(
                <NovoFormularioEditaAta
                    {...propsBase}
                    formRef={{ current: null }}
                    precisaProfessorGremio={true}
                />,
            );
            await waitFor(() => {
                expect(campo(container, 1, "nome").value).toBe("Prof Padrão");
            });
        });

        it("deve sincronizar justificativa e comentários quando a ata não tem data", async () => {
            const { container } = render(
                <NovoFormularioEditaAta
                    {...propsBase}
                    formRef={{ current: null }}
                    stateFormEditarAta={{
                        tipo_ata: "RETIFICACAO",
                        data_reuniao: null,
                        comentarios: null,
                        justificativa_retificacao: "Motivo X",
                    }}
                />,
            );
            await waitFor(() => {
                expect(
                    container.querySelector('textarea[name="stateFormEditarAta.justificativa_retificacao"]').value,
                ).toBe("Motivo X");
            });
            expect(screen.getByText(/Preencha a data da reunião/)).toBeInTheDocument();
        });
    });

    describe("campos do formulário", () => {
        const tabelas = {
            pareceres: [
                { id: "APROVADA", nome: "Aprovada" },
                { id: "REPROVADA", nome: "Reprovada" },
            ],
            tipos_reuniao: [{ id: "ORDINARIA", nome: "Ordinária" }],
            convocacoes: [{ id: "PRIMEIRA", nome: "Primeira convocação" }],
        };

        it("deve renderizar as opções de tipo de reunião, convocação e parecer", async () => {
            render(
                <NovoFormularioEditaAta {...propsBase} formRef={{ current: null }} tabelas={tabelas} />,
            );
            expect(await screen.findByText("Ordinária")).toBeInTheDocument();
            expect(screen.getByText("Primeira convocação")).toBeInTheDocument();
            expect(screen.getByText("Aprovada")).toBeInTheDocument();
            expect(screen.queryByPlaceholderText("Insira o motivo da reprovação")).not.toBeInTheDocument();
        });

        it("deve exibir motivo de reprovação e limpá-lo ao trocar para parecer aprovado", async () => {
            const { container } = render(
                <NovoFormularioEditaAta
                    {...propsBase}
                    formRef={{ current: null }}
                    tabelas={tabelas}
                    stateFormEditarAta={{
                        ...propsBase.stateFormEditarAta,
                        parecer_conselho: "REPROVADA",
                        justificativa: "Motivo antigo",
                    }}
                />,
            );
            const motivo = await screen.findByPlaceholderText("Insira o motivo da reprovação");
            expect(motivo.value).toBe("Motivo antigo");

            fireEvent.change(motivo, {
                target: { name: "stateFormEditarAta.justificativa", value: "Novo motivo" },
            });
            expect(motivo.value).toBe("Novo motivo");

            fireEvent.change(
                container.querySelector('select[name="stateFormEditarAta.parecer_conselho"]'),
                { target: { name: "stateFormEditarAta.parecer_conselho", value: "APROVADA" } },
            );
            await waitFor(() => {
                expect(screen.queryByPlaceholderText("Insira o motivo da reprovação")).not.toBeInTheDocument();
            });
        });

        it("deve formatar a data de início do cargo vago recebida em formato ISO", async () => {
            await renderForm([
                { ...maria, vago: true, presente: false, data_inicio_no_cargo: "2026-09-25" },
            ]);
            expect(await screen.findByText("Cargo vago desde 25/09/2026")).toBeInTheDocument();
        });

        it("deve permitir alterar o cargo de um participante em edição", async () => {
            const { container } = await renderForm([maria, visitante]);
            fireEvent.click(screen.getByText("Editar"));
            fireEvent.change(campo(container, 1, "cargo"), {
                target: { name: "listaParticipantes[1].cargo", value: "Outro cargo" },
            });
            expect(campo(container, 1, "cargo").value).toBe("Outro cargo");
        });

        it("deve manter o motivo ao trocar para outro parecer reprovado", async () => {
            const { container } = render(
                <NovoFormularioEditaAta
                    {...propsBase}
                    formRef={{ current: null }}
                    tabelas={{
                        ...tabelas,
                        pareceres: [...tabelas.pareceres, { id: "REPROVADA_RESSALVAS", nome: "Reprovada com ressalvas" }],
                    }}
                    stateFormEditarAta={{
                        ...propsBase.stateFormEditarAta,
                        parecer_conselho: "REPROVADA",
                        justificativa: "Motivo",
                    }}
                />,
            );
            await screen.findByPlaceholderText("Insira o motivo da reprovação");
            fireEvent.change(
                container.querySelector('select[name="stateFormEditarAta.parecer_conselho"]'),
                { target: { name: "stateFormEditarAta.parecer_conselho", value: "REPROVADA_RESSALVAS" } },
            );
            expect(screen.getByPlaceholderText("Insira o motivo da reprovação").value).toBe("Motivo");
        });

        it("deve exibir justificativa da retificação e título 'retificado' em atas de retificação", async () => {
            const { container } = render(
                <NovoFormularioEditaAta
                    {...propsBase}
                    formRef={{ current: null }}
                    stateFormEditarAta={{
                        ...propsBase.stateFormEditarAta,
                        tipo_ata: "RETIFICACAO",
                        justificativa_retificacao: "Corrigindo",
                    }}
                />,
            );
            expect(await screen.findByText(/PAA retificado\?/)).toBeInTheDocument();
            const area = container.querySelector('textarea[name="stateFormEditarAta.justificativa_retificacao"]');
            fireEvent.change(area, {
                target: { name: "stateFormEditarAta.justificativa_retificacao", value: "Outro" },
            });
            expect(area.value).toBe("Outro");
        });

        it("deve exibir título 'apresentado' e ocultar justificativa fora de retificação", async () => {
            const { container } = render(
                <NovoFormularioEditaAta {...propsBase} formRef={{ current: null }} />,
            );
            expect(await screen.findByText(/PAA apresentado\?/)).toBeInTheDocument();
            expect(
                container.querySelector('textarea[name="stateFormEditarAta.justificativa_retificacao"]'),
            ).not.toBeInTheDocument();
        });

        it("deve exibir a tabela e a justificativa de repasses pendentes com erro de validação", async () => {
            render(
                <NovoFormularioEditaAta
                    {...propsBase}
                    formRef={{ current: null }}
                    repassesPendentes={[{ id: 1 }]}
                    erros={{ justificativa_repasses_pendentes: "Justificativa obrigatória" }}
                />,
            );
            expect(await screen.findByTestId("tabela-repasses")).toBeInTheDocument();
            expect(screen.getByText("Justificativa obrigatória")).toBeInTheDocument();
        });

        it("deve exibir a tabela de repasses sem mensagem de erro quando não há erro", async () => {
            render(
                <NovoFormularioEditaAta
                    {...propsBase}
                    formRef={{ current: null }}
                    repassesPendentes={[{ id: 1 }]}
                />,
            );
            expect(await screen.findByTestId("tabela-repasses")).toBeInTheDocument();
            expect(screen.queryByText("Justificativa obrigatória")).not.toBeInTheDocument();
        });

        it("deve atualizar hora e local da reunião", async () => {
            const { container } = render(
                <NovoFormularioEditaAta {...propsBase} formRef={{ current: null }} />,
            );
            const hora = await waitFor(() => {
                const el = container.querySelector('input[name="stateFormEditarAta.hora_reuniao"]');
                expect(el).toBeInTheDocument();
                return el;
            });
            fireEvent.change(hora, { target: { name: "stateFormEditarAta.hora_reuniao", value: "10:30" } });
            const local = container.querySelector('input[name="stateFormEditarAta.local_reuniao"]');
            fireEvent.change(local, { target: { name: "stateFormEditarAta.local_reuniao", value: "Sala 1" } });
            expect(hora.value).toBe("10:30");
            expect(local.value).toBe("Sala 1");
        });

        it("deve renderizar o modal de aviso de regeração e fechá-lo", async () => {
            const setShow = jest.fn();
            render(
                <NovoFormularioEditaAta
                    {...propsBase}
                    formRef={{ current: null }}
                    showModalAvisoRegeracaoAta={true}
                    setShowModalAvisoRegeracaoAta={setShow}
                />,
            );
            fireEvent.click(await screen.findByText("OK"));
            expect(setShow).toHaveBeenCalledWith(false);
        });

        it("deve fechar o modal de aviso de regeração pelo botão de fechar", async () => {
            const setShow = jest.fn();
            const { baseElement } = render(
                <NovoFormularioEditaAta
                    {...propsBase}
                    formRef={{ current: null }}
                    showModalAvisoRegeracaoAta={true}
                    setShowModalAvisoRegeracaoAta={setShow}
                />,
            );
            await screen.findByText("OK");
            fireEvent.click(baseElement.querySelector(".ant-modal-close"));
            expect(setShow).toHaveBeenCalledWith(false);
        });
    });

    describe("presença, presidente e secretário", () => {
        const dois = [
            maria,
            { ...maria, id: 2, nome: "João Souza", identificacao: "8888888", cargo: "Secretário" },
        ];
        // switches por linha: [presença, presidente, secretário]
        const estado = () => switches().map((s) => s.getAttribute("aria-checked"));

        it("deve alternar a presença do participante e limpar presidente/secretário", async () => {
            await renderForm(dois);
            expect(estado().slice(0, 3)).toEqual(["true", "false", "false"]);

            fireEvent.click(switches()[1]);
            await waitFor(() => expect(estado()[1]).toBe("true"));

            fireEvent.click(switches()[0]);
            await waitFor(() => expect(estado().slice(0, 3)).toEqual(["false", "false", "false"]));

            fireEvent.click(switches()[0]);
            await waitFor(() => expect(estado()[0]).toBe("true"));
        });

        it("deve permitir apenas um presidente e alternar o valor", async () => {
            await renderForm(dois);

            fireEvent.click(switches()[1]);
            await waitFor(() => expect(estado()[1]).toBe("true"));
            fireEvent.click(switches()[4]);
            await waitFor(() => expect(estado()[4]).toBe("true"));
            expect(estado()[1]).toBe("false");

            fireEvent.click(switches()[4]);
            await waitFor(() => expect(estado()[4]).toBe("false"));
        });

        it("deve permitir apenas um secretário e bloquear presidente na mesma linha", async () => {
            await renderForm(dois);

            fireEvent.click(switches()[2]);
            await waitFor(() => expect(estado()[2]).toBe("true"));
            expect(switches()[1]).toBeDisabled();

            fireEvent.click(switches()[5]);
            await waitFor(() => expect(estado()[5]).toBe("true"));
            expect(estado()[2]).toBe("false");

            fireEvent.click(switches()[5]);
            await waitFor(() => expect(estado()[5]).toBe("false"));
        });

        it("deve ocultar presidente/secretário para participante manual persistido que é membro", async () => {
            // membro com id persistido e não-manual exibe 3 switches; manual não exibe controles
            await renderForm([maria, visitante]);
            expect(switches()).toHaveLength(3);
        });

        it("deve alternar a presença do professor do grêmio e refletir no estado", async () => {
            getParticipantesOrdenadosPorCargoPaa.mockResolvedValue([maria]);
            const { container } = render(
                <NovoFormularioEditaAta
                    {...propsBase}
                    formRef={{ current: null }}
                    precisaProfessorGremio={true}
                />,
            );
            await waitFor(() => expect(campo(container, 1, "nome")).toBeInTheDocument());
            expect(switches()).toHaveLength(6);

            fireEvent.click(switches()[3]);
            await waitFor(() => expect(estado()[3]).toBe("false"));
            fireEvent.click(switches()[3]);
            await waitFor(() => expect(estado()[3]).toBe("true"));
        });

        it("deve ignorar a linha do professor quando o grêmio não é necessário", async () => {
            const { container, formRef } = await renderForm([maria]);
            await act(async () => {
                formRef.current.setFieldValue("listaParticipantes", [
                    maria,
                    { id: "pg", professor_gremio: true, nome: "Prof", cargo: "C", identificacao: "", presente: true },
                ]);
            });
            await waitFor(() => {
                expect(campo(container, 1, "nome")).not.toBeInTheDocument();
            });
        });
    });

    describe("alteração da data da reunião", () => {
        const alteraData = (valor) =>
            fireEvent.change(screen.getByLabelText("Data"), { target: { value: valor } });

        it("deve abrir o modal ao limpar a data e manter a lista ao cancelar", async () => {
            const { container } = await renderForm([maria]);
            alteraData("");
            fireEvent.click(await screen.findByTestId("modal-cancel"));

            expect(screen.queryByTestId("modal-remocao")).not.toBeInTheDocument();
            expect(campo(container, 0, "nome").value).toBe("Maria Silva");
        });

        it("deve remover os participantes ao confirmar a limpeza da data", async () => {
            const { container } = await renderForm([maria]);
            alteraData("");
            fireEvent.click(await screen.findByTestId("modal-ok"));

            await waitFor(() => {
                expect(screen.getByText(/Preencha a data da reunião para visualizar/)).toBeInTheDocument();
            });
            expect(campo(container, 0, "nome")).not.toBeInTheDocument();
            expect(screen.queryByTestId("modal-remocao")).not.toBeInTheDocument();
        });

        it("deve manter a linha do professor ao confirmar a limpeza da data quando o grêmio é necessário", async () => {
            getParticipantesOrdenadosPorCargoPaa.mockResolvedValue([maria]);
            const { container } = render(
                <NovoFormularioEditaAta
                    {...propsBase}
                    formRef={{ current: null }}
                    precisaProfessorGremio={true}
                />,
            );
            await waitFor(() => expect(campo(container, 1, "nome")).toBeInTheDocument());
            alteraData("");
            fireEvent.click(await screen.findByTestId("modal-ok"));
            await waitFor(() => {
                expect(screen.queryByTestId("modal-remocao")).not.toBeInTheDocument();
            });
        });

        it("deve usar a data formatada inválida como null ao buscar membro (data da reunião inválida)", async () => {
            getMembroPorIdentificadorPaa.mockResolvedValue({ mensagem: "ok", nome: "N", cargo: "C" });
            getParticipantesOrdenadosPorCargoPaa.mockResolvedValue([maria]);
            const formRef = { current: null };
            const { container } = render(
                <NovoFormularioEditaAta
                    {...propsBase}
                    formRef={formRef}
                    stateFormEditarAta={{ ...propsBase.stateFormEditarAta, data_reuniao: "data-invalida" }}
                />,
            );
            await waitFor(() => expect(formRef.current).toBeTruthy());
            await act(async () => {
                formRef.current.setFieldValue("stateFormEditarAta.data_reuniao", new Date(2025, 0, 1));
                formRef.current.setFieldValue("listaParticipantes", [
                    { ...maria, membro: false, editavel: true, identificacao: "" },
                ]);
            });
            const input = await waitFor(() => {
                const el = campo(container, 0, "identificacao");
                expect(el).toBeInTheDocument();
                return el;
            });
            fireEvent.change(input, {
                target: { name: "listaParticipantes[0].identificacao", value: "1234567" },
            });
            fireEvent.blur(input);
            await waitFor(() => {
                expect(getMembroPorIdentificadorPaa).toHaveBeenCalledWith("uuid-123", "1234567", null);
            });
        });
    });
});
