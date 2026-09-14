import React from "react";
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Comissoes } from "../index";

import { getUnidade } from "../../../../../services/dres/Unidades.service";
import {
    getMembrosComissao,
    getComissoes,
    postMembroComissao,
    patchMembroComissao,
    deleteMembroComissao,
} from "../../../../../services/dres/Comissoes.service";
import { consultarRF } from "../../../../../services/escolas/Associacao.service";

jest.mock("../../../../../services/dres/Unidades.service");
jest.mock("../../../../../services/dres/Comissoes.service");
jest.mock("../../../../../services/escolas/Associacao.service");

jest.mock("../TopoComBotoes", () => ({
    TopoComBotoes: ({ handleOnShowModalAdicao }) => (
        <button onClick={handleOnShowModalAdicao}>Adicionar</button>
    ),
}));

let capturedFiltrosProps = null;
jest.mock("../FormFiltros", () => ({
    Filtros: (props) => {
        capturedFiltrosProps = props;
        return <div>Filtros</div>;
    },
}));

let capturedHandleOnShowModalEdicao = null;
jest.mock("../ListaComissoes", () => ({
    ListaComissoes: ({ handleOnShowModalEdicao }) => {
        capturedHandleOnShowModalEdicao = handleOnShowModalEdicao;
        return <div>ListaComissoes</div>;
    },
}));

jest.mock("../../../../Globais/MenuInterno", () => ({
    MenuInterno: () => <div>Menu</div>,
}));

jest.mock("../../../../../utils/Loading", () => () => <div>Loading...</div>);

jest.mock(
    "../../../../sme/Parametrizacoes/Estrutura/Acoes/components/ModalInfoNaoPodeGravar",
    () => ({
        ModalInfoNaoPodeGravar: ({ show, texto, handleClose }) =>
            show ? (
                <div data-testid="modal-info-nao-pode-gravar">
                    {texto}
                    <button onClick={handleClose}>Fechar aviso</button>
                </div>
            ) : null,
    })
);

let capturedAdicaoProps = null;
let capturedEdicaoProps = null;
let capturedExclusaoProps = null;
jest.mock("../Modais", () => ({
    ModalAdicionarMembroComissao: (props) => {
        capturedAdicaoProps = props;
        return props.show ? <div data-testid="modal-adicao">Modal Adição Aberto</div> : null;
    },
    ModalEditarMembroComissao: (props) => {
        capturedEdicaoProps = props;
        return props.show ? <div data-testid="modal-edicao">Modal Edição Aberto</div> : null;
    },
    ModalConfirmaExclusaoMembroComissao: (props) => {
        capturedExclusaoProps = props;
        return props.show ? <div data-testid="modal-exclusao">Modal Exclusão</div> : null;
    },
}));

const mockDiretoria = { uuid: "dre-1", nome: "DRE Teste" };
const mockComissoes = [{ id: 1, nome: "Comissão A" }];
const mockMembros = [{ uuid: "m1", nome: "João" }];

const membroParaEditar = {
    uuid: "m1",
    rf: "1234567",
    nome: "Servidor Teste",
    email: "servidor@sme.com",
    comissoes: [{ id: 1 }, { id: 2 }],
};

const setup = async () => {
    render(<Comissoes />);
    await screen.findByText(/Comissões da Diretoria/i);
};

beforeEach(() => {
    jest.clearAllMocks();
    capturedAdicaoProps = null;
    capturedEdicaoProps = null;
    capturedExclusaoProps = null;
    capturedHandleOnShowModalEdicao = null;
    capturedFiltrosProps = null;

    getUnidade.mockResolvedValue(mockDiretoria);
    getComissoes.mockResolvedValue(mockComissoes);
    getMembrosComissao.mockResolvedValue(mockMembros);
    postMembroComissao.mockResolvedValue({});
    patchMembroComissao.mockResolvedValue({});
    deleteMembroComissao.mockResolvedValue({});
    consultarRF.mockResolvedValue({ status: 200, data: [{ nm_pessoa: "Nome Consultado" }] });
});

describe("Comissoes - handlers dos modais", () => {
    it("abre o modal de adição com o estado inicial limpo", async () => {
        await setup();

        fireEvent.click(screen.getByText("Adicionar"));

        expect(screen.getByTestId("modal-adicao")).toBeInTheDocument();
        expect(capturedAdicaoProps.estadoModal).toEqual({
            registro_funcional_modal: "",
            nome_modal: "",
            email_modal: "",
            comissoes_modal: [],
        });
        expect(capturedAdicaoProps.errosModal).toEqual({
            servidor_nao_encontrado: null,
            comissao_vazia: null,
            email_invalido: null,
        });
    });

    it("abre o modal de edição convertendo a lista de comissões para ids", async () => {
        await setup();

        act(() => {
            capturedHandleOnShowModalEdicao(membroParaEditar);
        });

        expect(screen.getByTestId("modal-edicao")).toBeInTheDocument();
        expect(capturedEdicaoProps.estadoModal).toEqual({
            uuid: "m1",
            registro_funcional_modal: "1234567",
            nome_modal: "Servidor Teste",
            email_modal: "servidor@sme.com",
            comissoes_modal: [1, 2],
        });
    });

    it("usa email vazio quando o membro editado não possui email", async () => {
        await setup();

        act(() => {
            capturedHandleOnShowModalEdicao({ ...membroParaEditar, email: null });
        });

        expect(capturedEdicaoProps.estadoModal.email_modal).toBe("");
    });

    it("atualiza um campo de texto do modal via handleOnChangeModal", async () => {
        await setup();
        fireEvent.click(screen.getByText("Adicionar"));

        act(() => {
            capturedAdicaoProps.handleOnChangeModal("email_modal", "novo@sme.com");
        });

        expect(capturedAdicaoProps.estadoModal.email_modal).toBe("novo@sme.com");
    });

    it("atualiza as comissões selecionadas via handleOnChangeMultipleSelectModal", async () => {
        await setup();
        fireEvent.click(screen.getByText("Adicionar"));

        await act(async () => {
            await capturedAdicaoProps.handleOnChangeMultipleSelectModal([1, 2, 3]);
        });

        expect(capturedAdicaoProps.estadoModal.comissoes_modal).toEqual([1, 2, 3]);
    });

    it("atualiza o RF quando o valor digitado é apenas numérico", async () => {
        await setup();
        fireEvent.click(screen.getByText("Adicionar"));

        act(() => {
            capturedAdicaoProps.handleOnChangeRegistroFuncional({
                target: { name: "registro_funcional_modal", value: "123456" },
            });
        });

        expect(capturedAdicaoProps.estadoModal.registro_funcional_modal).toBe("123456");
    });

    it("ignora o valor do RF quando contém caracteres não numéricos", async () => {
        await setup();
        fireEvent.click(screen.getByText("Adicionar"));

        act(() => {
            capturedAdicaoProps.handleOnChangeRegistroFuncional({
                target: { name: "registro_funcional_modal", value: "abc123" },
            });
        });

        expect(capturedAdicaoProps.estadoModal.registro_funcional_modal).toBe("");
    });

    it("busca o nome do servidor ao perder o foco do RF com sucesso", async () => {
        await setup();
        fireEvent.click(screen.getByText("Adicionar"));

        act(() => {
            capturedAdicaoProps.handleOnChangeRegistroFuncional({
                target: { name: "registro_funcional_modal", value: "1234567" },
            });
        });

        await act(async () => {
            await capturedAdicaoProps.handleOnBlurRegistroFuncional();
        });

        expect(consultarRF).toHaveBeenCalledWith("1234567");
        expect(capturedAdicaoProps.estadoModal.nome_modal).toBe("Nome Consultado");
        expect(capturedAdicaoProps.errosModal.servidor_nao_encontrado).toBeNull();
    });

    it("marca erro de servidor não encontrado quando a consulta de RF falha", async () => {
        consultarRF.mockRejectedValue(new Error("Não encontrado"));
        await setup();
        fireEvent.click(screen.getByText("Adicionar"));

        await act(async () => {
            await capturedAdicaoProps.handleOnBlurRegistroFuncional();
        });

        expect(capturedAdicaoProps.estadoModal.nome_modal).toBe("");
        expect(capturedAdicaoProps.errosModal.servidor_nao_encontrado).toBe(
            "Servidor não encontrado"
        );
    });

    it("não submete e marca erro de campo obrigatório quando o RF está vazio", async () => {
        await setup();
        fireEvent.click(screen.getByText("Adicionar"));

        await act(async () => {
            await capturedAdicaoProps.handleOnSubmitModal();
        });

        expect(capturedAdicaoProps.errosModal.servidor_nao_encontrado).toBe("Campo obrigatório");
        expect(postMembroComissao).not.toHaveBeenCalled();
    });

    it("não submete quando o servidor não foi encontrado na última consulta de RF", async () => {
        consultarRF.mockRejectedValue(new Error("Não encontrado"));
        await setup();
        fireEvent.click(screen.getByText("Adicionar"));

        act(() => {
            capturedAdicaoProps.handleOnChangeRegistroFuncional({
                target: { name: "registro_funcional_modal", value: "9999999" },
            });
        });
        await act(async () => {
            await capturedAdicaoProps.handleOnBlurRegistroFuncional();
        });

        await act(async () => {
            await capturedAdicaoProps.handleOnSubmitModal();
        });

        expect(postMembroComissao).not.toHaveBeenCalled();
    });

    it("marca erro de email inválido quando o formato é incorreto", async () => {
        await setup();
        fireEvent.click(screen.getByText("Adicionar"));

        act(() => {
            capturedAdicaoProps.handleOnChangeRegistroFuncional({
                target: { name: "registro_funcional_modal", value: "1234567" },
            });
        });
        act(() => {
            capturedAdicaoProps.handleOnChangeModal("email_modal", "email-invalido");
        });
        act(() => {
            capturedAdicaoProps.handleOnChangeMultipleSelectModal([1]);
        });

        await act(async () => {
            await capturedAdicaoProps.handleOnSubmitModal();
        });

        expect(capturedAdicaoProps.errosModal.email_invalido).toBe("Digite um email válido");
        expect(postMembroComissao).not.toHaveBeenCalled();
    });

    it("marca erro quando nenhuma comissão é selecionada", async () => {
        await setup();
        fireEvent.click(screen.getByText("Adicionar"));

        act(() => {
            capturedAdicaoProps.handleOnChangeRegistroFuncional({
                target: { name: "registro_funcional_modal", value: "1234567" },
            });
        });

        await act(async () => {
            await capturedAdicaoProps.handleOnSubmitModal();
        });

        expect(capturedAdicaoProps.errosModal.comissao_vazia).toBe(
            "Escolha pelo menos uma comissão"
        );
        expect(postMembroComissao).not.toHaveBeenCalled();
    });

    it("cria um novo membro com sucesso quando os campos são válidos", async () => {
        await setup();
        fireEvent.click(screen.getByText("Adicionar"));

        act(() => {
            capturedAdicaoProps.handleOnChangeRegistroFuncional({
                target: { name: "registro_funcional_modal", value: "1234567" },
            });
        });
        act(() => {
            capturedAdicaoProps.handleOnChangeModal("nome_modal", "Novo Servidor");
        });
        act(() => {
            capturedAdicaoProps.handleOnChangeMultipleSelectModal([1]);
        });

        await act(async () => {
            await capturedAdicaoProps.handleOnSubmitModal();
        });

        expect(postMembroComissao).toHaveBeenCalledWith({
            dre: "dre-1",
            rf: "1234567",
            nome: "Novo Servidor",
            email: "",
            comissoes: [1],
        });
        expect(screen.queryByTestId("modal-adicao")).not.toBeInTheDocument();
        await waitFor(() => {
            expect(getMembrosComissao).toHaveBeenCalledTimes(2);
        });
    });

    it("exibe o modal de aviso quando a criação falha com detail", async () => {
        postMembroComissao.mockRejectedValue({ response: { data: { detail: "Já existe" } } });
        await setup();
        fireEvent.click(screen.getByText("Adicionar"));

        act(() => {
            capturedAdicaoProps.handleOnChangeRegistroFuncional({
                target: { name: "registro_funcional_modal", value: "1234567" },
            });
        });
        act(() => {
            capturedAdicaoProps.handleOnChangeMultipleSelectModal([1]);
        });

        await act(async () => {
            await capturedAdicaoProps.handleOnSubmitModal();
        });

        expect(await screen.findByTestId("modal-info-nao-pode-gravar")).toHaveTextContent(
            "Já existe"
        );
    });

    it("loga o erro quando a criação falha sem detail", async () => {
        const erro = { response: { data: {} } };
        postMembroComissao.mockRejectedValue(erro);
        const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
        await setup();
        fireEvent.click(screen.getByText("Adicionar"));

        act(() => {
            capturedAdicaoProps.handleOnChangeRegistroFuncional({
                target: { name: "registro_funcional_modal", value: "1234567" },
            });
        });
        act(() => {
            capturedAdicaoProps.handleOnChangeMultipleSelectModal([1]);
        });

        await act(async () => {
            await capturedAdicaoProps.handleOnSubmitModal();
        });

        expect(consoleLogSpy).toHaveBeenCalledWith("ocorreu um erro ", erro);
        consoleLogSpy.mockRestore();
    });

    it("edita um membro existente com sucesso", async () => {
        await setup();

        act(() => {
            capturedHandleOnShowModalEdicao(membroParaEditar);
        });

        await act(async () => {
            await capturedEdicaoProps.handleOnSubmitModal();
        });

        expect(patchMembroComissao).toHaveBeenCalledWith("m1", {
            dre: "dre-1",
            rf: "1234567",
            nome: "Servidor Teste",
            email: "servidor@sme.com",
            comissoes: [1, 2],
        });
        expect(screen.queryByTestId("modal-edicao")).not.toBeInTheDocument();
        await waitFor(() => {
            expect(getMembrosComissao).toHaveBeenCalledTimes(2);
        });
    });

    it("exibe o modal de aviso quando a edição falha com detail", async () => {
        patchMembroComissao.mockRejectedValue({ response: { data: { detail: "Conflito" } } });
        await setup();

        act(() => {
            capturedHandleOnShowModalEdicao(membroParaEditar);
        });

        await act(async () => {
            await capturedEdicaoProps.handleOnSubmitModal();
        });

        expect(await screen.findByTestId("modal-info-nao-pode-gravar")).toHaveTextContent(
            "Conflito"
        );
    });

    it("loga o erro quando a edição falha sem detail", async () => {
        const erro = { response: { data: {} } };
        patchMembroComissao.mockRejectedValue(erro);
        const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
        await setup();

        act(() => {
            capturedHandleOnShowModalEdicao(membroParaEditar);
        });

        await act(async () => {
            await capturedEdicaoProps.handleOnSubmitModal();
        });

        expect(consoleLogSpy).toHaveBeenCalledWith("ocorreu um erro ", erro);
        consoleLogSpy.mockRestore();
    });

    it("fecha o aviso de não permitido ao clicar em Fechar", async () => {
        postMembroComissao.mockRejectedValue({ response: { data: { detail: "Já existe" } } });
        await setup();
        fireEvent.click(screen.getByText("Adicionar"));

        act(() => {
            capturedAdicaoProps.handleOnChangeRegistroFuncional({
                target: { name: "registro_funcional_modal", value: "1234567" },
            });
        });
        act(() => {
            capturedAdicaoProps.handleOnChangeMultipleSelectModal([1]);
        });

        await act(async () => {
            await capturedAdicaoProps.handleOnSubmitModal();
        });

        const modalAviso = await screen.findByTestId("modal-info-nao-pode-gravar");
        fireEvent.click(screen.getByText("Fechar aviso"));

        expect(modalAviso).not.toBeInTheDocument();
    });

    it("abre o modal de confirmação de exclusão a partir do modal de edição", async () => {
        await setup();

        act(() => {
            capturedHandleOnShowModalEdicao(membroParaEditar);
        });

        act(() => {
            capturedEdicaoProps.handleOnShowModalExclusao();
        });

        expect(screen.getByTestId("modal-exclusao")).toBeInTheDocument();
    });

    it("fecha o modal de exclusão ao chamar onHide", async () => {
        await setup();
        act(() => {
            capturedHandleOnShowModalEdicao(membroParaEditar);
        });
        act(() => {
            capturedEdicaoProps.handleOnShowModalExclusao();
        });

        act(() => {
            capturedExclusaoProps.onHide();
        });

        expect(screen.queryByTestId("modal-exclusao")).not.toBeInTheDocument();
    });

    it("exclui o membro com sucesso ao confirmar a exclusão", async () => {
        await setup();
        act(() => {
            capturedHandleOnShowModalEdicao(membroParaEditar);
        });
        act(() => {
            capturedEdicaoProps.handleOnShowModalExclusao();
        });

        await act(async () => {
            await capturedExclusaoProps.handleConfirmaExclusao();
        });

        expect(deleteMembroComissao).toHaveBeenCalledWith("m1");
        expect(screen.queryByTestId("modal-exclusao")).not.toBeInTheDocument();
        expect(screen.queryByTestId("modal-edicao")).not.toBeInTheDocument();
        await waitFor(() => {
            expect(getMembrosComissao).toHaveBeenCalledTimes(2);
        });
    });

    it("loga o erro quando a exclusão do membro falha", async () => {
        const erro = new Error("Falha ao excluir");
        deleteMembroComissao.mockRejectedValue(erro);
        const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
        await setup();
        act(() => {
            capturedHandleOnShowModalEdicao(membroParaEditar);
        });
        act(() => {
            capturedEdicaoProps.handleOnShowModalExclusao();
        });

        await act(async () => {
            await capturedExclusaoProps.handleConfirmaExclusao();
        });

        expect(consoleLogSpy).toHaveBeenCalledWith("ocorreu um erro ", erro);
        consoleLogSpy.mockRestore();
    });

    it("atualiza o estado dos filtros via handleOnChangeFiltros", async () => {
        await setup();

        act(() => {
            capturedFiltrosProps.handleOnChangeFiltros("filtrar_por_rf_ou_nome", "João");
        });

        expect(capturedFiltrosProps.estadoFiltros.filtrar_por_rf_ou_nome).toBe("João");
    });

    it("fecha o modal de adição ao chamar onHide", async () => {
        await setup();
        fireEvent.click(screen.getByText("Adicionar"));
        expect(screen.getByTestId("modal-adicao")).toBeInTheDocument();

        act(() => {
            capturedAdicaoProps.onHide();
        });

        expect(screen.queryByTestId("modal-adicao")).not.toBeInTheDocument();
    });

    it("fecha o modal de edição ao chamar onHide", async () => {
        await setup();
        act(() => {
            capturedHandleOnShowModalEdicao(membroParaEditar);
        });
        expect(screen.getByTestId("modal-edicao")).toBeInTheDocument();

        act(() => {
            capturedEdicaoProps.onHide();
        });

        expect(screen.queryByTestId("modal-edicao")).not.toBeInTheDocument();
    });
});
