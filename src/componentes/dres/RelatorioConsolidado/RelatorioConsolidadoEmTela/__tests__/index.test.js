import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useParams } from "react-router-dom";
import { RelatorioConsolidadoEmTela } from "../index";
import * as svc from "../../../../../services/dres/RelatorioConsolidado.service";
import { auxGetNomes } from "../../auxGetNomes";
import { visoesService } from "../../../../../services/visoes.service";
import { toastCustom } from "../../../../Globais/ToastCustom";

jest.mock("react-router-dom", () => ({ useParams: jest.fn() }));
jest.mock("../../../../../services/dres/RelatorioConsolidado.service", () => ({
    getExecucaoFinanceira: jest.fn(),
    postJustificativa: jest.fn(),
    patchJustificativa: jest.fn(),
    getConsolidadoDrePorUuid: jest.fn(),
}));
jest.mock("../../auxGetNomes", () => ({ auxGetNomes: { nomePeriodo: jest.fn() } }));
jest.mock("../../../../../services/visoes.service", () => ({
    visoesService: { getItemUsuarioLogado: jest.fn(), getPermissoes: jest.fn() },
}));
jest.mock("../../../../../utils/Loading", () => () => <div data-testid="loading" />);
jest.mock("../../../../Globais/ToastCustom", () => ({
    toastCustom: { ToastCustomSuccess: jest.fn() },
}));
jest.mock("../../../../../context/RecursoSelecionado", () => ({
    useRecursoSelecionadoContext: () => ({ recursoSelecionado: null }),
}));

const execucao = (extra = {}) => ({
    titulo_parcial: "Parcial X",
    existe_lancamentos_devolucao_ao_tesouro: true,
    por_tipo_de_conta: [
        {
            tipo_conta: "Cheque",
            tipo_conta_uuid: "c1",
            justificativa_uuid: "j1",
            justificativa_texto: "texto",
            eh_retificacao: false,
            valores: { repasses_previstos_sme_custeio: 1, repasses_no_periodo_custeio: 2 },
        },
        {
            tipo_conta: "Cartão",
            tipo_conta_uuid: "c2",
            justificativa_uuid: "",
            justificativa_texto: "",
            valores: { repasses_previstos_sme_custeio: 1, repasses_no_periodo_custeio: 2 },
        },
    ],
    ...extra,
});

const renderar = async () => {
    await act(async () => {
        render(<RelatorioConsolidadoEmTela />);
    });
};

describe("RelatorioConsolidadoEmTela", () => {
    beforeEach(() => {
        jest.spyOn(console, "log").mockImplementation(() => {});
        useParams.mockReturnValue({ periodo_uuid: "p1", conta_uuid: "c1", ja_publicado: "false", consolidado_dre_uuid: "null" });
        visoesService.getItemUsuarioLogado.mockReturnValue("dre-uuid");
        visoesService.getPermissoes.mockReturnValue(true);
        auxGetNomes.nomePeriodo.mockResolvedValue("2024.1");
        svc.getExecucaoFinanceira.mockResolvedValue(execucao());
        svc.getConsolidadoDrePorUuid.mockResolvedValue({ eh_retificacao: true });
        svc.patchJustificativa.mockResolvedValue({});
        svc.postJustificativa.mockResolvedValue({});
    });
    afterEach(() => jest.restoreAllMocks());

    it("mostra loading enquanto carrega", async () => {
        svc.getExecucaoFinanceira.mockReturnValue(new Promise(() => {}));
        await renderar();
        expect(screen.getByTestId("loading")).toBeInTheDocument();
    });

    it("renderiza topo e uma tabela por conta (prévia)", async () => {
        await renderar();
        await waitFor(() => expect(screen.getByText("Período: 2024.1 (Prévia)")).toBeInTheDocument());
        expect(screen.getByText("Parcial X")).toBeInTheDocument();
        expect(screen.getByText("Execução Financeira - Conta Cheque")).toBeInTheDocument();
        expect(screen.getByText("Execução Financeira - Conta Cartão")).toBeInTheDocument();
        expect(svc.getExecucaoFinanceira).toHaveBeenCalledWith("dre-uuid", "p1", "");
        expect(svc.getConsolidadoDrePorUuid).not.toHaveBeenCalled();
        expect(screen.getAllByText("Devolução para o tesouro")).toHaveLength(2);
    });

    it("com consolidado uuid e publicado carrega consolidado", async () => {
        useParams.mockReturnValue({ periodo_uuid: "p1", conta_uuid: "null", ja_publicado: "true", consolidado_dre_uuid: "cd1" });
        await renderar();
        await waitFor(() => expect(screen.getByText("Período: 2024.1")).toBeInTheDocument());
        expect(svc.getConsolidadoDrePorUuid).toHaveBeenCalledWith("cd1");
        expect(svc.getExecucaoFinanceira).toHaveBeenCalledWith("dre-uuid", "p1", "cd1");
        expect(screen.queryByText(/Prévia/)).not.toBeInTheDocument();
    });

    it("sem periodo_uuid não busca nome", async () => {
        useParams.mockReturnValue({ conta_uuid: "c1", ja_publicado: "false", consolidado_dre_uuid: "null" });
        await renderar();
        await waitFor(() => expect(screen.getByText("Parcial X")).toBeInTheDocument());
        expect(auxGetNomes.nomePeriodo).not.toHaveBeenCalled();
    });

    it("trata erro ao carregar execução financeira", async () => {
        svc.getExecucaoFinanceira.mockRejectedValue(new Error("x"));
        await renderar();
        await waitFor(() => expect(screen.queryByTestId("loading")).not.toBeInTheDocument());
        expect(screen.getByText(/Período: 2024.1/)).toBeInTheDocument();
    });

    it("valorTemplate remove R$", async () => {
        svc.getExecucaoFinanceira.mockResolvedValue(
            execucao({
                por_tipo_de_conta: [{ tipo_conta: "Cheque", tipo_conta_uuid: "c1", justificativa_uuid: "j1", justificativa_texto: "t", valores: { saldo_reprogramado_periodo_anterior_custeio: 1234.5 } }],
            })
        );
        await renderar();
        await waitFor(() => expect(screen.getByText(/1\.234,50/)).toBeInTheDocument());
        expect(screen.queryByText(/R\$\s*1/)).not.toBeInTheDocument();
    });

    it("edita e salva justificativa existente via patch (consolidado retificação)", async () => {
        useParams.mockReturnValue({ periodo_uuid: "p1", conta_uuid: "c1", ja_publicado: "false", consolidado_dre_uuid: "cd1" });
        await renderar();
        await waitFor(() => expect(screen.getAllByPlaceholderText(/Escreva aqui/)).toHaveLength(2));
        const [area1] = screen.getAllByPlaceholderText(/Escreva aqui/);
        fireEvent.change(area1, { target: { value: "alterado" } });
        const salvar = screen.getAllByRole("button", { name: "Salvar" })[0];
        expect(salvar).toBeEnabled();
        await act(async () => {
            fireEvent.click(salvar);
        });
        expect(svc.patchJustificativa).toHaveBeenCalledWith("j1", { texto: "alterado", eh_retificacao: true });
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalled();
        expect(screen.getAllByRole("button", { name: "Salvar" })[0]).toBeDisabled();
    });

    it("patch com consolidado nulo usa eh_retificacao false", async () => {
        svc.getConsolidadoDrePorUuid.mockResolvedValue(null);
        useParams.mockReturnValue({ periodo_uuid: "p1", conta_uuid: "c1", ja_publicado: "false", consolidado_dre_uuid: "cd1" });
        await renderar();
        await waitFor(() => expect(screen.getAllByPlaceholderText(/Escreva aqui/)).toHaveLength(2));
        fireEvent.change(screen.getAllByPlaceholderText(/Escreva aqui/)[0], { target: { value: "z" } });
        await act(async () => {
            fireEvent.click(screen.getAllByRole("button", { name: "Salvar" })[0]);
        });
        expect(svc.patchJustificativa).toHaveBeenCalledWith("j1", { texto: "z", eh_retificacao: false });
    });

    it("cria justificativa nova via post sem uuid", async () => {
        await renderar();
        await waitFor(() => expect(screen.getAllByPlaceholderText(/Escreva aqui/)).toHaveLength(2));
        fireEvent.change(screen.getAllByPlaceholderText(/Escreva aqui/)[1], { target: { value: "nova" } });
        await act(async () => {
            fireEvent.click(screen.getAllByRole("button", { name: "Salvar" })[1]);
        });
        expect(svc.postJustificativa).toHaveBeenCalledTimes(1);
        const payload = svc.postJustificativa.mock.calls[0][0];
        expect(payload).not.toHaveProperty("uuid");
        expect(payload).toMatchObject({ tipo_conta: "c2", texto: "nova", dre: "dre-uuid", periodo: "p1" });
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalled();
    });

    it("limpar zera o texto e reabilita salvar", async () => {
        await renderar();
        await waitFor(() => expect(screen.getAllByPlaceholderText(/Escreva aqui/)).toHaveLength(2));
        await act(async () => {
            fireEvent.click(screen.getAllByRole("button", { name: "Limpar" })[0]);
        });
        expect(screen.getAllByPlaceholderText(/Escreva aqui/)[0]).toHaveValue("");
    });

    it("conta não presente em justificativas usa default (conta_uuid ausente)", async () => {
        useParams.mockReturnValue({ periodo_uuid: "p1", conta_uuid: undefined, ja_publicado: "false", consolidado_dre_uuid: "null" });
        svc.getExecucaoFinanceira.mockResolvedValue(execucao({ por_tipo_de_conta: [{ tipo_conta: "Cheque", tipo_conta_uuid: "c9", valores: { repasses_previstos_sme_custeio: 1, repasses_no_periodo_custeio: 2 } }] }));
        await renderar();
        await waitFor(() => expect(screen.getByText("Execução Financeira - Conta Cheque")).toBeInTheDocument());
    });
});
