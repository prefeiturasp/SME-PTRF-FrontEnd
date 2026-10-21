import React from "react";

import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { NovoFormularioEditaAta } from "../index";

import { getParticipantesOrdenadosPorCargo } from "../../../../../../../services/escolas/PresentesAta.service";
import { getCargosComposicaoVacanciaPorDataEAssociacao } from "../../../../../../../services/MandatosVacancia.service";
import { visoesService } from "../../../../../../../services/visoes.service";
import { ASSOCIACAO_UUID } from "../../../../../../../services/auth.service";
import { toastCustom } from "../../../../../../Globais/ToastCustom";

jest.mock("../../../../../../../services/escolas/PresentesAta.service", () => ({
    getParticipantesOrdenadosPorCargo: jest.fn(),
    getMembroPorIdentificador: jest.fn(),
}));

jest.mock("../../../../../../../services/escolas/PresentesAtaPaa.service", () => ({
    getProfessorGremioInfo: jest.fn(),
}));

jest.mock("../../../../../../../services/MandatosVacancia.service", () => ({
    getCargosComposicaoVacanciaPorDataEAssociacao: jest.fn(),
}));

jest.mock("../../../../../../../services/visoes.service", () => ({
    visoesService: {
        getPermissoes: jest.fn(),
        featureFlagAtiva: jest.fn(),
    },
}));

jest.mock("../../../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomError: jest.fn(),
        ToastCustomSuccess: jest.fn(),
    },
}));

const mockDatePickerField = jest.fn();

jest.mock("../../../../../../Globais/DatePickerField", () => ({
    DatePickerField: (props) => {
        mockDatePickerField(props);

        return (
            <input
                aria-label="Data"
                value={props.value instanceof Date ? props.value.toISOString() : props.value || ""}
                autoComplete={props.autoComplete}
                onChange={(e) => props.onChange(props.name, e.target.value)}
                disabled={props.disabled}
            />
        );
    },
}));

const composicaoComCargoVago = {
    presidente_diretoria_executiva: {
        id: 1,
        cargo_associacao_label: "Presidente da Diretoria Executiva",
        data_inicio_no_cargo: "2024-01-10",
        ocupante_do_cargo: { codigo_identificacao: "1234567", nome: "Maria da Silva" },
        vago: false,
    },
    vice_presidente_diretoria_executiva: {
        id: 2,
        cargo_associacao_label: "Vice-Presidente da Diretoria Executiva",
        data_inicio_no_cargo: "2025-09-25",
        ocupante_do_cargo: null,
        vago: true,
    },
};

const membroOcupado = {
    id: 1,
    cargo: "Presidente da Diretoria Executiva",
    identificacao: "1234567",
    nome: "Maria da Silva",
    membro: true,
    presente: true,
    vago: false,
    presidente_da_reuniao: false,
    secretario_da_reuniao: false,
};

const membroVagoMarcadoComoPresente = {
    id: 2,
    cargo: "Vice-Presidente da Diretoria Executiva",
    identificacao: "",
    nome: "",
    membro: true,
    presente: true,
    vago: true,
    data_inicio_no_cargo: "25/09/2025",
    presidente_da_reuniao: false,
    secretario_da_reuniao: false,
};

const propsBase = {
    stateFormEditarAta: {
        tipo_ata: "APRESENTACAO",
        data_reuniao: "2025-01-01",
        comentarios: "",
    },
    tabelas: {
        pareceres: [],
        tipos_reuniao: [],
        convocacoes: [],
    },
    onSubmitFormEdicaoAta: jest.fn(),
    uuid_ata: "uuid-ata-123",
    setDisableBtnSalvar: jest.fn(),
    repassesPendentes: [],
    erros: {},
    showModalAvisoRegeracaoAta: false,
    setShowModalAvisoRegeracaoAta: jest.fn(),
};

const renderiza = (props = {}) => {
    const formRef = React.createRef();
    const resultado = render(
        <NovoFormularioEditaAta {...propsBase} formRef={formRef} {...props} />,
    );
    return { ...resultado, formRef };
};

const obtemPropsDoCampoData = () =>
    mockDatePickerField.mock.calls
        .map(([props]) => props)
        .reverse()
        .find((props) => props.name === "stateFormEditarAta.data_reuniao");

const alteraDataDaReuniao = async (novaData) => {
    await waitFor(() => {
        expect(obtemPropsDoCampoData()).toBeDefined();
    });

    await act(async () => {
        obtemPropsDoCampoData().onChange("stateFormEditarAta.data_reuniao", novaData);
    });
};

const obtemValoresDosNomes = () =>
    screen.getAllByLabelText("Nome").map((input) => input.value);

describe("NovoFormularioEditaAta - composição com vacância de cargos", () => {
    beforeEach(() => {
        localStorage.setItem(ASSOCIACAO_UUID, "assoc-1");

        visoesService.getPermissoes.mockReturnValue(true);
        visoesService.featureFlagAtiva.mockReturnValue(false);

        getCargosComposicaoVacanciaPorDataEAssociacao.mockResolvedValue({});
        // Mantém a busca dos participantes salvos pendente para isolar a nova chamada de composição
        getParticipantesOrdenadosPorCargo.mockReturnValue(new Promise(() => {}));
    });

    afterEach(() => {
        localStorage.removeItem(ASSOCIACAO_UUID);
    });

    describe("carregamento da composição pela nova API", () => {
        it("deve buscar a composição com vacância pela data da reunião e associação ao carregar", async () => {
            renderiza();

            await waitFor(() => {
                expect(getCargosComposicaoVacanciaPorDataEAssociacao).toHaveBeenCalledWith(
                    "2025-01-01",
                    "assoc-1",
                );
            });
        });

        it("deve exibir os cargos retornados pela composição com vacância", async () => {
            getCargosComposicaoVacanciaPorDataEAssociacao.mockResolvedValue(composicaoComCargoVago);

            renderiza();

            expect(await screen.findByDisplayValue("Maria da Silva")).toBeInTheDocument();
            expect(screen.getByDisplayValue("Vice-Presidente da Diretoria Executiva")).toBeInTheDocument();
            expect(obtemValoresDosNomes()).toEqual(["Maria da Silva", ""]);
        });

        it("não deve buscar a composição novamente após carregá-la com sucesso", async () => {
            getCargosComposicaoVacanciaPorDataEAssociacao.mockResolvedValue(composicaoComCargoVago);

            renderiza();

            await screen.findByDisplayValue("Maria da Silva");

            expect(getCargosComposicaoVacanciaPorDataEAssociacao).toHaveBeenCalledTimes(1);
        });

        it.each([
            ["ausente", null],
            ["inválida", "data-invalida"],
        ])("não deve buscar a composição quando a data da reunião for %s", async (_, dataReuniao) => {
            renderiza({
                stateFormEditarAta: { ...propsBase.stateFormEditarAta, data_reuniao: dataReuniao },
            });

            expect(
                await screen.findByText("Preencha a data da reunião para visualizar os membros."),
            ).toBeInTheDocument();
            expect(getCargosComposicaoVacanciaPorDataEAssociacao).not.toHaveBeenCalled();
        });

        it("deve notificar a mensagem da API quando a composição não for encontrada (404)", async () => {
            getCargosComposicaoVacanciaPorDataEAssociacao.mockRejectedValueOnce({
                response: { status: 404, data: { erro: "Não existe composição para a data." } },
            });

            renderiza();

            await waitFor(() => {
                expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
                    "Erro ao carregar participantes",
                    "Não existe composição para a data.",
                );
            });
            expect(screen.queryAllByLabelText("Nome")).toHaveLength(0);
        });

        it("deve notificar a mensagem padrão quando o 404 não trouxer mensagem da API", async () => {
            getCargosComposicaoVacanciaPorDataEAssociacao.mockRejectedValueOnce({
                response: { status: 404, data: {} },
            });

            renderiza();

            await waitFor(() => {
                expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
                    "Erro ao carregar participantes",
                    "Composição não encontrada.",
                );
            });
        });
    });

    describe("campo data da reunião", () => {
        it("deve renderizar o campo data com autocomplete desligado", async () => {
            renderiza();

            const campoData = await screen.findByLabelText("Data");

            expect(campoData).toHaveAttribute("autocomplete", "off");
            expect(obtemPropsDoCampoData().autoComplete).toBe("off");
        });

        it("não deve permitir selecionar uma data de reunião posterior à data atual", async () => {
            const dataFixaAtual = new Date(2026, 5, 15, 10, 0, 0);
            jest.useFakeTimers();
            jest.setSystemTime(dataFixaAtual);

            try {
                renderiza();

                await waitFor(() => {
                    expect(obtemPropsDoCampoData()).toBeDefined();
                });

                expect(obtemPropsDoCampoData().maxDate).toEqual(dataFixaAtual);
            } finally {
                jest.useRealTimers();
            }
        });
    });

    describe("mensagem de cargo vago", () => {
        it("deve exibir a data desde quando o cargo está vago", async () => {
            getCargosComposicaoVacanciaPorDataEAssociacao.mockResolvedValue(composicaoComCargoVago);

            renderiza();

            expect(await screen.findByText("Cargo vago desde 25/09/2025")).toBeInTheDocument();
        });

        it("não deve exibir a mensagem de cargo vago para cargo ocupado", async () => {
            getCargosComposicaoVacanciaPorDataEAssociacao.mockResolvedValue({
                presidente_diretoria_executiva: composicaoComCargoVago.presidente_diretoria_executiva,
            });

            renderiza();

            await screen.findByDisplayValue("Maria da Silva");

            expect(screen.queryByText(/Cargo vago desde/)).not.toBeInTheDocument();
        });

        it("deve exibir o erro de nome obrigatório somente para cargo ocupado sem nome", async () => {
            getCargosComposicaoVacanciaPorDataEAssociacao.mockResolvedValue({
                presidente_diretoria_executiva: {
                    ...composicaoComCargoVago.presidente_diretoria_executiva,
                    ocupante_do_cargo: { codigo_identificacao: "1234567" },
                },
                vice_presidente_diretoria_executiva:
                    composicaoComCargoVago.vice_presidente_diretoria_executiva,
            });

            const { formRef } = renderiza();

            await screen.findByText("Cargo vago desde 25/09/2025");

            await act(async () => {
                await formRef.current.validateForm();
            });

            expect(screen.getAllByText("Nome do presente é obrigatorio")).toHaveLength(1);
        });
    });

    describe("presença de cargo vago", () => {
        beforeEach(() => {
            getParticipantesOrdenadosPorCargo.mockResolvedValue([
                membroOcupado,
                membroVagoMarcadoComoPresente,
            ]);
        });

        const obtemSwitches = () => {
            const [
                presencaOcupado,
                presidenteOcupado,
                secretarioOcupado,
                presencaVago,
                presidenteVago,
                secretarioVago,
            ] = screen.getAllByRole("switch");

            return {
                presencaOcupado,
                presidenteOcupado,
                secretarioOcupado,
                presencaVago,
                presidenteVago,
                secretarioVago,
            };
        };

        it("deve exibir cargo vago como ausente mesmo que esteja salvo como presente", async () => {
            renderiza();

            await screen.findByText("Cargo vago desde 25/09/2025");

            const { presencaVago } = obtemSwitches();

            expect(presencaVago).toHaveAttribute("aria-checked", "false");
            expect(presencaVago).toHaveTextContent("Ausente");
        });

        it("deve bloquear presença, presidente e secretário do cargo vago", async () => {
            renderiza();

            await screen.findByText("Cargo vago desde 25/09/2025");

            const { presencaVago, presidenteVago, secretarioVago } = obtemSwitches();

            expect(presencaVago).toBeDisabled();
            expect(presidenteVago).toBeDisabled();
            expect(secretarioVago).toBeDisabled();
        });

        it("não deve marcar cargo vago como presente ao clicar no switch", async () => {
            renderiza();

            await screen.findByText("Cargo vago desde 25/09/2025");

            fireEvent.click(obtemSwitches().presencaVago);

            expect(obtemSwitches().presencaVago).toHaveAttribute("aria-checked", "false");
        });

        it("deve permitir alterar a presença de cargo ocupado", async () => {
            renderiza();

            await screen.findByText("Cargo vago desde 25/09/2025");

            const { presencaOcupado, presidenteOcupado, secretarioOcupado } = obtemSwitches();

            expect(presencaOcupado).toBeEnabled();
            expect(presidenteOcupado).toBeEnabled();
            expect(secretarioOcupado).toBeEnabled();
            expect(presencaOcupado).toHaveAttribute("aria-checked", "true");

            fireEvent.click(presencaOcupado);

            await waitFor(() => {
                expect(obtemSwitches().presencaOcupado).toHaveAttribute("aria-checked", "false");
            });
        });

        it("deve bloquear a presença de todos os cargos sem permissão de edição", async () => {
            visoesService.getPermissoes.mockReturnValue(false);

            renderiza();

            await screen.findByText("Cargo vago desde 25/09/2025");

            screen.getAllByRole("switch").forEach((switchPresenca) => {
                expect(switchPresenca).toBeDisabled();
            });
        });
    });

    describe("alteração da data mantendo presentes adicionados", () => {
        const membroAnterior = {
            ...membroOcupado,
            nome: "Membro Anterior",
        };

        const convidadoAdicionado = {
            id: 10,
            cargo: "Convidado",
            identificacao: "",
            nome: "Convidado Externo",
            membro: false,
            presente: true,
        };

        beforeEach(() => {
            getParticipantesOrdenadosPorCargo.mockResolvedValue([membroAnterior, convidadoAdicionado]);
        });

        it("deve buscar a composição com vacância da nova data", async () => {
            renderiza();

            await screen.findByDisplayValue("Membro Anterior");

            await alteraDataDaReuniao(new Date(2026, 8, 25));

            await waitFor(() => {
                expect(getCargosComposicaoVacanciaPorDataEAssociacao).toHaveBeenLastCalledWith(
                    "2026-09-25",
                    "assoc-1",
                );
            });
        });

        it("deve carregar a nova composição e manter os presentes adicionados", async () => {
            renderiza();

            await screen.findByDisplayValue("Membro Anterior");

            getCargosComposicaoVacanciaPorDataEAssociacao.mockResolvedValue(composicaoComCargoVago);

            await alteraDataDaReuniao(new Date(2026, 8, 25));

            await waitFor(() => {
                expect(obtemValoresDosNomes()).toEqual(["Maria da Silva", "", "Convidado Externo"]);
            });
            expect(screen.queryByDisplayValue("Membro Anterior")).not.toBeInTheDocument();
            expect(screen.getByText("Cargo vago desde 25/09/2025")).toBeInTheDocument();
        });

        it("deve notificar o erro e manter a lista atual quando a nova data não tiver composição (404)", async () => {
            renderiza();

            await screen.findByDisplayValue("Membro Anterior");

            getCargosComposicaoVacanciaPorDataEAssociacao.mockRejectedValue({
                response: { status: 404, data: { erro: "Não existe composição para a data." } },
            });

            await alteraDataDaReuniao(new Date(2026, 8, 25));

            await waitFor(() => {
                expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
                    "Erro ao carregar participantes",
                    "Não existe composição para a data.",
                );
            });
            expect(obtemValoresDosNomes()).toEqual(["Membro Anterior", "Convidado Externo"]);
        });

        it("deve manter a lista atual sem notificar quando a falha não for 404", async () => {
            renderiza();

            await screen.findByDisplayValue("Membro Anterior");

            getCargosComposicaoVacanciaPorDataEAssociacao.mockRejectedValue({
                response: { status: 500, data: {} },
            });

            await alteraDataDaReuniao(new Date(2026, 8, 25));

            await waitFor(() => {
                expect(getCargosComposicaoVacanciaPorDataEAssociacao).toHaveBeenLastCalledWith(
                    "2026-09-25",
                    "assoc-1",
                );
            });
            expect(toastCustom.ToastCustomError).not.toHaveBeenCalled();
            expect(obtemValoresDosNomes()).toEqual(["Membro Anterior", "Convidado Externo"]);
        });

        it("deve pedir confirmação sem buscar composição quando a data for removida", async () => {
            renderiza();

            await screen.findByDisplayValue("Membro Anterior");

            const chamadasAntes = getCargosComposicaoVacanciaPorDataEAssociacao.mock.calls.length;

            await alteraDataDaReuniao(null);

            expect(await screen.findByText("Confirmar exclusão de participantes")).toBeInTheDocument();
            expect(getCargosComposicaoVacanciaPorDataEAssociacao).toHaveBeenCalledTimes(chamadasAntes);
        });
    });
});
