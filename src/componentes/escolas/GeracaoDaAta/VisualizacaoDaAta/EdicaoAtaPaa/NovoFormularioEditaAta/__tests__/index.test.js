import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { NovoFormularioEditaAta } from "../index";

import {
    getParticipantesOrdenadosPorCargoPaa,
    getListaPresentesPadraoPaa,
} from "../../../../../../../services/escolas/PresentesAtaPaa.service";

import { getCargosComposicaoData } from "../../../../../../../services/Mandatos.service";
import { getCargosComposicaoVacanciaPorDataEAssociacao } from "../../../../../../../services/MandatosVacancia.service";

import { visoesService } from "../../../../../../../services/visoes.service";
import { ASSOCIACAO_UUID } from "../../../../../../../services/auth.service";

import * as utils from "../../utils";

jest.mock(
    "../../../../../../../services/escolas/PresentesAtaPaa.service",
    () => ({
        getParticipantesOrdenadosPorCargoPaa: jest.fn(),
        getListaPresentesPadraoPaa: jest.fn(),
        getMembroPorIdentificadorPaa: jest.fn(),
        getProfessorGremioInfo: jest.fn(),
    }),
);

jest.mock("../../../../../../../services/Mandatos.service", () => ({
    getCargosComposicaoData: jest.fn(),
}));

jest.mock("../../../../../../../services/MandatosVacancia.service", () => ({
    getCargosComposicaoVacanciaPorDataEAssociacao: jest.fn(),
}));

jest.mock("../../utils", () => ({
    ...jest.requireActual("../../utils"),
    adicionaProfessorGremioNaLista: jest.fn(),
    extraiProfessorDefaults: jest.fn(),
    listaPossuiParticipantesAssociacao: jest.fn(),
    marcaParticipantesComoMembrosDaAssociacao: jest.fn((lista) => lista),
    formatarListaCargoComposicaoParaFormatoDaListaParticipantes: jest.fn(
        (lista) => lista,
    ),
}));

jest.mock("../../../../../../../services/visoes.service", () => ({
    visoesService: {
        getPermissoes: jest.fn(() => true),
        featureFlagAtiva: jest.fn(() => false),
    },
}));

const mockDatePickerField = jest.fn();

jest.mock("../../../../../../Globais/DatePickerField", () => ({
    DatePickerField: (props) => {
        mockDatePickerField(props);

        return (
            <input
                aria-label="Data"
                value={props.value || ""}
                onChange={(e) => props.onChange(props.name, e.target.value)}
                disabled={props.disabled}
            />
        );
    },
}));

const propsBase = {
    stateFormEditarAta: {
        tipo_ata: "APRESENTACAO",
        data_reuniao: "2025-01-01",
        comentarios: "Comentário carregado da API",
        justificativa_retificacao: "",
    },
    tabelas: {
        pareceres: [],
        tipos_reuniao: [],
        convocacoes: [],
    },
    formRef: {
        current: {
            setFieldValue: jest.fn(),
            values: {
                listaParticipantes: [],
            },
        },
    },
    onSubmitFormEdicaoAta: jest.fn(),
    uuid_ata: "uuid-123",
    setDisableBtnSalvar: jest.fn(),
    repassesPendentes: [],
    erros: {},
    showModalAvisoRegeracaoAta: false,
    setShowModalAvisoRegeracaoAta: jest.fn(),
};

describe("NovoFormularioEditaAta - alterações do PR", () => {
    const dataFixaAtual = new Date(2026, 5, 15, 10, 0, 0);

    beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(dataFixaAtual);
        jest.clearAllMocks();

        localStorage.setItem(ASSOCIACAO_UUID, "assoc-1");

        getParticipantesOrdenadosPorCargoPaa.mockResolvedValue([]);
        getListaPresentesPadraoPaa.mockResolvedValue([]);
        getCargosComposicaoData.mockResolvedValue([]);
        getCargosComposicaoVacanciaPorDataEAssociacao.mockResolvedValue({});
        visoesService.featureFlagAtiva.mockReturnValue(false);

        utils.listaPossuiParticipantesAssociacao.mockReturnValue(true);

        utils.adicionaProfessorGremioNaLista.mockImplementation(
            (lista) => lista,
        );

        utils.extraiProfessorDefaults.mockReturnValue(null);

        utils.marcaParticipantesComoMembrosDaAssociacao.mockImplementation(
            (lista) => lista,
        );

        utils.formatarListaCargoComposicaoParaFormatoDaListaParticipantes.mockImplementation(
            (lista) => lista,
        );
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe("recarregamento quando precisaProfessorGremio mudar", () => {
        it("deve executar novo carregamento ao alterar precisaProfessorGremio", async () => {
            const { rerender } = render(
                <NovoFormularioEditaAta
                    {...propsBase}
                    precisaProfessorGremio={false}
                />,
            );

            await waitFor(() => {
                expect(
                    getParticipantesOrdenadosPorCargoPaa,
                ).toHaveBeenCalledTimes(1);
            });

            rerender(
                <NovoFormularioEditaAta
                    {...propsBase}
                    precisaProfessorGremio={true}
                />,
            );

            await waitFor(() => {
                expect(
                    getParticipantesOrdenadosPorCargoPaa,
                ).toHaveBeenCalledTimes(2);
            });
        });
    });

    describe("preservação dos dados do professor orientador", () => {
        it("deve reutilizar professorDefaults quando já existir professor preenchido", async () => {
            const professorInfo = {
                nome: "Professor João",
                cargo: "Professor",
                identificacao: "1234567",
                presente: true,
            };

            utils.extraiProfessorDefaults.mockReturnValue(professorInfo);

            render(
                <NovoFormularioEditaAta
                    {...propsBase}
                    precisaProfessorGremio={true}
                />,
        );

            await waitFor(() => {
                expect(
                    utils.adicionaProfessorGremioNaLista,
                ).toHaveBeenCalled();
            });

            const chamadas =
                utils.adicionaProfessorGremioNaLista.mock.calls;

            expect(
                chamadas.some(
                    (call) =>
                        call[2]?.nome === "Professor João" &&
                        call[2]?.identificacao === "1234567",
                ),
            ).toBeTruthy();
        });
    });

    describe("sincronização dos comentários", () => {
        it("deve renderizar comentários recebidos do stateFormEditarAta", async () => {
            const { container } = render(
                <NovoFormularioEditaAta
                    {...propsBase}
                />
            );

            await waitFor(() => {
                const textarea = container.querySelector(
                    'textarea[name="stateFormEditarAta.comentarios"]'
                );

                expect(textarea).toBeInTheDocument();
                expect(textarea.value).toBe("Comentário carregado da API");
            });
        });

        it("deve aceitar comentários vazios quando vier null", async () => {
            const { container } = render(
                <NovoFormularioEditaAta
                    {...propsBase}
                    stateFormEditarAta={{
                        ...propsBase.stateFormEditarAta,
                        data_reuniao: null,
                        comentarios: null,
                    }}
                />,
            );

            await waitFor(() => {
                const textarea = container.querySelector(
                    'textarea[name="stateFormEditarAta.comentarios"]',
                );

                expect(textarea.value).toBe("");
            });
        });
    });

    it("não deve permitir selecionar uma data de reunião posterior à data atual", async () => {
        render(
            <NovoFormularioEditaAta
                {...propsBase}
                precisaProfessorGremio={false}
            />,
        );

        await waitFor(() => {
            expect(mockDatePickerField).toHaveBeenCalled();
        });

        const propsDoCampoData = mockDatePickerField.mock.calls
            .map(([props]) => props)
            .find(
                (props) => props.name === "stateFormEditarAta.data_reuniao",
            );

        expect(propsDoCampoData).toBeDefined();
        expect(propsDoCampoData.maxDate).toEqual(dataFixaAtual);
    });

    describe("composição por data com vacância de cargos", () => {
        const obtemPropsDoCampoData = () =>
            mockDatePickerField.mock.calls
                .map(([props]) => props)
                .reverse()
                .find(
                    (props) =>
                        props.name === "stateFormEditarAta.data_reuniao",
                );

        const alteraDataDaReuniao = async (novaData) => {
            await waitFor(() => {
                expect(obtemPropsDoCampoData()).toBeDefined();
            });

            await act(async () => {
                obtemPropsDoCampoData().onChange(
                    "stateFormEditarAta.data_reuniao",
                    novaData,
                );
            });
        };

        it("deve buscar a composição com vacância quando a flag historico-de-membros-v2 estiver ativa", async () => {
            visoesService.featureFlagAtiva.mockReturnValue(true);

            render(<NovoFormularioEditaAta {...propsBase} />);

            await alteraDataDaReuniao(new Date(2026, 8, 25));

            await waitFor(() => {
                expect(getCargosComposicaoVacanciaPorDataEAssociacao).toHaveBeenCalledWith(
                    "2026-09-25",
                    "assoc-1",
                );
            });
            expect(visoesService.featureFlagAtiva).toHaveBeenCalledWith(
                "historico-de-membros-v2",
            );
            expect(getCargosComposicaoData).not.toHaveBeenCalled();
        });

        it("deve buscar a composição padrão quando a flag historico-de-membros-v2 estiver inativa", async () => {
            render(<NovoFormularioEditaAta {...propsBase} />);

            await alteraDataDaReuniao(new Date(2026, 8, 25));

            await waitFor(() => {
                expect(getCargosComposicaoData).toHaveBeenCalledWith(
                    "2026-09-25",
                    "assoc-1",
                );
            });
            expect(getCargosComposicaoVacanciaPorDataEAssociacao).not.toHaveBeenCalled();
        });

        it("deve exibir cargo vago como ausente, sem nome e com a data de vacância formatada", async () => {
            visoesService.featureFlagAtiva.mockReturnValue(true);
            getCargosComposicaoVacanciaPorDataEAssociacao.mockResolvedValue({
                vice_presidente: {
                    id: 2,
                    cargo_associacao_label: "Vice-presidente",
                    data_inicio_no_cargo: "2026-09-25",
                    vago: true,
                    ocupante_do_cargo: null,
                },
            });

            const { container } = render(
                <NovoFormularioEditaAta {...propsBase} />,
            );

            await alteraDataDaReuniao(new Date(2026, 8, 26));

            expect(
                await screen.findByText("Cargo vago desde 25/09/2026"),
            ).toBeInTheDocument();

            const inputNome = container.querySelector(
                'input[name="listaParticipantes[0].nome"]',
            );
            expect(inputNome.value).toBe("");

            const switchPresenca = screen
                .getByText("Ausente")
                .closest('[role="switch"]');
            expect(switchPresenca).toHaveAttribute("aria-checked", "false");
        });

        it("deve limpar o nome anterior quando a nova composição vier com cargo vago", async () => {
            getParticipantesOrdenadosPorCargoPaa.mockResolvedValue([
                {
                    id: 2,
                    cargo: "Vice-presidente",
                    identificacao: "1234567",
                    nome: "Nome Anterior",
                    membro: true,
                    presente: true,
                },
            ]);

            const { container } = render(
                <NovoFormularioEditaAta {...propsBase} />,
            );

            await waitFor(() => {
                expect(
                    container.querySelector(
                        'input[name="listaParticipantes[0].nome"]',
                    ).value,
                ).toBe("Nome Anterior");
            });

            visoesService.featureFlagAtiva.mockReturnValue(true);
            getCargosComposicaoVacanciaPorDataEAssociacao.mockResolvedValue({
                vice_presidente: {
                    id: 2,
                    cargo_associacao_label: "Vice-presidente",
                    data_inicio_no_cargo: "2026-09-25",
                    vago: true,
                    ocupante_do_cargo: null,
                },
            });

            await alteraDataDaReuniao(new Date(2026, 8, 26));

            await waitFor(() => {
                expect(
                    container.querySelector(
                        'input[name="listaParticipantes[0].nome"]',
                    ).value,
                ).toBe("");
            });
            expect(
                container.querySelector(
                    'input[name="listaParticipantes[0].identificacao"]',
                ).value,
            ).toBe("");
        });

        it("deve manter a data de vacância quando ela já vier formatada", async () => {
            getParticipantesOrdenadosPorCargoPaa.mockResolvedValue([
                {
                    id: 2,
                    cargo: "Vice-presidente",
                    membro: true,
                    presente: false,
                    vago: true,
                    data_inicio_no_cargo: "25/09/2026",
                },
            ]);

            render(<NovoFormularioEditaAta {...propsBase} />);

            expect(
                await screen.findByText("Cargo vago desde 25/09/2026"),
            ).toBeInTheDocument();
        });

        it("deve bloquear presença, presidente e secretário para cargo vago mesmo após clicar em Membro estava", async () => {
            visoesService.getPermissoes.mockReturnValue(true);
            getParticipantesOrdenadosPorCargoPaa.mockResolvedValue([
                {
                    id: 1,
                    cargo: "Presidente",
                    identificacao: "1234567",
                    nome: "Maria Silva",
                    membro: true,
                    presente: true,
                    vago: false,
                },
                {
                    id: 2,
                    cargo: "Vice-presidente",
                    membro: true,
                    presente: false,
                    vago: true,
                    data_inicio_no_cargo: "25/09/2026",
                },
            ]);

            render(<NovoFormularioEditaAta {...propsBase} />);

            await screen.findByText("Cargo vago desde 25/09/2026");

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

            const antesDoClique = obtemSwitches();

            expect(antesDoClique.presencaOcupado).toBeEnabled();
            expect(antesDoClique.presidenteOcupado).toBeEnabled();
            expect(antesDoClique.secretarioOcupado).toBeEnabled();

            expect(antesDoClique.presencaVago).toBeDisabled();

            fireEvent.click(antesDoClique.presencaVago);

            const depoisDoClique = obtemSwitches();

            expect(depoisDoClique.presencaVago).toBeDisabled();
            expect(depoisDoClique.presencaVago).toHaveAttribute(
                "aria-checked",
                "false",
            );
            expect(depoisDoClique.presidenteVago).toBeDisabled();
            expect(depoisDoClique.secretarioVago).toBeDisabled();
        });
    });
});
