import {renderHook, waitFor} from "@testing-library/react";
import {useDespesaTabelas} from "../useDespesaTabelas";
import {getDespesasTabelas, getEspecificacoesPorAplicacao} from "../../../../../../services/escolas/Despesas.service";
import {getUuidAssociacao} from "../../../../../../utils/AssociacaoUtils";
import {metodosAuxiliares} from "../../utils";

jest.mock("../../../../../../services/escolas/Despesas.service", () => ({
    getDespesasTabelas: jest.fn(),
    getEspecificacoesPorAplicacao: jest.fn(),
}));
jest.mock("../../../../../../utils/AssociacaoUtils", () => ({
    getUuidAssociacao: jest.fn(),
}));
jest.mock("../../utils", () => ({
    metodosAuxiliares: {origemAnaliseLancamento: jest.fn()},
}));

describe("useDespesaTabelas", () => {
    beforeEach(() => {
        getDespesasTabelas.mockResolvedValue({tipos_transacao: [1]});
        getEspecificacoesPorAplicacao.mockResolvedValue({custeio_por_tipo: {a: [1]}, capital: [{id: 1}]});
        getUuidAssociacao.mockReturnValue("uuid-local");
        metodosAuxiliares.origemAnaliseLancamento.mockReturnValue(false);
    });

    it("carrega tabelas e especificações e finaliza loading", async () => {
        const {result} = renderHook(() => useDespesaTabelas({}));
        expect(result.current.loading).toBe(true);
        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(getDespesasTabelas).toHaveBeenCalledWith();
        expect(result.current.despesasTabelas).toEqual({tipos_transacao: [1]});
        expect(result.current.especificacoes_custeio).toEqual({a: [1]});
        expect(result.current.especificaoes_capital).toEqual([{id: 1}]);
    });

    it("usa uuid_associacao do location quando origem é análise de lançamento", async () => {
        metodosAuxiliares.origemAnaliseLancamento.mockReturnValue(true);
        const parametroLocation = {state: {uuid_associacao: "uuid-loc"}};
        const {result} = renderHook(() => useDespesaTabelas({parametroLocation}));
        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(getDespesasTabelas).toHaveBeenCalledWith("uuid-loc");
    });

    it("usa uuid da associação selecionada quando vem de situação patrimonial na visão DRE", async () => {
        const {result} = renderHook(() =>
            useDespesaTabelas({veioDeSituacaoPatrimonial: true, visao_selecionada: "DRE"})
        );
        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(getDespesasTabelas).toHaveBeenCalledWith("uuid-local");
    });

    it("não usa uuid da associação se visão não é DRE", async () => {
        const {result} = renderHook(() =>
            useDespesaTabelas({veioDeSituacaoPatrimonial: true, visao_selecionada: "UE"})
        );
        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(getDespesasTabelas).toHaveBeenCalledWith();
    });

    it("usa fallbacks quando especificações vêm vazias", async () => {
        getEspecificacoesPorAplicacao.mockResolvedValue(undefined);
        const {result} = renderHook(() => useDespesaTabelas({}));
        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.especificacoes_custeio).toEqual({});
        expect(result.current.especificaoes_capital).toEqual([]);
    });
});
