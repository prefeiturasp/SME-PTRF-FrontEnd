import {renderHook} from "@testing-library/react";
import {useFluxoSalvarDespesa} from "../useFluxoSalvarDespesa";
import {useDespesaSubmit} from "../useDespesaSubmit";
import {useCadeiaModais} from "../useCadeiaModais";

jest.mock("../useDespesaSubmit", () => ({useDespesaSubmit: jest.fn()}));
jest.mock("../useCadeiaModais", () => ({useCadeiaModais: jest.fn()}));

describe("useFluxoSalvarDespesa", () => {
    it("une submit e cadeia de modais repassando onSubmitRef", () => {
        const submit = {onSubmit: jest.fn(), onSubmitRef: {current: 1}, handleErroCriarDespesa: jest.fn()};
        const cadeia = {
            serviceIniciaEncadeamentoDosModais: jest.fn(),
            serviceSubmitModais: jest.fn(),
            validaMotivosPagamentoAntecipado: jest.fn(),
        };
        useDespesaSubmit.mockReturnValue(submit);
        useCadeiaModais.mockReturnValue(cadeia);
        const deps = {a: 1};

        const {result} = renderHook(() => useFluxoSalvarDespesa(deps));

        expect(useDespesaSubmit).toHaveBeenCalledWith(deps);
        expect(useCadeiaModais).toHaveBeenCalledWith({a: 1, onSubmitRef: submit.onSubmitRef});
        expect(result.current).toEqual({
            onSubmit: submit.onSubmit,
            handleErroCriarDespesa: submit.handleErroCriarDespesa,
            ...cadeia,
        });
    });
});
