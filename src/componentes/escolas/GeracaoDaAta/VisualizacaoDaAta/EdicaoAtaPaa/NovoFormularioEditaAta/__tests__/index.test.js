import React from "react";
import { render, waitFor } from "@testing-library/react";
import { NovoFormularioEditaAta } from "../index";

import {
    getParticipantesOrdenadosPorCargoPaa,
    getListaPresentesPadraoPaa,
} from "../../../../../../../services/escolas/PresentesAtaPaa.service";

import { getCargosComposicaoData } from "../../../../../../../services/Mandatos.service";

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
    beforeEach(() => {
        jest.clearAllMocks();

        localStorage.setItem("ASSOCIACAO_UUID", "assoc-1");

        getParticipantesOrdenadosPorCargoPaa.mockResolvedValue([]);
        getListaPresentesPadraoPaa.mockResolvedValue([]);
        getCargosComposicaoData.mockResolvedValue([]);

        utils.listaPossuiParticipantesAssociacao.mockReturnValue(true);

        utils.adicionaProfessorGremioNaLista.mockImplementation(
            (lista) => lista,
        );

        utils.extraiProfessorDefaults.mockReturnValue(null);
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
});
