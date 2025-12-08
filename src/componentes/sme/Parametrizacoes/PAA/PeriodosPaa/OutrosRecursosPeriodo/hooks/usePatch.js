import { useMutation } from "@tanstack/react-query";
import { patchOutroRecursoPeriodoPaa } from "../../../../../../../services/sme/Parametrizacoes.service";

export const usePatchOutroRecursoPeriodo = () => {

    return useMutation({
        mutationFn: ({uuid, payload}) => {
            return patchOutroRecursoPeriodoPaa(uuid, payload)
        },
    })
}