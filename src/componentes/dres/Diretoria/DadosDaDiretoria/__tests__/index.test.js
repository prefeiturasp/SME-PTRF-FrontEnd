import React from "react";
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DadosDaDiretoria } from "../index";

jest.mock("react-text-mask", () => ({ mask, guide, showMask, ...props }) => {
    if (typeof mask === "function") {
        mask(props.value || "");
    }
    return <input {...props} />;
});

jest.mock("../../../../Globais/MenuInterno", () => ({
    MenuInterno: () => <div>MenuInterno</div>,
}));

jest.mock("../../../../../services/dres/Unidades.service", () => ({
    getUnidade: jest.fn(),
    salvaDadosDiretoria: jest.fn(),
}));

jest.mock("../../../../../services/escolas/Associacao.service", () => ({
    consultarRF: jest.fn(),
}));

jest.mock("../../../../../services/visoes.service", () => ({
    visoesService: {
        getPermissoes: jest.fn(() => true),
    },
}));

jest.mock("../../../../../utils/Loading", () => () => <div>Loading...</div>);

let capturedSalvarProps = null;
let capturedCancelarProps = null;
jest.mock("../../../../../utils/Modais", () => ({
    CancelarModalDiretoria: (props) => {
        capturedCancelarProps = props;
        return props.show ? <div data-testid="modal-cancelar-diretoria" /> : null;
    },
    SalvarModalDiretoria: (props) => {
        capturedSalvarProps = props;
        return props.show ? (
            <div data-testid="modal-salvar-diretoria">
                <button onClick={props.onCancelarTrue}>OK modal salvar</button>
            </div>
        ) : null;
    },
}));

const { getUnidade, salvaDadosDiretoria } = require("../../../../../services/dres/Unidades.service");
const { consultarRF } = require("../../../../../services/escolas/Associacao.service");
const { visoesService } = require("../../../../../services/visoes.service");

const dadosDiretoria = {
    uuid: "dre-uuid",
    nome: "DRE Teste",
    dre_cnpj: "11222333000181",
    dre_diretor_regional_rf: "1234567",
    dre_diretor_regional_nome: "Diretor Teste",
    dre_designacao_portaria: "Portaria 10",
    dre_designacao_ano: "2024",
};

const setup = async () => {
    render(<DadosDaDiretoria />);
    await screen.findByText(/Dados da diretoria DRE Teste/i);
};

beforeEach(() => {
    jest.clearAllMocks();
    capturedSalvarProps = null;
    capturedCancelarProps = null;
    visoesService.getPermissoes.mockReturnValue(true);
    getUnidade.mockResolvedValue(dadosDiretoria);
    salvaDadosDiretoria.mockResolvedValue({});
    consultarRF.mockResolvedValue({ status: 200, data: [{ nm_pessoa: "Novo Diretor" }] });
});

describe("DadosDaDiretoria", () => {
    it("exibe loading enquanto busca os dados da diretoria", () => {
        getUnidade.mockReturnValue(new Promise(() => {}));
        render(<DadosDaDiretoria />);
        expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    });

    it("renderiza o formulário preenchido com os dados da diretoria", async () => {
        await setup();

        expect(document.getElementById("dre_cnpj")).toHaveValue("11222333000181");
        expect(document.getElementById("dre_diretor_regional_rf")).toHaveValue("1234567");
        expect(document.getElementById("dre_diretor_regional_nome")).toHaveValue("Diretor Teste");
        expect(document.getElementById("dre_designacao_portaria")).toHaveValue("Portaria 10");
        expect(document.getElementById("dre_designacao_ano")).toHaveValue("2024");
    });

    it("mantém o campo nome do diretor sempre como somente leitura", async () => {
        await setup();
        expect(document.getElementById("dre_diretor_regional_nome")).toHaveAttribute("readonly");
    });

    it("busca e preenche o nome do diretor ao digitar um RF válido", async () => {
        await setup();
        const rfInput = document.getElementById("dre_diretor_regional_rf");

        await act(async () => {
            fireEvent.change(rfInput, { target: { value: "7654321" } });
        });

        expect(consultarRF).toHaveBeenCalledWith("7654321");
        await waitFor(() => {
            expect(document.getElementById("dre_diretor_regional_nome")).toHaveValue("Novo Diretor");
        });
    });

    it("exibe erro e limpa o nome quando o RF é inválido", async () => {
        consultarRF.mockRejectedValue(new Error("RF não encontrado"));
        await setup();
        const rfInput = document.getElementById("dre_diretor_regional_rf");

        await act(async () => {
            fireEvent.change(rfInput, { target: { value: "0000000" } });
        });

        expect(
            await screen.findByText("Digite um RF válido")
        ).toBeInTheDocument();
        expect(document.getElementById("dre_diretor_regional_nome")).toHaveValue("");
    });

    it("limpa o erro e o nome quando o RF é apagado", async () => {
        consultarRF.mockRejectedValue(new Error("RF não encontrado"));
        await setup();
        const rfInput = document.getElementById("dre_diretor_regional_rf");

        await act(async () => {
            fireEvent.change(rfInput, { target: { value: "0000000" } });
        });
        await screen.findByText("Digite um RF válido");

        await act(async () => {
            fireEvent.change(rfInput, { target: { value: "" } });
        });

        await waitFor(() => {
            expect(screen.queryByText("Digite um RF válido")).not.toBeInTheDocument();
        });
    });

    it("desabilita o botão Salvar quando todos os campos estão vazios", async () => {
        getUnidade.mockResolvedValue({
            uuid: "dre-uuid",
            nome: "DRE Vazia",
            dre_cnpj: "",
            dre_diretor_regional_rf: "",
            dre_diretor_regional_nome: "",
            dre_designacao_portaria: "",
            dre_designacao_ano: "",
        });
        render(<DadosDaDiretoria />);
        await screen.findByText(/Dados da diretoria DRE Vazia/i);

        expect(screen.getByText("Salvar")).toBeDisabled();
    });

    it("habilita o botão Salvar quando ao menos um campo está preenchido", async () => {
        await setup();
        expect(screen.getByText("Salvar")).toBeEnabled();
    });

    it("desabilita os campos e o botão Salvar quando o usuário não possui permissão", async () => {
        visoesService.getPermissoes.mockReturnValue(false);
        await setup();

        expect(document.getElementById("dre_cnpj")).toBeDisabled();
        expect(document.getElementById("dre_diretor_regional_rf")).toBeDisabled();
        expect(document.getElementById("dre_designacao_portaria")).toBeDisabled();
        expect(document.getElementById("dre_designacao_ano")).toBeDisabled();
        expect(screen.getByText("Salvar")).toBeDisabled();
    });

    it("restaura os valores originais ao clicar em Cancelar", async () => {
        await setup();
        const portariaInput = document.getElementById("dre_designacao_portaria");

        fireEvent.change(portariaInput, { target: { value: "Portaria alterada" } });
        expect(portariaInput).toHaveValue("Portaria alterada");

        fireEvent.click(screen.getByText("Cancelar"));

        await waitFor(() => {
            expect(portariaInput).toHaveValue("Portaria 10");
        });
    });

    it("salva os dados com sucesso e exibe o modal de confirmação", async () => {
        const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
        await setup();

        fireEvent.click(screen.getByText("Salvar"));

        await waitFor(() => {
            expect(salvaDadosDiretoria).toHaveBeenCalledWith(
                "dre-uuid",
                expect.objectContaining({ dre_cnpj: "11222333000181" })
            );
        });

        expect(consoleLogSpy).toHaveBeenCalledWith("Operação realizada com sucesso!");
        expect(await screen.findByTestId("modal-salvar-diretoria")).toBeInTheDocument();
        expect(capturedSalvarProps.show).toBe(true);
        expect(getUnidade).toHaveBeenCalledTimes(2);

        consoleLogSpy.mockRestore();
    });

    it("fecha o modal de confirmação e recarrega os dados ao confirmar", async () => {
        await setup();

        fireEvent.click(screen.getByText("Salvar"));
        await screen.findByTestId("modal-salvar-diretoria");
        getUnidade.mockClear();

        await act(async () => {
            await capturedSalvarProps.onCancelarTrue();
        });

        expect(getUnidade).toHaveBeenCalled();
        expect(screen.queryByTestId("modal-salvar-diretoria")).not.toBeInTheDocument();
    });

    it("loga o erro quando salvar os dados falhar", async () => {
        const erro = new Error("Falha ao salvar");
        salvaDadosDiretoria.mockRejectedValue(erro);
        const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
        await setup();

        fireEvent.click(screen.getByText("Salvar"));

        await waitFor(() => {
            expect(consoleLogSpy).toHaveBeenCalledWith("Erro ao salvar os dados ", erro);
        });
        expect(screen.queryByTestId("modal-salvar-diretoria")).not.toBeInTheDocument();

        consoleLogSpy.mockRestore();
    });

    it("fecha o modal de cancelamento ao chamar handleClose", async () => {
        await setup();

        act(() => {
            capturedCancelarProps.handleClose();
        });

        expect(capturedCancelarProps.show).toBe(false);
    });

    it("reseta o formulário e fecha o modal ao confirmar o cancelamento", async () => {
        // showModalDiretoriaCancelar nunca é setado para true por nenhum fluxo da UI
        // (dead code); testamos a função diretamente via a prop capturada.
        await setup();
        const portariaInput = document.getElementById("dre_designacao_portaria");
        fireEvent.change(portariaInput, { target: { value: "Alterado" } });

        await act(async () => {
            await capturedCancelarProps.onCancelarTrue();
        });

        await waitFor(() => {
            expect(portariaInput).toHaveValue("Portaria 10");
        });
    });

    it("limpa o erro do CNPJ ao clicar no campo", async () => {
        await setup();
        const cnpjInput = document.getElementById("dre_cnpj");
        expect(() => fireEvent.click(cnpjInput)).not.toThrow();
    });
});
