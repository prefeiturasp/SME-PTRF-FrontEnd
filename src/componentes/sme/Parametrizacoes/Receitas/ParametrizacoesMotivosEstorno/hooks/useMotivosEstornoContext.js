import { useContext } from "react";
import { MotivosEstornoContext } from "../context/MotivosEstorno";

/**
 * Hook personalizado para acessar o contexto de MotivosEstorno.
 * Facilita o acesso às propriedades e funções do contexto em componentes filhos.
 * @returns {object} O contexto de MotivosEstorno.
 * @throws {Error} Se o hook for usado fora de um MotivosEstornoProvider.
 */
export const useMotivosEstornoContext = () => {
    const context = useContext(MotivosEstornoContext);

    if (!context) {
        throw new Error(
            "useMotivosEstornoContext deve ser usado dentro de um MotivosEstornoProvider",
        );
    }

    return context;
};
