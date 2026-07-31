import {useDespesaSubmit} from "./useDespesaSubmit";
import {useCadeiaModais} from "./useCadeiaModais";

/**
 * Compat: une submit + cadeia de modais.
 */
export const useFluxoSalvarDespesa = (deps) => {
    const {onSubmit, onSubmitRef, handleErroCriarDespesa} = useDespesaSubmit(deps);
    const {
        serviceIniciaEncadeamentoDosModais,
        serviceSubmitModais,
        validaMotivosPagamentoAntecipado,
    } = useCadeiaModais({...deps, onSubmitRef});

    return {
        onSubmit,
        handleErroCriarDespesa,
        serviceIniciaEncadeamentoDosModais,
        serviceSubmitModais,
        validaMotivosPagamentoAntecipado,
    };
};
