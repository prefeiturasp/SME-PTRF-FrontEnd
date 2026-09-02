import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";

import { EdicaoAtaParecerTecnico } from "../EdicaoAta/index";

import {
    getListaPresentesPadrao,
    getAtaParecerTecnico,
    postEdicaoAtaParecerTecnico,
} from "../../../../../../services/dres/AtasParecerTecnico.service";

import { toastCustom } from "../../../../../Globais/ToastCustom";

import { useRecursoSelecionadoContext } from "../../../../../../context/RecursoSelecionado";
import { useParams } from "react-router-dom";

jest.mock("../../../../../../services/dres/AtasParecerTecnico.service");

jest.mock("../../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomError: jest.fn(),
        ToastCustomSuccess: jest.fn(),
    },
}));

jest.mock("../../../../../../context/RecursoSelecionado", () => ({
    useRecursoSelecionadoContext: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
}));

jest.mock("../TopoComBotoes", () => ({
    TopoComBotoes: ({
        onSubmitFormEdicaoAta,
        handleClickFecharAta,
    }) => (
        <div data-testid="topo-com-botoes">
            <button
                data-testid="btn-salvar"
                onClick={onSubmitFormEdicaoAta}
            >
                Salvar
            </button>

            <button
                data-testid="btn-fechar"
                onClick={handleClickFecharAta}
            >
                Fechar
            </button>
        </div>
    ),
}));

jest.mock("../EdicaoAta/FormularioEditarAta", () => {
    const React = require("react");

    return {
        FormularioEditaAta: ({
            listaPresentesPadrao,
            listaPresentes,
            stateFormEditarAta,
            formRef,
        }) => {
            React.useEffect(() => {
                formRef.current = {
                    values: {
                        stateFormEditarAta,
                        listaPresentes,
                    },
                };
            }, [
                formRef,
                stateFormEditarAta,
                listaPresentes,
            ]);

            return (
                <div data-testid="formulario-edita-ata">
                    <span data-testid="numero-ata">
                        {stateFormEditarAta.numero_ata}
                    </span>

                    <span data-testid="quantidade-presentes-padrao">
                        {listaPresentesPadrao.length}
                    </span>
                </div>
            );
        },
    };
});

const uuidAta = "uuid-ata-123";

const recursoSelecionado = {
    uuid: "uuid-recurso-123",
};

const dadosAta = {
    numero_ata: "ATA-001",
    data_reuniao: "2026-08-20",
    hora_reuniao: "14:30",
    local_reuniao: "Sala de reuniões",
    comentarios: "Comentários da ata",
    numero_portaria: "PORT-123",
    data_portaria: "2026-08-10",
    presentes_na_ata: [
        {
            uuid: "membro-1",
            nome: "João",
        },
        {
            uuid: "membro-2",
            nome: "Maria",
        },
    ],
    dre: {
        uuid: "uuid-dre-123",
    },
    eh_retificacao: false,
    eh_portaria_publicada: false,
};

const listaPresentesPadrao = [
    {
        uuid: "membro-1",
        nome: "João",
    },
    {
        uuid: "membro-2",
        nome: "Maria",
    },
    {
        uuid: "membro-3",
        nome: "José",
    },
];

const setupDefaultMocks = () => {
    useParams.mockReturnValue({
        uuid_ata: uuidAta,
    });

    useRecursoSelecionadoContext.mockReturnValue({
        recursoSelecionado,
    });

    getAtaParecerTecnico.mockResolvedValue(dadosAta);

    getListaPresentesPadrao.mockResolvedValue(listaPresentesPadrao);

    postEdicaoAtaParecerTecnico.mockResolvedValue({});
};

const renderComponent = () => {
    return render(<EdicaoAtaParecerTecnico />);
};

describe("EdicaoAtaParecerTecnico", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        setupDefaultMocks();
    });

    describe("Carregamento da ata", () => {
        it("deve consultar os dados da ata utilizando o uuid recebido pela rota", async () => {
            renderComponent();

            await waitFor(() => {
                expect(getAtaParecerTecnico).toHaveBeenCalledWith(
                    uuidAta
                );
            });
        });

        it("deve renderizar o topo e formulário após carregar os dados da ata", async () => {
            renderComponent();

            await waitFor(() => {
                expect(
                    screen.getByText("Editar ata de Parecer Técnico")
                ).toBeInTheDocument();
            });

            expect(
                screen.getByTestId("formulario-edita-ata")
            ).toBeInTheDocument();
        });

        it("deve preencher o formulário com os dados retornados pela ata", async () => {
            renderComponent();

            await waitFor(() => {
                expect(screen.getByTestId("numero-ata")).toHaveTextContent(
                    "ATA-001"
                );
            });
        });
    });

    describe("Consulta da lista padrão de presentes", () => {
        it("deve consultar a lista padrão utilizando DRE, ata e recurso", async () => {
            renderComponent();

            await waitFor(() => {
                expect(getListaPresentesPadrao).toHaveBeenCalledWith(
                    dadosAta.dre.uuid,
                    uuidAta,
                    recursoSelecionado.uuid
                );
            });
        });

        it("deve atualizar a lista de presentes padrão após a consulta", async () => {
            renderComponent();

            await waitFor(() => {
                expect(
                    screen.getByTestId("quantidade-presentes-padrao")
                ).toHaveTextContent("3");
            });
        });

        it("não deve consultar a lista padrão quando não houver recurso selecionado", async () => {
            useRecursoSelecionadoContext.mockReturnValue({
                recursoSelecionado: null,
            });

            renderComponent();

            await waitFor(() => {
                expect(getAtaParecerTecnico).toHaveBeenCalled();
            });

            expect(
                getListaPresentesPadrao
            ).not.toHaveBeenCalled();
        });

        it("não deve consultar a lista padrão quando a ata não possuir DRE", async () => {
            getAtaParecerTecnico.mockResolvedValue({
                ...dadosAta,
                dre: null,
            });

            renderComponent();

            await waitFor(() => {
                expect(getAtaParecerTecnico).toHaveBeenCalled();
            });

            expect(
                getListaPresentesPadrao
            ).not.toHaveBeenCalled();
        });

        it("deve exibir erro quando ocorrer falha ao consultar a lista padrão", async () => {
            const erro = {
                response: {
                    data: {
                        mensagem: "Erro retornado pela API",
                    },
                },
            };

            getListaPresentesPadrao.mockRejectedValue(erro);

            renderComponent();

            await waitFor(() => {
                expect(
                    toastCustom.ToastCustomError
                ).toHaveBeenCalledWith(
                    "Erro ao consultar lista de membros",
                    "Erro retornado pela API"
                );
            });
        });

        it("deve utilizar mensagem padrão quando o erro não possuir mensagem da API", async () => {
            getListaPresentesPadrao.mockRejectedValue(new Error());

            renderComponent();

            await waitFor(() => {
                expect(
                    toastCustom.ToastCustomError
                ).toHaveBeenCalledWith(
                    "Erro ao consultar lista de membros",
                    "Erro ao consultar lista de presentes padrão da ata"
                );
            });
        });
    });
});