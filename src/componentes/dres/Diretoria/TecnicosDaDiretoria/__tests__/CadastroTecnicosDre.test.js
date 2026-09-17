import React from "react";
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { CadastroTecnicosDre } from "../CadastroTecnicosDre";

jest.mock("../../../../../services/dres/TecnicosDre.service", () => ({
    getTecnicosDre: jest.fn(),
    createTecnicoDre: jest.fn(),
    deleteTecnicoDre: jest.fn(),
    getTecnicoDrePorRf: jest.fn(),
    updateTecnicoDre: jest.fn(),
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

let capturedTecnicoFormProps = null;
jest.mock("../TecnicoDreForm", () => ({
    TecnicoDreForm: (props) => {
        capturedTecnicoFormProps = props;
        return props.show ? <div data-testid="tecnico-dre-form">Form Técnico</div> : null;
    },
}));

let capturedConfirmaDeleteProps = null;
jest.mock("../ConfirmaDeleteTecnicoDialog", () => ({
    ConfirmaDeleteTecnico: (props) => {
        capturedConfirmaDeleteProps = props;
        return props.show ? <div data-testid="confirma-delete">Confirmar exclusão</div> : null;
    },
}));

const {
    getTecnicosDre,
    createTecnicoDre,
    deleteTecnicoDre,
    getTecnicoDrePorRf,
    updateTecnicoDre,
} = require("../../../../../services/dres/TecnicosDre.service");
const { consultarRF } = require("../../../../../services/escolas/Associacao.service");
const { visoesService } = require("../../../../../services/visoes.service");

const dadosDaDre = { uuid: "dre-uuid" };

const mockTecnicos = [
    { uuid: "tec-1", rf: "1111111", nome: "Técnico Um", email: "um@sme.com", telefone: "" },
    { uuid: "tec-2", rf: "2222222", nome: "Técnico Dois", email: "", telefone: "" },
];

const renderComponent = (props = {}) =>
    render(
        <MemoryRouter>
            <CadastroTecnicosDre dadosDaDre={dadosDaDre} {...props} />
        </MemoryRouter>
    );

const setup = async (props = {}) => {
    renderComponent(props);
    // "Lista de técnicos" aparece assim que loading=false, antes mesmo da lista
    // de técnicos ser efetivamente carregada (carregaTecnicos não é aguardada no
    // useEffect). Aguardamos o próprio nome de um técnico para garantir que o
    // fetch assíncrono já refletiu no estado antes de prosseguirmos.
    await screen.findByText("Técnico Um");
};

beforeEach(() => {
    jest.clearAllMocks();
    capturedTecnicoFormProps = null;
    capturedConfirmaDeleteProps = null;
    visoesService.getPermissoes.mockReturnValue(true);
    getTecnicosDre.mockResolvedValue(mockTecnicos);
    createTecnicoDre.mockResolvedValue({ status: 201 });
    updateTecnicoDre.mockResolvedValue({});
    deleteTecnicoDre.mockResolvedValue({ status: 204 });
    getTecnicoDrePorRf.mockResolvedValue([]);
    consultarRF.mockResolvedValue({ status: 200, data: [{ nm_pessoa: "Fulano Consultado" }] });
});

describe("CadastroTecnicosDre", () => {
    it("não renderiza nada quando a dre não possui uuid", async () => {
        getTecnicosDre.mockResolvedValue([]);
        renderComponent({ dadosDaDre: { uuid: undefined } });

        await waitFor(() => {
            expect(getTecnicosDre).toHaveBeenCalled();
        });

        expect(screen.queryByText("Lista de técnicos")).not.toBeInTheDocument();
    });

    it("exibe mensagem quando não há técnicos cadastrados", async () => {
        getTecnicosDre.mockResolvedValue([]);
        renderComponent();

        expect(
            await screen.findByText(/Não há nenhum técnico cadastrado ainda/i)
        ).toBeInTheDocument();
    });

    it("renderiza a tabela com os técnicos cadastrados", async () => {
        await setup();

        expect(screen.getByText("Técnico Um")).toBeInTheDocument();
        expect(screen.getByText("Técnico Dois")).toBeInTheDocument();
        expect(screen.getByText("1111111")).toBeInTheDocument();
    });

    it("abre o formulário de adição com valores vazios ao clicar em adicionar", async () => {
        await setup();

        fireEvent.click(screen.getByText(/adicionar/i));

        expect(screen.getByTestId("tecnico-dre-form")).toBeInTheDocument();
        expect(capturedTecnicoFormProps.initialValues).toEqual({
            uuid: "",
            rf: "",
            nome: "",
            email: "",
            telefone: "",
        });
    });

    it("abre o formulário de edição preenchido ao clicar em editar", async () => {
        await setup();

        fireEvent.click(screen.getAllByLabelText("Editar")[0]);

        expect(screen.getByTestId("tecnico-dre-form")).toBeInTheDocument();
        expect(capturedTecnicoFormProps.initialValues).toEqual({
            uuid: "tec-1",
            rf: "1111111",
            nome: "Técnico Um",
            email: "um@sme.com",
            telefone: "",
        });
    });

    it("fecha o formulário de técnico ao chamar handleClose", async () => {
        await setup();

        fireEvent.click(screen.getByText(/adicionar/i));
        expect(screen.getByTestId("tecnico-dre-form")).toBeInTheDocument();

        act(() => {
            capturedTecnicoFormProps.handleClose();
        });

        expect(screen.queryByTestId("tecnico-dre-form")).not.toBeInTheDocument();
    });

    it("abre o diálogo de confirmação de exclusão preenchido ao clicar em excluir", async () => {
        await setup();

        fireEvent.click(screen.getAllByLabelText("Excluir")[1]);

        expect(screen.getByTestId("confirma-delete")).toBeInTheDocument();
        expect(capturedConfirmaDeleteProps.stateTecnicoForm).toEqual({
            uuid: "tec-2",
            rf: "2222222",
            nome: "Técnico Dois",
            email: "",
            telefone: "",
        });
    });

    it("fecha o diálogo de exclusão ao chamar onCancelDelete", async () => {
        await setup();

        fireEvent.click(screen.getAllByLabelText("Excluir")[0]);
        expect(screen.getByTestId("confirma-delete")).toBeInTheDocument();

        act(() => {
            capturedConfirmaDeleteProps.onCancelDelete();
        });

        expect(screen.queryByTestId("confirma-delete")).not.toBeInTheDocument();
    });

    it("exibe erro e não envia o formulário quando o email é inválido", async () => {
        await setup();
        fireEvent.click(screen.getByText(/adicionar/i));

        await act(async () => {
            await capturedTecnicoFormProps.onSubmit(
                { email: "email-invalido" },
                { setErrors: jest.fn() }
            );
        });

        expect(createTecnicoDre).not.toHaveBeenCalled();
    });

    it("cria um novo técnico com sucesso", async () => {
        await setup();
        fireEvent.click(screen.getByText(/adicionar/i));

        await act(async () => {
            await capturedTecnicoFormProps.onSubmit(
                { email: "novo@sme.com" },
                { setErrors: jest.fn() }
            );
        });

        expect(createTecnicoDre).toHaveBeenCalledWith({
            dre: "dre-uuid",
            rf: "",
            nome: "",
            email: "",
            telefone: "",
        });

        await waitFor(() => {
            expect(getTecnicosDre).toHaveBeenCalledTimes(2);
        });
    });

    it("loga técnico já existente quando a criação retorna 400 com rf", async () => {
        createTecnicoDre.mockResolvedValue({ status: 400, data: { rf: "Já existe" } });
        const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
        await setup();
        fireEvent.click(screen.getByText(/adicionar/i));

        await act(async () => {
            await capturedTecnicoFormProps.onSubmit({}, { setErrors: jest.fn() });
        });

        expect(consoleLogSpy).toHaveBeenCalledWith("Técnico já existe");
        consoleLogSpy.mockRestore();
    });

    it("loga erro genérico quando a criação retorna um status inesperado", async () => {
        const response = { status: 500 };
        createTecnicoDre.mockResolvedValue(response);
        const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
        await setup();
        fireEvent.click(screen.getByText(/adicionar/i));

        await act(async () => {
            await capturedTecnicoFormProps.onSubmit({}, { setErrors: jest.fn() });
        });

        expect(consoleLogSpy).toHaveBeenCalledWith("Erro ao criar Tecnico");
        expect(consoleLogSpy).toHaveBeenCalledWith(response);
        consoleLogSpy.mockRestore();
    });

    it("loga o erro quando a criação lança uma exceção", async () => {
        const erro = new Error("Falha ao criar");
        createTecnicoDre.mockRejectedValue(erro);
        const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
        await setup();
        fireEvent.click(screen.getByText(/adicionar/i));

        await act(async () => {
            await capturedTecnicoFormProps.onSubmit({}, { setErrors: jest.fn() });
        });

        expect(consoleLogSpy).toHaveBeenCalledWith(erro);
        consoleLogSpy.mockRestore();
    });

    it("atualiza um técnico existente com sucesso", async () => {
        await setup();
        fireEvent.click(screen.getAllByLabelText("Editar")[0]);

        await act(async () => {
            await capturedTecnicoFormProps.onSubmit({}, { setErrors: jest.fn() });
        });

        expect(updateTecnicoDre).toHaveBeenCalledWith(
            "tec-1",
            expect.objectContaining({ dre: "dre-uuid", uuid: "tec-1" })
        );
        await waitFor(() => {
            expect(getTecnicosDre).toHaveBeenCalledTimes(2);
        });
    });

    it("loga o erro quando a atualização falha", async () => {
        const erro = new Error("Falha ao editar");
        updateTecnicoDre.mockRejectedValue(erro);
        const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
        await setup();
        fireEvent.click(screen.getAllByLabelText("Editar")[0]);

        await act(async () => {
            await capturedTecnicoFormProps.onSubmit({}, { setErrors: jest.fn() });
        });

        expect(consoleLogSpy).toHaveBeenCalledWith("Erro ao editar técnico ", erro);
        consoleLogSpy.mockRestore();
    });

    it("valida o RF e marca erro quando o técnico já está cadastrado", async () => {
        getTecnicoDrePorRf.mockResolvedValue([{ uuid: "outro" }]);
        await setup();
        fireEvent.click(screen.getByText(/adicionar/i));

        let errors;
        await act(async () => {
            errors = await capturedTecnicoFormProps.validateForm({
                rf: "1234567",
                email: "",
                telefone: "",
            });
        });

        expect(consultarRF).toHaveBeenCalledWith("1234567");
        expect(errors).toEqual({ rf: "Técnico já cadastrado" });
    });

    it("valida o RF com sucesso quando o técnico ainda não está cadastrado", async () => {
        getTecnicoDrePorRf.mockResolvedValue([]);
        await setup();
        fireEvent.click(screen.getByText(/adicionar/i));

        let errors;
        await act(async () => {
            errors = await capturedTecnicoFormProps.validateForm({
                rf: "1234567",
                email: "",
                telefone: "",
            });
        });

        expect(errors).toEqual({});
    });

    it("marca erro de RF inválido quando a consulta falhar", async () => {
        consultarRF.mockRejectedValue(new Error("RF não encontrado"));
        await setup();
        fireEvent.click(screen.getByText(/adicionar/i));

        let errors;
        await act(async () => {
            errors = await capturedTecnicoFormProps.validateForm({
                rf: "0000000",
                email: "",
                telefone: "",
            });
        });

        expect(errors).toEqual({ rf: "RF inválido" });
    });

    it("exclui um técnico com sucesso", async () => {
        const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
        await setup();
        fireEvent.click(screen.getAllByLabelText("Excluir")[0]);

        await act(async () => {
            await capturedConfirmaDeleteProps.onConfirmDelete();
        });

        expect(deleteTecnicoDre).toHaveBeenCalledWith("tec-1", "");
        expect(consoleLogSpy).toHaveBeenCalledWith("Operação realizada com sucesso!");
        await waitFor(() => {
            expect(getTecnicosDre).toHaveBeenCalledTimes(2);
        });
        expect(screen.queryByTestId("confirma-delete")).not.toBeInTheDocument();

        consoleLogSpy.mockRestore();
    });

    it("loga erro quando a exclusão retorna status inesperado", async () => {
        deleteTecnicoDre.mockResolvedValue({ status: 500 });
        const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
        await setup();
        fireEvent.click(screen.getAllByLabelText("Excluir")[0]);

        await act(async () => {
            await capturedConfirmaDeleteProps.onConfirmDelete();
        });

        expect(consoleLogSpy).toHaveBeenCalledWith("Erro ao excluir Técnico");
        consoleLogSpy.mockRestore();
    });

    it("loga o erro quando a exclusão lança uma exceção", async () => {
        const erro = new Error("Falha ao excluir");
        deleteTecnicoDre.mockRejectedValue(erro);
        const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
        await setup();
        fireEvent.click(screen.getAllByLabelText("Excluir")[0]);

        await act(async () => {
            await capturedConfirmaDeleteProps.onConfirmDelete();
        });

        expect(consoleLogSpy).toHaveBeenCalledWith(erro);
        consoleLogSpy.mockRestore();
    });

    it("atualiza o técnico de substituição selecionado no diálogo de exclusão", async () => {
        await setup();
        fireEvent.click(screen.getAllByLabelText("Excluir")[0]);

        act(() => {
            capturedConfirmaDeleteProps.handleChangeSelectDeleteTecnico("tec-2");
        });

        expect(capturedConfirmaDeleteProps.stateSelectDeleteTecnico).toBe("tec-2");
    });

    it("marca o checkbox de não transferir e limpa o técnico selecionado", async () => {
        await setup();
        fireEvent.click(screen.getAllByLabelText("Excluir")[0]);

        act(() => {
            capturedConfirmaDeleteProps.handleChangeSelectDeleteTecnico("tec-2");
        });
        expect(capturedConfirmaDeleteProps.stateSelectDeleteTecnico).toBe("tec-2");

        await act(async () => {
            await capturedConfirmaDeleteProps.handleChangeCheckboxDeleteTecnico({
                target: { checked: true },
            });
        });

        expect(capturedConfirmaDeleteProps.stateCheckboxDeleteTecnico).toBe(true);
        expect(capturedConfirmaDeleteProps.stateSelectDeleteTecnico).toBe("");
    });

    it("habilita o link de conferir atribuições quando o usuário possui permissão", async () => {
        await setup();

        const link = screen.getAllByText(/Conferir atribuições/i)[0].closest("a");
        expect(link).toHaveAttribute("href", "/dre-atribuicoes/tec-1");
        expect(link).not.toHaveClass("link-desabilitado");
    });

    it("desabilita o link de conferir atribuições quando o usuário não possui permissão", async () => {
        visoesService.getPermissoes.mockImplementation(
            (permissoes) => !permissoes.includes("access_atribuicao_por_ue")
        );
        await setup();

        const link = screen.getAllByText(/Conferir atribuições/i)[0].closest("a");
        expect(link).not.toHaveAttribute("href", "/dre-atribuicoes/tec-1");
        expect(link).toHaveClass("link-desabilitado");
    });

    it("desabilita os botões de ação quando o usuário não possui permissão para alterar técnicos", async () => {
        visoesService.getPermissoes.mockImplementation(
            (permissoes) => !permissoes.includes("change_tecnicos_da_diretoria")
        );
        await setup();

        expect(screen.getByText(/adicionar/i).closest("button")).toBeDisabled();
        expect(screen.getAllByLabelText("Excluir")[0]).toBeDisabled();
    });
});
