import { getMotivosEstorno } from "../../../../../../services/sme/Parametrizacoes.service";
import { useQuery } from "@tanstack/react-query";
import { useContext, useMemo } from "react";
import { MotivosEstornoContext } from "../context/MotivosEstorno";

export const useGetMotivosEstorno = () => {
    const {filter} = useContext(MotivosEstornoContext)
    const { isLoading, isError, data = [], error, refetch } = useQuery(
        ['motivos-estorno', filter],
        ()=> getMotivosEstorno(filter.motivo),
        {
            keepPreviousData: true,
            staleTime: 5000, // 5 segundos
            refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
        }
    );

    const count = useMemo(() => data.length, [data]);

    return {isLoading, isError, data, error, refetch, count}

}