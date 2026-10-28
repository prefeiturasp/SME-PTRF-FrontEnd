import {renderHook} from "@testing-library/react";
import {useDispatch} from "react-redux";
import {useMutationDespesaConfirmavel} from "../useMutationDespesaConfirmavel";
import {criarDespesa, alterarDespesa} from "../../../../../../services/escolas/Despesas.service";
import {useMutationConfirmavel} from "../../../../../../hooks/Globais/useMutationConfirmavel";

jest.mock("react-redux", () => ({useDispatch: jest.fn()}));
jest.mock("../../../../../../services/escolas/Despesas.service", () => ({
    criarDespesa: jest.fn(),
    alterarDespesa: jest.fn(),
}));
jest.mock("../../../../../../hooks/Globais/useMutationConfirmavel", () => ({
    useMutationConfirmavel: jest.fn(),
}));

describe("useMutationDespesaConfirmavel", () => {
    let configs;
    let onSuccess, onError, setLoading, setBtn;

    const setup = (...args) => {
        const a = args.length ? args : [onSuccess, onError, setLoading, setBtn];
        renderHook(() => useMutationDespesaConfirmavel(...a));
        return {create: configs[0], update: configs[1]};
    };

    beforeEach(() => {
        configs = [];
        useDispatch.mockReturnValue("dispatch-mock");
        onSuccess = jest.fn();
        onError = jest.fn();
        setLoading = jest.fn();
        setBtn = jest.fn();
        useMutationConfirmavel.mockImplementation((cfg) => {
            configs.push(cfg);
            return {mutate: jest.fn()};
        });
    });

    it("retorna mutationCreate e mutationUpdate", () => {
        const {result} = renderHook(() => useMutationDespesaConfirmavel(onSuccess, onError));
        expect(result.current.mutationCreate).toBeDefined();
        expect(result.current.mutationUpdate).toBeDefined();
        expect(configs[0].dispatch).toBe("dispatch-mock");
        expect(configs[0].errorField).toBe("confirmar");
        expect(configs[0].confirmField).toBe("confirmar_limpeza_prioridades_paa");
        expect(configs[0].modalConfig.isDanger).toBe(true);
    });

    describe("mutationCreate.mutationFn", () => {
        it("retorna response quando status é 201", async () => {
            criarDespesa.mockResolvedValue({status: 201});
            const {create} = setup();
            await expect(create.mutationFn({payload: {a: 1}})).resolves.toEqual({status: 201});
            expect(criarDespesa).toHaveBeenCalledWith({a: 1});
            expect(setLoading).not.toHaveBeenCalled();
        });

        it("lança { response } quando status não é 201", async () => {
            const response = {status: 400};
            criarDespesa.mockResolvedValue(response);
            const {create} = setup();
            await expect(create.mutationFn({payload: {}})).rejects.toEqual({response});
        });

        it("ativa loading quando já confirmado", async () => {
            criarDespesa.mockResolvedValue({status: 201});
            const {create} = setup();
            await create.mutationFn({payload: {confirmar_limpeza_prioridades_paa: true}});
            expect(setLoading).toHaveBeenCalledWith(true);
            expect(setBtn).toHaveBeenCalledWith(true);
        });

        it("não falha sem setters quando já confirmado", async () => {
            criarDespesa.mockResolvedValue({status: 201});
            const {create} = setup(onSuccess, onError);
            await expect(create.mutationFn({payload: {confirmar_limpeza_prioridades_paa: true}})).resolves.toBeDefined();
        });
    });

    describe("mutationUpdate.mutationFn", () => {
        it("retorna response quando status é 200", async () => {
            alterarDespesa.mockResolvedValue({status: 200});
            const {update} = setup();
            await expect(update.mutationFn({payload: {a: 1}, idDespesa: 5})).resolves.toEqual({status: 200});
            expect(alterarDespesa).toHaveBeenCalledWith({a: 1}, 5);
        });

        it("lança { response } quando status não é 200", async () => {
            const response = {status: 500};
            alterarDespesa.mockResolvedValue(response);
            const {update} = setup();
            await expect(update.mutationFn({payload: {}, idDespesa: 5})).rejects.toEqual({response});
        });

        it("ativa loading quando já confirmado", async () => {
            alterarDespesa.mockResolvedValue({status: 200});
            const {update} = setup();
            await update.mutationFn({payload: {confirmar_limpeza_prioridades_paa: true}, idDespesa: 1});
            expect(setLoading).toHaveBeenCalledWith(true);
            expect(setBtn).toHaveBeenCalledWith(true);
        });
    });

    describe.each([["create", 0], ["update", 1]])("modalConfig (%s)", (_, idx) => {
        it("onCancel desativa loading e botão", () => {
            setup();
            configs[idx].modalConfig.onCancel();
            expect(setLoading).toHaveBeenCalledWith(false);
            expect(setBtn).toHaveBeenCalledWith(false);
        });

        it("onConfirm ativa loading e botão", () => {
            setup();
            configs[idx].modalConfig.onConfirm();
            expect(setLoading).toHaveBeenCalledWith(true);
            expect(setBtn).toHaveBeenCalledWith(true);
        });

        it("callbacks são seguros sem setters", () => {
            setup(onSuccess, onError);
            expect(() => {
                configs[idx].modalConfig.onCancel();
                configs[idx].modalConfig.onConfirm();
            }).not.toThrow();
        });

        it("onSuccess repassa a response", () => {
            setup();
            configs[idx].mutationOptions.onSuccess({status: 1});
            expect(onSuccess).toHaveBeenCalledWith({status: 1});
        });

        it("onSuccess tolera ausência do callback", () => {
            setup(undefined, undefined);
            expect(() => configs[idx].mutationOptions.onSuccess({})).not.toThrow();
        });

        it("onError repassa error.response", () => {
            setup();
            configs[idx].mutationOptions.onError({response: {data: {}}}, {});
            expect(onError).toHaveBeenCalledWith({data: {}});
        });

        it("onError repassa o próprio erro se não houver response", () => {
            setup();
            const err = new Error("x");
            configs[idx].mutationOptions.onError(err, {});
            expect(onError).toHaveBeenCalledWith(err);
        });

        it("onError não é chamado quando a API pede confirmação", () => {
            setup();
            configs[idx].mutationOptions.onError({response: {data: {confirmar: ["ok?"]}}}, {});
            expect(onError).not.toHaveBeenCalled();
        });

        it("onError tolera ausência do callback", () => {
            setup(onSuccess, undefined);
            expect(() => configs[idx].mutationOptions.onError(new Error("x"), {})).not.toThrow();
        });
    });
});
