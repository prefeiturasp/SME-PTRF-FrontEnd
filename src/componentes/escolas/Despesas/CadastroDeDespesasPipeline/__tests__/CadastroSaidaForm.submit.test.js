import React from "react";
import {render, screen, fireEvent, waitFor, act} from "@testing-library/react";
import {useParams} from "react-router-dom";
import {CadastroSaidaForm} from "../CadastroSaidaForm";
import {DespesaContext} from "../../../../../context/Despesa";
import {
    getDespesasTabelas,
    criarDespesa,
    alterarDespesa,
    deleteDespesa,
    patchAtrelarSaidoDoRecurso,
} from "../../../../../services/escolas/Despesas.service";
import {getReceita} from "../../../../../services/escolas/Receitas.service";
import {ModalConfirm} from "../../../../Globais/Modal/ModalConfirm";
import {valida_cpf_cnpj, validaPayloadDespesas, metodosAuxiliares} from "../utils";

jest.mock("react-router-dom", () => ({useParams: jest.fn()}));
jest.mock("react-redux", () => ({useDispatch: () => jest.fn()}));
jest.mock("../../../../../services/escolas/Despesas.service", () => ({
    getDespesasTabelas: jest.fn(),
    criarDespesa: jest.fn(),
    alterarDespesa: jest.fn(),
    deleteDespesa: jest.fn(),
    patchAtrelarSaidoDoRecurso: jest.fn(),
}));
jest.mock("../../../../../services/escolas/Receitas.service", () => ({getReceita: jest.fn()}));
jest.mock("../../../../../services/visoes.service", () => ({
    visoesService: {getPermissoes: () => true},
}));
jest.mock("../../../../../services/auth.service", () => ({ASSOCIACAO_UUID: "UUID"}));
jest.mock("../../../../Globais/Modal/ModalConfirm", () => ({ModalConfirm: jest.fn()}));
jest.mock("../../../../../utils/Loading", () => () => <div data-testid="loading" />);
jest.mock("react-text-mask", () => (p) => (
    <input id={p.id} name={p.name} value={p.value ?? ""} onChange={p.onChange} onBlur={p.onBlur} onClick={p.onClick} />
));
jest.mock("../../../../Globais/DatePickerField", () => ({
    DatePickerField: (p) => (
        <input id={p.id} name={p.name} value={p.value ?? ""} onChange={(e) => p.onChange(p.name, e.target.value)} onFocus={p.onCalendarOpen} />
    ),
}));
jest.mock("../../../../Globais/ReactNumberFormatInput", () => ({
    ReactNumberFormatInput: (p) => (
        <input id={p.id} name={p.name} value={p.value ?? ""} onChange={p.onChangeEvent} />
    ),
}));
jest.mock("../utils", () => {
    const num = jest.requireActual("../utils/numericos");
    return {
        YupSignupSchemaCadastroDespesaSaida: require("yup").object(),
        validaPayloadDespesas: jest.fn(),
        cpfMaskContitional: jest.fn(),
        valida_cpf_cnpj: jest.fn(),
        trataNumericos: num.trataNumericos,
        apenasNumero: num.apenasNumero,
        metodosAuxiliares: {
            getPath: jest.fn(),
            exibeDocumentoTransacao: jest.fn(),
            get_nome_razao_social: jest.fn(),
            setValorRealizado: jest.fn(),
        },
    };
});

const aux = metodosAuxiliares;
const receita = (extra = {}) => ({
    valor: 100,
    acao_associacao: {uuid: "acao-uuid"},
    conta_associacao: {uuid: "conta-uuid"},
    ...extra,
});

const renderiza = async ({params = {uuid_receita: "r1"}, resp = receita(), tabelas} = {}) => {
    useParams.mockReturnValue(params);
    getReceita.mockResolvedValue({data: resp});
    getDespesasTabelas.mockResolvedValue(tabelas || {
        tipos_documento: [{id: 1, nome: "NF", numero_documento_digitado: true, apenas_digitos: true}],
        tipos_transacao: [{id: 1, nome: "Cheque"}],
    });
    const utils = render(
        <DespesaContext.Provider value={{verboHttp: "POST"}}>
            <CadastroSaidaForm />
        </DespesaContext.Provider>
    );
    await waitFor(() => expect(screen.queryByTestId("loading")).not.toBeInTheDocument());
    return utils;
};

const LABELS = {
    cpf_cnpj_fornecedor: "CNPJ ou CPF do fornecedor",
    tipo_documento: "Tipo de documento",
    numero_documento: "Número do documento",
    tipo_transacao: "Forma de pagamento",
    valor_original: "Valor total do documento",
};
const campo = (id) => screen.getByLabelText(LABELS[id]);
const digita = (id, value) => fireEvent.change(campo(id), {target: {name: id, value}});
const envia = async () => {
    await act(async () => {
        fireEvent.click(screen.getByRole("button", {name: "Salvar"}));
    });
};

describe("CadastroSaidaForm - envio e remoção", () => {
    beforeEach(() => {
        jest.spyOn(console, "log").mockImplementation(() => {});
        valida_cpf_cnpj.mockReturnValue(true);
        criarDespesa.mockResolvedValue({status: 201, data: {uuid: "d1"}});
        alterarDespesa.mockResolvedValue({status: 200});
        deleteDespesa.mockResolvedValue({});
        patchAtrelarSaidoDoRecurso.mockResolvedValue({});
    });
    afterEach(() => jest.restoreAllMocks());

    describe("criação", () => {
        it("cria a despesa, atrela a saída ao recurso e volta para a lista", async () => {
            await renderiza();
            digita("cpf_cnpj_fornecedor", "12345678901");
            await envia();
            await waitFor(() => expect(aux.getPath).toHaveBeenCalled());
            const payload = criarDespesa.mock.calls[0][0];
            expect(payload.rateios[0]).toMatchObject({
                acao_associacao: "acao-uuid",
                conta_associacao: "conta-uuid",
                valor_original: 100,
                valor_rateio: 100,
            });
            expect(validaPayloadDespesas).toHaveBeenCalled();
            expect(patchAtrelarSaidoDoRecurso).toHaveBeenCalledWith("r1", "d1");
        });

        it("não navega quando a API não retorna 201", async () => {
            criarDespesa.mockResolvedValue({status: 400});
            await renderiza();
            digita("cpf_cnpj_fornecedor", "12345678901");
            await envia();
            await waitFor(() => expect(criarDespesa).toHaveBeenCalled());
            expect(aux.getPath).not.toHaveBeenCalled();
            expect(screen.getByRole("button", {name: "Salvar"})).toBeInTheDocument();
        });

        it("trata exceção ao criar", async () => {
            criarDespesa.mockRejectedValue(new Error("x"));
            await renderiza();
            digita("cpf_cnpj_fornecedor", "12345678901");
            await envia();
            await waitFor(() => expect(screen.getByRole("button", {name: "Salvar"})).toBeInTheDocument());
            expect(aux.getPath).not.toHaveBeenCalled();
        });

        it("não navega se falhar ao atrelar a saída ao recurso", async () => {
            patchAtrelarSaidoDoRecurso.mockRejectedValue({response: {data: "erro"}});
            await renderiza();
            digita("cpf_cnpj_fornecedor", "12345678901");
            await envia();
            await waitFor(() => expect(patchAtrelarSaidoDoRecurso).toHaveBeenCalled());
            expect(aux.getPath).not.toHaveBeenCalled();
        });

        it("bloqueia o envio e mostra erro com CPF/CNPJ inválido", async () => {
            valida_cpf_cnpj.mockReturnValue(false);
            await renderiza();
            digita("cpf_cnpj_fornecedor", "1");
            await envia();
            expect(await screen.findByText("Digite um CPF ou um CNPJ válido")).toBeInTheDocument();
            expect(criarDespesa).not.toHaveBeenCalled();
        });

        it("bloqueia o envio sem CPF/CNPJ", async () => {
            await renderiza();
            await envia();
            expect(criarDespesa).not.toHaveBeenCalled();
        });

        it("exige número do documento quando o tipo é digitado", async () => {
            await renderiza();
            digita("cpf_cnpj_fornecedor", "12345678901");
            fireEvent.change(campo("tipo_documento"), {target: {name: "tipo_documento", value: "1"}});
            await envia();
            expect(await screen.findByText("Número do documento é obrigatório")).toBeInTheDocument();
            expect(criarDespesa).not.toHaveBeenCalled();
        });

        it("não aceita letras no número do documento", async () => {
            await renderiza();
            digita("numero_documento", "12");
            digita("numero_documento", "12a");
            expect(campo("numero_documento")).toHaveValue("12");
        });
    });

    describe("valores distintos entre crédito e saída", () => {
        it("pede confirmação e só salva ao confirmar", async () => {
            await renderiza();
            digita("cpf_cnpj_fornecedor", "12345678901");
            digita("valor_original", "50");
            await envia();
            expect(ModalConfirm).toHaveBeenCalledWith(expect.objectContaining({
                title: "Valores distintos",
                confirmText: "Sim",
                cancelText: "Não",
            }));
            expect(criarDespesa).not.toHaveBeenCalled();
            await act(async () => {
                ModalConfirm.mock.calls[0][0].onConfirm();
            });
            await waitFor(() => expect(criarDespesa).toHaveBeenCalled());
        });
    });

    describe("edição", () => {
        const respEdicao = () => receita({
            saida_do_recurso: {
                valor_ptrf: "100",
                valor_total: "100",
                cpf_cnpj_fornecedor: "12345678901",
                tipo_documento: {id: 1},
                numero_documento: "abc",
                tipo_transacao: {id: 1},
                rateios: [{}],
            },
        });
        const renderEdicao = () => renderiza({params: {uuid_receita: "r1", uuid_despesa: "d9"}, resp: respEdicao()});

        it("atrela a saída ao carregar e exibe documento de transação", async () => {
            await renderEdicao();
            expect(patchAtrelarSaidoDoRecurso).toHaveBeenCalledWith("r1", "d9");
            await waitFor(() => expect(aux.exibeDocumentoTransacao).toHaveBeenCalledWith(1, expect.any(Function), expect.any(Function), expect.anything()));
        });

        it("valida que número do documento deve ser numérico", async () => {
            await renderEdicao();
            await envia();
            expect(await screen.findByText("Este campo deve conter apenas algarismos numéricos.")).toBeInTheDocument();
            expect(alterarDespesa).not.toHaveBeenCalled();
        });

        it("altera a despesa e volta para a lista", async () => {
            await renderEdicao();
            digita("numero_documento", "123");
            await envia();
            await waitFor(() => expect(alterarDespesa).toHaveBeenCalledWith(expect.any(Object), "d9"));
            await waitFor(() => expect(aux.getPath).toHaveBeenCalled());
        });

        it("não navega quando a API não retorna 200", async () => {
            alterarDespesa.mockResolvedValue({status: 500});
            await renderEdicao();
            digita("numero_documento", "123");
            await envia();
            await waitFor(() => expect(alterarDespesa).toHaveBeenCalled());
            expect(aux.getPath).not.toHaveBeenCalled();
        });

        it("trata exceção ao alterar", async () => {
            alterarDespesa.mockRejectedValue(new Error("x"));
            await renderEdicao();
            digita("numero_documento", "123");
            await envia();
            await waitFor(() => expect(alterarDespesa).toHaveBeenCalled());
            expect(aux.getPath).not.toHaveBeenCalled();
        });

        it("exclui a despesa pelo modal e volta para a lista", async () => {
            await renderEdicao();
            fireEvent.click(screen.getByRole("button", {name: "Deletar"}));
            fireEvent.click(await screen.findByRole("button", {name: "Sim"}));
            await waitFor(() => expect(deleteDespesa).toHaveBeenCalledWith("d9"));
            await waitFor(() => expect(aux.getPath).toHaveBeenCalled());
        });

        it("não navega quando a exclusão falha", async () => {
            deleteDespesa.mockRejectedValue(new Error("x"));
            await renderEdicao();
            fireEvent.click(screen.getByRole("button", {name: "Deletar"}));
            fireEvent.click(await screen.findByRole("button", {name: "Sim"}));
            await waitFor(() => expect(deleteDespesa).toHaveBeenCalled());
            expect(aux.getPath).not.toHaveBeenCalled();
        });
    });

    describe("interações de campo", () => {
        it("blur do CNPJ consulta a razão social", async () => {
            await renderiza();
            digita("cpf_cnpj_fornecedor", "12345678901");
            fireEvent.blur(campo("cpf_cnpj_fornecedor"));
            expect(aux.get_nome_razao_social).toHaveBeenCalledWith("12345678901", expect.any(Function));
        });

        it("alterar valor do documento atualiza o valor realizado", async () => {
            await renderiza();
            digita("valor_original", "70");
            expect(aux.setValorRealizado).toHaveBeenCalledWith(expect.any(Function), "70");
        });

        it("forma de pagamento aciona exibeDocumentoTransacao", async () => {
            await renderiza();
            fireEvent.change(campo("tipo_transacao"), {target: {name: "tipo_transacao", value: "1"}});
            expect(aux.exibeDocumentoTransacao).toHaveBeenCalledWith("1", expect.any(Function), expect.any(Function), expect.anything());
        });

        it("Cancelar volta para a lista", async () => {
            await renderiza();
            fireEvent.click(screen.getByRole("button", {name: "Cancelar"}));
            expect(aux.getPath).toHaveBeenCalled();
        });
    });
});
