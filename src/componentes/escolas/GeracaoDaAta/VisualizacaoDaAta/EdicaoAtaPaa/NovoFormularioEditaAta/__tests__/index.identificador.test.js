import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { NovoFormularioEditaAta } from "../index";

import {
    getParticipantesOrdenadosPorCargoPaa,
    getListaPresentesPadraoPaa,
    getMembroPorIdentificadorPaa,
    getProfessorGremioInfo,
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

describe("NovoFormularioEditaAta - identificadores e professor do grêmio", () => {
    let consoleErrorSpy;

    beforeEach(() => {
        localStorage.setItem(ASSOCIACAO_UUID, "assoc-1");
        visoesService.getPermissoes.mockReturnValue(true);
        getListaPresentesPadraoPaa.mockResolvedValue([]);
        getCargosComposicaoVacanciaPorDataEAssociacao.mockResolvedValue({});
        consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
        jest.useRealTimers();
    });

    describe("participante comum (nova linha)", () => {
        // Adiciona uma linha nova (índice 1) e digita o identificador, sem sair do campo
        const preparaLinhaNova = async (identificador) => {
            const retorno = await renderForm([maria]);
            fireEvent.click(screen.getByText("+ Adicionar presente"));
            await waitFor(() => {
                expect(campo(retorno.container, 1, "nome")).toBeInTheDocument();
            });
            const input = campo(retorno.container, 1, "identificacao");
            fireEvent.change(input, {
                target: { name: "listaParticipantes[1].identificacao", value: identificador },
            });
            return { ...retorno, input };
        };

        it("deve limpar nome e cargo ao alterar o identificador", async () => {
            const { container } = await preparaLinhaNova("1");
            fireEvent.change(campo(container, 1, "nome"), {
                target: { name: "listaParticipantes[1].nome", value: "Digitado" },
            });
            fireEvent.change(campo(container, 1, "identificacao"), {
                target: { name: "listaParticipantes[1].identificacao", value: "12" },
            });
            await waitFor(() => {
                expect(campo(container, 1, "nome").value).toBe("");
            });
        });

        it("deve exibir os rótulos conforme o tipo de identificador", async () => {
            const { container } = await renderForm([
                { ...maria, identificacao: "1234567" },
                { ...visitante, id: 11, identificacao: "12345", nome: "Aluno" },
                { ...visitante, id: 12, identificacao: "529.982.247-25", nome: "Cidadao" },
            ]);
            expect(campo(container, 2, "nome")).toBeInTheDocument();
            expect(screen.getByText("RF")).toBeInTheDocument();
            expect(screen.getByText("Código EOL do aluno")).toBeInTheDocument();
            expect(screen.getByText("CPF")).toBeInTheDocument();
            expect(screen.getAllByText("Cargo")).toHaveLength(3);
        });

        it("deve exibir rótulos opcionais para identificador não reconhecido", async () => {
            await renderForm([maria, { ...visitante, identificacao: "xyz" }]);
            expect(screen.getAllByText("Identificador (opcional)")).toHaveLength(1);
            expect(screen.getAllByText("Cargo (opcional)")).toHaveLength(1);
        });

        it("não deve buscar quando o campo é desfocado vazio", async () => {
            const { input } = await preparaLinhaNova("");
            fireEvent.blur(input);
            expect(getMembroPorIdentificadorPaa).not.toHaveBeenCalled();
        });

        it("não deve buscar novamente quando o identificador não mudou desde o último blur", async () => {
            getMembroPorIdentificadorPaa.mockResolvedValue({
                mensagem: "membro-encontrado",
                nome: "Fulano",
                cargo: "Tesoureiro",
            });
            const { input } = await preparaLinhaNova("1234567");
            fireEvent.blur(input);
            await waitFor(() => expect(getMembroPorIdentificadorPaa).toHaveBeenCalledTimes(1));
            fireEvent.blur(input);
            expect(getMembroPorIdentificadorPaa).toHaveBeenCalledTimes(1);
        });

        it("RF encontrado: preenche nome e cargo e marca como membro", async () => {
            getMembroPorIdentificadorPaa.mockResolvedValue({
                mensagem: "membro-encontrado",
                nome: "Fulano",
                cargo: "Tesoureiro",
            });
            const { container, input } = await preparaLinhaNova("1234567");
            fireEvent.blur(input);

            await waitFor(() => {
                expect(campo(container, 1, "nome").value).toBe("Fulano");
            });
            expect(campo(container, 1, "cargo").value).toBe("Tesoureiro");
            expect(getMembroPorIdentificadorPaa).toHaveBeenCalledWith(
                "uuid-123",
                "1234567",
                expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
            );
        });

        it("RF não encontrado: alerta e mantém campos vazios quando a API não envia nome", async () => {
            getMembroPorIdentificadorPaa.mockResolvedValue({
                mensagem: "servidor-nao-encontrado",
            });
            const { container, input } = await preparaLinhaNova("1234567");
            fireEvent.blur(input);

            await waitFor(() => {
                expect(toastCustom.ToastCustomWarning).toHaveBeenCalledWith(
                    "Membro não encontrado",
                );
            });
            expect(campo(container, 1, "nome").value).toBe("");
        });

        it("RF não encontrado: usa nome e cargo devolvidos pela API", async () => {
            getMembroPorIdentificadorPaa.mockResolvedValue({
                mensagem: "servidor-nao-encontrado",
                nome: "Parcial",
                cargo: "Cargo X",
            });
            const { container, input } = await preparaLinhaNova("1234567");
            fireEvent.blur(input);

            await waitFor(() => {
                expect(campo(container, 1, "nome").value).toBe("Parcial");
            });
            expect(campo(container, 1, "cargo").value).toBe("Cargo X");
        });

        it("RF com resposta de encontrado sem nome/cargo: mantém vazios", async () => {
            getMembroPorIdentificadorPaa.mockResolvedValue({ mensagem: "ok" });
            const { container, input } = await preparaLinhaNova("1234567");
            fireEvent.blur(input);
            await waitFor(() => expect(getMembroPorIdentificadorPaa).toHaveBeenCalled());
            expect(campo(container, 1, "nome").value).toBe("");
            expect(campo(container, 1, "cargo").value).toBe("");
        });

        it("RF com erro 400: alerta membro não encontrado", async () => {
            getMembroPorIdentificadorPaa.mockRejectedValue({ response: { status: 400 } });
            const { input } = await preparaLinhaNova("1234567");
            fireEvent.blur(input);
            await waitFor(() => {
                expect(toastCustom.ToastCustomWarning).toHaveBeenCalledWith(
                    "Membro não encontrado",
                );
            });
        });

        it("RF com erro genérico: alerta erro ao buscar o membro", async () => {
            getMembroPorIdentificadorPaa.mockRejectedValue(new Error("falha"));
            const { input } = await preparaLinhaNova("1234567");
            fireEvent.blur(input);
            await waitFor(() => {
                expect(toastCustom.ToastCustomWarning).toHaveBeenCalledWith(
                    "Erro ao buscar o membro",
                );
            });
        });

        it("código EOL (5 dígitos) encontrado: preenche e bloqueia nome/cargo", async () => {
            getMembroPorIdentificadorPaa.mockResolvedValue({
                mensagem: "ok",
                nome: "Aluno Y",
                cargo: "Aluno",
            });
            const { container, input } = await preparaLinhaNova("12345");
            fireEvent.blur(input);
            await waitFor(() => {
                expect(campo(container, 1, "nome").value).toBe("Aluno Y");
            });
            expect(campo(container, 1, "nome")).toBeDisabled();
            expect(campo(container, 1, "cargo")).toBeDisabled();
        });

        it("código EOL (5 dígitos) não encontrado: libera nome/cargo", async () => {
            getMembroPorIdentificadorPaa.mockResolvedValue({
                mensagem: "servidor-nao-encontrado",
            });
            const { container, input } = await preparaLinhaNova("12345");
            fireEvent.blur(input);
            await waitFor(() => expect(getMembroPorIdentificadorPaa).toHaveBeenCalled());
            await waitFor(() => {
                expect(campo(container, 1, "nome")).toBeEnabled();
            });
            expect(campo(container, 1, "cargo")).toBeEnabled();
        });

        it("CPF válido de membro: preenche e bloqueia nome/cargo", async () => {
            getMembroPorIdentificadorPaa.mockResolvedValue({
                mensagem: "membro-encontrado",
                nome: "Cidadã",
                cargo: "Pai",
            });
            const { container, input } = await preparaLinhaNova("529.982.247-25");
            fireEvent.blur(input);
            await waitFor(() => {
                expect(campo(container, 1, "nome").value).toBe("Cidadã");
            });
            expect(campo(container, 1, "nome")).toBeDisabled();
        });

        it("CPF válido que não é membro: libera nome/cargo", async () => {
            getMembroPorIdentificadorPaa.mockResolvedValue({ mensagem: "nao-membro" });
            const { container, input } = await preparaLinhaNova("529.982.247-25");
            fireEvent.blur(input);
            await waitFor(() => expect(getMembroPorIdentificadorPaa).toHaveBeenCalled());
            await waitFor(() => {
                expect(campo(container, 1, "nome")).toBeEnabled();
            });
        });

        it("identificador livre (fora dos formatos): não consulta a API e libera campos", async () => {
            const { container, input } = await preparaLinhaNova("ab");
            fireEvent.blur(input);
            expect(getMembroPorIdentificadorPaa).not.toHaveBeenCalled();
            expect(campo(container, 1, "nome")).toBeEnabled();
            expect(campo(container, 1, "cargo")).toBeEnabled();
        });
    });

    describe("professor orientador do grêmio", () => {
        const renderProfessor = async (lista = [maria]) => {
            getParticipantesOrdenadosPorCargoPaa.mockResolvedValue(lista);
            const formRef = { current: null };
            const retorno = render(
                <NovoFormularioEditaAta
                    {...propsBase}
                    formRef={formRef}
                    precisaProfessorGremio={true}
                />,
            );
            const idxProf = lista.length;
            await waitFor(() => {
                expect(campo(retorno.container, idxProf, "identificacao")).toBeInTheDocument();
            });
            return {
                ...retorno,
                formRef,
                idxProf,
                input: campo(retorno.container, idxProf, "identificacao"),
            };
        };

        const digita = (input, idx, value) =>
            fireEvent.change(input, {
                target: { name: `listaParticipantes[${idx}].identificacao`, value },
            });

        it("deve exibir a linha do professor com rótulos específicos e nome/cargo bloqueados", async () => {
            const { container, idxProf } = await renderProfessor();
            expect(screen.getByText("RF Professor Orientador do Grêmio")).toBeInTheDocument();
            expect(campo(container, idxProf, "nome")).toBeDisabled();
            expect(campo(container, idxProf, "cargo")).toBeDisabled();
            expect(campo(container, idxProf, "identificacao")).toBeEnabled();
        });

        it("blur com RF encontrado: preenche, alerta sucesso e bloqueia nome/cargo", async () => {
            getProfessorGremioInfo.mockResolvedValue({
                mensagem: "ok",
                nome: "Prof. Ana",
                cargo: "Professora",
            });
            const { container, idxProf, input } = await renderProfessor();
            digita(input, idxProf, "1234567");
            fireEvent.blur(input);

            await waitFor(() => {
                expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
                    "Participante inserido com sucesso",
                );
            });
            expect(campo(container, idxProf, "nome").value).toBe("Prof. Ana");
            expect(campo(container, idxProf, "cargo").value).toBe("Professora / Professor Orientador");
        });

        it("blur com RF não encontrado: não alerta sucesso", async () => {
            getProfessorGremioInfo.mockResolvedValue({ mensagem: "servidor-nao-encontrado" });
            const { idxProf, input } = await renderProfessor();
            digita(input, idxProf, "1234567");
            fireEvent.blur(input);

            await waitFor(() => expect(getProfessorGremioInfo).toHaveBeenCalledWith("1234567"));
            expect(toastCustom.ToastCustomSuccess).not.toHaveBeenCalled();
        });

        it("blur com resposta vazia da API: trata como não encontrado", async () => {
            getProfessorGremioInfo.mockResolvedValue(undefined);
            const { idxProf, input } = await renderProfessor();
            digita(input, idxProf, "1234567");
            fireEvent.blur(input);

            await waitFor(() => expect(getProfessorGremioInfo).toHaveBeenCalled());
            expect(toastCustom.ToastCustomSuccess).not.toHaveBeenCalled();
        });

        it("blur com erro 400: alerta professor não encontrado", async () => {
            getProfessorGremioInfo.mockRejectedValue({ response: { status: 400 } });
            const { idxProf, input } = await renderProfessor();
            digita(input, idxProf, "1234567");
            fireEvent.blur(input);

            await waitFor(() => {
                expect(toastCustom.ToastCustomWarning).toHaveBeenCalledWith(
                    "Professor Orientador do Grêmio não encontrado",
                );
            });
        });

        it("blur com erro genérico: alerta erro ao buscar professor", async () => {
            getProfessorGremioInfo.mockRejectedValue(new Error("falha"));
            const { idxProf, input } = await renderProfessor();
            digita(input, idxProf, "1234567");
            fireEvent.blur(input);

            await waitFor(() => {
                expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
                    "Erro ao buscar professor do grêmio",
                );
            });
        });

        it("blur com RF inválido: alerta RF inválido", async () => {
            const { idxProf, input } = await renderProfessor();
            digita(input, idxProf, "123");
            fireEvent.blur(input);

            await waitFor(() => {
                expect(toastCustom.ToastCustomWarning).toHaveBeenCalledWith(
                    "RF do Professor Orientador do Grêmio inválido",
                );
            });
            expect(getProfessorGremioInfo).not.toHaveBeenCalled();
        });

        it("não deve repetir a busca ao desfocar duas vezes o mesmo RF", async () => {
            getProfessorGremioInfo.mockResolvedValue({ mensagem: "ok", nome: "P", cargo: "C" });
            const { idxProf, input } = await renderProfessor();
            digita(input, idxProf, "1234567");
            fireEvent.blur(input);
            await waitFor(() => expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledTimes(1));
            fireEvent.blur(input);
            expect(getProfessorGremioInfo).toHaveBeenCalledTimes(1);
        });

        describe("busca com debounce ao digitar", () => {
            // Usa timers falsos apenas depois do carregamento inicial
            const avancaDebounce = async () => {
                await act(async () => {
                    jest.advanceTimersByTime(500);
                });
            };

            it("RF com 7 dígitos encontrado: preenche após o debounce", async () => {
                getProfessorGremioInfo.mockResolvedValue({
                    mensagem: "ok",
                    nome: "Prof. Beto",
                    cargo: "Professor",
                });
                const { container, idxProf, input } = await renderProfessor();
                jest.useFakeTimers();
                digita(input, idxProf, "1234567");
                expect(getProfessorGremioInfo).not.toHaveBeenCalled();
                await avancaDebounce();

                expect(getProfessorGremioInfo).toHaveBeenCalledWith("1234567");
                await waitFor(() => {
                    expect(campo(container, idxProf, "nome").value).toBe("Prof. Beto");
                });
            });

            it("deve descartar a busca anterior quando o campo é alterado antes do debounce", async () => {
                getProfessorGremioInfo.mockResolvedValue({ mensagem: "ok", nome: "P", cargo: "C" });
                const { idxProf, input } = await renderProfessor();
                jest.useFakeTimers();
                digita(input, idxProf, "1234567");
                digita(input, idxProf, "7654321");
                await avancaDebounce();

                expect(getProfessorGremioInfo).toHaveBeenCalledTimes(1);
                expect(getProfessorGremioInfo).toHaveBeenCalledWith("7654321");
            });

            it("RF não encontrado: mantém campos vazios", async () => {
                getProfessorGremioInfo.mockResolvedValue({
                    mensagem: "servidor-nao-encontrado",
                    nome: "Sobra",
                    cargo: "Cargo",
                });
                const { container, idxProf, input } = await renderProfessor();
                jest.useFakeTimers();
                digita(input, idxProf, "1234567");
                await avancaDebounce();

                await waitFor(() => {
                    expect(campo(container, idxProf, "nome").value).toBe("Sobra");
                });
            });

            it("erro na busca: registra o erro e limpa os campos", async () => {
                getProfessorGremioInfo.mockRejectedValue(new Error("falha"));
                const { container, idxProf, input } = await renderProfessor();
                jest.useFakeTimers();
                digita(input, idxProf, "1234567");
                await avancaDebounce();

                await waitFor(() => {
                    expect(consoleErrorSpy).toHaveBeenCalledWith(
                        "Erro ao buscar professor do grêmio",
                        expect.any(Error),
                    );
                });
                expect(campo(container, idxProf, "nome").value).toBe("");
            });

            it("identificador incompleto: limpa os campos sem consultar a API", async () => {
                const { container, idxProf, input } = await renderProfessor();
                digita(input, idxProf, "12");
                expect(getProfessorGremioInfo).not.toHaveBeenCalled();
                await waitFor(() => {
                    expect(campo(container, idxProf, "identificacao").value).toBe("12");
                });
            });

            it("deve cancelar buscas pendentes ao desmontar o componente", async () => {
                const { unmount, idxProf, input } = await renderProfessor();
                jest.useFakeTimers();
                digita(input, idxProf, "1234567");
                unmount();
                await avancaDebounce();
                expect(getProfessorGremioInfo).not.toHaveBeenCalled();
            });
        });
    });
});
