import { useMutation } from "@tanstack/react-query";
import {
    patchOutroRecursoPeriodoPaa,
    patchDesativarOutroRecursoPeriodoPaa
} from "../../../../../../../services/sme/Parametrizacoes.service";

export const usePatchOutroRecursoPeriodo = () => {

    return useMutation({
        mutationFn: ({uuid, payload}) => {
            return patchOutroRecursoPeriodoPaa(uuid, payload)
        },
    })
}

export const usePatchDesativarOutroRecursoPeriodo = () => {

    return useMutation({
        mutationFn: ({uuid}) => {
            return patchDesativarOutroRecursoPeriodoPaa(uuid)
        },
    })
}